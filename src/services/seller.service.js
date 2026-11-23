import { apiFetch } from "@/lib/api";

export const sellerService = {
  // ดึงรายการ SubOrder ทั้งหมดของร้าน
  getMyOrders: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== "ALL") query.set("status", params.status);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiFetch(`/seller/orders${qs}`, {
      method: "GET",
    });
  },

  // ดึงรายละเอียด SubOrder รายชิ้น
  getMyOrderById: async (id) => {
    return apiFetch(`/seller/orders/${id}`, {
      method: "GET",
    });
  },

  // อัปเดตสถานะ เช่น กำลังผลิต (PRODUCING)
  updateOrderStatus: async (id, status) => {
    return apiFetch(`/seller/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },

  // จัดส่งสินค้า กรอกเลขพัสดุและขนส่ง
  shipOrder: async (id, data) => {
    return apiFetch(`/seller/orders/${id}/ship`, {
      method: "PUT",
      body: JSON.stringify(data), // { trackingNumber, carrier }
    });
  },

  // Wallet & Payout
  getMyWallet: async () => {
    return apiFetch("/seller/wallet", {
      method: "GET",
    });
  },

  getMyPayouts: async () => {
    return apiFetch("/seller/payouts", {
      method: "GET",
    });
  },

  createPayout: async (amount) => {
    return apiFetch("/seller/payouts", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  },

  // Refunds
  getRefunds: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== "ALL") query.set("status", params.status);
    if (params.requestType && params.requestType !== "ALL") query.set("requestType", params.requestType);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiFetch(`/seller/refunds${qs}`, {
      method: "GET",
    });
  },

  approveRefund: async (id, sellerNote, returnAddress) => {
    return apiFetch(`/seller/refunds/${id}/approve`, {
      method: "PUT",
      body: JSON.stringify({ sellerNote, returnAddress }),
    });
  },

  receiveReturn: async (id, note) => {
    return apiFetch(`/seller/refunds/${id}/receive-return`, {
      method: "PUT",
      body: JSON.stringify({ note }),
    });
  },

  shipExchange: async (id, { exchangeCarrier, exchangeTrackingNumber, note }) => {
    return apiFetch(`/seller/refunds/${id}/ship-exchange`, {
      method: "PUT",
      body: JSON.stringify({ exchangeCarrier, exchangeTrackingNumber, note }),
    });
  },

  completeRefund: async (id, { refundSlipUrl, sellerNote }) => {
    return apiFetch(`/seller/refunds/${id}/complete-refund`, {
      method: "PUT",
      body: JSON.stringify({ refundSlipUrl, sellerNote }),
    });
  },

  rejectRefund: async (id, sellerNote) => {
    return apiFetch(`/seller/refunds/${id}/reject`, {
      method: "PUT",
      body: JSON.stringify({ sellerNote }),
    });
  },
};
