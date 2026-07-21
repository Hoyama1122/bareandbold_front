"use client";

import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { productService } from "@/services/product.service";
import { cartService } from "@/services/cart.service";
import { wishlistService } from "@/services/wishlist.service";
import ProductSkeleton from "@/components/product-detail/ProductSkeleton";
import ProductImageGallery from "@/components/product-detail/ProductImageGallery";
import ProductInfo from "@/components/product-detail/ProductInfo";
import RecommendedProducts from "@/components/product-detail/RecommendedProducts";
import ImageZoomModal from "@/components/product-detail/ImageZoomModal";
import { addToCart as addCartAPI } from "@/services/cart.service";

export default function ProductDetailClient({ nameSlug }) {
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  const images = product
    ? product.images && product.images.length > 0
      ? product.images.map(img => typeof img === "object" ? img.url : img)
      : [product.imageUrl]
    : [];

  const [currentImage, setCurrentImage] = useState(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [qty, setQty] = useState(1);

  const [material, setMaterial] = useState("Silver");
  const [size, setSize] = useState("16 cm");

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        // Warp scroll to the top of the page instantly
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
        // Reset selections to defaults when switching products
        setQty(1);
        setMaterial("Silver");
        setSize("16 cm");

        const decodedName = decodeURIComponent(nameSlug).replace(/-/g, " ");
        const data = await productService.getProducts();
        if (data.success && data.products) {
          const matched = data.products.find(
            (p) => p.name.toLowerCase() === decodedName.toLowerCase() || p.id === nameSlug
          );
          if (matched) {
            setProduct(matched);
            const imgs = matched.images && matched.images.length > 0
              ? matched.images.map(img => typeof img === "object" ? img.url : img)
              : [matched.imageUrl];
            setCurrentImage(imgs[0]);

            // Fetch recommendations
            const recData = await productService.getProductRecommendations(matched.id);
            if (recData.success) {
              setRecommendedProducts(recData.products);
            }
          }
        }
      } catch (err) {
        console.error("Error loading product data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (nameSlug) {
      loadProductData();
    }
  }, [nameSlug]);

  const handlePrevImage = () => {
    if (images.length === 0) return;
    const idx = images.indexOf(currentImage);
    if (idx > 0) {
      setCurrentImage(images[idx - 1]);
    } else {
      setCurrentImage(images[images.length - 1]);
    }
  };

  const handleNextImage = () => {
    if (images.length === 0) return;
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
  }, [isZoomOpen, currentImage, images]);

  const addToCart = async () => {
    try {
      await cartService.addToCart(product.id, qty, material, size, {
        name: product.name,
        image: currentImage,
        price: product.price,
      });
      alert("เพิ่มลงตะกร้าแล้ว");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("ไม่สามารถเพิ่มสินค้าลงในตะกร้าได้");
    }
  };

  const buyNow = async () => {
    try {
      await cartService.addToCart(product.id, qty, material, size, {
        name: product.name,
        image: currentImage,
        price: product.price,
      });
      router.push("/checkout");
    } catch (error) {
      console.error("Failed to buy now:", error);
      alert("เกิดข้อผิดพลาดในการสั่งซื้อสินค้า");
    }
  };

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (product) {
      setIsLiked(wishlistService.isWishlisted(product.id));
    }
    const handleUpdate = () => {
      if (product) {
        setIsLiked(wishlistService.isWishlisted(product.id));
      }
    };
    window.addEventListener("wishlistUpdated", handleUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleUpdate);
  }, [product]);

  const toggleWishlist = () => {
    if (isLiked) {
      wishlistService.removeFromWishlist(product.id);
    } else {
      wishlistService.addToWishlist(product);
    }
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center text-xl font-bold font-anuphan">
        ไม่พบสินค้า
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="grid md:grid-cols-2 gap-16">
        <ProductImageGallery
          images={images}
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
          setIsZoomOpen={setIsZoomOpen}
          productName={product.name}
        />
        <ProductInfo
          product={product}
          material={material}
          setMaterial={setMaterial}
          size={size}
          setSize={setSize}
          qty={qty}
          setQty={setQty}
          addToCart={addToCart}
          buyNow={buyNow}
          isLiked={isLiked}
          toggleWishlist={toggleWishlist}
        />
      </div>

      <RecommendedProducts
        recommendedProducts={recommendedProducts}
        emblaRef={emblaRef}
        scrollPrev={scrollPrev}
        scrollNext={scrollNext}
      />

      {isZoomOpen && (
        <ImageZoomModal
          images={images}
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
          setIsZoomOpen={setIsZoomOpen}
          handlePrevImage={handlePrevImage}
          handleNextImage={handleNextImage}
          productName={product.name}
        />
      )}
    </div>
  );
}
