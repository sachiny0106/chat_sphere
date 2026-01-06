// frontend/src/config.js
const envBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
const isBrowser = typeof window !== "undefined";
const inferredBaseUrl = isBrowser && window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://chat-sphere-znbh.onrender.com";

const resolvedBaseUrl = envBaseUrl || inferredBaseUrl;

if (!envBaseUrl && process.env.NODE_ENV !== "test") {
    console.warn("[Frontend config.js] Using fallback backend URL:", resolvedBaseUrl,
        "Set REACT_APP_BACKEND_BASE_URL in frontend/.env to override this.");
}

export const BASE_URL = resolvedBaseUrl;
