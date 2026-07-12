import CryptoJS from "crypto-js";

/* ===================== CONFIG ===================== */
export const SHARED_SECRET = "RentBook_S3cur3_2026!@#";
export const API_URL = "https://varakhata.jabedinternational.com/api/subscription/subscribe/";
export const PAYMENT_NUMBER = "01944557101";

/* ===================== Token decryption =====================
   Ported to match the PRODUCTION Dart/Flutter implementation exactly
   (decryptSubscriptionSig in the mobile app). Two things were wrong
   in the previous JS version:
     1. Message format is "token|timestamp" (2 parts), not 3 — parsing
        must use split('|') with an exact-length check, not lastIndexOf.
     2. Expiry window is 30 minutes (1800s), not 5 minutes (300s).
   Also added the timestamp-tampering check the Dart version has
   (the embedded timestamp inside the ciphertext must match the ?ts=
   query param — catches someone reusing an old sig with a new ts). */
export function decryptSubscriptionUrl(sig, ts, sharedSecret) {
    const MAX_AGE_SECONDS = 30 * 60; // 30 minutes — matches Dart maxAgeSeconds
    const CLOCK_SKEW_TOLERANCE = 60; // allow up to 60s of "future" timestamp

    // 1. Rebuild the same 32-byte AES-256 key (raw UTF-8 bytes, zero-padded)
    const keyBytes = new Uint8Array(32);
    const secretBytes = new TextEncoder().encode(sharedSecret);
    secretBytes.forEach((b, i) => {
        if (i < 32) keyBytes[i] = b;
    });

    // 2. Rebuild the same deterministic IV from the timestamp
    const tsStr = ts.toString().padStart(16, "0");
    const ivStr = tsStr.slice(-16);
    const ivBytes = new TextEncoder().encode(ivStr);

    // 3. Restore base64url -> base64 padding before decoding (Dart does this too)
    let padded = sig.replace(/-/g, "+").replace(/_/g, "/");
    while (padded.length % 4 !== 0) {
        padded += "=";
    }
    const encryptedBytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));

    // 4. CryptoJS format
    const key = CryptoJS.lib.WordArray.create(keyBytes);
    const iv = CryptoJS.lib.WordArray.create(ivBytes);
    const ciphertext = CryptoJS.lib.WordArray.create(encryptedBytes);

    // 5. AES-256-CBC decrypt
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext },
        key,
        { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    const message = decrypted.toString(CryptoJS.enc.Utf8);

    // 6. Split into EXACTLY 2 parts — "token|timestamp" (matches Dart's
    //    `parts.length != 2` check). If this ever produces something
    //    other than 2 parts, the key/IV/ciphertext don't match — treat
    //    it the same as Dart's FormatException.
    const parts = message.split("|");
    if (parts.length !== 2) {
        throw new Error(
            "Malformed decrypted payload — key or IV derivation doesn't match the backend's encryption."
        );
    }
    const token = parts[0];
    const embeddedTs = parseInt(parts[1], 10);

    // 7. Tampering check — the timestamp baked into the ciphertext must
    //    match the ?ts= query param (matches Dart's embeddedTs check).
    if (embeddedTs !== Number(ts)) {
        throw new Error("Timestamp mismatch — possible tampering");
    }

    // 8. Expiry / clock-skew check — 30 minutes, matching Dart exactly.
    const now = Math.floor(Date.now() / 1000);
    if (now - embeddedTs > MAX_AGE_SECONDS || now - embeddedTs < -CLOCK_SKEW_TOLERANCE) {
        throw new Error("Signature expired or invalid timestamp");
    }

    return token;
}