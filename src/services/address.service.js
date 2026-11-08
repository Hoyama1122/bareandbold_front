const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const apiFetch = async (endpoint, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("bare_auth_token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type");
  let data = {};
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: Failed to process request`);
  }

  return data;
};

export const addressService = {
  isLoggedIn: () => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("bare_auth_token");
    return !!token && token !== "undefined" && token !== "null";
  },

  getAddresses: async () => {
    if (!addressService.isLoggedIn()) return [];
    try {
      const data = await apiFetch("/addresses");
      return data.addresses || [];
    } catch (error) {
      console.error("Fetch addresses error:", error);
      return [];
    }
  },

  createAddress: async (addressData) => {
    if (!addressService.isLoggedIn()) throw new Error("Please log in first");
    const data = await apiFetch("/addresses", {
      method: "POST",
      body: JSON.stringify(addressData),
    });
    return data.address;
  },

  setDefaultAddress: async (id) => {
    if (!addressService.isLoggedIn()) throw new Error("Please log in first");
    const data = await apiFetch(`/addresses/${id}/default`, {
      method: "PUT",
    });
    return data.address;
  },

  deleteAddress: async (id) => {
    if (!addressService.isLoggedIn()) throw new Error("Please log in first");
    return await apiFetch(`/addresses/${id}`, {
      method: "DELETE",
    });
  },

  updateAddress: async (id, addressData) => {
    if (!addressService.isLoggedIn()) throw new Error("Please log in first");
    const data = await apiFetch(`/addresses/${id}`, {
      method: "PUT",
      body: JSON.stringify(addressData),
    });
    return data.address;
  },
};
