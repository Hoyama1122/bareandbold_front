import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({ params }) {
  const resolvedParams = await params;
  return <ProductDetailClient nameSlug={resolvedParams.id} />;
}
