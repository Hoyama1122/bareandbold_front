"use client";

import React, { useState, useEffect } from "react";
import { Star, ImagePlus, X, Store, Package } from "lucide-react";
import { reviewService } from "@/services/review.service";
import { uploadService } from "@/services/upload.service";

const RATING_LABELS = {
  1: "ควรปรับปรุง",
  2: "พอใช้",
  3: "ปานกลาง",
  4: "ดีมาก",
  5: "ประทับใจมาก",
};

export default function ReviewModal({ isOpen, order, onClose, onSuccess }) {
  const [tab, setTab] = useState("product"); // "product" | "shop"
  const [selectedOrderItemId, setSelectedOrderItemId] = useState("");
  const [selectedSubOrderId, setSelectedSubOrderId] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  const items = order?.items || [];
  const subOrders = order?.subOrders || [];

  useEffect(() => {
    if (!isOpen || !order) return;
    setTab("product");
    setSelectedOrderItemId(order.items?.[0]?.id || "");
    setSelectedSubOrderId(order.subOrders?.[0]?.id || "");
    setRating(5);
    setHoverRating(0);
    setComment("");
    setImageUrls([]);
    setNotice({ type: "", text: "" });
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleUploadPhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = 5 - imageUrls.length;
    if (remaining <= 0) {
      setNotice({ type: "error", text: "แนบรูปได้สูงสุด 5 รูป" });
      return;
    }

    try {
      setUploading(true);
      setNotice({ type: "", text: "" });
      const uploaded = [];
      for (const file of files.slice(0, remaining)) {
        const url = await uploadService.uploadFile(file, "products");
        if (url) uploaded.push(url);
      }
      setImageUrls((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "อัปโหลดรูปไม่สำเร็จ",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice({ type: "", text: "" });

    try {
      setSubmitting(true);
      if (tab === "product") {
        if (!selectedOrderItemId) {
          setNotice({ type: "error", text: "กรุณาเลือกสินค้าที่ต้องการรีวิว" });
          return;
        }
        await reviewService.createProductReview({
          orderItemId: selectedOrderItemId,
          rating,
          comment: comment.trim() || undefined,
          images: imageUrls,
        });
        setNotice({ type: "success", text: "บันทึกรีวิวสินค้าเรียบร้อยแล้ว ขอบคุณสำหรับความคิดเห็น!" });
      } else {
        const chosenSub = subOrders.find((s) => s.id === selectedSubOrderId);
        if (!chosenSub?.shopId) {
          setNotice({ type: "error", text: "กรุณาเลือกร้านค้าที่ต้องการรีวิว" });
          return;
        }
        await reviewService.createShopReview(chosenSub.shopId, {
          subOrderId: chosenSub.id,
          rating,
          comment: comment.trim() || undefined,
        });
        setNotice({ type: "success", text: "บันทึกรีวิวร้านค้าเรียบร้อยแล้ว ขอบคุณสำหรับความคิดเห็น!" });
      }

      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "ไม่สามารถส่งรีวิวได้",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const activeStar = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-anuphan">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl border border-[#EADECC]">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#556B2F]">
              Write a Review
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-[#3C322A]">
              ให้คะแนนและเขียนรีวิว
            </h2>
            <p className="mt-0.5 text-xs text-[#8C8577]">
              คำสั่งซื้อ #{order.id?.slice(0, 8)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#8C8577] hover:bg-[#F5F0E6] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        {subOrders.length > 0 && (
          <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-[#F5F0E6] p-1">
            <button
              type="button"
              onClick={() => {
                setTab("product");
                setNotice({ type: "", text: "" });
              }}
              className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
                tab === "product"
                  ? "bg-white text-[#3C322A] shadow-2xs"
                  : "text-[#8C8577] hover:text-[#3C322A]"
              }`}
            >
              <Package size={14} /> รีวิวสินค้า
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("shop");
                setNotice({ type: "", text: "" });
              }}
              className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
                tab === "shop"
                  ? "bg-white text-[#3C322A] shadow-2xs"
                  : "text-[#8C8577] hover:text-[#3C322A]"
              }`}
            >
              <Store size={14} /> รีวิวร้านค้า
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Target selector */}
          {tab === "product" ? (
            <div>
              <label className="block text-xs font-bold text-[#3C322A] mb-2">
                เลือกสินค้าที่ต้องการรีวิว *
              </label>
              <select
                value={selectedOrderItemId}
                onChange={(e) => setSelectedOrderItemId(e.target.value)}
                className="w-full rounded-xl border border-[#EADECC] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#3C322A] outline-none focus:border-[#6A5242]"
              >
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.product?.name || "สินค้า"} (จำนวน {item.quantity})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-[#3C322A] mb-2">
                เลือกร้านค้าที่ต้องการรีวิว *
              </label>
              <select
                value={selectedSubOrderId}
                onChange={(e) => setSelectedSubOrderId(e.target.value)}
                className="w-full rounded-xl border border-[#EADECC] bg-[#FDFBF7] px-3.5 py-2.5 text-sm text-[#3C322A] outline-none focus:border-[#6A5242]"
              >
                {subOrders.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.shop?.name || "ร้านค้า"} ({sub.subOrderNumber})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Star Picker */}
          <div className="rounded-2xl bg-[#FAF7F0] border border-[#EADECC] p-4 text-center">
            <p className="text-xs font-bold text-[#6A5242] mb-2">
              คะแนนความพึงพอใจ *
            </p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 cursor-pointer"
                >
                  <Star
                    size={30}
                    className={
                      star <= activeStar
                        ? "fill-[#B8860B] text-[#B8860B]"
                        : "fill-transparent text-[#D6CCB8]"
                    }
                  />
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-xs font-bold text-[#556B2F]">
              {activeStar} ดาว — {RATING_LABELS[activeStar]}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-[#3C322A] mb-2">
              ความคิดเห็นของคุณ
            </label>
            <textarea
              rows={4}
              maxLength={2000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                tab === "product"
                  ? "แชร์ความประทับใจเกี่ยวกับคุณภาพหิน สีสัน ขนาด หรือความสวยงามของสินค้า..."
                  : "แชร์ประสบการณ์การจัดส่ง การแพ็คสินค้า และการให้บริการของร้านค้า..."
              }
              className="w-full rounded-xl border border-[#EADECC] bg-white px-4 py-3 text-sm text-[#3C322A] outline-none focus:border-[#6A5242]"
            />
            <p className="mt-1 text-right text-[11px] text-[#8C8577]">
              {comment.length}/2000
            </p>
          </div>

          {/* Photos (Product review only) */}
          {tab === "product" && (
            <div>
              <label className="block text-xs font-bold text-[#3C322A] mb-2">
                แนบรูปภาพสินค้า (สูงสุด 5 รูป)
              </label>
              <label className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#D6CCB8] bg-[#FDFBF7] py-3.5 text-xs font-bold text-[#6A5242] hover:bg-[#F5F0E6] transition cursor-pointer">
                <ImagePlus size={16} />
                <span>{uploading ? "กำลังอัปโหลดรูป..." : "เลือกรูปภาพ"}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading || imageUrls.length >= 5}
                  onChange={handleUploadPhotos}
                  className="hidden"
                />
              </label>

              {imageUrls.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {imageUrls.map((url, idx) => (
                    <div
                      key={`${url}-${idx}`}
                      className="relative h-16 w-16 overflow-hidden rounded-xl border border-[#EADECC]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt="ตัวอย่างรูปภาพรีวิว"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImageUrls((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="absolute top-0.5 right-0.5 rounded-full bg-black/65 p-0.5 text-white cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notice */}
          {notice.text && (
            <div
              className={`rounded-xl px-4 py-3 text-xs font-semibold ${
                notice.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-[#F5F0E6] text-[#6A5242] border border-[#EADECC]"
              }`}
            >
              {notice.text}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#EADECC] bg-white px-5 py-2.5 text-xs font-bold text-[#6A5242] hover:bg-[#F5F0E6] cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="rounded-xl bg-[#6A5242] px-6 py-2.5 text-xs font-bold text-white hover:opacity-95 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "กำลังส่งรีวิว..." : "ส่งรีวิว"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
