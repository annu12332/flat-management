import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* DUMMY PAGE — no real API call. Submission is simulated locally with a
   short delay so the UI/UX can be demoed and reviewed before the real
   account-deletion endpoint exists on the backend. Swap handleSubmit's
   body for a real apiFetch(...) call once that endpoint is ready. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REASONS = [
    "Not using the app anymore",
    "Switching to another tool",
    "Too expensive",
    "Missing features I need",
    "Privacy concerns",
    "Other",
];

export default function DeleteAccount() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [confirmed, setConfirmed] = useState(false);

    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const emailOk = EMAIL_RE.test(email.trim());
    const passwordOk = password.length >= 6;
    const canSubmit = emailOk && passwordOk && reason && confirmed && !submitting;

    const handleSubmit = async () => {
        setEmailTouched(true);
        setPasswordTouched(true);
        setErrorMsg("");
        if (!emailOk || !passwordOk || !reason || !confirmed) return;

        setSubmitting(true);
        try {
            // Dummy submission — no backend call. Replace this block with a
            // real apiFetch("/api/account/delete-request", { method: "POST", body: ... })
            // once the actual endpoint exists.
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setShowSuccess(true);
        } catch (err) {
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
                                Registered Email <span className="text-[#E91E63]">*</span>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setEmailTouched(true)}
                                autoComplete="email"
                                placeholder="you@example.com"
                                className={`w-full border-2 rounded-xl py-3.5 px-4 text-[15px] outline-none transition-colors bg-white ${
                                    emailTouched && !emailOk
                                        ? "border-red-500"
                                        : "border-[#e2e8f0] focus:border-[#1B2D4F]"
                                }`}
                            />
                            {emailTouched && !emailOk && (
                                <div className="text-xs mt-1 text-red-500">
                                    Please enter a valid email address
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[#1B2D4F]">
                                Confirm Your Password <span className="text-[#E91E63]">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => setPasswordTouched(true)}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className={`w-full border-2 rounded-xl py-3.5 px-4 pr-12 text-[15px] outline-none transition-colors bg-white ${
                                        passwordTouched && !passwordOk
                                            ? "border-red-500"
                                            : "border-[#e2e8f0] focus:border-[#1B2D4F]"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B2D4F] text-xs font-semibold"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {passwordTouched && !passwordOk && (
                                <div className="text-xs mt-1 text-red-500">
                                    Enter your current password to confirm it's really you
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
                                I understand this will permanently delete my RentBook flow account and all
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
                        <button
                            onClick={() => navigate("/")}
                            className="block w-full text-center py-4 bg-[#1B2D4F] hover:bg-[#111E35] text-white rounded-2xl font-bold transition"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="py-8 px-6 text-center text-sm mt-4 text-[#6B7A99]">
                <p>© 2026 RentBook flow by Jabed International. All rights reserved.</p>
                <p className="mt-1">Questions? Contact us through the app.</p>
            </footer>
        </div>
    );
}