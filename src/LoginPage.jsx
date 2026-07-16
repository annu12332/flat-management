import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "./api/authApi";
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

/** Rotated ink-stamp seal — the page's signature element, echoing the
 *  paper receipt stamps used in real bKash/Nagad and ledger transactions. */
function LedgerSeal() {
    return (
        <svg width="132" height="132" viewBox="0 0 132 132" className="drop-shadow-sm">
            <g transform="rotate(-10 66 66)" fill="none" stroke="#E8DDD0" strokeWidth="2">
                <circle cx="66" cy="66" r="58" strokeDasharray="3 4" />
                <circle cx="66" cy="66" r="48" />
                <text
                    x="66"
                    y="54"
                    textAnchor="middle"
                    fill="#E8DDD0"
                    fontSize="15"
                    fontFamily="Georgia, serif"
                    fontWeight="700"
                    letterSpacing="2"
                >
                    RentBook flow
                </text>
                <text
                    x="66"
                    y="76"
                    textAnchor="middle"
                    fill="#E8DDD0"
                    fontSize="10"
                    fontFamily="Georgia, serif"
                    letterSpacing="3"
                >
                    SECURE LEDGER
                </text>
                <text
                    x="66"
                    y="94"
                    textAnchor="middle"
                    fill="#E8DDD0"
                    fontSize="9"
                    fontFamily="Georgia, serif"
                >
                    EST. 2026
                </text>
            </g>
        </svg>
    );
}

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const emailRef = useRef(null);

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Already logged in? Skip the login screen entirely.
    useEffect(() => {
        if (getToken()) {
            navigate(location.state?.from || "/dashboard", { replace: true });
        }
        emailRef.current?.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validate = () => {
        const errors = {};
        if (!form.email.trim()) errors.email = "Email is required.";
        else if (!EMAIL_RE.test(form.email)) errors.email = "Enter a valid email address.";

        if (!form.password) errors.password = "Password is required.";
        else if (form.password.length < 6) errors.password = "Password must be at least 6 characters.";

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
            await login({ email: form.email.trim(), password: form.password }, rememberMe);
            navigate(location.state?.from || "/dashboard", { replace: true });
        } catch (err) {
            // Laravel-style validation errors: { email: ["..."], password: ["..."] }
            if (err.errors) {
                const mapped = {};
                Object.entries(err.errors).forEach(([key, msgs]) => {
                    mapped[key] = Array.isArray(msgs) ? msgs[0] : msgs;
                });
                setFieldErrors(mapped);
            }
            setFormError(
                err.status === 401 || err.status === 422
                    ? "The email or password you entered is incorrect."
                    : err.message || "Something went wrong. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex font-['Inter',sans-serif] bg-[#f4f6fa]">
            {/* LEFT — brand / ledger panel */}
            <div className="hidden lg:flex lg:w-[46%] relative bg-[#1B2D4F] overflow-hidden flex-col justify-between p-12">
                {/* ruled ledger lines */}
                <div
                    className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(0deg, transparent, transparent 35px, #ffffff 35px, #ffffff 36px)",
                    }}
                />
                {/* red margin rule, like a real ledger page */}
                <div className="absolute top-0 bottom-0 left-16 w-px bg-[#C2564A]/40" />

                <div className="relative z-10">
                    <span
                        className="text-white text-2xl font-bold tracking-tight"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                        RentBook flow
                    </span>
                    <p className="text-slate-400 text-sm mt-1">by Jabed International</p>
                </div>

                <div className="relative z-10 max-w-sm">
                    <h1
                        className="text-white text-3xl leading-tight mb-4"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                        Every rent, every receipt, one ledger.
                    </h1>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Track properties, tenants, and rent collection in one place — the way a
                        proper khata should be kept, just without the paper cuts.
                    </p>
                </div>

                <div className="relative z-10 flex items-end justify-between">
                    <p className="text-slate-500 text-xs">
                        © 2026 RentBook flow by Jabed International.
                    </p>
                    <LedgerSeal />
                </div>
            </div>

            {/* RIGHT — form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden text-center mb-8">
                        <span
                            className="text-[#1B2D4F] text-2xl font-bold"
                            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                        >
                            RentBook flow
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-[#1B2D4F] mb-1">Welcome back</h2>
                    <p className="text-sm text-slate-500 mb-8">
                        Log in to manage your properties and rent collection.
                    </p>

                    {formError && (
                        <div
                            role="alert"
                            className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            <span className="mt-0.5">⚠</span>
                            <span>{formError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                ref={emailRef}
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange("email")}
                                aria-invalid={!!fieldErrors.email}
                                placeholder="you@example.com"
                                className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2 ${fieldErrors.email
                                        ? "border-red-300 focus:ring-red-200"
                                        : "border-gray-200 focus:ring-[#1B2D4F]/30 focus:border-[#1B2D4F]"
                                    }`}
                            />
                            {fieldErrors.email && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs font-semibold text-[#1B2D4F] hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={form.password}
                                    onChange={handleChange("password")}
                                    aria-invalid={!!fieldErrors.password}
                                    placeholder="••••••••"
                                    className={`w-full border rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all focus:ring-2 ${fieldErrors.password
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
                            {fieldErrors.password && (
                                <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
                            )}
                        </div>

                        <label className="flex items-center gap-2 text-sm text-gray-600 select-none cursor-pointer pt-1">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#1B2D4F] focus:ring-[#1B2D4F]/30"
                            />
                            Keep me signed in on this device
                        </label>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 rounded-xl font-bold text-white bg-[#1B2D4F] transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                        >
                            {submitting && (
                                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        opacity="0.25"
                                    />
                                    <path
                                        d="M22 12a10 10 0 0 0-10-10"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            )}
                            {submitting ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-8">
                        New to RentBook flow?{" "}
                        <Link to="/register" className="font-semibold text-[#1B2D4F] hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}