"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { shopService } from "@/services/shop.service";
import { Store, Landmark, Edit3, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";

export default function SellerShopProfilePage() {
  const { shop, refresh: refreshAuth } = useAuth();
  const [shopDetail, setShopDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [copiedAcc, setCopiedAcc] = useState(false);

  // Edit Mode States
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    bannerUrl: "",
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
  });

  const loadShop = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await shopService.getMyShop();
      const current = data.shop || shop || {};
      setShopDetail(current);
      setFormData({
        name: current.name || "",
        description: current.description || "",
        logoUrl: current.logoUrl || "",
        bannerUrl: current.bannerUrl || "",
        bankName: current.bankName || "",
        bankAccountNumber: current.bankAccountNumber || "",
        bankAccountName: current.bankAccountName || "",
      });
    } catch (err) {
      setErrorMsg(err.message || "ไม่สามารถโหลดข้อมูลร้านค้าได้");
      setShopDetail(shop || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShop();
  }, [shop]);

  const currentShop = shopDetail || shop || {};

  const handleCopyAccount = () => {
    if (!currentShop.bankAccountNumber) return;
    navigator.clipboard?.writeText(String(currentShop.bankAccountNumber));
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 1800);
  };

  const handleSaveShop = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await shopService.update(formData);
      if (res.success) {
        setSuccessMsg("บันทึกการเปลี่ยนแปลงข้อมูลร้านและบัญชีธนาคารเรียบร้อยแล้ว");
        setIsEditing(false);
        loadShop();
        if (refreshAuth) refreshAuth();
      } else {
        throw new Error(res.error || "ไม่สามารถอัปเดตข้อมูลร้านค้าได้");
      }
    } catch (err) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white px-6 py-6 shadow-xs sm:px-7">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2">
            <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-extrabold tracking-wider text-teal-800 uppercase">
              SHOP PROFILE &amp; PAYOUT
            </span>
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              {currentShop.status || "APPROVED"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            ข้อมูลร้านค้าและบัญชีรับเงิน
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            ตรวจสอบและแก้ไขรายละเอียดแบรนด์ คำอธิบายร้าน และบัญชีธนาคารสำหรับรับเงินโอน Payout
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold transition shadow-xs cursor-pointer ${
              isEditing
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-[#0F766E] text-white hover:bg-[#115E59]"
            }`}
          >
            <Edit3 size={16} />
            {isEditing ? "ยกเลิกการแก้ไข" : "แก้ไขข้อมูลร้านและบัญชี"}
          </button>
          {currentShop.slug && (
            <Link
              href={`/shop/${currentShop.slug}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <span>ดูหน้าร้านของฉัน</span>
              <span>→</span>
            </Link>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-sm font-semibold text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center text-base font-medium text-slate-500">
          กำลังโหลดข้อมูลร้านค้า...
        </div>
      ) : isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSaveShop} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900">แก้ไขข้อมูลร้านค้าและบัญชีธนาคาร</h2>
            <p className="text-xs text-slate-500">ปรับเปลี่ยนชื่อร้าน คำอธิบาย รูปแบนเนอร์/โลโก้ และบัญชีรับเงิน</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อร้านค้า <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 focus:outline-hidden focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Slug ร้านค้า (ไม่สามารถเปลี่ยนได้)
              </label>
              <input
                type="text"
                disabled
                value={currentShop.slug || ""}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-400 bg-slate-50 cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                คำอธิบายร้านค้า
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="อธิบายสไตล์ร้าน เอกลักษณ์ของเครื่องประดับ หรือบริการสั่งทำ..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-hidden focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL โลโก้ร้านค้า (Logo URL)
              </label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))}
                placeholder="https://example.com/logo.jpg"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL แบนเนอร์ร้านค้า (Banner URL)
              </label>
              <input
                type="url"
                value={formData.bannerUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, bannerUrl: e.target.value }))}
                placeholder="https://example.com/banner.jpg"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-[#0F766E]"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <Landmark size={18} className="text-[#0F766E]" />
              ข้อมูลบัญชีธนาคารสำหรับรับเงินโอน (Payout Account)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อธนาคาร <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bankName: e.target.value }))}
                  placeholder="เช่น กสิกรไทย, ไทยพาณิชย์"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เลขที่บัญชีธนาคาร <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bankAccountNumber: e.target.value }))}
                  placeholder="เช่น 123-4-56789-0"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#0F766E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อเจ้าของบัญชี <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankAccountName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bankAccountName: e.target.value }))}
                  placeholder="ชื่อ-นามสกุลตรงกับบัญชี"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:border-[#0F766E]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer"
            >
              {saving ? "กำลังบันทึก..." : "✓ บันทึกข้อมูลร้านและบัญชี"}
            </button>
          </div>
        </form>
      ) : (
        /* View Mode */
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* การ์ดข้อมูลทั่วไปของร้าน */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-extrabold tracking-wide text-slate-700">
                    SHOP INFO
                  </span>
                  <h2 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                    รายละเอียดร้านค้า
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-extrabold text-emerald-700 sm:text-sm">
                  {currentShop.status || "APPROVED"}
                </span>
              </div>

              <dl className="mt-5 divide-y divide-slate-100 text-sm sm:text-[15px]">
                <div className="flex flex-col justify-between gap-1.5 py-3.5 sm:flex-row sm:items-center">
                  <dt className="font-medium text-slate-500">ชื่อร้านค้า</dt>
                  <dd className="text-base font-extrabold text-slate-900 sm:text-lg">
                    {currentShop.name || "-"}
                  </dd>
                </div>

                <div className="flex flex-col justify-between gap-1.5 py-3.5 sm:flex-row sm:items-center">
                  <dt className="font-medium text-slate-500">URL หน้าร้าน</dt>
                  <dd className="rounded-lg bg-slate-50 px-3 py-1 font-mono text-sm font-bold text-teal-800">
                    {currentShop.slug ? `/shop/${currentShop.slug}` : "-"}
                  </dd>
                </div>

                <div className="flex flex-col justify-between gap-1.5 py-3.5 sm:flex-row sm:items-center">
                  <dt className="font-medium text-slate-500">เลขประจำตัวผู้เสียภาษี</dt>
                  <dd className="font-mono text-base font-bold text-slate-900">
                    {currentShop.taxId || "-"}
                  </dd>
                </div>

                <div className="pt-4">
                  <dt className="font-medium text-slate-500">คำอธิบายร้าน</dt>
                  <dd className="mt-2 rounded-xl border border-slate-200/80 bg-[#F8F9FA] p-4 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                    {currentShop.description || "ยังไม่ได้ระบุคำอธิบายร้านค้า"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* การ์ดข้อมูลบัญชีรับเงิน */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
            <div>
              <div className="border-b border-slate-100 pb-4">
                <span className="inline-block rounded-md bg-teal-50 px-2.5 py-1 text-xs font-extrabold tracking-wide text-teal-800">
                  PAYOUT ACCOUNT
                </span>
                <h2 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                  บัญชีธนาคารรับเงินของร้านค้า
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  แอดมินจะใช้ข้อมูลบัญชีนี้ในการโอนเงินค่าสินค้า (หลังหัก GP) เมื่อร้านค้ากดยื่นถอนเงิน
                </p>
              </div>

              <dl className="mt-5 divide-y divide-slate-100 text-sm sm:text-[15px]">
                <div className="flex flex-col justify-between gap-1.5 py-3.5 sm:flex-row sm:items-center">
                  <dt className="font-medium text-slate-500">ธนาคาร</dt>
                  <dd className="text-base font-extrabold text-slate-900 sm:text-lg">
                    {currentShop.bankName || "ยังไม่ได้ระบุ"}
                  </dd>
                </div>

                <div className="flex flex-col justify-between gap-1.5 py-3.5 sm:flex-row sm:items-center">
                  <dt className="font-medium text-slate-500">เลขที่บัญชี</dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-slate-900 sm:text-lg">
                      {currentShop.bankAccountNumber || "ยังไม่ได้ระบุ"}
                    </span>
                    {currentShop.bankAccountNumber && (
                      <button
                        onClick={handleCopyAccount}
                        className="rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-50"
                        title="คัดลอกเลขบัญชี"
                      >
                        {copiedAcc ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    )}
                  </dd>
                </div>

                <div className="flex flex-col justify-between gap-1.5 py-3.5 sm:flex-row sm:items-center">
                  <dt className="font-medium text-slate-500">ชื่อเจ้าของบัญชี</dt>
                  <dd className="text-base font-extrabold text-slate-900">
                    {currentShop.bankAccountName || "ยังไม่ได้ระบุ"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 rounded-xl border border-slate-100 bg-[#F8F9FA] p-4 text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">เงื่อนไขการรับเงิน:</p>
              <p>• เมื่อลูกค้ากดยืนยันรับสินค้า ยอดเงินสุทธิจะเข้าสู่ Available Balance ของร้านทันที</p>
              <p>• ร้านค้าสามารถกดยื่นถอนเงินได้ตลอดเวลาที่เมนู &quot;การเงินร้านค้า&quot;</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
