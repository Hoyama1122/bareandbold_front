"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ShoppingBag01Icon } from "hugeicons-react";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States สำหรับเพิ่ม/ลดจำนวน และเลือกขนาด
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(""); // เช่น '15cm', '16cm'
  const [sizeError, setSizeError] = useState(false); // ตรวจสอบการเลือกขนาด

  // ดึงข้อมูลสินค้าตาม ID จาก API
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/api/products/${id}`);
        if (!res.ok) {
          throw new Error("ไม่สามารถโหลดรายละเอียดสินค้าชิ้นนี้ได้");
        }
        const data = await res.json();
        
        // ตรวจสอบตามรูปแบบการดึงข้อมูลจาก API ของคุณ
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setProduct(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-[#6A5242] font-semibold animate-pulse">
        กำลังโหลดรายละเอียดสินค้า...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        {error || "ไม่พบสินค้าที่ต้องการ"}
      </div>
    );
  }

  // เช็คประเภทสินค้าว่าเป็น Made to Order หรือไม่
  const isMadeToOrder = product.type === "MADE_TO_ORDER";

  // ฟังก์ชันเพิ่ม/ลดจำนวนสินค้า
  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // ฟังก์ชันสำหรับเพิ่มสินค้าลงตะกร้า (localStorage)
  const handleAddToCart = (shouldRedirect = false) => {
    // 🚨 หากเป็น Made to Order แล้วยังไม่ได้เลือกขนาด ให้แจ้งเตือนทันที
    if (isMadeToOrder && !selectedSize) {
      setSizeError(true);
      // เลื่อนหน้าจอกลับมาเตือนตรงส่วนเลือกขนาด
      const sizeSection = document.getElementById("size-selection");
      if (sizeSection) {
        sizeSection.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setSizeError(false);

    // สร้างก้อนข้อมูลเพื่อเซฟเข้า ตะกร้าสินค้า
    const cartItem = {
      id: `${product.id}-${selectedSize || "standard"}`, // ป้องกันปัญหารายการเดียวกันแต่เลือกคนละไซส์ทับกัน
      productId: product.id,
      name: product.name + (selectedSize ? ` (ขนาด ${selectedSize})` : ""),
      price: Number(product.price),
      quantity: quantity,
      image: product.images?.[0]?.url || "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=300",
      accessories: selectedSize ? [`รอบข้อมือ/ข้อเท้า: ${selectedSize}`] : [],
    };

    // ดึงตะกร้าเก่ามาตรวจสอบ
    let localCart = [];
    const localCartRaw = localStorage.getItem("bare_cart");
    if (localCartRaw) {
      try {
        localCart = JSON.parse(localCartRaw);
      } catch (e) {
        localCart = [];
      }
    }

    // ตรวจสอบว่ามีของชิ้นนี้ขนาดนี้ในตระกร้าอยู่แล้วหรือไม่
    const existingIndex = localCart.findIndex((item) => item.id === cartItem.id);
    if (existingIndex > -1) {
      localCart[existingIndex].quantity += quantity;
    } else {
      localCart.push(cartItem);
    }

    // บันทึกกลับลง localStorage
    localStorage.setItem("bare_cart", JSON.stringify(localCart));

    // ส่งสัญญาณบอกตัว Header / CartDrawer ให้อัปเดต UI ทันที
    window.dispatchEvent(new Event("cartUpdated"));

    if (shouldRedirect) {
      router.push("/checkout"); // สั่งซื้อด่วน -> ไปหน้าชำระเงินเลย
    } else {
      // เปิด CartDrawer ด่วน (ผ่าน Event หรือแจ้งเตือนความสำเร็จ)
      alert("เพิ่มสินค้าลงตะกร้าเรียบร้อยแล้วค่ะ! ✨");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-anuphan">
      {/* Breadcrumbs */}
      <div className="mb-6 text-sm text-zinc-500 flex items-center gap-2">
        <Link href="/" className="hover:underline text-[#6A5242] font-semibold">หน้าแรก</Link>
        <span>/</span>
        <Link href="/products" className="hover:underline text-[#6A5242] font-semibold">ร้านค้า</Link>
        <span>/</span>
        <span className="text-zinc-800 font-medium line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* รูปภาพสินค้าก้อนใหญ่ซ้ายมือ */}
        <div className="w-full aspect-square rounded-3xl overflow-hidden bg-zinc-50 border border-[#F5F0E6]">
          <img
            src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* ข้อมูลรายละเอียดขวามือ */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            {/* ป้ายกำกับประเภทสินค้า */}
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 ${
              isMadeToOrder ? "bg-[#FFF9E6] text-[#B08A24] border border-[#F5E6BE]" : "bg-[#F0F5EB] text-[#4D6333] border border-[#E0EBD4]"
            }`}>
              {isMadeToOrder ? "🛠️ MADE TO ORDER" : "📦 พร้อมส่ง (Ready-to-Ship)"}
            </span>

            <h1 className="text-2xl md:text-3xl font-black text-[#3C322A]">{product.name}</h1>
            <p className="text-2xl font-black text-[#6A5242] mt-3">
              ฿{Number(product.price).toLocaleString()}
            </p>

            <div className="border-t border-[#F5F0E6] my-5 pt-5">
              <h3 className="font-bold text-[#3C322A]">รายละเอียดสินค้า</h3>
              <p className="text-zinc-600 text-sm mt-2 leading-relaxed whitespace-pre-line">
                {product.description || "สินค้าแฮนด์เมดคุณภาพดีจากวัสดุพรีเมียม ผ่านการคัดสรรค์สไตล์โดยทีมงาน Bare & Bold"}
              </p>
            </div>

            {/* เงื่อนไขกรณีที่เป็นสินค้าแบบ Made to order */}
            {isMadeToOrder && (
              <div id="size-selection" className={`border rounded-2xl p-5 mb-5 transition-all ${
                sizeError ? "border-red-400 bg-red-50/20" : "border-[#F5F0E6] bg-[#FDFBF7]"
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-extrabold text-sm text-[#3C322A]">
                    กรุณาเลือกขนาดที่ต้องการ <span className="text-red-500">*</span>
                  </h3>
                  {sizeError && (
                    <span className="text-xs text-red-500 font-bold animate-pulse">
                      ** จำเป็นต้องเลือกขนาดก่อนทำรายการ
                    </span>
                  )}
                </div>
                
                {/* ปุ่มให้กดขนาดข้อมือ/ข้อเท้า */}
                <div className="flex flex-wrap gap-2">
                  {["14cm", "15cm", "16cm", "17cm", "18cm", "19cm"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                        selectedSize === size
                          ? "bg-[#6A5242] text-white border-[#6A5242] shadow-sm"
                          : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-400 mt-3">
                  💡 คำแนะนำ: หากไม่แน่ใจขนาดรอบข้อมือ/ข้อเท้า สามารถทักแชตเพื่อปรึกษาแอดมินก่อนได้เลยค่ะ
                </p>
              </div>
            )}

            {/* ข้อมูลการจัดส่ง */}
            <div className="p-4 bg-[#FDFBF7] rounded-xl border border-[#F5F0E6] text-xs text-zinc-500 space-y-2">
              <p className="flex gap-2">
                <span>🚚</span>
                <span><strong>ระยะเวลาการจัดส่ง:</strong> {isMadeToOrder ? "สั่งผลิต 3-5 วันทำการ" : "จัดส่งภายในวันถัดไป"}</span>
              </p>
              <p className="flex gap-2">
                <span>✨</span>
                <span>แถมกล่องบรรจุภัณฑ์ Bare & Bold สุดเรียบหรูพร้อมใบรับประกันทุกชิ้น</span>
              </p>
            </div>
          </div>

          {/* แถบการเพิ่ม-ลด และการซื้อ */}
          <div className="border-t border-[#F5F0E6] pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-zinc-500">เลือกจำนวน:</span>
              <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="px-3 py-1.5 hover:bg-zinc-100 text-[#6A5242] font-black transition cursor-pointer"
                >
                  -
                </button>
                <span className="px-5 font-bold text-sm text-[#3C322A]">{quantity}</span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="px-3 py-1.5 hover:bg-zinc-100 text-[#6A5242] font-black transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* ปุ่มทำรายการ */}
            <div className="grid grid-cols-2 gap-4">
              {/* ปุ่มเพิ่มลงตะกร้า */}
              <button
                type="button"
                onClick={() => handleAddToCart(false)}
                className="w-full py-4 border border-[#6A5242] text-[#6A5242] hover:bg-[#FFFDF9] text-xs font-bold rounded-2xl transition duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag01Icon size={16} />
                ใส่ลงตะกร้า
              </button>

              {/* ปุ่มซื้อทันที */}
              <button
                type="button"
                onClick={() => handleAddToCart(true)}
                className="w-full py-4 bg-[#6A5242] hover:bg-[#523e31] text-white text-xs font-bold rounded-2xl transition duration-200 shadow-md text-center flex items-center justify-center cursor-pointer"
              >
                ซื้อตอนนี้เลย
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}