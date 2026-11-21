"use client";

import React, { useState, useEffect } from "react";
import { uploadService } from "@/services/upload.service";
import { shopService } from "@/services/shop.service";

const PRESET_BANNERS = [
  {
    name: "Golden Hour Dune (หาดทรายทอง)",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    color: "#D9C3A5",
  },
  {
    name: "Sage Earth Botanical (ใบไม้มินิมอล)",
    url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80",
    color: "#A3B19B",
  },
  {
    name: "Boho Terracotta Clay (เอิร์ธโทนดินเผา)",
    url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    color: "#C48A69",
  },
  {
    name: "Shell & Ocean Breeze (คลื่นทะเลมินิมอล)",
    url: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1600&q=80",
    color: "#7DA5B3",
  },
  {
    name: "Marble Texture (หินอ่อนธรรมชาติ)",
    url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1600&q=80",
    color: "#DDD6CC",
  },
];

export default function EditBannerModal({
  isOpen,
  onClose,
  currentBannerUrl,
  shopName = "ร้านค้าของคุณ",
  onBannerUpdated,
}) {
  const [selectedUrl, setSelectedUrl] = useState(currentBannerUrl || "");
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("upload"); // 'upload' | 'url' | 'preset'

  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentBannerUrl || "");
      setCustomUrlInput(currentBannerUrl || "");
      setSelectedFile(null);
      setFilePreview("");
      setError("");
    }
  }, [isOpen, currentBannerUrl]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("ขนาดไฟล์ต้องไม่เกิน 5MB");
        return;
      }
      setSelectedFile(file);
      setError("");
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    }
  };

  const previewDisplayUrl =
    mode === "upload" && filePreview
      ? filePreview
      : mode === "url" && customUrlInput.trim()
      ? customUrlInput.trim()
      : selectedUrl;

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      let finalBannerUrl = selectedUrl;

      if (mode === "upload" && selectedFile) {
        try {
          const uploadedUrl = await uploadService.uploadFile(selectedFile, "shops");
          if (uploadedUrl) {
            finalBannerUrl = uploadedUrl;
          } else if (filePreview) {
            // fallback if mock/offline
            finalBannerUrl = filePreview;
          }
        } catch (uploadErr) {
          console.warn("Upload service error, using preview url as fallback:", uploadErr);
          if (filePreview) {
            finalBannerUrl = filePreview;
          } else {
            throw new Error("ไม่สามารถอัปโหลดไฟล์รูปภาพได้");
          }
        }
      } else if (mode === "url") {
        if (!customUrlInput.trim()) {
          throw new Error("กรุณากรอก URL รูปภาพ");
        }
        finalBannerUrl = customUrlInput.trim();
      }

      // Update shop banner in backend
      await shopService.update({ bannerUrl: finalBannerUrl });

      if (onBannerUpdated) {
        onBannerUpdated(finalBannerUrl);
      }

      onClose();
    } catch (err) {
      console.error("Failed to update banner:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการบันทึกแบนเนอร์");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-anuphan animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
          <div>
            <h3 className="text-lg font-extrabold text-earth-dark">
              แก้ไขแบนเนอร์ร้านค้า (Shop Banner)
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {shopName} · แนะนำขนาด 1600 × 500 พิกเซล (อัตราส่วนแนวนอน)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 flex items-center justify-center transition cursor-pointer text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Live Preview Area */}
          <div>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              ตัวอย่างการแสดงผลหน้าร้าน (Live Preview)
            </p>
            <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden border border-neutral-200 shadow-inner bg-gradient-to-r from-[#EFE7D6] via-[#F8F5EE] to-[#E7EBDD]">
              {previewDisplayUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewDisplayUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-2">
                  <span className="text-3xl">🖼️</span>
                  <span className="text-xs font-semibold">ยังไม่มีรูปแบนเนอร์ (ใช้สีพื้นหลังเริ่มต้น)</span>
                </div>
              )}
              <div className="absolute bottom-2 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-lg text-white text-[11px] font-bold">
                ตัวอย่าง Banner: {shopName}
              </div>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                mode === "upload"
                  ? "border-[#7a5b46] text-[#7a5b46]"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              📁 อัปโหลดไฟล์รูปภาพ
            </button>
            <button
              type="button"
              onClick={() => setMode("preset")}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                mode === "preset"
                  ? "border-[#7a5b46] text-[#7a5b46]"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              🎨 เลือกภาพสำเร็จรูป (Presets)
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`flex-1 py-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                mode === "url"
                  ? "border-[#7a5b46] text-[#7a5b46]"
                  : "border-transparent text-neutral-400 hover:text-neutral-600"
              }`}
            >
              🔗 ใส่ URL รูปภาพ
            </button>
          </div>

          {/* Mode: File Upload */}
          {mode === "upload" && (
            <div className="space-y-3">
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-neutral-300 hover:border-[#7a5b46] rounded-2xl bg-neutral-50/60 hover:bg-neutral-50 transition cursor-pointer p-4 text-center">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="text-3xl mb-1">📸</div>
                <p className="text-xs font-bold text-neutral-700">
                  คลิกเพื่อเลือกรูปภาพ หรือลากไฟล์มาวางที่นี่
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  รองรับ PNG, JPG, WebP ขนาดไม่เกิน 5MB
                </p>
                {selectedFile && (
                  <span className="mt-2 text-xs font-semibold text-[#556B2F] bg-[#556B2F]/10 px-3 py-1 rounded-full">
                    ✓ เลือกไฟล์แล้ว: {selectedFile.name}
                  </span>
                )}
              </label>
            </div>
          )}

          {/* Mode: Presets */}
          {mode === "preset" && (
            <div className="space-y-2.5">
              <p className="text-xs text-neutral-500 font-medium">
                เลือกแบนเนอร์โทนสีสไตล์ธรรมชาติ Earth Tone ที่ทีมงานคัดสรรไว้สำหรับร้านคุณ:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_BANNERS.map((preset) => {
                  const isSelected = selectedUrl === preset.url;
                  return (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        setSelectedUrl(preset.url);
                        setSelectedFile(null);
                        setFilePreview("");
                      }}
                      className={`relative flex items-center gap-3 p-2.5 rounded-2xl border text-left transition cursor-pointer overflow-hidden ${
                        isSelected
                          ? "border-[#7a5b46] ring-2 ring-[#7a5b46]/30 bg-[#7a5b46]/5"
                          : "border-neutral-200 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-16 h-11 object-cover rounded-xl border border-neutral-100 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-neutral-800 truncate">
                          {preset.name}
                        </p>
                        <span className="text-[10px] text-neutral-400 block mt-0.5">
                          คลิกเพื่อเลือกภาพนี้
                        </span>
                      </div>
                      {isSelected && (
                        <span className="text-xs font-bold text-[#7a5b46] mr-1">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode: URL Input */}
          {mode === "url" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  URL ของรูปภาพแบนเนอร์ (https://...)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/banner.jpg"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-xs text-neutral-800 focus:outline-hidden focus:border-[#7a5b46] focus:ring-1 focus:ring-[#7a5b46]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-neutral-50 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 text-xs font-bold transition cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !previewDisplayUrl}
            className="px-6 py-2.5 rounded-full bg-[#7a5b46] hover:bg-[#684c39] disabled:opacity-50 text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              <span>✓ บันทึกแบนเนอร์ร้านค้า</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
