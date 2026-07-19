const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper for authorized API calls
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

// Map backend cart items to the schema expected by the frontend components
const mapBackendCartToLocal = (backendCart) => {
  if (!backendCart || !backendCart.items) return [];
  return backendCart.items.map((item) => {
    const material = item.customDetails?.material || "";
    const size = item.customDetails?.size || "";
    const image = item.product?.images?.[0]?.url || "";
    return {
      id: item.id, // Using cart item ID for backend-managed cart
      productId: item.productId,
      name: item.product?.name || "",
      image: image,
      price: item.product?.price || 0,
      quantity: item.quantity,
      material: material,
      size: size,
      accessories: item.accessories?.map((a) => a.accessory?.name) || [],
    };
  });
};

export const cartService = {
  // Check if logged in
  isLoggedIn: () => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("bare_auth_token");
    return !!token && token !== "undefined" && token !== "null";
  },

  // Fetch Cart (syncs with local storage and notifies components)
  fetchCart: async () => {
    if (typeof window === "undefined") return [];

    if (cartService.isLoggedIn()) {
      try {
        const data = await apiFetch("/cart", { method: "GET" });
        if (data.success && data.cart) {
          const localItems = mapBackendCartToLocal(data.cart);
          localStorage.setItem("bare_cart", JSON.stringify(localItems));
          window.dispatchEvent(new Event("cartUpdated"));
          return localItems;
        }
      } catch (err) {
        console.error("Error fetching cart from backend:", err);
      }
    }

    // Return guest cart from local storage if not logged in or fetch failed
    const localCart = localStorage.getItem("bare_cart");
    return localCart ? JSON.parse(localCart) : [];
  },

  // Add Item to Cart
  addToCart: async (productId, quantity, material, size, productDetails = {}) => {
    if (typeof window === "undefined") return;

    if (cartService.isLoggedIn()) {
      try {
        await apiFetch("/cart", {
          method: "POST",
          body: JSON.stringify({
            productId,
            quantity,
            customDetails: { material, size },
          }),
        });
        await cartService.fetchCart();
        return;
      } catch (err) {
        console.error("Error adding to backend cart:", err);
      }
    }

    // Guest cart logic fallback
    const cart = JSON.parse(localStorage.getItem("bare_cart") || "[]");
    // Check if duplicate exists with same options
    const existingIndex = cart.findIndex(
      (item) =>
        item.productId === productId &&
        item.material === material &&
        item.size === size
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: Date.now(), // Unique ID for guest cart item
        productId,
        name: productDetails.name || "",
        image: productDetails.image || "",
        price: productDetails.price || 0,
        quantity,
        material,
        size,
      });
    }

    localStorage.setItem("bare_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // Update Cart Item Quantity
  updateCartItem: async (productId, quantity, material, size, cartItemId) => {
    if (typeof window === "undefined") return;

    if (cartService.isLoggedIn()) {
      try {
        await apiFetch("/cart", {
          method: "PUT",
          body: JSON.stringify({
            productId,
            quantity,
            customDetails: { material, size },
          }),
        });
        await cartService.fetchCart();
        return;
      } catch (err) {
        console.error("Error updating backend cart item:", err);
      }
    }

    // Guest cart fallback
    const cart = JSON.parse(localStorage.getItem("bare_cart") || "[]");
    const updated = cart
      .map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);

    localStorage.setItem("bare_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // Remove Item from Cart
  removeCartItem: async (productId, cartItemId) => {
    if (typeof window === "undefined") return;

    if (cartService.isLoggedIn()) {
      try {
        await apiFetch(`/cart?productId=${productId}`, {
          method: "DELETE",
        });
        await cartService.fetchCart();
        return;
      } catch (err) {
        console.error("Error removing from backend cart:", err);
      }
    }

    // Guest cart fallback
    const cart = JSON.parse(localStorage.getItem("bare_cart") || "[]");
    const updated = cart.filter((item) => item.id !== cartItemId);
    localStorage.setItem("bare_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // Clear Cart
  clearCart: async () => {
    if (typeof window === "undefined") return;

    if (cartService.isLoggedIn()) {
      try {
        await apiFetch("/cart/clear", { method: "POST" });
      } catch (err) {
        console.error("Error clearing backend cart:", err);
      }
    }

    localStorage.removeItem("bare_cart");
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // Merge Guest Cart into User Cart
  mergeCart: async () => {
    if (typeof window === "undefined") return;

    const guestCart = JSON.parse(localStorage.getItem("bare_cart") || "[]");
    if (guestCart.length === 0) {
      // Just fetch backend cart directly
      await cartService.fetchCart();
      return;
    }

    try {
      const itemsToMerge = guestCart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        customDetails: {
          material: item.material,
          size: item.size,
        },
      }));

      await apiFetch("/cart/merge", {
        method: "POST",
        body: JSON.stringify({ items: itemsToMerge }),
      });

      // Clear local storage and let fetchCart load/sync
      localStorage.removeItem("bare_cart");
      await cartService.fetchCart();
    } catch (err) {
      console.error("Failed to merge guest cart with backend:", err);
      // Fallback: fetch user's backend cart anyway
      await cartService.fetchCart();
    }
  },
};
