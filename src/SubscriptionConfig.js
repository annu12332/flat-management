import CryptoJS from "crypto-js";

/* ===================== CONFIG ===================== */
export const SHARED_SECRET = "RentBook_S3cur3_2026!@#";
export const API_URL = "https://varakhata.jabedinternational.com/api/subscription/subscribe";
export const PAYMENT_NUMBER = "01944557101";

/* ===================== Key derivation strategies (for diagnosis) =====================
   We don't have access to the backend source, so we can't be 100% sure which key
   derivation it actually uses. The two live sig/ts pairs tested both decrypt to
   garbage even though ciphertext length math is correct — meaning the AES key
   bytes almost certainly don't match. These are the 3 most common ways a 32-byte
   AES-256 key gets derived from a short passphrase; we try all 3 and log each
   result so you can see by eye which one produces a real token. */
function deriveKeyCandidates(sharedSecret) {
    const secretBytes = new TextEncoder().encode(sharedSecret);

    // Strategy A: raw UTF-8 bytes, zero-padded/truncated to 32 (current assumption)
    const zeroPadded = new Uint8Array(32);
    secretBytes.forEach((b, i) => { if (i < 32) zeroPadded[i] = b; });

    // Strategy B: SHA-256 hash of the secret (standard way to turn any passphrase
    // into exactly 32 bytes — very common in real-world AES-256 implementations)
    const sha256Hex = CryptoJS.SHA256(sharedSecret).toString(CryptoJS.enc.Hex);
    const sha256Bytes = Uint8Array.from(
        sha256Hex.match(/.{1,2}/g).map((h) => parseInt(h, 16))
    );

    // Strategy C: repeat/tile the secret bytes to fill 32 bytes instead of
    // zero-padding (some implementations do this instead of padding with 0x00)
    const tiled = new Uint8Array(32);
    for (let i = 0; i < 32; i++) tiled[i] = secretBytes[i % secretBytes.length];

    return [
        { name: "A: zero-padded raw bytes", bytes: zeroPadded },
        { name: "B: SHA-256(secret)", bytes: sha256Bytes },
        { name: "C: tiled/repeated raw bytes", bytes: tiled },
    ];
}

function tryDecryptWithKey(keyBytes, ivBytes, encryptedBytes) {
    const key = CryptoJS.lib.WordArray.create(keyBytes);
    const iv = CryptoJS.lib.WordArray.create(ivBytes);
    const ciphertext = CryptoJS.lib.WordArray.create(encryptedBytes);
    try {
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext },
            key,
            { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
        );
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        return null; // threw (e.g. "Malformed UTF-8 data")
    }
}

/** Looks like "<anything>|<digits>" ending in a plausible unix timestamp */
function looksLikeValidToken(message, expectedTs) {
    if (!message) return false;
    const idx = message.lastIndexOf("|");
    if (idx === -1) return false;
    const tsPart = message.slice(idx + 1);
    if (!/^\d+$/.test(tsPart)) return false;
    return parseInt(tsPart, 10) === Number(expectedTs);
}

/* ===================== Token decryption ===================== */
export function decryptSubscriptionUrl(sig, ts, sharedSecret) {
    const MAX_AGE_SECONDS = 30 * 60; // 30 minutes
    const CLOCK_SKEW_TOLERANCE = 60; // allow up to 60s of "future" timestamp

    console.log("[decryptSubscriptionUrl] --- START ---");
    console.log("[decryptSubscriptionUrl] raw sig:", sig);
    console.log("[decryptSubscriptionUrl] raw ts:", ts, typeof ts);

    // Rebuild IV from the timestamp (this part is verified correct against
    // both live sig/ts pairs — 64-byte ciphertext = exactly what 62-char
    // plaintext pads to, so IV/base64 handling is not the issue)
    const tsStr = ts.toString().padStart(16, "0");
    const ivStr = tsStr.slice(-16);
    const ivBytes = new TextEncoder().encode(ivStr);

    // Restore base64url -> base64 padding before decoding
    let padded = sig.replace(/-/g, "+").replace(/_/g, "/");
    while (padded.length % 4 !== 0) {
        padded += "=";
    }
    const encryptedBytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
    console.log("[decryptSubscriptionUrl] encryptedBytes length:", encryptedBytes.length);

    // ---- DIAGNOSTIC: try all 3 key-derivation strategies, log every result ----
    const candidates = deriveKeyCandidates(sharedSecret);
    let winningToken = null;

    for (const candidate of candidates) {
        const result = tryDecryptWithKey(candidate.bytes, ivBytes, encryptedBytes);
        const valid = looksLikeValidToken(result, ts);
        console.log(
            `[decryptSubscriptionUrl][DIAG] ${candidate.name} ->`,
            JSON.stringify(result),
            valid ? "✅ LOOKS VALID" : "❌"
        );
        if (valid && !winningToken) {
            winningToken = result.slice(0, result.lastIndexOf("|"));
            console.log(`[decryptSubscriptionUrl][DIAG] >>> "${candidate.name}" is the correct key derivation. Use this strategy in production and remove the others. <<<`);
        }
    }

    if (!winningToken) {
        console.log("[decryptSubscriptionUrl] ERROR: none of the 3 key strategies produced a valid token — the shared secret string itself likely doesn't match the backend's. Check for trailing whitespace, quotes in .env, or the '!' character being mangled by shell history expansion if the secret was ever exported via a bare `export` command.");
        throw new Error(
            "Malformed decrypted payload — key derivation doesn't match the backend's encryption (see [DIAG] logs above)."
        );
    }

    const token = winningToken;
    const embeddedTs = Number(ts); // already validated equal by looksLikeValidToken

    // Expiry / clock-skew check
    const now = Math.floor(Date.now() / 1000);
    const age = now - embeddedTs;
    console.log("[decryptSubscriptionUrl] now:", now, "age(sec):", age, "maxAge:", MAX_AGE_SECONDS, "skewTolerance:", CLOCK_SKEW_TOLERANCE);

    if (age > MAX_AGE_SECONDS || age < -CLOCK_SKEW_TOLERANCE) {
        console.log("[decryptSubscriptionUrl] ERROR: expired or invalid timestamp");
        throw new Error("Signature expired or invalid timestamp");
    }

    console.log("[decryptSubscriptionUrl] SUCCESS — token:", token);
    console.log("[decryptSubscriptionUrl] --- END ---");
    return token;
}