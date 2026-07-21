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

export const wishlistService = {
  isLoggedIn: () => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("bare_auth_token");
    return !!token && token !== "undefined" && token !== "null";
  },

  fetchWishlist: async () => {
    if (typeof window === "undefined") return [];

    if (wishlistService.isLoggedIn()) {
      try {
        const data = await apiFetch("/wishlist");
        if (data.success && data.wishlist) {
          const items = data.wishlist.map(w => w.product).filter(Boolean);
          localStorage.setItem("bare_wishlist", JSON.stringify(items));
          return items;
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    }

    const local = localStorage.getItem("bare_wishlist");
    return local ? JSON.parse(local) : [];
  },

  addToWishlist: async (product) => {
    if (typeof window === "undefined") return;

    if (wishlistService.isLoggedIn()) {
      try {
        await apiFetch("/wishlist", {
          method: "POST",
          body: JSON.stringify({ productId: product.id })
        });
      } catch (err) {
        console.error("Error adding to database wishlist:", err);
      }
    }

    // Add to local storage
    const list = JSON.parse(localStorage.getItem("bare_wishlist") || "[]");
    if (!list.some(item => item.id === product.id)) {
      list.push(product);
      localStorage.setItem("bare_wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  },

  removeFromWishlist: async (productId) => {
    if (typeof window === "undefined") return;

    if (wishlistService.isLoggedIn()) {
      try {
        await apiFetch(`/wishlist/${productId}`, {
          method: "DELETE"
        });
      } catch (err) {
        console.error("Error removing from database wishlist:", err);
      }
    }

    // Remove from local storage
    const list = JSON.parse(localStorage.getItem("bare_wishlist") || "[]");
    const updated = list.filter(item => item.id !== productId);
    localStorage.setItem("bare_wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  },

  isWishlisted: (productId) => {
    if (typeof window === "undefined") return false;
    const list = JSON.parse(localStorage.getItem("bare_wishlist") || "[]");
    return list.some(item => item.id === productId);
  }
};
