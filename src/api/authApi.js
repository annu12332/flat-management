// src/api/authApi.js
import { apiFetch, setToken, clearToken } from "./clientApi";

/**
 * POST /api/auth/login
 * payload: { email, password }
 * Response shape (Laravel Sanctum style): { status, message, data: { token, user } }
 * Adjust the destructuring below if your backend nests the token differently.
 */
export async function login({ email, password }, rememberMe = true) {
    const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    const token = res?.data?.token || res?.token;
    if (!token) {
        throw new Error("Login succeeded but no token was returned by the server.");
    }

    setToken(token, rememberMe);
    return res?.data?.user || res?.user || null;
}

/**
 * POST /api/auth/register
 * payload: { name, email, password, password_confirmation }
 */
export function register(payload) {
    return apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/** GET /api/auth/me */
export function fetchCurrentUser() {
    return apiFetch("/api/auth/me", { method: "GET" });
}

/** PUT /api/auth/update-profile */
export function updateProfile(payload) {
    return apiFetch("/api/auth/update-profile", {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

/** POST /api/auth/logout */
export async function logout() {
    try {
        await apiFetch("/api/auth/logout", { method: "POST" });
    } finally {
        // Always clear locally, even if the network call fails —
        // the user should never get stuck "logged in" on a dead token.
        clearToken();
    }
}

/** POST /api/forgot-password  -> { email } */
export function forgotPassword(email) {
    return apiFetch("/api/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

/** POST /api/verify-reset-pin -> { email, pin } */
export function verifyResetPin(email, pin) {
    return apiFetch("/api/verify-reset-pin", {
        method: "POST",
        body: JSON.stringify({ email, pin }),
    });
}

/** POST /api/reset-password -> { email, pin, password, password_confirmation } */
export function resetPassword(payload) {
    return apiFetch("/api/reset-password", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}