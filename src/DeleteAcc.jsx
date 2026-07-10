import React, { useState } from "react";
import { Link } from "react-router-dom";

/* NOTE: confirm the exact endpoint/payload shape with backend before shipping —
   this follows the same request pattern as the subscription API. */
const DELETE_ACCOUNT_API_URL =
    "https://varakhata.jabedinternational.com/api/account/delete-request/";

const REASONS = [
    "Not using the app anymore",
    "Switching to another tool",
    "Too expensive",
    "Missing features I need",
    "Privacy concerns",
    "Other",
];

export default function DeleteAccount() {
    const [mobile, setMobile] = useState("");
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [confirmed, setConfirmed] = useState(false);
    const [mobileTouched, setMobileTouched] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const mobileOk = /^01[3-9]\d{8}$/.test(mobile.trim());
    const canSubmit = mobileOk && reason && confirmed && !submitting;

    const handleSubmit = async () => {
        setMobileTouched(true);
        setErrorMsg("");
        if (!mobileOk || !reason || !confirmed) return;

        setSubmitting(true);
        try {
            const payload = {
                mobile_number: mobile.trim(),
                reason,
                details: details.trim(),
            };

            const res = await fetch(DELETE_ACCOUNT_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Request failed");
            }
            setShowSuccess(true);
        } catch (e) {
            setErrorMsg(
                "অনুরোধটি পাঠাতে সমস্যা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন অথবা সরাসরি সাপোর্টে যোগাযোগ করুন।"
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="font-['Inter',sans-serif] text-[#1B2D4F] bg-[#f4f6fa] min-h-screen">
            {/* NAV */}
            <nav className="bg-[#111E35] py-4 px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link
                        to="/"
                        className="text-sm flex items-center gap-1.5 text-slate-400 no-underline hover:text-white transition"
                    >
                        ← Back to home
                    </Link>
                </div>
            </nav>

            {/* PAGE HEADER */}
            <div className="bg-[#1B2D4F] py-12 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-2">Delete Your Account</h1>
                    <p className="text-slate-400">
                        We're sorry to see you go. Submit a request below and our team will process
                        it.
                    </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-10">
                {/* Warning box */}
                <div className="rounded-2xl p-5 mb-6 bg-red-50 border-2 border-red-200">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div className="text-sm text-red-700 leading-relaxed">
                            <p className="font-bold mb-1">This action is permanent</p>
                            <p>
                                Deleting your account will permanently remove your properties, tenants,
                                transaction history, and all related data after the retention period
                                required by law. This cannot be undone. If you only want to pause
                                billing, you can simply let your subscription expire instead of deleting
                                your account.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-[#1B2D4F] text-white flex-shrink-0">
                            1
                        </div>
                        <h2 className="font-bold text-lg text-[#1B2D4F]">Account Deletion Request</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[#1B2D4F]">
                                Registered Mobile Number <span className="text-[#E91E63]">*</span>
                            </label>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                onBlur={() => setMobileTouched(true)}
                                maxLength={14}
                                placeholder="e.g. 01XXXXXXXXX"
                                className={`w-full border-2 rounded-xl py-3.5 px-4 text-[15px] outline-none transition-colors bg-white ${mobileTouched && !mobileOk
                                        ? "border-red-500"
                                        : "border-[#e2e8f0] focus:border-[#1B2D4F]"
                                    }`}
                            />
                            {mobileTouched && !mobileOk && (
                                <div className="text-xs mt-1 text-red-500">
                                    Please enter a valid 11-digit mobile number
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[#1B2D4F]">
                                Reason for Leaving <span className="text-[#E91E63]">*</span>
                            </label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full border-2 rounded-xl py-3.5 px-4 text-[15px] outline-none transition-colors bg-white border-[#e2e8f0] focus:border-[#1B2D4F]"
                            >
                                <option value="">Select a reason</option>
                                {REASONS.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[#1B2D4F]">
                                Additional Details (optional)
                            </label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows={4}
                                placeholder="Tell us more, if you'd like…"
                                className="w-full border-2 rounded-xl py-3.5 px-4 text-[15px] outline-none transition-colors bg-white border-[#e2e8f0] focus:border-[#1B2D4F] resize-y"
                            />
                        </div>

                        <label className="flex items-start gap-3 pt-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={confirmed}
                                onChange={(e) => setConfirmed(e.target.checked)}
                                className="mt-1 w-4 h-4 accent-[#1B2D4F]"
                            />
                            <span className="text-sm text-gray-600">
                                I understand this will permanently delete my Vara Khata account and all
                                associated data, and I have read the{" "}
                                <Link to="/terms" className="text-[#1B2D4F] font-semibold underline">
                                    Terms &amp; Conditions
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-[#1B2D4F] font-semibold underline">
                                    Privacy Policy
                                </Link>
                                .
                            </span>
                        </label>
                    </div>
                </div>

                {errorMsg && (
                    <div className="rounded-xl p-4 mb-4 text-sm bg-red-50 border border-red-200 text-red-600">
                        {errorMsg}
                    </div>
                )}

                {/* SUBMIT */}
                <div className="mb-6">
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-2xl text-base font-bold transition-all"
                    >
                        {submitting ? "Submitting…" : "Submit Deletion Request"}
                    </button>
                    <p className="text-center text-xs mt-3 text-[#6B7A99]">
                        Your request will be reviewed and processed within 7 business days.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                    <Link
                        to="/"
                        className="border-2 border-[#e2e8f0] hover:border-[#1B2D4F] text-[#1B2D4F] py-3 px-6 rounded-xl font-semibold text-sm transition"
                    >
                        Cancel — Keep My Account
                    </Link>
                </div>
            </div>

            {/* SUCCESS MODAL */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-5">
                    <div className="bg-white rounded-3xl p-10 px-8 max-w-sm w-full text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold mb-2 text-[#1B2D4F]">Request Received</h2>
                        <p className="mb-2 text-[#6B7A99]">
                            Your account deletion request has been submitted.
                        </p>
                        <p className="text-sm mb-6 text-[#6B7A99]">
                            Our team will process it within <strong>7 business days</strong>. You may
                            be contacted to confirm before final deletion.
                        </p>
                        <Link
                            to="/"
                            className="block text-center py-4 bg-[#1B2D4F] hover:bg-[#111E35] text-white rounded-2xl font-bold no-underline transition"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="py-8 px-6 text-center text-sm mt-4 text-[#6B7A99]">
                <p>© 2026 Vara Khata by Jabed International. All rights reserved.</p>
                <p className="mt-1">Questions? Contact us through the app.</p>
            </footer>
        </div>
    );
}