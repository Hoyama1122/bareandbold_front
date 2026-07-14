import { productService } from "@/services/product.service";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  try {
    const data = await productService.getProducts();
    if (data.success && data.products) {
      return data.products.map((product) => ({
        id: encodeURIComponent(product.name),
      }));
    }
  } catch (err) {
    console.error("Failed to generate static params from API:", err);
  }
  return [];
}

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  const decodedName = decodeURIComponent(resolvedParams.id);

  let product = null;
  let recommended = [];

  try {
    const data = await productService.getProducts();
    if (data.success && data.products) {
      product = data.products.find(
        (p) => p.name.toLowerCase() === decodedName.toLowerCase()
      );

      if (product) {
        const recData = await productService.getProductRecommendations(product.id);
        if (recData.success) {
          recommended = recData.products;
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch product or recommendations:", err);
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center text-xl font-bold">
        ไม่พบสินค้า
      </div>
    );
  }

  return <ProductDetailClient product={product} recommendedProducts={recommended} />;
}
