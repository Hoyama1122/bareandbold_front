import React from "react";

export default function ProductSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-14 animate-pulse">
      <div className="grid md:grid-cols-2 gap-16">
        {/* LEFT - Image Skeleton */}
        <div>
          <div className="w-full aspect-square rounded-2xl bg-zinc-100" />
          <div className="flex gap-4 mt-5">
            <div className="w-20 h-20 rounded-xl bg-zinc-100" />
            <div className="w-20 h-20 rounded-xl bg-zinc-100" />
            <div className="w-20 h-20 rounded-xl bg-zinc-100" />
          </div>
        </div>
        {/* RIGHT - Content Skeleton */}
        <div className="space-y-6">
          <div className="h-4 bg-zinc-100 rounded w-1/4" />
          <div className="h-10 bg-zinc-100 rounded w-3/4" />
          <div className="h-8 bg-zinc-100 rounded w-1/3" />
          <div className="space-y-3 pt-6 border-t border-zinc-100">
            <div className="h-4 bg-zinc-100 rounded w-full" />
            <div className="h-4 bg-zinc-100 rounded w-full" />
            <div className="h-4 bg-zinc-100 rounded w-2/3" />
          </div>
          <div className="h-12 bg-zinc-100 rounded-xl w-full mt-10" />
          <div className="h-12 bg-zinc-100 rounded-xl w-full" />
        </div>
      </div>
    </div>
  );
}
