"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Link from "next/link";

export default function FortuneCardPage() {
  const productDatabase = [
    {
      id: 1,
      name: "กำไลหินมงคล Bare & Bold Minimalist",
      category: "ธาตุดิน — เสริมความมั่นคง & บารมี",
      price: "790",
      image: "https://images.unsplash.com/photo-1611591475140-be3617c980d4?auto=format&fit=crop&w=600&q=80",
      desc: "กำไลหินธรรมชาติคัดพิเศษ ดีไซน์เรียบหรู เสริมสมาธิและความเรียบง่าย ชักนำโอกาสและมิตรภาพที่ดี"
    },
    {
      id: 2,
      name: "เทียนหอมอโรมา Organic Soy Wax กลิ่น Earth & Olive",
      category: "ธาตุน้ำ — ผ่อนคลาย & ฟื้นฟูพลังชีวิต",
      price: "450",
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
      desc: "สกัดจากไขถั่วเหลืองธรรมชาติ 100% ให้กลิ่นหอมอบอุ่น สดชื่น ช่วยลดความตึงเครียดหลังทำงาน"
    },
    {
      id: 3,
      name: "สมุดบันทึกปกหนังทำมือเกรดพรีเมียม",
      category: "ธาตุลม — ปัญญา & ไอเดียสร้างสรรค์",
      price: "520",
      image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&q=80",
      desc: "สมุดบันทึกกรีดกระดาษถนอมสายตาอย่างดี เหมาะแก่การจดบันทึกเป้าหมาย แรงบันดาลใจ และแผนงานสำคัญ"
    },
    {
      id: 4,
      name: "แก้วสแตนเลสเก็บความเย็น ลาย Bare Natural",
      category: "ธาตุไฟ — เติมพลังความกระตือรือร้น",
      price: "690",
      image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
      desc: "เก็บความเย็นได้ยาวนานตลอด 24 ชั่วโมง ดีไซน์เอิร์ธโทนสุดคลาสสิก พกพาสะดวกพร้อมลุยทุกกิจกรรม"
    }
  ];

  const monthReadings = {
    1: "ชาวเดือนมกราคมมีความตั้งใจสูงและรอบคอบ สินค้านี้จะช่วยส่งเสริมสมาธิและเปิดทางความสำเร็จ",
    2: "ชาวเดือนกุมภาพันธ์มีเสน่ห์เฉพาะตัวและจินตนาการกว้างไกล สินค้านี้จะช่วยดึงความโดดเด่นในตัวคุณ",
    3: "ชาวเดือนมีนาคมจิตใจอ่อนโยนละเอียดอ่อน สินค้านี้จะช่วยเติมเต็มพลังงานความสุขและผ่อนคลายจิตใจ",
    4: "ชาวเดือนเมษายนเปี่ยมด้วยความมุ่งมั่นและพลังงาน สินค้านี้ตอบโจทย์ไลฟ์สไตล์ที่แอคทีฟของคุณ",
    5: "ชาวเดือนพฤษภาคมมีความมั่นคง หนักแน่น สินค้านี้สร้างความคุ้มค่าและความลงตัวให้ชีวิตคุณ",
    6: "ชาวเดือนมิถุนายนปรับตัวเก่งและมีมนุษยสัมพันธ์ดี สินค้านี้จะช่วยเพิ่มออร่าความโชคดีในทุกโอกาส",
    7: "ชาวเดือนกรกฎาคมรักความอบอุ่นและใส่ใจรายละเอียด สินค้านี้จะเติมเต็มความสบายใจในพื้นที่ส่วนตัว",
    8: "ชาวเดือนสิงหาคมมีความเป็นผู้นำสูง สินค้านี้จะช่วยเสริมบุคลิกและความมั่นใจให้เปล่งประกาย",
    9: "ชาวเดือนกันยายนรักความระเบียบพิถีพิถัน สินค้านี้ผ่านการคัดสรรสเปกและคุณภาพมาเพื่อคุณโดยเฉพาะ",
    10: "ชาวเดือนตุลาคมรักความยุติธรรมและศิลปะ สินค้านี้เติมเต็มความสมดุลและความสวยงามให้ชีวิต",
    11: "ชาวเดือนพฤศจิกายนมีพลังค้นหาลึกซึ้ง สินค้านี้ซ่อนโชคลาภและความประทับใจที่คุณคาดไม่ถึง",
    12: "ชาวเดือนธันวาคมรักอิสระและมีความสุขง่าย สินค้านี้ส่งต่อรอยยิ้มและความผ่องใสให้ทุกวันของคุณ"
  };

  const [step, setStep] = useState(1);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [flippedCards, setFlippedCards] = useState([false, false, false, false]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDobSubmit = (e) => {
    e.preventDefault();
    if (!day || !month) return;
    setStep(2);
  };

  const selectCard = (cardIndex) => {
    const magicSeed = (parseInt(day) * 3 + parseInt(month) * 7 + cardIndex * 5) % productDatabase.length;
    setSelectedProduct(productDatabase[magicSeed]);

    const newFlipped = [...flippedCards];
    newFlipped[cardIndex] = true;
    setFlippedCards(newFlipped);

    setTimeout(() => {
      setStep(3);
    }, 750);
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    const currentCart = JSON.parse(localStorage.getItem('bare_cart') || '[]');
    const newItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: Number(selectedProduct.price),
      quantity: 1,
      imageUrl: selectedProduct.image
    };
    
    const existingIndex = currentCart.findIndex(i => i.id === newItem.id);
    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push(newItem);
    }
    
    localStorage.setItem('bare_cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event('cartUpdated'));
    setIsModalOpen(true);
  };

  const resetApp = () => {
    setFlippedCards([false, false, false, false]);
    setSelectedProduct(null);
    setDay("");
    setMonth("");
    setStep(1);
  };

  const monthNames = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#3C322A] flex flex-col justify-between relative overflow-x-hidden font-anuphan">
      {/* Navbar / Header หลักของเว็บ BARE & BOLD */}
      <Header />

      {/* Background Soft Glows */}
      <div className="absolute top-32 left-12 w-80 h-80 bg-[#E7DDC8]/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-12 right-12 w-96 h-96 bg-[#556B2F]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl mx-auto my-auto py-10 z-10 flex flex-col items-center px-4">
        {/* STEP 1: Form */}
        {step === 1 && (
          <section className="w-full max-w-md bg-white border border-[#E7DDC8] rounded-3xl p-8 shadow-xl shadow-[#3C322A]/5">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F5F0E6] border border-[#E7DDC8] text-[#556B2F] mb-4">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#3C322A] mb-2 font-prompt">เลือกวันเกิดของคุณ</h2>
              <p className="text-xs text-zinc-500">ระบุวันและเดือนเกิด เพื่อสุ่มหาการ์ดสินค้าที่เหมาะกับโชคชะตาของคุณ</p>
            </div>

            <form onSubmit={handleDobSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3C322A] mb-2">วันเกิด</label>
                  <select 
                    value={day} 
                    onChange={(e) => setDay(e.target.value)} 
                    required 
                    className="w-full bg-[#FAF8F5] border border-[#E7DDC8] rounded-xl px-4 py-3 text-sm text-[#3C322A] font-medium focus:outline-none focus:ring-2 focus:ring-[#556B2F]"
                  >
                    <option value="" disabled>เลือกวัน</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3C322A] mb-2">เดือนเกิด</label>
                  <select 
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)} 
                    required 
                    className="w-full bg-[#FAF8F5] border border-[#E7DDC8] rounded-xl px-4 py-3 text-sm text-[#3C322A] font-medium focus:outline-none focus:ring-2 focus:ring-[#556B2F]"
                  >
                    <option value="" disabled>เลือกเดือน</option>
                    {monthNames.slice(1).map((m, i) => (
                      <option key={i + 1} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-4 px-6 bg-[#3C322A] hover:bg-[#556B2F] text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>เปิดประตูแห่งโชคชะตา</span>
                <span>→</span>
              </button>
            </form>
          </section>
        )}

        {/* STEP 2: Pick A Card */}
        {step === 2 && (
          <section className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
              <span className="inline-block bg-[#F5F0E6] border border-[#E7DDC8] text-[#8B5A2B] text-xs font-bold px-4 py-1.5 rounded-full mb-3">
                ✦ ดวงคนเกิดวันที่ {day} {monthNames[month]}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#3C322A] mb-2 font-prompt">เลือกการ์ดนำโชค 1 ใบ</h2>
              <p className="text-xs text-zinc-500">ตั้งจิตอธิษฐาน แล้วเลือกการ์ดที่แรงดึงดูดนำทางคุณ</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-3xl px-2">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} onClick={() => selectCard(idx)} className="cursor-pointer h-64 md:h-80" style={{ perspective: '1000px' }}>
                  <div className={`relative w-full h-full duration-700 transition-transform ${flippedCards[idx] ? '[transform:rotateY(180deg)]' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
                    <div className="absolute inset-0 bg-[#3C322A] border-2 border-[#E7DDC8] rounded-2xl p-4 flex flex-col justify-between items-center shadow-xl hover:border-[#556B2F] transition-colors" style={{ backfaceVisibility: 'hidden' }}>
                      <span className="text-[#E7DDC8]/60 text-xs">✦</span>
                      <div className="w-12 h-12 rounded-full border border-[#E7DDC8]/40 flex items-center justify-center text-[#E7DDC8]">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-[#E7DDC8] uppercase tracking-widest font-mono font-bold">CARD {idx + 1}</span>
                      <span className="text-[#E7DDC8]/60 text-xs">✦</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STEP 3: Result View */}
        {step === 3 && selectedProduct && (
          <section className="w-full flex flex-col items-center">
            <div className="bg-white border border-[#E7DDC8] rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl shadow-[#3C322A]/10">
              <div className="text-center mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F5F0E6] text-[#8B5A2B] border border-[#E7DDC8] mb-2">
                  ✦ สินค้าที่ดวงชะตานำทางให้คุณ
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-[#3C322A] font-prompt">{selectedProduct.category}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="relative rounded-2xl overflow-hidden border border-[#E7DDC8] bg-[#FAF8F5] aspect-square">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-[#3C322A] px-3 py-1 rounded-full text-xs font-bold text-[#FAF8F5]">
                    ฿{selectedProduct.price}
                  </div>
                </div>

                <div className="flex flex-col justify-between h-full space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#3C322A] mb-2 font-prompt">{selectedProduct.name}</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed mb-4">{selectedProduct.desc}</p>
                    <div className="bg-[#FAF8F5] border border-[#E7DDC8] rounded-xl p-3.5">
                      <div className="text-xs font-bold text-[#8B5A2B] mb-1 flex items-center gap-1.5">
                        ✦ ทำไมชิ้นนี้ถึงเหมาะกับดวงคุณ?
                      </div>
                      <p className="text-xs text-[#3C322A] leading-relaxed italic">"{monthReadings[month]}"</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button 
                      onClick={addToCart} 
                      className="flex-1 py-3 px-4 bg-[#3C322A] hover:bg-[#556B2F] text-white font-bold rounded-xl shadow-md text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>หยิบใส่ตะกร้าทันที</span>
                    </button>
                    <button 
                      onClick={resetApp} 
                      className="py-3 px-4 bg-[#F5F0E6] hover:bg-[#E7DDC8] border border-[#E7DDC8] text-[#3C322A] font-bold rounded-xl text-sm transition-all cursor-pointer"
                    >
                      <span>สุ่มใหม่</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7DDC8] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#F5F0E6] border border-[#E7DDC8] text-[#556B2F] flex items-center justify-center mx-auto mb-4 text-xl">
              ✓
            </div>
            <h3 className="text-lg font-bold text-[#3C322A] mb-2 font-prompt">เพิ่มลงตะกร้าเรียบร้อย!</h3>
            <p className="text-xs text-zinc-600 mb-6">เพิ่ม "{selectedProduct?.name}" เข้าสู่ตะกร้าเรียบร้อยแล้ว</p>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="w-full py-2.5 bg-[#3C322A] hover:bg-[#556B2F] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              เลือกสินค้าอื่นต่อ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}