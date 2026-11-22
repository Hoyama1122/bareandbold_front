"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, CheckCircle2, Trash2, Pencil } from "lucide-react";
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
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

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
        setPagination(res.pagination || { page: 1, totalPages: 0 });
      }
    } catch {
      // ignore initial error
    } finally {
      setLoading(false);
    }
  }, [shopSlug, sort, page]);

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
    <section className="mt-14 rounded-3xl border border-earth-border bg-white p-6 sm:p-8 shadow-xs font-anuphan">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EFE7D6] pb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#556B2F]">
            Shop Rating &amp; Reviews
          </p>
          <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-earth-dark">
            รีวิวร้าน {shopName}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-[#EADECC] bg-[#FDFBF7] px-3 py-2 text-xs font-bold text-earth-dark outline-none cursor-pointer"
          >
            <option value="newest">ล่าสุด</option>
            <option value="highest">คะแนนสูงสุด</option>
            <option value="lowest">คะแนนต่ำสุด</option>
          </select>

          {user && !isOwner && (
            <button
              type="button"
              onClick={() => {
                setShowForm((prev) => !prev);
                setFormNotice({ type: "", text: "" });
              }}
              className="rounded-full bg-[#6A5242] px-5 py-2 text-xs font-bold text-white hover:bg-[#556B2F] transition cursor-pointer"
            >
              {showForm ? "ปิดฟอร์มรีวิว" : "เขียนรีวิวร้านนี้"}
            </button>
          )}
        </div>
      </div>

      {/* Summary bar */}
      <div className="mt-6 flex flex-wrap items-center gap-6 rounded-2xl bg-[#FAF7F0] border border-[#EADECC] p-5">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-earth-dark">
            {summary.count > 0 ? Number(summary.average).toFixed(1) : "0.0"}
          </span>
          <span className="text-sm font-bold text-[#8C8577]">/ 5.0</span>
        </div>
        <div>
          <StarRow rating={summary.average} size={18} />
          <p className="mt-1 text-xs font-semibold text-[#8C8577]">
            จากผู้ซื้อจริง {summary.count.toLocaleString("th-TH")} รีวิว
          </p>
        </div>
      </div>

      {/* Create review form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mt-6 rounded-2xl border border-[#EADECC] bg-[#FDFBF7] p-5 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-earth-dark">
              ให้คะแนนร้าน {shopName}
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-0.5 cursor-pointer"
                >
                  <Star
                    size={22}
                    className={
                      star <= newRating
                        ? "fill-[#B8860B] text-[#B8860B]"
                        : "fill-transparent text-[#D6CCB8]"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={3}
            maxLength={2000}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="เล่าประสบการณ์การสั่งซื้อ การแพ็คสินค้า และการบริการของร้านนี้..."
            className="w-full rounded-xl border border-[#EADECC] bg-white px-4 py-3 text-sm text-earth-dark outline-none focus:border-[#6A5242]"
          />

          {formNotice.text && (
            <div
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold ${
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
              className="rounded-xl border border-[#EADECC] bg-white px-4 py-2 text-xs font-bold text-[#6A5242] cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#556B2F] px-5 py-2 text-xs font-bold text-white hover:opacity-95 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "กำลังส่ง..." : "ส่งรีวิวร้านค้า"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="mt-6">
        {loading ? (
          <div className="py-10 text-center text-sm text-[#8C8577]">
            กำลังโหลดรีวิวร้านค้า...
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#EADECC] py-12 text-center text-sm text-[#8C8577]">
            ยังไม่มีรีวิวสำหรับร้านนี้
          </div>
        ) : (
          <div className="divide-y divide-[#EFE7D6]">
            {reviews.map((rev) => {
              const name = getReviewerName(rev.user);
              const isMine = user?.id && rev.userId === user.id;
              const isEditing = editingId === rev.id;

              return (
                <div key={rev.id} className="py-5 first:pt-2 last:pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F0E6] text-xs font-extrabold text-[#6A5242] border border-[#EADECC]">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-earth-dark">
                            {name}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#556B2F]/10 px-2 py-0.5 text-[10px] font-bold text-[#556B2F]">
                            <CheckCircle2 size={11} />
                            ผู้ซื้อจริง
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2">
                          <StarRow rating={rev.rating} size={13} />
                          <span className="text-xs text-[#8C8577]">
                            {formatThaiDate(rev.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isMine && !isEditing && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(rev.id);
                            setEditRating(rev.rating);
                            setEditComment(rev.comment || "");
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#EADECC] px-2.5 py-1 text-xs font-semibold text-[#6A5242] hover:bg-[#F5F0E6] cursor-pointer"
                        >
                          <Pencil size={12} /> แก้ไข
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(rev.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 size={12} /> ลบ
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mt-3 space-y-2.5 rounded-xl bg-[#FAF7F0] p-3.5 border border-[#EADECC]">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditRating(star)}
                            className="cursor-pointer"
                          >
                            <Star
                              size={18}
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
                        rows={2}
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full rounded-xl border border-[#EADECC] bg-white px-3 py-2 text-sm text-earth-dark outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-lg border border-[#EADECC] bg-white px-3 py-1 text-xs font-bold text-[#6A5242] cursor-pointer"
                        >
                          ยกเลิก
                        </button>
                        <button
                          type="button"
                          disabled={savingEdit}
                          onClick={() => handleSaveEdit(rev.id)}
                          className="rounded-lg bg-[#556B2F] px-4 py-1 text-xs font-bold text-white cursor-pointer"
                        >
                          {savingEdit ? "กำลังบันทึก..." : "บันทึก"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    rev.comment && (
                      <p className="mt-3 text-sm leading-relaxed text-earth-dark whitespace-pre-line">
                        {rev.comment}
                      </p>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border border-[#EADECC] bg-white px-4 py-1.5 text-xs font-bold text-earth-dark disabled:opacity-40 cursor-pointer"
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
              className="rounded-xl border border-[#EADECC] bg-white px-4 py-1.5 text-xs font-bold text-earth-dark disabled:opacity-40 cursor-pointer"
            >
              ถัดไป
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
