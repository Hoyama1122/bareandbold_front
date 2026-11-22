"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { voucherService } from "@/services/voucher.service";

function baht(n) {
  return Number(n || 0).toLocaleString("th-TH");
}

function formatDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function toInputDateTime(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

const getDefaultDates = () => {
  const now = new Date();
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    startsAt: toInputDateTime(now),
    endsAt: toInputDateTime(end),
  };
};

const EMPTY_FORM = () => {
  const { startsAt, endsAt } = getDefaultDates();
  return {
    code: "",
    title: "",
    description: "",
    discountType: "FIXED",
    discountValue: "50",
    maxDiscount: "",
    minSpend: "300",
    scopeType: "SHOP",
    targetCategory: "",
    totalQuota: "100",
    perUserLimit: "1",
    isPublic: true,
    startsAt,
    endsAt,
  };
};

const STATUS_BADGE = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PAUSED: "bg-amber-50 text-amber-700 border-amber-200",
  SUSPENDED: "bg-rose-50 text-rose-700 border-rose-200",
  EXPIRED: "bg-slate-100 text-slate-600 border-slate-200",
  OUT_OF_STOCK: "bg-slate-100 text-slate-600 border-slate-200",
  UPCOMING: "bg-blue-50 text-blue-700 border-blue-200",
};

const STATUS_LABEL = {
  ACTIVE: "กำลังใช้งาน",
  PAUSED: "หยุดชั่วคราว",
  SUSPENDED: "ถูกแอดมินระงับ",
  EXPIRED: "หมดอายุ",
  OUT_OF_STOCK: "สิทธิ์เต็มแล้ว",
  UPCOMING: "ยังไม่เริ่ม",
};

export default function SellerVouchersPage() {
  const { shop } = useAuth();
  const [vouchers, setVouchers] = useState([]);
  const [summary, setSummary] = useState({
    totalVouchers: 0,
    activeVouchers: 0,
    totalClaimed: 0,
    totalUsed: 0,
    totalDiscountGiven: 0,
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [noticeMsg, setNoticeMsg] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const loadVouchers = useCallback(async () => {
    if (!shop?.id) return;
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await voucherService.sellerListVouchers();
      if (data.success) {
        setVouchers(data.vouchers || []);
        if (data.summary) setSummary(data.summary);
      }
    } catch (err) {
      setErrorMsg(err.message || "ไม่สามารถโหลดคูปองร้านค้าได้");
    } finally {
      setLoading(false);
    }
  }, [shop?.id]);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM());
    setErrorMsg("");
    setShowModal(true);
  };

  const openEditModal = (v) => {
    setEditingId(v.id);
    setForm({
      code: v.code || "",
      title: v.title || "",
      description: v.description || "",
      discountType: v.discountType || "FIXED",
      discountValue: String(v.discountValue ?? ""),
      maxDiscount: v.maxDiscount != null ? String(v.maxDiscount) : "",
      minSpend: String(v.minSpend ?? 0),
      scopeType: v.scopeType || "SHOP",
      targetCategory: v.targetCategory || "",
      totalQuota: v.totalQuota != null ? String(v.totalQuota) : "",
      perUserLimit: String(v.perUserLimit ?? 1),
      isPublic: Boolean(v.isPublic),
      startsAt: toInputDateTime(v.startsAt),
      endsAt: toInputDateTime(v.endsAt),
    });
    setErrorMsg("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg("");
      setNoticeMsg("");

      const payload = {
        code: form.code.trim().toUpperCase(),
        title: form.title.trim(),
        description: form.description.trim() || null,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxDiscount:
          form.discountType === "PERCENT" && form.maxDiscount !== ""
            ? Number(form.maxDiscount)
            : null,
        minSpend: Number(form.minSpend || 0),
        scopeType: form.scopeType,
        targetCategory:
          form.scopeType === "CATEGORY" ? form.targetCategory || null : null,
        totalQuota: form.totalQuota !== "" ? Number(form.totalQuota) : null,
        perUserLimit: Number(form.perUserLimit || 1),
        isPublic: Boolean(form.isPublic),
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
      };

      if (editingId) {
        await voucherService.sellerUpdateVoucher(editingId, payload);
        setNoticeMsg("อัปเดตคูปองร้านค้าเรียบร้อยแล้ว");
      } else {
        await voucherService.sellerCreateVoucher(payload);
        setNoticeMsg("สร้างคูปองร้านค้าเรียบร้อยแล้ว");
      }

      setShowModal(false);
      await loadVouchers();
    } catch (err) {
      setErrorMsg(err.message || "บันทึกคูปองไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (v) => {
    const nextStatus = v.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      setBusyId(v.id);
      setErrorMsg("");
      await voucherService.sellerUpdateVoucherStatus(v.id, nextStatus);
      await loadVouchers();
    } catch (err) {
      setErrorMsg(err.message || "เปลี่ยนสถานะคูปองไม่สำเร็จ");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (v) => {
    if (!window.confirm(`ต้องการลบคูปอง "${v.code}" ใช่หรือไม่?`)) return;
    try {
      setBusyId(v.id);
      setErrorMsg("");
      const res = await voucherService.sellerDeleteVoucher(v.id);
      if (res.message) setNoticeMsg(res.message);
      await loadVouchers();
    } catch (err) {
      setErrorMsg(err.message || "ลบคูปองไม่สำเร็จ");
    } finally {
      setBusyId(null);
    }
  };

  const kpiCards = [
    {
      label: "คูปองทั้งหมดของร้าน",
      value: summary.totalVouchers,
      sub: `กำลังใช้งาน ${summary.activeVouchers} ใบ`,
      badge: "VOUCHERS",
      cls: "bg-slate-100 text-slate-700",
    },
    {
      label: "ยอดเก็บโค้ดรวม",
      value: `${baht(summary.totalClaimed)} ครั้ง`,
      sub: "จำนวนลูกค้าที่กดเก็บคูปอง",
      badge: "CLAIMED",
      cls: "bg-teal-50 text-teal-700",
    },
    {
      label: "ยอดใช้คูปองจริง",
      value: `${baht(summary.totalUsed)} ครั้ง`,
      sub: "ออเดอร์ที่ใช้คูปองของร้าน",
      badge: "USED",
      cls: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "มูลค่าส่วนลดที่ร้านมอบให้",
      value: `฿${baht(summary.totalDiscountGiven)}`,
      sub: "Shop-funded discount สะสม",
      badge: "DISCOUNT",
      cls: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-2xs">
        <div>
          <span className="inline-block rounded-md bg-teal-50 px-2.5 py-1 text-xs font-extrabold text-teal-800 uppercase">
            SHOP VOUCHERS
          </span>
          <h1 className="mt-1.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
            คูปองส่วนลดร้านค้า · {shop?.name || "MY SHOP"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            สร้างโค้ดส่วนลดเฉพาะร้านของคุณ เพื่อกระตุ้นยอดขาย (ส่วนลดคูปองร้านค้าจะหักจากยอดขายของร้าน)
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#115E59] cursor-pointer"
        >
          <span>+ สร้างคูปองร้านค้า</span>
        </button>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-slate-600">{c.label}</p>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold ${c.cls}`}>
                {c.badge}
              </span>
            </div>
            <p className="mt-2.5 text-2xl font-extrabold text-slate-900">{c.value}</p>
            <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
          </div>
        ))}
      </section>

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {errorMsg}
        </div>
      )}
      {noticeMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {noticeMsg}
        </div>
      )}

      {/* Vouchers Table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            กำลังโหลดคูปองร้านค้า...
          </div>
        ) : vouchers.length === 0 ? (
          <div className="p-14 text-center">
            <p className="text-base font-bold text-slate-700">ยังไม่มีคูปองร้านค้า</p>
            <p className="mt-1 text-sm text-slate-500">
              เริ่มสร้างคูปองแรกของคุณเพื่อเพิ่มโอกาสปิดการขาย
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#115E59] cursor-pointer"
            >
              + สร้างคูปองแรก
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F8F9FA] text-xs font-extrabold text-slate-600">
                  <th className="px-5 py-3.5">โค้ด / ชื่อคูปอง</th>
                  <th className="px-4 py-3.5">ส่วนลด / ขั้นต่ำ</th>
                  <th className="px-4 py-3.5">ระยะเวลา</th>
                  <th className="px-4 py-3.5">เก็บ / ใช้ / โควตา</th>
                  <th className="px-4 py-3.5">สถานะ</th>
                  <th className="px-5 py-3.5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vouchers.map((v) => {
                  const statusKey = v.effectiveStatus || v.status;
                  const isSuspended = v.status === "SUSPENDED";
                  return (
                    <tr key={v.id} className="hover:bg-slate-50/70 align-top">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-slate-900 px-2.5 py-0.5 font-mono text-xs font-extrabold text-white">
                            {v.code}
                          </span>
                          {!v.isPublic && (
                            <span className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                              Private Code
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 font-bold text-slate-900">{v.title}</p>
                        {v.description && (
                          <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                            {v.description}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <p className="font-extrabold text-[#0F766E]">
                          {v.discountType === "PERCENT"
                            ? `ลด ${v.discountValue}%${v.maxDiscount ? ` (สูงสุด ฿${baht(v.maxDiscount)})` : ""}`
                            : `ลด ฿${baht(v.discountValue)}`}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          ขั้นต่ำ ฿{baht(v.minSpend)} · จำกัด {v.perUserLimit} สิทธิ์/คน
                        </p>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600">
                        <p>เริ่ม: {formatDate(v.startsAt)}</p>
                        <p className="mt-0.5">หมด: {formatDate(v.endsAt)}</p>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-xs">
                        <p className="font-bold text-slate-800">
                          เก็บ {v.claimedCount} · ใช้ {v.usedCount}
                          {v.totalQuota != null ? ` / ${v.totalQuota}` : " / ไม่จำกัด"}
                        </p>
                        <p className="text-slate-500 mt-0.5">
                          ส่วนลดรวม ฿{baht(v.stats?.totalDiscountGiven)}
                        </p>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                            STATUS_BADGE[statusKey] || STATUS_BADGE.PAUSED
                          }`}
                        >
                          {STATUS_LABEL[statusKey] || statusKey}
                        </span>
                        {isSuspended && v.suspendedReason && (
                          <p className="mt-1 text-[11px] text-rose-600 max-w-[160px] whitespace-normal">
                            เหตุผล: {v.suspendedReason}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {!isSuspended && (
                            <>
                              <button
                                type="button"
                                disabled={busyId === v.id}
                                onClick={() => handleToggleStatus(v)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                              >
                                {v.status === "ACTIVE" ? "หยุดชั่วคราว" : "เปิดใช้งาน"}
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(v)}
                                className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-100 cursor-pointer"
                              >
                                แก้ไข
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            disabled={busyId === v.id}
                            onClick={() => handleDelete(v)}
                            className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer disabled:opacity-50"
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900">
                {editingId ? "แก้ไขคูปองร้านค้า" : "สร้างคูปองร้านค้าใหม่"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg px-2.5 py-1 text-sm font-bold text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    รหัสคูปอง (A-Z, 0-9) *
                  </label>
                  <input
                    required
                    value={form.code}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))
                    }
                    placeholder="เช่น SHOP50"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono text-sm uppercase outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ชื่อคูปอง *
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="เช่น ลดทันที 50 บาท"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  รายละเอียด / เงื่อนไขเพิ่มเติม
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="ใช้ได้กับสินค้าทุกชิ้นในร้าน..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    รูปแบบส่วนลด *
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm((p) => ({ ...p, discountType: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                  >
                    <option value="FIXED">ลดเป็นบาท (฿)</option>
                    <option value="PERCENT">ลดเป็นเปอร์เซ็นต์ (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {form.discountType === "PERCENT" ? "ส่วนลด (%) *" : "ส่วนลด (บาท) *"}
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max={form.discountType === "PERCENT" ? "100" : undefined}
                    value={form.discountValue}
                    onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ยอดซื้อขั้นต่ำ (บาท)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.minSpend}
                    onChange={(e) => setForm((p) => ({ ...p, minSpend: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {form.discountType === "PERCENT" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    เพดานส่วนลดสูงสุด (บาท) — เว้นว่างหากไม่จำกัด
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.maxDiscount}
                    onChange={(e) => setForm((p) => ({ ...p, maxDiscount: e.target.value }))}
                    placeholder="เช่น 200"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    จำนวนสิทธิ์รวม (เว้นว่าง = ไม่จำกัด)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.totalQuota}
                    onChange={(e) => setForm((p) => ({ ...p, totalQuota: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    จำกัดสิทธิ์ต่อคน *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.perUserLimit}
                    onChange={(e) => setForm((p) => ({ ...p, perUserLimit: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    วันที่เริ่มต้น *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={form.startsAt}
                    onChange={(e) => setForm((p) => ({ ...p, startsAt: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    วันที่สิ้นสุด *
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={form.endsAt}
                    onChange={(e) => setForm((p) => ({ ...p, endsAt: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => setForm((p) => ({ ...p, isPublic: e.target.checked }))}
                  className="h-4 w-4 rounded accent-teal-700"
                />
                <span>แสดงให้ลูกค้าเก็บโค้ดสาธารณะ (ถ้าปิดจะเป็น Private Code ต้องกรอกรหัสเอง)</span>
              </label>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#0F766E] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#115E59] disabled:opacity-60 cursor-pointer"
                >
                  {saving ? "กำลังบันทึก..." : editingId ? "บันทึกการแก้ไข" : "สร้างคูปอง"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
