import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "/api" : "http://localhost:8080/api"),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

function classifyError(err) {
  if (!err) return "An unexpected error occurred.";
  if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
    return "Request timed out. The server took too long to respond.";
  }
  if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
    return "Network error. Please check your connection and try again.";
  }
  if (err.response?.status === 401) {
    return "Session expired. Please sign in again.";
  }
  if (err.response?.status >= 500) {
    return "Server error. Our team has been notified.";
  }
  if (err.response?.data?.message) {
    return err.response.data.message;
  }
  return err.message || "Failed to load data.";
}

export function getApiErrorMessage(err) {
  return classifyError(err);
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  },
);

export const authService = {
  login: async (credentials) => {
    return Promise.resolve({
      data: {
        user: {
          name: "Demo Learner",
          email: credentials.email,
        },
        token: "mock-token",
      },
    });
  },

  register: async (payload) => {
    return Promise.resolve({
      data: {
        user: {
          name: payload.name,
          email: payload.email,
        },
        token: "mock-token",
      },
    });
  },

  forgotPassword: async (email) => {
    return Promise.resolve({
      data: {
        message: `OTP code sent to ${email}.`,
      },
    });
  },

  verifyOtp: async (email, otp) => {
    return Promise.resolve({
      data: {
        token: "mock-reset-token",
        message: "OTP verified successfully.",
      },
    });
  },

  resetPassword: async (token, newPassword) => {
    return Promise.resolve({
      data: {
        message: "Password reset successfully.",
      },
    });
  },
};

export default api;
