"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { shopService } from "@/services/shop.service";

/**
 * Shop Profile Page (public)
 * แสดงเฉพาะร้านที่ APPROVED พร้อมสินค้าที่เปิดขาย
 * ข้อมูลถูกกรองฝั่ง backend แล้ว ไม่ต้องตรวจสถานะซ้ำที่นี่
 */
export default function ShopProfilePage() {
  const params = useParams();
  const slug = params?.slug;

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    shopService
      .getBySlug(slug)
      .then((res) => {
        if (!cancelled) setShop(res.shop);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "ไม่พบร้านค้า");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-bold text-neutral-400">
        กำลังโหลดร้านค้า...
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="text-5xl">🏪</div>
        <h1 className="text-2xl font-extrabold text-earth-dark">
          {error || "ไม่พบร้านค้า"}
        </h1>
        <Link
          href="/products"
          className="rounded-full bg-earth-dark px-6 py-2.5 text-sm font-bold text-white"
        >
          ดูสินค้าทั้งหมด
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-6">
      <div className="overflow-hidden rounded-3xl border border-earth-border bg-white shadow-sm">
        <div className="h-40 bg-gradient-to-r from-[#EFE7D6] via-[#F8F5EE] to-[#E7EBDD] md:h-52">
          {shop.bannerUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={shop.bannerUrl}
              alt={`${shop.name} banner`}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-wrap items-end gap-4 px-6 pb-6">
          <div className="-mt-10 h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-white shadow">
            {shop.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={shop.logoUrl}
                alt={shop.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl">
                🏪
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 pt-3">
            <h1 className="text-2xl font-extrabold text-earth-dark">
              {shop.name}
            </h1>
            <p className="text-xs text-neutral-400">/shop/{shop.slug}</p>
            {shop.description && (
              <p className="mt-2 max-w-2xl text-sm text-neutral-500">
                {shop.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-earth-dark">
          สินค้าทั้งหมด ({shop.products?.length || 0})
        </h2>
      </div>

      {shop.products?.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center text-sm text-neutral-400">
          ร้านนี้ยังไม่มีสินค้า
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {shop.products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group overflow-hidden rounded-2xl border border-earth-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-neutral-100">
                {product.images?.[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl">
                    💍
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="truncate text-sm font-bold text-earth-dark">
                  {product.name}
                </p>
                <p className="mt-1 text-sm font-extrabold text-earth-olive">
                  ฿{Number(product.price).toLocaleString()}
                </p>
                {product.type === "MADE_TO_ORDER" && (
                  <span className="mt-2 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    สั่งทำ {product.leadTimeDays} วัน
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
