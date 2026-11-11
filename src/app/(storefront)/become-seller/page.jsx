"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { shopService } from "@/services/shop.service";
import { uploadService } from "@/services/upload.service";

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  taxId: "",
  bankName: "",
  bankAccountNumber: "",
  bankAccountName: "",
};

/**
 * หน้าสมัครเปิดร้าน (Buyer → PENDING → APPROVED)
 * - อัปโหลดโลโก้/แบนเนอร์/บัตรประชาชนขึ้น R2 ก่อน submit
 * - ถูกรีเจกต์สามารถแก้ไขและส่งใหม่ได้
 * - เมื่ออนุมัติแล้วปุ่มจะพาไปหน้าร้าน public (Seller Center UI ถูกนำออกชั่วคราว)
 */
const STATUS_META = {
  PENDING: {
    label: "รอการตรวจสอบและอนุมัติ",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "⏳",
  },
  APPROVED: {
    label: "ร้านค้าได้รับอนุมัติแล้ว",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "✅",
  },
  REJECTED: {
    label: "คำขอเปิดร้านถูกปฏิเสธ",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    icon: "❌",
  },
  SUSPENDED: {
    label: "ร้านค้าถูกระงับการใช้งาน",
    color: "bg-neutral-100 text-neutral-700 border-neutral-200",
    icon: "⛔",
  },
};

export default function BecomeSellerPage() {
  const router = useRouter();
  const { user, shop, loading, refresh } = useAuth();

  const [shopLoading, setShopLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [idCardUrl, setIdCardUrl] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [idCardFile, setIdCardFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=/become-seller");
    }
  }, [loading, user, router]);

  useEffect(() => {
    let cancelled = false;

    const loadShop = async () => {
      if (!user) return;
      try {
        const data = await shopService.getMyShop();
        if (cancelled) return;

        const current = data.shop;
        if (current) {
          setForm({
            name: current.name || "",
            slug: current.slug || "",
            description: current.description || "",
            taxId: current.taxId || "",
            bankName: current.bankName || "",
            bankAccountNumber: current.bankAccountNumber || "",
            bankAccountName: current.bankAccountName || "",
          });
          setLogoUrl(current.logoUrl || "");
          setBannerUrl(current.bannerUrl || "");
          setIdCardUrl(current.idCardUrl || "");
        }
      } catch (err) {
        console.error("Load shop error:", err);
      } finally {
        if (!cancelled) setShopLoading(false);
      }
    };

    loadShop();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const updateField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFile = (setter) => (e) => {
    const file = e.target.files?.[0] || null;
    setter(file);
  };

  const validate = () => {
    if (form.name.trim().length < 3) return "กรุณากรอกชื่อร้านอย่างน้อย 3 ตัวอักษร";
    if (!/^[a-z0-9-]{3,50}$/.test(form.slug.trim()))
      return "URL Slug ต้องเป็น a-z, 0-9 หรือ - และยาว 3-50 ตัวอักษร";
    if (!/^\d{13}$/.test(form.taxId.trim()))
      return "เลขประจำตัวผู้เสียภาษีต้องเป็นตัวเลข 13 หลัก";
    if (!form.bankName.trim()) return "กรุณาระบุธนาคาร";
    if (!/^\d{10,15}$/.test(form.bankAccountNumber.trim()))
      return "เลขที่บัญชีธนาคารต้องเป็นตัวเลข 10-15 หลัก";
    if (!form.bankAccountName.trim()) return "กรุณาระบุชื่อบัญชีธนาคาร";
    if (!idCardUrl && !idCardFile) return "กรุณาอัปโหลดรูปบัตรประชาชน";
    return "";
  };

  const uploadIfNeeded = async (file, existingUrl) => {
    if (file) return uploadService.uploadFile(file, "shops");
    return existingUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const [nextLogo, nextBanner, nextIdCard] = await Promise.all([
        uploadIfNeeded(logoFile, logoUrl),
        uploadIfNeeded(bannerFile, bannerUrl),
        uploadIfNeeded(idCardFile, idCardUrl),
      ]);

      const payload = {
        ...form,
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        taxId: form.taxId.trim(),
        bankAccountNumber: form.bankAccountNumber.trim(),
        logoUrl: nextLogo || null,
        bannerUrl: nextBanner || null,
        idCardUrl: nextIdCard || null,
      };

      const data = shop
        ? await shopService.update(payload)
        : await shopService.apply(payload);

      setLogoUrl(nextLogo || "");
      setBannerUrl(nextBanner || "");
      setIdCardUrl(nextIdCard || "");
      setLogoFile(null);
      setBannerFile(null);
      setIdCardFile(null);
      setEditing(false);
      setSuccess(data.message || "บันทึกข้อมูลสำเร็จ");
      await refresh();
    } catch (err) {
      setError(err.message || "ไม่สามารถบันทึกข้อมูลร้านได้");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || shopLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm font-bold text-neutral-400">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (!user) return null;

  const showForm = !shop || editing;
  const statusMeta = shop ? STATUS_META[shop.status] || STATUS_META.PENDING : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-earth-olive">
          Seller Onboarding
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-earth-dark">
          เปิดร้านค้ากับ Bare &amp; Bold
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          กรอกข้อมูลร้านและข้อมูลยืนยันตัวตนให้ครบถ้วน ทีมงานจะตรวจสอบภายใน 1-2 วันทำการ
        </p>
      </div>

      {shop && !editing && (
        <div className={`mb-8 rounded-3xl border p-7 ${statusMeta.color}`}>
          <div className="flex items-start gap-4">
            <div className="text-3xl">{statusMeta.icon}</div>
            <div className="flex-1">
              <h2 className="text-lg font-extrabold">{statusMeta.label}</h2>
              <p className="mt-1 text-sm opacity-80">
                ร้าน: <span className="font-bold">{shop.name}</span> · /shop/{shop.slug}
              </p>
              {shop.status === "REJECTED" && shop.rejectionReason && (
                <p className="mt-3 rounded-xl bg-white/70 px-4 py-3 text-sm">
                  <span className="font-bold">เหตุผล:</span> {shop.rejectionReason}
                </p>
              )}
              {shop.status === "SUSPENDED" && shop.suspendedReason && (
                <p className="mt-3 rounded-xl bg-white/70 px-4 py-3 text-sm">
                  <span className="font-bold">เหตุผลที่ถูกระงับ:</span>{" "}
                  {shop.suspendedReason}
                </p>
              )}
              {shop.status === "SUSPENDED" && (
                <p className="mt-3 text-sm opacity-80">
                  ร้านค้าถูกปิดการมองเห็นชั่วคราว กรุณาติดต่อผู้ดูแลระบบ
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                {shop.status === "APPROVED" && (
                  <Link
                    href="/seller"
                    className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    ไปที่ Seller Center
                  </Link>
                )}
                {shop.status === "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="rounded-full bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-700"
                  >
                    แก้ไขและส่งใหม่อีกครั้ง
                  </button>
                )}
                {shop.status === "PENDING" && (
                  <button
                    type="button"
                    onClick={() => refresh()}
                    className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700"
                  >
                    ตรวจสอบสถานะอีกครั้ง
                  </button>
                )}
                <Link
                  href="/"
                  className="rounded-full border border-current px-5 py-2.5 text-sm font-bold transition hover:opacity-70"
                >
                  กลับหน้าแรก
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-earth-border bg-white p-7 shadow-sm"
        >
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}

          <section className="space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-neutral-400">
              1. ข้อมูลร้านค้า
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold text-neutral-500">
                  ชื่อร้าน *
                </label>
                <input
                  value={form.name}
                  onChange={updateField("name")}
                  placeholder="เช่น Crystal Charms"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-earth-olive"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-neutral-500">
                  URL Slug *
                </label>
                <div className="flex items-center rounded-xl border border-neutral-200 px-4 focus-within:border-earth-olive">
                  <span className="text-xs text-neutral-400">/shop/</span>
                  <input
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, "-"),
                      }))
                    }
                    placeholder="crystal-charms"
                    className="w-full bg-transparent py-3 text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-neutral-500">
                คำอธิบายร้าน
              </label>
              <textarea
                value={form.description}
                onChange={updateField("description")}
                rows={3}
                placeholder="เล่าเรื่องร้านและจุดเด่นของสินค้าของคุณ..."
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-earth-olive"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-bold text-neutral-500">
                  โลโก้ร้าน
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile(setLogoFile)}
                  className="w-full rounded-xl border border-dashed border-neutral-300 px-3 py-2 text-xs"
                />
                {(logoFile || logoUrl) && (
                  <p className="mt-1 truncate text-[10px] text-neutral-400">
                    {logoFile ? logoFile.name : logoUrl}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-neutral-500">
                  แบนเนอร์ร้าน
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile(setBannerFile)}
                  className="w-full rounded-xl border border-dashed border-neutral-300 px-3 py-2 text-xs"
                />
                {(bannerFile || bannerUrl) && (
                  <p className="mt-1 truncate text-[10px] text-neutral-400">
                    {bannerFile ? bannerFile.name : bannerUrl}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-neutral-500">
                  รูปบัตรประชาชน (KYC) *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile(setIdCardFile)}
                  className="w-full rounded-xl border border-dashed border-neutral-300 px-3 py-2 text-xs"
                />
                {(idCardFile || idCardUrl) && (
                  <p className="mt-1 truncate text-[10px] text-neutral-400">
                    {idCardFile ? idCardFile.name : idCardUrl}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4 border-t border-neutral-100 pt-6">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-neutral-400">
              2. ข้อมูลภาษีและบัญชีธนาคาร
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold text-neutral-500">
                  เลขประจำตัวผู้เสียภาษี (13 หลัก) *
                </label>
                <input
                  value={form.taxId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      taxId: e.target.value.replace(/\D/g, "").slice(0, 13),
                    }))
                  }
                  placeholder="1234567890123"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-earth-olive"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-neutral-500">
                  ธนาคาร *
                </label>
                <input
                  value={form.bankName}
                  onChange={updateField("bankName")}
                  placeholder="เช่น กสิกรไทย"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-earth-olive"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-neutral-500">
                  เลขที่บัญชี *
                </label>
                <input
                  value={form.bankAccountNumber}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      bankAccountNumber: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 15),
                    }))
                  }
                  placeholder="1234567890"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-earth-olive"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold text-neutral-500">
                  ชื่อบัญชี *
                </label>
                <input
                  value={form.bankAccountName}
                  onChange={updateField("bankAccountName")}
                  placeholder="ชื่อ-นามสกุลเจ้าของบัญชี"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-earth-olive"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-3 border-t border-neutral-100 pt-6">
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-bold text-neutral-500 transition hover:bg-neutral-50"
              >
                ยกเลิก
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-earth-dark px-7 py-2.5 text-sm font-bold text-white transition hover:bg-earth-olive disabled:bg-neutral-300"
            >
              {submitting
                ? "กำลังบันทึก..."
                : shop
                  ? "บันทึกและส่งใหม่"
                  : "ส่งคำขอเปิดร้าน"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
