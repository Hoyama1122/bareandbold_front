import React from "react";
import { Star } from "lucide-react";

/**
 * แสดงคะแนนรีวิวเป็นดาว 5 ดวง
 * - ดวงที่ได้คะแนน (เต็มดวง) = สีทอง
 * - ดวงที่เหลือ = สีเทา
 */
export default function StarRating({
  rating = 0,
  className = "",
  size = "text-sm",
}) {
  const numericRating = Number(rating) || 0;
  const filledStars = Math.min(5, Math.max(0, Math.round(numericRating)));
  const pixelSize = typeof size === "number" ? size : size.includes("xs") ? 12 : size.includes("lg") ? 18 : 14;

  return (
    <div
      className={`flex items-center gap-0.5 leading-none ${className}`}
      role="img"
      aria-label={`คะแนน ${numericRating.toFixed(1)} จาก 5 ดาว`}
      title={`${numericRating.toFixed(1)} / 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={pixelSize}
          aria-hidden="true"
          className={
            star <= filledStars ? "fill-[#F5A623] text-[#F5A623]" : "fill-[#D6D3D1] text-[#D6D3D1]"
          }
        />
      ))}
    </div>
  );
}
