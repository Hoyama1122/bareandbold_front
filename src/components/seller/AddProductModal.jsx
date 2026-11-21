"use client";

import React, { useState } from "react";
import { productService } from "@/services/product.service";
import { uploadService } from "@/services/upload.service";

const SAMPLE_JEWELRY_IMAGES = [
  {
    name: "กำไลหินมงคลสีฟ้า (Turquoise)",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "สร้อยข้อเท้าเปลือกหอย & ลูกปัด",
    url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "กำไลหินโรสควอตซ์สีชมพู",
    url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "กำไลหินนิลดำ Onyx ลุคพรีเมียม",
    url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "สร้อยข้อมือเงินแท้ Minimalist",
    url: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=600&auto=format&fit=crop",
  },
];

export default function AddProductModal({
  isOpen,
  onClose,
  onProductCreated,
  shopName = "ร้านค้าของคุณ",
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("BRACELET");
  const [type, setType] = useState("READY_TO_SHIP");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [leadTimeDays, setLeadTimeDays] = useState("3");
  const [images, setImages] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Custom Options state
  const [customOptions, setCustomOptions] = useState([]);
  const [newOptionName, setNewOptionName] = useState("");
  const [newOptionValues, setNewOptionValues] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      let url = "";
      try {
        url = await uploadService.uploadFile(file, "products");
      } catch (err) {
        console.warn("Upload service fallback:", err);
      }
      if (!url) {
        url = URL.createObjectURL(file);
      }
      if (url) {
        setImages((prev) => [...prev, url]);
      }
    } catch (err) {
      setError("ไม่สามารถอัปโหลดรูปภาพได้: " + (err.message || ""));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    setImages((prev) => [...prev, trimmed]);
    setImageUrlInput("");
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddCustomOption = () => {
    const optName = newOptionName.trim();
    if (!optName) return;

    const rawValues = newOptionValues
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    if (rawValues.length === 0) {
      setError("กรุณากรอกตัวเลือกอย่างน้อย 1 ค่า (คั่นด้วยเครื่องหมายจุลภาค ,)");
      return;
    }

    const formattedValues = rawValues.map((val) => ({
      name: val,
      value: val,
      priceAdjustment: 0,
    }));

    setCustomOptions((prev) => {
      const existingIdx = prev.findIndex(
        (o) => o.name.toLowerCase() === optName.toLowerCase()
      );

      if (existingIdx > -1) {
        // Option already exists -> merge new values avoiding duplicates
        const updated = [...prev];
        const existingValues = updated[existingIdx].values || [];
        const existingValNames = new Set(existingValues.map((v) => v.name || v.value));
        const merged = [...existingValues];

        formattedValues.forEach((fv) => {
          if (!existingValNames.has(fv.name)) {
            merged.push(fv);
            existingValNames.add(fv.name);
          }
        });

        updated[existingIdx] = {
          ...updated[existingIdx],
          values: merged,
        };
        return updated;
      }

      // New option
      return [
        ...prev,
        {
          id: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: optName,
          isRequired: true,
          values: formattedValues,
        },
      ];
    });

    setNewOptionName("");
    setNewOptionValues("");
    setError("");
  };

  const handleRemoveCustomOption = (indexToRemove) => {
    setCustomOptions((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("กรุณาระบุชื่อสินค้า");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("กรุณาระบุราคาขายที่ถูกต้อง (เป็นตัวเลข 0 ขึ้นไป)");
      return;
    }

    let parsedOriginalPrice = null;
    if (originalPrice && originalPrice.trim() !== "") {
      parsedOriginalPrice = parseFloat(originalPrice);
      if (isNaN(parsedOriginalPrice) || parsedOriginalPrice <= parsedPrice) {
        setError("ราคาเต็มก่อนลดต้องมากกว่าราคาขายจริง");
        return;
      }
    }

    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setError("กรุณาระบุจำนวนสต็อกที่ถูกต้อง");
      return;
    }

    const parsedLeadTime = type === "MADE_TO_ORDER" ? Math.max(1, parseInt(leadTimeDays, 10) || 1) : 0;

    const finalImages = images.length > 0 ? images : [SAMPLE_JEWELRY_IMAGES[0].url];

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      category,
      type,
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      stock: parsedStock,
      leadTimeDays: parsedLeadTime,
      images: finalImages,
      customOptions: customOptions.length > 0 ? customOptions : undefined,
    };

    setSaving(true);
    try {
      const res = await productService.createProduct(payload);
      if (onProductCreated) {
        onProductCreated(res.product || res);
      }
      onClose();
    } catch (err) {
      console.error("Failed to create product:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการสร้างสินค้า");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-anuphan animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-scaleUp flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 flex-shrink-0">
          <div>
            <h3 className="text-lg font-extrabold text-earth-dark">
              + เพิ่มสินค้าใหม่สำหรับร้านของคุณ
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              ร้าน {shopName} · สินค้าจะแสดงบนหน้าร้านของคุณและหน้าร้านค้ารวมทันที
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 flex items-center justify-center transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* 1. Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a5b46]">
              1. ข้อมูลพื้นฐานสินค้า
            </h4>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                ชื่อสินค้า <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น กำไลข้อมือหินอเมทิสต์แท้ เสริมสมาธิ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-hidden focus:border-[#7a5b46] focus:ring-1 focus:ring-[#7a5b46]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  หมวดหมู่สินค้า <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-hidden focus:border-[#7a5b46] bg-white cursor-pointer"
                >
                  <option value="BRACELET">กำไลข้อมือ (Bracelet)</option>
                  <option value="ANKLET">กำไลข้อเท้า (Anklet)</option>
                  <option value="RING">แหวน (Ring)</option>
                  <option value="NECKLACE">สร้อยคอ (Necklace)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  ประเภทสินค้า <span className="text-rose-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-hidden focus:border-[#7a5b46] bg-white cursor-pointer"
                >
                  <option value="READY_TO_SHIP">สินค้าพร้อมส่ง (Ready to Ship)</option>
                  <option value="MADE_TO_ORDER">สินค้าสั่งทำพิเศษ (Made to Order / Custom)</option>
                </select>
              </div>
            </div>

            {type === "MADE_TO_ORDER" && (
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80">
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  ระยะเวลาผลิตสั่งทำ (วัน) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(e.target.value)}
                  className="w-32 px-4 py-2 rounded-xl border border-amber-300 text-xs text-neutral-800 bg-white"
                />
                <p className="text-[11px] text-amber-700 mt-1">
                  ลูกค้าจะเห็นป้าย “สั่งทำ {leadTimeDays} วัน” และต้องเลือกตัวเลือกก่อนสั่งซื้อ
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                รายละเอียดสินค้า
              </label>
              <textarea
                rows={3}
                placeholder="ระบุวัสดุ อัญมณี หรือคำแนะนำการดูแลรักษา..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-hidden focus:border-[#7a5b46]"
              />
            </div>
          </div>

          {/* 2. Pricing & Stock */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a5b46]">
              2. ราคาและสต็อก
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  ราคาขายจริง (฿) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  placeholder="เช่น 890"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 font-bold focus:outline-hidden focus:border-[#7a5b46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  ราคาปกติก่อนลด (฿)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="เช่น 1290 (ไม่บังคับ)"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-hidden focus:border-[#7a5b46]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  จำนวนในคลัง (ชิ้น) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-hidden focus:border-[#7a5b46]"
                />
              </div>
            </div>
          </div>

          {/* 3. Product Images */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a5b46]">
              3. รูปภาพสินค้า
            </h4>

            {/* Upload & URL Input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition cursor-pointer border border-neutral-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span>📁 อัปโหลดรูปภาพ</span>
                {uploadingImage && <span className="w-3 h-3 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin" />}
              </label>

              <div className="flex-1 flex gap-2">
                <input
                  type="url"
                  placeholder="หรือวาง URL รูปภาพ (https://...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-hidden focus:border-[#7a5b46]"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-white text-xs font-bold hover:bg-black transition cursor-pointer"
                >
                  เพิ่ม URL
                </button>
              </div>
            </div>

            {/* Presets shortcut */}
            <div>
              <p className="text-[11px] text-neutral-500 font-medium mb-1.5">
                หรือคลิกเลือกรูปภาพตัวอย่างเครื่องประดับสไตล์ BARE &amp; BOLD:
              </p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_JEWELRY_IMAGES.map((sample, sIdx) => (
                  <button
                    key={`sample-jewel-${sIdx}-${sample.name}`}
                    type="button"
                    onClick={() => {
                      if (!images.includes(sample.url)) {
                        setImages((prev) => [...prev, sample.url]);
                      }
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200 hover:border-[#7a5b46] bg-white text-[11px] text-neutral-600 hover:text-[#7a5b46] transition cursor-pointer"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sample.url} alt="" className="w-4 h-4 rounded-full object-cover" />
                    <span>+ {sample.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview List */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={`preview-${idx}`}
                    className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 shadow-xs group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 bg-[#556B2F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        ภาพหน้าปก
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition cursor-pointer shadow"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Custom Options (Optional) */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a5b46]">
                4. ตัวเลือกสินค้า / คัสตอม (Custom Options)
              </h4>
              <span className="text-[11px] text-neutral-400">สำหรับให้ลูกค้าเลือกขนาดหรือสี</span>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    ชื่อตัวเลือก
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ขนาดความยาวข้อมือ หรือ สีหิน"
                    value={newOptionName}
                    onChange={(e) => setNewOptionName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    รายการค่าตัวเลือก (คั่นด้วย ,)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น 14 cm, 15 cm, 16 cm, 17 cm"
                    value={newOptionValues}
                    onChange={(e) => setNewOptionValues(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs bg-white"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddCustomOption}
                className="w-full py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold transition cursor-pointer"
              >
                + เพิ่มตัวเลือกนี้ในสินค้า
              </button>
            </div>

            {/* List of custom options added */}
            {customOptions.length > 0 && (
              <div className="space-y-2">
                {customOptions.map((opt, optIdx) => (
                  <div
                    key={opt.id || `custom-opt-${optIdx}-${opt.name}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200 shadow-xs"
                  >
                    <div>
                      <p className="text-xs font-bold text-neutral-800">{opt.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {opt.values?.map((v, vIdx) => (
                          <span
                            key={`val-${optIdx}-${vIdx}-${v.name || v.value}`}
                            className="bg-neutral-100 text-neutral-600 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {v.name || v.value}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomOption(optIdx)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-xs font-bold transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#7a5b46] hover:bg-[#684c39] disabled:opacity-50 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>กำลังบันทึกสินค้า...</span>
                </>
              ) : (
                <span>✓ บันทึกและเปิดขายสินค้า</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
