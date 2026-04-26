import axios from "axios";

const api = axios.create({
  baseURL: window.location.hostname === "localhost" 
    ? "http://localhost:5000/api" 
    : "https://vexora-backend-1.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    // If Authorization header is already set (e.g. manually in AuthContext), respect it
    if (config.headers.Authorization) return config;

    const token = localStorage.getItem("token");
    const customerToken = localStorage.getItem("customerToken");

    // Logic: Use customerToken for customer routes, storefront pages, or if only customer is logged in
    const isStorefrontPath = window.location.pathname.startsWith('/store') || window.location.pathname === '/my-orders';
    const isCustomerApi = config.url.includes("/customer-auth") || config.url.includes("/orders/my-orders");

    if (isStorefrontPath || isCustomerApi || (!token && customerToken)) {
      if (customerToken) {
        config.headers.Authorization = `Bearer ${customerToken}`;
      } else if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (customerToken) {
      config.headers.Authorization = `Bearer ${customerToken}`;
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
