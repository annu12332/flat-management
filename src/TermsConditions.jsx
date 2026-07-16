import React from "react";
import { Link } from "react-router-dom";

function Section({ number, title, children }) {
    return (
        <div className="mb-6">
            <h3 className="font-bold mb-2 text-[#1B2D4F]">
                {number}. {title}
            </h3>
            {children}
        </div>
    );
}

export default function TermsAndConditions() {
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
                    <h1 className="text-3xl font-bold text-white mb-2">Terms &amp; Conditions</h1>
                    <p className="text-slate-400">
                        Please read these terms carefully before using RentBook flow.
                    </p>
                    <p className="text-slate-500 text-xs mt-2">Last updated: July 2026</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-sm leading-relaxed text-gray-700">
                    <Section number={1} title="Acceptance of Terms">
                        <p>
                            By subscribing to RentBook flow, you ("User") agree to be bound by these Terms
                            and Conditions. If you do not agree, please do not use the application.
                            These terms apply to all users of RentBook flow, developed and operated by
                            Jabed International.
                        </p>
                    </Section>

                    <Section number={2} title="Subscription & Payment">
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>
                                RentBook flow operates on a subscription-based model. Access to the app
                                requires an active, paid subscription.
                            </li>
                            
                            <li>
                                All payments are accepted via bKash or Nagad. After submitting your sender
                                number and Transaction ID, your subscription will be reviewed and
                                activated within 24 hours during business days.
                            </li>
                            <li>Subscriptions are non-transferable and tied to a single registered account.</li>
                            <li>
                                Prices are quoted in Bangladeshi Taka (৳) and are inclusive of all
                                applicable charges unless otherwise stated.
                            </li>
                            <li>
                                Subscriptions do not auto-renew. You must manually renew at the end of each
                                billing period.
                            </li>
                        </ul>
                    </Section>

                    

                    <Section number={3} title="Use of the Application">
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>
                                RentBook flow is licensed to you for personal or business use in managing
                                your own rental properties. You may not resell, sublicense, or
                                redistribute access to the app.
                            </li>
                            <li>
                                You are responsible for all data entered into the application, including
                                tenant information, transaction records, and property details.
                            </li>
                            <li>
                                You agree not to use RentBook flow for any unlawful purpose, including
                                fraudulent rental transactions, falsification of tenant records, or any
                                activity that violates Bangladesh law.
                            </li>
                            <li>
                                Multi-user or role-based access (available in Pro plans) must be limited
                                to personnel directly involved in managing your properties.
                            </li>
                        </ul>
                    </Section>

                    <Section number={4} title="Data Privacy & Security">
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>
                                RentBook flow stores tenant information, transaction records, and property
                                data on secure servers. We take reasonable precautions to protect your
                                data.
                            </li>
                            <li>
                                Tenant NID images and personal details uploaded to the app are stored
                                solely for your use as a landlord and will not be shared with third
                                parties without your consent, except as required by law.
                            </li>
                            <li>
                                You are responsible for maintaining the security of your account
                                credentials. Do not share your login information with unauthorized
                                individuals.
                            </li>
                            <li>
                                In the event of a data breach, we will notify affected users promptly and
                                take all necessary corrective actions.
                            </li>
                            <li>
                                We may collect anonymized usage data to improve the application. No
                                personally identifiable information is shared without consent.
                            </li>
                        </ul>
                        <p className="mt-2 text-gray-600">
                            For full details, see our{" "}
                            <Link to="/privacy" className="text-[#1B2D4F] font-semibold underline">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </Section>

                    <Section number={5} title="Service Availability & Updates">
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>
                                We strive to maintain 99% uptime but do not guarantee uninterrupted
                                service. Scheduled maintenance may temporarily affect access.
                            </li>
                            <li>
                                Jabed International reserves the right to update, modify, or discontinue
                                features of RentBook flow at any time, with reasonable notice where possible.
                            </li>
                            <li>
                                Feature availability varies by subscription plan. Upgrades can be made at
                                any time; downgrades take effect at the next renewal.
                            </li>
                        </ul>
                    </Section>

                    <Section number={6} title="Limitation of Liability">
                        <p>
                            RentBook flow is a tool to assist with rental management. Jabed International
                            is not responsible for financial losses, disputes between landlords and
                            tenants, or any damages arising from reliance on data within the
                            application. The app is provided "as is," without warranties of any kind
                            beyond what is expressly stated.
                        </p>
                    </Section>

                    <Section number={7} title="Termination">
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>
                                Jabed International may suspend or terminate your account if you violate
                                these Terms and Conditions.
                            </li>
                            <li>
                                Upon termination, you will lose access to the application and your data
                                may be retained for a period as required by law, after which it will be
                                permanently deleted.
                            </li>
                            <li>
                                You may request deletion of your account and all associated data at any
                                time via our{" "}
                                <Link to="/delete-account" className="text-[#1B2D4F] font-semibold underline">
                                    Delete Account
                                </Link>{" "}
                                page.
                            </li>
                        </ul>
                    </Section>

                    <Section number={8} title="Governing Law">
                        <p>
                            These Terms and Conditions are governed by the laws of the People's
                            Republic of Bangladesh. Any disputes arising from the use of RentBook flow
                            shall be subject to the jurisdiction of the courts of Bangladesh.
                        </p>
                    </Section>

                    <Section number={9} title="Changes to Terms">
                        <p>
                            Jabed International reserves the right to update these Terms and Conditions
                            at any time. Continued use of the application after changes constitutes
                            acceptance of the revised terms. Significant changes will be communicated
                            via in-app notification or email.
                        </p>
                    </Section>

                    <Section number={10} title="Contact">
                        <p>
                            For support, refund requests, or any questions regarding these terms,
                            please contact Jabed International through the official RentBook flow
                            channels provided in the app.
                        </p>
                    </Section>

                    <div className="rounded-xl p-4 mt-4 bg-[#f4f6fa] border border-[#e2e8f0]">
                        <p className="text-xs text-[#6B7A99]">
                            By submitting a payment request, you confirm that you have read,
                            understood, and agreed to these Terms and Conditions and our Privacy Policy.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center mt-8">
                    <Link
                        to="/subscribe"
                        className="bg-[#1B2D4F] hover:bg-[#111E35] text-white py-3 px-6 rounded-xl font-semibold text-sm transition"
                    >
                        Continue to Subscribe
                    </Link>
                    <Link
                        to="/privacy"
                        className="border-2 border-[#e2e8f0] hover:border-[#1B2D4F] text-[#1B2D4F] py-3 px-6 rounded-xl font-semibold text-sm transition"
                    >
                        View Privacy Policy
                    </Link>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="py-8 px-6 text-center text-sm mt-4 text-[#6B7A99]">
                <p>© 2026 RentBook Flow by Jabed International. All rights reserved.</p>
                <p className="mt-1">Questions? Contact us through the app.</p>
            </footer>
        </div>
    );
}