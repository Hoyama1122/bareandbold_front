"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, X, ChevronLeft, ShoppingBag, Truck, Heart }
from "lucide-react";
import { cartService } from "@/services/cart.service";
import {
  DEFAULT_PLATFORM_SETTINGS,
  platformService,
} from "@/services/platform.service";
import { calculateCartPricing } from "@/lib/pricing";
import { useAuth } from "@/context/AuthContext";

const INK = "#2B2118";
const CREAM = "#F2ECDD";
const CREAM_DEEP = "#EAE2CC";
const OLIVE = "#6B7A4E";
const OLIVE_DEEP = "#4F5B38";
const BORDER = "#E1D8C0";
const MUTED = "#8C8577";

function baht(n) {
  return n.toLocaleString("th-TH");
}

export default function CartSummaryPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState([]);
  const [shippingSettings, setShippingSettings] = useState(
    DEFAULT_PLATFORM_SETTINGS,
  );

  useEffect(() => {
    const loadCart = async () => {
      const cart = localStorage.getItem("bare_cart");
      if (cart) {
        try {
          setItems(JSON.parse(cart));
        } catch (e) {
          setItems([]);
        }
      } else {
        setItems([]);
      }

      try {
        const synced = await cartService.fetchCart();
        if (Array.isArray(synced)) {
          setItems(synced);
        }
      } catch (err) {
        console.error("Failed to sync cart:", err);
      }
    };

    loadCart();
    platformService
      .getPublicSettings()
      .then(setShippingSettings)
      .catch((err) => console.error("Failed to load shipping settings:", err));

    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  const updateQty = async (id, delta) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);
    
    if (newQty === 0) {
      await removeItem(id);
    } else {
      try {
        await cartService.updateCartItem(item.productId, newQty, item.material, item.size, id);
      } catch (err) {
        console.error("Failed to update item quantity:", err);
      }
    }
  };

  const removeItem = async (id) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    try {
      await cartService.removeCartItem(item.productId, id);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const pricing = useMemo(
    () => calculateCartPricing(items, shippingSettings),
    [items, shippingSettings],
  );
  const savings = useMemo(
    () =>
      items.reduce(
        (s, it) => s + (it.originalPrice ? (it.originalPrice - it.price) * it.quantity : 0),
        0
      ),
    [items]
  );
  const {
    subtotal,
    shipping,
    total,
    itemCount,
    hasAutoFreeShipping,
    remainingForFreeShipping: remainingForFreeShip,
    shipProgress,
  } = pricing;

  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "'Sarabun', sans-serif", color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600&display=swap');
        .kanit { font-family: 'Kanit', sans-serif; }
      `}</style>
    

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumb + back */}
        <button 
        onClick={() => router.push("/")}
        className="flex items-center gap-1 text-sm mb-6" 
        style={{ color: MUTED }}>
          <ChevronLeft size={16} />
          เลือกซื้อสินค้าต่อ
        </button> 

        <h1 className="kanit text-3xl font-semibold mb-1">ตะกร้าสินค้าของคุณ</h1>
        <p className="text-sm mb-6" style={{ color: MUTED }}>
          {itemCount > 0 ? `${itemCount} รายการในตะกร้า` : "ตะกร้าของคุณว่างเปล่า"}
        </p>

        {/* Shipping notice or free shipping progress */}
        {items.length > 0 && (
          hasAutoFreeShipping ? (
            <div
              className="rounded-xl px-5 py-4 mb-8 flex items-center gap-4"
              style={{ background: "#FFFFFF", border: `1px solid ${BORDER}` }}
            >
              <Truck size={20} style={{ color: OLIVE_DEEP, flexShrink: 0 }} />
              <div className="flex-1">
                <p className="text-sm mb-2">
                  {remainingForFreeShip > 0 ? (
                    <>
                      ซื้อเพิ่มอีก{" "}
                      <span className="font-semibold" style={{ color: OLIVE_DEEP }}>
                        ฿{baht(remainingForFreeShip)}
                      </span>{" "}
                      รับส่งฟรี
                    </>
                  ) : (
                    <span className="font-semibold" style={{ color: OLIVE_DEEP }}>
                      คุณได้รับสิทธิ์จัดส่งฟรีแล้ว
                    </span>
                  )}
                </p>
                <div className="w-full h-1.5 rounded-full" style={{ background: CREAM_DEEP }}>
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${shipProgress}%`, background: OLIVE }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl px-5 py-4 mb-8 flex items-center justify-between gap-4"
              style={{ background: "#FFFFFF", border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${OLIVE}15`, color: OLIVE_DEEP }}
                >
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: INK }}>
                    ค่าจัดส่งมาตรฐาน ฿{shippingSettings?.shippingFee || 50} ต่อร้านค้า
                  </p>
                  <p className="text-xs" style={{ color: MUTED }}>
                    สามารถใช้โค้ดส่งฟรีได้ในขั้นตอนการชำระเงิน
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push("/coupons")}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition hover:bg-neutral-50 flex-shrink-0"
                style={{ borderColor: BORDER, color: OLIVE_DEEP }}
              >
                เก็บโค้ดส่งฟรี &gt;
              </button>
            </div>
          )
        )}

        {items.length === 0 ? (
          <div className="text-center py-20" style={{ color: MUTED }}>
            <ShoppingBag size={40} className="mx-auto mb-4" style={{ color: MUTED }} />
            <p className="mb-1">ยังไม่มีสินค้าในตะกร้าของคุณ</p>
            <p className="text-sm">เลือกชมคอลเลกชันใหม่แล้วเริ่มเลือกซื้อได้เลย</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Item list */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex gap-4 rounded-xl p-4"
                  style={{ background: "#FFFFFF", border: `1px solid ${BORDER}` }}
                >
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-20 h-24 rounded-lg flex-shrink-0 object-cover"/>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                <p className="text-xs font-medium mb-0.5" style={{ color: OLIVE_DEEP }}>
                  {it.shopName}
                </p>
                <p className="font-medium truncate">{it.name}</p>
                <p className="text-sm" style={{ color: MUTED }}>
                  {it.variant || ""}
                </p>
                      </div>
                      <button onClick={() => removeItem(it.id)} aria-label="ลบสินค้า" style={{ color: MUTED }}>
                        <X size={18} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <div
                        className="flex items-center rounded-full"
                        style={{ border: `1px solid ${BORDER}` }}
                      >
                        <button
                          onClick={() => updateQty(it.id, -1)}
                          className="w-8 h-8 flex items-center justify-center"
                          aria-label="ลดจำนวน"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-sm">{it.quantity}</span>
                        <button
                          onClick={() => updateQty(it.id, 1)}
                          className="w-8 h-8 flex items-center justify-center"
                          aria-label="เพิ่มจำนวน"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        {it.originalPrice && (
                          <p className="text-xs line-through" style={{ color: MUTED }}>
                            ฿{baht(it.originalPrice * it.quantity)}
                          </p>
                        )}
                        <p className="font-semibold">฿{baht(it.price * it.quantity)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                className="flex items-center gap-2 text-sm self-start mt-1"
                style={{ color: MUTED }}
              >
                <Heart size={15} />
                ย้ายไปยังรายการโปรด
              </button>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div
                className="rounded-xl p-6 sticky top-6"
                style={{ background: "#FFFFFF", border: `1px solid ${BORDER}` }}
              >
                <h2 className="kanit text-lg font-semibold mb-4">สรุปคำสั่งซื้อ</h2>

                <div className="flex flex-col gap-3 text-sm pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <div className="flex justify-between">
                    <span style={{ color: MUTED }}>ยอดรวมสินค้า</span>
                    <span>฿{baht(subtotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between">
                      <span style={{ color: MUTED }}>ส่วนลดสินค้า</span>
                      <span style={{ color: OLIVE_DEEP }}>-฿{baht(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: MUTED }}>ค่าจัดส่ง (แยกตามร้าน)</span>
                    <span>{shipping === 0 ? "ฟรี" : `฿${baht(shipping)}`}</span>
                  </div>
                  {pricing.groups.length > 1 && (
                    <div className="rounded-lg px-3 py-2 text-xs" style={{ background: CREAM }}>
                      {pricing.groups.map((group) => (
                        <div key={group.key} className="flex justify-between gap-2">
                          <span className="truncate">{group.shopName}</span>
                          <span>{group.shipping === 0 ? "ฟรีส่ง" : `ค่าส่ง ฿${baht(group.shipping)}`}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center py-4">
                  <span className="kanit font-semibold">ยอดสุทธิ</span>
                  <span className="kanit text-xl font-semibold">฿{baht(total)}</span>
                </div>

                {!isLoggedIn && (
                  <div className="mb-3 flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2.5">
                    <svg className="w-4 h-4 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>กรุณาเข้าสู่ระบบก่อนทำการชำระเงิน</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (!isLoggedIn) {
                      router.push("/login?next=/checkout");
                      return;
                    }
                    router.push("/checkout");
                  }}
                  className="w-full py-3 rounded-lg font-medium kanit cursor-pointer transition hover:opacity-95"
                  style={{ background: INK, color: CREAM }}
                  >
                  {isLoggedIn ? "ดำเนินการชำระเงิน" : "เข้าสู่ระบบเพื่อชำระเงิน"}
                </button>
                <p className="text-xs text-center mt-3" style={{ color: MUTED }}>
                  ราคานี้ยังไม่รวมภาษีที่อาจเรียกเก็บเพิ่มเติม
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}