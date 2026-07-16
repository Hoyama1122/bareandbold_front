import React from "react";

export default function ProductInfo({
  product,
  material,
  setMaterial,
  size,
  setSize,
  qty,
  setQty,
  addToCart
}) {
  return (
    <div className="flex flex-col justify-between font-sans">
      <div>
        {/* Category / Breadcrumb mini tag */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          <span>Bare & Bold</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{product.category === "ANKLET" ? "กำไลข้อเท้า" : "กำไลข้อมือ"}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {product.name}
        </h1>

        {/* Price block - Nike minimalist style */}
        <div className="flex items-baseline gap-3 mt-4">
          <span className="text-3xl text-gray-900 font-extrabold">
            ฿{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-base text-gray-400 line-through">
                ฿{product.originalPrice.toLocaleString()}
              </span>
              <span className="bg-zinc-100 text-zinc-600 text-[11px] font-bold px-2 py-0.5 rounded border border-zinc-200">
                ลด {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>

        <div className="mt-8 text-zinc-600 text-sm leading-relaxed border-b border-gray-100 pb-8 font-anuphan">
          {product.description}
        </div>

        {/* OPTIONS - MADE TO ORDER */}
        {product.type === "MADE_TO_ORDER" && (
          <div className="mt-8 space-y-6">
            <div>
              <p className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-3">
                วัสดุห่วงเชื่อม / โซ่ปรับระดับ
              </p>
              <div className="flex flex-wrap gap-2.5">
                {["Silver", "Gold", "Rose Gold"].map((mat) => (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => setMaterial(mat)}
                    className={`px-5 py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      material === mat
                        ? "border-[#7a5b46] bg-[#7a5b46] text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-3">
                ขนาดความยาวข้อมือ (ซม.)
              </p>
              <div className="flex flex-wrap gap-2">
                {["14 cm", "15 cm", "16 cm", "17 cm", "18 cm"].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSize(sz)}
                    className={`w-12 h-12 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      size === sz
                        ? "border-[#7a5b46] bg-[#7a5b46] text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {sz.replace(" cm", "")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mt-8">
          <p className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-3">จำนวนสินค้า</p>
          <div className="flex items-center gap-1 w-fit border border-gray-200 rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => qty > 1 && setQty(qty - 1)}
              className="w-10 h-10 bg-gray-50 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-600 transition active:scale-95 cursor-pointer border-0"
            >
              -
            </button>
            <span className="w-10 text-center font-extrabold text-gray-800 text-sm">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(qty + 1)}
              className="w-10 h-10 bg-gray-50 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-600 transition active:scale-95 cursor-pointer border-0"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-10">
        <button
          onClick={addToCart}
          className="w-full py-4 border border-[#7a5b46] text-[#7a5b46] hover:bg-[#7a5b46]/5 rounded-xl font-bold transition duration-200 active:scale-98 cursor-pointer text-center text-sm"
        >
          เพิ่มลงตะกร้า
        </button>
        <button
          className="w-full py-4 bg-[#7a5b46] text-white hover:bg-[#7a5b46]/90 rounded-xl font-bold transition duration-200 active:scale-98 cursor-pointer text-center text-sm"
        >
          สั่งซื้อทันที
        </button>
      </div>
    </div>
  );
}
