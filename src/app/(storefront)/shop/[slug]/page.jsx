"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { shopService } from "@/services/shop.service";
import { useAuth } from "@/context/AuthContext";
import EditBannerModal from "@/components/seller/EditBannerModal";
import AddProductModal from "@/components/seller/AddProductModal";

/**
 * Shop Profile Page (public)
 * แสดงเฉพาะร้านที่ APPROVED พร้อมสินค้าที่เปิดขาย
 * และหากเป็นเจ้าของร้าน (Seller Owner) จะสามารถ:
 * 1. กดแก้ไข Banner ร้านค้าได้ทันที
 * 2. กดเพิ่มสินค้าใหม่ได้โดยตรง
 */
export default function ShopProfilePage() {
  const params = useParams();
  const slug = params?.slug;

  const { user, shop: currentShop, refresh: refreshAuth } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

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

  // Check if current logged-in user is the owner of this shop
  const isOwner = Boolean(
    user && currentShop && (currentShop.slug === slug || currentShop.id === shop?.id)
  );

  const handleBannerUpdated = (newBannerUrl) => {
    setShop((prev) => (prev ? { ...prev, bannerUrl: newBannerUrl } : prev));
    showToast("✓ อัปเดตแบนเนอร์ร้านค้าเรียบร้อยแล้ว", "success");
    if (refreshAuth) refreshAuth();
  };

  const handleProductCreated = (newProduct) => {
    setShop((prev) => {
      if (!prev) return prev;
      const updatedProducts = [newProduct, ...(prev.products || [])];
      return { ...prev, products: updatedProducts };
    });
    showToast(`✓ เพิ่มสินค้า "${newProduct.name}" สำเร็จ! สินค้าจะแสดงบนหน้าร้านของคุณและหน้าร้านค้ารวมทันที`, "success");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-bold text-neutral-400 font-anuphan">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-3 border-earth-dark/20 border-t-earth-dark rounded-full animate-spin" />
          <span>กำลังโหลดข้อมูลร้านค้า...</span>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center font-anuphan">
        <div className="text-5xl">🏪</div>
        <h1 className="text-2xl font-extrabold text-earth-dark">
          {error || "ไม่พบร้านค้า"}
        </h1>
        <Link
          href="/products"
          className="rounded-full bg-earth-dark px-6 py-2.5 text-sm font-bold text-white hover:bg-earth-olive transition"
        >
          ดูสินค้าทั้งหมดในระบบ
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-6 font-anuphan">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-earth-dark px-5 py-3 text-xs font-bold text-white shadow-xl animate-fadeIn">
          <span>{toast.message}</span>
        </div>
      )}

      {/* Owner Notice Bar */}
      {isOwner && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#556B2F]/10 border border-[#556B2F]/20 px-4 py-2.5 text-xs text-[#556B2F]">
          <div className="flex items-center gap-2">
            <span className="text-base">👑</span>
            <span className="font-bold">คุณกำลังดูหน้าร้านของคุณเองในฐานะเจ้าของร้าน ({shop.name})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBannerModalOpen(true)}
              className="font-bold hover:underline cursor-pointer"
            >
              แก้ไขแบนเนอร์
            </button>
            <span>·</span>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="font-bold hover:underline cursor-pointer"
            >
              + เพิ่มสินค้า
            </button>
            <span>·</span>
            <Link href="/seller" className="font-bold hover:underline">
              Seller Center
            </Link>
          </div>
        </div>
      )}

      {/* Shop Banner & Header Card */}
      <div className="overflow-hidden rounded-3xl border border-earth-border bg-white shadow-sm">
        {/* Banner Area */}
        <div className="relative h-44 sm:h-56 md:h-64 bg-gradient-to-r from-[#EFE7D6] via-[#F8F5EE] to-[#E7EBDD] overflow-hidden group">
          {shop.bannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={shop.bannerUrl}
              alt={`${shop.name} banner`}
              className="h-full w-full object-cover transition duration-300"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400 text-xs font-medium">
              <span>ภาพแบนเนอร์ร้านค้า (คลิก &quot;แก้ไขรูปแบนเนอร์&quot; เพื่อเปลี่ยนภาพ)</span>
            </div>
          )}

          {/* Edit Banner Button (Owner Only) */}
          {isOwner && (
            <button
              type="button"
              onClick={() => setIsBannerModalOpen(true)}
              className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-bold px-4 py-2 backdrop-blur-md transition shadow cursor-pointer z-10 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>แก้ไขรูปแบนเนอร์</span>
            </button>
          )}
        </div>

        {/* Shop Info Row */}
        <div className="flex flex-wrap items-end gap-5 px-6 pb-6">
          <div className="-mt-10 h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-white shadow flex-shrink-0">
            {shop.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={shop.logoUrl}
                alt={shop.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl bg-neutral-50">
                🏪
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 pt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-earth-dark">
                {shop.name}
              </h1>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                ✓ ร้านค้าทางการ (Verified)
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">/shop/{shop.slug}</p>
            {shop.description && (
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-neutral-500 leading-relaxed">
                {shop.description}
              </p>
            )}
          </div>

          {/* Quick Owner Actions */}
          {isOwner && (
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-earth-dark px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-earth-olive transition cursor-pointer"
              >
                <span>+ เพิ่มสินค้าใหม่</span>
              </button>
              <Link
                href="/seller"
                className="flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 shadow-xs hover:bg-neutral-50 transition"
              >
                <span>⚙️ Seller Center</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Products Section Header */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-earth-dark">
            สินค้าทั้งหมด ({shop.products?.length || 0})
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            สินค้าทั้งหมดที่เปิดขายในร้านนี้
          </p>
        </div>

        {isOwner && (
          <button
            type="button"
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-[#7a5b46] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#684c39] transition cursor-pointer"
          >
            <span>+ เพิ่มสินค้า</span>
          </button>
        )}
      </div>

      {/* Products Grid */}
      {(!shop.products || shop.products.length === 0) ? (
        <div className="mt-8 rounded-3xl border border-dashed border-neutral-300 bg-white py-16 text-center text-sm text-neutral-400">
          <div className="text-4xl mb-2">📦</div>
          <p className="font-bold text-neutral-600">ร้านนี้ยังไม่มีสินค้าเปิดขาย</p>
          {isOwner && (
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-earth-dark px-5 py-2 text-xs font-bold text-white hover:bg-earth-olive transition cursor-pointer"
            >
              + เริ่มต้นเพิ่มสินค้าชิ้นแรกของคุณ
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shop.products.map((product) => {
            const displayImage =
              product.images?.[0]?.url ||
              (typeof product.images?.[0] === "string" ? product.images[0] : null) ||
              product.imageUrl ||
              "/images/placeholder.jpg";

            return (
              <Link
                key={product.id}
                href={`/products/${product.name ? product.name.replace(/\s+/g, "-") : product.id}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-earth-border bg-white shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {product.type === "MADE_TO_ORDER" && (
                    <span className="absolute top-2.5 left-2.5 rounded-lg bg-[#7a5b46] px-2 py-1 text-[10px] font-bold text-white shadow">
                      สั่งทำพิเศษ
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      {shop.name}
                    </span>
                    <h3 className="mt-1 truncate text-sm font-bold text-earth-dark group-hover:text-earth-olive transition">
                      {product.name}
                    </h3>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-neutral-100">
                    <p className="text-sm font-extrabold text-[#7a5b46]">
                      ฿{Number(product.price).toLocaleString()}
                    </p>
                    {product.type === "MADE_TO_ORDER" && (
                      <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                        สั่งทำ {product.leadTimeDays || 3} วัน
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Edit Banner Modal */}
      <EditBannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        currentBannerUrl={shop.bannerUrl}
        shopName={shop.name}
        onBannerUpdated={handleBannerUpdated}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductCreated={handleProductCreated}
        shopName={shop.name}
      />
    </div>
  );
}
