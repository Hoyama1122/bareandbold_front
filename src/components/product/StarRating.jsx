import React from "react";

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

  return (
    <div
      className={`flex items-center gap-0.5 leading-none ${size} ${className}`}
      role="img"
      aria-label={`คะแนน ${numericRating.toFixed(1)} จาก 5 ดาว`}
      title={`${numericRating.toFixed(1)} / 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          aria-hidden="true"
          className={
            star <= filledStars ? "text-[#F5A623]" : "text-[#D6D3D1]"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}
