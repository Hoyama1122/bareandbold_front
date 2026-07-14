import products from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: encodeURIComponent(product.name),
  }));
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const decodedName = decodeURIComponent(resolvedParams.id);
  const product = products.find(
    (p) => p.name.toLowerCase() === decodedName.toLowerCase()
  );

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center text-xl font-bold">
        ไม่พบสินค้า
      </div>
    );
  }

  // แนะนำสินค้า 10 ชิ้น โดยเรียงจาก ประเภทเดียวกัน (category), ชนิดสินค้า (type) และราคาใกล้เคียงกันที่สุดก่อน
  const recommended = products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      // 1. หมวดหมู่เดียวกันก่อน (category: เช่น bracelet, anklet)
      const aSameCat = a.category.toLowerCase() === product.category.toLowerCase() ? 0 : 1;
      const bSameCat = b.category.toLowerCase() === product.category.toLowerCase() ? 0 : 1;
      if (aSameCat !== bSameCat) return aSameCat - bSameCat;

      // 2. รูปแบบเดียวกัน (type: READY_TO_SHIP หรือ MADE_TO_ORDER)
      const aSameType = a.type === product.type ? 0 : 1;
      const bSameType = b.type === product.type ? 0 : 1;
      if (aSameType !== bSameType) return aSameType - bSameType;

      // 3. ช่วงราคาใกล้เคียงกันที่สุด
      const aPriceDiff = Math.abs(a.price - product.price);
      const bPriceDiff = Math.abs(b.price - product.price);
      return aPriceDiff - bPriceDiff;
    })
    .slice(0, 10);

  return <ProductDetailClient product={product} recommendedProducts={recommended} />;
}
