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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to process request");
  }

  return data;
};

export const orderService = {
  createOrder: async ({ shippingAddress, recipientName, recipientPhone }) => {
    return await apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify({ shippingAddress, recipientName, recipientPhone }),
    });
  },

  getOrderById: async (orderId) => {
    // Wait, let's see if getOrderHistory exists, we can find the specific order from history
    const data = await apiFetch("/orders");
    if (data.success && data.orders) {
      return data.orders.find(o => o.id === orderId);
    }
    return null;
  }
};
