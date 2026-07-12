// src/api/subscriptionApi.js
// Central place for all subscription-related API calls.
// Adjust BASE_URL to match your environment (.env -> REACT_APP_API_BASE_URL)

import { getToken } from "./api/clientApi"; // ✅ single source of truth for the auth token (vk_token)

const BASE_URL = "https://varakhata.jabedinternational.com";

/**
 * Small fetch wrapper: adds base url, JSON headers, auth token (if present),
 * and throws a normalized Error on non-2xx responses.
 */
async function apiFetch(path, options = {}) {
    const token = getToken(); // ✅ was: localStorage.getItem("authToken") — wrong/dead key, fixed

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    let body = null;
    try {
        body = await res.json();
    } catch (e) {
        // response had no JSON body
    }

    if (!res.ok) {
        const message = body?.message || `Request failed with status ${res.status}`;
        const error = new Error(message);
        error.status = res.status;
        error.body = body;
        throw error;
    }

    return body;
}

/**
 * GET /api/subscription-plans
 * Returns: { status, message, data: { plans: [...] } }
 */
export function fetchSubscriptionPlans() {
    return apiFetch("/api/subscription-plans", { method: "GET" });
}

/**
 * POST /api/subscription/subscribe/
 * payload: { plan_id, payment_method, transaction_id, amount }
 */
export function subscribeToPlan(payload) {
    return apiFetch("/api/subscription/subscribe/", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}