"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { shopService } from "@/services/shop.service";
import { productService } from "@/services/product.service";
import EditBannerModal from "@/components/seller/EditBannerModal";
import AddProductModal from "@/components/seller/AddProductModal";

export default function SellerHomePage() {
  const { user, shop, refresh: refreshAuth } = useAuth();

  const [activeTab, setActiveTab] = useState("products"); // 'products' | 'shop'
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Shop editing state
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopLogoUrl, setShopLogoUrl] = useState("");
  const [shopBannerUrl, setShopBannerUrl] = useState("");
  const [savingShop, setSavingShop] = useState(false);

  // Modals
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  // Sync shop state when shop loads
  useEffect(() => {
    if (shop) {
      setShopName(shop.name || "");
      setShopDescription(shop.description || "");
      setShopLogoUrl(shop.logoUrl || "");
      setShopBannerUrl(shop.bannerUrl || "");
    }
  }, [shop]);

  // Load seller products
  const fetchSellerProducts = async () => {
    if (!shop) return;
    setLoadingProducts(true);
    try {
      // First try fetching seller specific products endpoint
      let list = [];
      try {
        const res = await productService.getMyProducts();
        if (res.success && res.products) {
          list = res.products;
        }
      } catch (e) {
        console.warn("Seller products endpoint error, falling back to shop query:", e);
      }

      // Fallback: fetch shop by slug to retrieve attached products
      if (list.length === 0 && shop.slug) {
        try {
          const shopRes = await shopService.getBySlug(shop.slug);
          if (shopRes.shop?.products) {
            list = shopRes.shop.products;
          }
        } catch (e) {
          console.warn("Fallback to getBySlug failed:", e);
        }
      }

      setProducts(list);
    } catch (err) {
      console.error("Failed to fetch seller products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, [shop]);

  const handleBannerUpdated = (newBannerUrl) => {
    setShopBannerUrl(newBannerUrl);
    showToast("✓ อัปเดตแบนเนอร์ร้านค้าเรียบร้อยแล้ว", "success");
    if (refreshAuth) refreshAuth();
  };

  const handleProductCreated = (newProd) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`✓ เพิ่มสินค้า "${newProd.name}" สำเร็จ! สินค้าจะแสดงบนหน้าร้านค้าของคุณและหน้าร้านค้ารวมทันที`, "success");
    fetchSellerProducts();
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "${productName}"?`)) {
      return;
    }
    try {
      await productService.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast("ลบสินค้าเรียบร้อยแล้ว", "success");
    } catch (err) {
      console.error("Delete product error:", err);
      showToast(err.message || "ไม่สามารถลบสินค้าได้", "error");
    }
  };

  const handleToggleProductStatus = async (productId) => {
    try {
      await productService.toggleProductStatus(productId);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isActive: !p.isActive } : p))
      );
      showToast("ปรับสถานะการเปิดขายสินค้าเรียบร้อยแล้ว", "success");
    } catch (err) {
      console.error("Toggle status error:", err);
      showToast(err.message || "ไม่สามารถเปลี่ยนสถานะสินค้าได้", "error");
    }
  };

  const handleSaveShopInfo = async (e) => {
    e.preventDefault();
    setSavingShop(true);
    try {
      await shopService.update({
        name: shopName.trim(),
        description: shopDescription.trim(),
        logoUrl: shopLogoUrl.trim() || null,
        bannerUrl: shopBannerUrl.trim() || null,
      });
      showToast("✓ บันทึกข้อมูลร้านค้าเรียบร้อยแล้ว", "success");
      if (refreshAuth) refreshAuth();
    } catch (err) {
      console.error("Update shop error:", err);
      showToast(err.message || "ไม่สามารถบันทึกข้อมูลร้านค้าได้", "error");
    } finally {
      setSavingShop(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || p.category?.toUpperCase() === categoryFilter;
    const matchType = typeFilter === "all" || p.type === typeFilter;
    return matchSearch && matchCat && matchType;
  });

  const totalCount = products.length;
  const activeCount = products.filter((p) => p.isActive !== false).length;
  const readyCount = products.filter((p) => p.type === "READY_TO_SHIP").length;
  const customCount = products.filter((p) => p.type === "MADE_TO_ORDER").length;

  return (
    <div className="space-y-6 font-anuphan">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-earth-dark px-5 py-3 text-xs font-bold text-white shadow-xl animate-fadeIn">
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Welcome & Shop Summary Card */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-neutral-100 bg-neutral-50 shadow-inner flex-shrink-0">
              {shopBannerUrl || shop?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shop?.logoUrl || shopBannerUrl}
                  alt={shop?.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl">
                  🏪
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-earth-dark">
                  {shop?.name || "ร้านค้าของคุณ"}
                </h1>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  {shop?.status === "APPROVED" ? "✓ ได้รับอนุมัติแล้ว" : shop?.status}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                URL ร้าน: /shop/{shop?.slug} · เจ้าของร้าน: {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsBannerModalOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-[#7a5b46] bg-white px-4 py-2 text-xs font-bold text-[#7a5b46] hover:bg-[#7a5b46]/5 transition cursor-pointer"
            >
              <span>🖼️ แก้ไข Banner ร้าน</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-earth-dark px-4 py-2 text-xs font-bold text-white hover:bg-earth-olive transition shadow-xs cursor-pointer"
            >
              <span>+ เพิ่มสินค้าใหม่</span>
            </button>
            <Link
              href={`/shop/${shop?.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
            >
              <span>🌐 ดูหน้าร้านของฉัน</span>
              <span className="text-[10px]">↗</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "สินค้าทั้งหมด", value: totalCount, icon: "📦", color: "text-earth-dark" },
          { label: "เปิดขายอยู่", value: activeCount, icon: "🟢", color: "text-emerald-700" },
          { label: "สินค้าพร้อมส่ง", value: readyCount, icon: "⚡", color: "text-neutral-700" },
          { label: "สินค้าสั่งทำ (Custom)", value: customCount, icon: "✨", color: "text-amber-800" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-neutral-400">{item.label}</p>
              <p className={`text-2xl font-black mt-1 ${item.color}`}>{item.value}</p>
            </div>
            <span className="text-3xl">{item.icon}</span>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-neutral-200 bg-white rounded-t-2xl px-6 pt-3 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
            activeTab === "products"
              ? "border-[#7a5b46] text-[#7a5b46]"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          <span>📦 จัดการสินค้า ({totalCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("shop")}
          className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
            activeTab === "shop"
              ? "border-[#7a5b46] text-[#7a5b46]"
              : "border-transparent text-neutral-400 hover:text-neutral-600"
          }`}
        >
          <span>🎨 ข้อมูลร้านค้า &amp; แบนเนอร์ (Shop &amp; Banner)</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === "products" && (
        <div className="rounded-b-2xl border border-neutral-200 bg-white p-6 shadow-xs -mt-6 space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="ค้นหาชื่อสินค้าของคุณ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-hidden focus:border-[#7a5b46]"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-between md:justify-end">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-white cursor-pointer"
              >
                <option value="all">ทุกหมวดหมู่</option>
                <option value="BRACELET">กำไลข้อมือ (Bracelet)</option>
                <option value="ANKLET">กำไลข้อเท้า (Anklet)</option>
                <option value="RING">แหวน (Ring)</option>
                <option value="NECKLACE">สร้อยคอ (Necklace)</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-neutral-200 text-xs bg-white cursor-pointer"
              >
                <option value="all">ทุกประเภท</option>
                <option value="READY_TO_SHIP">พร้อมส่ง</option>
                <option value="MADE_TO_ORDER">สั่งทำพิเศษ (Custom)</option>
              </select>

              <button
                type="button"
                onClick={() => setIsAddProductOpen(true)}
                className="rounded-xl bg-[#7a5b46] hover:bg-[#684c39] px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <span>+ เพิ่มสินค้าใหม่</span>
              </button>
            </div>
          </div>

          {/* Products List Table */}
          {loadingProducts ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-bold">
              กำลังโหลดรายการสินค้า...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 py-16 text-center text-sm text-neutral-400">
              <div className="text-4xl mb-2">🏷️</div>
              <p className="font-bold text-neutral-600">ไม่พบสินค้าในรายการ</p>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-earth-dark px-4 py-2 text-xs font-bold text-white hover:bg-earth-olive transition cursor-pointer"
              >
                + เพิ่มสินค้าชิ้นแรกเลย
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-600">
                <thead className="border-b border-neutral-100 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  <tr>
                    <th className="py-3.5 px-4">รูปภาพ</th>
                    <th className="py-3.5 px-4">ชื่อสินค้า</th>
                    <th className="py-3.5 px-4">หมวดหมู่</th>
                    <th className="py-3.5 px-4">ประเภท</th>
                    <th className="py-3.5 px-4">ราคาขาย</th>
                    <th className="py-3.5 px-4">สต็อก</th>
                    <th className="py-3.5 px-4">สถานะขาย</th>
                    <th className="py-3.5 px-4 text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {filteredProducts.map((p) => {
                    const imgUrl =
                      p.images?.[0]?.url ||
                      (typeof p.images?.[0] === "string" ? p.images[0] : null) ||
                      p.imageUrl ||
                      "/images/placeholder.jpg";

                    const isActive = p.isActive !== false;

                    return (
                      <tr key={p.id} className="hover:bg-neutral-50/50 transition">
                        <td className="py-3 px-4">
                          <div className="h-12 w-12 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imgUrl} alt={p.name} className="h-full w-full object-cover" />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-earth-dark max-w-xs truncate">{p.name}</p>
                          <span className="text-[10px] text-neutral-400">ID: {p.id.slice(0, 8)}...</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold">{p.category || "BRACELET"}</span>
                        </td>
                        <td className="py-3 px-4">
                          {p.type === "MADE_TO_ORDER" ? (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200/50">
                              สั่งทำ {p.leadTimeDays || 3} วัน
                            </span>
                          ) : (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/50">
                              พร้อมส่ง
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-earth-dark">
                          ฿{Number(p.price).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-semibold">{p.stock ?? 0} ชิ้น</td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleProductStatus(p.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                              isActive
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                            }`}
                          >
                            {isActive ? "✓ กำลังเปิดขาย" : "พักการขาย"}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/products/${p.name ? p.name.replace(/\s+/g, "-") : p.id}`}
                              target="_blank"
                              className="px-2.5 py-1 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-[11px] font-bold text-neutral-600 transition"
                            >
                              ดูหน้าร้าน
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-bold transition cursor-pointer"
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
        </div>
      )}

      {/* TAB 2: SHOP & BANNER SETTINGS */}
      {activeTab === "shop" && (
        <form
          onSubmit={handleSaveShopInfo}
          className="rounded-b-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-xs -mt-6 space-y-6"
        >
          {/* Banner Setting Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-earth-dark">
                  แบนเนอร์ร้านค้า (Shop Banner)
                </h3>
                <p className="text-xs text-neutral-400">
                  รูปภาพแบนเนอร์ด้านบนสุดที่จะแสดงบนหน้าร้านค้าของคุณ (/shop/{shop?.slug})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#7a5b46] hover:bg-[#684c39] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>📷 แก้ไขรูปแบนเนอร์</span>
              </button>
            </div>

            {/* Banner Preview */}
            <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-neutral-200 bg-gradient-to-r from-[#EFE7D6] via-[#F8F5EE] to-[#E7EBDD] group">
              {shopBannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shopBannerUrl}
                  alt="Shop banner"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                  ยังไม่ได้ตั้งค่าแบนเนอร์ (คลิกปุ่ม &quot;แก้ไขรูปแบนเนอร์&quot; ด้านบนเพื่อเลือกภาพ)
                </div>
              )}
            </div>
          </div>

          {/* Shop Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-neutral-100">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                ชื่อร้านค้า <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-hidden focus:border-[#7a5b46]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                URL Slug ร้านค้า (ไม่สามารถเปลี่ยนได้หลังอนุมัติ)
              </label>
              <input
                type="text"
                disabled
                value={shop?.slug || ""}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-400 bg-neutral-50 cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                คำอธิบายร้านค้า
              </label>
              <textarea
                rows={3}
                value={shopDescription}
                onChange={(e) => setShopDescription(e.target.value)}
                placeholder="อธิบายสไตล์ร้าน เอกลักษณ์ของเครื่องประดับ หรือบริการสั่งทำ..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-hidden focus:border-[#7a5b46]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                URL โลโก้ร้านค้า (Logo URL)
              </label>
              <input
                type="url"
                value={shopLogoUrl}
                onChange={(e) => setShopLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.jpg"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-hidden focus:border-[#7a5b46]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                URL แบนเนอร์ร้านค้า (Banner URL)
              </label>
              <input
                type="url"
                value={shopBannerUrl}
                onChange={(e) => setShopBannerUrl(e.target.value)}
                placeholder="https://example.com/banner.jpg"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-hidden focus:border-[#7a5b46]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-neutral-100">
            <button
              type="submit"
              disabled={savingShop}
              className="px-6 py-2.5 rounded-full bg-earth-dark hover:bg-earth-olive text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-2"
            >
              {savingShop ? "กำลังบันทึก..." : "✓ บันทึกการเปลี่ยนแปลงข้อมูลร้าน"}
            </button>
          </div>
        </form>
      )}

      {/* Edit Banner Modal */}
      <EditBannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        currentBannerUrl={shopBannerUrl}
        shopName={shop?.name}
        onBannerUpdated={handleBannerUpdated}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductCreated={handleProductCreated}
        shopName={shop?.name}
      />
    </div>
  );
}
