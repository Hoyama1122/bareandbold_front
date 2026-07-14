"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "@/components/storefront/ProductCard";

export default function ProductDetailClient({ product, recommendedProducts = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const images =
    product.images && product.images.length > 0
      ? product.images.map(img => typeof img === "object" ? img.url : img)
      : [product.imageUrl];

  const [currentImage, setCurrentImage] = useState(images[0]);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const handlePrevImage = () => {
    const idx = images.indexOf(currentImage);
    if (idx > 0) {
      setCurrentImage(images[idx - 1]);
    } else {
      setCurrentImage(images[images.length - 1]);
    }
  };

  const handleNextImage = () => {
    const idx = images.indexOf(currentImage);
    if (idx < images.length - 1) {
      setCurrentImage(images[idx + 1]);
    } else {
      setCurrentImage(images[0]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isZoomOpen) return;
      if (e.key === "Escape") setIsZoomOpen(false);
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomOpen, currentImage]);

  const [material, setMaterial] = useState("Silver");
  const [size, setSize] = useState("16 cm");

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("bare_cart") || "[]");

    cart.push({
      id: Date.now(),
      productId: product.id,
      name: product.name,
      image: currentImage,
      price: product.price,
      quantity: qty,
      material,
      size,
    });

    localStorage.setItem("bare_cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));

    alert("เพิ่มลงตะกร้าแล้ว");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="grid md:grid-cols-2 gap-16">
        {/* LEFT */}
        <div>
          <div 
            onClick={() => setIsZoomOpen(true)}
            className="relative w-full aspect-square rounded-2xl overflow-hidden border border-gray-100 cursor-zoom-in group bg-[#FDFBF7]"
          >
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-sm gap-2 select-none font-sans">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
              </svg>
              คลิกเพื่อขยายรูปภาพ
            </div>
          </div>
          <div className="flex gap-4 mt-5 overflow-x-auto py-1">
            {images.map((img) => (
              <button
                key={img}
                onClick={() => setCurrentImage(img)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                  currentImage === img
                    ? "border-[#7a5b46] scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT */}
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
      </div>

      {/* Recommended Products Section */}
      {recommendedProducts.length > 0 && (
        <div className="mt-24 border-t border-earth-beige pt-16 font-anuphan">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-earth-dark">
              สินค้าแนะนำสำหรับคุณ
            </h3>
            <div className="flex gap-2">
              <button
                onClick={scrollPrev}
                className="w-10 h-10 rounded-full border border-earth-border flex items-center justify-center hover:bg-earth-beige/40 transition active:scale-95 cursor-pointer"
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-zinc-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                className="w-10 h-10 rounded-full border border-earth-border flex items-center justify-center hover:bg-earth-beige/40 transition active:scale-95 cursor-pointer"
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-zinc-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
          <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex gap-7">
              {recommendedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_23%]"
                >
                  <Link
                    href={`/products/${prod.name.replace(/\s+/g, "-")}`}
                    className="group block"
                  >
                    <ProductCard product={prod} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Image Zoom Lightbox Modal ─── */}
      {isZoomOpen && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex flex-col items-center justify-center p-4 select-none">
          {/* Close button */}
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Left Navigation Arrow */}
          {images.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Large Image Viewport */}
          <div className="relative max-w-full max-h-[65vh] aspect-square rounded-xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src={currentImage}
              alt={product.name}
              className="max-w-full max-h-[65vh] object-contain rounded-xl"
            />
          </div>

          {/* Right Navigation Arrow */}
          {images.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center cursor-pointer transition active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Zoom Modal Thumbnails list */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-8 max-w-full overflow-x-auto py-2 px-4 justify-center">
              {images.map((img) => (
                <button
                  key={img}
                  onClick={() => setCurrentImage(img)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImage === img
                      ? "border-white scale-105"
                      : "border-white/20 hover:border-white/50"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
