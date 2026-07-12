"use client";

import { useState } from "react";
import Image from "next/image";
import products from "@/data/products";

export default function ProductDetail({ params }) {
  const id = Number(params.id);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-20">
        ไม่พบสินค้า
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl];

  const [currentImage, setCurrentImage] = useState(images[0]);
  const [qty, setQty] = useState(1);

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

          <div className="relative w-full aspect-square rounded-xl overflow-hidden border">

            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover"
            />

          </div>

          <div className="flex gap-4 mt-5">

            {images.map((img) => (

              <button
                key={img}
                onClick={() => setCurrentImage(img)}
                className={`relative w-24 h-24 rounded-lg overflow-hidden border ${
                  currentImage === img
                    ? "border-green-700"
                    : "border-gray-200"
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

        <div>

          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-3xl text-[#7a5b46] font-bold mt-5">
            ฿{product.price.toLocaleString()}
          </p>

          <div className="mt-8 text-gray-600 leading-8">
            {product.description}
          </div>

          {/* MADE TO ORDER */}

          {product.type === "MADE_TO_ORDER" && (

            <div className="mt-8 space-y-5">

              <div>

                <p className="font-semibold mb-2">
                  วัสดุ
                </p>

                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="border rounded-lg p-3 w-full"
                >

                  <option>Silver</option>
                  <option>Gold</option>
                  <option>Rose Gold</option>

                </select>

              </div>

              <div>

                <p className="font-semibold mb-2">
                  ขนาดข้อมือ
                </p>

                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="border rounded-lg p-3 w-full"
                >

                  <option>14 cm</option>
                  <option>15 cm</option>
                  <option>16 cm</option>
                  <option>17 cm</option>
                  <option>18 cm</option>

                </select>

              </div>

            </div>

          )}

          {/* Quantity */}

          <div className="mt-10 flex items-center gap-4">

            <button
              onClick={() => qty > 1 && setQty(qty - 1)}
              className="w-12 h-12 rounded-lg border text-xl"
            >
              -
            </button>

            <div className="w-16 text-center text-xl font-bold">
              {qty}
            </div>

            <button
              onClick={() => setQty(qty + 1)}
              className="w-12 h-12 rounded-lg border text-xl"
            >
              +
            </button>

          </div>

          {/* Buttons */}

          <div className="grid grid-cols-2 gap-4 mt-10">

            <button
              onClick={addToCart}
              className="py-4 bg-[#7a5b46] text-white rounded-xl font-bold"
            >
              เพิ่มลงตะกร้า
            </button>

            <button
              className="py-4 border-2 border-[#7a5b46] rounded-xl font-bold"
            >
              สั่งซื้อทันที
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}