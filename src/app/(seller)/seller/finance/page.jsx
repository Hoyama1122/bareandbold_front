"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const CATEGORIES = {
  BRACELET: "กำไลข้อมือ",
  ANKLET: "กำไลข้อเท้า",
  RING: "แหวน",
  NECKLACE: "สร้อยคอ",
};

function baht(n) {
  return Number(n || 0).toLocaleString("th-TH");
}

export default function SellerFinancePage() {
  const { shop, token } = useAuth();
  const [wallet, setWallet] = useState({
    balance: 0,
    pendingBalance: 0,
    totalSales: 0,
    totalUnitsSold: 0,
  });
  const [items, setItems] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const getHeaders = useCallback(() => {
    const storedToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("bare_auth_token") ||
          localStorage.getItem("token")
        : null);
    return {
      "Content-Type": "application/json",
      ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
    };
  }, [token]);

  useEffect(() => {
    if (!shop?.id) return;
    let cancelled = false;

    const loadFinanceData = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const headers = getHeaders();
        const [salesRes, walletRes, payoutsRes] = await Promise.all([
          fetch(`${API_URL}/seller/sales-summary`, {
            headers,
            credentials: "include",
          }),
          fetch(`${API_URL}/seller/wallet`, {
            headers,
            credentials: "include",
          }),
          fetch(`${API_URL}/seller/payouts`, {
            headers,
            credentials: "include",
          }),
        ]);

        const salesData = await salesRes.json().catch(() => ({}));
        const walletData = await walletRes.json().catch(() => ({}));
        const payoutsData = await payoutsRes.json().catch(() => ({}));

        if (!salesRes.ok || !salesData?.success) {
          throw new Error(
            salesData?.error ||
              `เรียก /api/seller/sales-summary ไม่สำเร็จ (HTTP ${salesRes.status}) — ตรวจสอบว่าได้เพิ่ม route นี้ใน Backend และ restart server แล้วหรือยัง`,
          );
        }

        if (cancelled) return;

        const productItems = Array.isArray(salesData?.items)
          ? salesData.items
          : [];
        setItems(productItems);

        const payoutList =
          payoutsData?.payouts || payoutsData?.data || payoutsData?.items || [];
        setPayouts(Array.isArray(payoutList) ? payoutList : []);

        const w = walletData?.wallet || {};
        const s = salesData?.summary || {};

        setWallet({
          balance: Number(w.balance ?? s.balance ?? 0),
          pendingBalance: Number(w.heldAmount ?? 0),
          totalSales: Number(s.totalSales ?? 0),
          totalUnitsSold: Number(s.totalUnitsSold ?? 0),
        });
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message || "โหลดข้อมูลการเงินไม่สำเร็จ");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadFinanceData();
    return () => {
      cancelled = true;
    };
  }, [shop?.id, getHeaders]);

  const summaryCards = [
    {
      label: "ยอดเงินคงเหลือของร้าน",
      value: `฿${baht(wallet.balance)}`,
      sub: "ยอดเงินรับสุทธิในกระเป๋าของร้าน",
      badge: "BALANCE",
      badgeClass: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "ยอดขายรวมทั้งหมด",
      value: `฿${baht(wallet.totalSales)}`,
      sub: "รวมยอดขายจากรายการสั่งซื้อของร้าน",
      badge: "REVENUE",
      badgeClass: "bg-teal-50 text-teal-700",
    },
    {
      label: "จำนวนชิ้นที่ขายได้ทั้งหมด",
      value: `${baht(wallet.totalUnitsSold)} ชิ้น`,
      sub: "นับรวมทุกสินค้าในร้าน",
      badge: "UNITS SOLD",
      badgeClass: "bg-indigo-50 text-indigo-700",
    },
    {
      label: "ยอดรอดำเนินการถอน",
      value: `฿${baht(wallet.pendingBalance)}`,
      sub: "ยอดคำขอถอนที่อยู่ระหว่างดำเนินการ",
      badge: "PENDING PAYOUT",
      badgeClass: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-2xs">
        <div>
          <span className="inline-block rounded-md bg-teal-50 px-2.5 py-1 text-xs font-extrabold text-teal-800 uppercase">
            FINANCE &amp; SALES SUMMARY
          </span>
          <h1 className="mt-1.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
            การเงินและยอดขายรายสินค้า · {shop?.name || "MY SHOP"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            สรุปภาพรวมการเงินของร้านค้าและดูว่าสินค้าแต่ละชิ้นขายได้กี่บาท กี่ชิ้น
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/seller/products"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            ไปที่รายการสินค้า
          </Link>
          <Link
            href="/seller/shop"
            className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#115E59]"
          >
            ดูบัญชีรับเงิน
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* 4 Summary Cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-slate-600">{card.label}</p>
              <span
                className={`rounded-md px-2.5 py-0.5 text-[11px] font-extrabold ${card.badgeClass}`}
              >
                {card.badge}
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
              {card.value}
            </p>
            <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
              {card.sub}
            </p>
          </div>
        ))}
      </section>

      {/* ตารางยอดขายแยกตามรายสินค้า */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">
              ยอดขายแยกตามสินค้า (ขายได้กี่ชิ้น / กี่บาท)
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              แสดงรายการสินค้าในร้าน ราคาต่อชิ้น จำนวนที่ขายได้ และยอดเงินรวมของสินค้านั้นๆ
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500 sm:text-base">
            กำลังโหลดข้อมูลการเงินและยอดขายสินค้า...
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500 sm:text-base">
            ยังไม่มีรายการสินค้าในร้านค้า
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F8F9FA] text-xs font-extrabold text-slate-600 sm:text-sm">
                  <th className="px-6 py-3.5">สินค้า</th>
                  <th className="px-4 py-3.5">หมวดหมู่</th>
                  <th className="px-4 py-3.5">ราคาต่อชิ้น</th>
                  <th className="px-4 py-3.5">ขายได้ (ชิ้น)</th>
                  <th className="px-4 py-3.5">ยอดเงินที่ขายได้</th>
                  <th className="px-6 py-3.5 text-right">สต็อกคงเหลือ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm sm:text-[15px]">
                {items.map((product) => {
                  const thumb =
                    product.images?.[0]?.url || "/images/placeholder.jpg";
                  const catLabel =
                    CATEGORIES[product.category] || product.category;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={thumb}
                            alt={product.name}
                            className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 object-cover"
                          />
                          <span className="font-bold text-slate-900">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 sm:text-sm">
                          {catLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-slate-800">
                        ฿{baht(product.price)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="rounded-md bg-teal-50 px-3 py-1 text-xs font-extrabold text-teal-800 sm:text-sm">
                          {baht(product.soldQuantity)} ชิ้น
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-extrabold text-emerald-700">
                        ฿{baht(product.soldAmount)}
                      </td>
                      <td className="px-6 py-3.5 text-right whitespace-nowrap font-semibold text-slate-700">
                        {baht(product.stock)} ชิ้น
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ประวัติการถอนเงิน */}
      {payouts.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
              ประวัติการถอนเงินของร้าน
            </h2>
          </div>
          <div className="divide-y divide-slate-100 text-sm">
            {payouts.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5"
              >
                <span className="font-semibold text-slate-800">
                  {item.note || item.reference || `รายการถอนเงิน #${idx + 1}`}
                </span>
                <span className="font-extrabold text-slate-900">
                  ฿{baht(item.amount)}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {item.status || "PENDING"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}