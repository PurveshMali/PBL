import axios from "axios";

const uniqueBases = (bases) => Array.from(new Set((bases || []).filter(Boolean)));

const joinUrl = (base, path) => {
  const normalizedBase = String(base).replace(/\/+$/, "");
  const normalizedPath = String(path).replace(/^\/+/, "");
  return `${normalizedBase}/${normalizedPath}`;
};

export const AUTH_API_BASES = uniqueBases([
  import.meta.env.VITE_AUTH_API_URL,
  "http://localhost:3001",
  "http://localhost:3000",
]);

export const ANALYTICS_API_BASES = uniqueBases([
  import.meta.env.VITE_ANALYTICS_API_URL,
  "http://127.0.0.1:5000",
]);

export const PREDICTION_API_BASES = uniqueBases([
  import.meta.env.VITE_PREDICTION_API_URL,
  "http://127.0.0.1:8081",
  "http://127.0.0.1:8080",
]);

export const requestWithFallback = async ({ bases, path, method = "get", data, headers }) => {
  let lastError = null;

  for (const base of uniqueBases(bases)) {
    try {
      return await axios({
        method,
        url: joinUrl(base, path),
        data,
        headers,
      });
    } catch (error) {
      lastError = error;
      if (error?.response && error.response.status < 500) {
        throw error;
      }
    }
  }

  throw lastError || new Error("All API endpoints failed.");
};

export const authRequest = (options) =>
  requestWithFallback({
    bases: AUTH_API_BASES,
    ...options,
  });

export const analyticsRequest = (options) =>
  requestWithFallback({
    bases: ANALYTICS_API_BASES,
    ...options,
  });

export const predictionRequest = (options) =>
  requestWithFallback({
    bases: PREDICTION_API_BASES,
    ...options,
  });
