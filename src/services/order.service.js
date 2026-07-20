const API_URL = "http://localhost:8000/api/orders";

export async function createOrder(orderData) {
  const token = localStorage.getItem("bare_auth_token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  return await response.json();
}

export async function getOrders() {
  const token = localStorage.getItem("bare_auth_token");

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}
export async function getOrderById(orderId) {
  const token = localStorage.getItem("bare_auth_token");

  const response = await fetch(`${API_URL}/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}