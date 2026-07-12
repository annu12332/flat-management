import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SHARED_SECRET, API_URL, PAYMENT_NUMBER, decryptSubscriptionUrl } from "./SubscriptionConfig";
import { getToken } from "../api/client";

/* Same base as the rest of the app's plan/subscribe calls.
   If SubscriptionConfig.js already exports a BASE_URL, swap this for
   `${BASE_URL}/api/subscription-plans` to keep a single source of truth. */
const PLANS_API_URL = "https://varakhata.jabedinternational.com/api/subscription-plans";

// Cosmetic helpers — API only sends name/price/duration_days/features,
// so icon/badge/color are derived locally from the plan name.
function getPlanPresentation(name = "") {
    const key = name.toLowerCase();
    if (key.includes("yearly")) {
        return { icon: "🏆", popular: false, isYearly: true, save: "2 months free" };
    }
    if (key.includes("pro")) {
        return { icon: "🚀", popular: true, isYearly: false, save: null };
    }
    return { icon: "⭐", popular: false, isYearly: false, save: null };
}

function formatTaka(amount) {
    return `৳${Number(amount).toLocaleString("en-BD")}`;
}

function getDurationLabel(durationDays) {
    return String(durationDays) === "365" ? "Yearly plan" : "Monthly plan";
}

export default function PaymentPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const planId = searchParams.get("plan_id");

    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(true);
    const [plansError, setPlansError] = useState(null);

    const [currentMethod, setCurrentMethod] = useState("bkash");
    const [senderNumber, setSenderNumber] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [senderTouched, setSenderTouched] = useState(false);
    const [txnTouched, setTxnTouched] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [termsOpen, setTermsOpen] = useState(false);
    const [copiedAccount, setCopiedAccount] = useState(false);
    const [copiedAmount, setCopiedAmount] = useState(false);

    const bearerTokenRef = useRef(null);

    // Sends the user to /login, preserving the current URL so they can be
    // bounced back here (e.g. with a fresh signed link) after logging in.
    const redirectToLogin = useCallback(() => {
        const redirectTarget = `${window.location.pathname}${window.location.search}`;
        navigate(`/login?redirect=${encodeURIComponent(redirectTarget)}`, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const buildChangePlanUrl = useCallback(() => {
        const sig = searchParams.get("sig");
        const ts = searchParams.get("ts");
        const params = new URLSearchParams();
        if (sig && ts) {
            params.set("sig", sig);
            params.set("ts", ts);
        }
        return `/subscribe${params.toString() ? `?${params.toString()}` : ""}`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // 1) Resolve a bearer token from EITHER of two sources:
    //    a) a signed link (?sig=&ts=) — used when someone arrives from an
    //       external/public link without being logged in, or
    //    b) the normal login token — used when navigating here from
    //       inside the app (SubscribePage -> "Choose Plan" -> here).
    //    Only redirect to /login if NEITHER source produces a token.
    //    (Temporary [PaymentPage debug] logs included below — remove once
    //    the redirect issue is confirmed fixed.)
    useEffect(() => {
        const urlSig = searchParams.get("sig");
        const urlTs = searchParams.get("ts");

        console.log("[PaymentPage debug] urlSig present?", !!urlSig, "urlTs present?", !!urlTs);

        let token = null;

        if (urlSig && urlTs) {
            try {
                token = decryptSubscriptionUrl(urlSig, urlTs, SHARED_SECRET);
                console.log(
                    "[PaymentPage debug] decrypt succeeded, token:",
                    token ? `${token.slice(0, 12)}...` : token
                );
            } catch (e) {
                console.error("[PaymentPage debug] Token decrypt failed:", e.message);
                token = null; // expired / tampered / invalid link
            }
        } else {
            console.log("[PaymentPage debug] no sig/ts in URL — skipping decrypt");
        }

        // No valid signed link? Fall back to the normal in-app login token.
        if (!token) {
            const loginToken = getToken();
            console.log("[PaymentPage debug] falling back to getToken():", loginToken ? "found" : "null");
            token = loginToken;
        }

        if (!token) {
            console.log("[PaymentPage debug] no token from either source — redirecting to /login");
            redirectToLogin();
            return;
        }
        bearerTokenRef.current = token;

        if (!planId) {
            navigate(buildChangePlanUrl(), { replace: true });
            return;
        }

        let isMounted = true;
        async function loadPlans() {
            setPlansLoading(true);
            setPlansError(null);
            try {
                const res = await fetch(PLANS_API_URL, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${bearerTokenRef.current}`,
                    },
                });

                if (res.status === 401) {
                    console.log("[PaymentPage debug] subscription-plans returned 401 — redirecting to /login");
                    redirectToLogin();
                    return;
                }

                const body = await res.json().catch(() => null);
                if (!res.ok) {
                    throw new Error(body?.message || "Failed to load plan details.");
                }
                if (isMounted) setPlans(body?.data?.plans || []);
            } catch (err) {
                if (isMounted) setPlansError(err.message || "Failed to load plan details.");
            } finally {
                if (isMounted) setPlansLoading(false);
            }
        }
        loadPlans();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectedPlan = plans.find((p) => String(p.id) === String(planId)) || null;

    // 2) Once plans have loaded, if the requested plan_id doesn't exist
    //    (bad link, deleted plan, etc.) send the user back to pick again.
    useEffect(() => {
        if (!plansLoading && !plansError && planId && plans.length > 0 && !selectedPlan) {
            navigate(buildChangePlanUrl(), { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plansLoading, plansError, plans]);

    const senderOk = /^01[3-9]\d{8}$/.test(senderNumber.trim());
    const txnOk = transactionId.trim().length >= 6;
    const canSubmit = senderOk && txnOk && !submitting && !!selectedPlan;

    const copyText = useCallback(async (text, setCopied) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            // clipboard may be unavailable; fail silently
        }
    }, []);

    const handleSubmit = async () => {
        setSenderTouched(true);
        setTxnTouched(true);
        setSubmitError(null);
        if (!senderOk || !txnOk || !selectedPlan) return;

        setSubmitting(true);
        try {
            const payload = {
                plan_id: selectedPlan.id,
                payment_method: currentMethod,
                transaction_id: transactionId.trim(),
                amount: selectedPlan.price,
                sender_number: senderNumber.trim(),
            };

            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(bearerTokenRef.current
                        ? { Authorization: "Bearer " + bearerTokenRef.current }
                        : {}),
                },
                body: JSON.stringify(payload),
            });

            if (res.status === 401) {
                redirectToLogin();
                return;
            }

            if (!res.ok) {
                let message = "Opps! Request not submitted..Try again.";
                try {
                    const data = await res.json();
                    if (data?.message) message = data.message;
                    else if (data?.detail) message = data.detail;
                } catch (_) {
                    /* response wasn't JSON — keep generic message */
                }
                setSubmitError(message);
                return; // do NOT show success modal
            }

            setShowSuccess(true);
        } catch (e) {
            setSubmitError("Network Issue, please check your internet connection");
        } finally {
            setSubmitting(false);
        }
    };

    const methodAccent = currentMethod === "bkash" ? "#E91E63" : "#F97316";
    const methodName = currentMethod === "bkash" ? "bKash" : "Nagad";

    // ---- Loading / error states for the plan fetch itself ----
    if (plansLoading) {
        return (
            <div className="font-['Inter',sans-serif] text-[#1B2D4F] bg-[#f4f6fa] min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading your plan…</p>
            </div>
        );
    }

    if (plansError) {
        return (
            <div className="font-['Inter',sans-serif] text-[#1B2D4F] bg-[#f4f6fa] min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <p className="text-red-500 font-semibold mb-4">{plansError}</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 rounded-xl bg-[#1B2D4F] text-white text-sm font-bold"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!selectedPlan) {
        // Briefly true right before the redirect effect above kicks in.
        return null;
    }

    const { icon } = getPlanPresentation(selectedPlan.name);
    const durationLabel = getDurationLabel(selectedPlan.duration_days);
    const formattedPrice = formatTaka(selectedPlan.price);

    return (
        <div className="font-['Inter',sans-serif] text-[#1B2D4F] bg-[#f4f6fa] min-h-screen">
            {/* NAV */}
            <nav className="bg-[#111E35] py-4 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link
                        to={buildChangePlanUrl()}
                        className="text-sm flex items-center gap-1.5 text-slate-400 no-underline hover:text-white transition"
                    >
                        ← Change plan
                    </Link>
                </div>
            </nav>

            {/* PAGE HEADER */}
            <div className="bg-[#1B2D4F] py-10 sm:py-12 px-4 sm:px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Complete your payment
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Pay securely via bKash or Nagad and submit your transaction details below.
                    </p>
                </div>
            </div>

            {/* STEP INDICATOR */}
            <div className="max-w-4xl mx-auto px-4 pt-8 pb-2">
                <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold">
                    <Link to={buildChangePlanUrl()} className="flex items-center gap-2 no-underline">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                            ✓
                        </div>
                        <span className="text-[#1B2D4F]">Choose Plan</span>
                    </Link>
                    <div className="w-8 sm:w-16 h-px bg-[#1B2D4F]" />
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1B2D4F] text-white flex items-center justify-center">
                            2
                        </div>
                        <span className="text-[#1B2D4F]">Payment</span>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
                {/* STEP 2: PAYMENT METHOD */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
                    {/* Selected plan summary */}
                    <div className="rounded-xl p-4 mb-6 flex items-center justify-between gap-3 bg-[#f4f6fa] border border-[#e2e8f0]">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="text-2xl shrink-0">{icon}</span>
                            <div className="min-w-0">
                                <div className="font-bold text-[#1B2D4F] truncate">{selectedPlan.name}</div>
                                <div className="text-xs text-[#6B7A99] truncate">{durationLabel}</div>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="font-bold text-xl sm:text-2xl text-[#1B2D4F]">{formattedPrice}</div>
                            <Link
                                to={buildChangePlanUrl()}
                                className="text-xs text-[#1B2D4F] underline no-underline hover:underline"
                            >
                                Change
                            </Link>
                        </div>
                    </div>

                    {/* Payment method tabs */}
                    <div className="mb-1 text-sm font-semibold text-[#6B7A99]">
                        Select Payment Method
                    </div>
                    <div className="flex gap-3 mb-6 mt-2">
                        <button
                            type="button"
                            onClick={() => setCurrentMethod("bkash")}
                            className={`flex-1 p-3 sm:p-3.5 rounded-xl cursor-pointer text-center font-semibold text-sm sm:text-[15px] border-2 transition-all ${
                                currentMethod === "bkash"
                                    ? "border-[#E91E63] bg-[#FCE4EC] text-[#E91E63]"
                                    : "border-[#e2e8f0] bg-white text-[#1B2D4F]"
                            }`}
                        >
                            bKash
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentMethod("nagad")}
                            className={`flex-1 p-3 sm:p-3.5 rounded-xl cursor-pointer text-center font-semibold text-sm sm:text-[15px] border-2 transition-all ${
                                currentMethod === "nagad"
                                    ? "border-[#F97316] bg-[#fff7ed] text-[#F97316]"
                                    : "border-[#e2e8f0] bg-white text-[#1B2D4F]"
                            }`}
                        >
                            Nagad
                        </button>
                    </div>

                    {/* How to pay */}
                    <div className="rounded-xl p-4 sm:p-5 mb-6 bg-[#f8faff] border-2 border-[#e2e8f0]">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-5 rounded-full" style={{ background: methodAccent }} />
                            <span className="font-bold text-sm sm:text-base">How to Pay via {methodName}</span>
                        </div>
                        <div className="space-y-4 text-sm text-gray-700">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#1B2D4F] text-white flex-shrink-0">
                                    1
                                </div>
                                <div className="pt-0.5">
                                    Open your{" "}
                                    <span className="font-semibold" style={{ color: methodAccent }}>
                                        {methodName}
                                    </span>{" "}
                                    app and tap <strong>Send Money</strong>.
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#1B2D4F] text-white flex-shrink-0">
                                    2
                                </div>
                                <div className="pt-0.5 flex-1 min-w-0">
                                    <div className="mb-2">Send the exact amount to the number below:</div>
                                    <div className="flex flex-wrap items-center justify-between rounded-xl p-3 gap-3 bg-[#e8edf5]">
                                        <div className="min-w-0">
                                            <div className="text-xs text-[#6B7A99]">Account Number (Personal)</div>
                                            <div className="font-bold text-base text-[#1B2D4F] break-all">
                                                {PAYMENT_NUMBER}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => copyText(PAYMENT_NUMBER, setCopiedAccount)}
                                            className={`flex items-center gap-2 rounded-lg py-2 px-3 font-semibold text-xs transition-all border shrink-0 ${
                                                copiedAccount
                                                    ? "bg-green-50 border-green-600 text-green-600"
                                                    : "bg-[#f4f6fa] border-[#e2e8f0] text-[#1B2D4F] hover:bg-[#e8edf5]"
                                            }`}
                                        >
                                            {copiedAccount ? "✓ Copied" : "📋 Copy"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#1B2D4F] text-white flex-shrink-0">
                                    3
                                </div>
                                <div className="pt-0.5 flex-1 min-w-0">
                                    <div className="mb-2">The exact amount to send is shown below:</div>
                                    <div className="flex flex-wrap items-center justify-between rounded-xl p-3 gap-3 bg-[#e8edf5]">
                                        <div>
                                            <div className="text-xs text-[#6B7A99]">Amount</div>
                                            <div className="font-bold text-xl text-[#1B2D4F]">{formattedPrice}</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => copyText(String(selectedPlan.price), setCopiedAmount)}
                                            className={`flex items-center gap-2 rounded-lg py-2 px-3 font-semibold text-xs transition-all border shrink-0 ${
                                                copiedAmount
                                                    ? "bg-green-50 border-green-600 text-green-600"
                                                    : "bg-[#f4f6fa] border-[#e2e8f0] text-[#1B2D4F] hover:bg-[#e8edf5]"
                                            }`}
                                        >
                                            {copiedAmount ? "✓ Copied" : "📋 Copy"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#1B2D4F] text-white flex-shrink-0">
                                    4
                                </div>
                                <div className="pt-0.5">
                                    Enter your sender number and Transaction ID (TrxID) in the form below and
                                    tap <strong>Submit</strong>.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation form */}
                    <div className="pt-2">
                        <div className="text-sm font-semibold mb-4 text-[#6B7A99]">
                            Payment Confirmation
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-[#1B2D4F]">
                                    Sender Mobile Number <span className="text-[#E91E63]">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={senderNumber}
                                    onChange={(e) => {
                                        setSenderNumber(e.target.value);
                                        if (submitError) setSubmitError(null);
                                    }}
                                    onBlur={() => setSenderTouched(true)}
                                    maxLength={14}
                                    placeholder="Enter your mobile number"
                                    className={`w-full border-2 rounded-xl py-3.5 px-4 text-[15px] outline-none transition-colors bg-white ${
                                        senderTouched && !senderOk
                                            ? "border-red-500"
                                            : "border-[#e2e8f0] focus:border-[#1B2D4F]"
                                    }`}
                                />
                                {senderTouched && !senderOk && (
                                    <div className="text-xs mt-1 text-red-500">
                                        Please enter a valid 11-digit mobile number
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-[#1B2D4F]">
                                    Transaction ID (TrxID) <span className="text-[#E91E63]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => {
                                        setTransactionId(e.target.value);
                                        if (submitError) setSubmitError(null);
                                    }}
                                    onBlur={() => setTxnTouched(true)}
                                    placeholder="Enter your transaction ID"
                                    className={`w-full border-2 rounded-xl py-3.5 px-4 text-[15px] outline-none transition-colors bg-white ${
                                        txnTouched && !txnOk
                                            ? "border-red-500"
                                            : "border-[#e2e8f0] focus:border-[#1B2D4F]"
                                    }`}
                                />
                                {txnTouched && !txnOk && (
                                    <div className="text-xs mt-1 text-red-500">
                                        Please enter a valid transaction ID
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit error banner (shown instead of the success modal) */}
                {submitError && (
                    <div className="rounded-xl p-4 mb-4 text-sm bg-red-50 border border-red-200 text-red-600 flex items-start gap-2">
                        <span className="shrink-0">⚠️</span>
                        <span>{submitError}</span>
                    </div>
                )}

                {/* SUBMIT */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="w-full py-4 bg-[#1B2D4F] hover:bg-[#111E35] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-2xl text-base font-bold transition-all"
                    >
                        {submitting ? "Submitting…" : "Submit Payment Request"}
                    </button>
                    <p className="text-center text-xs mt-3 text-[#6B7A99]">
                        Your request will be reviewed within 24 hours.
                    </p>
                    <p className="text-center text-xs mt-1 text-[#6B7A99]">
                        🔒 All plans come with a 7-day money-back guarantee.
                    </p>
                </div>

                {/* TERMS accordion */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setTermsOpen((v) => !v)}
                        className="w-full flex items-center justify-between p-5 text-left font-bold text-[#1B2D4F]"
                    >
                        <span>Terms &amp; Conditions</span>
                        <svg
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ transition: "transform 0.2s", transform: termsOpen ? "rotate(180deg)" : "" }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {termsOpen && (
                        <div className="px-5 pb-6 text-sm leading-relaxed text-gray-700">
                            <p className="mb-3">
                                By submitting a payment request you agree to our full{" "}
                                <Link to="/terms" className="text-[#1B2D4F] font-semibold underline">
                                    Terms &amp; Conditions
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-[#1B2D4F] font-semibold underline">
                                    Privacy Policy
                                </Link>
                                , including our subscription, refund and data-handling terms.
                            </p>
                            <div className="rounded-xl p-4 bg-[#f4f6fa] border border-[#e2e8f0]">
                                <p className="text-xs text-[#6B7A99]">
                                    By submitting a payment request, you confirm that you have read,
                                    understood, and agreed to these Terms and Conditions and our Refund
                                    Policy.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* SUCCESS MODAL — only rendered on a real, confirmed success */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 sm:p-5">
                    <div className="bg-white rounded-3xl p-6 sm:p-10 px-6 sm:px-8 max-w-sm w-full text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold mb-2 text-[#1B2D4F]">Request Submitted!</h2>
                        <p className="mb-2 text-[#6B7A99]">
                            Your payment request has been received successfully.
                        </p>
                        <p className="text-sm mb-6 text-[#6B7A99]">
                            Your subscription will be activated within <strong>24 hours</strong> after
                            our team verifies your payment.
                        </p>
                        <div className="rounded-xl p-4 mb-6 text-sm bg-sky-50 border border-sky-200 text-sky-700">
                            📧 You will receive a confirmation once your account is active. Please check
                            your registered details.
                        </div>
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
                <p>© 2026 Rent Book by Jabed International. All rights reserved.</p>
                <p className="mt-1">Questions? Contact us through the app.</p>
            </footer>
        </div>
    );
}