{/* ส่วนรีวิวสินค้า (Product Reviews Section) */}
<section id="reviews" className="mt-16 pt-10 border-t border-[#E7DDC8]">
  <h2 className="text-xl font-bold text-[#3C322A] mb-6 font-prompt">คะแนนและรีวิวของสินค้า</h2>

  {/* กล่องสรุปคะแนนรวม */}
  <div className="bg-white border border-[#E7DDC8] rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
      
      {/* คะแนนเฉลี่ยด้านซ้าย */}
      <div className="text-center md:text-left">
        <div className="text-4xl md:text-5xl font-bold text-[#3C322A] mb-1 font-prompt">
          4.9 <span className="text-lg font-normal text-zinc-400">เต็ม 5</span>
        </div>
        <div className="flex justify-center md:justify-start text-amber-500 gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          ))}
        </div>
        <span className="text-xs text-zinc-500">จากทั้งหมด 15 รีวิว</span>
      </div>

      {/* ปุ่มกรองฟิลเตอร์ (Filter Badges) */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        <span className="px-4 py-2 bg-[#3C322A] text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm">ทั้งหมด (15)</span>
        <span className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#F5F0E6] border border-[#E7DDC8] text-[#3C322A] text-xs font-medium rounded-xl cursor-pointer transition">5 ดาว (12)</span>
        <span className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#F5F0E6] border border-[#E7DDC8] text-[#3C322A] text-xs font-medium rounded-xl cursor-pointer transition">4 ดาว (3)</span>
        <span className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#F5F0E6] border border-[#E7DDC8] text-[#3C322A] text-xs font-medium rounded-xl cursor-pointer transition">มีรูปภาพ/วิดีโอ (5)</span>
      </div>

    </div>
  </div>

  {/* รายการรีวิวจากผู้ใช้ */}
  <div className="space-y-6">
    
    {/* รีวิวที่ 1 */}
    <div className="bg-white border border-[#E7DDC8] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#F5F0E6] border border-[#E7DDC8] flex items-center justify-center font-bold text-[#3C322A] text-sm">
          F
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#3C322A]">folk*****0</h4>
          <div className="flex text-amber-500 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            ))}
          </div>
        </div>
        <span className="ml-auto text-[11px] text-zinc-400">2026-06-15 11:53</span>
      </div>

      <div className="text-xs text-zinc-600 space-y-1 mb-4">
        <p><strong className="text-[#3C322A]">ประสิทธิภาพ:</strong> ดีเยี่ยม งานประณีต</p>
        <p><strong className="text-[#3C322A]">เนื้อสัมผัส:</strong> เรียบเนียน ไม่ระคายเคืองผิว</p>
      </div>

      <p className="text-xs text-[#3C322A] leading-relaxed mb-4">
        สินค้าตรงปก งานแฮนด์เมดมีความสวยงามเป็นเอกลักษณ์ตามสไตล์ Bare & Bold ใส่แล้วเข้ากับทุกลุค ประทับใจมากครับ จัดส่งไว แพ็กเกจจิ้งเรียบร้อยดีมาก 🌟
      </p>

      {/* รูปภาพรีวิวตัวอย่าง */}
      <div className="flex gap-2">
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#E7DDC8] bg-[#FAF8F5]">
          <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=200" alt="review" className="w-full h-full object-cover" />
        </div>
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#E7DDC8] bg-[#FAF8F5]">
          <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=200" alt="review" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    {/* รีวิวที่ 2 */}
    <div className="bg-white border border-[#E7DDC8] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#F5F0E6] border border-[#E7DDC8] flex items-center justify-center font-bold text-[#3C322A] text-sm">
          A
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#3C322A]">alice_s*****</h4>
          <div className="flex text-amber-500 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            ))}
          </div>
        </div>
        <span className="ml-auto text-[11px] text-zinc-400">2026-06-10 14:20</span>
      </div>

      <div className="text-xs text-zinc-600 space-y-1 mb-4">
        <p><strong className="text-[#3C322A]">ความคุ้มค่า:</strong> ดีมาก สวยคุ้มราคา</p>
      </div>

      <p className="text-xs text-[#3C322A] leading-relaxed">
        ชอบมากๆ ค่ะ ดีไซน์มินิมอล ใส่ติดข้อมือได้ตลอดเลย ไว้จะมาอุดหนุนเพิ่มอีกแน่นอนค่ะ 💖
      </p>
    </div>

  </div>
</section>