import { apiFetch } from "@/lib/api";

export const productService = {
  // Public product APIs
  getProducts: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.category && params.category !== "all") query.set("category", params.category);
    if (params.type && params.type !== "all") query.set("type", params.type);
    if (params.shop) query.set("shop", params.shop);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiFetch(`/products${qs}`, {
      method: "GET",
    });
  },

  getProductById: async (id) => {
    return apiFetch(`/products/${id}`, {
      method: "GET",
    });
  },

  getProductRecommendations: async (id) => {
    return apiFetch(`/products/${id}/recommendations`, {
      method: "GET",
    });
  },

  // Seller product APIs (Requires authenticated seller)
  getMyProducts: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.type) query.set("type", params.type);
    if (params.status) query.set("status", params.status);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiFetch(`/seller/products${qs}`, {
      method: "GET",
    });
  },

  getMyProductById: async (id) => {
    return apiFetch(`/seller/products/${id}`, {
      method: "GET",
    });
  },

  createProduct: async (data) => {
    return apiFetch("/seller/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateProduct: async (id, data) => {
    return apiFetch(`/seller/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteProduct: async (id) => {
    return apiFetch(`/seller/products/${id}`, {
      method: "DELETE",
    });
  },

  toggleProductStatus: async (id) => {
    return apiFetch(`/seller/products/${id}/status`, {
      method: "PATCH",
    });
  },

  getSellerDashboard: async () => {
    return apiFetch("/seller/dashboard", {
      method: "GET",
    });
  },
};
