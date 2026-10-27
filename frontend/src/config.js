
const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export const API_BASE_URL = `${BACKEND_URL}/api`;

export const BACKEND_ORIGIN = BACKEND_URL;

export const WS_BASE_URL = (
  import.meta.env.VITE_WS_URL ||
  (BACKEND_ORIGIN.startsWith("https://")
    ? BACKEND_ORIGIN.replace(/^https:/, "wss:")
    : BACKEND_ORIGIN.replace(/^http:/, "ws:"))
).replace(/\/+$/, "");