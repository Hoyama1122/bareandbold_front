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
  createOrder: async (orderData) => {
    return await apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },

  getOrderHistory: async () => {
    return await apiFetch("/orders");
  },

  getOrderById: async (orderId) => {
    try {
      const data = await apiFetch(`/orders/${orderId}`);
      if (data && data.success) return data;
      return { success: true, order: data };
    } catch (e) {
      // Fallback: search in list
      const data = await apiFetch("/orders");
      if (data.success && data.orders) {
        const order = data.orders.find(o => o.id === orderId) || null;
        return { success: true, order };
      }
      return { success: false, error: e.message };
    }
  }
};

// Named exports to maintain compatibility with other branches/components
export async function createOrder(orderData) {
  return await orderService.createOrder(orderData);
}

export async function getOrders() {
  return await orderService.getOrderHistory();
}

export async function getOrderHistory() {
  return await orderService.getOrderHistory();
}

export async function getOrderById(orderId) {
  return await orderService.getOrderById(orderId);
}
