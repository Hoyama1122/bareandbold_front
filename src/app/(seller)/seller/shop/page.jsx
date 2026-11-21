"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { shopService } from "@/services/shop.service";

export default function SellerShopProfilePage() {
  const { shop } = useAuth();
  const [shopDetail, setShopDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedAcc, setCopiedAcc] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadShop = async () => {
      try {
        setLoading(true);
        const data = await shopService.getMyShop();
        if (!cancelled) {
          setShopDetail(data.shop || shop || null);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message || "ไม่สามารถโหลดข้อมูลร้านค้าได้");
          setShopDetail(shop || null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadShop();
    return () => {
      cancelled = true;
    };
  }, [shop]);

  const currentShop = shopDetail || shop || {};

  const handleCopyAccount = () => {
    if (!currentShop.bankAccountNumber) return;
    navigator.clipboard?.writeText(String(currentShop.bankAccountNumber));
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 1800);
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
            ตรวจสอบสถานะร้านค้า รายละเอียดแบรนด์ เลขประจำตัวผู้เสียภาษี และบัญชีธนาคารรับเงินของร้าน
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/seller"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            กลับหน้าภาพรวม
          </Link>
          {currentShop.slug && (
            <Link
              href={`/shop/${currentShop.slug}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#115E59]"
            >
              <span>ดูหน้าร้านของฉัน</span>
              <span>→</span>
            </Link>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-sm font-semibold text-rose-700">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center text-base font-medium text-slate-500">
          กำลังโหลดข้อมูลร้านค้า...
        </div>
      ) : (
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
                  <dt className="font-medium text-slate-500">
                    เลขประจำตัวผู้เสียภาษี
                  </dt>
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
                <p className="mt-1 text-sm text-slate-500">
                  ข้อมูลบัญชีธนาคารที่ลงทะเบียนไว้สำหรับรับโอนยอดขาย
                </p>
              </div>

              <dl className="mt-5 divide-y divide-slate-100 text-sm sm:text-[15px]">
                <div className="flex flex-col justify-between gap-1.5 py-3.5 sm:flex-row sm:items-center">
                  <dt className="font-medium text-slate-500">ธนาคาร</dt>
                  <dd className="text-base font-extrabold text-slate-900 sm:text-lg">
                    {currentShop.bankName || "-"}
                  </dd>
                </div>

                <div className="flex flex-col justify-between gap-1.5 py-3.5 sm:flex-row sm:items-center">
                  <dt className="font-medium text-slate-500">ชื่อบัญชีธนาคาร</dt>
                  <dd className="text-base font-extrabold text-slate-900 sm:text-lg">
                    {currentShop.bankAccountName || "-"}
                  </dd>
                </div>

                <div className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center">
                  <dt className="font-medium text-slate-500">
                    เลขที่บัญชีธนาคาร
                  </dt>
                  <dd className="flex items-center gap-2.5">
                    <span className="rounded-xl bg-slate-900 px-3.5 py-1.5 font-mono text-base font-extrabold tracking-wider text-white sm:text-lg">
                      {currentShop.bankAccountNumber || "-"}
                    </span>
                    {currentShop.bankAccountNumber && (
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
                      >
                        {copiedAcc ? "คัดลอกแล้ว" : "คัดลอก"}
                      </button>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-5 rounded-xl border border-teal-100 bg-teal-50/60 px-4 py-3.5 text-xs leading-relaxed text-teal-900 sm:text-sm">
              ยอดขายจากคำสั่งซื้อของร้านจะอ้างอิงตามบัญชีธนาคารที่แสดงด้านบนนี้
              หากต้องการแก้ไขข้อมูลร้านหรือบัญชี สามารถจัดการได้ที่หน้าสมัคร/ข้อมูลร้าน
            </div>
          </div>
        </div>
      )}
    </div>
  );
}