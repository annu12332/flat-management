import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PLANS } from "./SubscriptionConfig";

function PlanCard({ planKey, plan, onSelect }) {
    const isYearly = planKey === "pro-yearly";

    return (
        <div className="flex flex-col h-full bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 relative transition-all hover:shadow-md">
            {plan.popular && (
                <span className="absolute -top-3 right-4 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                </span>
            )}
            <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center text-xl">
                        {plan.icon}
                    </div>
                    <div>
                        <div className="font-bold text-gray-800">{plan.name}</div>
                        <div className="text-sm text-gray-500">
                            {plan.duration.replace(" subscription", " plan")}
                        </div>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <div className="font-bold text-gray-900 text-lg">{plan.price}</div>
                    <div className="text-xs text-gray-400">{plan.perDay}</div>
                </div>
            </div>

            {plan.save && (
                <div className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4 w-fit">
                    {plan.save}
                </div>
            )}

            <div className="space-y-3 text-sm text-gray-600 mb-6 flex-grow">
                {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                        <span className="shrink-0">✔</span> <span>{f}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => onSelect(planKey)}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 ${isYearly ? "bg-[#E91E63]" : "bg-[#1B2D4F]"
                    }`}
            >
                Choose {plan.name}
            </button>
        </div>
    );
}

export default function SubscribePage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleSelect = (planKey) => {
        const params = new URLSearchParams();
        params.set("plan", planKey);

        // Preserve the signed token params (if the user arrived via a signed link)
        const sig = searchParams.get("sig");
        const ts = searchParams.get("ts");
        if (sig && ts) {
            params.set("sig", sig);
            params.set("ts", ts);
        }

        navigate(`/subscribe/payment?${params.toString()}`);
    };

    return (
        <div className="font-['Inter',sans-serif] text-[#1B2D4F] bg-[#f4f6fa] min-h-screen">
            {/* NAV */}
            

            {/* PAGE HEADER */}
            <div className="bg-[#1B2D4F] py-10 sm:py-12 px-4 sm:px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Pick the plan that fits your needs
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Full control of your rental system. Upgrade anytime, cancel anytime.
                        Transparent pricing with no hidden charges.
                    </p>
                </div>
            </div>

            {/* STEP INDICATOR */}
            <div className="max-w-4xl mx-auto px-4 pt-8 pb-2">
                <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1B2D4F] text-white flex items-center justify-center">
                            1
                        </div>
                        <span className="text-[#1B2D4F]">Choose Plan</span>
                    </div>
                    <div className="w-8 sm:w-16 h-px bg-gray-300" />
                    <div className="flex items-center gap-2 opacity-50">
                        <div className="w-7 h-7 rounded-full bg-gray-300 text-white flex items-center justify-center">
                            2
                        </div>
                        <span className="text-gray-500">Payment</span>
                    </div>
                </div>
            </div>

            {/* PLANS */}
            <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
                    {Object.entries(PLANS).map(([key, p]) => (
                        <PlanCard key={key} planKey={key} plan={p} onSelect={handleSelect} />
                    ))}
                </div>

                <p className="text-center mt-10 text-sm text-slate-500">
                    ✅ All plans come with a <strong>7-day money-back guarantee</strong>. Payments
                    accepted via bKash &amp; Nagad.
                </p>
            </div>

            {/* FOOTER */}
            <footer className="py-8 px-6 text-center text-sm mt-4 text-[#6B7A99]">
                <p>© 2026 Vara Khata by Jabed International. All rights reserved.</p>
                <p className="mt-1">Questions? Contact us through the app.</p>
            </footer>
        </div>
    );
}