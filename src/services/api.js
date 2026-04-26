import axios from "axios";

const api = axios.create({
  baseURL: "https://vexora-backend-1.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const customerToken = localStorage.getItem("customerToken");

    // Logic: Use customerToken for customer routes or if specifically logged in as customer
    // Otherwise use the main admin token
    if (config.url.includes("/customer-auth") || (!token && customerToken)) {
      if (customerToken) config.headers.Authorization = `Bearer ${customerToken}`;
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear whichever token might be invalid
      if (window.location.pathname.includes("/store")) {
        localStorage.removeItem("customerToken");
      } else {
        localStorage.removeItem("token");
        if (window.location.pathname.startsWith("/dashboard")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
