import CryptoJS from "crypto-js";

/* ===================== CONFIG ===================== */
export const SHARED_SECRET = "RentBook_S3cur3_2026!@#";
export const API_URL = "https://varakhata.jabedinternational.com/api/subscription/subscribe/";
export const PAYMENT_NUMBER = "01944557101";

export function decryptSubscriptionUrl(sig, ts, sharedSecret) {
    const MAX_AGE_SECONDS = 30 * 60; // 30 minutes
    const CLOCK_SKEW_TOLERANCE = 60; // 60s future tolerance

    try {
        // 1. Rebuild 32-byte AES key (Dart byte conversion dynamic structure)
        const keyBytes = new Uint8Array(32);
        const secretBytes = new TextEncoder().encode(sharedSecret);
        secretBytes.forEach((b, i) => {
            if (i < 32) keyBytes[i] = b;
        });

        // 2. Rebuild deterministic IV from timestamp (Last 16 digits)
        const tsStr = ts.toString().padStart(16, "0");
        const ivStr = tsStr.slice(-16);
        const ivBytes = new TextEncoder().encode(ivStr);

        // 3. Restore base64url -> base64 padding
        let padded = sig.replace(/-/g, "+").replace(/_/g, "/");
        while (padded.length % 4 !== 0) {
            padded += "=";
        }
        
        // 4. Proper TypedArray to WordArray Conversion for CryptoJS
        // Direct Uint8Array matching for word blocks
        const key = CryptoJS.lib.WordArray.create(keyBytes);
        const iv = CryptoJS.lib.WordArray.create(ivBytes);
        
        // Base64 parsing via CryptoJS is safer than atob for UTF-8 compatibility
        const ciphertext = CryptoJS.enc.Base64.parse(padded);

        // 5. AES-256-CBC decrypt
        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: ciphertext },
            key,
            { 
                iv: iv, 
                mode: CryptoJS.mode.CBC, 
                padding: CryptoJS.pad.Pkcs7 // Ensure Dart app also uses PKCS7
            }
        );

        // Safely catch conversion error if bytes are garbage (malformed)
        let message;
        try {
            message = decrypted.toString(CryptoJS.enc.Utf8);
            if (!message) {
                throw new Error("Decrypted string is empty. Wrong Key/IV assumed.");
            }
        } catch (e) {
            throw new Error("Malformed decrypted payload — Cryptographic key/IV mismatch or corrupted signature.");
        }

        // 6. Split into EXACTLY 2 parts
        const parts = message.split("|");
        if (parts.length !== 2) {
            throw new Error("Malformed decrypted payload — Structure is not token|timestamp.");
        }
        
        const token = parts[0];
        const embeddedTs = parseInt(parts[1], 10);

        // 7. Tampering check
        if (embeddedTs !== Number(ts)) {
            throw new Error("Timestamp mismatch — possible tampering");
        }

        // 8. Expiry / clock-skew check
        const now = Math.floor(Date.now() / 1000);
        if (now - embeddedTs > MAX_AGE_SECONDS || now - embeddedTs < -CLOCK_SKEW_TOLERANCE) {
            throw new Error("Signature expired or invalid timestamp");
        }

        return token;

    } catch (error) {
        // Log the exact error gracefully instead of breaking the flow hard
        console.error("[PaymentPage debug] Token decrypt failed:", error.message);
        return null; // Token fallback trigger korbe safely
    }
}