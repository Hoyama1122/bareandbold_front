import { apiFetch } from "@/lib/api";

export const shopService = {
  getMyShop: () => apiFetch("/shops/my-shop"),

  apply: (data) =>
    apiFetch("/shops/apply", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (data) =>
    apiFetch("/shops/my-shop", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getBySlug: (slug) => apiFetch(`/shops/${slug}`),

  list: () => apiFetch("/shops"),
};
