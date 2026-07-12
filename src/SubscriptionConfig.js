import CryptoJS from "crypto-js";

/* ===================== CONFIG ===================== */
export const SHARED_SECRET = "RentBook_S3cur3_2026!@#";
export const API_URL = "https://varakhata.jabedinternational.com/api/subscription/subscribe/";
export const PAYMENT_NUMBER = "01944557101";

/* ===================== Token decryption (TEMP DEBUG BUILD) =====================
   This logs every intermediate byte/value so we can see exactly where the
   frontend's bytes diverge from what the backend expects. Remove all
   console.log lines once the mismatch is found and fixed. */
export function decryptSubscriptionUrl(sig, ts, sharedSecret) {
    // 1. 32-byte key
    const keyBytes = new Uint8Array(32);
    const secretBytes = new TextEncoder().encode(sharedSecret);
    secretBytes.forEach((b, i) => {
        if (i < 32) keyBytes[i] = b;
    });
    console.log("[decrypt debug] sharedSecret:", JSON.stringify(sharedSecret));
    console.log("[decrypt debug] secretBytes.length:", secretBytes.length, "(should be <= 32, ideally exactly 32)");
    console.log("[decrypt debug] keyBytes (hex):", Array.from(keyBytes).map((b) => b.toString(16).padStart(2, "0")).join(""));

    // 2. IV from timestamp
    const tsStr = ts.toString().padStart(16, "0");
    const ivStr = tsStr.slice(-16);
    const ivBytes = new TextEncoder().encode(ivStr);
    console.log("[decrypt debug] raw ts param:", ts, "-> tsStr:", tsStr, "-> ivStr:", ivStr);
    console.log("[decrypt debug] ivBytes.length:", ivBytes.length, "(must be exactly 16)");
    console.log("[decrypt debug] ivBytes (hex):", Array.from(ivBytes).map((b) => b.toString(16).padStart(2, "0")).join(""));

    // 3. decode sig
    const b64 = sig.replace(/-/g, "+").replace(/_/g, "/");
    let encryptedBytes;
    try {
        encryptedBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    } catch (e) {
        console.error("[decrypt debug] atob() failed — sig is not valid base64url:", e.message);
        throw e;
    }
    console.log("[decrypt debug] sig length:", sig.length, "-> decoded ciphertext bytes:", encryptedBytes.length,
        "(should be a multiple of 16 for AES-CBC)");

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

    // Raw decrypted bytes as hex, BEFORE trying to read it as UTF-8 —
    // this tells us if decryption produced garbage regardless of parsing.
    console.log("[decrypt debug] decrypted.sigBytes (word count):", decrypted.sigBytes);
    console.log("[decrypt debug] decrypted raw hex:", decrypted.toString(CryptoJS.enc.Hex));

    const message = decrypted.toString(CryptoJS.enc.Utf8);
    console.log("[decrypt debug] decrypted as UTF-8 string:", JSON.stringify(message));

    const lastPipe = message.lastIndexOf("|");
    console.log("[decrypt debug] lastIndexOf('|'):", lastPipe, "(-1 means no pipe found -> garbage decrypt)");

    const token = message.substring(0, lastPipe);
    const msgTs = parseInt(message.substring(lastPipe + 1), 10);
    console.log("[decrypt debug] parsed token:", JSON.stringify(token), "parsed msgTs:", msgTs);

    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - msgTs) > 300) {
        console.warn("[decrypt debug] timestamp check failed — now:", now, "msgTs:", msgTs, "diff:", Math.abs(now - msgTs));
        throw new Error("URL expired");
    }
    return token;
}