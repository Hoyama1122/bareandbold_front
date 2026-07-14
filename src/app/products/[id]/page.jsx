import products from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: String(product.id),
  }));
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center text-xl font-bold">
        ไม่พบสินค้า
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}