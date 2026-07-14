"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import ProductGrid from "@/components/storefront/ProductGrid";
import ProductFilter from "@/components/storefront/ProductFilter";

export default function ProductsPage() {
  // 1. States สำหรับจัดการข้อมูลจาก Backend
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. States สำหรับระบบค้นหาและคัดกรอง
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");

  // 3. ดึงข้อมูลสินค้าจาก API Backend พอร์ต 8000
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8000/api/products");

        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลสินค้าได้");
        }

        const data = await response.json();
        setProductsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // 4. คำนวณการ Filter สินค้า
  const filteredProducts = useMemo(() => {
    const actualProducts = productsData && productsData.products && Array.isArray(productsData.products)
      ? productsData.products
      : [];

    return actualProducts.filter((product) => {
      const matchSearch = product.name
        ? product.name.toLowerCase().includes(search.toLowerCase())
        : false;

      // 🔄 ระบบตรวจจับหมวดหมู่ให้รองรับตัวเล็กตัวใหญ่และชื่อสินค้าชุดใหม่
      const matchCategory =
        category === "all" ||
        (category === "anklet" && product.name?.toLowerCase().includes("anklet")) ||
        (category === "bracelet" && product.name?.toLowerCase().includes("bracelet"));

      const matchType =
        type === "all" ||
        product.type === type;

      return matchSearch && matchCategory && matchType;
    });
  }, [productsData, search, category, type]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* ส่วนเชื่อมโยงเส้นทาง (Breadcrumbs) */}
      <div className="mb-4 text-sm text-zinc-500 flex items-center gap-2 font-anuphan">
        <Link href="/" className="text-earth-olive font-bold hover:underline">
          หน้าแรก
        </Link>
        <span>/</span>
        <span className="text-earth-dark font-bold">ร้านค้า</span>
      </div>

      {/* หัวข้อร้านค้าและสโลแกนอธิบาย (✨ ปรับคำโปรยให้โฟกัสที่กำไลข้อมือและข้อเท้า) */}
      <div className="mb-8 font-anuphan">
        <h1 className="text-4xl font-bold text-zinc-900">หน้าร้านค้า</h1>
        <p className="text-gray-500 text-sm mt-2 max-w-2xl leading-relaxed">
          เลือกชมกำไลข้อมือและกำไลข้อเท้าพรีเมียมจากคอลเลกชันของเรา ทั้งสินค้า Ready to Ship และ Made to Order ที่ออกแบบปรับเปลี่ยนขนาดได้ตามสไตล์ที่เป็นคุณ
        </p>
      </div>

      {/* คอมโพเนนต์ ค้นหา และ ตัวกรองสินค้า */}
      <div className="mt-6">
        <ProductFilter
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          type={type}
          setType={setType}
        />
      </div>

      {/* พื้นที่แสดงรายการสินค้าและสถานะต่าง ๆ */}
      <div className="mt-10">
        {loading && (
          <div className="text-center py-20 text-gray-500 animate-pulse font-medium font-anuphan">
            กำลังโหลดรายการสินค้า...
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-500 font-medium font-anuphan">
            เกิดข้อผิดพลาด: {error}
          </div>
        )}

        {!loading && !error && (
          <ProductGrid products={filteredProducts} />
        )}
      </div>
    </div>
  );
}