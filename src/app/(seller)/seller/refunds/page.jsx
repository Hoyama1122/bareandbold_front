"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { sellerService } from "@/services/seller.service";
import { Package, X } from "lucide-react";

export default function SellerRefundsPage() {
  const [refunds, setRefunds] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedImage, setSelectedImage] = useState(null);

  // Note dialog
  const [actionDialog, setActionDialog] = useState(null); // { type: 'approve'|'reject', refundId: string }
  const [actionNote, setActionNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRefunds = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await sellerService.getRefunds({ status: statusFilter });
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
      setError(err.message || "ไม่สามารถโหลดรายการคำขอคืนเงินได้");
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    if (!actionDialog) return;
    try {
      setActionLoading(true);
      if (actionDialog.type === "approve") {
        await sellerService.approveRefund(actionDialog.refundId, actionNote);
      } else {
        await sellerService.rejectRefund(actionDialog.refundId, actionNote);
      }
      setActionDialog(null);
      setActionNote("");
      await fetchRefunds();
    } catch (err) {
      alert(err.message || "เกิดข้อผิดพลาดในการดำเนินการ");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            รอพิจารณา
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            อนุมัติแล้ว
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
          คำขอคืนเงิน / เคลมสินค้า
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          ตรวจสอบและพิจารณาคำขอคืนเงินหรือเปลี่ยนสินค้าจากผู้ซื้อในร้านของคุณ
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {[
          { key: "ALL", label: "ทั้งหมด" },
          { key: "PENDING", label: "รอตรวจสอบ", countKey: "PENDING" },
          { key: "APPROVED", label: "อนุมัติแล้ว", countKey: "APPROVED" },
          { key: "REJECTED", label: "ปฏิเสธ", countKey: "REJECTED" },
        ].map((tab) => {
          const count = tab.countKey ? counts[tab.countKey] : null;
          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                statusFilter === tab.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
              {typeof count === "number" && count > 0 && (
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  statusFilter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
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
            ยังไม่มีรายการคำขอคืนเงิน
          </p>
          <p className="text-sm text-slate-500">
            เมื่อผู้ซื้อส่งคำขอคืนเงินหรือเปลี่ยนสินค้า รายการจะปรากฏที่นี่
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(Array.isArray(refunds) ? refunds : []).map((rf) => (
            <div
              key={rf.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      ID: {rf.id.slice(0, 8)}...
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-bold ${
                        rf.requestType === "EXCHANGE"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {rf.requestType === "EXCHANGE" ? "ขอเปลี่ยนสินค้า" : "ขอคืนเงิน"}
                    </span>
                    {getStatusBadge(rf.status)}
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    ยื่นคำขอเมื่อ: {new Date(rf.createdAt).toLocaleString("th-TH")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">ยอดเงินที่ขอคืน</div>
                  <div className="text-lg font-black text-rose-600">
                    ฿{Number(rf.amount || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Order Info & Reason */}
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
                  {rf.bankAccountNumber && (
                    <div className="rounded-lg bg-slate-50 p-2 text-xs text-slate-700">
                      <span className="font-semibold">ข้อมูลบัญชีรับเงิน:</span>{" "}
                      {rf.bankName} - {rf.bankAccountNumber} ({rf.bankAccountName})
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-sm">
                  <div className="font-semibold text-slate-800">
                    เหตุผล: <span className="font-normal text-slate-700">{rf.reason}</span>
                  </div>
                  {rf.details && (
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold">รายละเอียดเพิ่มเติม:</span> {rf.details}
                    </div>
                  )}
                  {rf.adminNote && (
                    <div className="rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                      <span className="font-semibold">บันทึกของร้าน/แอดมิน:</span> {rf.adminNote}
                    </div>
                  )}
                </div>
              </div>

              {/* Images Preview */}
              {Array.isArray(rf.images) && rf.images.length > 0 && (
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="mb-2 text-xs font-semibold text-slate-500">รูปภาพหลักฐาน:</p>
                  <div className="flex flex-wrap gap-2">
                    {rf.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className="group relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200"
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

              {/* Action Buttons */}
              {rf.status === "PENDING" && (
                <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => {
                      setActionDialog({ type: "reject", refundId: rf.id });
                      setActionNote("");
                    }}
                    className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    ปฏิเสธคำขอ
                  </button>
                  <button
                    onClick={() => {
                      setActionDialog({ type: "approve", refundId: rf.id });
                      setActionNote("");
                    }}
                    className="rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d635d]"
                  >
                    อนุมัติคำขอคืนเงิน
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
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

      {/* Action Dialog (Approve / Reject) */}
      {actionDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">
              {actionDialog.type === "approve"
                ? "ยืนยันการอนุมัติคำขอคืนเงิน"
                : "ยืนยันการปฏิเสธคำขอคืนเงิน"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {actionDialog.type === "approve"
                ? "เมื่ออนุมัติ ยอดเงินสุทธิจะถูกหักคืนจากยอดเงินร้านค้าและสถานะออเดอร์จะเปลี่ยนเป็น REFUNDED"
                : "กรุณาระบุเหตุผลการปฏิเสธเพื่อให้ผู้ซื้อทราบ"}
            </p>

            <form onSubmit={handleActionSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  หมายเหตุ / ข้อความถึงผู้ซื้อ:
                </label>
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder={
                    actionDialog.type === "approve"
                      ? "เช่น ได้รับสินค้าคืนเรียบร้อยแล้ว ยินดีคืนเงิน"
                      : "เช่น สินค้าผ่านการใช้งานแล้ว ไม่เข้าเกณฑ์การคืน"
                  }
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-[#0F766E] focus:outline-none"
                  required={actionDialog.type === "reject"}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setActionDialog(null)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm ${
                    actionDialog.type === "approve"
                      ? "bg-[#0F766E] hover:bg-[#0d635d]"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {actionLoading
                    ? "กำลังดำเนินการ..."
                    : actionDialog.type === "approve"
                      ? "ยืนยันอนุมัติ"
                      : "ยืนยันปฏิเสธ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
