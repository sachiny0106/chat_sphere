// frontend/src/config.js
const M_BASE_URL_FROM_ENV = process.env.REACT_APP_BACKEND_BASE_URL;
const resolvedBaseUrl = M_BASE_URL_FROM_ENV || "http://localhost:8080";
if (!M_BASE_URL_FROM_ENV && process.env.NODE_ENV !== 'test') {
    console.warn(
        "[Frontend config.js] REACT_APP_BACKEND_BASE_URL is not set. Falling back to default:", resolvedBaseUrl,
        "Ensure .env file is in frontend root & dev server was restarted."
    );
}
export const BASE_URL = resolvedBaseUrl;
