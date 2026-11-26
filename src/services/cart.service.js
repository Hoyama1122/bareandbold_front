const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper for authorized API calls
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

// Map backend cart items to the schema expected by the frontend components
const mapBackendCartToLocal = (backendCart) => {
  if (!backendCart || !backendCart.items) return [];
  return backendCart.items.map((item) => {
    const material = item.customDetails?.material || "";
    const size = item.customDetails?.size || "";
    const image = item.product?.images?.[0]?.url || "";

    // Calculate dynamic price including custom adjustments and accessories
    let finalPrice = Number(item.product?.price || 0);

    if (item.product?.customOptions) {
      item.product.customOptions.forEach((opt) => {
        const selectedVal = opt.values?.find(val => {
          const valName = typeof val === "string" ? val : (val.value || val.name);
          return valName === size || valName === material;
        });
        if (selectedVal && selectedVal.priceAdjustment) {
          finalPrice += Number(selectedVal.priceAdjustment);
        }
      });
    }

    if (item.accessories) {
      item.accessories.forEach((a) => {
        if (a.accessory && a.accessory.price) {
          finalPrice += Number(a.accessory.price);
        }
      });
    }

    return {
      id: item.id,
      productId: item.productId,
      shopId: item.product?.shop?.id || null,
      shopName: item.product?.shop?.name || "Bare & Bold",
      name: item.product?.name || "",
      image: image,
      price: finalPrice,
      quantity: item.quantity,
      material: material,
      size: size,
      accessories: item.accessories?.map((a) => a.accessory?.name) || [],
    };
  });
};

let isMergingCart = false;

export const cartService = {
  // Helper check for logged-in status
  isLoggedIn: () => {
    if (typeof window === "undefined") return false;
    return Boolean(
      localStorage.getItem("bare_user_email") ||
      localStorage.getItem("profile") ||
      localStorage.getItem("bare_user") ||
      document.cookie.includes("bare_user_token")
    );
  },

  // Fetch Cart (syncs with local storage and notifies components)
  fetchCart: async () => {
    if (typeof window === "undefined") return [];

    try {
      const data = await apiFetch("/cart", { method: "GET" });
      if (data.success && data.cart) {
        const localItems = mapBackendCartToLocal(data.cart);

        // Check if there are unmerged guest items in localStorage
        const guest = localStorage.getItem("bare_cart");
        if (guest) {
          try {
            const guestItems = JSON.parse(guest);
            const hasGuestItems = Array.isArray(guestItems) && guestItems.some(
              (i) => i && (String(i.id).startsWith("guest_") || !i.id)
            );
            if (hasGuestItems) {
              await cartService.mergeCart();
              const retryData = await apiFetch("/cart", { method: "GET" });
              if (retryData.success && retryData.cart) {
                const retryItems = mapBackendCartToLocal(retryData.cart);
                localStorage.setItem("bare_cart", JSON.stringify(retryItems));
                window.dispatchEvent(new Event("cartUpdated"));
                return retryItems;
              }
            }
          } catch (e) {}
        }

        localStorage.setItem("bare_cart", JSON.stringify(localItems));
        window.dispatchEvent(new Event("cartUpdated"));
        return localItems;
      }
    } catch (err) {
      // Unauthenticated (guest user) -> fallback to localStorage guest cart
    }

    const localCart = localStorage.getItem("bare_cart");
    return localCart ? JSON.parse(localCart) : [];
  },

  // Add Item to Cart
  addToCart: async (productId, quantity, material, size, selectedAccessories = [], productDetails = {}) => {
    if (typeof window === "undefined") return;

    const accessoriesPayload = (selectedAccessories && Array.isArray(selectedAccessories))
      ? selectedAccessories.map((a) => ({
          accessoryId: typeof a === "object" ? a.id : a,
          quantity: 1,
        }))
      : [];

    // Try sending directly to backend (authenticated user with bare_user_token cookie)
    try {
      await apiFetch("/cart", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity,
          customDetails: { material, size },
          accessories: accessoriesPayload,
        }),
      });
      await cartService.fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
      return;
    } catch (err) {
      // If unauthorized (guest), proceed to guest cart below
    }

    // Guest cart fallback logic
    let cart = [];
    try {
      const local = localStorage.getItem("bare_cart");
      if (local) {
        cart = JSON.parse(local);
      }
    } catch (e) {
      cart = [];
    }

    if (!Array.isArray(cart)) {
      cart = [];
    }

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
        id: `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        productId,
        shopId: productDetails.shopId || null,
        shopName: productDetails.shopName || "Bare & Bold",
        name: productDetails.name || "Custom Jewelry",
        image: productDetails.image || "",
        price: productDetails.price || 0,
        quantity,
        material,
        size,
        accessories: selectedAccessories.map((a) => (typeof a === "object" ? a.name : a)),
      });
    }

    localStorage.setItem("bare_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // Update Cart Item Quantity
  updateCartItem: async (productId, quantity, material, size, cartItemId) => {
    if (typeof window === "undefined") return;

    // Try backend first
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
      window.dispatchEvent(new Event("cartUpdated"));
      return;
    } catch (err) {
      // Fall back to guest cart
    }

    let cart = [];
    try {
      const local = localStorage.getItem("bare_cart");
      if (local) cart = JSON.parse(local);
    } catch (e) {}
    if (!Array.isArray(cart)) cart = [];

    const updated = cart
      .map((item) => (item.id === cartItemId || item.productId === productId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);

    localStorage.setItem("bare_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // Remove Item from Cart
  removeCartItem: async (productId, cartItemId) => {
    if (typeof window === "undefined") return;

    // Try backend first
    try {
      await apiFetch(`/cart?productId=${productId}`, {
        method: "DELETE",
      });
      await cartService.fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
      return;
    } catch (err) {
      // Fall back to guest cart
    }

    let cart = [];
    try {
      const local = localStorage.getItem("bare_cart");
      if (local) cart = JSON.parse(local);
    } catch (e) {}
    if (!Array.isArray(cart)) cart = [];

    const updated = cart.filter((item) => item.id !== cartItemId && item.productId !== productId);
    localStorage.setItem("bare_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // Clear Cart
  clearCart: async () => {
    if (typeof window === "undefined") return;

    try {
      await apiFetch("/cart/clear", { method: "POST" });
    } catch (err) {}

    localStorage.removeItem("bare_cart");
    window.dispatchEvent(new Event("cartUpdated"));
  },

  // Merge Guest Cart into User Cart
  mergeCart: async () => {
    if (typeof window === "undefined" || isMergingCart) return;

    const guestCart = JSON.parse(localStorage.getItem("bare_cart") || "[]");
    if (guestCart.length === 0) {
      await cartService.fetchCart();
      return;
    }

    try {
      isMergingCart = true;
      const guestItemsToMerge = guestCart.filter((i) => i && (String(i.id).startsWith("guest_") || !i.id));
      const itemsToProcess = guestItemsToMerge.length > 0 ? guestItemsToMerge : guestCart;

      const itemsToMerge = itemsToProcess.map((item) => ({
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
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Failed to merge guest cart with backend:", err);
      await cartService.fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } finally {
      isMergingCart = false;
    }
  },
};

// Named exports for compatibility with tharatorn-Aom branch
export async function addToCart(data) {
  const { productId, quantity, customDetails } = data;
  const material = customDetails?.material || "";
  const size = customDetails?.size || "";
  return await cartService.addToCart(productId, quantity, material, size);
}

export async function getCart() {
  const items = await cartService.fetchCart();
  return {
    success: true,
    cart: {
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        customDetails: { material: item.material, size: item.size },
        product: { name: item.name, price: item.price, images: [{ url: item.image }] }
      }))
    }
  };
}

export async function removeCartItem(productId) {
  return await cartService.removeCartItem(productId);
}

export function isLoggedIn() {
  return cartService.isLoggedIn();
}
