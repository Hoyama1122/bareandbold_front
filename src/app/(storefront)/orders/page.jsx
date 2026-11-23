"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/order.service";
import { cartService } from "@/services/cart.service";
import { paymentService } from "@/services/payment.service";
import {Clock,MapPin,Truck,AlertCircle,ShoppingBag,Store,ChevronDown,ChevronUp,RotateCcw,ImagePlus,Star,CheckCircle2,PackageCheck,ExternalLink,Copy,Check} from "lucide-react";
import ReviewModal from "@/components/orders/ReviewModal";
import { uploadService } from "@/services/upload.service";

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
  { id: "REFUNDS", label: "การคืนเงิน/เปลี่ยนสินค้า" },
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

    if (activeTab === "REFUNDS") {
      return orders.filter(
        (order) =>
          order.status === "REFUNDED" ||
          (Array.isArray(order.refundRequests) && order.refundRequests.length > 0)
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
  const [returnType, setReturnType] = useState("REFUND");
  const [returnOrderId, setReturnOrderId] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [returnItemId, setReturnItemId] = useState("");
  const [returnCondition, setReturnCondition] = useState("");
  const [returnBankName, setReturnBankName] = useState("");
  const [returnBankAccountNumber, setReturnBankAccountNumber] = useState("");
  const [returnBankAccountName, setReturnBankAccountName] = useState("");
  const [returnDetails, setReturnDetails] = useState("");
  const [returnFiles, setReturnFiles] = useState([]);
  const [returnPreviews, setReturnPreviews] = useState([]);
  const [returnNotice, setReturnNotice] = useState("");
  const [submittingConfirmId, setSubmittingConfirmId] = useState(null);
  const [submittingRefund, setSubmittingRefund] = useState(false);
  const [reviewModalOrder, setReviewModalOrder] = useState(null);

  // Return shipment & exchange receipt states
  const [returnCarrierInputs, setReturnCarrierInputs] = useState({});
  const [returnTrackingInputs, setReturnTrackingInputs] = useState({});
  const [submittingReturnId, setSubmittingReturnId] = useState(null);
  const [confirmingExchangeId, setConfirmingExchangeId] = useState(null);
  const [copiedAddressId, setCopiedAddressId] = useState(null);

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
    setReturnType("REFUND");
    setReturnOrderId(defaultOrder?.id || "");
    setReturnItemId("");
    setReturnReason("");
    setReturnCondition("");
    setReturnBankName("");
    setReturnBankAccountNumber("");
    setReturnBankAccountName("");
    setReturnDetails("");
    setReturnFiles([]);
    setReturnNotice("");
    setShowReturnModal(true);
  };

  const handleConfirmReceived = async (order) => {
    if (!window.confirm(`ยืนยันว่าได้รับสินค้าในออเดอร์ ${order.id} เรียบร้อยแล้วใช่ไหม? ระบบจะโอนเงินให้ร้านค้าทันที`)) {
      return;
    }

    try {
      setSubmittingConfirmId(order.id);
      const res = await orderService.confirmOrderReceived(order.id);
      if (res?.success) {
        setOrders((current) =>
          current.map((item) =>
            item.id === order.id
              ? { ...item, ...(res.order || {}), status: "COMPLETED" }
              : item
          )
        );
        alert("ยืนยันรับสินค้าเรียบร้อยแล้ว ขอบคุณที่ใช้บริการ BARE & BOLD");
      }
    } catch (err) {
      alert(err.message || "ยืนยันรับสินค้าไม่สำเร็จ");
    } finally {
      setSubmittingConfirmId(null);
    }
  };

  const handleConfirmSubOrder = async (subOrder, orderId) => {
    if (!window.confirm(`ยืนยันว่าได้รับพัสดุ (${subOrder.subOrderNumber}) จากร้าน "${subOrder.shop?.name || 'ร้านค้า'}" เรียบร้อยแล้วใช่ไหม? ระบบจะโอนเงินให้ร้านค้าทันที`)) {
      return;
    }

    try {
      setSubmittingConfirmId(subOrder.id);
      const res = await orderService.confirmSubOrderReceived(subOrder.id);
      if (res?.success) {
        // อัปเดต state orders
        fetchOrders();
        alert("ยืนยันรับสินค้าจากร้านนี้เรียบร้อยแล้ว ระบบได้โอนเงินให้ร้านค้าแล้ว");
      }
    } catch (err) {
      alert(err.message || "ยืนยันรับสินค้าไม่สำเร็จ");
    } finally {
      setSubmittingConfirmId(null);
    }
  };

  const handleBuyerSubmitReturnShipment = async (refundId) => {
    const carrier = returnCarrierInputs[refundId] || "Flash Express";
    const tracking = (returnTrackingInputs[refundId] || "").trim();
    if (!tracking) {
      alert("กรุณากรอกหมายเลขพัสดุที่ท่านส่งคืนให้ร้านค้า");
      return;
    }
    try {
      setSubmittingReturnId(refundId);
      await orderService.submitReturnShipment(refundId, {
        returnCarrier: carrier,
        returnTrackingNumber: tracking,
      });
      alert("บันทึกเลขพัสดุส่งคืนเรียบร้อยแล้ว ร้านค้ากำลังรอรับพัสดุ");
      fetchOrders();
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาดในการบันทึกเลขพัสดุส่งคืน");
    } finally {
      setSubmittingReturnId(null);
    }
  };

  const handleBuyerConfirmExchangeReceipt = async (refundId) => {
    if (!window.confirm("ยืนยันว่าท่านได้รับสินค้าชิ้นใหม่ที่เปลี่ยนเรียบร้อยแล้วใช่ไหม?")) {
      return;
    }
    try {
      setConfirmingExchangeId(refundId);
      await orderService.confirmExchangeReceipt(refundId);
      alert("ยืนยันรับสินค้าชิ้นใหม่เรียบร้อยแล้ว การเปลี่ยนสินค้าเสร็จสมบูรณ์");
      fetchOrders();
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาดในการยืนยัน");
    } finally {
      setConfirmingExchangeId(null);
    }
  };

  const handleCopyReturnAddress = (text, id) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedAddressId(id);
    setTimeout(() => setCopiedAddressId(null), 2500);
  };

  const handleReturnFormSubmit = async (event) => {
    event.preventDefault();

    if (!returnOrderId || !returnReason || (returnType === "EXCHANGE" && !returnCondition)) {
      setReturnNotice(
        returnType === "REFUND"
          ? "กรุณาเลือกออเดอร์และเหตุผลให้ครบ"
          : "กรุณาเลือกออเดอร์ เหตุผล และสภาพสินค้าให้ครบ",
      );
      return;
    }

    if (
      returnType === "REFUND" &&
      (!returnBankName || !returnBankAccountNumber.trim() || !returnBankAccountName.trim())
    ) {
      setReturnNotice("กรุณากรอกข้อมูลธนาคาร เลขที่บัญชี และชื่อบัญชีสำหรับรับเงินคืนให้ครบ");
      return;
    }

    try {
      setSubmittingRefund(true);
      setReturnNotice("กำลังอัปโหลดรูปภาพหลักฐาน...");

      // อัปโหลดไฟล์รูปภาพจริง (ถ้ามี)
      const uploadedUrls = [];
      if (Array.isArray(returnFiles) && returnFiles.length > 0) {
        for (const file of returnFiles) {
          try {
            const url = await uploadService.uploadFile(file, "refunds");
            if (url) uploadedUrls.push(url);
          } catch (uploadErr) {
            console.warn("Upload refund file error:", uploadErr);
          }
        }
      }

      setReturnNotice("กำลังส่งคำขอคืนสินค้า...");
      const res = await orderService.createRefundRequest(returnOrderId, {
        requestType: returnType,
        orderItemId: returnItemId || null,
        reason: returnReason,
        condition: returnCondition || "",
        bankName: returnType === "REFUND" ? returnBankName : "",
        bankAccountNumber: returnType === "REFUND" ? returnBankAccountNumber.trim() : "",
        bankAccountName: returnType === "REFUND" ? returnBankAccountName.trim() : "",
        details: returnDetails,
        images: uploadedUrls,
      });

      if (res?.success) {
        setReturnNotice("ส่งคำขอคืนสินค้าเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการตรวจสอบ");
        setTimeout(() => {
          setShowReturnModal(false);
          fetchOrders();
        }, 1000);
      }
    } catch (err) {
      setReturnNotice(err.message || "ส่งคำขอคืนสินค้าไม่สำเร็จ");
    } finally {
      setSubmittingRefund(false);
    }
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
                    const image =
                      (it.product?.images?.[0]?.url && typeof it.product.images[0].url === "string" && it.product.images[0].url.trim() !== "")
                        ? it.product.images[0].url
                        : (it.product?.imageUrl && typeof it.product.imageUrl === "string" && it.product.imageUrl.trim() !== "")
                        ? it.product.imageUrl
                        : "/images/placeholder.jpg";
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

                {/* แสดงสถานะคำขอคืนเงิน / เปลี่ยนสินค้า (Full Lifecycle & Actionable UI) */}
                {Array.isArray(order.refundRequests) && order.refundRequests.length > 0 && (
                  <div className="mx-6 mb-4 space-y-3">
                    {order.refundRequests.map((rf) => {
                      const isExchange = rf.requestType === "EXCHANGE";
                      const isRefund = !isExchange;

                      // Status Badge configuration
                      let badgeCls = "bg-amber-100 text-amber-900 border-amber-300";
                      let badgeLabel = "รอร้านค้าตรวจสอบคำขอ";
                      if (["WAITING_RETURN", "APPROVED"].includes(rf.status)) {
                        badgeCls = "bg-sky-100 text-sky-900 border-sky-300";
                        badgeLabel = isExchange ? "อนุมัติเปลี่ยนสินค้า — รอลูกค้าส่งชิ้นเดิมคืน" : "อนุมัติคืนสินค้า — รอลูกค้าส่งสินค้าคืน";
                      } else if (rf.status === "RETURNING") {
                        badgeCls = "bg-indigo-100 text-indigo-900 border-indigo-300";
                        badgeLabel = "จัดส่งของคืนแล้ว — ร้านกำลังรอรับพัสดุ";
                      } else if (rf.status === "INSPECTING") {
                        badgeCls = "bg-purple-100 text-purple-900 border-purple-300";
                        badgeLabel = "ร้านได้รับของคืนแล้ว — กำลังตรวจสภาพสินค้า";
                      } else if (rf.status === "PRODUCING_NEW") {
                        badgeCls = "bg-teal-100 text-teal-900 border-teal-300";
                        badgeLabel = "ร้านได้รับของเดิมแล้ว — กำลังผลิต/เตรียมชิ้นใหม่";
                      } else if (rf.status === "EXCHANGE_SHIPPED") {
                        badgeCls = "bg-emerald-100 text-emerald-900 border-emerald-300";
                        badgeLabel = "ร้านค้าจัดส่งสินค้าชิ้นใหม่แล้ว";
                      } else if (rf.status === "REFUNDED") {
                        badgeCls = "bg-emerald-100 text-emerald-900 border-emerald-300";
                        badgeLabel = "โอนเงินคืนสำเร็จแล้ว";
                      } else if (rf.status === "COMPLETED") {
                        badgeCls = "bg-emerald-100 text-emerald-900 border-emerald-300";
                        badgeLabel = isExchange ? "เปลี่ยนสินค้าเสร็จสมบูรณ์" : "การคืนสินค้าเสร็จสมบูรณ์";
                      } else if (rf.status === "REJECTED") {
                        badgeCls = "bg-rose-100 text-rose-900 border-rose-300";
                        badgeLabel = "ปฏิเสธคำขอ";
                      }

                      // Stepper step calculations
                      const exchangeSteps = [
                        { key: "PENDING", label: "ยื่นคำขอ" },
                        { key: "WAITING_RETURN", label: "อนุมัติส่งคืน" },
                        { key: "RETURNING", label: "ส่งของคืนแล้ว" },
                        { key: "PRODUCING_NEW", label: "เตรียมชิ้นใหม่" },
                        { key: "EXCHANGE_SHIPPED", label: "ส่งชิ้นใหม่แล้ว" },
                        { key: "COMPLETED", label: "เปลี่ยนสำเร็จ" },
                      ];
                      let exchangeActiveIdx = 0;
                      if (["WAITING_RETURN", "APPROVED"].includes(rf.status)) exchangeActiveIdx = 1;
                      else if (rf.status === "RETURNING") exchangeActiveIdx = 2;
                      else if (["PRODUCING_NEW", "INSPECTING"].includes(rf.status)) exchangeActiveIdx = 3;
                      else if (rf.status === "EXCHANGE_SHIPPED") exchangeActiveIdx = 4;
                      else if (rf.status === "COMPLETED") exchangeActiveIdx = 5;
                      else if (rf.status === "REJECTED") exchangeActiveIdx = -1;

                      const refundSteps = [
                        { key: "PENDING", label: "ยื่นคำขอคืนเงิน" },
                        { key: "WAITING_RETURN", label: "อนุมัติส่งคืน" },
                        { key: "RETURNING", label: "ส่งของคืนแล้ว" },
                        { key: "INSPECTING", label: "ตรวจสภาพของ" },
                        { key: "REFUNDED", label: "โอนเงินคืนสำเร็จ" },
                      ];
                      let refundActiveIdx = 0;
                      if (["WAITING_RETURN", "APPROVED"].includes(rf.status)) refundActiveIdx = 1;
                      else if (rf.status === "RETURNING") refundActiveIdx = 2;
                      else if (rf.status === "INSPECTING") refundActiveIdx = 3;
                      else if (["REFUNDED", "COMPLETED"].includes(rf.status)) refundActiveIdx = 4;
                      else if (rf.status === "REJECTED") refundActiveIdx = -1;

                      const stepsToRender = isExchange ? exchangeSteps : refundSteps;
                      const activeStepIdx = isExchange ? exchangeActiveIdx : refundActiveIdx;

                      const needsReturnShipment = ["WAITING_RETURN", "APPROVED"].includes(rf.status) && !rf.returnTrackingNumber;

                      return (
                        <div
                          key={rf.id}
                          className="rounded-2xl border border-[#EADECC] bg-white p-4 shadow-sm space-y-3.5 text-xs"
                        >
                          {/* Card Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                                  isExchange
                                    ? "bg-teal-50 text-teal-800 border border-teal-200"
                                    : "bg-amber-50 text-amber-800 border border-amber-200"
                                }`}
                              >
                                {isExchange ? "คำขอเปลี่ยนสินค้าชิ้นใหม่" : "คำขอคืนเงิน"}
                              </span>
                              <span className="font-mono text-zinc-400">#{rf.id.slice(0, 8)}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full font-bold text-[11px] border ${badgeCls}`}>
                              {badgeLabel}
                            </span>
                          </div>

                          {/* Stepper Timeline */}
                          {rf.status !== "REJECTED" && (
                            <div className="py-2 px-1">
                              <div className="flex items-center justify-between relative">
                                <div className="absolute left-3 right-3 top-3.5 h-0.5 bg-zinc-200 -z-0" />
                                {stepsToRender.map((st, i) => {
                                  const isDone = activeStepIdx >= i;
                                  const isCurrent = activeStepIdx === i;
                                  return (
                                    <div key={st.key} className="flex flex-col items-center relative z-10 flex-1">
                                      <div
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                          isDone
                                            ? isExchange
                                              ? "bg-[#0F766E] text-white ring-4 ring-teal-50"
                                              : "bg-amber-600 text-white ring-4 ring-amber-50"
                                            : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                                        }`}
                                      >
                                        {isDone && !isCurrent ? <Check size={12} strokeWidth={3} /> : i + 1}
                                      </div>
                                      <span
                                        className={`mt-1.5 text-[10px] text-center leading-tight max-w-[70px] ${
                                          isCurrent
                                            ? "font-bold text-zinc-900"
                                            : isDone
                                            ? "font-medium text-zinc-700"
                                            : "text-zinc-400"
                                        }`}
                                      >
                                        {st.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Reason & Details */}
                          <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#EADECC]/70 space-y-1 text-zinc-700">
                            <p>
                              <span className="font-bold text-zinc-800">เหตุผล: </span>
                              {rf.reason}
                              {rf.condition && (
                                <span className="text-zinc-500 ml-2">(สภาพ: {rf.condition})</span>
                              )}
                            </p>
                            {rf.details && (
                              <p className="text-zinc-600">
                                <span className="font-bold text-zinc-800">รายละเอียด: </span>
                                {rf.details}
                              </p>
                            )}
                            {rf.adminNote && (
                              <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60 mt-1">
                                <span className="font-bold">หมายเหตุจากร้านค้า/แอดมิน: </span>
                                {rf.adminNote}
                              </p>
                            )}
                          </div>

                          {/* Return Address & Buyer Input Form (If waiting for buyer to ship back) */}
                          {needsReturnShipment && (
                            <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 space-y-3">
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-sky-950 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-sky-700" />
                                    ที่อยู่สำหรับส่งสินค้าคืนให้ร้านค้า:
                                  </span>
                                  {rf.returnAddress && (
                                    <button
                                      type="button"
                                      onClick={() => handleCopyReturnAddress(rf.returnAddress, rf.id)}
                                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:text-sky-900 bg-white px-2 py-0.5 rounded border border-sky-300"
                                    >
                                      {copiedAddressId === rf.id ? <Check size={12} /> : <Copy size={12} />}
                                      {copiedAddressId === rf.id ? "คัดลอกแล้ว" : "คัดลอกที่อยู่"}
                                    </button>
                                  )}
                                </div>
                                <p className="mt-1 font-medium text-sky-900 bg-white p-2.5 rounded-lg border border-sky-200 text-xs select-all">
                                  {rf.returnAddress || "ร้านค้า Bare & Bold (ศูนย์รับคืนสินค้า) — กรุณาส่งคืนตามที่อยู่ที่ร้านค้าระบุ"}
                                </p>
                              </div>

                              {/* Form to submit return tracking */}
                              <div className="bg-white p-3 rounded-lg border border-sky-200 space-y-2">
                                <p className="font-bold text-zinc-800 flex items-center gap-1.5">
                                  <Truck size={14} className="text-sky-700" />
                                  กรอกข้อมูลพัสดุที่คุณส่งคืน:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[11px] text-zinc-500 mb-1">บริษัทขนส่ง</label>
                                    <select
                                      value={returnCarrierInputs[rf.id] || "Flash Express"}
                                      onChange={(e) =>
                                        setReturnCarrierInputs((prev) => ({ ...prev, [rf.id]: e.target.value }))
                                      }
                                      className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs text-zinc-800"
                                    >
                                      <option value="Flash Express">Flash Express</option>
                                      <option value="Kerry Express">Kerry Express</option>
                                      <option value="ไปรษณีย์ไทย EMS">ไปรษณีย์ไทย (Thailand Post EMS)</option>
                                      <option value="J&T Express">J&T Express</option>
                                      <option value="Ninja Van">Ninja Van</option>
                                      <option value="อื่นๆ">อื่นๆ</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[11px] text-zinc-500 mb-1">หมายเลขพัสดุ (Tracking Number)</label>
                                    <input
                                      type="text"
                                      placeholder="เช่น TH1234567890"
                                      value={returnTrackingInputs[rf.id] || ""}
                                      onChange={(e) =>
                                        setReturnTrackingInputs((prev) => ({ ...prev, [rf.id]: e.target.value }))
                                      }
                                      className="w-full rounded-lg border border-zinc-300 px-2.5 py-1.5 text-xs font-mono text-zinc-800"
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  disabled={submittingReturnId === rf.id}
                                  onClick={() => handleBuyerSubmitReturnShipment(rf.id)}
                                  className="w-full mt-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 text-xs transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                  {submittingReturnId === rf.id ? "กำลังบันทึก..." : "ยืนยันส่งพัสดุคืนแล้ว"}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Return Tracking info if already submitted */}
                          {rf.returnTrackingNumber && (
                            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 flex flex-wrap items-center justify-between gap-2 text-indigo-950">
                              <div className="flex items-center gap-2">
                                <Truck size={15} className="text-indigo-700" />
                                <div>
                                  <span className="font-bold">พัสดุส่งคืน: </span>
                                  <span>{rf.returnCarrier || "ขนส่ง"} </span>
                                  <span className="font-mono font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200">
                                    {rf.returnTrackingNumber}
                                  </span>
                                </div>
                              </div>
                              {rf.returnShippedAt && (
                                <span className="text-[11px] text-indigo-600">
                                  ส่งเมื่อ {new Date(rf.returnShippedAt).toLocaleString("th-TH")}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Exchange Shipped Info & Buyer Confirm Receipt Button */}
                          {isExchange && rf.exchangeTrackingNumber && (
                            <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-3.5 space-y-2 text-emerald-950">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                                  <PackageCheck size={16} className="text-emerald-700" />
                                  ร้านค้าได้จัดส่งสินค้าชิ้นใหม่ให้ท่านแล้ว!
                                </span>
                                {rf.exchangeShippedAt && (
                                  <span className="text-[11px] text-emerald-700">
                                    จัดส่งเมื่อ {new Date(rf.exchangeShippedAt).toLocaleString("th-TH")}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs">
                                ขนส่ง: <span className="font-semibold">{rf.exchangeCarrier || "ขนส่งเอกชน"}</span> | เลขพัสดุชิ้นใหม่:{" "}
                                <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                                  {rf.exchangeTrackingNumber}
                                </span>
                              </p>
                              {rf.status === "EXCHANGE_SHIPPED" && (
                                <button
                                  type="button"
                                  disabled={confirmingExchangeId === rf.id}
                                  onClick={() => handleBuyerConfirmExchangeReceipt(rf.id)}
                                  className="w-full mt-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  {confirmingExchangeId === rf.id ? "กำลังยืนยัน..." : "ฉันได้รับสินค้าชิ้นใหม่แล้ว (เสร็จสิ้น)"}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Refund Completed & Slip Details */}
                          {isRefund && rf.status === "REFUNDED" && (
                            <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-3.5 space-y-2 text-emerald-950">
                              <div className="flex items-center justify-between">
                                <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                                  <CheckCircle2 size={16} className="text-emerald-700" />
                                  โอนเงินคืนสำเร็จแล้ว ฿{baht(rf.amount)}
                                </span>
                                {rf.refundTransferredAt && (
                                  <span className="text-[11px] text-emerald-700">
                                    โอนเมื่อ {new Date(rf.refundTransferredAt).toLocaleString("th-TH")}
                                  </span>
                                )}
                              </div>
                              {rf.bankAccountNumber && (
                                <p className="text-xs text-emerald-800">
                                  โอนเข้า: {rf.bankName} เลขบัญชี {rf.bankAccountNumber} ({rf.bankAccountName})
                                </p>
                              )}
                              {rf.refundSlipUrl && (
                                <div className="pt-1">
                                  <a
                                    href={rf.refundSlipUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline bg-white px-3 py-1.5 rounded-lg border border-emerald-300"
                                  >
                                    <ExternalLink size={13} />
                                    ดูสลิปหลักฐานการโอนเงิน
                                  </a>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Rejected Info */}
                          {rf.status === "REJECTED" && (
                            <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-rose-950 space-y-1">
                              <span className="font-bold flex items-center gap-1.5 text-rose-900">
                                <AlertCircle size={15} className="text-rose-700" />
                                คำขอคืนสินค้าถูกปฏิเสธ
                              </span>
                              <p className="text-xs text-rose-800">
                                เหตุผล: {rf.adminNote || "ร้านค้าไม่สามารถรับเปลี่ยนหรือคืนสินค้าตามคำขอนี้ได้"}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* SubOrders Status & Confirm per Shop (Multi-Vendor Escrow Release) */}
                {order.subOrders && order.subOrders.length > 0 && (
                  <div className="px-6 py-3 bg-[#FAF8F5] border-t border-b border-[#EADECC]/60 space-y-2">
                    <p className="text-xs font-bold text-zinc-700">สถานะพัสดุรายร้านค้า:</p>
                    <div className="space-y-2">
                      {order.subOrders.map((so) => (
                        <div
                          key={so.id}
                          className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-[#EADECC]/80 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <Store size={14} className="text-[#6A5242]" />
                            <span className="font-bold text-zinc-800">{so.shop?.name || "ร้านค้า"}</span>
                            <span className="font-mono text-zinc-400">({so.subOrderNumber})</span>
                            <span className="text-zinc-300">|</span>
                            {so.trackingNumber ? (
                              <span className="text-blue-700 font-medium flex items-center gap-1">
                                <Truck size={13} /> {so.carrier}: <strong>{so.trackingNumber}</strong>
                              </span>
                            ) : (
                              <span className="text-zinc-400">เตรียมจัดส่ง</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className="font-bold px-2.5 py-0.5 rounded-full text-[11px]"
                              style={{
                                background: so.status === "COMPLETED" ? "#ECFDF5" : so.status === "SHIPPED" ? "#EFF6FF" : "#F3F4F6",
                                color: so.status === "COMPLETED" ? "#059669" : so.status === "SHIPPED" ? "#2563EB" : "#6B7280"
                              }}
                            >
                              {so.status === "COMPLETED" ? "ได้รับสินค้าแล้ว" : so.status === "SHIPPED" ? "จัดส่งแล้ว" : so.status}
                            </span>

                            {["SHIPPED", "DELIVERED"].includes(so.status) && (
                              <button
                                disabled={submittingConfirmId === so.id}
                                onClick={() => handleConfirmSubOrder(so, order.id)}
                                className="px-3 py-1 rounded-lg text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-xs"
                                style={{ background: OLIVE }}
                              >
                                {submittingConfirmId === so.id ? "กำลังยืนยัน..." : "ฉันได้รับสินค้าจากร้านนี้แล้ว"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                    {["SHIPPED", "PARTIALLY_SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) && (
                      <>
                        {["SHIPPED", "DELIVERED"].includes(order.status) && (
                          <button
                            disabled={submittingConfirmId === order.id}
                            onClick={() => handleConfirmReceived(order)}
                            className="px-5 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-95 disabled:opacity-60"
                            style={{ background: OLIVE }}
                          >
                            {submittingConfirmId === order.id ? "กำลังยืนยัน..." : "ฉันได้รับสินค้าทั้งหมดแล้ว"}
                          </button>
                        )}

                        {["DELIVERED", "COMPLETED"].includes(order.status) && (
                          <button
                            onClick={() => setReviewModalOrder(order)}
                            className="px-5 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-95"
                            style={{ background: WALNUT }}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <Star size={14} />
                              เขียนรีวิว
                            </span>
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

      <ReviewModal
        isOpen={Boolean(reviewModalOrder)}
        order={reviewModalOrder}
        onClose={() => setReviewModalOrder(null)}
        onSuccess={fetchOrders}
      />

      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold" style={{ color: DARK }}>
                  คำขอคืนเงิน / เปลี่ยนสินค้า
                </h2>
                <p className="mt-1 text-sm" style={{ color: MUTED }}>
                  เลือกประเภทคำขอ ระบุรายละเอียด และแนบรูปหลักฐานประกอบ
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
                {/* เลือกประเภทคำขอ: ขอคืนเงิน vs คืนสินค้าเพื่อเปลี่ยนเอาอันใหม่ */}
                <div>
                  <label className="mb-2 block text-sm font-semibold" style={{ color: DARK }}>
                    ประเภทคำขอ *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        value: "REFUND",
                        title: "ขอคืนเงิน",
                        desc: "รับเงินคืนเข้าบัญชีธนาคารของคุณ",
                      },
                      {
                        value: "EXCHANGE",
                        title: "คืนสินค้าเพื่อเปลี่ยนเอาอันใหม่",
                        desc: "ส่งสินค้าเดิมคืนเพื่อรับสินค้าชิ้นใหม่แทน",
                      },
                    ].map((opt) => {
                      const active = returnType === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setReturnType(opt.value)}
                          className="rounded-xl border p-3 text-left transition cursor-pointer"
                          style={{
                            borderColor: active ? WALNUT : BORDER,
                            background: active ? BEIGE : WHITE,
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold" style={{ color: DARK }}>
                              {opt.title}
                            </span>
                            <span
                              className="h-4 w-4 rounded-full border flex items-center justify-center shrink-0"
                              style={{ borderColor: active ? WALNUT : BORDER }}
                            >
                              {active && (
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ background: WALNUT }}
                                />
                              )}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed" style={{ color: MUTED }}>
                            {opt.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ข้อมูลบัญชีธนาคารสำหรับรับเงินคืน (แสดงเมื่อเลือก ขอคืนเงิน) */}
                {returnType === "REFUND" && (
                  <div
                    className="rounded-xl border p-4 space-y-3"
                    style={{ borderColor: BORDER, background: CREAM }}
                  >
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: OLIVE }}>
                      ข้อมูลบัญชีธนาคารสำหรับรับเงินคืน *
                    </p>
                    <div>
                      <label className="mb-1 block text-xs font-semibold" style={{ color: DARK }}>
                        ธนาคาร *
                      </label>
                      <select
                        value={returnBankName}
                        onChange={(e) => setReturnBankName(e.target.value)}
                        className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                        style={{ borderColor: BORDER, color: DARK }}
                        required
                      >
                        <option value="">เลือกธนาคาร</option>
                        <option value="กสิกรไทย (KBANK)">กสิกรไทย (KBANK)</option>
                        <option value="ไทยพาณิชย์ (SCB)">ไทยพาณิชย์ (SCB)</option>
                        <option value="กรุงไทย (KTB)">กรุงไทย (KTB)</option>
                        <option value="กรุงเทพ (BBL)">กรุงเทพ (BBL)</option>
                        <option value="กรุงศรีอยุธยา (BAY)">กรุงศรีอยุธยา (BAY)</option>
                        <option value="ทหารไทยธนชาต (TTB)">ทหารไทยธนชาต (TTB)</option>
                        <option value="ออมสิน (GSB)">ออมสิน (GSB)</option>
                        <option value="พร้อมเพย์ (PromptPay)">พร้อมเพย์ (PromptPay)</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold" style={{ color: DARK }}>
                          เลขที่บัญชี / พร้อมเพย์ *
                        </label>
                        <input
                          type="text"
                          value={returnBankAccountNumber}
                          onChange={(e) => setReturnBankAccountNumber(e.target.value)}
                          placeholder="เช่น 123-4-56789-0"
                          className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                          style={{ borderColor: BORDER, color: DARK }}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold" style={{ color: DARK }}>
                          ชื่อบัญชี *
                        </label>
                        <input
                          type="text"
                          value={returnBankAccountName}
                          onChange={(e) => setReturnBankAccountName(e.target.value)}
                          placeholder="ชื่อ-นามสกุล เจ้าของบัญชี"
                          className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                          style={{ borderColor: BORDER, color: DARK }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                    สภาพสินค้า {returnType === "EXCHANGE" ? "*" : "(ถ้ามี)"}
                  </label>
                  <select
                    value={returnCondition}
                    onChange={(event) => setReturnCondition(event.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{ borderColor: BORDER, color: DARK }}
                    required={returnType === "EXCHANGE"}
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
                    disabled={submittingRefund}
                    className="rounded-lg px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    style={{ background: WALNUT }}
                  >
                    {submittingRefund ? "กำลังส่ง..." : "ส่งคำขอคืนสินค้า"}
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
