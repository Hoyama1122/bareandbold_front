import React from "react";

export default function ProductInfo({
  product,
  material,
  setMaterial,
  size,
  setSize,
  selectedAccessories = [],
  setSelectedAccessories,
  qty,
  setQty,
  addToCart,
  buyNow,
  isLiked,
  toggleWishlist
}) {
  const customOptionsPrice = product.customOptions?.reduce((sum, opt) => {
    const selectedVal = opt.values?.find(val => {
      const valName = typeof val === "string" ? val : (val.value || val.name);
      return valName === size || valName === material;
    });
    const adj = selectedVal?.priceAdjustment ? Number(selectedVal.priceAdjustment) : 0;
    return sum + adj;
  }, 0) || 0;

  const accessoriesPrice = selectedAccessories.reduce((sum, acc) => {
    return sum + (acc.price ? Number(acc.price) : 0);
  }, 0);

  const basePrice = Number(product.price);
  const totalPrice = (basePrice + customOptionsPrice + accessoriesPrice) * qty;

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
          {product.type === "READY_TO_SHIP" && product.stock === 0 ? (
            <p className="text-red-600 font-semibold">
              ❌ สินค้าหมด
            </p>
          ) : product.type === "READY_TO_SHIP" && product.stock <= 5 ? (
            <p className="text-orange-500 font-semibold">
              เหลือเพียง {product.stock} ชิ้น
            </p>
          ) : product.type === "READY_TO_SHIP" ? (
            <p className="text-green-600 font-semibold">
              เหลือสินค้า {product.stock} ชิ้น
            </p>
          ) : (
            <p className="text-amber-700 font-semibold flex items-center gap-1.5">
              สินค้าสั่งทำพิเศษ (Made to Order - สั่งผลิตตามคำสั่งซื้อ)
            </p>
          )}
        </div>

        {/* OPTIONS - MADE TO ORDER */}
        {product.type === "MADE_TO_ORDER" && (
          <div className="mt-8 space-y-6">
            {product.customOptions && product.customOptions.length > 0 ? (
              product.customOptions.map((opt) => (
                <div key={opt.id || opt.name}>
                  <p className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-3">
                    {opt.name}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {opt.values && opt.values.map((val) => {
                      const valName = typeof val === "string" ? val : (val.value || val.name);
                      const isSelected = (material === valName || size === valName);
                      const priceAdj = val.priceAdjustment ? Number(val.priceAdjustment) : 0;
                      return (
                        <button
                          key={val.id || valName}
                          type="button"
                          onClick={() => {
                            if (opt.name.toLowerCase().includes("ขนาด")) {
                              setSize(valName);
                            } else {
                              setMaterial(valName);
                            }
                          }}
                          className={`px-5 py-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#7a5b46] bg-[#7a5b46] text-white"
                              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {valName}
                          {priceAdj > 0 && ` (+฿${priceAdj})`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <>
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
                    {["12 cm", "12.5 cm", "13 cm", "14 cm", "15 cm", "16 cm"].map((sz) => (
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
              </>
            )}
          </div>
        )}

        {/* LINKED ACCESSORIES FOR CUSTOM PRODUCT */}
        {product.accessories && product.accessories.length > 0 && (() => {
          const groups = {};
          product.accessories.forEach((item) => {
            const acc = item.accessory;
            if (!acc) return;
            let categoryName = acc.category?.name;
            if (!categoryName) {
              const nameLower = (acc.name || "").toLowerCase();
              if (nameLower.includes("จี้") || nameLower.includes("charm") || nameLower.includes("ดาว") || nameLower.includes("หัวใจ") || nameLower.includes("แมว")) {
                categoryName = "CHARM";
              } else if (nameLower.includes("หิน") || nameLower.includes("bead") || nameLower.includes("นิล") || nameLower.includes("โรส") || nameLower.includes("เทอร์") || nameLower.includes("หินสี") || nameLower.includes("หินนำโชค")) {
                categoryName = "BEAD";
              } else if (nameLower.includes("เชือก") || nameLower.includes("หนัง") || nameLower.includes("cord") || nameLower.includes("wax") || nameLower.includes("สาย")) {
                categoryName = "CORD";
              } else {
                categoryName = "อื่น ๆ";
              }
            }
            let displayName = categoryName;
            if (categoryName === "CHARM") displayName = "จี้ประดับ (Charm)";
            else if (categoryName === "BEAD") displayName = "ลูกปัดหินนำโชค (Bead)";
            else if (categoryName === "CORD") displayName = "สายรัดและเชือกถัก (Cord)";

            if (!groups[displayName]) {
              groups[displayName] = [];
            }
            groups[displayName].push(item);
          });

          return (
            <div className="mt-8 space-y-6">
              {Object.entries(groups).map(([groupName, items]) => (
                <div key={groupName} className="space-y-3">
                  <p className="font-bold text-xs text-[#7a5b46] uppercase tracking-wider">
                    เลือก{groupName}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {items.map((item) => {
                      const acc = item.accessory;
                      const isOutOfStock = acc.stock <= 0;
                      const isSelected = selectedAccessories.some((a) => a.id === acc.id);

                      const toggleSelect = () => {
                        if (isOutOfStock) return;
                        if (isSelected) {
                          setSelectedAccessories(selectedAccessories.filter((a) => a.id !== acc.id));
                        } else {
                          setSelectedAccessories([...selectedAccessories, acc]);
                        }
                      };

                      return (
                        <button
                          key={acc.id}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={toggleSelect}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer relative ${
                            isOutOfStock
                              ? "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                              : isSelected
                              ? "border-[#7a5b46] bg-[#7a5b46]/5 text-[#7a5b46] ring-2 ring-[#7a5b46]"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          {isOutOfStock && (
                            <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                              ของหมด
                            </span>
                          )}
                          {acc.imageUrl ? (
                            <img
                              src={acc.imageUrl}
                              alt={acc.name}
                              className="w-12 h-12 rounded-lg object-cover mb-2 border border-gray-100"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-bold mb-2">
                              No Img
                            </div>
                          )}
                          <span className="text-xs font-bold line-clamp-1">{acc.name}</span>
                          <span className="text-[11px] font-semibold text-[#7a5b46] mt-1">
                            {acc.price > 0 ? `+฿${parseFloat(acc.price).toLocaleString()}` : "ฟรี"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Quantity */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-xs text-gray-400 uppercase tracking-wider">จำนวนสินค้า</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-gray-400 font-semibold">ราคารวม:</span>
              <span className="text-xl font-extrabold text-[#7a5b46]">฿{totalPrice.toLocaleString()}</span>
            </div>
          </div>
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
              disabled={product.type === "READY_TO_SHIP" && (product.stock === 0 || qty >= product.stock)}
              onClick={() => {
                if (product.type !== "READY_TO_SHIP" || qty < product.stock) {
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
      {(() => {
        const isOutOfStock = product.type === "READY_TO_SHIP" && product.stock === 0;
        return (
          <div className="flex flex-col gap-3 mt-10">
            <div className="flex gap-3">
              <button
                onClick={addToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 rounded-xl font-bold transition duration-200 text-sm ${
                  isOutOfStock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "border border-[#7a5b46] text-[#7a5b46] hover:bg-[#7a5b46]/5 cursor-pointer"
                }`}
              >
                {isOutOfStock ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
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
              disabled={isOutOfStock}
              className={`w-full py-4 rounded-xl font-bold transition duration-200 text-sm ${
                isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#7a5b46] text-white hover:bg-[#7a5b46]/90 cursor-pointer"
              }`}
            >
              {product.type === "MADE_TO_ORDER" ? "สั่งทำสินค้าทันที" : "สั่งซื้อทันที"}
            </button>
          </div>
        );
      })()}
    </div>
  );
}
