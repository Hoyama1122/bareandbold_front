"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { uploadService } from "@/services/upload.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const CATEGORIES = [
  { value: "BRACELET", label: "กำไลข้อมือ" },
  { value: "ANKLET", label: "กำไลข้อเท้า" },
  { value: "RING", label: "แหวน" },
  { value: "NECKLACE", label: "สร้อยคอ" },
];

const TYPES = [
  { value: "READY_TO_SHIP", label: "พร้อมส่ง" },
  { value: "MADE_TO_ORDER", label: "สั่งทำ (Made to Order)" },
];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  stock: "10",
  type: "READY_TO_SHIP",
  category: "BRACELET",
  leadTimeDays: "0",
  wristSizeMin: "",
  wristSizeMax: "",
  isActive: true,
  images: [],
  newImageUrl: "",
};

function baht(n) {
  return Number(n || 0).toLocaleString("th-TH");
}

export default function SellerProductsPage() {
  const { shop, token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [noticeMsg, setNoticeMsg] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal & Form
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [busyProductId, setBusyProductId] = useState(null);

  const getAuthHeaders = useCallback(() => {
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

  const fetchMyProducts = useCallback(async () => {
    if (!shop?.id) return;
    try {
      setLoading(true);
      setErrorMsg("");
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (categoryFilter) params.set("category", categoryFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const queryString = params.toString();
      const url = `${API_URL}/seller/products${queryString ? `?${queryString}` : ""}`;

      const res = await fetch(url, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "โหลดรายการสินค้าของร้านไม่สำเร็จ");
      }
      setProducts(data.products || []);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }, [shop?.id, search, categoryFilter, statusFilter, getAuthHeaders]);

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      originalPrice:
        product.originalPrice != null ? String(product.originalPrice) : "",
      stock: String(product.stock ?? 0),
      type: product.type || "READY_TO_SHIP",
      category: product.category || "BRACELET",
      leadTimeDays: String(product.leadTimeDays ?? 0),
      wristSizeMin:
        product.wristSizeMin != null ? String(product.wristSizeMin) : "",
      wristSizeMax:
        product.wristSizeMax != null ? String(product.wristSizeMax) : "",
      isActive: Boolean(product.isActive),
      images: (product.images || []).map((img) => img.url).filter(Boolean),
      newImageUrl: "",
    });
    setShowModal(true);
  };

  const handleAddImageUrl = () => {
    const trimmed = (form.newImageUrl || "").trim();
    if (!trimmed) return;
    if (form.images.length >= 6) {
      setErrorMsg("เพิ่มรูปได้สูงสุด 6 รูป");
      return;
    }
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, trimmed],
      newImageUrl: "",
    }));
  };

  const handleUploadFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    try {
      setUploadingImg(true);
      setErrorMsg("");
      const remainingSlots = 6 - form.images.length;
      const uploadedUrls = await Promise.all(
        files
          .slice(0, remainingSlots)
          .map((file) => uploadService.uploadFile(file, "products")),
      );

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls.filter(Boolean)].slice(0, 6),
      }));
    } catch (err) {
      setErrorMsg(err.message || "อัปโหลดรูปภาพไม่สำเร็จ");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg("");
      setNoticeMsg("");

      const leadTimeDaysNum = Number(form.leadTimeDays || 0);
      if (form.type === "MADE_TO_ORDER" && leadTimeDaysNum <= 0) {
        throw new Error("สินค้าสั่งทำต้องระบุระยะเวลาผลิตอย่างน้อย 1 วัน");
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        originalPrice:
          form.originalPrice !== "" ? Number(form.originalPrice) : null,
        stock: Number(form.stock),
        type: form.type,
        category: form.category,
        leadTimeDays: leadTimeDaysNum,
        wristSizeMin:
          form.wristSizeMin !== "" ? Number(form.wristSizeMin) : null,
        wristSizeMax:
          form.wristSizeMax !== "" ? Number(form.wristSizeMax) : null,
        isActive: Boolean(form.isActive),
        images: form.images,
      };

      const url = editingId
        ? `${API_URL}/seller/products/${editingId}`
        : `${API_URL}/seller/products`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "บันทึกสินค้าไม่สำเร็จ");
      }

      setShowModal(false);
      setNoticeMsg(
        editingId
          ? "อัปเดตสินค้าเรียบร้อยแล้ว"
          : "เพิ่มสินค้าเรียบร้อยแล้ว และแสดงบนหน้าร้านทันที",
      );
      await fetchMyProducts();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStockAdjust = async (product, delta) => {
    const nextStock = Math.max(0, Number(product.stock || 0) + delta);
    try {
      setBusyProductId(product.id);
      setErrorMsg("");
      const res = await fetch(`${API_URL}/seller/products/${product.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ stock: nextStock }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "ปรับสต็อกไม่สำเร็จ");
      }
      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, stock: nextStock } : item,
        ),
      );
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setBusyProductId(null);
    }
  };

  const handleToggleActive = async (product) => {
    const nextActive = !product.isActive;
    try {
      setBusyProductId(product.id);
      setErrorMsg("");
      const res = await fetch(
        `${API_URL}/seller/products/${product.id}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ isActive: nextActive }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "เปลี่ยนสถานะการขายไม่สำเร็จ");
      }
      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, isActive: nextActive } : item,
        ),
      );
      setNoticeMsg(
        nextActive
          ? `เปิดขาย "${product.name}" บนหน้าร้านแล้ว`
          : `ปิดการขาย "${product.name}" จากหน้าร้านแล้ว`,
      );
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setBusyProductId(null);
    }
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`ยืนยันลบสินค้า "${product.name}" ใช่ไหม?`)) return;
    try {
      setBusyProductId(product.id);
      setErrorMsg("");
      const res = await fetch(`${API_URL}/seller/products/${product.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "ลบสินค้าไม่สำเร็จ");
      }
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      setNoticeMsg("ลบสินค้าเรียบร้อยแล้ว");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setBusyProductId(null);
    }
  };

  const activeCount = products.filter((p) => p.isActive).length;
  const lowStockCount = products.filter(
    (p) => p.type === "READY_TO_SHIP" && Number(p.stock) <= 3,
  ).length;

  return (
    <div className="space-y-5">
      {noticeMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {noticeMsg}
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {errorMsg}
        </div>
      )}

      {/* Main Table Card สไตล์เดียวกับรูป */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs">
        {/* Card Header + Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              จัดการรายการสินค้า ({shop?.name || "ร้านของฉัน"})
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              ทั้งหมด {products.length} รายการ · เปิดขาย {activeCount} รายการ · ใกล้หมด {lowStockCount} รายการ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#0F766E] focus:outline-none"
            >
              <option value="">ทุกหมวดหมู่</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#0F766E] focus:outline-none"
            >
              <option value="ALL">ทุกสถานะ</option>
              <option value="ACTIVE">เปิดขายอยู่</option>
              <option value="INACTIVE">ปิดการขาย</option>
            </select>

            <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อสินค้า..."
                className="w-44 px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none sm:w-52"
              />
              <span className="border-l border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-500">
                🔍
              </span>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1 rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#115E59] cursor-pointer"
            >
              <span>+ เพิ่มสินค้าใหม่</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">
            กำลังโหลดสินค้าของร้าน...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-slate-800">
              ยังไม่มีสินค้าในร้านของคุณ
            </p>
            <p className="mt-1 text-xs text-slate-500">
              กดปุ่ม “+ เพิ่มสินค้าใหม่” เพื่อลงขายสินค้าชิ้นแรกบนหน้าร้านได้เลย
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-[#F8F9FA] text-xs font-bold text-slate-600">
                  <th className="px-5 py-3">รูปภาพ</th>
                  <th className="px-4 py-3">ชื่อสินค้า</th>
                  <th className="px-4 py-3">หมวดหมู่</th>
                  <th className="px-4 py-3">ราคา</th>
                  <th className="px-4 py-3">จำนวนคงเหลือ</th>
                  <th className="px-4 py-3">สถานะ</th>
                  <th className="px-5 py-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => {
                  const thumb =
                    product.images?.[0]?.url || "/images/placeholder.jpg";
                  const isBusy = busyProductId === product.id;
                  const catLabel =
                    CATEGORIES.find((c) => c.value === product.category)
                      ?.label || product.category;
                  const typeLabel =
                    TYPES.find((t) => t.value === product.type)?.label ||
                    product.type;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80">
                      <td className="px-5 py-3.5">
                        <img
                          src={thumb}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                        />
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-bold text-slate-900">
                          {product.name}
                        </p>
                        <p className="line-clamp-1 max-w-xs text-xs text-slate-500">
                          {product.description ||
                            `${typeLabel}${
                              product.type === "MADE_TO_ORDER" &&
                              product.leadTimeDays
                                ? ` (${product.leadTimeDays} วัน)`
                                : ""
                            }`}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-block rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 uppercase">
                          {catLabel}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-extrabold text-slate-900">
                          ฿{baht(product.price)}
                        </p>
                        {product.originalPrice && (
                          <p className="text-xs text-slate-400 line-through">
                            ฿{baht(product.originalPrice)}
                          </p>
                        )}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            disabled={isBusy || Number(product.stock) <= 0}
                            onClick={() => handleQuickStockAdjust(product, -1)}
                            className="h-6 w-6 rounded border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                            {product.stock} ชิ้น
                          </span>
                          <button
                            disabled={isBusy}
                            onClick={() => handleQuickStockAdjust(product, 1)}
                            className="h-6 w-6 rounded border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          disabled={isBusy}
                          onClick={() => handleToggleActive(product)}
                          className={`rounded-md px-2.5 py-1 text-xs font-bold cursor-pointer ${
                            product.isActive
                              ? "bg-teal-50 text-teal-700 hover:bg-teal-100"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {product.isActive ? "เปิดขายอยู่" : "ปิดการขาย"}
                        </button>
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            แก้ไข
                          </button>
                          <button
                            disabled={isBusy}
                            onClick={() => handleDeleteProduct(product)}
                            className="rounded-md border border-rose-200 bg-rose-50/60 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-50 cursor-pointer"
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

        {/* Footer Count */}
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 text-xs text-slate-500">
          <span>
            แสดง {products.length} จากทั้งหมด {products.length} รายการ
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700">
            {products.length} / page
          </span>
        </div>
      </div>

      {/* Modal เพิ่ม/แก้ไขสินค้า */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {editingId ? "แก้ไขข้อมูลสินค้า" : "เพิ่มสินค้าใหม่ลงร้าน"}
                </h2>
                <p className="text-xs text-slate-500">
                  กรอกข้อมูลให้ครบถ้วน ระบบจะอัปเดตขึ้นหน้าร้านทันทีเมื่อเปิดขาย
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg px-3 py-1 text-sm text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  ชื่อสินค้า *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="เช่น กำไลหินโรสควอตซ์แท้"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  รายละเอียดสินค้า
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="อธิบายจุดเด่น วัสดุ หรือคำแนะนำการดูแลรักษา"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    ราคาขาย (บาท) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    ราคาเต็มก่อนลด (ถ้ามี)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.originalPrice}
                    onChange={(e) =>
                      setForm({ ...form, originalPrice: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    จำนวนสต็อก *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    หมวดหมู่ *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    ประเภทสินค้า *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900"
                  >
                    {TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    ระยะเวลาผลิต (วัน)
                    {form.type === "MADE_TO_ORDER" ? " *" : ""}
                  </label>
                  <input
                    type="number"
                    min={form.type === "MADE_TO_ORDER" ? "1" : "0"}
                    step="1"
                    required={form.type === "MADE_TO_ORDER"}
                    value={form.leadTimeDays}
                    onChange={(e) =>
                      setForm({ ...form, leadTimeDays: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    ขนาดรอบข้อมือขั้นต่ำ (ซม.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.wristSizeMin}
                    onChange={(e) =>
                      setForm({ ...form, wristSizeMin: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    ขนาดรอบข้อมือสูงสุด (ซม.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.wristSizeMax}
                    onChange={(e) =>
                      setForm({ ...form, wristSizeMax: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2.5 rounded-xl border border-slate-200 bg-[#F8F9FA] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-700">
                    รูปภาพสินค้า (สูงสุด 6 รูป · รูปแรกเป็นรูปหลัก)
                  </label>
                  <label className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                    {uploadingImg ? "กำลังอัปโหลด..." : "อัปโหลดไฟล์รูป"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={uploadingImg}
                      onChange={handleUploadFiles}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.newImageUrl}
                    onChange={(e) =>
                      setForm({ ...form, newImageUrl: e.target.value })
                    }
                    placeholder="หรือวางลิงก์ URL รูปภาพ (https://...)"
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-bold text-white hover:bg-[#115E59] cursor-pointer"
                  >
                    เพิ่มลิงก์
                  </button>
                </div>

                {form.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2.5">
                    {form.images.map((url, idx) => (
                      <div
                        key={`${url}-${idx}`}
                        className="relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200 bg-white"
                      >
                        <img
                          src={url}
                          alt={`รูปที่ ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute right-1 top-1 rounded bg-slate-900/75 px-1.5 py-0.5 text-[10px] font-bold text-white cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded accent-[#0F766E]"
                />
                เปิดขายทันทีบนหน้าร้านหลัก
              </label>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImg}
                  className="rounded-lg bg-[#0F766E] px-6 py-2 text-xs font-bold text-white hover:bg-[#115E59] disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "กำลังบันทึก..." : "บันทึกสินค้า"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}