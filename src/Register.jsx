import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./api/authApi";
import { getToken } from "./api/clientApi";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EyeIcon({ open }) {
    return open ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 4.22-5.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 7 11 7a20.3 20.3 0 0 1-2.16 3.19" />
            <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
            <path d="M1 1l22 22" />
        </svg>
    );
}

/** Same signature ink-stamp seal used on the login page, for visual continuity. */
function LedgerSeal() {
    return (
        <svg width="132" height="132" viewBox="0 0 132 132" className="drop-shadow-sm">
            <g transform="rotate(-10 66 66)" fill="none" stroke="#E8DDD0" strokeWidth="2">
                <circle cx="66" cy="66" r="58" strokeDasharray="3 4" />
                <circle cx="66" cy="66" r="48" />
                <text x="66" y="54" textAnchor="middle" fill="#E8DDD0" fontSize="15" fontFamily="Georgia, serif" fontWeight="700" letterSpacing="2">
                    RentBook flow
                </text>
                <text x="66" y="76" textAnchor="middle" fill="#E8DDD0" fontSize="10" fontFamily="Georgia, serif" letterSpacing="3">
                    SECURE LEDGER
                </text>
                <text x="66" y="94" textAnchor="middle" fill="#E8DDD0" fontSize="9" fontFamily="Georgia, serif">
                    EST. 2026
                </text>
            </g>
        </svg>
    );
}

const initialForm = { name: "", email: "", password: "", password_confirmation: "" };

export default function RegisterPage() {
    const navigate = useNavigate();
    const nameRef = useRef(null);

    const [form, setForm] = useState(initialForm);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (getToken()) {
            navigate("/dashboard", { replace: true });
        }
        nameRef.current?.focus();
    }, [navigate]);

    const validate = () => {
        const errors = {};
        if (!form.name.trim()) errors.name = "Name is required.";

        if (!form.email.trim()) errors.email = "Email is required.";
        else if (!EMAIL_RE.test(form.email)) errors.email = "Enter a valid email address.";

        if (!form.password) errors.password = "Password is required.";
        else if (form.password.length < 6) errors.password = "Password must be at least 6 characters.";

        if (!form.password_confirmation) {
            errors.password_confirmation = "Please confirm your password.";
        } else if (form.password_confirmation !== form.password) {
            errors.password_confirmation = "Passwords don't match.";
        }

        if (!agreed) errors.agreed = "You must agree to the terms to continue.";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        if (fieldErrors[field]) setFieldErrors((fe) => ({ ...fe, [field]: undefined }));
        if (formError) setFormError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate() || submitting) return;

        setSubmitting(true);
        setFormError(null);
        try {
            await register({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                password_confirmation: form.password_confirmation,
            });
            setShowSuccess(true);
        } catch (err) {
            if (err.errors) {
                const mapped = {};
                Object.entries(err.errors).forEach(([key, msgs]) => {
                    mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
                });
                setFieldErrors((fe) => ({ ...fe, ...mapped }));
            }
            setFormError(
                err.status === 422
                    ? "Please fix the highlighted fields and try again."
                    : err.message || "Something went wrong. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f4f6fa] font-['Inter',sans-serif] px-4">
                <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-sm w-full text-center shadow-sm border border-gray-100">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold mb-2 text-[#1B2D4F]">Account created!</h2>
                    <p className="text-sm text-[#6B7A99] mb-6">
                        Your RentBook flow account is ready. Log in to start managing your properties.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full py-3.5 rounded-xl font-bold text-white bg-[#1B2D4F] hover:opacity-90 transition-all"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex font-['Inter',sans-serif] bg-[#f4f6fa]">
            {/* LEFT — brand / ledger panel */}
            <div className="hidden lg:flex lg:w-[46%] relative bg-[#1B2D4F] overflow-hidden flex-col justify-between p-12">
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(0deg, transparent, transparent 35px, #ffffff 35px, #ffffff 36px)",
                    }}
                />
                <div className="absolute top-0 bottom-0 left-16 w-px bg-[#C2564A]/40" />

                <div className="relative z-10">
                    <span className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                        RentBook flow
                    </span>
                    <p className="text-slate-400 text-sm mt-1">by Jabed International</p>
                </div>

                <div className="relative z-10 max-w-sm">
                    <h1 className="text-white text-3xl leading-tight mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                        Start your ledger today.
                    </h1>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Set up your account in under a minute and bring every property, tenant, and
                        rent receipt into one place.
                    </p>
                </div>

                <div className="relative z-10 flex items-end justify-between">
                    <p className="text-slate-500 text-xs">© 2026 RentBook flow by Jabed International.</p>
                    <LedgerSeal />
                </div>
            </div>

            {/* RIGHT — form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden text-center mb-8">
                        <span className="text-[#1B2D4F] text-2xl font-bold" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                            RentBook flow
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-[#1B2D4F] mb-1">Create your account</h2>
                    <p className="text-sm text-slate-500 mb-8">
                        Start managing your properties, tenants, and rent in minutes.
                    </p>

                    {formError && (
                        <div role="alert" className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <span className="mt-0.5">⚠</span>
                            <span>{formError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Full name
                            </label>
                            <input
                                ref={nameRef}
                                id="name"
                                type="text"
                                autoComplete="name"
                                value={form.name}
                                onChange={handleChange("name")}
                                aria-invalid={!!fieldErrors.name}
                                placeholder="Nafizul Alam"
                                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${
                                    fieldErrors.name
                                        ? "border-red-300 focus:ring-red-200"
                                        : "border-gray-200 focus:ring-[#1B2D4F]/30 focus:border-[#1B2D4F]"
                                }`}
                            />
                            {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange("email")}
                                aria-invalid={!!fieldErrors.email}
                                placeholder="you@example.com"
                                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${
                                    fieldErrors.email
                                        ? "border-red-300 focus:ring-red-200"
                                        : "border-gray-200 focus:ring-[#1B2D4F]/30 focus:border-[#1B2D4F]"
                                }`}
                            />
                            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={handleChange("password")}
                                    aria-invalid={!!fieldErrors.password}
                                    placeholder="At least 6 characters"
                                    className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all focus:ring-2 ${
                                        fieldErrors.password
                                            ? "border-red-300 focus:ring-red-200"
                                            : "border-gray-200 focus:ring-[#1B2D4F]/30 focus:border-[#1B2D4F]"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B2D4F] transition-colors"
                                >
                                    <EyeIcon open={showPassword} />
                                </button>
                            </div>
                            {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Confirm password
                            </label>
                            <div className="relative">
                                <input
                                    id="password_confirmation"
                                    type={showConfirm ? "text" : "password"}
                                    autoComplete="new-password"
                                    value={form.password_confirmation}
                                    onChange={handleChange("password_confirmation")}
                                    aria-invalid={!!fieldErrors.password_confirmation}
                                    placeholder="Re-enter your password"
                                    className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all focus:ring-2 ${
                                        fieldErrors.password_confirmation
                                            ? "border-red-300 focus:ring-red-200"
                                            : "border-gray-200 focus:ring-[#1B2D4F]/30 focus:border-[#1B2D4F]"
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((s) => !s)}
                                    aria-label={showConfirm ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1B2D4F] transition-colors"
                                >
                                    <EyeIcon open={showConfirm} />
                                </button>
                            </div>
                            {fieldErrors.password_confirmation && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.password_confirmation}</p>
                            )}
                        </div>

                        <div>
                            <label className="flex items-start gap-2 text-sm text-gray-600 select-none cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => {
                                        setAgreed(e.target.checked);
                                        if (fieldErrors.agreed) setFieldErrors((fe) => ({ ...fe, agreed: undefined }));
                                    }}
                                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1B2D4F] focus:ring-[#1B2D4F]/30"
                                />
                                <span>
                                    I agree to the{" "}
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
                            {fieldErrors.agreed && <p className="text-xs text-red-500 mt-1">{fieldErrors.agreed}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 rounded-xl font-bold text-white bg-[#1B2D4F] transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                        >
                            {submitting && (
                                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                                    <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                            )}
                            {submitting ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-[#1B2D4F] hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}