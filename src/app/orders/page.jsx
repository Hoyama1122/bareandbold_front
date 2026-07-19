"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { cartService } from "@/services/cart.service";
import { paymentService } from "@/services/payment.service";
import { Package, Clock, MapPin, Truck, ChevronRight, AlertCircle, ShoppingBag, Store, ChevronDown, ChevronUp } from "lucide-react";

const INK = "#2B2118";
const CREAM = "#F2ECDD";
const BORDER = "#EFE9DC";
const MUTED = "#8C8577";
const WHITE = "#FFFFFF";
const OLIVE = "#6B7A4E";
const OLIVE_DEEP = "#4F5B38";
const ORANGE = "#EE4D2D"; // Shopee Orange accent

const TABS = [
  { id: "ALL", label: "ทั้งหมด" },
  { id: "PENDING", label: "ที่ต้องชำระ" },
  { id: "PAID", label: "ต้องจัดส่ง" },
  { id: "SHIPPED", label: "ต้องได้รับ" },
  { id: "DELIVERED", label: "สำเร็จแล้ว" },
  { id: "CANCELLED", label: "ยกเลิกแล้ว" }
];

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

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [expandedOrders, setExpandedOrders] = useState({}); // Tracking which orders show shipping info
  
  // QR Modal States
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [chargeId, setChargeId] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const [simulating, setSimulating] = useState({});

  useEffect(() => {
    const checkLogin = () => {
      const logged = cartService.isLoggedIn();
      setIsLoggedIn(logged);
      if (!logged) {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

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

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    }
  }, [isLoggedIn]);

  // Polling order status if QR modal is open
  useEffect(() => {
    if (!showQRModal || !selectedOrder) return;

    const interval = setInterval(async () => {
      try {
        const order = await orderService.getOrderById(selectedOrder.id);
        if (order && order.status === "PAID") {
          // Close modal and refresh list
          setShowQRModal(false);
          setSelectedOrder(null);
          fetchOrders();
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Failed to fetch order status during polling:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [showQRModal, selectedOrder]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "ALL") return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handlePayNow = async (order) => {
    setSelectedOrder(order);
    try {
      const methodMapped = order.payment?.paymentMethod === "PENDING" ? "PROMPTPAY" : order.payment?.paymentMethod;
      const paymentRes = await paymentService.processCheckout({
        orderId: order.id,
        method: methodMapped || "PROMPTPAY"
      });

      if (paymentRes.qrImageUrl) {
        setQrImageUrl(paymentRes.qrImageUrl);
        setChargeId(paymentRes.chargeId);
        setShowQRModal(true);
      } else if (paymentRes.success) {
        // If paid instantly
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to process checkout payment:", err);
    }
  };

  const handleSimulatePayment = async (orderId, targetChargeId) => {
    setSimulating(prev => ({ ...prev, [orderId]: true }));
    try {
      let finalChargeId = targetChargeId;
      // If order has no chargeId yet, generate one by calling checkout first
      if (!finalChargeId) {
        const paymentRes = await paymentService.processCheckout({
          orderId,
          method: "PROMPTPAY"
        });
        finalChargeId = paymentRes.chargeId;
      }

      await paymentService.simulateWebhook({
        chargeId: finalChargeId,
        status: "successful"
      });

      // Give it a brief moment before refreshing
      setTimeout(() => {
        fetchOrders();
        setSimulating(prev => ({ ...prev, [orderId]: false }));
      }, 1500);
    } catch (err) {
      console.error("Failed to simulate webhook:", err);
      setSimulating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING": return "ที่ต้องชำระ";
      case "PAID": return "ต้องจัดส่ง";
      case "SHIPPED": return "ต้องได้รับ";
      case "DELIVERED": return "สำเร็จแล้ว";
      case "CANCELLED": return "ยกเลิกแล้ว";
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return ORANGE;
      case "PAID": return OLIVE;
      case "SHIPPED": return "#2563EB";
      case "DELIVERED": return "#059669";
      case "CANCELLED": return "#DC2626";
      default: return MUTED;
    }
  };

  if (loading) {
    return (
      <div style={{ background: CREAM, minHeight: "100vh", color: INK }} className="flex flex-col items-center justify-center py-20 font-sans">
        <span className="inline-block w-8 h-8 border-4 border-[#6B7A4E]/20 border-t-[#6B7A4E] rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium font-anuphan text-zinc-500">กำลังโหลดประวัติการสั่งซื้อ...</p>
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
    <div className="bg-[#F5F5F5] min-h-screen pb-16 font-sans text-zinc-800" style={{ fontFamily: "'Sarabun', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700&family=Sarabun:wght@400;500;600;700&display=swap');
        .kanit { font-family: 'Kanit', sans-serif; }
        .tab-active { color: ${ORANGE}; border-bottom: 2px solid ${ORANGE}; }
      `}</style>

      {/* Shopee Style Status Tabs */}
      <div className="sticky top-0 bg-white z-20 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto flex justify-between overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-center text-sm font-medium transition-colors whitespace-nowrap px-4 cursor-pointer hover:text-[${ORANGE}]`}
              style={{ color: activeTab === tab.id ? ORANGE : "#555" }}
            >
              <span className={`pb-3 ${activeTab === tab.id ? "tab-active" : ""}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 mt-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded shadow-sm border border-zinc-200 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 bg-[#FEF6F5]">
              <ShoppingBag size={32} style={{ color: ORANGE }} />
            </div>
            <h3 className="kanit text-lg font-semibold mb-2">ยังไม่มีรายการคำสั่งซื้อ</h3>
            <p className="text-sm max-w-sm mb-6 text-zinc-400 font-anuphan">
              คำสั่งซื้อในหมวดหมู่นี้ยังว่างอยู่ เลือกซื้อเครื่องประดับแฮนด์เมดของเราได้ที่หน้าแรก
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 rounded text-sm font-semibold text-white transition hover:opacity-95"
              style={{ background: ORANGE }}
            >
              ไปช้อปปิ้งเลย
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded shadow-sm border border-zinc-200 overflow-hidden">
                
                {/* 1. Header (Store + Status) */}
                <div className="px-6 py-4 flex justify-between items-center border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <Store size={16} className="text-zinc-600" />
                    <span className="font-bold text-sm tracking-wide text-zinc-800">BARE & BOLD</span>
                    <span className="text-xs text-zinc-400 ml-3">ID: {order.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </span>
                    {order.shipping?.status === "IN_TRANSIT" && (
                      <span className="text-xs text-zinc-400 border-l pl-3 flex items-center gap-1">
                        <Truck size={13} /> กำลังจัดส่ง
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Items List */}
                <div className="divide-y divide-zinc-100">
                  {order.items?.map((it) => {
                    const image = it.product?.images?.[0]?.url || "/images/placeholder.jpg";
                    return (
                      <div key={it.id} className="px-6 py-4 flex gap-4 items-center">
                        <img
                          src={image}
                          alt={it.product?.name || "Product"}
                          className="w-20 h-20 rounded border object-cover border-zinc-200 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base text-zinc-800 truncate">{it.product?.name}</h4>
                          <p className="text-xs text-zinc-400 mt-1 font-anuphan">
                            {it.customDetails?.size ? `ขนาด: ${it.customDetails.size}` : ""}
                            {it.customDetails?.material ? ` / วัสดุ: ${it.customDetails.material}` : ""}
                          </p>
                          {it.accessories && it.accessories.length > 0 && (
                            <p className="text-xs text-zinc-400 mt-0.5 font-anuphan">
                              ตกแต่งเพิ่มเติม: {it.accessories.map(a => a.accessory?.name).join(", ")}
                            </p>
                          )}
                          <span className="text-xs text-zinc-400 mt-2 block font-anuphan">จำนวน: x{it.quantity}</span>
                        </div>
                        <div className="text-right pl-4">
                          <span className="text-sm font-medium text-zinc-900">฿{baht(it.price)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 3. Divider Line */}
                <div className="h-px bg-zinc-200" />

                {/* 4. Footer Summary & Actions */}
                <div className="px-6 py-5 bg-[#FFFDF9] flex flex-col gap-4">
                  {/* Shipping Info Expandable */}
                  <div>
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin size={13} /> 
                      {expandedOrders[order.id] ? "ซ่อนที่อยู่จัดส่ง" : "ดูที่อยู่จัดส่งและรายละเอียดพัสดุ"}
                      {expandedOrders[order.id] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    {expandedOrders[order.id] && (
                      <div className="mt-3 p-4 rounded bg-zinc-50 border border-zinc-150 text-xs text-zinc-600 space-y-1.5 leading-relaxed font-anuphan">
                        <p><span className="font-semibold text-zinc-700">ผู้รับ:</span> {order.recipientName}</p>
                        <p><span className="font-semibold text-zinc-700">เบอร์โทรศัพท์:</span> {order.recipientPhone}</p>
                        <p><span className="font-semibold text-zinc-700">ที่อยู่จัดส่ง:</span> {order.shippingAddress}</p>
                        {order.shipping?.trackingNumber && (
                          <p className="pt-1.5 border-t border-dashed mt-1.5 flex items-center gap-1.5 text-[#6B7A4E] font-semibold">
                            <Truck size={14} /> เลขพัสดุ: {order.shipping.trackingNumber} ({order.shipping.carrier})
                          </p>
                        )}
                        <p className="text-[10px] text-zinc-400 pt-1">สั่งซื้อเมื่อ: {formatDate(order.createdAt)}</p>
                      </div>
                    )}
                  </div>

                  {/* Total price row (Aligned to Right) */}
                  <div className="flex justify-end items-center gap-3 py-2">
                    <span className="text-xs text-zinc-500 font-anuphan flex items-center gap-1.5">
                      <Clock size={12} /> ยอดสั่งซื้อทั้งหมด ({order.items?.reduce((s,i) => s + i.quantity, 0)} ชิ้น):
                    </span>
                    <span className="text-xl font-bold" style={{ color: ORANGE }}>
                      ฿{baht(order.totalPrice)}
                    </span>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex justify-end gap-3 pt-2">
                    {order.status === "PENDING" && (
                      <>
                        <button
                          disabled={simulating[order.id]}
                          onClick={() => handleSimulatePayment(order.id, order.payment?.omiseChargeId)}
                          className="px-4 py-2 border border-zinc-300 rounded text-xs font-medium text-zinc-600 hover:bg-zinc-50 cursor-pointer disabled:opacity-60"
                        >
                          {simulating[order.id] ? "กำลังจำลองชำระเงิน..." : "จำลองชำระเงินสำเร็จ (Simulate)"}
                        </button>
                        <button
                          onClick={() => handlePayNow(order)}
                          className="px-6 py-2 rounded text-xs font-semibold text-white cursor-pointer hover:opacity-95"
                          style={{ background: ORANGE }}
                        >
                          ชำระเงิน / ดู QR
                        </button>
                      </>
                    )}
                    {order.status === "DELIVERED" && (
                      <button
                        onClick={() => router.push("/")}
                        className="px-5 py-2 border border-zinc-300 rounded text-xs font-medium text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                      >
                        ซื้ออีกครั้ง
                      </button>
                    )}
                    {order.status === "PAID" && (
                      <span className="text-xs text-zinc-400 border px-3 py-1.5 rounded bg-zinc-50 select-none">
                        ผู้ขายกำลังเตรียมจัดส่งสินค้า
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* PromtPay QR Code Popup Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 text-center shadow-lg animate-in fade-in zoom-in duration-200">
            <h3 className="kanit text-lg font-bold mb-2">สแกนชำระเงินด้วยพร้อมเพย์</h3>
            <p className="text-xs text-zinc-500 mb-6 font-anuphan">
              กรุณาบันทึกภาพ QR Code เพื่อสแกนจ่ายเงินจำนวน ฿{selectedOrder ? baht(selectedOrder.totalPrice) : "0"}
            </p>
            
            <div className="flex justify-center mb-6">
              {qrImageUrl ? (
                <img src={qrImageUrl} alt="PromptPay QR Code" className="w-56 h-56 border p-1 rounded" />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center bg-zinc-100 rounded">
                  <span className="animate-pulse text-xs text-zinc-400">กำลังดึง QR Code...</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#6B7A4E] font-medium animate-pulse mb-6 font-anuphan">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B7A4E]" />
              กำลังรอการโอนเงิน (ระบบอัปเดตอัตโนมัติ)...
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowQRModal(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 py-2.5 border border-zinc-300 rounded text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
              <button
                onClick={async () => {
                  if (selectedOrder) {
                    await handleSimulatePayment(selectedOrder.id, chargeId);
                    setShowQRModal(false);
                    setSelectedOrder(null);
                  }
                }}
                className="flex-1 py-2.5 rounded text-xs font-semibold text-white cursor-pointer hover:opacity-95"
                style={{ background: ORANGE }}
              >
                จำลองจ่ายเงินสำเร็จ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
