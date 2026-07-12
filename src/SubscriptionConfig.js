import CryptoJS from "crypto-js";

/* ===================== CONFIG (unchanged from original) ===================== */
export const SHARED_SECRET = "RentBook_S3cur3_2026!@#";
export const API_URL = "https://varakhata.jabedinternational.com/api/subscription/subscribe/";
export const PAYMENT_NUMBER = "01944557101";



/* ===================== Token decryption (unchanged logic) ===================== */
export function decryptSubscriptionUrl(sig, ts, sharedSecret) {
    const keyBytes = new Uint8Array(32);
    const secretBytes = new TextEncoder().encode(sharedSecret);
    secretBytes.forEach((b, i) => {
        if (i < 32) keyBytes[i] = b;
    });

    const tsStr = ts.toString().padStart(16, "0");
    const ivStr = tsStr.slice(-16);
    const ivBytes = new TextEncoder().encode(ivStr);

    const b64 = sig.replace(/-/g, "+").replace(/_/g, "/");
    const encryptedBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

    const key = CryptoJS.lib.WordArray.create(keyBytes);
    const iv = CryptoJS.lib.WordArray.create(ivBytes);
    const ciphertext = CryptoJS.lib.WordArray.create(encryptedBytes);

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext },
        key,
        { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    const message = decrypted.toString(CryptoJS.enc.Utf8);

    const lastPipe = message.lastIndexOf("|");
    const token = message.substring(0, lastPipe);
    const msgTs = parseInt(message.substring(lastPipe + 1), 10);

    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - msgTs) > 300) {
        throw new Error("URL expired");
    }
    return token;
}