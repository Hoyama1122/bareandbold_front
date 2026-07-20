const API_URL = "http://localhost:8000/api/cart";

export async function addToCart(data) {
  const token = localStorage.getItem("bare_auth_token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export async function getCart() {
  const token = localStorage.getItem("bare_auth_token");

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

export async function removeCartItem(productId) {
  const token = localStorage.getItem("bare_auth_token");

  const response = await fetch(
    `${API_URL}?productId=${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await response.json();
}