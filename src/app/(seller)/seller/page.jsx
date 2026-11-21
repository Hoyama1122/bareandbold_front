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

export default function SellerHomePage() {
  const { shop, token } = useAuth();
  const [stats, setStats] = useState({
    productCount: 0,
    activeProductCount: 0,
    lowStockCount: 0,
    balance: 0,
  });
  const [myProducts, setMyProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const getHeaders = useCallback(() => {
    const storedToken =
      token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("bare_auth_token") ||
          localStorage.getItem("token")
        : null);
    return storedToken ? { Authorization: `Bearer ${storedToken}` } : {};
  }, [token]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/seller/dashboard`, {
          headers: getHeaders(),
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.success && data.dashboard) {
          setStats((prev) => ({ ...prev, ...data.dashboard }));
        }
      } catch {
        // คงค่าเริ่มต้นไว้หากยังไม่มีข้อมูล
      }
    };
    loadDashboard();
  }, [getHeaders]);

  useEffect(() => {
    if (!shop?.id) return;
    let cancelled = false;

    const loadMyProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch(`${API_URL}/seller/products`, {
          headers: getHeaders(),
          credentials: "include",
        });
        const data = await res.json();
        if (!cancelled && res.ok && data.success) {
          setMyProducts(data.products || []);
        }
      } catch {
        // คงรายการว่างไว้หากโหลดไม่ได้
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    };

    loadMyProducts();
    return () => {
      cancelled = true;
    };
  }, [shop?.id, getHeaders]);

  const kpiCards = [
    {
      label: "สินค้าทั้งหมดในร้าน",
      value: stats.productCount ?? myProducts.length,
      sub: "จำนวนรายการสินค้าในร้าน",
      badge: "PRODUCTS",
      badgeClass: "bg-slate-100 text-slate-700",
    },
    {
      label: "กำลังเปิดขายบนหน้าร้าน",
      value:
        stats.activeProductCount ??
        myProducts.filter((p) => p.isActive).length,
      sub: "แสดงบน Storefront ทันที",
      badge: "ACTIVE",
      badgeClass: "bg-teal-50 text-teal-700",
    },
    {
      label: "สต็อกพร้อมส่งใกล้หมด (≤ 3)",
      value: stats.lowStockCount ?? 0,
      sub: "ควรเติมสต็อกเพิ่มเติม",
      badge: "LOW STOCK",
      badgeClass: "bg-amber-50 text-amber-700",
    },
    {
      label: "ยอดเงินคงเหลือของร้าน",
      value: `฿${baht(stats.balance)}`,
      sub: "ยอดเงินรับสุทธิของร้านค้า",
      badge: "WALLET",
      badgeClass: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards แถวบน ขนาดใหญ่ชัดแบบรูปที่ 2 */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-slate-600 sm:text-[15px]">
                {card.label}
              </p>
              <span
                className={`rounded-md px-2.5 py-1 text-[11px] font-extrabold ${card.badgeClass}`}
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

      {/* กล่องศูนย์จัดการร้านค้า + รายการสินค้าในร้านตัวเอง */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              ศูนย์จัดการร้านค้า · {shop?.name || "MY SHOP"}
            </h2>
            <p className="mt-1 text-sm text-slate-600 sm:text-[15px]">
              รายการสินค้าที่คุณเพิ่มไว้ในร้านตัวเอง สามารถกดไปเพิ่ม แก้ไข ปรับสต็อก หรือเปิด-ปิดการขายได้ทันที
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/seller/products"
              className="inline-flex items-center justify-center rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-bold text-white shadow-xs transition hover:bg-[#115E59]"
            >
              + จัดการสินค้าทั้งหมด
            </Link>
            <Link
              href="/seller/shop"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              ข้อมูลร้านและบัญชีรับเงิน
            </Link>
          </div>
        </div>

        {/* ตารางรายการสินค้าที่เพิ่มไว้ในร้านตัวเอง */}
        <div className="mt-5">
          {loadingProducts ? (
            <div className="rounded-xl border border-slate-100 bg-[#F8F9FA] p-10 text-center text-sm font-medium text-slate-500 sm:text-base">
              กำลังโหลดรายการสินค้าในร้าน...
            </div>
          ) : myProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-[#F8F9FA] p-10 text-center">
              <p className="text-base font-extrabold text-slate-800">
                ยังไม่มีสินค้าที่เพิ่มไว้ในร้านนี้
              </p>
              <p className="mt-1 text-sm text-slate-500">
                ไปที่หน้าจัดการสินค้าเพื่อเพิ่มสินค้าชิ้นแรกของร้านคุณได้เลย
              </p>
              <Link
                href="/seller/products"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#115E59]"
              >
                + เพิ่มสินค้าใหม่
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#F8F9FA] text-xs font-extrabold text-slate-600 sm:text-sm">
                    <th className="px-5 py-3.5">รูปภาพ</th>
                    <th className="px-4 py-3.5">ชื่อสินค้า</th>
                    <th className="px-4 py-3.5">หมวดหมู่</th>
                    <th className="px-4 py-3.5">ราคา</th>
                    <th className="px-4 py-3.5">คงเหลือ</th>
                    <th className="px-4 py-3.5">สถานะหน้าร้าน</th>
                    <th className="px-5 py-3.5 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm sm:text-[15px]">
                  {myProducts.map((product) => {
                    const thumb =
                      product.images?.[0]?.url || "/images/placeholder.jpg";
                    const catLabel =
                      CATEGORIES[product.category] || product.category;

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/80">
                        <td className="px-5 py-3.5">
                          <img
                            src={thumb}
                            alt={product.name}
                            className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-base font-extrabold text-slate-900">
                            {product.name}
                          </p>
                          {product.description && (
                            <p className="line-clamp-1 max-w-md text-xs text-slate-500 sm:text-sm">
                              {product.description}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-block rounded-md bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 sm:text-sm">
                            {catLabel}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-base font-extrabold text-slate-900">
                            ฿{baht(product.price)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-block rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 sm:text-sm">
                            {product.stock} ชิ้น
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-bold sm:text-sm ${
                              product.isActive
                                ? "bg-teal-50 text-teal-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {product.isActive ? "เปิดขายอยู่" : "ปิดการขาย"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <Link
                            href="/seller/products"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 sm:text-sm"
                          >
                            แก้ไข / จัดการ →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}