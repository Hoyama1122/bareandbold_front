import { apiFetch } from "@/lib/api";

const buildQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "" && v !== "ALL") {
      qs.set(k, String(v));
    }
  });
  const str = qs.toString();
  return str ? `?${str}` : "";
};

export const voucherService = {
  // Buyer / Storefront
  getPublicVouchers: (params = {}) =>
    apiFetch(`/vouchers${buildQuery(params)}`),

  getMyVouchers: (status = "ALL") =>
    apiFetch(`/vouchers/my${buildQuery({ status })}`),

  claimVoucher: (voucherId) =>
    apiFetch(`/vouchers/${voucherId}/claim`, {
      method: "POST",
    }),

  claimByCode: (code) =>
    apiFetch("/vouchers/claim", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),

  quoteVouchers: (payload = {}) =>
    apiFetch("/vouchers/quote", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Seller
  sellerListVouchers: () => apiFetch("/seller/vouchers"),

  sellerCreateVoucher: (payload) =>
    apiFetch("/seller/vouchers", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  sellerUpdateVoucher: (id, payload) =>
    apiFetch(`/seller/vouchers/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  sellerUpdateVoucherStatus: (id, status) =>
    apiFetch(`/seller/vouchers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  sellerDeleteVoucher: (id) =>
    apiFetch(`/seller/vouchers/${id}`, {
      method: "DELETE",
    }),

  sellerListRedemptions: (params = {}) =>
    apiFetch(`/seller/vouchers/redemptions${buildQuery(params)}`),
};
