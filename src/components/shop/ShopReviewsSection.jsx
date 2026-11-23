"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, Trash2, Pencil, ThumbsUp, ArrowUpDown } from "lucide-react";
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

export default function ShopReviewsSection({ shopSlug, shopName, isOwner }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    average: 0,
    count: 0,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [helpfulMap, setHelpfulMap] = useState({});

  // Create shop review form
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formNotice, setFormNotice] = useState({ type: "", text: "" });

  // Edit own review
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const loadReviews = useCallback(async () => {
    if (!shopSlug) return;
    try {
      setLoading(true);
      const res = await reviewService.getShopReviews(shopSlug, {
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
        setPagination(res.pagination || { page: 1, totalPages: 0 });
      }
    } catch {
      // ignore initial error
    } finally {
      setLoading(false);
    }
  }, [shopSlug, ratingFilter, sort, page]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormNotice({ type: "", text: "" });
    try {
      setSubmitting(true);
      await reviewService.createShopReview(shopSlug, {
        rating: newRating,
        comment: newComment.trim() || undefined,
      });
      setNewRating(5);
      setNewComment("");
      setFormNotice({ type: "success", text: "ส่งรีวิวร้านค้าเรียบร้อยแล้ว!" });
      loadReviews();
      setTimeout(() => {
        setShowForm(false);
        setFormNotice({ type: "", text: "" });
      }, 900);
    } catch (err) {
      setFormNotice({
        type: "error",
        text: err.message || "ไม่สามารถส่งรีวิวร้านค้าได้",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEdit = async (reviewId) => {
    try {
      setSavingEdit(true);
      await reviewService.updateShopReview(shopSlug, reviewId, {
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
    if (!window.confirm("ต้องการลบรีวิวร้านค้านี้ใช่หรือไม่?")) return;
    try {
      await reviewService.deleteShopReview(shopSlug, reviewId);
      loadReviews();
    } catch (err) {
      alert(err.message || "ลบรีวิวไม่สำเร็จ");
    }
  };

  return (
    <section className="mt-12 font-anuphan">
      <div className="rounded-3xl border border-[#EDE5D7] bg-[#FAF6F0] overflow-hidden shadow-[0_6px_24px_rgba(43,33,24,0.04)]">
        {/* Compact Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EDE5D7] bg-[#F6EFE4]/70 px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold text-[#241E19]">
              รีวิวร้าน {shopName}
            </h2>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#7D705F]">
              <StarRow rating={summary.average} size={13} />
              <span className="font-bold text-[#241E19]">
                {summary.count > 0 ? Number(summary.average).toFixed(1) : "0.0"}
              </span>
              <span>({summary.count.toLocaleString("th-TH")} รีวิว)</span>
            </div>
          </div>

          {user && !isOwner && (
            <button
              type="button"
              onClick={() => {
                setShowForm((prev) => !prev);
                setFormNotice({ type: "", text: "" });
              }}
              className="rounded-full bg-[#1F1B18] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#3A312A] cursor-pointer"
            >
              {showForm ? "ปิดฟอร์ม" : "เขียนรีวิวร้านนี้"}
            </button>
          )}
        </div>

        {/* Create review form (collapsible) */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="border-b border-[#EDE5D7] bg-white px-6 py-4 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-[#241E19]">
                ให้คะแนนร้าน {shopName}
              </p>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-0.5 cursor-pointer"
                  >
                    <Star
                      size={18}
                      className={
                        star <= newRating
                          ? "fill-[#B89047] text-[#B89047]"
                          : "fill-transparent text-[#DDD4C5]"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={2}
              maxLength={2000}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="เล่าประสบการณ์การสั่งซื้อ การแพ็คสินค้า และการบริการของร้านนี้..."
              className="w-full rounded-xl border border-[#E5DCCB] bg-[#FAF6F0]/50 px-3.5 py-2 text-xs text-[#241E19] outline-none focus:border-[#B89047]"
            />

            {formNotice.text && (
              <div
                className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                  formNotice.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-[#F5F0E6] text-[#6A5242] border border-[#EADECC]"
                }`}
              >
                {formNotice.text}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-[#E5DCCB] bg-white px-4 py-1.5 text-xs font-semibold text-[#5A4E41] cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-[#1F1B18] px-5 py-1.5 text-xs font-semibold text-white hover:bg-[#3A312A] disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "กำลังส่ง..." : "ส่งรีวิว"}
              </button>
            </div>
          </form>
        )}

        {/* Side-by-Side Split Layout: Left Summary (4 cols) | Right Reviews Grid (8 cols) */}
        <div className="grid lg:grid-cols-12">
          {/* LEFT SIDEBAR */}
          <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#EDE5D7] p-5 sm:p-6 space-y-4">
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
          </aside>

          {/* RIGHT MAIN */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EDE5D7] px-5 py-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setRatingFilter("");
                    setPage(1);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                    !ratingFilter
                      ? "bg-[#1F1B18] text-white"
                      : "border border-[#E5DCCB] bg-white text-[#4A3F35]"
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
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                    ratingFilter === "5"
                      ? "bg-[#1F1B18] text-white"
                      : "border border-[#E5DCCB] bg-white text-[#4A3F35]"
                  }`}
                >
                  <span>5</span>
                  <Star size={11} className={ratingFilter === "5" ? "fill-white text-white" : "fill-amber-400 text-amber-400"} />
                  <span>({summary.breakdown?.[5] || 0})</span>
                </button>
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

            <div className="p-5 flex-1">
              {loading ? (
                <div className="py-8 text-center text-xs text-[#8A7D6B]">
                  กำลังโหลดรีวิวร้านค้า...
                </div>
              ) : reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#E2D8C7] bg-white/70 py-10 text-center text-xs text-[#8A7D6B]">
                  ยังไม่มีรีวิวสำหรับร้านนี้
                </div>
              ) : (
                <div className="max-h-[420px] overflow-y-auto pr-1.5">
                  <div className="grid gap-3.5 sm:grid-cols-2">
                  {reviews.map((rev) => {
                    const name = getReviewerName(rev.user);
                    const isMine = user?.id && rev.userId === user.id;
                    const isEditing = editingId === rev.id;
                    const isHelpful = Boolean(helpfulMap[rev.id]);

                    return (
                      <article
                        key={rev.id}
                        className="flex flex-col justify-between rounded-2xl border border-[#EDE5D7] bg-white p-4"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EFE7D9] text-xs font-bold text-[#4A3F35]">
                                {name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#241E19] truncate">
                                  {name}
                                </p>
                                <p className="text-[10px] text-[#8A7D6B]">
                                  ซื้อจริง · {formatThaiDate(rev.createdAt)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <StarRow rating={rev.rating} size={11} />
                              {isMine && !isEditing && (
                                <div className="flex items-center gap-0.5 pl-1 border-l border-[#EDE5D7]">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingId(rev.id);
                                      setEditRating(rev.rating);
                                      setEditComment(rev.comment || "");
                                    }}
                                    className="rounded p-1 text-[#7D705F] hover:bg-[#FAF6F0] cursor-pointer"
                                  >
                                    <Pencil size={11} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(rev.id)}
                                    className="rounded p-1 text-[#7D705F] hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="mt-3 space-y-2 rounded-xl bg-[#FAF6F0] p-3 border border-[#E5DCCB]">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setEditRating(star)}
                                    className="cursor-pointer"
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
                                  onClick={() => handleSaveEdit(rev.id)}
                                  className="rounded-full bg-[#1F1B18] px-3.5 py-1 text-[11px] font-semibold text-white cursor-pointer"
                                >
                                  {savingEdit ? "บันทึก..." : "บันทึก"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            rev.comment && (
                              <p className="mt-3 text-xs leading-relaxed text-[#3E352D] whitespace-pre-line">
                                {rev.comment}
                              </p>
                            )
                          )}
                        </div>

                        {!isEditing && (
                          <div className="mt-3 pt-2 border-t border-[#F4EFE6] flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                setHelpfulMap((prev) => ({
                                  ...prev,
                                  [rev.id]: !prev[rev.id],
                                }))
                              }
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

              {reviews.length > 4 && (
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-[#9A8B74]">
                  <ArrowUpDown size={12} className="shrink-0" />
                  <span>เลื่อนขึ้น-ลงในกรอบเพื่อดูรีวิวทั้งหมด ({reviews.length} รายการ)</span>
                </p>
              )}

              {pagination.totalPages > 1 && (
                <div className="mt-5 flex items-center justify-center gap-2.5">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-full border border-[#DCD2C0] bg-white px-4 py-1.5 text-xs font-semibold text-[#241E19] disabled:opacity-40 cursor-pointer"
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
                    className="rounded-full border border-[#DCD2C0] bg-white px-4 py-1.5 text-xs font-semibold text-[#241E19] disabled:opacity-40 cursor-pointer"
                  >
                    ดูรีวิวเพิ่มเติม
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
