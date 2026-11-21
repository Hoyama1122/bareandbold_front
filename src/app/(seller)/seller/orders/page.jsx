"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { sellerService } from "@/services/seller.service";

const STATUS_TABS = [
  { key: "ALL", label: "ทั้งหมด" },
  { key: "PAID", label: "รอเตรียมจัดส่ง" },
  { key: "PRODUCING", label: "กำลังผลิต/สั่งทำ" },
  { key: "SHIPPED", label: "จัดส่งแล้ว" },
  { key: "DELIVERED", label: "ส่งถึงแล้ว" },
  { key: "COMPLETED", label: "สำเร็จแล้ว" },
  { key: "CANCELLED", label: "ยกเลิกแล้ว" },
];

const CARRIER_OPTIONS = [
  "Flash Express",
  "Kerry Express (KEX)",
  "ไปรษณีย์ไทย (EMS)",
  "J&T Express",
  "Ninja Van",
  "DHL eCommerce",
  "ขนส่งอื่นๆ",
];

function baht(n) {
  return Number(n || 0).toLocaleString("th-TH");
}

function formatDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }) {
  switch (status) {
    case "PAID":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          ชำระแล้ว (รอจัดส่ง)
        </span>
      );
    case "PRODUCING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 border border-purple-200">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
          กำลังสั่งทำ / ร้อยกำไล
        </span>
      );
    case "SHIPPED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          จัดส่งแล้ว
        </span>
      );
    case "DELIVERED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700 border border-teal-200">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          ส่งถึงปลายทางแล้ว
        </span>
      );
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          สำเร็จ (ได้รับเงินแล้ว)
        </span>
      );
    case "CANCELLED":
    case "REFUNDED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          ยกเลิกแล้ว
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">
          {status}
        </span>
      );
  }
}

export default function SellerOrdersPage() {
  const { shop } = useAuth();
  const [activeTab, setActiveTab] = useState("ALL");
  const [subOrders, setSubOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Modal จัดส่งสินค้า
  const [shippingModal, setShippingModal] = useState({
    isOpen: false,
    subOrder: null,
    carrier: "Flash Express",
    customCarrier: "",
    trackingNumber: "",
    submitting: false,
  });

  // Modal ดูรายละเอียดสินค้าสั่งทำ (Custom details)
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    subOrder: null,
  });

  const loadOrders = useCallback(async () => {
    if (!shop?.id) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await sellerService.getMyOrders({ status: activeTab });
      if (res.success) {
        setSubOrders(res.subOrders || []);
      }
    } catch (err) {
      console.error("Load seller orders error:", err);
      setErrorMsg(err.message || "ไม่สามารถโหลดรายการคำสั่งซื้อได้");
    } finally {
      setLoading(false);
    }
  }, [shop?.id, activeTab]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // เปลี่ยนสถานะเป็น PRODUCING
  const handleSetProducing = async (subOrderId) => {
    if (!confirm("ต้องการเปลี่ยนสถานะเป็น 'กำลังสั่งทำ/ร้อยกำไล' หรือไม่?")) return;
    try {
      await sellerService.updateOrderStatus(subOrderId, "PRODUCING");
      loadOrders();
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
    }
  };

  // เปิด Modal กรอกเลขพัสดุ
  const handleOpenShippingModal = (so) => {
    setShippingModal({
      isOpen: true,
      subOrder: so,
      carrier: so.carrier || "Flash Express",
      customCarrier: "",
      trackingNumber: so.trackingNumber || "",
      submitting: false,
    });
  };

  // Submit จัดส่งสินค้า
  const handleSubmitShipping = async (e) => {
    e.preventDefault();
    const finalCarrier =
      shippingModal.carrier === "ขนส่งอื่นๆ"
        ? shippingModal.customCarrier.trim()
        : shippingModal.carrier;

    if (!finalCarrier) {
      alert("กรุณาระบุชื่อบริษัทขนส่ง");
      return;
    }
    if (!shippingModal.trackingNumber.trim()) {
      alert("กรุณากรอกเลขพัสดุ (Tracking Number)");
      return;
    }

    try {
      setShippingModal((prev) => ({ ...prev, submitting: true }));
      await sellerService.shipOrder(shippingModal.subOrder.id, {
        carrier: finalCarrier,
        trackingNumber: shippingModal.trackingNumber.trim(),
      });
      setShippingModal((prev) => ({ ...prev, isOpen: false }));
      loadOrders();
    } catch (err) {
      alert(err.message || "ไม่สามารถบันทึกการจัดส่งได้");
    } finally {
      setShippingModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const countByStatus = (statusKey) => {
    if (statusKey === "ALL") return subOrders.length;
    return subOrders.filter((so) => so.status === statusKey).length;
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
            จัดการคำสั่งซื้อและการจัดส่ง
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            ตรวจสอบออเดอร์ของร้านค้า เตรียมกำไล/ข้อเท้าตามที่ลูกค้าสั่ง และกรอกเลขพัสดุเพื่อจัดส่ง
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          รีเฟรชข้อมูล
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-4 py-2.5 text-xs font-bold transition sm:text-sm border-b-2 -mb-[1px] flex items-center gap-2 ${
                isActive
                  ? "border-[#0F766E] text-[#0F766E]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
              {activeTab === "ALL" && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${
                    isActive ? "bg-teal-100 text-[#0F766E]" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {countByStatus(tab.key)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-xs">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F766E]" />
          <p className="mt-3 text-sm font-semibold">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
        </div>
      ) : errorMsg ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 shadow-xs">
          <p className="font-bold">เกิดข้อผิดพลาด</p>
          <p className="mt-1 text-xs">{errorMsg}</p>
        </div>
      ) : subOrders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="mt-4 text-base font-extrabold text-slate-800">ยังไม่มีคำสั่งซื้อในสถานะนี้</h3>
          <p className="mt-1 text-xs text-slate-500">
            เมื่อมีลูกค้าสั่งซื้อเครื่องประดับจากร้านของคุณ รายการคำสั่งซื้อจะแสดงที่นี่
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {subOrders.map((so) => {
            const hasMadeToOrder = so.items.some((i) => i.product?.type === "MADE_TO_ORDER");
            const canShip = ["PAID", "PRODUCING"].includes(so.status);
            const canSetProducing = so.status === "PAID" && hasMadeToOrder;

            return (
              <div
                key={so.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:border-slate-300"
              >
                {/* Header SubOrder */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-[#FBFBFC] px-5 py-3.5 text-xs text-slate-600">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-extrabold text-slate-900">
                      {so.subOrderNumber}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>สั่งซื้อเมื่อ: {formatDate(so.createdAt)}</span>
                    <span className="text-slate-300">|</span>
                    <span>
                      ผู้รับ: <strong className="text-slate-800">{so.order?.recipientName}</strong> (
                      {so.order?.recipientPhone})
                    </span>
                  </div>
                  <div>
                    <StatusBadge status={so.status} />
                  </div>
                </div>

                {/* Items in SubOrder */}
                <div className="divide-y divide-slate-100 p-5">
                  {so.items.map((item) => {
                    const thumb =
                      item.product?.images?.[0]?.url || "/images/placeholder.jpg";
                    const isMto = item.product?.type === "MADE_TO_ORDER";
                    const customDetails = item.customDetails || {};

                    return (
                      <div key={item.id} className="flex flex-col gap-4 py-3 sm:flex-row sm:items-center">
                        <img
                          src={thumb}
                          alt={item.product?.name}
                          className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-slate-900 truncate">
                              {item.product?.name}
                            </h4>
                            {isMto ? (
                              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-extrabold text-purple-700 border border-purple-200">
                                สั่งทำพิเศษ (Made-to-Order)
                              </span>
                            ) : (
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                พร้อมส่ง
                              </span>
                            )}
                          </div>

                          {/* Custom specs: ขนาดข้อมือ / จี้ชาร์ม */}
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-600">
                            {customDetails.wristSize && (
                              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-amber-800 font-medium">
                                ขนาดรอบข้อมือ: {customDetails.wristSize} cm
                              </span>
                            )}
                            {customDetails.selectedOptions &&
                              Object.entries(customDetails.selectedOptions).map(([key, val]) => (
                                <span key={key} className="rounded-md bg-slate-100 px-2 py-0.5">
                                  {key}: {val}
                                </span>
                              ))}
                          </div>

                          {/* Accessories / Charms */}
                          {item.accessories && item.accessories.length > 0 && (
                            <div className="mt-2 text-xs text-slate-500">
                              <span className="font-bold text-slate-700">จี้ชาร์มที่เลือก: </span>
                              {item.accessories.map((accItem, idx) => (
                                <span key={accItem.id} className="inline-block mr-2 text-slate-600">
                                  • {accItem.accessory?.name} (x{accItem.quantity})
                                  {idx < item.accessories.length - 1 ? "" : ""}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="text-right sm:w-36 shrink-0">
                          <p className="text-xs text-slate-500">
                            ฿{baht(item.price)} x {item.quantity} ชิ้น
                          </p>
                          <p className="text-sm font-extrabold text-slate-900">
                            ฿{baht(Number(item.price) * Number(item.quantity))}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tracking Info if Shipped */}
                {so.trackingNumber && (
                  <div className="mx-5 mb-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs text-blue-900 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        จัดส่งโดย <strong>{so.carrier}</strong> | เลขพัสดุ:{" "}
                        <strong className="font-mono text-sm text-blue-700">{so.trackingNumber}</strong>
                      </span>
                    </div>
                    {so.shippedAt && (
                      <span className="text-slate-500">ส่งเมื่อ {formatDate(so.shippedAt)}</span>
                    )}
                  </div>
                )}

                {/* Footer SubOrder / Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white p-5">
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <p>
                      ยอดขายสินค้าร้านนี้: <span className="font-bold text-slate-800">฿{baht(so.subtotal)}</span> | ค่าคอมมิชชัน (5%):{" "}
                      <span className="text-rose-600">-฿{baht(so.commissionAmount)}</span>
                    </p>
                    <p className="text-sm font-extrabold text-[#0F766E]">
                      รายรับสุทธิที่ร้านจะได้รับ: ฿{baht(so.netAmount)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setDetailModal({ isOpen: true, subOrder: so })}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      ดูที่อยู่จัดส่ง
                    </button>

                    {canSetProducing && (
                      <button
                        onClick={() => handleSetProducing(so.id)}
                        className="rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-700 transition hover:bg-purple-100"
                      >
                        เริ่มสั่งทำ/ร้อยกำไล
                      </button>
                    )}

                    {canShip && (
                      <button
                        onClick={() => handleOpenShippingModal(so)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#115E59]"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {so.status === "SHIPPED" ? "แก้ไขเลขพัสดุ" : "กรอกเลขพัสดุและจัดส่ง"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal กรอกเลขพัสดุและจัดส่งสินค้า */}
      {shippingModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-extrabold text-slate-900">
              จัดส่งสินค้าคำสั่งซื้อ {shippingModal.subOrder?.subOrderNumber}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              กรอกข้อมูลบริษัทขนส่งและเลขพัสดุ เพื่อให้ลูกค้าสามารถติดตามสถานะสินค้าได้
            </p>

            <form onSubmit={handleSubmitShipping} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  บริษัทขนส่ง <span className="text-rose-500">*</span>
                </label>
                <select
                  value={shippingModal.carrier}
                  onChange={(e) =>
                    setShippingModal((prev) => ({ ...prev, carrier: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#0F766E] focus:outline-hidden"
                >
                  {CARRIER_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {shippingModal.carrier === "ขนส่งอื่นๆ" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700">
                    ระบุชื่อบริษัทขนส่ง <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingModal.customCarrier}
                    onChange={(e) =>
                      setShippingModal((prev) => ({ ...prev, customCarrier: e.target.value }))
                    }
                    placeholder="เช่น ไปรษณีย์เอกชน, ขนส่งท้องถิ่น..."
                    className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#0F766E] focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700">
                  เลขพัสดุ (Tracking Number) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={shippingModal.trackingNumber}
                  onChange={(e) =>
                    setShippingModal((prev) => ({ ...prev, trackingNumber: e.target.value }))
                  }
                  placeholder="เช่น TH0123456789A"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:border-[#0F766E] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShippingModal((prev) => ({ ...prev, isOpen: false }))}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={shippingModal.submitting}
                  className="rounded-xl bg-[#0F766E] px-5 py-2 text-xs font-bold text-white hover:bg-[#115E59] disabled:opacity-50"
                >
                  {shippingModal.submitting ? "กำลังบันทึก..." : "ยืนยันการจัดส่งสินค้า"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal ดูที่อยู่จัดส่ง */}
      {detailModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-extrabold text-slate-900">
              ข้อมูลที่อยู่จัดส่ง ({detailModal.subOrder?.subOrderNumber})
            </h3>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2 text-slate-700">
              <p>
                <strong>ชื่อผู้รับ:</strong> {detailModal.subOrder?.order?.recipientName}
              </p>
              <p>
                <strong>เบอร์โทรศัพท์:</strong> {detailModal.subOrder?.order?.recipientPhone}
              </p>
              <p>
                <strong>ที่อยู่จัดส่ง:</strong>
              </p>
              <p className="whitespace-pre-line text-slate-800 font-medium">
                {detailModal.subOrder?.order?.shippingAddress}
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModal({ isOpen: false, subOrder: null })}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
