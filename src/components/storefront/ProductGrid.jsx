import Link from "next/link";
import Image from "next/image"; 
import ProductCard from "./ProductCard"; 

// ตัวอย่างภายในไฟล์ ProductGrid.jsx ที่ถูกต้อง
export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return <div className="text-center py-10 text-gray-400">ไม่พบสินค้าในหมวดหมู่นี้</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}