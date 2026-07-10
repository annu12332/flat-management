import React from "react";
import { Link } from "react-router-dom";

/* ---------- Theme colors (match original CSS vars) ----------
   navy       #1B2D4F
   navy-dark  #111E35
   pink       #E91E63
   pink-light #FCE4EC
   slate      #E8EDF5
   muted      #6B7A99
---------------------------------------------------------------*/

function FeatureCard({ icon, iconBg, title, desc, hoverBorder, hoverShadow }) {
    return (
        <div
            className={`group p-8 bg-white rounded-2xl border border-slate-200 hover:${hoverBorder} hover:shadow-xl ${hoverShadow} transition-all duration-300`}
        >
            <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl ${iconBg} text-2xl mb-6 group-hover:scale-110 transition-transform`}
            >
                {icon}
            </div>
            <h3 className="font-bold text-lg text-[#1B2D4F] mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function ProblemCard({ icon, title, desc }) {
    return (
        <div className="rounded-xl p-5 bg-white/5 border border-white/10 text-left">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-sm font-semibold text-white mb-1">{title}</div>
            <div className="text-xs text-slate-400">{desc}</div>
        </div>
    );
}

function StepItem({ number, title, desc }) {
    return (
        <div className="flex gap-6 items-start">
            <div className="w-10 h-10 rounded-full bg-[#1B2D4F] text-white font-bold flex items-center justify-center text-[15px] flex-shrink-0">
                {number}
            </div>
            <div className="pt-1">
                <h3 className="font-bold text-lg mb-1 text-[#1B2D4F]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#6B7A99]">{desc}</p>
            </div>
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="font-['Inter',sans-serif] text-[#1B2D4F] bg-[#f4f6fa]">
            {/* NAV */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 py-4 px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-[#1B2D4F]">
                            ভ
                        </div>
                        <span className="font-bold text-lg text-[#1B2D4F]">Vara Khata</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B7A99]">
                        <a href="#features" className="hover:text-[#1B2D4F] transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="hover:text-[#1B2D4F] transition-colors">
                            How It Works
                        </a>
                        <a href="#pricing" className="hover:text-[#1B2D4F] transition-colors">
                            Pricing
                        </a>
                    </div>
                    <Link
                        to="/subscribe"
                        className="bg-[#1B2D4F] hover:bg-[#111E35] text-white py-2.5 px-5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#111E35] via-[#1B2D4F] to-[#243a5e] py-16 md:py-24">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(233,30,99,0.15)_0%,transparent_60%)]" />
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative">
                    {/* Content */}
                    <div>
                        <div className="inline-flex items-center gap-1.5 bg-[#E91E63]/15 border border-[#E91E63]/30 text-[#f48fb1] px-3.5 py-1.5 rounded-full text-[13px] font-medium mb-6">
                            🇧🇩 Built for Bangladesh
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                            Manage your rentals <br />
                            <span className="text-pink-300">with ease</span>
                        </h1>
                        <p className="text-lg mb-4 font-medium text-white">
                            Run your entire rental business from your phone.
                        </p>
                        <p className="mb-8 text-slate-400 leading-relaxed">
                            Vara Khata is the all-in-one rental management app built for Bangladeshi
                            landlords. Track rent, tenants, bills, and expenses — no notebooks, no
                            WhatsApp chaos, no confusion.
                        </p>
                        <div className="flex flex-wrap gap-4 mb-10">
                            <Link
                                to="/subscribe"
                                className="bg-[#E91E63] hover:bg-[#c2185b] text-white py-3.5 px-8 rounded-xl font-semibold text-[15px] inline-flex items-center gap-2 transition"
                            >
                                Choose a Plan →
                            </Link>
                            <a
                                href="#features"
                                className="bg-white/10 border border-white/20 text-white py-3.5 px-8 rounded-xl font-semibold text-[15px] inline-flex items-center gap-2 transition"
                            >
                                See Features
                            </a>
                        </div>
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/[0.06] border border-white/[0.12] rounded-2xl p-6 text-center">
                                <div className="text-2xl font-bold text-white">৳500</div>
                                <div className="text-xs mt-1 text-slate-400">Starts at</div>
                            </div>
                            <div className="bg-white/[0.06] border border-white/[0.12] rounded-2xl p-6 text-center">
                                <div className="text-2xl font-bold text-white">7-day</div>
                                <div className="text-xs mt-1 text-slate-400">Money-back</div>
                            </div>
                            <div className="bg-white/[0.06] border border-white/[0.12] rounded-2xl p-6 text-center">
                                <div className="text-2xl font-bold text-white">24hr</div>
                                <div className="text-xs mt-1 text-slate-400">Activation</div>
                            </div>
                        </div>
                    </div>

                    {/* Phone mockup */}
<div className="flex justify-center md:justify-end relative">

    {/* Floating badge — top */}
    <div className="hidden md:flex absolute -top-3 left-2 z-10 items-center gap-1.5 bg-white rounded-xl border border-slate-200 shadow-lg px-2.5 py-1.5">
        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px]">✓</div>
        <div>
            <div className="text-[8px] text-slate-400 leading-none">Rent collected</div>
            <div className="text-[10px] font-bold text-[#1B2D4F] leading-none mt-0.5">৳43,500</div>
        </div>
    </div>

    {/* Floating badge — bottom */}
    <div className="hidden md:flex absolute -bottom-3 -left-4 z-10 items-center gap-1.5 bg-white rounded-xl border border-pink-200 shadow-lg px-2.5 py-1.5">
        <div className="w-5 h-5 rounded-full bg-pink-50 flex items-center justify-center text-[#E91E63] text-[10px]">🏠</div>
        <div>
            <div className="text-[8px] text-slate-400 leading-none">Occupied</div>
            <div className="text-[10px] font-bold text-[#1B2D4F] leading-none mt-0.5">4 of 7</div>
        </div>
    </div>

    {/* Pill badge */}
    <div className="hidden md:block absolute top-4 -left-2 z-10 bg-[#E91E63] text-white text-[9px] font-semibold px-3 py-1 rounded-full shadow-lg">
        Starts at ৳500
    </div>

    <div className="rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden w-52 bg-slate-900">

        {/* Header */}
        <div className="bg-[#1B2D4F] p-2.5 text-white flex items-center justify-between">
            <div>
                <div className="text-[9px] opacity-60 leading-none">Good afternoon 👋</div>
                <div className="text-[11px] font-semibold mt-0.5">Nadim Chowdhury</div>
            </div>
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[9px]">🔔</div>
        </div>

        <div className="p-2 bg-gray-100 space-y-1.5">

            {/* Cashflow card */}
            <div className="bg-[#1B2D4F] rounded-lg p-2">
                <div className="flex gap-1 bg-white/10 rounded-md p-0.5 mb-2">
                    <div className="flex-1 text-center py-1 rounded bg-white text-[8px] font-semibold text-[#1B2D4F]">Cashflow</div>
                    <div className="flex-1 text-center py-1 rounded text-[8px] text-slate-300">Dues</div>
                </div>
                <div className="text-[7px] tracking-wide text-slate-300 leading-none">NET MONTHLY PROFIT</div>
                <div className="text-base font-bold text-white mt-0.5 mb-2">৳20,000</div>
                <div className="grid grid-cols-2 gap-1.5">
                    <div className="bg-white/10 rounded-md p-1.5">
                        <div className="text-[7px] text-slate-300 leading-none">Income</div>
                        <div className="text-[10px] font-bold text-white mt-0.5">৳43,500</div>
                    </div>
                    <div className="bg-white/10 rounded-md p-1.5">
                        <div className="text-[7px] text-slate-300 leading-none">Expense</div>
                        <div className="text-[10px] font-bold text-white mt-0.5">৳23,500</div>
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-lg p-2 border border-slate-200">
                <div className="text-[8px] font-bold text-slate-400 mb-1.5">QUICK ACTIONS</div>
                <div className="flex justify-between text-center">
                    <div>
                        <div className="w-6 h-6 mx-auto mb-0.5 rounded-full bg-blue-50 flex items-center justify-center text-[10px]">👥</div>
                        <div className="text-[7px] text-slate-500">Tenants</div>
                    </div>
                    <div>
                        <div className="w-6 h-6 mx-auto mb-0.5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">🏢</div>
                        <div className="text-[7px] text-slate-500">Property</div>
                    </div>
                    <div>
                        <div className="w-6 h-6 mx-auto mb-0.5 rounded-full bg-pink-50 flex items-center justify-center text-[10px]">💰</div>
                        <div className="text-[7px] text-slate-500">Finance</div>
                    </div>
                    <div>
                        <div className="w-6 h-6 mx-auto mb-0.5 rounded-full bg-amber-50 flex items-center justify-center text-[10px]">🧾</div>
                        <div className="text-[7px] text-slate-500">Bills</div>
                    </div>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-white rounded-lg p-1.5 border border-slate-200">
                    <div className="text-xs font-bold text-[#1B2D4F] leading-none">02</div>
                    <div className="text-[7px] text-slate-500 mt-0.5">Buildings</div>
                </div>
                <div className="bg-white rounded-lg p-1.5 border border-slate-200">
                    <div className="text-xs font-bold text-[#1B2D4F] leading-none">07</div>
                    <div className="text-[7px] text-slate-500 mt-0.5">Units</div>
                </div>
                <div className="bg-white rounded-lg p-1.5 border border-slate-200">
                    <div className="text-xs font-bold text-[#1B2D4F] leading-none">50%</div>
                    <div className="text-[7px] text-slate-500 mt-0.5">Occupied</div>
                </div>
                <div className="bg-white rounded-lg p-1.5 border border-slate-200">
                    <div className="text-xs font-bold text-[#1B2D4F] leading-none">৳95K</div>
                    <div className="text-[7px] text-slate-500 mt-0.5">Dues</div>
                </div>
            </div>

            {/* Mini chart */}
            <div className="bg-white rounded-lg p-2 border border-slate-200">
                <div className="text-[8px] font-bold text-slate-700 leading-none">Rent collection</div>
                <div className="text-[7px] text-slate-400 mt-0.5 mb-1.5">Last 6 months</div>
                <div className="flex items-end gap-1 h-7">
                    <div className="flex-1 rounded-t bg-[#1B2D4F]" style={{ height: '40%' }}></div>
                    <div className="flex-1 rounded-t bg-[#1B2D4F]" style={{ height: '55%' }}></div>
                    <div className="flex-1 rounded-t bg-[#E91E63]" style={{ height: '25%' }}></div>
                    <div className="flex-1 rounded-t bg-[#1B2D4F]" style={{ height: '65%' }}></div>
                    <div className="flex-1 rounded-t bg-[#1B2D4F]" style={{ height: '45%' }}></div>
                    <div className="flex-1 rounded-t bg-[#E91E63]" style={{ height: '95%' }}></div>
                </div>
            </div>

            <div className="bg-[#1B2D4F] rounded-md p-1.5 text-white text-center text-[9px] font-semibold">
                Collect Rent →
            </div>
        </div>
    </div>
</div>
                </div>
            </section>

            {/* THE PROBLEM */}
            <section className="py-16 px-6 bg-[#1B2D4F]">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#E91E63] mb-3">
                        The Problem
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Still managing rent in a notebook?
                    </h2>
                    <p className="text-lg mb-12 text-slate-400">
                        Most Bangladeshi landlords lose money every month due to these avoidable
                        problems:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <ProblemCard icon="📒" title="Paper registers" desc="Lost records, messy tracking, no backup" />
                        <ProblemCard icon="💬" title="WhatsApp chaos" desc="Payments buried in chats, no receipts" />
                        <ProblemCard icon="❌" title="Missed payments" desc="No system to know who paid and who didn't" />
                        <ProblemCard icon="🔍" title="No expense view" desc="Repairs and costs scattered everywhere" />
                        <ProblemCard icon="📄" title="Tenant confusion" desc="NID docs, lease terms lost or misplaced" />
                        <ProblemCard icon="⚡" title="Utility billing mess" desc="Manual bills with no payment tracking" />
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-3">
                            Features
                        </span>
                        <h2 className="text-4xl font-extrabold text-[#1B2D4F] mb-4">
                            Everything in one app
                        </h2>
                        <p className="text-lg text-slate-500">No spreadsheets. No registers. No confusion.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon="📊" iconBg="bg-indigo-50" title="Financial Dashboard"
                            desc="See income, expenses, profit, and overdue dues at a glance the moment you open the app."
                            hoverBorder="border-indigo-200" hoverShadow="hover:shadow-indigo-500/5"
                        />
                        <FeatureCard
                            icon="🏠" iconBg="bg-pink-50" title="Property Management"
                            desc="Organize buildings and units with ease. Instantly identify which units are occupied or vacant."
                            hoverBorder="border-pink-200" hoverShadow="hover:shadow-pink-500/5"
                        />
                        <FeatureCard
                            icon="👥" iconBg="bg-emerald-50" title="Tenant Profiles"
                            desc="Keep all tenant data, NID copies, and lease agreements safe and accessible in one digital place."
                            hoverBorder="border-emerald-200" hoverShadow="hover:shadow-emerald-500/5"
                        />
                        <FeatureCard
                            icon="💰" iconBg="bg-amber-50" title="Rent Collection"
                            desc="Generate automated invoices and collect rent via mobile banking with instant transaction records."
                            hoverBorder="border-amber-200" hoverShadow="hover:shadow-amber-500/5"
                        />
                        <FeatureCard
                            icon="🧾" iconBg="bg-violet-50" title="Bills Management"
                            desc="Issue electricity, water, and gas bills effortlessly. Track paid and unpaid status for every tenant."
                            hoverBorder="border-violet-200" hoverShadow="hover:shadow-violet-500/5"
                        />
                        <FeatureCard
                            icon="💸" iconBg="bg-orange-50" title="Expense Tracking"
                            desc="Categorize maintenance and repair costs to understand your real net profit precisely."
                            hoverBorder="border-orange-200" hoverShadow="hover:shadow-orange-500/5"
                        />
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#E91E63] mb-3">
                            How It Works
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1B2D4F]">
                            Set up in minutes
                        </h2>
                        <p className="text-[#6B7A99]">
                            From download to your first rent receipt — all in under 10 minutes.
                        </p>
                    </div>
                    <div className="space-y-8">
                        <StepItem
                            number={1} title="Download & Subscribe"
                            desc="Get Vara Khata from the Play Store. Pick a plan, pay via bKash or Nagad, and your account is activated within 24 hours."
                        />
                        <StepItem
                            number={2} title="Add Your Properties & Units"
                            desc="Enter your building(s), add each unit with its floor, size, monthly rent, and service charges. Your portfolio is ready."
                        />
                        <StepItem
                            number={3} title="Register Your Tenants"
                            desc="Add each tenant with their phone, NID images, lease dates, and security deposit. Link them to their unit."
                        />
                        <StepItem
                            number={4} title="Collect Rent Every Month"
                            desc="Select a tenant → review their invoice → choose payment method → collect. A proper receipt is generated automatically. Done."
                        />
                    </div>
                </div>
            </section>

            {/* PRICING */}
<section id="pricing" className="py-20 px-6 bg-slate-50">
    <div className="max-w-4xl mx-auto text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-3">
            Pricing
        </span>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Transparent &amp; Simple
        </h2>
        <p className="text-slate-500 mb-10">
            Starter, Pro, and Pro Yearly plans — pick the one that fits your
            portfolio. All plans come with a 7-day money-back guarantee. Pay via
            bKash or Nagad.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <Link
                to="/subscribe"
                className="inline-flex items-center gap-2 py-4 px-10 rounded-xl bg-[#1B2D4F] text-white font-bold hover:bg-[#111E35] transition"
            >
                View Plans &amp; Pricing →
            </Link>
        </div>

        <p className="text-sm text-slate-500">
            ✅ All plans come with a <strong>7-day money-back guarantee</strong>.
            Payments accepted via bKash &amp; Nagad.
        </p>
    </div>
</section>

            {/* PAYMENT METHODS */}
            <section className="py-16 px-6 text-center bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#E91E63] mb-3">
                        Payment
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-[#1B2D4F]">
                        Pay the way you already use
                    </h2>
                    <p className="mb-10 text-[#6B7A99]">
                        No credit card or bank visit required. Pay instantly via mobile banking.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="flex items-center gap-3 px-8 py-5 rounded-2xl border-2 font-bold text-lg border-[#E91E63] text-[#E91E63] bg-[#fff0f3]">
                            <span className="text-2xl">💳</span> bKash
                        </div>
                        <div className="flex items-center gap-3 px-8 py-5 rounded-2xl border-2 font-bold text-lg border-[#F97316] text-[#F97316] bg-[#fff7ed]">
                            <span className="text-2xl">💳</span> Nagad
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center relative overflow-hidden bg-gradient-to-br from-[#111E35] via-[#1B2D4F] to-[#243a5e]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(233,30,99,0.15)_0%,transparent_60%)]" />
                <div className="max-w-2xl mx-auto relative">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to manage your properties like a pro?
                    </h2>
                    <p className="text-lg mb-8 text-slate-400">
                        Join landlords across Bangladesh who've left the notebook behind.
                    </p>
                    <Link
                        to="/subscribe"
                        className="bg-[#E91E63] hover:bg-[#c2185b] text-white text-lg px-10 py-4 rounded-xl font-semibold inline-flex items-center gap-2 transition"
                    >
                        Get Started — Pick a Plan →
                    </Link>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-10 px-6 bg-[#111E35] text-slate-400">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-[#E91E63]">
                                    ভ
                                </div>
                                <span className="font-bold text-white">Vara Khata</span>
                            </div>
                            <p className="text-sm leading-relaxed">
                                The complete rental management app for Bangladeshi landlords. Built by
                                Jabed International.
                            </p>
                        </div>
                        <div>
                            <div className="font-semibold text-white mb-3">Links</div>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <a href="#features" className="hover:text-white transition-colors">
                                        Features
                                    </a>
                                </div>
                                <div>
                                    <a href="#pricing" className="hover:text-white transition-colors">
                                        Pricing
                                    </a>
                                </div>
                                <div>
                                    <Link to="/subscribe" className="hover:text-white transition-colors">
                                        Subscribe
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold text-white mb-3">Legal</div>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <Link to="/terms" className="hover:text-white transition-colors">
                                        Terms &amp; Conditions
                                    </Link>
                                </div>
                                <div>
                                    <Link to="/privacy" className="hover:text-white transition-colors">
                                        Privacy Policy
                                    </Link>
                                </div>
                                <div>
                                    <Link to="/delete-account" className="hover:text-white transition-colors">
                                        Delete Account
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/[0.08] pt-6 text-center text-sm">
                        © 2026 Vara Khata by Jabed International. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}