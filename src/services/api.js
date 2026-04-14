import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if user is already authenticated (token expired)
    // Do not redirect during authentication requests
    if (error.response?.status === 401) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      // Only redirect if user was previously authenticated (has token)
      if (user.token) {
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Login (user/admin) with email and password
 */
export const loginCitizen = async (email, password, role = 'citizen') => {
  try {
    const response = await api.post("/auth/login", { email, password, role });
    return {
      success: true,
      user: {
        id: response.data._id,
        email: response.data.email,
        role: response.data.role,
        token: response.data.token,
      },
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

/**
 * Signup (user/admin) with email and password
 */
export const signupCitizen = async (email, password, role = 'citizen') => {
  try {
    const response = await api.post("/auth/signup", { email, password, role });
    return {
      success: true,
      user: {
        id: response.data._id,
        email: response.data.email,
        role: response.data.role,
        token: response.data.token,
      },
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

/**
 * Create a new request (complaint/service request)
 */
export const createRequest = async (requestData) => {
  try {
    const response = await api.post("/requests", requestData);
    return { success: true, request: response.data };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to create request",
    );
  }
};

/**
 * Get request by ID
 */
export const getRequestById = async (requestId) => {
  try {
    const response = await api.get(`/requests/${requestId}`);
    return { success: true, request: response.data };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Request not found");
  }
};

/**
 * Get all requests for a user
 */
export const getUserRequests = async (userId) => {
  try {
    const response = await api.get(`/requests/user/${userId}`);
    return { success: true, requests: response.data };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch requests",
    );
  }
};

/**
 * Get all requests (admin)
 */
export const getAllRequests = async (filters = {}) => {
  try {
    const response = await api.get("/requests/admin/all", { params: filters });
    return { success: true, requests: response.data };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch requests",
    );
  }
};

/**
 * Update request status (admin)
 */
export const updateRequestStatus = async (requestId, status) => {
  try {
    const response = await api.put(`/requests/admin/${requestId}/status`, {
      status,
    });
    return { success: true, request: response.data };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update status");
  }
};

/**
 * Upload document
 */
export const uploadDocument = async (file, requestId) => {
  try {
    const formData = new FormData();
    formData.append("document", file);
    formData.append("requestId", requestId);

    const response = await api.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, document: response.data.document };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to upload document",
    );
  }
};

/**
 * Get receipt for a request
 */
export const getReceipt = async (requestId) => {
  try {
    const response = await api.get(`/receipt/${requestId}`);
    return { success: true, receipt: response.data };
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch receipt");
  }
};

/**
 * Update payment status for a request
 */
export const updatePaymentStatus = async (requestId, paymentStatus) => {
  try {
    const response = await api.put(`/requests/${requestId}/payment`, {
      paymentStatus,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update payment status",
    );
  }
};

export default api;
