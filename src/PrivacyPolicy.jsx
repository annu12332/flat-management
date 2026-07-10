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

export default function PrivacyPolicy() {
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
                    <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
                    <p className="text-slate-400">
                        How Vara Khata collects, uses, and protects your information.
                    </p>
                    <p className="text-slate-500 text-xs mt-2">Last updated: July 2026</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-sm leading-relaxed text-gray-700">
                    <p className="mb-6 text-gray-600">
                        Jabed International ("we", "us", "our") operates the Vara Khata rental
                        management application. This Privacy Policy explains what information we
                        collect from landlords and their tenants, how we use it, and the choices you
                        have. By using Vara Khata, you agree to the collection and use of
                        information as described here.
                    </p>

                    <Section number={1} title="Information We Collect">
                        <p className="mb-2 text-gray-600">We collect the following categories of information:</p>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>
                                <strong>Account information:</strong> your name, mobile number, email
                                address, and login credentials.
                            </li>
                            <li>
                                <strong>Property & unit data:</strong> building addresses, unit details,
                                rent amounts, and service charges you enter into the app.
                            </li>
                            <li>
                                <strong>Tenant information:</strong> tenant names, phone numbers, NID
                                images, lease terms, and security deposit records that you upload.
                            </li>
                            <li>
                                <strong>Payment information:</strong> bKash/Nagad sender number and
                                Transaction ID submitted when you subscribe. We do not collect or store
                                your mobile banking PIN.
                            </li>
                            <li>
                                <strong>Usage data:</strong> app interactions, device type, and log data,
                                collected in anonymized form to help us improve the product.
                            </li>
                        </ul>
                    </Section>

                    <Section number={2} title="How We Use Your Information">
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>To create and manage your Vara Khata account and subscription.</li>
                            <li>To verify subscription payments and activate your account.</li>
                            <li>
                                To provide core features such as rent collection, tenant management, and
                                financial reporting.
                            </li>
                            <li>To send service-related notifications (payment reminders, renewal alerts).</li>
                            <li>To respond to support requests and resolve disputes.</li>
                            <li>To improve app performance, security, and reliability.</li>
                        </ul>
                    </Section>

                    <Section number={3} title="Tenant Data — Landlord Responsibility">
                        <p className="text-gray-600">
                            Tenant information (including NID images and lease details) is entered by
                            landlords for their own record-keeping. Landlords are responsible for
                            obtaining appropriate consent from their tenants before uploading personal
                            data. Jabed International acts only as a data processor for this
                            information and does not use tenant data for any purpose beyond providing
                            the app's functionality to the landlord.
                        </p>
                    </Section>

                    <Section number={4} title="Data Sharing & Disclosure">
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>We do not sell your personal data or your tenants' personal data to third parties.</li>
                            <li>
                                We may share limited information with trusted service providers (e.g.
                                hosting, SMS gateways) strictly to operate the app, under confidentiality
                                obligations.
                            </li>
                            <li>
                                We may disclose information if required by law, court order, or to
                                protect the rights, property, or safety of Jabed International, our
                                users, or the public.
                            </li>
                        </ul>
                    </Section>

                    <Section number={5} title="Data Storage & Security">
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>Your data is stored on secure servers with access controls and encryption in transit.</li>
                            <li>
                                We take reasonable technical and organizational measures to protect
                                against unauthorized access, alteration, disclosure, or destruction of
                                your data.
                            </li>
                            <li>
                                No method of transmission or storage is 100% secure; while we strive to
                                protect your data, we cannot guarantee absolute security.
                            </li>
                            <li>
                                In the event of a data breach affecting your personal information, we
                                will notify you promptly and take corrective action.
                            </li>
                        </ul>
                    </Section>

                    <Section number={6} title="Data Retention">
                        <p className="text-gray-600">
                            We retain your account and property/tenant data for as long as your
                            account is active, or as needed to provide you the service. If you request
                            account deletion, we will delete or anonymize your personal data within a
                            reasonable period, except where retention is required by law (e.g.
                            financial record-keeping obligations).
                        </p>
                    </Section>

                    <Section number={7} title="Your Rights & Choices">
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                            <li>You can access, update, or correct your account information at any time within the app.</li>
                            <li>
                                You can request deletion of your account and associated data via our{" "}
                                <Link to="/delete-account" className="text-[#1B2D4F] font-semibold underline">
                                    Delete Account
                                </Link>{" "}
                                page.
                            </li>
                            <li>You can opt out of non-essential notifications from within app settings.</li>
                            <li>
                                You may contact us at any time to ask what personal data we hold about
                                you.
                            </li>
                        </ul>
                    </Section>

                    <Section number={8} title="Children's Privacy">
                        <p className="text-gray-600">
                            Vara Khata is intended for use by adults managing rental properties. We do
                            not knowingly collect personal information from children under 18.
                        </p>
                    </Section>

                    <Section number={9} title="Changes to This Policy">
                        <p className="text-gray-600">
                            We may update this Privacy Policy from time to time. Material changes will
                            be communicated via in-app notification or email. Continued use of Vara
                            Khata after changes take effect constitutes acceptance of the revised
                            policy.
                        </p>
                    </Section>

                    <Section number={10} title="Contact Us">
                        <p className="text-gray-600">
                            If you have questions about this Privacy Policy or how your data is
                            handled, please contact Jabed International through the official Vara
                            Khata channels provided in the app.
                        </p>
                    </Section>

                    <div className="rounded-xl p-4 mt-4 bg-[#f4f6fa] border border-[#e2e8f0]">
                        <p className="text-xs text-[#6B7A99]">
                            This Privacy Policy should be read together with our{" "}
                            <Link to="/terms" className="text-[#1B2D4F] font-semibold underline">
                                Terms &amp; Conditions
                            </Link>
                            .
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
                        to="/terms"
                        className="border-2 border-[#e2e8f0] hover:border-[#1B2D4F] text-[#1B2D4F] py-3 px-6 rounded-xl font-semibold text-sm transition"
                    >
                        View Terms &amp; Conditions
                    </Link>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="py-8 px-6 text-center text-sm mt-4 text-[#6B7A99]">
                <p>© 2026 Vara Khata by Jabed International. All rights reserved.</p>
                <p className="mt-1">Questions? Contact us through the app.</p>
            </footer>
        </div>
    );
}