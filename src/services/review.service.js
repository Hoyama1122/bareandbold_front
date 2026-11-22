import { apiFetch } from "@/lib/api";

const buildQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "" && val !== "ALL") {
      qs.set(key, String(val));
    }
  });
  const str = qs.toString();
  return str ? `?${str}` : "";
};

export const reviewService = {
  // Product Reviews
  getProductReviews: (productId, params = {}) =>
    apiFetch(`/products/${productId}/reviews${buildQuery(params)}`),

  getMyReviews: () => apiFetch("/reviews/my"),

  createProductReview: (payload) =>
    apiFetch("/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateProductReview: (reviewId, payload) =>
    apiFetch(`/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteProductReview: (reviewId) =>
    apiFetch(`/reviews/${reviewId}`, {
      method: "DELETE",
    }),

  // Shop Reviews (รองรับทั้ง shop.id และ shop.slug)
  getShopReviews: (shopIdOrSlug, params = {}) =>
    apiFetch(`/shops/${encodeURIComponent(shopIdOrSlug)}/reviews${buildQuery(params)}`),

  createShopReview: (shopIdOrSlug, payload) =>
    apiFetch(`/shops/${encodeURIComponent(shopIdOrSlug)}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateShopReview: (shopIdOrSlug, reviewId, payload) =>
    apiFetch(
      `/shops/${encodeURIComponent(shopIdOrSlug)}/reviews/${reviewId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    ),

  deleteShopReview: (shopIdOrSlug, reviewId) =>
    apiFetch(
      `/shops/${encodeURIComponent(shopIdOrSlug)}/reviews/${reviewId}`,
      {
        method: "DELETE",
      },
    ),
};
