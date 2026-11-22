"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { sellerService } from "@/services/seller.service";
import { Wallet, ArrowDownCircle, Clock, CheckCircle2, AlertCircle, RefreshCw, Landmark } from "lucide-react";

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

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SellerFinancePage() {
  const { shop, token } = useAuth();
  const [wallet, setWallet] = useState({
    balance: 0,
    heldAmount: 0,
    availableBalance: 0,
    totalSales: 0,
    totalUnitsSold: 0,
    transactions: [],
  });
  const [items, setItems] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Payout form state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState("");
  const [payoutErrorMsg, setPayoutErrorMsg] = useState("");

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

  const loadFinanceData = useCallback(async () => {
    if (!shop?.id) return;
    try {
      setLoading(true);
      setErrorMsg("");

      const headers = getHeaders();
      const [salesRes, walletRes, payoutsRes] = await Promise.all([
        fetch(`${API_URL}/seller/sales-summary`, { headers, credentials: "include" }),
        fetch(`${API_URL}/seller/wallet`, { headers, credentials: "include" }),
        fetch(`${API_URL}/seller/payouts`, { headers, credentials: "include" }),
      ]);

      const salesData = await salesRes.json().catch(() => ({}));
      const walletData = await walletRes.json().catch(() => ({}));
      const payoutsData = await payoutsRes.json().catch(() => ({}));

      const productItems = Array.isArray(salesData?.items) ? salesData.items : [];
      setItems(productItems);

      const payoutList = payoutsData?.payouts || payoutsData?.data || payoutsData?.items || [];
      setPayouts(Array.isArray(payoutList) ? payoutList : []);

      const w = walletData?.wallet || {};
      const s = salesData?.summary || {};

      setWallet({
        balance: Number(w.balance ?? s.balance ?? 0),
        heldAmount: Number(w.heldAmount ?? 0),
        availableBalance: Number(w.availableBalance ?? w.balance ?? 0),
        totalSales: Number(s.totalSales ?? 0),
        totalUnitsSold: Number(s.totalUnitsSold ?? 0),
        transactions: Array.isArray(w.transactions) ? w.transactions : [],
      });
    } catch (err) {
      setErrorMsg(err.message || "โหลดข้อมูลการเงินไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [shop?.id, getHeaders]);

  useEffect(() => {
    loadFinanceData();
  }, [loadFinanceData]);

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    setPayoutSuccessMsg("");
    setPayoutErrorMsg("");

    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      setPayoutErrorMsg("กรุณาระบุจำนวนเงินที่ต้องการถอนให้ถูกต้อง");
      return;
    }

    if (amount > wallet.availableBalance) {
      setPayoutErrorMsg(`ยอดเงินที่ถอนได้มีเพียง ฿${baht(wallet.availableBalance)}`);
      return;
    }

    try {
      setIsSubmittingPayout(true);
      const res = await sellerService.createPayout(amount);
      if (res.success) {
        setPayoutSuccessMsg(`ส่งคำขอถอนเงินจำนวน ฿${baht(amount)} เรียบร้อยแล้ว แอดมินจะตรวจสอบและโอนเงินเข้าบัญชีของคุณ`);
        setWithdrawAmount("");
        loadFinanceData();
      } else {
        throw new Error(res.error || "ไม่สามารถส่งคำขอถอนเงินได้");
      }
    } catch (err) {
      setPayoutErrorMsg(err.message || "เกิดข้อผิดพลาดในการขอถอนเงิน");
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  const summaryCards = [
    {
      label: "ยอดเงินที่ถอนได้ทันที",
      value: `฿${baht(wallet.availableBalance)}`,
      sub: `ยอดเงินในกระเป๋า ฿${baht(wallet.balance)} (ติดค้างถอน ฿${baht(wallet.heldAmount)})`,
      badge: "AVAILABLE",
      badgeClass: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "ยอดขายรวมทั้งหมด",
      value: `฿${baht(wallet.totalSales)}`,
      sub: "รวมยอดขายจากทุกรายการคำสั่งซื้อของร้าน",
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
      label: "ยอดรอดำเนินการโอนเงิน",
      value: `฿${baht(wallet.heldAmount)}`,
      sub: "คำขอถอนเงินที่รอแอดมินอนุมัติ",
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
            FINANCE &amp; PAYOUT CENTER
          </span>
          <h1 className="mt-1.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
            การเงิน กระเป๋าเงิน และยอดขาย · {shop?.name || "MY SHOP"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            ตรวจสอบยอดเงินคงเหลือ แจ้งขอถอนเงิน และดูประวัติบัญชีแยกประเภท (Ledger) ของร้านค้า
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={loadFinanceData}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 flex items-center gap-1.5"
          >
            <RefreshCw size={14} />
            รีเฟรชข้อมูล
          </button>
          <Link
            href="/seller/shop"
            className="rounded-xl bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#115E59]"
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

      {/* ฟอร์มขอถอนเงิน (Request Payout Form) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-4">
          <span className="p-2 rounded-xl bg-teal-50 text-[#0F766E]">
            <Landmark size={20} />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
              ยื่นคำขอถอนเงิน (Request Payout)
            </h2>
            <p className="text-xs text-slate-500">
              โอนเข้าบัญชี: <strong>{shop?.bankName || "ธนาคาร"}</strong> เลขที่บัญชี: <strong>{shop?.bankAccountNumber || "-"}</strong> ({shop?.bankAccountName || "-"})
            </p>
          </div>
        </div>

        {payoutSuccessMsg && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{payoutSuccessMsg}</span>
          </div>
        )}

        {payoutErrorMsg && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-800 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{payoutErrorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRequestPayout} className="flex flex-wrap items-end gap-3 max-w-xl">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              จำนวนเงินที่ต้องการถอน (บาท)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                ฿
              </span>
              <input
                type="number"
                min="1"
                step="0.01"
                max={wallet.availableBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder={`ระบุจำนวนเงิน (สูงสุด ฿${baht(wallet.availableBalance)})`}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-hidden focus:border-[#0F766E]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmittingPayout || wallet.availableBalance <= 0}
            className="px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-40 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 h-[42px]"
          >
            <ArrowDownCircle size={16} />
            {isSubmittingPayout ? "กำลังส่งคำขอ..." : "ยื่นคำขอถอนเงิน"}
          </button>
        </form>
      </section>

      {/* บัญชีแยกประเภท Ledger (Shop Transactions) */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
              ประวัติรายการบัญชีร้านค้า (Transaction Ledger)
            </h2>
            <p className="text-xs text-slate-500">
              บันทึกรายได้จากยอดขาย (SALE), การหักคอมมิชชัน (COMMISSION), และการถอนเงิน (PAYOUT)
            </p>
          </div>
        </div>

        {wallet.transactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            ยังไม่มีรายการบัญชีในระบบ
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {wallet.transactions.map((tx) => {
              const isPositive = Number(tx.amount) > 0;
              return (
                <div key={tx.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        tx.type === "SALE"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : tx.type === "COMMISSION"
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : "bg-blue-50 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {tx.type}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{tx.description || tx.type}</p>
                      <p className="text-[11px] text-slate-400">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`font-mono text-sm font-extrabold ${isPositive ? "text-emerald-700" : "text-rose-600"}`}>
                    {isPositive ? `+฿${baht(tx.amount)}` : `-฿${baht(Math.abs(tx.amount))}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ประวัติการถอนเงิน (Payout Requests) */}
      {payouts.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
              ประวัติคำขอถอนเงิน (Payout History)
            </h2>
          </div>
          <div className="divide-y divide-slate-100 text-sm">
            {payouts.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-800">
                    {item.note || item.transferReference || `คำขอถอนเงิน #${idx + 1}`}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(item.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-extrabold text-slate-900">
                    ฿{baht(item.amount)}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                      item.status === "TRANSFERRED" || item.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700"
                        : item.status === "REJECTED"
                        ? "bg-rose-50 text-rose-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.status || "PENDING"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
                  const thumb = product.images?.[0]?.url || "/images/placeholder.jpg";
                  const catLabel = CATEGORIES[product.category] || product.category;

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
    </div>
  );
}
