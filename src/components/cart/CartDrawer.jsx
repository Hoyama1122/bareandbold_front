"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag01Icon } from "hugeicons-react";
import { cartService, getCart, removeCartItem } from "@/services/cart.service";

export default function CartDrawer({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function loadCart() {
      if (cartService.isLoggedIn()) {
        const data = await getCart();
        if (data.success && data.cart) {
          setCartItems(data.cart.items);
        } else {
          setCartItems([]);
        }
      } else {
        const local = await cartService.fetchCart();
        setCartItems(
          local.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            customDetails: { material: item.material, size: item.size },
            product: {
              id: item.productId,
              name: item.name,
              price: item.price,
              images: [{ url: item.image }],
            },
          }))
        );
      }
    }

    if (isOpen) {
      loadCart();
      cartService.fetchCart();
    }

    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, [isOpen]);

  if (!mounted) return null;

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const updateQty = async (productId, delta, item) => {
    const newQty = Math.max(0, item.quantity + delta);
    if (newQty === 0) {
      await removeItem(productId);
    } else {
      if (cartService.isLoggedIn()) {
        try {
          await cartService.updateCartItem(
            productId,
            newQty,
            item.customDetails?.material || "Silver",
            item.customDetails?.size || "16 cm",
            item.id
          );
          const data = await getCart();
          setCartItems(data.cart.items);
        } catch (err) {
          console.error("Failed to update item quantity:", err);
        }
      } else {
        const localItems = JSON.parse(localStorage.getItem("bare_cart") || "[]");
        const updated = localItems.map((it) => {
          if (it.productId === productId) {
            return { ...it, quantity: newQty };
          }
          return it;
        });
        localStorage.setItem("bare_cart", JSON.stringify(updated));
        window.dispatchEvent(new Event("cartUpdated"));
      }
    }
  };

  const removeItem = async (productId) => {
    if (cartService.isLoggedIn()) {
      const result = await removeCartItem(productId);
      if (result.success) {
        const data = await getCart();
        setCartItems(data.cart.items);
      }
    } else {
      const localItems = JSON.parse(localStorage.getItem("bare_cart") || "[]");
      const updated = localItems.filter((it) => it.productId !== productId);
      localStorage.setItem("bare_cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] font-anuphan antialiased ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-[#3C322A]/40 backdrop-blur-[4px] transition-opacity duration-500 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        className={`absolute top-0 right-0 h-screen max-h-screen w-full max-w-md bg-[#FFFFFF] border-l border-[#F5F0E6] shadow-2xl flex flex-col justify-between transition-transform duration-500 will-change-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#F5F0E6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag01Icon size={22} className="text-[#6A5242]" />
            <h2 className="text-lg font-extrabold text-[#3C322A]">ตะกร้าสินค้า</h2>
            <span className="bg-[#6A5242] text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#777777] hover:text-[#3C322A] p-2 rounded-full hover:bg-[#F5F0E6] transition duration-200 cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content / Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 bg-[#FDFBF7] border border-[#F5F0E6] rounded-full flex items-center justify-center text-[#999]">
                <ShoppingBag01Icon size={32} />
              </div>
              <div>
                <h3 className="font-bold text-[#3C322A]">ไม่มีสินค้าในตะกร้า</h3>
                <p className="text-xs text-zinc-500 mt-1">เลือกสินค้าที่คุณถูกใจและเพิ่มลงตะกร้าได้เลย</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#6A5242] hover:bg-[#523e31] text-white text-xs font-bold rounded-lg transition duration-200"
              >
                เลือกซื้อสินค้าต่อ
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 bg-[#FDFBF7] rounded-xl border border-[#F5F0E6] relative group">
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="absolute top-2 right-2 text-zinc-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {/* Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-zinc-100 border border-[#F5F0E6] flex-shrink-0 flex items-center justify-center">
                  <img
                    src={
                      item.product.images?.[0]?.url ||
                      item.product.images?.[0] ||
                      "/placeholder.jpg"
                    }
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between pr-6">
                  <div>
                    <h4 className="text-sm font-bold text-[#3C322A] line-clamp-1">{item.product.name}</h4>
                    {item.accessories && item.accessories.length > 0 && (
                      <p className="text-[11px] text-[#556B2F] mt-0.5 font-medium">
                        + {item.accessories.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 border border-zinc-200 rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => updateQty(item.product.id, -1, item)}
                        className="w-7 h-7 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 transition active:scale-95 cursor-pointer border-0"
                      >
                        -
                      </button>
                      <span className="w-7 text-center font-bold text-zinc-800 text-xs">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.product.id, 1, item)}
                        className="w-7 h-7 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 transition active:scale-95 cursor-pointer border-0"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-extrabold text-[#6A5242]">
                      ฿{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#F5F0E6] bg-[#FDFBF7] space-y-4">
            <div className="flex items-center justify-between text-sm font-bold text-[#3C322A]">
              <span>ยอดรวมทั้งหมด:</span>
              <span className="text-lg font-black text-[#6A5242]">฿{total.toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full py-3 border border-[#F5F0E6] hover:bg-[#FFFFFF] text-[#6A5242] text-xs font-bold tracking-wider rounded-lg transition duration-200 text-center flex items-center justify-center cursor-pointer shadow-sm"
              >
                ดูตะกร้าสินค้า
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full py-3 bg-[#6A5242] hover:bg-[#523e31] text-white text-xs font-bold tracking-wider rounded-lg transition duration-200 text-center flex items-center justify-center cursor-pointer shadow-sm"
              >
                ชำระเงิน
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
