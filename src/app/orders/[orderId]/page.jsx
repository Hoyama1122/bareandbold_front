//OrderDetail//
"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getOrderById } from "@/services/order.service";
import {
  ChevronLeft,
  Check,
  MapPin,
  RotateCcw,
  PackageX,
} from "lucide-react";
 
const INK = "#2B2118";
const CREAM = "#F2ECDD";
const CREAM_DEEP = "#EAE2CC";
const OLIVE = "#6B7A4E";
const OLIVE_DEEP = "#4F5B38";
const BORDER = "#E1D8C0";
const MUTED = "#8C8577";
const WHITE = "#FFFFFF";
 
const STATUS_STYLES = {
  pending: { bg: "#F5E6C8", color: "#8A6A1F", label: "รอชำระเงิน" },
  preparing: { bg: "#E3E6EE", color: "#3F4E7A", label: "กำลังเตรียมสินค้า" },
  producing: { bg: "#EAE0F5", color: "#5E3F7A", label: "กำลังผลิต" },
  shipping: { bg: "#DDEAE0", color: "#3F6B52", label: "กำลังจัดส่ง" },
  delivered: { bg: "#E1EAD5", color: OLIVE_DEEP, label: "จัดส่งสำเร็จ" },
  cancelled: { bg: "#F3DEDA", color: "#9B4A3F", label: "ยกเลิก" },
};
 
 
const TIMELINE_STEPS = [
  { id: "pending", label: "รับคำสั่งซื้อแล้ว" },
  { id: "preparing", label: "กำลังเตรียมสินค้า" },
  { id: "producing", label: "กำลังผลิต" },
  { id: "shipping", label: "กำลังจัดส่ง" },
  { id: "delivered", label: "จัดส่งสำเร็จ" },
];
 
const mapStatus = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "paid") return "preparing";
  if (s === "producing") return "producing";
  if (s === "shipped") return "shipping";
  return s;
};

function baht(n) {
  return n.toLocaleString("th-TH");
}
 
function StatusBadge({ status }) {
  const mapped = mapStatus(status);
  const s = STATUS_STYLES[mapped] || STATUS_STYLES.pending;
  return (
    <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}
 
function Timeline({ status, date }) {
  const mapped = mapStatus(status);
  if (mapped === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-xl p-5" style={{ background: STATUS_STYLES.cancelled.bg }}>
        <PackageX size={22} style={{ color: STATUS_STYLES.cancelled.color }} />
        <div>
          <p className="font-medium" style={{ color: STATUS_STYLES.cancelled.color }}>
            คำสั่งซื้อนี้ถูกยกเลิก
          </p>
          <p className="text-sm" style={{ color: MUTED }}>
            สั่งซื้อเมื่อ {date}
          </p>
        </div>
      </div>
    );
  }
 
  const currentIndex = TIMELINE_STEPS.findIndex((s) => s.id === mapped);
 
  return (
    <div className="flex flex-col">
      {TIMELINE_STEPS.map((step, idx) => {
        const done = idx <= currentIndex;
        const isLast = idx === TIMELINE_STEPS.length - 1;
        return (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: done ? OLIVE_DEEP : WHITE, border: `1.5px solid ${done ? OLIVE_DEEP : BORDER}` }}
              >
                {done && <Check size={13} color={WHITE} />}
              </div>
              {!isLast && <div className="w-px flex-1 my-1" style={{ background: idx < currentIndex ? OLIVE_DEEP : BORDER, minHeight: 28 }} />}
            </div>
            <div className={isLast ? "pb-0" : "pb-6"}>
              <p className="text-sm font-medium" style={{ color: done ? INK : MUTED }}>
                {step.label}
              </p>
              {idx === currentIndex && (
                <p className="text-xs mt-0.5" style={{ color: OLIVE_DEEP }}>สถานะปัจจุบัน</p>
              )}
              {idx === 0 && <p className="text-xs mt-0.5" style={{ color: MUTED }}>{date}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
 
export default function OrderDetailPage() {
  const router = useRouter();
const { orderId } = useParams();

const [order, setOrder] = useState(null);

useEffect(() => {
  async function loadOrder() {
    const data = await getOrderById(orderId);

    if (data.success) {
      setOrder(data.order);
    }
  }

  if (orderId) {
    loadOrder();
  }
}, [orderId]);

if (!order) {
  return <div className="p-10">Loading...</div>;
}

const subtotal = order.items.reduce((sum, item) => {
  const basePrice = Number(item.price || 0) * item.quantity;
  const accessoriesPrice = (item.accessories || []).reduce((accSum, acc) => {
    return accSum + Number(acc.price || 0) * acc.quantity;
  }, 0);
  return sum + basePrice + accessoriesPrice;
}, 0);

const shippingFee = order.totalPrice - subtotal;
 
  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "'Sarabun', sans-serif", color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600&display=swap');
        .kanit { font-family: 'Kanit', sans-serif; }
      `}</style>
 
 
      <main className="max-w-4xl mx-auto px-6 py-10">
        <button onClick={() => router.push("/orders")} className="flex items-center gap-1 text-sm mb-6" style={{ color: MUTED }}>
          <ChevronLeft size={16} />
          กลับไปที่ประวัติคำสั่งซื้อ
        </button>
 
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="kanit text-2xl font-semibold mb-1">คำสั่งซื้อ {order.id}</h1>
            <p className="text-sm" style={{ color: MUTED }}>สั่งซื้อเมื่อ {new Date(order.createdAt).toLocaleString("th-TH")}</p>
          </div>
          <StatusBadge status={(order.status || "").toLowerCase()} />
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <section className="rounded-xl p-6" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
              <h2 className="kanit text-lg font-semibold mb-5">สถานะการจัดส่ง</h2>
              <Timeline
  status={(order.status || "").toLowerCase()}
  date={new Date(order.createdAt).toLocaleString("th-TH")}
/>
            </section>
 
            <section className="rounded-xl p-6" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
              <h2 className="kanit text-lg font-semibold mb-4">รายการสินค้า</h2>
              <div className="flex flex-col gap-4">
                {order.items.map((it, idx) => {
                  const itemBase = Number(it.price || 0) * it.quantity;
                  const itemAccessoriesTotal = (it.accessories || []).reduce(
                    (accSum, acc) => accSum + Number(acc.price || 0) * acc.quantity,
                    0
                  );
                  const itemTotal = itemBase + itemAccessoriesTotal;

                  return (
                    <div key={idx} className="flex items-start gap-4">
                      <img
                        src={
                          it.product.images?.[0]?.url ||
                          it.product.images?.[0] ||
                          "/placeholder.jpg"
                        }
                        alt={it.product.name}
                        className="w-16 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {it.product.name}
                        </p>
                        <p className="text-xs" style={{ color: MUTED }}>{new Date(order.createdAt).toLocaleString("th-TH")}</p>
                        <p className="text-xs mt-1" style={{ color: MUTED }}>
                          จำนวน {it.quantity} ชิ้น
                        </p>
                        {it.accessories && it.accessories.length > 0 && (
                          <div className="text-[11px] mt-1.5 space-y-0.5" style={{ color: MUTED }}>
                            {it.accessories.map((acc, accIdx) => (
                              <span key={accIdx} className="block">
                                + {acc.accessory?.name} (x{acc.quantity}) (+฿{baht(Number(acc.price || 0) * acc.quantity)})
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium flex-shrink-0">฿{baht(itemTotal)}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
 
          <div className="lg:col-span-1 flex flex-col gap-6">
            <section className="rounded-xl p-6" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
              <h2 className="kanit text-base font-semibold mb-3 flex items-center gap-2">
                <MapPin size={16} style={{ color: OLIVE_DEEP }} />
                ที่อยู่สำหรับจัดส่ง
              </h2>
              <p className="text-sm font-medium">
  {order.recipientName}
</p>

<p className="text-sm" style={{ color: MUTED }}>
  {order.recipientPhone}
</p>

<p className="text-sm mt-2" style={{ color: MUTED }}>
  {order.shippingAddress}
</p>
            </section>
 
            <section className="rounded-xl p-6" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
              <h2 className="kanit text-base font-semibold mb-4">สรุปยอดชำระ</h2>
              <div className="flex flex-col gap-2.5 text-sm pb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                <div className="flex justify-between">
                  <span style={{ color: MUTED }}>ยอดรวมสินค้า</span>
                  <span>฿{baht(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: MUTED }}>ค่าจัดส่ง</span>
                  <span>
  {shippingFee === 0
    ? "ฟรี"
    : `฿${baht(shippingFee)}`}
</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="kanit font-semibold">ยอดชำระทั้งหมด</span>
                <span className="kanit text-xl font-semibold">฿{baht(order.totalPrice)}</span>
              </div>
            </section>
 
            <button
              onClick={() => router.push("/cart")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium kanit"
              style={{ background: INK, color: CREAM }}
            >
              <RotateCcw size={15} />
              ซื้ออีกครั้ง
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
 