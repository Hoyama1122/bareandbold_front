"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Star, Trash2, Pencil, X, ThumbsUp, Camera } from "lucide-react";
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

function StarRow({ rating = 0, size = 14 }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-[#B89047] text-[#B89047]"
              : "fill-transparent text-[#DDD4C5]"
          }
        />
      ))}
    </div>
  );
}

const HIGHLIGHT_KEYWORDS = [
  { label: "สวยตรงปก", match: ["สวย", "ตรงปก", "น่ารัก", "หรู", "ดีไซน์"] },
  { label: "งานละเอียดคุณภาพดี", match: ["คุณภาพ", "ละเอียด", "ดีมาก", "แข็งแรง", "แท้"] },
  { label: "ใส่สบายพอดีข้อมือ", match: ["พอดี", "ขนาด", "ใส่สบาย", "ข้อมือ", "ข้อเท้า"] },
  { label: "จัดส่งรวดเร็ว", match: ["ส่งไว", "จัดส่ง", "เร็ว", "แพ็ค", "ห่อ"] },
];

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
  const [onlyWithPhotos, setOnlyWithPhotos] = useState(false);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Client-side helpful toggle
  const [helpfulMap, setHelpfulMap] = useState({});

  // Lightbox
  const [zoomImage, setZoomImage] = useState(null);

  // Inline edit state for own review
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
        limit: 50,
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

  // All customer photos across loaded reviews
  const customerPhotos = useMemo(() => {
    const urls = [];
    reviews.forEach((r) => {
      (r.images || []).forEach((img) => {
        if (img?.url) urls.push(img.url);
      });
    });
    return urls;
  }, [reviews]);

  // Keyword pills ("ลูกค้าพูดถึง")
  const highlightChips = useMemo(() => {
    return HIGHLIGHT_KEYWORDS.map((kw) => {
      const count = reviews.filter((r) =>
        kw.match.some((m) => (r.comment || "").toLowerCase().includes(m)),
      ).length;
      return { label: kw.label, count };
    });
  }, [reviews]);

  const visibleReviews = useMemo(() => {
    if (!onlyWithPhotos) return reviews;
    return reviews.filter((r) => r.images && r.images.length > 0);
  }, [reviews, onlyWithPhotos]);

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

  const toggleHelpful = (id) => {
    setHelpfulMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="mt-14 font-anuphan">
      <div className="rounded-3xl border border-[#EDE5D7] bg-[#FAF6F0] overflow-hidden shadow-[0_6px_24px_rgba(43,33,24,0.04)]">
        {/* Compact Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE5D7] bg-[#F6EFE4]/70 px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold text-[#241E19]">
              รีวิวจากผู้ซื้อจริง
            </h2>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#7D705F]">
              <StarRow rating={summary.average} size={13} />
              <span className="font-bold text-[#241E19]">
                {summary.count > 0 ? Number(summary.average).toFixed(1) : "0.0"}
              </span>
              <span>({summary.count.toLocaleString("th-TH")} รีวิว)</span>
            </div>
          </div>

          <Link
            href="/orders"
            className="inline-flex items-center justify-center rounded-full bg-[#1F1B18] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#3A312A]"
          >
            เขียนรีวิวสินค้า
          </Link>
        </div>

        {/* Side-by-Side Split Layout: Left Summary (4 cols) | Right Reviews Grid (8 cols) */}
        <div className="grid lg:grid-cols-12">
          {/* LEFT SIDEBAR: Score + Bars + Highlights + Photos */}
          <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#EDE5D7] p-5 sm:p-6 space-y-5 bg-[#FAF6F0]">
            {/* Big Score */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-light tracking-tight text-[#241E19] leading-none">
                {summary.count > 0 ? Number(summary.average).toFixed(1) : "0.0"}
              </span>
              <div>
                <StarRow rating={summary.average} size={14} />
                <p className="mt-1 text-xs text-[#8A7D6B]">
                  จาก {summary.count.toLocaleString("th-TH")} รีวิวที่ซื้อจริง
                </p>
              </div>
            </div>

            {/* 5→1 Bars */}
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = summary.breakdown?.[star] || 0;
                const pct =
                  summary.count > 0 ? Math.round((count / summary.count) * 100) : 0;
                const active = String(ratingFilter) === String(star);

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setRatingFilter(active ? "" : String(star));
                      setPage(1);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-0.5 text-left transition cursor-pointer ${
                      active ? "bg-[#EFE7D8]" : "hover:bg-[#F3ECE0]"
                    }`}
                  >
                    <span className="w-10 text-xs font-medium text-[#5A4E41]">
                      {star} ดาว
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#EAE2D3] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#B89047] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[11px] font-medium text-[#8A7D6B]">
                      {pct}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Customers Say */}
            <div className="pt-3 border-t border-[#EDE5D7]">
              <h3 className="text-xs font-bold text-[#241E19]">ลูกค้าพูดถึง</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {highlightChips.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1 rounded-full border border-[#E5DCCB] bg-white px-2.5 py-1 text-[11px] font-medium text-[#3C322A]"
                  >
                    <span>{chip.label}</span>
                    {chip.count > 0 && (
                      <span className="text-[#9A8B74]">({chip.count})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Customer Photos */}
            {customerPhotos.length > 0 && (
              <div className="pt-3 border-t border-[#EDE5D7]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#241E19]">
                    รูปภาพจากลูกค้า
                  </h3>
                  <span className="text-[11px] text-[#8A7D6B]">
                    {customerPhotos.length} รูป
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {customerPhotos.slice(0, 4).map((url, idx) => {
                    const isLastOverflow = idx === 3 && customerPhotos.length > 4;
                    return (
                      <button
                        key={`${url}-${idx}`}
                        type="button"
                        onClick={() => setZoomImage(url)}
                        className="relative h-12 w-12 overflow-hidden rounded-lg border border-[#E5DCCB] bg-white cursor-pointer hover:opacity-90 transition"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`รูปรีวิวลูกค้า ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {isLastOverflow && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-[11px] font-bold text-white">
                            +{customerPhotos.length - 4}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* RIGHT MAIN: Filter Bar + 2-Column Review Cards */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Inline Filter & Sort Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDE5D7] px-5 py-3 bg-[#FAF6F0]">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setRatingFilter("");
                    setOnlyWithPhotos(false);
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    !ratingFilter && !onlyWithPhotos
                      ? "bg-[#1F1B18] text-white"
                      : "border border-[#E5DCCB] bg-white text-[#4A3F35] hover:bg-[#F3ECE0]"
                  }`}
                >
                  ทั้งหมด
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRatingFilter(ratingFilter === "5" ? "" : "5");
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    ratingFilter === "5"
                      ? "bg-[#1F1B18] text-white"
                      : "border border-[#E5DCCB] bg-white text-[#4A3F35] hover:bg-[#F3ECE0]"
                  }`}
                >
                  5 ★ ({summary.breakdown?.[5] || 0})
                </button>

                <button
                  type="button"
                  onClick={() => setOnlyWithPhotos((prev) => !prev)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    onlyWithPhotos
                      ? "bg-[#1F1B18] text-white"
                      : "border border-[#E5DCCB] bg-white text-[#4A3F35] hover:bg-[#F3ECE0]"
                  }`}
                >
                  มีรูปภาพ
                </button>

                {ratingFilter && ratingFilter !== "5" && (
                  <button
                    type="button"
                    onClick={() => {
                      setRatingFilter("");
                      setPage(1);
                    }}
                    className="rounded-full bg-[#1F1B18] px-3 py-1 text-xs font-semibold text-white cursor-pointer"
                  >
                    {ratingFilter} ★ ✕
                  </button>
                )}
              </div>

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="rounded-full border border-[#E5DCCB] bg-white px-3 py-1 text-xs font-semibold text-[#241E19] outline-none cursor-pointer"
              >
                <option value="newest">ล่าสุด</option>
                <option value="highest">คะแนนสูงสุด</option>
                <option value="lowest">คะแนนต่ำสุด</option>
              </select>
            </div>

            {/* Cards Grid */}
            <div className="p-5 flex-1">
              {error && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="py-10 text-center text-xs text-[#8A7D6B]">
                  กำลังโหลดรีวิวสินค้า...
                </div>
              ) : visibleReviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E2D8C7] bg-white/70 py-10 px-5 text-center">
                  <Camera size={22} className="mx-auto mb-2 text-[#9A8B74]" />
                  <p className="text-sm font-bold text-[#241E19]">
                    {onlyWithPhotos
                      ? "ยังไม่มีรีวิวที่มีรูปภาพในหน้านี้"
                      : ratingFilter
                        ? `ยังไม่มีรีวิว ${ratingFilter} ดาวสำหรับสินค้านี้`
                        : "ยังไม่มีรีวิวสำหรับสินค้านี้"}
                  </p>
                  <p className="mt-1 text-xs text-[#8A7D6B]">
                    เมื่อได้รับสินค้าแล้วสามารถกด “เขียนรีวิว” ได้จากหน้าประวัติคำสั่งซื้อ
                  </p>
                </div>
              ) : (
                <div className="max-h-[420px] overflow-y-auto pr-1.5">
                  <div className="grid gap-3.5 sm:grid-cols-2">
                  {visibleReviews.map((review) => {
                    const reviewerName = getReviewerName(review.user);
                    const isMine = user?.id && review.userId === user.id;
                    const isEditing = editingId === review.id;
                    const isHelpful = Boolean(helpfulMap[review.id]);

                    return (
                      <article
                        key={review.id}
                        className="flex flex-col justify-between rounded-2xl border border-[#EDE5D7] bg-white p-4 transition hover:border-[#DFD4C0]"
                      >
                        <div>
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFE7D9] text-xs font-bold text-[#4A3F35]">
                                {reviewerName.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#241E19] truncate">
                                  {reviewerName}
                                </p>
                                <p className="text-[10px] text-[#8A7D6B]">
                                  ซื้อจริง · {formatThaiDate(review.createdAt)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <StarRow rating={review.rating} size={11} />
                              {isMine && !isEditing && (
                                <div className="flex items-center gap-0.5 pl-1 border-l border-[#EDE5D7]">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEdit(review)}
                                    title="แก้ไขรีวิว"
                                    className="rounded p-1 text-[#7D705F] hover:bg-[#FAF6F0] cursor-pointer"
                                  >
                                    <Pencil size={11} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(review.id)}
                                    title="ลบรีวิว"
                                    className="rounded p-1 text-[#7D705F] hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Body */}
                          {isEditing ? (
                            <div className="mt-3 space-y-2 rounded-xl bg-[#FAF6F0] p-3 border border-[#E5DCCB]">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setEditRating(star)}
                                    className="cursor-pointer p-0.5"
                                  >
                                    <Star
                                      size={15}
                                      className={
                                        star <= editRating
                                          ? "fill-[#B89047] text-[#B89047]"
                                          : "fill-transparent text-[#DDD4C5]"
                                      }
                                    />
                                  </button>
                                ))}
                              </div>
                              <textarea
                                rows={2}
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                className="w-full rounded-lg border border-[#E5DCCB] bg-white px-2.5 py-1.5 text-xs text-[#241E19] outline-none"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="rounded-full border border-[#E5DCCB] bg-white px-3 py-1 text-[11px] font-semibold text-[#5A4E41] cursor-pointer"
                                >
                                  ยกเลิก
                                </button>
                                <button
                                  type="button"
                                  disabled={savingEdit}
                                  onClick={() => handleSaveEdit(review.id)}
                                  className="rounded-full bg-[#1F1B18] px-3.5 py-1 text-[11px] font-semibold text-white disabled:opacity-50 cursor-pointer"
                                >
                                  {savingEdit ? "บันทึก..." : "บันทึก"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {review.comment && (
                                <p className="mt-3 text-xs leading-relaxed text-[#3E352D] whitespace-pre-line">
                                  {review.comment}
                                </p>
                              )}
                              {review.images && review.images.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {review.images.map((img) => (
                                    <button
                                      key={img.id || img.url}
                                      type="button"
                                      onClick={() => setZoomImage(img.url)}
                                      className="h-12 w-12 overflow-hidden rounded-lg border border-[#EDE5D7] bg-[#FAF6F0] cursor-pointer hover:opacity-90 transition"
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
                        </div>

                        {!isEditing && (
                          <div className="mt-3 pt-2 border-t border-[#F4EFE6] flex justify-end">
                            <button
                              type="button"
                              onClick={() => toggleHelpful(review.id)}
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition cursor-pointer ${
                                isHelpful
                                  ? "border-[#1F1B18] bg-[#1F1B18] text-white"
                                  : "border-[#E5DCCB] bg-white text-[#7D705F] hover:border-[#B89047]"
                              }`}
                            >
                              <ThumbsUp size={10} />
                              <span>มีประโยชน์{isHelpful ? " (1)" : ""}</span>
                            </button>
                          </div>
                        )}
                      </article>
                    );
                  })}
                  </div>
                </div>
              )}

              {visibleReviews.length > 4 && (
                <p className="mt-3 text-center text-[11px] text-[#9A8B74]">
                  ↕ เลื่อนขึ้น-ลงในกรอบเพื่อดูรีวิวทั้งหมด ({visibleReviews.length} รายการ)
                </p>
              )}

              {pagination.totalPages > 1 && (
                <div className="mt-5 flex items-center justify-center gap-2.5">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-full border border-[#DCD2C0] bg-white px-4 py-1.5 text-xs font-semibold text-[#241E19] hover:bg-[#F3ECE0] disabled:opacity-40 cursor-pointer"
                  >
                    ก่อนหน้า
                  </button>
                  <span className="text-xs font-medium text-[#8A7D6B]">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    className="rounded-full border border-[#DCD2C0] bg-white px-4 py-1.5 text-xs font-semibold text-[#241E19] hover:bg-[#F3ECE0] disabled:opacity-40 cursor-pointer"
                  >
                    ดูรีวิวเพิ่มเติม
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
