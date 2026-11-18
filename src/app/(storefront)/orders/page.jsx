"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { cartService } from "@/services/cart.service";
import { paymentService } from "@/services/payment.service";
import {Clock,MapPin,Truck,AlertCircle,ShoppingBag,Store,ChevronDown,ChevronUp,RotateCcw,ImagePlus,} from "lucide-react";

// Theme color constants matching f:/GitHub/CSI204-BareAndBold/bareandbold_front/src/app/globals.css
const CREAM = "#FDFBF7";       // earth-cream
const BEIGE = "#F5F0E6";       // earth-beige
const WALNUT = "#6A5242";      // earth-walnut
const OLIVE = "#556B2F";       // earth-olive
const DARK = "#3C322A";        // earth-dark
const BORDER = "#EADECC";      // earth-border
const MUTED = "#8C8577";
const WHITE = "#FFFFFF";

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
  const [expandedOrders, setExpandedOrders] = useState({});
  
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

    if (activeTab === "PAID") {
      return orders.filter(
        (order) => order.status === "PAID" || order.status === "PRODUCING"
      );
    }

    if (activeTab === "DELIVERED") {
      return orders.filter((order) =>
        ["DELIVERED", "COMPLETED"].includes(order.status)
      );
    }

    return orders.filter((order) => order.status === activeTab);
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
      case "PRODUCING": return "กำลังผลิต";
      case "SHIPPED": return "ต้องได้รับ";
      case "DELIVERED":
      case "COMPLETED": return "สำเร็จแล้ว";
      case "CANCELLED": return "ยกเลิกแล้ว";
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return WALNUT;
      case "PAID": return OLIVE;
      case "PRODUCING": return "#8B5CF6";
      case "SHIPPED": return "#2563EB";
      case "DELIVERED":
      case "COMPLETED": return "#059669";
      case "CANCELLED": return "#DC2626";
      default: return MUTED;
    }
  };

const [showReturnModal, setShowReturnModal] = useState(false);
const [returnOrderId, setReturnOrderId] = useState("");
const [returnReason, setReturnReason] = useState("");
const [returnItemId, setReturnItemId] = useState("");
const [returnCondition, setReturnCondition] = useState("");
const [returnDetails, setReturnDetails] = useState("");
const [returnFiles, setReturnFiles] = useState([]);
const [returnPreviews, setReturnPreviews] = useState([]);
const [returnNotice, setReturnNotice] = useState("");

const eligibleReturnOrders = orders.filter((order) =>
  ["DELIVERED", "COMPLETED"].includes(order.status)
);

useEffect(() => {
  const urls = returnFiles.map((file) => URL.createObjectURL(file));
  setReturnPreviews(urls);

  return () => urls.forEach((url) => URL.revokeObjectURL(url));
}, [returnFiles]);

const openReturnModal = (order = null) => {
  const defaultOrder = order || eligibleReturnOrders[0] || null;
  setReturnOrderId(defaultOrder?.id || "");
  setReturnItemId("");
  setReturnReason("");
  setReturnCondition("");
  setReturnDetails("");
  setReturnFiles([]);
  setReturnNotice("");
  setShowReturnModal(true);
};

const handleConfirmReceived = (order) => {
  if (!window.confirm(`ยืนยันว่าได้รับสินค้าในออเดอร์ ${order.id} แล้วใช่ไหม?`)) {
    return;
  }

  // ตัวอย่าง UI เท่านั้น: เปลี่ยนสถานะในหน้าจอ ยังไม่ส่งไปบันทึกใน API
  setOrders((current) =>
    current.map((item) =>
      item.id === order.id ? { ...item, status: "COMPLETED" } : item
    )
  );
};

const handleReturnFormSubmit = (event) => {
  event.preventDefault();

  if (!returnOrderId || !returnReason || !returnCondition) {
    setReturnNotice("กรุณาเลือกออเดอร์ เหตุผล และสภาพสินค้าให้ครบ");
    return;
  }

  // ขั้นนี้ยังไม่บันทึกหรืออัปโหลดรูป เพราะยังไม่ได้เชื่อม API
  setReturnNotice("กรอกข้อมูลเรียบร้อยแล้ว ขั้นต่อไปจะเชื่อมการส่งคำขอกับ API");
};

  if (loading) {
    return (
      <div style={{ background: CREAM, minHeight: "100vh", color: DARK }} className="flex flex-col items-center justify-center py-20 font-sans">
        <span className="inline-block w-8 h-8 border-4 rounded-full animate-spin mb-4" style={{ borderColor: `${BORDER}20`, borderTopColor: OLIVE }} />
        <p className="text-sm font-medium font-anuphan" style={{ color: MUTED }}>กำลังโหลดประวัติการสั่งซื้อ...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div style={{ background: CREAM, minHeight: "100vh", color: DARK }} className="flex items-center justify-center py-20 px-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center border" style={{ borderColor: BORDER }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: BEIGE, color: WALNUT }}>
            <AlertCircle size={32} />
          </div>
          <h1 className="kanit text-xl font-bold mb-3">กรุณาเข้าสู่ระบบ</h1>
          <p className="text-sm mb-8 font-anuphan text-zinc-500">
            คุณจำเป็นต้องเข้าสู่ระบบสมาชิกเพื่อเข้าถึงข้อมูลและตรวจสอบประวัติคำสั่งซื้อทั้งหมดของคุณ
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 rounded-lg font-medium kanit cursor-pointer"
            style={{ background: WALNUT, color: CREAM }}
          >
            กลับสู่หน้าหลักเพื่อเข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 font-anuphan" style={{ background: CREAM, color: DARK }}>
      <style>{`
        .tab-active { color: ${OLIVE}; border-bottom: 2px solid ${OLIVE}; }
      `}</style>

      {/* Earth Theme Status Tabs */}
      <div className="sticky top-0 z-20 " style={{ borderColor: BORDER }}>
        <div className="max-w-5xl mx-auto flex justify-between overflow-x-auto">
                    {TABS.map((tab) => (
            <React.Fragment key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-4 text-center text-sm font-semibold transition-colors whitespace-nowrap px-4 cursor-pointer"
                style={{ color: activeTab === tab.id ? OLIVE : MUTED }}
              >
                <span className={`pb-3 ${activeTab === tab.id ? "tab-active" : ""}`}>
                  {tab.label}
                </span>
              </button>

              {tab.id === "CANCELLED" && (
                <button
                  onClick={() => openReturnModal()}
                  className="my-2 px-4 rounded-lg text-xs font-semibold whitespace-nowrap border cursor-pointer"
                  style={{ borderColor: BORDER, color: WALNUT, background: WHITE }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <RotateCcw size={14} />
                    คืนสินค้า
                  </span>
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 mt-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border flex flex-col items-center justify-center" style={{ borderColor: BORDER }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: BEIGE }}>
              <ShoppingBag size={32} style={{ color: WALNUT }} />
            </div>
            <h3 className="kanit text-lg font-semibold mb-2">ยังไม่มีรายการคำสั่งซื้อ</h3>
            <p className="text-sm max-w-sm mb-6 text-zinc-400 font-anuphan">
              คำสั่งซื้อในหมวดหมู่นี้ยังว่างอยู่ เลือกซื้อเครื่องประดับแฮนด์เมดของเราได้ที่หน้าแรก
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 rounded-lg text-sm font-semibold text-white transition hover:opacity-95 cursor-pointer"
              style={{ background: WALNUT }}
            >
              ไปช้อปปิ้งเลย
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: BORDER }}>
                
                {/* 1. Header (Store + Status + Tracking) */}
                <div className="px-6 py-4 flex flex-wrap justify-between items-center gap-3 border-b" style={{ borderColor: `${BORDER}40`, background: `${BEIGE}15` }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Store size={16} style={{ color: WALNUT }} />
                    <span className="font-bold text-sm tracking-wide" style={{ color: DARK }}>BARE & BOLD</span>
                    <span className="text-xs ml-3 text-zinc-400 font-mono">ORDER: {order.id}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {order.shipping?.trackingNumber ? (
                      <span className="text-xs font-mono text-zinc-700 bg-white px-2.5 py-1 rounded-md border border-zinc-200 shadow-2xs flex items-center gap-1.5">
                        <Truck size={13} className="text-zinc-500" />
                        <span className="font-semibold">{order.shipping.carrier ? `${order.shipping.carrier}: ` : ""}</span>
                        <span className="font-bold text-zinc-900">{order.shipping.trackingNumber}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 font-medium bg-zinc-50/80 px-2.5 py-1 rounded-md border border-zinc-200/40 flex items-center gap-1.5">
                        <Clock size={12} className="text-zinc-400" />
                        <span>รอเจ้าหน้าที่ระบุเลขพัสดุ</span>
                      </span>
                    )}

                    <span
                      className="text-sm font-bold ml-1"
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                {/* 2. Items List */}
                <div className="divide-y divide-[#EADECC]/40">
                  {order.items?.map((it) => {
                    const image = it.product?.images?.[0]?.url || "/images/placeholder.jpg";
                    return (
                      <div key={it.id} className="px-6 py-4 flex gap-4 items-center">
                        <img
                          src={image}
                          alt={it.product?.name || "Product"}
                          className="w-20 h-20 rounded-lg  object-cover flex-shrink-0"
                          
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base truncate" style={{ color: DARK }}>{it.product?.name}</h4>
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
                          <span className="text-sm font-semibold" style={{ color: DARK }}>฿{baht(it.price)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 3. Footer Summary & Actions */}
                <div className="px-6 py-5 flex flex-col gap-4 border-t" style={{ background: `${CREAM}30`, borderColor: `${BORDER}40` }}>
                  {/* Shipping Info Expandable */}
                  <div>
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="text-xs font-semibold hover:opacity-80 flex items-center gap-1 cursor-pointer transition-opacity"
                      style={{ color: MUTED }}
                    >
                      <MapPin size={13} style={{ color: OLIVE }} /> 
                      {expandedOrders[order.id] ? "ซ่อนที่อยู่จัดส่ง" : "ดูที่อยู่จัดส่งและรายละเอียดพัสดุ"}
                      {expandedOrders[order.id] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    {expandedOrders[order.id] && (
                      <div className="mt-3 p-4 rounded-lg border text-xs leading-relaxed space-y-1.5" style={{ background: CREAM, borderColor: `${BORDER}40`, color: DARK }}>
                        <p><span className="font-bold">ผู้รับ:</span> {order.recipientName}</p>
                        <p><span className="font-bold">เบอร์โทรศัพท์:</span> {order.recipientPhone}</p>
                        <p><span className="font-bold">ที่อยู่จัดส่ง:</span> {order.shippingAddress}</p>
                        {order.shipping?.trackingNumber ? (
                          <p className="pt-1.5 border-t border-dashed mt-1.5 flex items-center gap-1.5 font-semibold" style={{ borderColor: BORDER, color: OLIVE }}>
                            <Truck size={14} /> เลขพัสดุ: {order.shipping.trackingNumber} ({order.shipping.carrier || "ขนส่งเอกชน"})
                          </p>
                        ) : (
                          <p className="pt-1.5 border-t border-dashed mt-1.5 flex items-center gap-1.5 text-zinc-400 font-medium" style={{ borderColor: BORDER }}>
                            <Clock size={14} /> เลขพัสดุ: รอเจ้าหน้าที่ระบุเลขพัสดุ
                          </p>
                        )}
                        <p className="text-[10px] text-zinc-400 pt-1">สั่งซื้อเมื่อ: {formatDate(order.createdAt)}</p>
                      </div>
                    )}
                  </div>

                  {/* Total price row */}
                  <div className="flex justify-end items-center gap-3 py-1">
                    <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: MUTED }}>
                      <Clock size={12} /> ยอดสั่งซื้อทั้งหมด ({order.items?.reduce((s,i) => s + i.quantity, 0)} ชิ้น):
                    </span>
                    <span className="text-xl font-bold" style={{ color: OLIVE }}>
                      ฿{baht(order.totalPrice)}
                    </span>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex justify-end gap-3 pt-1">
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="px-4 py-2 border rounded-lg text-xs font-semibold cursor-pointer transition-colors mr-auto"
                      style={{ borderColor: BORDER, color: WALNUT, background: WHITE }}
                      onMouseEnter={(e) => { e.target.style.background = BEIGE; }}
                      onMouseLeave={(e) => { e.target.style.background = WHITE; }}
                    >
                      ดูรายละเอียดออเดอร์
                    </button>

                    {order.status === "PENDING" && (
                      <>
                        <button
                          disabled={simulating[order.id]}
                          onClick={() => handleSimulatePayment(order.id, order.payment?.omiseChargeId)}
                          className="px-4 py-2 border rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-60 transition-colors"
                          style={{ borderColor: BORDER, color: WALNUT, background: WHITE }}
                          onMouseEnter={(e) => { if (!simulating[order.id]) e.target.style.background = BEIGE; }}
                          onMouseLeave={(e) => { if (!simulating[order.id]) e.target.style.background = WHITE; }}
                        >
                          {simulating[order.id] ? "กำลังจำลอง..." : "จำลองชำระเงินสำเร็จ (Simulate)"}
                        </button>
                        <button
                          onClick={() => handlePayNow(order)}
                          className="px-6 py-2 rounded-lg text-xs font-bold text-white cursor-pointer hover:opacity-95 transition-opacity"
                          style={{ background: WALNUT }}
                        >
                          ชำระเงิน / ดู QR
                        </button>
                      </>
                    )}
                                        {["DELIVERED", "COMPLETED"].includes(order.status) && (
                      <>
                        {order.status === "DELIVERED" && (
                          <button
                            onClick={() => handleConfirmReceived(order)}
                            className="px-5 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-95"
                            style={{ background: OLIVE }}
                          >
                            ยืนยันรับสินค้า
                          </button>
                        )}

                        <button
                          onClick={() => openReturnModal(order)}
                          className="px-5 py-2 border rounded-lg text-xs font-semibold cursor-pointer"
                          style={{ borderColor: BORDER, color: WALNUT, background: WHITE }}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <RotateCcw size={14} />
                            คืนสินค้า
                          </span>
                        </button>

                        <button
                          onClick={() => router.push("/")}
                          className="px-5 py-2 border rounded-lg text-xs font-semibold cursor-pointer"
                          style={{ borderColor: BORDER, color: WALNUT, background: WHITE }}
                        >
                          ซื้ออีกครั้ง
                        </button>
                      </>
                    )}
                    {order.status === "PAID" && (
                      <span className="text-xs border px-3 py-1.5 rounded-lg select-none" style={{ background: BEIGE, borderColor: BORDER, color: MUTED }}>
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

      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold" style={{ color: DARK }}>
                  คำขอคืนสินค้า
                </h2>
                <p className="mt-1 text-sm" style={{ color: MUTED }}>
                  กรุณาระบุรายละเอียดและแนบรูปหลักฐานประกอบคำขอ
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="rounded-lg px-3 py-1 text-sm"
                style={{ color: MUTED }}
              >
                ปิด
              </button>
            </div>

            {eligibleReturnOrders.length === 0 ? (
              <div
                className="rounded-xl p-4 text-sm"
                style={{ background: BEIGE, color: DARK }}
              >
                ยังไม่มีออเดอร์สถานะ “สำเร็จแล้ว” ที่สามารถส่งคำขอคืนสินค้าได้
              </div>
            ) : (
              <form onSubmit={handleReturnFormSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold" style={{ color: DARK }}>
                    ออเดอร์ที่ต้องการคืนสินค้า *
                  </label>
                  <select
                    value={returnOrderId}
                    onChange={(event) => {
                      setReturnOrderId(event.target.value);
                      setReturnItemId("");
                    }}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{ borderColor: BORDER, color: DARK }}
                    required
                  >
                    <option value="">เลือกออเดอร์</option>
                    {eligibleReturnOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.id} — ฿{baht(order.totalPrice)}
                      </option>
                    ))}
                  </select>
                </div>

                {returnOrderId && (
                  <div>
                    <label className="mb-1 block text-sm font-semibold" style={{ color: DARK }}>
                      สินค้าที่ต้องการคืน
                    </label>
                    <select
                      value={returnItemId}
                      onChange={(event) => setReturnItemId(event.target.value)}
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                      style={{ borderColor: BORDER, color: DARK }}
                    >
                      <option value="">สินค้าทั้งออเดอร์</option>
                      {orders
                        .find((order) => order.id === returnOrderId)
                        ?.items?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.product?.name || "สินค้า"} (จำนวน {item.quantity})
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-semibold" style={{ color: DARK }}>
                    เหตุผลในการคืนสินค้า *
                  </label>
                  <select
                    value={returnReason}
                    onChange={(event) => setReturnReason(event.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{ borderColor: BORDER, color: DARK }}
                    required
                  >
                    <option value="">เลือกเหตุผล</option>
                    <option value="ได้รับสินค้าไม่ตรงกับที่สั่ง">ได้รับสินค้าไม่ตรงกับที่สั่ง</option>
                    <option value="สินค้าเสียหายหรือมีตำหนิ">สินค้าเสียหายหรือมีตำหนิ</option>
                    <option value="ได้รับสินค้าไม่ครบ">ได้รับสินค้าไม่ครบ</option>
                    <option value="สินค้าไม่ตรงตามรายละเอียด">สินค้าไม่ตรงตามรายละเอียด</option>
                    <option value="เปลี่ยนใจ">เปลี่ยนใจ</option>
                    <option value="อื่น ๆ">อื่น ๆ</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold" style={{ color: DARK }}>
                    สภาพสินค้า *
                  </label>
                  <select
                    value={returnCondition}
                    onChange={(event) => setReturnCondition(event.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{ borderColor: BORDER, color: DARK }}
                    required
                  >
                    <option value="">เลือกสภาพสินค้า</option>
                    <option value="ยังไม่ได้ใช้งาน">ยังไม่ได้ใช้งาน</option>
                    <option value="ทดลองสวมใส่แล้ว">ทดลองสวมใส่แล้ว</option>
                    <option value="สินค้าเสียหาย">สินค้าเสียหาย</option>
                    <option value="บรรจุภัณฑ์ไม่ครบหรือชำรุด">บรรจุภัณฑ์ไม่ครบหรือชำรุด</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold" style={{ color: DARK }}>
                    รายละเอียดเพิ่มเติม
                  </label>
                  <textarea
                    value={returnDetails}
                    onChange={(event) => setReturnDetails(event.target.value)}
                    maxLength={2000}
                    rows={4}
                    placeholder="อธิบายปัญหาหรือข้อมูลเพิ่มเติม (ไม่เกิน 2,000 ตัวอักษร)"
                    className="w-full resize-y rounded-lg border px-3 py-2 text-sm"
                    style={{ borderColor: BORDER, color: DARK }}
                  />
                  <p className="mt-1 text-right text-xs" style={{ color: MUTED }}>
                    {returnDetails.length}/2000
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold" style={{ color: DARK }}>
                    รูปหลักฐาน (สูงสุด 5 รูป, รูปละไม่เกิน 5 MB)
                  </label>
                  <label
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm"
                    style={{ borderColor: BORDER, color: WALNUT, background: CREAM }}
                  >
                    <ImagePlus size={18} />
                    เลือกรูปภาพ
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        const files = Array.from(event.target.files || []);
                        const validFiles = files
                          .filter(
                            (file) =>
                              file.type.startsWith("image/") &&
                              file.size <= 5 * 1024 * 1024
                          )
                          .slice(0, 5);

                        setReturnFiles(validFiles);
                        setReturnNotice(
                          files.length !== validFiles.length
                            ? "รับเฉพาะไฟล์รูปภาพไม่เกิน 5 MB และแนบได้สูงสุด 5 รูป"
                            : ""
                        );
                        event.target.value = "";
                      }}
                    />
                  </label>

                  {returnPreviews.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {returnPreviews.map((url, index) => (
                        <img
                          key={`${url}-${index}`}
                          src={url}
                          alt={`รูปหลักฐาน ${index + 1}`}
                          className="h-20 w-20 rounded-lg border object-cover"
                          style={{ borderColor: BORDER }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {returnNotice && (
                  <p
                    className="rounded-lg px-3 py-2 text-sm"
                    style={{ background: BEIGE, color: WALNUT }}
                  >
                    {returnNotice}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReturnModal(false)}
                    className="rounded-lg border px-4 py-2 text-sm"
                    style={{ borderColor: BORDER, color: WALNUT }}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg px-5 py-2 text-sm font-semibold text-white"
                    style={{ background: WALNUT }}
                  >
                    ตรวจสอบข้อมูล
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}


      {/* PromtPay QR Code Popup Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-lg animate-in fade-in zoom-in duration-200 border" style={{ borderColor: BORDER }}>
            <h3 className="kanit text-lg font-bold" style={{ color: DARK }}>สแกนชำระเงินด้วยพร้อมเพย์</h3>
            <p className="text-xs text-zinc-500 mb-6 font-anuphan">
              กรุณาบันทึกภาพ QR Code เพื่อสแกนจ่ายเงินจำนวน ฿{selectedOrder ? baht(selectedOrder.totalPrice) : "0"}
            </p>
            
            <div className="flex justify-center mb-6">
              {qrImageUrl ? (
                <img src={qrImageUrl} alt="PromptPay QR Code" className="w-56 h-56 border p-1 rounded-lg" style={{ borderColor: BORDER }} />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center bg-zinc-50 rounded-lg border" style={{ borderColor: BORDER }}>
                  <span className="animate-pulse text-xs text-zinc-400">กำลังดึง QR Code...</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold animate-pulse mb-6 font-anuphan" style={{ color: OLIVE }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: OLIVE }} />
              กำลังรอการโอนเงิน (ระบบอัปเดตอัตโนมัติ)...
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowQRModal(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 py-2.5 border rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
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
                className="flex-1 py-2.5 rounded-lg text-xs font-bold text-white cursor-pointer hover:opacity-95"
                style={{ background: WALNUT }}
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
