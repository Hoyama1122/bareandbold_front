"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, CheckCircle2, Trash2, Pencil, X } from "lucide-react";
import { reviewService } from "@/services/review.service";
import { useAuth } from "@/context/AuthContext";

function formatThaiDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getReviewerName(user) {
  const full = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return full || "ลูกค้า Bare & Bold";
}

function StarRow({ rating = 0, size = 15 }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-[#B8860B] text-[#B8860B]"
              : "fill-transparent text-[#D6CCB8]"
          }
        />
      ))}
    </div>
  );
}

export default function ProductReviewsSection({ productId }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    average: 0,
    count: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  });
  const [ratingFilter, setRatingFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lightbox for review image
  const [zoomImage, setZoomImage] = useState(null);

  // Inline edit state for user's own review
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const loadReviews = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      setError("");
      const res = await reviewService.getProductReviews(productId, {
        rating: ratingFilter || undefined,
        sort,
        page,
        limit: 6,
      });
      if (res.success) {
        setSummary(
          res.summary || {
            average: 0,
            count: 0,
            breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          },
        );
        setReviews(res.reviews || []);
        setPagination(
          res.pagination || { page: 1, limit: 6, total: 0, totalPages: 0 },
        );
      }
    } catch (err) {
      setError(err.message || "ไม่สามารถโหลดรีวิวสินค้าได้");
    } finally {
      setLoading(false);
    }
  }, [productId, ratingFilter, sort, page]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleStartEdit = (review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  const handleSaveEdit = async (reviewId) => {
    try {
      setSavingEdit(true);
      await reviewService.updateProductReview(reviewId, {
        rating: editRating,
        comment: editComment,
      });
      setEditingId(null);
      loadReviews();
    } catch (err) {
      alert(err.message || "แก้ไขรีวิวไม่สำเร็จ");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("ต้องการลบรีวิวนี้ใช่หรือไม่?")) return;
    try {
      await reviewService.deleteProductReview(reviewId);
      loadReviews();
    } catch (err) {
      alert(err.message || "ลบรีวิวไม่สำเร็จ");
    }
  };

  return (
    <section className="mt-20 border-t border-[#EADECC] pt-14 font-anuphan">
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#556B2F]">
            Verified Customer Reviews
          </p>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#3C322A]">
            รีวิวจากผู้ซื้อจริง
          </h2>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-[#8C8577]">เรียงตาม:</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-[#EADECC] bg-white px-3.5 py-2 text-xs font-bold text-[#3C322A] outline-none focus:border-[#6A5242] cursor-pointer"
          >
            <option value="newest">ล่าสุด</option>
            <option value="highest">คะแนนสูงสุด</option>
            <option value="lowest">คะแนนต่ำสุด</option>
          </select>
        </div>
      </div>

      {/* Rating Summary Card */}
      <div className="grid gap-6 md:grid-cols-12 rounded-3xl border border-[#EADECC] bg-[#FAF7F0] p-6 sm:p-8 mb-8">
        <div className="md:col-span-4 flex flex-col items-center justify-center md:border-r md:border-[#EADECC] md:pr-6 text-center">
          <p className="text-5xl font-black tracking-tight text-[#3C322A]">
            {summary.count > 0 ? Number(summary.average).toFixed(1) : "0.0"}
          </p>
          <div className="mt-2">
            <StarRow rating={summary.average} size={18} />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#8C8577]">
            จากทั้งหมด {summary.count.toLocaleString("th-TH")} รีวิว
          </p>
        </div>

        <div className="md:col-span-8 flex flex-col justify-center gap-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.breakdown?.[star] || 0;
            const pct = summary.count > 0 ? Math.round((count / summary.count) * 100) : 0;
            const active = String(ratingFilter) === String(star);

            return (
              <button
                key={star}
                type="button"
                onClick={() => {
                  setRatingFilter(active ? "" : String(star));
                  setPage(1);
                }}
                className={`flex items-center gap-3 rounded-xl px-3 py-1.5 text-left transition cursor-pointer ${
                  active
                    ? "bg-[#556B2F]/12 ring-1 ring-[#556B2F]/40"
                    : "hover:bg-white/70"
                }`}
              >
                <span className="w-12 text-xs font-bold text-[#3C322A] flex items-center gap-1">
                  {star} <Star size={12} className="fill-[#B8860B] text-[#B8860B]" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-[#EAE2CC] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#556B2F] transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-semibold text-[#8C8577]">
                  {count}
                </span>
              </button>
            );
          })}

          {ratingFilter && (
            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setRatingFilter("");
                  setPage(1);
                }}
                className="text-xs font-bold text-[#6A5242] hover:underline cursor-pointer"
              >
                ล้างตัวกรอง ({ratingFilter} ดาว)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review List */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-sm text-[#8C8577]">
          กำลังโหลดรีวิวสินค้า...
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#EADECC] bg-white py-14 px-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F0E6] text-[#6A5242]">
            <Star size={22} />
          </div>
          <p className="text-base font-bold text-[#3C322A]">
            {ratingFilter
              ? `ยังไม่มีรีวิว ${ratingFilter} ดาวสำหรับสินค้านี้`
              : "ยังไม่มีรีวิวสำหรับสินค้านี้"}
          </p>
          <p className="mt-1 text-xs text-[#8C8577]">
            สั่งซื้อและยืนยันรับสินค้าแล้วสามารถเขียนรีวิวได้จากหน้าประวัติคำสั่งซื้อ
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const reviewerName = getReviewerName(review.user);
            const isMine = user?.id && review.userId === user.id;
            const isEditing = editingId === review.id;

            return (
              <article
                key={review.id}
                className="rounded-2xl border border-[#EADECC] bg-white p-5 sm:p-6 shadow-2xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F0E6] text-sm font-extrabold text-[#6A5242] border border-[#EADECC]">
                      {reviewerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#3C322A]">
                          {reviewerName}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#556B2F]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#556B2F]">
                          <CheckCircle2 size={12} />
                          ซื้อสินค้าจริง
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRow rating={review.rating} size={13} />
                        <span className="text-xs text-[#8C8577]">
                          {formatThaiDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isMine && !isEditing && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(review)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#EADECC] px-2.5 py-1 text-xs font-semibold text-[#6A5242] hover:bg-[#F5F0E6] cursor-pointer"
                      >
                        <Pencil size={12} /> แก้ไข
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(review.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 size={12} /> ลบ
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-4 space-y-3 rounded-xl bg-[#FAF7F0] p-4 border border-[#EADECC]">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditRating(star)}
                          className="cursor-pointer p-0.5"
                        >
                          <Star
                            size={20}
                            className={
                              star <= editRating
                                ? "fill-[#B8860B] text-[#B8860B]"
                                : "fill-transparent text-[#D6CCB8]"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={3}
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full rounded-xl border border-[#EADECC] bg-white px-3.5 py-2.5 text-sm text-[#3C322A] outline-none focus:border-[#6A5242]"
                      placeholder="แก้ไขความคิดเห็นของคุณ..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-lg border border-[#EADECC] bg-white px-3.5 py-1.5 text-xs font-bold text-[#6A5242] cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="button"
                        disabled={savingEdit}
                        onClick={() => handleSaveEdit(review.id)}
                        className="rounded-lg bg-[#556B2F] px-4 py-1.5 text-xs font-bold text-white hover:opacity-95 disabled:opacity-60 cursor-pointer"
                      >
                        {savingEdit ? "กำลังบันทึก..." : "บันทึก"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {review.comment && (
                      <p className="mt-3.5 text-sm leading-relaxed text-[#3C322A] whitespace-pre-line">
                        {review.comment}
                      </p>
                    )}

                    {review.images && review.images.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {review.images.map((img) => (
                          <button
                            key={img.id || img.url}
                            type="button"
                            onClick={() => setZoomImage(img.url)}
                            className="h-20 w-20 overflow-hidden rounded-xl border border-[#EADECC] bg-[#FAF7F0] cursor-pointer hover:opacity-90 transition"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.url}
                              alt="รูปภาพรีวิว"
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-xl border border-[#EADECC] bg-white px-4 py-2 text-xs font-bold text-[#3C322A] disabled:opacity-40 cursor-pointer hover:bg-[#F5F0E6]"
          >
            ก่อนหน้า
          </button>
          <span className="text-xs font-semibold text-[#8C8577]">
            หน้า {pagination.page} / {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            className="rounded-xl border border-[#EADECC] bg-white px-4 py-2 text-xs font-bold text-[#3C322A] disabled:opacity-40 cursor-pointer hover:bg-[#F5F0E6]"
          >
            ถัดไป
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-2xl bg-white p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setZoomImage(null)}
              className="absolute top-3 right-3 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 cursor-pointer"
            >
              <X size={18} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomImage}
              alt="รูปภาพรีวิวขนาดเต็ม"
              className="max-h-[82vh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
