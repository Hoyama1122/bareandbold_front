"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
  const [selectedAccessories, setSelectedAccessories] = useState([]);

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
        setSelectedAccessories([]);

        let cleanSlug = nameSlug || "";
        if (cleanSlug.endsWith("/")) {
          cleanSlug = cleanSlug.slice(0, -1);
        }
        const decodedName = decodeURIComponent(cleanSlug).replace(/-/g, " ");
        const data = await productService.getProducts();
        if (data.success && data.products) {
          const matched = data.products.find(
            (p) => p.name.toLowerCase() === decodedName.toLowerCase() || p.id === cleanSlug
          );
          if (matched) {
            let fullProduct = matched;
            try {
              const fullRes = await productService.getProductById(matched.id);
              if (fullRes.success && fullRes.product) {
                fullProduct = fullRes.product;
              }
            } catch (e) {
              console.error("Failed to load full product by ID:", e);
            }
            setProduct(fullProduct);
            const imgs = fullProduct.images && fullProduct.images.length > 0
              ? fullProduct.images.map(img => typeof img === "object" ? img.url : img)
              : [fullProduct.imageUrl];
            setCurrentImage(imgs[0]);

            // Fetch recommendations
            const recData = await productService.getProductRecommendations(fullProduct.id);
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

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const addToCart = async () => {
    try {
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

      const unitPrice = Number(product.price) + customOptionsPrice + accessoriesPrice;

      await cartService.addToCart(product.id, qty, material, size, selectedAccessories, {
        name: product.name,
        image: currentImage,
        price: unitPrice,
      });
      showToast("เพิ่มลงตะกร้าสินค้าเรียบร้อยแล้ว", "success");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      showToast("ไม่สามารถเพิ่มสินค้าลงในตะกร้าได้", "error");
    }
  };

  const buyNow = async () => {
    try {
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

      const unitPrice = Number(product.price) + customOptionsPrice + accessoriesPrice;

      await cartService.addToCart(product.id, qty, material, size, selectedAccessories, {
        name: product.name,
        image: currentImage,
        price: unitPrice,
      });
      router.push("/checkout");
    } catch (error) {
      console.error("Failed to buy now:", error);
      showToast("เกิดข้อผิดพลาดในการสั่งซื้อสินค้า", "error");
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
          selectedAccessories={selectedAccessories}
          setSelectedAccessories={setSelectedAccessories}
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

      {/* Premium Toast Notification */}
      {toast.show && (
        <div
          className="fixed bottom-8 right-8 z-[999] px-6 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans"
          style={{
            background: "#2B2118", // INK
            color: "#F2ECDD", // CREAM
            borderColor: "#E1D8C0", // BORDER
          }}
        >
          {toast.type === "success" ? (
            <span style={{ color: "#6B7A4E" }} className="text-base font-bold">✓</span>
          ) : (
            <span className="text-red-500 text-base font-bold">✕</span>
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
