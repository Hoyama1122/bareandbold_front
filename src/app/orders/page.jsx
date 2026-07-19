"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { cartService } from "@/services/cart.service";
import { Package, Clock, ShieldCheck, MapPin, Truck, ChevronRight, AlertCircle, ShoppingBag } from "lucide-react";

const INK = "#2B2118";
const CREAM = "#F2ECDD";
const CREAM_DEEP = "#EAE2CC";
const OLIVE = "#6B7A4E";
const OLIVE_DEEP = "#4F5B38";
const BORDER = "#E1D8C0";
const MUTED = "#8C8577";
const WHITE = "#FFFFFF";

function baht(n) {
  return Number(n).toLocaleString("th-TH");
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getStatusBadge(status) {
  let bg = "#F5F5F5";
  let text = MUTED;
  let label = status;

  switch (status) {
    case "PENDING":
      bg = "#FEF3C7";
      text = "#D97706";
      label = "รอชำระเงิน";
      break;
    case "PAID":
      bg = "#D1FAE5";
      text = "#059669";
      label = "ชำระเงินแล้ว";
      break;
    case "SHIPPED":
      bg = "#DBEAFE";
      text = "#2563EB";
      label = "จัดส่งแล้ว";
      break;
    case "DELIVERED":
      bg = "#E0F2FE";
      text = "#0369A1";
      label = "ได้รับสินค้าแล้ว";
      break;
    case "CANCELLED":
      bg = "#FEE2E2";
      text = "#DC2626";
      label = "ยกเลิกแล้ว";
      break;
  }

  return (
    <span
      className="text-xs font-semibold px-3 py-1.5 rounded-full font-anuphan"
      style={{ background: bg, color: text }}
    >
      {label}
    </span>
  );
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    // Check if logged in
    const checkLogin = () => {
      const logged = cartService.isLoggedIn();
      setIsLoggedIn(logged);
      if (!logged) {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderHistory();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to load order history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn]);

  if (loading) {
    return (
      <div style={{ background: CREAM, minHeight: "100vh", color: INK }} className="flex flex-col items-center justify-center py-20 font-sans">
        <span className="inline-block w-8 h-8 border-4 border-[#6B7A4E]/20 border-t-[#6B7A4E] rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium font-anuphan text-zinc-500">กำลังโหลดประวัติการสั่งซื้อของคุณ...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div style={{ background: CREAM, minHeight: "100vh", color: INK }} className="flex items-center justify-center py-20 font-sans px-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center border" style={{ borderColor: BORDER }}>
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
            <AlertCircle size={32} />
          </div>
          <h1 className="kanit text-xl font-bold mb-3">กรุณาเข้าสู่ระบบ</h1>
          <p className="text-sm text-zinc-500 mb-8 font-anuphan">
            คุณจำเป็นต้องเข้าสู่ระบบสมาชิกเพื่อเข้าถึงข้อมูลและตรวจสอบประวัติคำสั่งซื้อทั้งหมดของคุณ
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-lg font-medium kanit"
            style={{ background: INK, color: CREAM }}
          >
            กลับสู่หน้าหลักเพื่อเข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "'Sarabun', sans-serif", color: INK }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@500;600;700&family=Sarabun:wght@400;500;600&display=swap');
        .kanit { font-family: 'Kanit', sans-serif; }
      `}</style>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="kanit text-2xl font-bold mb-1">ประวัติการสั่งซื้อ</h1>
            <p className="text-sm" style={{ color: MUTED }}>
              ตรวจสอบรายการและสถานะการจัดส่งสินค้าทั้งหมดที่คุณสั่งซื้อ
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-xs font-semibold px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-1.5"
            style={{ borderColor: BORDER, background: WHITE, color: INK }}
          >
            เลือกซื้อสินค้าเพิ่ม <ChevronRight size={14} />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-white border border-dashed flex flex-col items-center justify-center px-6" style={{ borderColor: BORDER }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: CREAM }}>
              <ShoppingBag size={26} style={{ color: OLIVE_DEEP }} />
            </div>
            <h3 className="kanit text-lg font-semibold mb-2">ไม่พบประวัติการสั่งซื้อ</h3>
            <p className="text-sm max-w-sm mb-6 text-zinc-500">
              คุณยังไม่เคยทำรายการสั่งซื้อสินค้ากับทางร้าน หรือคำสั่งซื้อของคุณยังไม่ได้ถูกประมวลผล
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-lg font-medium text-sm kanit"
              style={{ background: INK, color: CREAM }}
            >
              เริ่มต้นเลือกซื้อสินค้า
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl overflow-hidden bg-white border shadow-sm" style={{ borderColor: BORDER }}>
                
                {/* Order Card Header */}
                <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b" style={{ borderColor: BORDER, background: "#FCFAF6" }}>
                  <div className="flex items-center gap-2">
                    <Package size={18} style={{ color: OLIVE_DEEP }} />
                    <span className="kanit font-bold text-sm">หมายเลขคำสั่งซื้อ:</span>
                    <span className="kanit text-sm font-semibold text-zinc-700">{order.id}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs flex items-center gap-1 text-zinc-500 font-anuphan">
                      <Clock size={13} /> {formatDate(order.createdAt)}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b" style={{ borderColor: BORDER }}>
                  <div className="flex flex-col gap-4">
                    {order.items?.map((it) => {
                      const image = it.product?.images?.[0]?.url || "/images/placeholder.jpg";
                      return (
                        <div key={it.id} className="flex gap-4 items-start">
                          <img
                            src={image}
                            alt={it.product?.name || "Product"}
                            className="w-16 h-20 rounded-lg object-cover border"
                            style={{ borderColor: BORDER }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-zinc-800 truncate">{it.product?.name}</h4>
                            <p className="text-xs text-zinc-500 mt-1 font-anuphan">
                              {it.customDetails?.size ? `ขนาด: ${it.customDetails.size}` : ""} 
                              {it.customDetails?.material ? ` / วัสดุ: ${it.customDetails.material}` : ""}
                            </p>
                            {it.accessories && it.accessories.length > 0 && (
                              <p className="text-xs text-zinc-400 mt-0.5 font-anuphan">
                                ตกแต่งเพิ่มเติม: {it.accessories.map(a => a.accessory?.name).join(", ")}
                              </p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-medium">฿{baht(it.price)}</p>
                            <p className="text-xs text-zinc-400 mt-0.5 font-anuphan">จำนวน: {it.quantity}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping & Payment Summary */}
                <div className="p-6 bg-zinc-50/50 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  {/* Recipient & Address */}
                  <div className="space-y-3 font-anuphan">
                    <div className="flex items-center gap-2 font-bold" style={{ color: INK }}>
                      <MapPin size={16} style={{ color: OLIVE_DEEP }} />
                      <span>ข้อมูลการจัดส่ง</span>
                    </div>
                    <div className="text-zinc-600 text-xs leading-relaxed space-y-1">
                      <p><span className="font-medium">ผู้รับ:</span> {order.recipientName}</p>
                      <p><span className="font-medium">เบอร์โทรศัพท์:</span> {order.recipientPhone}</p>
                      <p className="max-w-sm"><span className="font-medium">ที่อยู่:</span> {order.shippingAddress}</p>
                    </div>
                  </div>

                  {/* Pricing and Tracking details */}
                  <div className="flex flex-col justify-between gap-4 font-anuphan">
                    <div className="space-y-1 text-xs">
                      {order.shipping?.trackingNumber && (
                        <div className="flex items-center gap-2 mb-2">
                          <Truck size={16} style={{ color: OLIVE_DEEP }} />
                          <span className="font-semibold" style={{ color: INK }}>
                            เลขพัสดุ: {order.shipping.trackingNumber} ({order.shipping.carrier})
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-zinc-500">
                        <span>ยอดรวมสินค้า</span>
                        <span>฿{baht(order.totalPrice - (order.totalPrice >= 2000 ? 0 : 90))}</span>
                      </div>
                      <div className="flex justify-between text-zinc-500">
                        <span>ค่าจัดส่ง</span>
                        <span>{order.totalPrice >= 2000 ? "ฟรี" : "฿90"}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-bold text-sm text-zinc-800">
                        <span>ยอดชำระทั้งหมด</span>
                        <span className="text-base" style={{ color: OLIVE_DEEP }}>฿{baht(order.totalPrice)}</span>
                      </div>
                    </div>

                    {order.payment && (
                      <div className="text-right">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-zinc-100 border text-zinc-600 font-anuphan">
                          ชำระเงินผ่าน: {order.payment.paymentMethod === "PROMPTPAY" ? "พร้อมเพย์" : (order.payment.paymentMethod === "CREDIT_CARD" ? "บัตรเครดิต" : order.payment.paymentMethod)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
