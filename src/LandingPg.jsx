import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import logo from "./assets/logo.png"
import bkash from "./assets/bkash.png"
import nagad from "./assets/nagad.png"
import playstore from "./assets/playstore.png"

/* ---------- Theme colors (match original CSS vars) ----------
   navy       #1B2D4F
   navy-dark  #111E35
   blue       #2563EB
   blue-dark  #1D4ED8
   blue-light #EFF6FF
   slate      #E8EDF5
   muted      #6B7A99
---------------------------------------------------------------*/

/* ---------- Global keyframes / animation utility classes ---------- */
function AnimationStyles() {
    return (
        <style>{`
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(28px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes floatY {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
            @keyframes floatYSlow {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-6px); }
            }
            @keyframes pulseGlow {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
            }
            @keyframes growBar {
                from { transform: scaleY(0); }
                to { transform: scaleY(1); }
            }

            .reveal {
                opacity: 0;
                transform: translateY(28px);
                transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
                will-change: opacity, transform;
            }
            .reveal-visible {
                opacity: 1;
                transform: translateY(0);
            }
            .animate-float {
                animation: floatY 4s ease-in-out infinite;
            }
            .animate-float-slow {
                animation: floatYSlow 5.5s ease-in-out infinite;
            }
            .animate-pulse-glow {
                animation: pulseGlow 4.5s ease-in-out infinite;
            }
            .bar-grow {
                transform-origin: bottom;
                animation: growBar 0.9s cubic-bezier(0.16,1,0.3,1) both;
            }
            .btn-pop {
                transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
            }
            .btn-pop:hover {
                transform: translateY(-2px) scale(1.03);
            }
            .btn-pop:active {
                transform: translateY(0) scale(0.98);
            }
            .card-rise {
                transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s ease;
            }

            @media (prefers-reduced-motion: reduce) {
                .reveal {
                    opacity: 1 !important;
                    transform: none !important;
                    transition: none !important;
                }
                .animate-float, .animate-float-slow, .animate-pulse-glow, .bar-grow {
                    animation: none !important;
                }
                .btn-pop:hover, .btn-pop:active {
                    transform: none !important;
                }
            }
        `}</style>
    );
}

/* ---------- Scroll-reveal wrapper ---------- */
function Reveal({ children, className = "", delay = 0, as = "div" }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const Tag = as;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </Tag>
    );
}

function FeatureCard({ icon, iconBg, title, desc, hoverBorder, hoverShadow }) {
    return (
        <div
            className={`group card-rise p-8 bg-white rounded-2xl border border-slate-200 hover:${hoverBorder} hover:shadow-xl hover:-translate-y-1.5 ${hoverShadow} transition-all duration-300`}
        >
            <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl ${iconBg} text-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
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
        <div className="card-rise rounded-xl p-5 bg-white/5 border border-white/10 text-left hover:bg-white/10 hover:-translate-y-1 hover:border-white/20">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="text-sm font-semibold text-white mb-1">{title}</div>
            <div className="text-xs text-slate-400">{desc}</div>
        </div>
    );
}

function StepItem({ number, title, desc }) {
    return (
        <div className="flex gap-6 items-start group">
            <div className="w-10 h-10 rounded-full bg-[#1B2D4F] text-white font-bold flex items-center justify-center text-[15px] flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#2563EB]">
                {number}
            </div>
            <div className="pt-1">
                <h3 className="font-bold text-lg mb-1 text-[#1B2D4F]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#6B7A99]">{desc}</p>
            </div>
        </div>
    );
}

/* ---------- Dummy QR code (visual placeholder only, not scannable) ---------- */
function DummyQRCode() {
    // Deterministic pseudo-random-looking module pattern for a fake QR code.
    const size = 21; // 21x21 modules, like a small QR grid
    const seedPattern = [];
    let seed = 42;
    const rand = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };

    for (let r = 0; r < size; r++) {
        const row = [];
        for (let c = 0; c < size; c++) {
            row.push(rand() > 0.5);
        }
        seedPattern.push(row);
    }

    const isFinder = (r, c) => {
        const inTopLeft = r < 7 && c < 7;
        const inTopRight = r < 7 && c > size - 8;
        const inBottomLeft = r > size - 8 && c < 7;
        return inTopLeft || inTopRight || inBottomLeft;
    };

    const cellSize = 8;
    const dim = size * cellSize;

    const FinderMarker = ({ x, y }) => (
        <g transform={`translate(${x}, ${y})`}>
            <rect width={cellSize * 7} height={cellSize * 7} fill="#1B2D4F" />
            <rect x={cellSize} y={cellSize} width={cellSize * 5} height={cellSize * 5} fill="#ffffff" />
            <rect x={cellSize * 2} y={cellSize * 2} width={cellSize * 3} height={cellSize * 3} fill="#1B2D4F" />
        </g>
    );

    return (
        <svg
            viewBox={`0 0 ${dim} ${dim}`}
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Dummy QR code placeholder"
        >
            <rect width={dim} height={dim} fill="#ffffff" />
            {seedPattern.map((row, r) =>
                row.map((filled, c) => {
                    if (!filled || isFinder(r, c)) return null;
                    return (
                        <rect
                            key={`${r}-${c}`}
                            x={c * cellSize}
                            y={r * cellSize}
                            width={cellSize}
                            height={cellSize}
                            fill="#1B2D4F"
                        />
                    );
                })
            )}
            <FinderMarker x={0} y={0} />
            <FinderMarker x={(size - 7) * cellSize} y={0} />
            <FinderMarker x={0} y={(size - 7) * cellSize} />
        </svg>
    );
}

/* ---------- Generic "app store" style install badge icon ---------- */
function StoreBadgeIcon() {
    return (
        <span className="w-7 h-7 rounded-md bg-gradient-to-br from-[#34D399] via-[#3B82F6] to-[#EF4444] flex items-center justify-center flex-shrink-0">
            <Play className="w-3.5 h-3.5 text-white fill-white" strokeWidth={0} />
        </span>
    );
}

export default function LandingPage() {
    return (
        <div className="font-['Inter',sans-serif] text-[#1B2D4F] bg-[#f4f6fa]">
            <AnimationStyles />

            {/* NAV */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 py-4 px-6" style={{ animation: "fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}>
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="RB"
                            className="w-9 h-9 rounded-xl object-cover"
                        />                        <span className="font-bold text-lg text-[#1B2D4F]">RentBook Flow</span>
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
                        className="btn-pop bg-[#1B2D4F] hover:bg-[#111E35] text-white py-2.5 px-5 rounded-xl font-semibold text-sm inline-flex items-center gap-2 transition"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#111E35] via-[#1B2D4F] to-[#243a5e] py-16 md:py-24">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(37,99,235,0.15)_0%,transparent_60%)] animate-pulse-glow" />
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative">
                    {/* Content */}
                    <div>
                        <div
                            className="inline-flex items-center gap-1.5 bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#93C5FD] px-3.5 py-1.5 rounded-full text-[13px] font-medium mb-6"
                            style={{ animation: "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both" }}
                        >
                            🇧🇩 Built for Bangladesh
                        </div>
                        <h1
                            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
                            style={{ animation: "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both 0.1s" }}
                        >
                            Manage your rentals <br />
                            <span className="text-blue-300">with ease</span>
                        </h1>
                        <p
                            className="text-lg mb-4 font-medium text-white"
                            style={{ animation: "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both 0.2s" }}
                        >
                            Run your entire rental business from your phone.
                        </p>
                        <p
                            className="mb-8 text-slate-400 leading-relaxed"
                            style={{ animation: "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both 0.3s" }}
                        >
                            RentBook flow is the all-in-one rental management app built for Bangladeshi
                            landlords. Track rent, tenants, bills, and expenses — no notebooks, no
                            WhatsApp chaos, no confusion.
                        </p>
                        <div
                            className="flex flex-wrap gap-4 mb-10"
                            style={{ animation: "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both 0.4s" }}
                        >
                            <Link
                                to="/subscribe"
                                className="btn-pop bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3.5 px-8 rounded-xl font-semibold text-[15px] inline-flex items-center gap-2 transition"
                            >
                                Choose a Plan →
                            </Link>
                            <a
                                href="#features"
                                className="btn-pop bg-white/10 border border-white/20 text-white py-3.5 px-8 rounded-xl font-semibold text-[15px] inline-flex items-center gap-2 transition"
                            >
                                See Features
                            </a>
                        </div>
                        {/* Stats */}
                        <div
                            className="grid grid-cols-3 gap-4"
                            style={{ animation: "fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both 0.5s" }}
                        >
                            <div className="bg-white/[0.06] border border-white/[0.12] rounded-2xl p-6 text-center transition-transform duration-300 hover:-translate-y-1">
                                <div className="text-2xl font-bold text-white">৳500</div>
                                <div className="text-xs mt-1 text-slate-400">Starts at</div>
                            </div>

                            <div className="bg-white/[0.06] border border-white/[0.12] rounded-2xl p-6 text-center transition-transform duration-300 hover:-translate-y-1">
                                <div className="text-2xl font-bold text-white">24hr</div>
                                <div className="text-xs mt-1 text-slate-400">Activation</div>
                            </div>
                        </div>
                    </div>

                    {/* Phone mockup */}
                    <div
                        className="flex justify-center md:justify-end relative"
                        style={{ animation: "fadeIn 0.9s ease both 0.3s" }}
                    >

                        {/* Floating badge — top */}
                        <div className="hidden md:flex absolute -top-3 left-2 z-10 items-center gap-1.5 bg-white rounded-xl border border-slate-200 shadow-lg px-2.5 py-1.5 animate-float">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px]">✓</div>
                            <div>
                                <div className="text-[8px] text-slate-400 leading-none">Rent collected</div>
                                <div className="text-[10px] font-bold text-[#1B2D4F] leading-none mt-0.5">৳43,500</div>
                            </div>
                        </div>

                        {/* Floating badge — bottom */}
                        <div className="hidden md:flex absolute -bottom-3 -left-4 z-10 items-center gap-1.5 bg-white rounded-xl border border-blue-200 shadow-lg px-2.5 py-1.5 animate-float-slow">
                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[#2563EB] text-[10px]">🏠</div>
                            <div>
                                <div className="text-[8px] text-slate-400 leading-none">Occupied</div>
                                <div className="text-[10px] font-bold text-[#1B2D4F] leading-none mt-0.5">4 of 7</div>
                            </div>
                        </div>

                        {/* Pill badge */}
                        <div className="hidden md:block absolute top-4 -left-2 z-10 bg-[#2563EB] text-white text-[9px] font-semibold px-3 py-1 rounded-full shadow-lg animate-float-slow">
                            Starts at ৳500
                        </div>

                        <div className="rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden w-52 bg-slate-900 transition-transform duration-500 hover:-translate-y-1">

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
                                            <div className="w-6 h-6 mx-auto mb-0.5 rounded-full bg-blue-50 flex items-center justify-center text-[10px]">💰</div>
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
                                        <div className="flex-1 rounded-t bg-[#1B2D4F] bar-grow" style={{ height: '40%', animationDelay: '0.1s' }}></div>
                                        <div className="flex-1 rounded-t bg-[#1B2D4F] bar-grow" style={{ height: '55%', animationDelay: '0.2s' }}></div>
                                        <div className="flex-1 rounded-t bg-[#2563EB] bar-grow" style={{ height: '25%', animationDelay: '0.3s' }}></div>
                                        <div className="flex-1 rounded-t bg-[#1B2D4F] bar-grow" style={{ height: '65%', animationDelay: '0.4s' }}></div>
                                        <div className="flex-1 rounded-t bg-[#1B2D4F] bar-grow" style={{ height: '45%', animationDelay: '0.5s' }}></div>
                                        <div className="flex-1 rounded-t bg-[#2563EB] bar-grow" style={{ height: '95%', animationDelay: '0.6s' }}></div>
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
                    <Reveal>
                        <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#2563EB] mb-3">
                            The Problem
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Still managing rent in a notebook?
                        </h2>
                        <p className="text-lg mb-12 text-slate-400">
                            Most Bangladeshi landlords lose money every month due to these avoidable
                            problems:
                        </p>
                    </Reveal>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Reveal delay={0}><ProblemCard icon="📒" title="Paper registers" desc="Lost records, messy tracking, no backup" /></Reveal>
                        <Reveal delay={80}><ProblemCard icon="💬" title="WhatsApp chaos" desc="Payments buried in chats, no receipts" /></Reveal>
                        <Reveal delay={160}><ProblemCard icon="❌" title="Missed payments" desc="No system to know who paid and who didn't" /></Reveal>
                        <Reveal delay={240}><ProblemCard icon="🔍" title="No expense view" desc="Repairs and costs scattered everywhere" /></Reveal>
                        <Reveal delay={320}><ProblemCard icon="📄" title="Tenant confusion" desc="NID docs, lease terms lost or misplaced" /></Reveal>
                        <Reveal delay={400}><ProblemCard icon="⚡" title="Utility billing mess" desc="Manual bills with no payment tracking" /></Reveal>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <Reveal className="text-center mb-16" as="div">
                        <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-3">
                            Features
                        </span>
                        <h2 className="text-4xl font-extrabold text-[#1B2D4F] mb-4">
                            Everything in one app
                        </h2>
                        <p className="text-lg text-slate-500">No spreadsheets. No registers. No confusion.</p>
                    </Reveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Reveal delay={0}>
                            <FeatureCard
                                icon="📊" iconBg="bg-indigo-50" title="Financial Dashboard"
                                desc="See income, expenses, profit, and overdue dues at a glance the moment you open the app."
                                hoverBorder="border-indigo-200" hoverShadow="hover:shadow-indigo-500/5"
                            />
                        </Reveal>
                        <Reveal delay={80}>
                            <FeatureCard
                                icon="🏠" iconBg="bg-sky-50" title="Property Management"
                                desc="Organize buildings and units with ease. Instantly identify which units are occupied or vacant."
                                hoverBorder="border-sky-200" hoverShadow="hover:shadow-sky-500/5"
                            />
                        </Reveal>
                        <Reveal delay={160}>
                            <FeatureCard
                                icon="👥" iconBg="bg-emerald-50" title="Tenant Profiles"
                                desc="Keep all tenant data, NID copies, and lease agreements safe and accessible in one digital place."
                                hoverBorder="border-emerald-200" hoverShadow="hover:shadow-emerald-500/5"
                            />
                        </Reveal>
                        <Reveal delay={0}>
                            <FeatureCard
                                icon="💰" iconBg="bg-amber-50" title="Rent Collection"
                                desc="Generate automated invoices and collect rent via mobile banking with instant transaction records."
                                hoverBorder="border-amber-200" hoverShadow="hover:shadow-amber-500/5"
                            />
                        </Reveal>
                        <Reveal delay={80}>
                            <FeatureCard
                                icon="🧾" iconBg="bg-violet-50" title="Bills Management"
                                desc="Issue electricity, water, and gas bills effortlessly. Track paid and unpaid status for every tenant."
                                hoverBorder="border-violet-200" hoverShadow="hover:shadow-violet-500/5"
                            />
                        </Reveal>
                        <Reveal delay={160}>
                            <FeatureCard
                                icon="💸" iconBg="bg-cyan-50" title="Expense Tracking"
                                desc="Categorize maintenance and repair costs to understand your real net profit precisely."
                                hoverBorder="border-cyan-200" hoverShadow="hover:shadow-cyan-500/5"
                            />
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <Reveal className="text-center mb-14">
                        <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#2563EB] mb-3">
                            How It Works
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1B2D4F]">
                            Set up in minutes
                        </h2>
                        <p className="text-[#6B7A99]">
                            From download to your first rent receipt — all in under 10 minutes.
                        </p>
                    </Reveal>
                    <div className="space-y-8">
                        <Reveal delay={0}>
                            <StepItem
                                number={1} title="Download & Subscribe"
                                desc="Get RentBook flow from the Play Store. Pick a plan, pay via bKash or Nagad, and your account is activated within 24 hours."
                            />
                        </Reveal>
                        <Reveal delay={100}>
                            <StepItem
                                number={2} title="Add Your Properties & Units"
                                desc="Enter your building(s), add each unit with its floor, size, monthly rent, and service charges. Your portfolio is ready."
                            />
                        </Reveal>
                        <Reveal delay={200}>
                            <StepItem
                                number={3} title="Register Your Tenants"
                                desc="Add each tenant with their phone, NID images, lease dates, and security deposit. Link them to their unit."
                            />
                        </Reveal>
                        <Reveal delay={300}>
                            <StepItem
                                number={4} title="Collect Rent Every Month"
                                desc="Select a tenant → review their invoice → choose payment method → collect. A proper receipt is generated automatically. Done."
                            />
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* DOWNLOAD APP / QR CODE */}
            <section id="download" className="py-20 px-6 bg-[#1B2D4F] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(37,99,235,0.12)_0%,transparent_60%)] animate-pulse-glow" />
                <div className="max-w-5xl mx-auto relative grid md:grid-cols-2 gap-12 items-center">
                    <Reveal className="text-center md:text-left">
                        <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#2563EB] mb-3">
                            Download The App
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Scan to install RentBook flow
                        </h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Open your phone's camera, point it at the QR code, and tap the link to
                            download the app directly from the Play Store. No searching required.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <a
                                href="#"
                                className="btn-pop bg-black hover:bg-black/80 text-white py-3 px-6 rounded-xl font-semibold text-[15px] inline-flex items-center gap-3 transition"
                            >
<img
                            src={playstore}
                            alt="RB"
                            className="w-9 h-9 rounded-xl object-cover"
                        />                                   <span className="flex flex-col items-start leading-tight">
                                    <span className="text-[10px] font-normal text-slate-300">GET IT ON</span>
                                    <span className="text-sm font-bold">Google Play</span>
                                </span>
                            </a>
                        </div>
                    </Reveal>

                    <Reveal delay={150} className="flex justify-center">
                        <div className="bg-white rounded-3xl p-6 shadow-[0_32px_80px_rgba(0,0,0,0.35)] w-64 animate-float-slow">
                            <div className="w-full aspect-square rounded-xl overflow-hidden border border-slate-100">
                                <DummyQRCode />
                            </div>
                            <div className="text-center mt-4">
                                <div className="text-sm font-bold text-[#1B2D4F]">Scan with your camera</div>
                                <div className="text-xs text-slate-400 mt-1">RentBook flow • Android App</div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* PRICING */}
            <section id="pricing" className="py-20 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto text-center">
                    <Reveal>
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
                                className="btn-pop inline-flex items-center gap-2 py-4 px-10 rounded-xl bg-[#1B2D4F] text-white font-bold hover:bg-[#111E35] transition"
                            >
                                View Plans &amp; Pricing →
                            </Link>
                        </div>

                        <p className="text-sm text-slate-500">
                            ✅ All plans come with a <strong>7-day money-back guarantee</strong>.
                            Payments accepted via bKash &amp; Nagad.
                        </p>
                    </Reveal>
                </div>
            </section>

            {/* PAYMENT METHODS */}
            <section className="py-16 px-6 text-center bg-white">
                <div className="max-w-3xl mx-auto">
                    <Reveal>
                        <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#2563EB] mb-3">
                            Payment
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-[#1B2D4F]">
                            Pay the way you already use
                        </h2>
                        <p className="mb-10 text-[#6B7A99]">
                            No credit card or bank visit required. Pay instantly via mobile banking.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="card-rise flex items-center gap-3 px-8 py-5 rounded-2xl border-2 font-bold text-lg border-pink-600 text-pink-600 bg-[#eff6ff] hover:-translate-y-1">
                                <img src={bkash} alt="bKash" className="w-8 h-8 object-contain" />
                                bKash
                            </div>
                            <div className="card-rise flex items-center gap-3 px-8 py-5 rounded-2xl border-2 font-bold text-lg border-yellow-500 text-yellow-500 bg-[#f0f9ff] hover:-translate-y-1">
                                <img src={nagad} alt="Nagad" className="w-8 h-8 object-contain" />
                                Nagad
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center relative overflow-hidden bg-gradient-to-br from-[#111E35] via-[#1B2D4F] to-[#243a5e]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(37,99,235,0.15)_0%,transparent_60%)] animate-pulse-glow" />
                <Reveal className="max-w-2xl mx-auto relative">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to manage your properties like a pro?
                    </h2>
                    <p className="text-lg mb-8 text-slate-400">
                        Join landlords across Bangladesh who've left the notebook behind.
                    </p>
                    <Link
                        to="/subscribe"
                        className="btn-pop bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-lg px-10 py-4 rounded-xl font-semibold inline-flex items-center gap-2 transition"
                    >
                        Get Started — Pick a Plan →
                    </Link>
                </Reveal>
            </section>

            {/* FOOTER */}
            <footer className="py-10 px-6 bg-[#111E35] text-slate-400">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <img
                                    src={logo}
                                    alt="RB"
                                    className="w-9 h-9 rounded-xl object-cover"
                                />
                                <span className="font-bold text-white">RentBook flow</span>
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
                        <div>
                            <div className="font-semibold text-white mb-3">Contact</div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <span className="mt-0.5">✉️</span>
                                    
                                        <a href="mailto:support@rentbookflow.com"
                                        className="hover:text-white transition-colors"
                                    >
                                        rentbookflow@thinkcodify.com
                                    </a>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="mt-0.5">📍</span>
                                    <span>Tower 263,Jubilee Road, Kotwali, Chattogram, Bangladesh</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/[0.08] pt-6 text-center text-sm">
                        © 2026 RentBook flow by Jabed International. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}