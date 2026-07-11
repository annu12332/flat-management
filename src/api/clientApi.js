// src/api/client.js
// Single shared fetch wrapper used by every api/*.js file.
// Handles: base URL, JSON headers, bearer token injection, token storage,
// normalized errors, and a global 401 handler so any expired-token page
// can react the same way (e.g. redirect to /login).

const BASE_URL = "https://varakhata.jabedinternational.com";

const TOKEN_KEY = "vk_token"; // single source of truth for the storage key

/** Save token. `persist = true` -> survives browser restarts (localStorage). */
export function setToken(token, persist = true) {
    clearToken();
    if (persist) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        sessionStorage.setItem(TOKEN_KEY, token);
    }
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}

/** Listeners fired when any request gets a 401 (token missing/expired). */
const unauthorizedListeners = new Set();
export function onUnauthorized(listener) {
    unauthorizedListeners.add(listener);
    return () => unauthorizedListeners.delete(listener);
}

export async function apiFetch(path, options = {}) {
    const token = getToken();

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    let body = null;
    try {
        body = await res.json();
    } catch (e) {
        // no JSON body (e.g. 204 No Content) — fine
    }

    if (!res.ok) {
        const message = body?.message || `Request failed with status ${res.status}`;
        const error = new Error(message);
        error.status = res.status;
        error.body = body;
        error.errors = body?.errors; // Laravel-style validation errors

        if (res.status === 401) {
            clearToken();
            unauthorizedListeners.forEach((listener) => listener());
        }

        throw error;
    }

    return body;
}