//OrderHistory//
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PackageSearch, RotateCcw, ChevronRight } from "lucide-react";
import { getOrders } from "../../services/order.service";
 
export const INK = "#2B2118";
export const CREAM = "#F2ECDD";
export const CREAM_DEEP = "#EAE2CC";
export const OLIVE = "#6B7A4E";
export const OLIVE_DEEP = "#4F5B38";
export const BORDER = "#E1D8C0";
export const MUTED = "#8C8577";
export const WHITE = "#FFFFFF";
 
export const STATUS_STYLES = {
  pending: { bg: "#F5E6C8", color: "#8A6A1F", label: "รอชำระเงิน" },
  preparing: { bg: "#E3E6EE", color: "#3F4E7A", label: "กำลังเตรียมสินค้า" },
  shipping: { bg: "#DDEAE0", color: "#3F6B52", label: "กำลังจัดส่ง" },
  delivered: { bg: "#E1EAD5", color: OLIVE_DEEP, label: "จัดส่งสำเร็จ" },
  cancelled: { bg: "#F3DEDA", color: "#9B4A3F", label: "ยกเลิก" },
};
 


const FILTERS = [
  { id: "all", label: "แสดงทั้งหมด" },
  { id: "pending", label: "รอชำระเงิน" },
  { id: "preparing", label: "กำลังเตรียมสินค้า" },
  { id: "shipping", label: "กำลังจัดส่ง" },
  { id: "delivered", label: "จัดส่งสำเร็จ" },
  { id: "cancelled", label: "ยกเลิก" },
];
 
function baht(n) {
  return n.toLocaleString("th-TH");
}
 
function StatusBadge({ status }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}
 
export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
  async function loadOrders() {
    try {
      const data = await getOrders();

      console.log(data);

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    }
  }

  loadOrders();
}, []);
 
  const filtered = useMemo(() => {
  return orders.filter((o) => {
    return filter === "all" || o.status === filter;
  });
}, [orders, filter]);
 
  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "'Sarabun', sans-serif", color: INK }}>
 
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="kanit text-3xl font-semibold mb-8">ประวัติคำสั่งซื้อ</h1>
 
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="text-sm px-4 py-2 rounded-full transition-colors"
                style={{
                  background: active ? INK : WHITE,
                  color: active ? CREAM : INK,
                  border: `1px solid ${active ? INK : BORDER}`,
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
 
        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: MUTED }}>
            <PackageSearch size={40} className="mx-auto mb-4" />
            <p className="mb-1">ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไข</p>
            <p className="text-sm">ลองเปลี่ยนตัวกรองหรือคำค้นหาอีกครั้ง</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((order) => {
              const previewItems = order.items.slice(0, 3);
              const extraCount = order.items.length - previewItems.length;
              return (
                <div key={order.id} className="rounded-xl p-5" style={{ background: WHITE, border: `1px solid ${BORDER}` }}>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="kanit font-semibold">{order.id}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs" style={{ color: MUTED }}>{new Date(order.createdAt).toLocaleString("th-TH")}</p>
                  </div>
 
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {previewItems.map((it, idx) => (
                        <div key={idx} className="w-14 h-16 rounded-lg flex-shrink-0" style={{ background: "#E5E5E5" }} />
                      ))}
                      <div className="text-sm min-w-0">
                        <p className="truncate max-w-[220px]">{order.items[0].product.name}</p>
                        <p style={{ color: MUTED }}>
                          {order.items.length > 1 ? `และอีก ${order.items.length - 1} รายการ` : `จำนวน ${order.items[0].quantity} ชิ้น`}
                          {extraCount > 0 ? "" : ""}
                        </p>
                      </div>
                    </div>
 
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-xs" style={{ color: MUTED }}>ยอดชำระทั้งหมด</p>
                        <p className="kanit font-semibold">฿{baht(order.totalPrice)}</p>
                      </div>
                      <button
                        onClick={() => router.push("/cart")}
                        className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg font-medium"
                        style={{ border: `1.5px solid ${INK}`, color: INK }}
                      >
                        <RotateCcw size={14} />
                        ซื้ออีกครั้ง
                      </button>
                      <button
                        onClick={() => router.push(`/orders/${order.id}`)}
                        className="flex items-center gap-1 text-sm px-4 py-2 rounded-lg font-medium kanit"
                        style={{ background: INK, color: CREAM }}
                      >
                        ดูรายละเอียด
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
 