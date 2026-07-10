import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPg";
import SubscribePage from "./Subscribe";
import PaymentPage from "./Payment";
import TermsAndConditions from "./TermsConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import DeleteAccount from "./DeleteAcc";



/*
  Install dependencies first:
    npm install react-router-dom crypto-js

  This file is just a reference for wiring routes — merge it into your
  existing App.jsx / main.jsx as needed.
*/
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/subscribe" element={<SubscribePage />} />
        <Route path="/subscribe/payment" element={<PaymentPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
      </Routes>
    </BrowserRouter>
  );
}