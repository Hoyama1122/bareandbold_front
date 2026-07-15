import Link from "next/link";
import Image from "next/image"; 
import ProductCard from "./ProductCard"; 

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return <div className="text-center py-10 text-gray-400">ไม่พบสินค้าในหมวดหมู่นี้</div>;
  }

  return (
    <>
      {/* Result Count */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-earth-dark">
          พบสินค้า {products.length} รายการ
        </h3>
      </div>

      {/* Product Grid */}
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.name.replace(/\s+/g, "-")}`}
            className="group"
            prefetch={false}
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </>
  );
}