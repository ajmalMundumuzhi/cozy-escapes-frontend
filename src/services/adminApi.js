
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const TOKEN_KEY = "avanta_admin_token";

export const getAdminToken = () => sessionStorage.getItem(TOKEN_KEY);

export const setAdminToken = (token) =>
  sessionStorage.setItem(TOKEN_KEY, token);

export const clearAdminToken = () => sessionStorage.removeItem(TOKEN_KEY);

async function request(path, options = {}) {
  const token = getAdminToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token) clearAdminToken();

    throw new Error(
      result.error?.message || result.message || "Request failed."
    );
  }

  return result.data ?? result;
}

export const adminApi = {
  login: (email, password) =>
    request("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () => request("/admin/me"),

  dashboard: () => request("/admin/dashboard"),
  
  properties: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/properties${query ? `?${query}` : ""}`);
  },

  property: (id) => request(`/admin/properties/${id}`),

  createProperty: (data) =>
    request("/admin/properties", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateProperty: (id, data) =>
    request(`/admin/properties/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  toggleProperty: (id, isActive) =>
    request(`/admin/properties/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    }),

  deleteProperty: (id) =>
    request(`/admin/properties/${id}`, {
      method: "DELETE",
    }),
    
    bookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/bookings${query ? `?${query}` : ""}`);
    },

    booking: (id) => request(`/admin/bookings/${id}`),

    updateBookingStatus: (id, status) =>
    request(`/admin/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    }),
    
    availability: (params) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/availability?${query}`);
    },

    createBlock: (data) =>
    request("/admin/availability/blocks", {
        method: "POST",
        body: JSON.stringify(data),
    }),

    deleteBlock: (id) =>
    request(`/admin/availability/blocks/${id}`, {
        method: "DELETE",
    }),

    
    inquiries: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/inquiries${query ? `?${query}` : ""}`);
    },

    inquiry: (id) => request(`/admin/inquiries/${id}`),

    updateInquiry: (id, data) =>
    request(`/admin/inquiries/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    }),
    
    settings: () => request("/admin/settings"),

    updateSettings: (data) =>
    request("/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(data),
    }),



};

export default adminApi;
