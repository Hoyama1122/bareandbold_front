"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, X, ChevronLeft, ShoppingBag, Truck, Tag, Heart } 
from "lucide-react";

const INK = "#2B2118";
const CREAM = "#F2ECDD";
const CREAM_DEEP = "#EAE2CC";
const OLIVE = "#6B7A4E";
const OLIVE_DEEP = "#4F5B38";
const BORDER = "#E1D8C0";
const MUTED = "#8C8577";

const FREE_SHIP_THRESHOLD = 2000;

const INITIAL_ITEMS = [
  {
    id: 1,
    name: "สร้อยคอ",
    variant: "สีเบจ · ไซส์ L",
    price: 890,
    originalPrice: 1290,
    qty: 1,
    swatch: "#D8C8A8",
  },
  {
    id: 2,
    name: "สร้อยข้อมือ",
    variant: "สีดำ · ไซส์ 32",
    price: 1290,
    originalPrice: null,
    qty: 1,
    swatch: "#2A2A28",
  },
  {
    id: 3,
    name: "สร้อยข้อเท้า",
    variant: "สีครีม · ไซส์ M",
    price: 1590,
    originalPrice: 1890,
    qty: 1,
    swatch: "#E7DCC2",
  },
];

function baht(n) {
  return n.toLocaleString("th-TH");
}

export default function CartSummaryPage() {
  const router = useRouter();
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
        .filter((it) => it.qty > 0)
    );
  };

  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
  const savings = useMemo(
    () =>
      items.reduce(
        (s, it) => s + (it.originalPrice ? (it.originalPrice - it.price) * it.qty : 0),
        0
      ),
    [items]
  );
  const promoDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal === 0 || subtotal >= FREE_SHIP_THRESHOLD ? 0 : 90;
  const total = Math.max(0, subtotal - promoDiscount + shipping);
  const remainingForFreeShip = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const shipProgress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
  const itemCount = items.reduce((s, it) => s + it.qty, 0);

  const applyPromo = () => {
    if (promo.trim().length > 0) setPromoApplied(true);
  };

  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "'Sarabun', sans-serif", color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600&display=swap');
        .kanit { font-family: 'Kanit', sans-serif; }
      `}</style>

      {/* Header */}
      <header style={{ background: "#FFFFFF", borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="kanit text-xl font-semibold" style={{ color: INK }}>
            Bare &amp; Bold
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: INK }}>
            <span>หน้าแรก</span>
            <span>ร้านค้า</span>
            <span>บทความ</span>
            <span>ติดต่อเรา</span>
          </nav>
            <div className="relative">
              
            </div>
          
        </div>
      </header>

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

        {/* Free shipping progress */}
        {items.length > 0 && (
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
                  <div
                    className="w-20 h-24 rounded-lg flex-shrink-0"
                    style={{ background: it.swatch }}
                  />
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{it.name}</p>
                        <p className="text-sm" style={{ color: MUTED }}>
                          {it.variant}
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
                        <span className="w-6 text-center text-sm">{it.qty}</span>
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
                            ฿{baht(it.originalPrice * it.qty)}
                          </p>
                        )}
                        <p className="font-semibold">฿{baht(it.price * it.qty)}</p>
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

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 relative">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
                    <input
                      value={promo}
                      onChange={(e) => setPromo(e.target.value)}
                      placeholder="โค้ดส่วนลด"
                      className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none"
                      style={{ border: `1px solid ${BORDER}`, background: CREAM }}
                    />
                  </div>
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ border: `1px solid ${INK}`, color: INK }}
                  >
                    ใช้โค้ด
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-xs mb-4" style={{ color: OLIVE_DEEP }}>
                    ใช้ส่วนลด 10% เรียบร้อยแล้ว
                  </p>
                )}

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
                  {promoApplied && (
                    <div className="flex justify-between">
                      <span style={{ color: MUTED }}>โค้ดส่วนลด</span>
                      <span style={{ color: OLIVE_DEEP }}>-฿{baht(promoDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: MUTED }}>ค่าจัดส่ง</span>
                    <span>{shipping === 0 ? "ฟรี" : `฿${baht(shipping)}`}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4">
                  <span className="kanit font-semibold">ยอดสุทธิ</span>
                  <span className="kanit text-xl font-semibold">฿{baht(total)}</span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-3 rounded-lg font-medium kanit"
                  style={{ background: INK, color: CREAM }}
                  >
                  ดำเนินการชำระเงิน
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