import CryptoJS from "crypto-js";

/* ===================== CONFIG (unchanged from original) ===================== */
export const SHARED_SECRET = "VaraKhata_S3cur3_2026!@#";
export const API_URL = "https://varakhata.jabedinternational.com/api/subscription/subscribe/";
export const PAYMENT_NUMBER = "01944557101";

export const PLANS = {
    starter: {
        name: "Starter", icon: "🚀", duration: "30 days subscription",
        price: "৳500", amount: 500, id: 1,
        perDay: "≈ ৳16.7 / day",
        features: [
            "Basic dashboard", "Rent collection system", "Manual invoice generation",
            "Single building management", "Basic tenant list", "Email notifications",
            "Monthly summary report",
        ],
    },
    pro: {
        name: "Pro", icon: "⭐", duration: "30 days subscription",
        price: "৳1,200", amount: 1200, id: 2,
        perDay: "≈ ৳40.0 / day", popular: true,
        features: [
            "Multi-building management", "Advanced rent tracking",
            "Expense tracking & categorization", "Automated receipts",
            "Downloadable reports (PDF/Excel)", "Tenant history tracking",
            "Payment reminders (SMS/Email)", "Role-based access",
        ],
    },
    "pro-yearly": {
        name: "Pro Yearly", icon: "💎", duration: "365 days subscription",
        price: "৳12,000", amount: 12000, id: 3,
        perDay: "≈ ৳32.9 / day", save: "Save ৳2,400 / year",
        features: [
            "Everything in Pro", "2 months free pricing benefit", "Priority support",
            "Advanced analytics dashboard", "Auto daily backup + restore history",
            "Unlimited report exports", "API access", "Bulk notifications (SMS/WhatsApp)",
            "Audit logs", "Custom invoice branding", "Early access to new features",
        ],
    },
};

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