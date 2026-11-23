const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    "X-App-Client": "storefront",
    ...options.headers,
  };

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

export const paymentService = {
  processCheckout: async ({ orderId, method }) => {
    return await apiFetch("/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ orderId, method }),
    });
  },

  simulateWebhook: async ({ chargeId, status }) => {
    return await apiFetch("/payments/webhook", {
      method: "POST",
      body: JSON.stringify({
        key: "charge.complete",
        data: {
          id: chargeId,
          status: status, // "successful" or "failed"
          paid: status === "successful"
        }
      })
    });
  }
};
