"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { sellerService } from "@/services/seller.service";
import { uploadService } from "@/services/upload.service";
import {
  Package,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  RotateCcw,
  ExternalLink,
  MapPin,
  Copy,
  Check,
  Send,
  Upload,
} from "lucide-react";

const STATUS_TABS = [
  { key: "ALL", label: "ทั้งหมด" },
  { key: "PENDING", label: "รอพิจารณา", countKey: "PENDING" },
  { key: "WAITING_RETURN", label: "รอลูกค้าส่งคืน", countKey: "WAITING_RETURN" },
  { key: "RETURNING", label: "ลูกค้าส่งคืนแล้ว", countKey: "RETURNING" },
  { key: "PRODUCING_NEW", label: "เตรียมส่งชิ้นใหม่", countKey: "PRODUCING_NEW" },
  { key: "EXCHANGE_SHIPPED", label: "ส่งชิ้นใหม่แล้ว", countKey: "EXCHANGE_SHIPPED" },
  { key: "INSPECTING", label: "ตรวจสภาพของ", countKey: "INSPECTING" },
  { key: "REFUNDED", label: "โอนเงินคืนแล้ว", countKey: "REFUNDED" },
  { key: "COMPLETED", label: "เปลี่ยนสำเร็จ", countKey: "COMPLETED" },
  { key: "REJECTED", label: "ปฏิเสธ", countKey: "REJECTED" },
];

export default function SellerRefundsPage() {
  const [refunds, setRefunds] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL"); // ALL, REFUND, EXCHANGE
  const [selectedImage, setSelectedImage] = useState(null);

  // Dialog states
  const [actionDialog, setActionDialog] = useState(null);
  // type: 'approve' | 'reject' | 'receive' | 'ship_exchange' | 'complete_refund'
  const [dialogRefund, setDialogRefund] = useState(null);
  const [actionNote, setActionNote] = useState("");
  const [returnAddressInput, setReturnAddressInput] = useState("");
  const [exchangeCarrierInput, setExchangeCarrierInput] = useState("Flash Express");
  const [exchangeTrackingInput, setExchangeTrackingInput] = useState("");
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const fetchRefunds = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await sellerService.getRefunds({
        status: statusFilter,
        requestType: typeFilter,
      });
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.refundRequests)
          ? res.refundRequests
          : Array.isArray(res?.refunds)
            ? res.refunds
            : Array.isArray(res?.data)
              ? res.data
              : [];
      setRefunds(list);
      if (res?.counts && typeof res.counts === "object") {
        setCounts(res.counts);
      }
    } catch (err) {
      console.error("Failed to fetch refunds:", err);
      setError(err.message || "ไม่สามารถโหลดรายการคำขอได้");
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const openActionDialog = (type, rf) => {
    setActionDialog(type);
    setDialogRefund(rf);
    setActionNote("");
    setReturnAddressInput(rf.returnAddress || "");
    setExchangeCarrierInput("Flash Express");
    setExchangeTrackingInput("");
    setSlipFile(null);
    setSlipPreview(null);
  };

  const closeDialog = () => {
    setActionDialog(null);
    setDialogRefund(null);
    setActionNote("");
    setSlipFile(null);
    setSlipPreview(null);
  };

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!actionDialog || !dialogRefund) return;
    try {
      setActionLoading(true);

      if (actionDialog === "approve") {
        await sellerService.approveRefund(
          dialogRefund.id,
          actionNote,
          returnAddressInput
        );
      } else if (actionDialog === "reject") {
        await sellerService.rejectRefund(dialogRefund.id, actionNote);
      } else if (actionDialog === "receive") {
        await sellerService.receiveReturn(dialogRefund.id, actionNote);
      } else if (actionDialog === "ship_exchange") {
        if (!exchangeTrackingInput.trim()) {
          alert("กรุณากรอกเลขพัสดุชิ้นใหม่");
          setActionLoading(false);
          return;
        }
        await sellerService.shipExchange(dialogRefund.id, {
          exchangeCarrier: exchangeCarrierInput,
          exchangeTrackingNumber: exchangeTrackingInput.trim(),
          note: actionNote,
        });
      } else if (actionDialog === "complete_refund") {
        let slipUrl = null;
        if (slipFile) {
          slipUrl = await uploadService.uploadFile(slipFile, "refunds");
        }
        await sellerService.completeRefund(dialogRefund.id, {
          refundSlipUrl: slipUrl,
          sellerNote: actionNote,
        });
      }

      closeDialog();
      await fetchRefunds();
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาดในการดำเนินการ");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status, requestType) => {
    const isExchange = requestType === "EXCHANGE";
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            รอพิจารณา
          </span>
        );
      case "WAITING_RETURN":
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-inset ring-sky-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            รอลูกค้าส่งคืน
          </span>
        );
      case "RETURNING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            ลูกค้าส่งคืนแล้ว
          </span>
        );
      case "INSPECTING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            ตรวจสภาพของ
          </span>
        );
      case "PRODUCING_NEW":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
            เตรียมส่งชิ้นใหม่
          </span>
        );
      case "EXCHANGE_SHIPPED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            ส่งชิ้นใหม่แล้ว
          </span>
        );
      case "REFUNDED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            โอนเงินคืนแล้ว
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {isExchange ? "เปลี่ยนสำเร็จ" : "คืนสินค้าสำเร็จ"}
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            ปฏิเสธแล้ว
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          คำขอคืนเงิน / เปลี่ยนสินค้า (Returns & Exchanges)
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          จัดการกระบวนการรับคืนสินค้า ตรวจสภาพ จัดส่งสินค้าชิ้นใหม่สำหรับเปลี่ยน หรือโอนเงินคืนผู้ซื้อ
        </p>
      </div>

      {/* Filter Bar: Request Type & Status Tabs */}
      <div className="space-y-3">
        {/* Type Toggle */}
        <div className="flex gap-2">
          {[
            { key: "ALL", label: "คำขอทั้งหมด" },
            { key: "REFUND", label: "เฉพาะขอคืนเงิน (Refund)" },
            { key: "EXCHANGE", label: "เฉพาะขอเปลี่ยนสินค้า (Exchange)" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTypeFilter(t.key)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                typeFilter === t.key
                  ? "bg-[#0F766E] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {STATUS_TABS.map((tab) => {
            const count = tab.countKey ? counts[tab.countKey] : null;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  statusFilter === tab.key
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
                {typeof count === "number" && count > 0 && (
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                      statusFilter === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F766E]" />
        </div>
      ) : !Array.isArray(refunds) || refunds.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Package size={24} />
          </div>
          <p className="mt-3 text-base font-semibold text-slate-800">
            ยังไม่มีรายการคำขอในสถานะนี้
          </p>
          <p className="text-sm text-slate-500">
            เมื่อมีผู้ซื้อส่งคำขอคืนเงินหรือเปลี่ยนสินค้า รายการจะปรากฏที่นี่
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {refunds.map((rf) => {
            const isExchange = rf.requestType === "EXCHANGE";
            const isRefund = !isExchange;

            return (
              <div
                key={rf.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        ID: #{rf.id.slice(0, 8)}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold ${
                          isExchange
                            ? "bg-teal-100 text-teal-800 border border-teal-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {isExchange ? "ขอเปลี่ยนสินค้าชิ้นใหม่" : "ขอคืนเงิน"}
                      </span>
                      {getStatusBadge(rf.status, rf.requestType)}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      ยื่นคำขอเมื่อ: {new Date(rf.createdAt).toLocaleString("th-TH")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">
                      {isExchange ? "มูลค่าสินค้า" : "ยอดเงินที่ขอคืน"}
                    </div>
                    <div className="text-lg font-black text-rose-600">
                      ฿{Number(rf.amount || 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Details & Info */}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-slate-500">ผู้ขอ: </span>
                      <span className="font-medium text-slate-800">
                        {rf.user?.firstName} {rf.user?.lastName} ({rf.user?.email || rf.user?.phone})
                      </span>
                    </div>
                    {rf.subOrder && (
                      <div>
                        <span className="text-slate-500">เลขออเดอร์ย่อย: </span>
                        <span className="font-mono font-medium text-slate-800">
                          {rf.subOrder.subOrderNumber}
                        </span>
                      </div>
                    )}
                    {isRefund && rf.bankAccountNumber && (
                      <div className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700 border border-slate-200 space-y-1">
                        <div className="font-semibold text-slate-900">
                          ข้อมูลบัญชีสำหรับโอนเงินคืน:
                        </div>
                        <div>ธนาคาร: <span className="font-medium">{rf.bankName}</span></div>
                        <div>
                          เลขที่บัญชี: <span className="font-mono font-bold">{rf.bankAccountNumber}</span>
                        </div>
                        <div>ชื่อบัญชี: <span className="font-medium">{rf.bankAccountName}</span></div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="font-semibold text-slate-800">
                      เหตุผล: <span className="font-normal text-slate-700">{rf.reason}</span>
                    </div>
                    {rf.condition && (
                      <div className="text-xs text-slate-600">
                        <span className="font-semibold">สภาพสินค้า:</span> {rf.condition}
                      </div>
                    )}
                    {rf.details && (
                      <div className="text-xs text-slate-600">
                        <span className="font-semibold">รายละเอียดเพิ่มเติม:</span> {rf.details}
                      </div>
                    )}
                    {rf.adminNote && (
                      <div className="rounded-lg bg-amber-50 p-2 text-xs text-amber-800 border border-amber-200">
                        <span className="font-semibold">บันทึกของร้านค้า/แอดมิน:</span> {rf.adminNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Return Shipment Tracking (Submitted by Buyer) */}
                {rf.returnTrackingNumber && (
                  <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3.5 text-xs text-indigo-950 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-indigo-700" />
                      <div>
                        <span className="font-bold">พัสดุที่ลูกค้าส่งคืน: </span>
                        <span>{rf.returnCarrier || "ขนส่งเอกชน"} </span>
                        <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-indigo-300">
                          {rf.returnTrackingNumber}
                        </span>
                      </div>
                    </div>
                    {rf.returnShippedAt && (
                      <span className="text-[11px] text-indigo-600">
                        จัดส่งเมื่อ {new Date(rf.returnShippedAt).toLocaleString("th-TH")}
                      </span>
                    )}
                  </div>
                )}

                {/* Replacement Shipment Tracking (Shipped by Seller) */}
                {isExchange && rf.exchangeTrackingNumber && (
                  <div className="mt-3 rounded-xl border border-emerald-300 bg-emerald-50/80 p-3.5 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-700" />
                      <div>
                        <span className="font-bold">พัสดุชิ้นใหม่ที่ร้านจัดส่ง: </span>
                        <span>{rf.exchangeCarrier || "ขนส่งเอกชน"} </span>
                        <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                          {rf.exchangeTrackingNumber}
                        </span>
                      </div>
                    </div>
                    {rf.exchangeShippedAt && (
                      <span className="text-[11px] text-emerald-700">
                        ส่งเมื่อ {new Date(rf.exchangeShippedAt).toLocaleString("th-TH")}
                      </span>
                    )}
                  </div>
                )}

                {/* Refund Transferred & Slip (For Refund) */}
                {isRefund && rf.status === "REFUNDED" && (
                  <div className="mt-3 rounded-xl border border-emerald-300 bg-emerald-50/80 p-3.5 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 size={15} className="text-emerald-700" />
                        โอนเงินคืนสำเร็จแล้ว ฿{Number(rf.amount).toLocaleString()}
                      </span>
                      {rf.refundTransferredAt && (
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          โอนเมื่อ {new Date(rf.refundTransferredAt).toLocaleString("th-TH")}
                        </p>
                      )}
                    </div>
                    {rf.refundSlipUrl && (
                      <a
                        href={rf.refundSlipUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 hover:bg-emerald-100"
                      >
                        <ExternalLink size={13} />
                        ดูสลิปหลักฐานโอนเงิน
                      </a>
                    )}
                  </div>
                )}

                {/* Evidence Images */}
                {Array.isArray(rf.images) && rf.images.length > 0 && (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="mb-2 text-xs font-semibold text-slate-500">รูปภาพหลักฐานจากผู้ซื้อ:</p>
                    <div className="flex flex-wrap gap-2">
                      {rf.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(img)}
                          className="group relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 cursor-pointer"
                        >
                          <Image
                            src={img}
                            alt={`Evidence ${idx + 1}`}
                            fill
                            sizes="64px"
                            className="object-cover transition group-hover:scale-105"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons Toolbar */}
                <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                  {/* PENDING: Approve or Reject */}
                  {rf.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => openActionDialog("reject", rf)}
                        className="rounded-lg border border-rose-300 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 cursor-pointer"
                      >
                        ปฏิเสธคำขอ
                      </button>
                      <button
                        onClick={() => openActionDialog("approve", rf)}
                        className="rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0d635d] cursor-pointer"
                      >
                        {isExchange ? "อนุมัติคำขอเปลี่ยนสินค้า" : "อนุมัติคำขอคืนสินค้า"}
                      </button>
                    </>
                  )}

                  {/* WAITING_RETURN / RETURNING: Confirm Receiving Return Package */}
                  {["RETURNING", "WAITING_RETURN", "APPROVED"].includes(rf.status) && (
                    <button
                      onClick={() => openActionDialog("receive", rf)}
                      className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Package size={14} />
                      ยืนยันว่าได้รับของคืนแล้ว
                    </button>
                  )}

                  {/* EXCHANGE & PRODUCING_NEW: Ship New Exchange Item */}
                  {isExchange && ["PRODUCING_NEW", "INSPECTING"].includes(rf.status) && (
                    <button
                      onClick={() => openActionDialog("ship_exchange", rf)}
                      className="rounded-lg bg-teal-700 hover:bg-teal-800 px-4 py-2 text-xs font-semibold text-white shadow-sm transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Truck size={14} />
                      แจ้งจัดส่งสินค้าชิ้นใหม่
                    </button>
                  )}

                  {/* REFUND & INSPECTING / WAITING_RETURN: Complete Refund With Slip */}
                  {isRefund && ["INSPECTING", "WAITING_RETURN", "RETURNING"].includes(rf.status) && (
                    <button
                      onClick={() => openActionDialog("complete_refund", rf)}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload size={14} />
                      โอนเงินคืนสำเร็จ (แนบสลิป)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Enlargement Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-xl bg-white p-2">
            <div className="relative h-[70vh] w-[70vw]">
              <Image
                src={selectedImage}
                alt="Enlarged evidence"
                fill
                sizes="80vw"
                className="object-contain"
              />
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white hover:bg-black transition cursor-pointer"
              title="ปิด"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Action Dialog */}
      {actionDialog && dialogRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {actionDialog === "approve" &&
                  (dialogRefund.requestType === "EXCHANGE"
                    ? "อนุมัติคำขอเปลี่ยนสินค้า (รอลูกค้าส่งคืน)"
                    : "อนุมัติคำขอคืนสินค้า (รอลูกค้าส่งคืน)")}
                {actionDialog === "reject" && "ปฏิเสธคำขอคืนเงิน / เปลี่ยนสินค้า"}
                {actionDialog === "receive" && "ยืนยันการรับพัสดุสินค้าคืนจากลูกค้า"}
                {actionDialog === "ship_exchange" && "แจ้งหมายเลขพัสดุสินค้าชิ้นใหม่สำหรับเปลี่ยน"}
                {actionDialog === "complete_refund" && "ดำเนินการโอนเงินคืนลูกค้า (แนบสลิป)"}
              </h3>
              <button
                type="button"
                onClick={closeDialog}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="space-y-4">
              {/* APPROVE DIALOG */}
              {actionDialog === "approve" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    เมื่ออนุมัติ ระบบจะเปลี่ยนสถานะเป็น{" "}
                    <span className="font-bold text-sky-700">"รอลูกค้าส่งคืน (WAITING_RETURN)"</span>{" "}
                    และแสดงที่อยู่จัดส่งคืนให้ผู้ซื้อทราบ เพื่อให้ผู้ซื้อส่งของคืนและกรอกเลขพัสดุ
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ที่อยู่สำหรับให้ลูกค้าส่งสินค้าคืน:
                    </label>
                    <textarea
                      value={returnAddressInput}
                      onChange={(e) => setReturnAddressInput(e.target.value)}
                      placeholder="เช่น ร้าน Bare & Bold เลขที่ 123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กทม. 10110 โทร 081-234-5678"
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-[#0F766E] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* REJECT DIALOG */}
              {actionDialog === "reject" && (
                <div>
                  <p className="text-xs text-slate-600 mb-2">
                    กรุณาระบุเหตุผลการปฏิเสธคำขอ เพื่อให้ผู้ซื้อได้รับทราบอย่างชัดเจน
                  </p>
                  <textarea
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="เช่น สินค้าไม่อยู่ในสภาพเดิม / พ้นระยะเวลา 7 วันตามนโยบาย"
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-rose-500 focus:outline-none"
                    required
                  />
                </div>
              )}

              {/* RECEIVE RETURN DIALOG */}
              {actionDialog === "receive" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    คุณได้รับพัสดุส่งคืนจากลูกค้าเรียบร้อยแล้วใช่หรือไม่?
                  </p>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700">
                    {dialogRefund.requestType === "EXCHANGE" ? (
                      <p>
                        สถานะจะเปลี่ยนเป็น{" "}
                        <span className="font-bold text-teal-700">"เตรียมส่งชิ้นใหม่ (PRODUCING_NEW)"</span>{" "}
                        เพื่อให้คุณเตรียมผลิต/จัดส่งสินค้าชิ้นใหม่ให้ผู้ซื้อต่อไป
                      </p>
                    ) : (
                      <p>
                        สถานะจะเปลี่ยนเป็น{" "}
                        <span className="font-bold text-purple-700">"ตรวจสภาพของ (INSPECTING)"</span>{" "}
                        เพื่อให้คุณตรวจสอบสภาพสินค้าก่อนดำเนินการโอนเงินคืน
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* SHIP EXCHANGE DIALOG */}
              {actionDialog === "ship_exchange" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    กรอกข้อมูลการจัดส่งสินค้าชิ้นใหม่ เพื่อให้ผู้ซื้อสามารถติดตามพัสดุได้
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      บริษัทขนส่ง
                    </label>
                    <select
                      value={exchangeCarrierInput}
                      onChange={(e) => setExchangeCarrierInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      หมายเลขพัสดุ (Tracking Number)
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น TH01234567890"
                      value={exchangeTrackingInput}
                      onChange={(e) => setExchangeTrackingInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800"
                      required
                    />
                  </div>
                </div>
              )}

              {/* COMPLETE REFUND DIALOG */}
              {actionDialog === "complete_refund" && (
                <div className="space-y-3">
                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-950 space-y-1">
                    <p className="font-bold">ข้อมูลบัญชีผู้รับเงินคืน:</p>
                    <p>ธนาคาร: {dialogRefund.bankName || "-"}</p>
                    <p className="font-mono font-bold">เลขที่บัญชี: {dialogRefund.bankAccountNumber || "-"}</p>
                    <p>ชื่อบัญชี: {dialogRefund.bankAccountName || "-"}</p>
                    <p className="font-bold text-rose-600 text-sm mt-1">
                      ยอดที่ต้องโอน: ฿{Number(dialogRefund.amount || 0).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      แนบรูปสลิปหลักฐานการโอนเงิน (ถ้ามี):
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSlipFile(file);
                          setSlipPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                    />
                    {slipPreview && (
                      <div className="mt-2 relative h-32 w-32 rounded-lg overflow-hidden border border-slate-200">
                        <Image src={slipPreview} alt="Slip preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Optional Note for any dialog */}
              {actionDialog !== "reject" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    หมายเหตุเพิ่มเติม (ถ้ามี):
                  </label>
                  <input
                    type="text"
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder="ข้อความถึงผู้ซื้อ..."
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={closeDialog}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`rounded-lg px-4 py-2 text-xs font-bold text-white shadow-sm transition cursor-pointer ${
                    actionDialog === "reject"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : actionDialog === "approve"
                      ? "bg-[#0F766E] hover:bg-[#0d635d]"
                      : actionDialog === "receive"
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : actionDialog === "ship_exchange"
                      ? "bg-teal-700 hover:bg-teal-800"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  {actionLoading ? "กำลังดำเนินการ..." : "ยืนยันทำรายการ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
