import React from "react";

export default function ProductInfo({
  product,
  material,
  setMaterial,
  size,
  setSize,
  qty,
  setQty,
  addToCart,
  buyNow,
  isLiked,
  toggleWishlist
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
        <div className="mt-4 border-b border-gray-100 pb-6">
  {product.stock === 0 ? (
  <p className="text-red-600 font-semibold">
    ❌ สินค้าหมด
  </p>
) : product.stock <= 5 ? (
  <p className="text-orange-500 font-semibold">
    เหลือเพียง {product.stock} ชิ้น
  </p>
) : (
  <p className="text-green-600 font-semibold">
    เหลือสินค้า {product.stock} ชิ้น
  </p>
)}
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
  disabled={product.stock === 0 || qty >= product.stock}
  onClick={() => {
    if (qty < product.stock) {
      setQty(qty + 1);
    }
  }}
  className="w-10 h-10 bg-gray-50 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-600 transition active:scale-95 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
>
  +
</button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 mt-10">
        <div className="flex gap-3">
          <button
            onClick={addToCart}
            disabled={product.stock === 0}
            className={`flex-1 py-4 rounded-xl font-bold transition duration-200 text-sm ${
              product.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "border border-[#7a5b46] text-[#7a5b46] hover:bg-[#7a5b46]/5 cursor-pointer"
            }`}
          >
            {product.stock === 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
          </button>
          
          <button
            onClick={toggleWishlist}
            className="w-14 h-14 border border-gray-200 hover:border-red-200 rounded-xl flex items-center justify-center transition cursor-pointer active:scale-95 group/heart"
            title="ถูกใจสินค้า"
          >
            <svg
              className={`w-6 h-6 transition-colors ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-400 group-hover/heart:text-red-500"
              }`}
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        <button
          onClick={buyNow}
          disabled={product.stock === 0}
          className={`w-full py-4 rounded-xl font-bold transition duration-200 text-sm ${
            product.stock === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#7a5b46] text-white hover:bg-[#7a5b46]/90 cursor-pointer"
          }`}
        >
          สั่งซื้อทันที
        </button>
      </div>
    </div>
  );
}
