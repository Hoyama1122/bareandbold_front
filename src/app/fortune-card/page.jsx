"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { productService } from "@/services/product.service";
import { Sparkles, Compass, ShieldAlert, Heart, ShoppingBag, ArrowRight } from "lucide-react";

// ฐานข้อมูลหินมงคลและสีกาลกิณีตามวันเกิด (Astrology & Gemstone KB)
const DAY_ASTROLOGY = {
  sunday: {
    name: "วันอาทิตย์",
    element: "ธาตุไฟ",
    luckyColors: ["แดง", "ส้ม", "ทอง"],
    tabooColor: "สีน้ำเงิน / สีคราม (ห้ามใช้)",
    gemstones: ["ทับทิม (Ruby)", "โกเมน (Garnet)", "ซิทริน (Citrine)"],
    focus: {
      wealth: "ซิทริน (Citrine) & ไหมทอง — ดึงดูดทรัพย์ เสริมความมั่งคั่ง",
      work: "ทับทิม (Ruby) — เสริมอำนาจ บารมี ความเป็นผู้นำ",
      love: "โรสควอตซ์ (Rose Quartz) — เมตตามหานิยม คนรักใคร่",
      peace: "อเมทิสต์ (Amethyst) — สงบจิตใจ ลดอารมณ์ร้อน",
    },
  },
  monday: {
    name: "วันจันทร์",
    element: "ธาตุดิน",
    luckyColors: ["ขาว", "เหลือง", "ครีม"],
    tabooColor: "สีแดงสด (ห้ามใช้)",
    gemstones: ["ไข่มุก (Pearl)", "มูนสโตน (Moonstone)", "ซิทริน (Citrine)"],
    focus: {
      wealth: "ซิทริน (Citrine) — เรียกเงินทอง ค้าขายคล่องตัว",
      work: "ลาพิส ลาซูลี (Lapis Lazuli) — สติปัญญา การเจรจาธุรกิจ",
      love: "มูนสโตน (Moonstone) — เสน่ห์ดึงดูด ความรักอบอุ่น",
      peace: "หยกขาว (White Jade) — ความปลอดภัย สุขภาพแข็งแรง",
    },
  },
  tuesday: {
    name: "วันอังคาร",
    element: "ธาตุลม",
    luckyColors: ["ชมพู", "ม่วง"],
    tabooColor: "สีขาว / สีเหลืองนวล (ห้ามใช้)",
    gemstones: ["โรสควอตซ์ (Rose Quartz)", "อเมทิสต์ (Amethyst)", "โรโดโครไซต์ (Rhodochrosite)"],
    focus: {
      wealth: "ไทเกอร์อาย (Tiger Eye) — ป้องกันอุปสรรค เงินทองไม่รั่วไหล",
      work: "นิลดำ (Black Onyx) — จิตใจเด็ดเดี่ยว ชนะคู่แข่ง",
      love: "โรสควอตซ์ (Rose Quartz) — สมานรอยร้าวในความรัก เติมความหวาน",
      peace: "อเมทิสต์ (Amethyst) — คลายความเครียด นอนหลับสบาย",
    },
  },
  wednesday: {
    name: "วันพุธ",
    element: "ธาตุน้ำ",
    luckyColors: ["เขียว", "มรกต", "เทอร์ควอยซ์"],
    tabooColor: "สีชมพู (ห้ามใช้)",
    gemstones: ["มรกต (Emerald)", "หยก (Jade)", "อเวนจูรีน (Aventurine)"],
    focus: {
      wealth: "หยกเขียว (Green Jade) — ความอุดมสมบูรณ์ โชคลาภต่อเนื่อง",
      work: "มาลาไคต์ (Malachite) — การเจรจาประสบความสำเร็จ",
      love: "โรโดไนท์ (Rhodonite) — เข้าใจและให้อภัยกัน",
      peace: "อความารีน (Aquamarine) — จิตใจสงบดุจสายน้ำ",
    },
  },
  thursday: {
    name: "วันพฤหัสบดี",
    element: "ธาตุดิน",
    luckyColors: ["ส้ม", "ทอง", "น้ำตาล"],
    tabooColor: "สีดำ / สีม่วงเข้ม (ห้ามใช้)",
    gemstones: ["ซิทริน (Citrine)", "อำพัน (Amber)", "ไหมทอง (Rutilated Quartz)"],
    focus: {
      wealth: "ไหมทอง (Gold Rutilated Quartz) — พลังดึงดูดความมั่งคั่งระดับสูง",
      work: "ซิทริน (Citrine) — ความคิดสร้างสรรค์ โอกาสใหม่ในหน้าที่การงาน",
      love: "มูนสโตน (Moonstone) — รักแท้และครอบครัวสุขสันต์",
      peace: "คาร์เนเลียน (Carnelian) — เติมพลังชีวิต ความกระปรี้กระเปร่า",
    },
  },
  friday: {
    name: "วันศุกร์",
    element: "ธาตุน้ำ",
    luckyColors: ["ฟ้า", "น้ำเงิน", "ขาว"],
    tabooColor: "สีเทา / สีดำด้าน (ห้ามใช้)",
    gemstones: ["ลาพิส ลาซูลี (Lapis Lazuli)", "อความารีน (Aquamarine)", "เทอร์ควอยซ์ (Turquoise)"],
    focus: {
      wealth: "ไพไรต์ (Pyrite) — แร่ดูดทรัพย์ เงินทองไหลมาเทมา",
      work: "ลาพิส ลาซูลี (Lapis Lazuli) — ชื่อเสียงเกียรติยศ วิสัยทัศน์กว้างไกล",
      love: "โรสควอตซ์ (Rose Quartz) — เสน่ห์อันอ่อนหวาน ผู้ใหญ่เอ็นดู",
      peace: "บลูเลซอาเกต (Blue Lace Agate) — ความผ่อนคลาย สื่อสารราบรื่น",
    },
  },
  saturday: {
    name: "วันเสาร์",
    element: "ธาตุไฟ",
    luckyColors: ["ดำ", "ม่วง", "น้ำเงินเข้ม"],
    tabooColor: "สีเขียวสด (ห้ามใช้)",
    gemstones: ["นิลดำ (Black Onyx)", "อเมทิสต์ (Amethyst)", "สโมกกี้ควอตซ์ (Smoky Quartz)"],
    focus: {
      wealth: "ไหมเงิน / ไหมนาค — ค้าขายมั่นคง ปลดหนี้สิน",
      work: "นิลดำ (Black Onyx) — ปกป้องพลังลบ เสริมบารมีหนักแน่น",
      love: "โกเมน (Garnet) — ความซื่อสัตย์ มั่นคงในรักเดียว",
      peace: "อเมทิสต์ (Amethyst) — ป้องกันฝันร้าย เพิ่มสมาธิ",
    },
  },
};

export default function FortuneCardPage() {
  const [step, setStep] = useState(1);
  const [dayOfWeek, setDayOfWeek] = useState("sunday");
  const [aspect, setAspect] = useState("wealth");
  const [realProducts, setRealProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [flippedCards, setFlippedCards] = useState([false, false, false, false]);

  useEffect(() => {
    // โหลดสินค้ากำไล/เครื่องประดับจริงจาก Database
    productService
      .getProducts()
      .then((res) => {
        if (res.success && Array.isArray(res.products)) {
          setRealProducts(res.products);
        }
      })
      .catch((err) => console.error("Failed to load products for fortune card:", err))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handlePredictSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const currentAstro = DAY_ASTROLOGY[dayOfWeek] || DAY_ASTROLOGY.sunday;

  const selectCard = (cardIndex) => {
    const newFlipped = [...flippedCards];
    newFlipped[cardIndex] = true;
    setFlippedCards(newFlipped);

    // เลือกสินค้าจริงใน DB ตาม aspect หรือเลือกจากรายการที่มี
    let matchedProduct = null;
    if (realProducts.length > 0) {
      if (aspect === "wealth") {
        matchedProduct =
          realProducts.find((p) => p.name.includes("Citrine") || p.name.includes("ซิทริน") || p.name.includes("Wealth")) ||
          realProducts[0];
      } else if (aspect === "love") {
        matchedProduct =
          realProducts.find((p) => p.name.includes("Rose") || p.name.includes("โรส") || p.name.includes("Romance")) ||
          realProducts[1 % realProducts.length];
      } else if (aspect === "work") {
        matchedProduct =
          realProducts.find((p) => p.name.includes("Onyx") || p.name.includes("นิล") || p.name.includes("Classic")) ||
          realProducts[2 % realProducts.length];
      } else {
        matchedProduct = realProducts[(cardIndex + 1) % realProducts.length];
      }
    }

    setSelectedProduct(matchedProduct);

    setTimeout(() => {
      setStep(3);
    }, 750);
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    const currentCart = JSON.parse(localStorage.getItem("bare_cart") || "[]");
    const thumb = selectedProduct.images?.[0]?.url || "/images/placeholder.jpg";
    const newItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: Number(selectedProduct.price),
      quantity: 1,
      imageUrl: thumb,
      shopId: selectedProduct.shopId,
    };

    const existingIndex = currentCart.findIndex((i) => i.id === newItem.id);
    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push(newItem);
    }

    localStorage.setItem("bare_cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert(`เพิ่ม "${selectedProduct.name}" ลงในตะกร้าสินค้าเรียบร้อยแล้ว!`);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3C322A] font-anuphan flex flex-col justify-between selection:bg-[#EADECC]">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full my-8">
        {/* Step 1: Input วันเกิด + ด้านที่ต้องการเสริม */}
        {step === 1 && (
          <div className="w-full max-w-md bg-white border border-[#EADECC] p-8 rounded-2xl shadow-sm text-center animate-fadeIn">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#556B2F]/10 text-[#556B2F] mb-3">
              <Sparkles size={14} />
              AI &amp; Gemstone Recommender
            </span>
            <h1 className="text-2xl font-bold mb-2 tracking-wide text-[#3C322A]">
              ทำนายและจับคู่หินมงคลประจำตัว
            </h1>
            <p className="text-sm text-[#8C8577] mb-6">
              วิเคราะห์พลังธาตุตามวันเกิด พร้อมค้นหากำไลหินมงคลที่ช่วยเปิดดวงชะตาและสีเชือกที่ถูกโฉลก
            </p>

            <form onSubmit={handlePredictSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-[#6A5242] mb-1.5">
                  คุณเกิดวันอะไร?
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EADECC] bg-[#FDFBF7] text-sm text-[#3C322A] focus:outline-hidden focus:border-[#556B2F] font-medium"
                >
                  <option value="sunday">วันอาทิตย์ (ธาตุไฟ)</option>
                  <option value="monday">วันจันทร์ (ธาตุดิน)</option>
                  <option value="tuesday">วันอังคาร (ธาตุลม)</option>
                  <option value="wednesday">วันพุธ (ธาตุน้ำ)</option>
                  <option value="thursday">วันพฤหัสบดี (ธาตุดิน)</option>
                  <option value="friday">วันศุกร์ (ธาตุน้ำ)</option>
                  <option value="saturday">วันเสาร์ (ธาตุไฟ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#6A5242] mb-1.5">
                  เรื่องที่ต้องการเสริมดวงมากที่สุดในตอนนี้
                </label>
                <select
                  value={aspect}
                  onChange={(e) => setAspect(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#EADECC] bg-[#FDFBF7] text-sm text-[#3C322A] focus:outline-hidden focus:border-[#556B2F] font-medium"
                >
                  <option value="wealth">เสริมการเงิน โชคลาภ และค้าขายร่ำรวย</option>
                  <option value="work">เสริมการงาน อำนาจ บารมี และความก้าวหน้า</option>
                  <option value="love">เสริมความรัก เสน่ห์เมตตามหานิยม</option>
                  <option value="peace">เสริมสุขภาพ จิตใจสงบ และปัดเป่าพลังลบ</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Compass size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <span>ระบบจะจับคู่กับกำไลแฮนด์เมดจริงที่มีจำหน่ายบน Marketplace ทันที</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#6A5242] text-white font-bold text-sm hover:bg-[#556B2F] transition duration-200 shadow-sm cursor-pointer"
              >
                เปิดไพ่สุ่มกำไลหินมงคล →
              </button>
            </form>
          </div>
        )}

        {/* Step 2: เลือกการ์ดสุ่มดวง 4 ใบ */}
        {step === 2 && (
          <div className="w-full text-center animate-fadeIn">
            <h2 className="text-xl font-bold mb-1 text-[#3C322A]">
              เลือกการ์ดพลังงาน 1 ใบ เพื่อเชื่อมโยงดวงชะตา
            </h2>
            <p className="text-xs text-[#8C8577] mb-8">
              คนเกิด{currentAstro.name} ({currentAstro.element}) · กำหนดจิตนิ่งๆ แล้วคลิกการ์ดที่คุณรู้สึกดึงดูดที่สุด
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[0, 1, 2, 3].map((cardIdx) => (
                <div
                  key={cardIdx}
                  onClick={() => selectCard(cardIdx)}
                  className={`h-64 rounded-2xl border-2 border-[#EADECC] flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-[#6A5242] shadow-sm ${
                    flippedCards[cardIdx] ? "bg-[#556B2F] text-white" : "bg-white text-[#6A5242]"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center mb-3">
                    <Sparkles size={20} />
                  </div>
                  <span className="font-bold text-sm tracking-widest uppercase">
                    CARD #{cardIdx + 1}
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-1">BARE &amp; BOLD</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: ผลลัพธ์คำทำนาย + กำไลหินมงคลจริงใน DB */}
        {step === 3 && (
          <div className="w-full max-w-2xl bg-white border border-[#EADECC] rounded-3xl p-6 sm:p-8 shadow-sm animate-fadeIn">
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EADECC]/60 pb-4 mb-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#556B2F]/10 text-[#556B2F]">
                  ดวงชะตาคนเกิด{currentAstro.name} ({currentAstro.element})
                </span>
                <h2 className="text-xl font-extrabold text-[#3C322A] mt-1.5">
                  ผลการวิเคราะห์หินมงคลเสริมชะตา
                </h2>
              </div>
              <button
                onClick={() => {
                  setStep(1);
                  setFlippedCards([false, false, false, false]);
                }}
                className="text-xs text-[#8C8577] hover:underline"
              >
                ← ดูดวงวันอื่น
              </button>
            </div>

            {/* Astrology Advice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
                <p className="font-bold text-sm flex items-center gap-1.5 text-emerald-800">
                  <Sparkles size={15} /> หินมงคลที่แนะนำ:
                </p>
                <p>{currentAstro.focus[aspect]}</p>
                <p className="pt-1 text-[11px] text-emerald-700">
                  <strong>โทนสีมงคล:</strong> {currentAstro.luckyColors.join(", ")}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-xs text-rose-900 space-y-1">
                <p className="font-bold text-sm flex items-center gap-1.5 text-rose-800">
                  <ShieldAlert size={15} /> สีกาลกิณีที่ควรหลีกเลี่ยง:
                </p>
                <p className="font-semibold text-rose-700">{currentAstro.tabooColor}</p>
                <p className="pt-1 text-[11px] text-rose-600">
                  *ห้ามเลือกใช้สีเชือกถักโทนนี้สำหรับคนเกิด{currentAstro.name}
                </p>
              </div>
            </div>

            {/* Matched Real Product Card */}
            {selectedProduct ? (
              <div className="rounded-2xl border border-[#EADECC] p-5 bg-[#FAF8F5] flex flex-col sm:flex-row gap-5 items-center">
                <img
                  src={selectedProduct.images?.[0]?.url || "/images/placeholder.jpg"}
                  alt={selectedProduct.name}
                  className="w-32 h-32 rounded-xl object-cover border border-[#EADECC] shrink-0"
                />
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#6A5242]/10 text-[#6A5242] text-[11px] font-bold">
                    สินค้าจริงที่ตรงกับดวงชะตาของคุณ
                  </span>
                  <h3 className="text-base font-extrabold text-[#3C322A] mt-1 truncate">
                    {selectedProduct.name}
                  </h3>
                  <p className="text-xs text-[#8C8577] mt-1 line-clamp-2">
                    {selectedProduct.description || "กำไลหินมงคลคัดพิเศษ ร้อยด้วยมือ ปราศจากสีเชือกกาลกิณี เสริมพลังงานบวกในทุกๆ วัน"}
                  </p>
                  <p className="text-lg font-extrabold text-[#556B2F] mt-2">
                    ฿{Number(selectedProduct.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-neutral-400">
                {loadingProducts ? "กำลังค้นหากำไลที่ตรงกับดวงชะตา..." : "ไม่พบสินค้าที่ตรงกันในขณะนี้"}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-3 mt-6 pt-4 border-t border-[#EADECC]/60">
              {selectedProduct && (
                <>
                  <Link
                    href={`/products/${selectedProduct.id}`}
                    className="px-5 py-2.5 rounded-xl border border-[#EADECC] text-xs font-bold text-[#6A5242] hover:bg-[#F5F0E6] transition"
                  >
                    ดูรายละเอียดสินค้า
                  </Link>
                  <button
                    onClick={addToCart}
                    className="px-6 py-2.5 rounded-xl bg-[#556B2F] hover:bg-[#435524] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag size={14} />
                    ใส่ตะกร้าและสั่งซื้อทันที
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
