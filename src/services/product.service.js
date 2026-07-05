const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch data");
  }

  return data;
};

export const productService = {
  getProducts: async () => {
    return apiFetch("/products", {
      method: "GET",
    });
  },

  getProductById: async (id) => {
    return apiFetch(`/products/${id}`, {
      method: "GET",
    });
  },
};
