"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

export default function SearchDropdown({
  label,
  value,
  options,
  placeholder,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const ref = useRef(null);

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return options;

    return options.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  return (
    <div className="relative" ref={ref}>
      {label && (
        <label className="block text-sm font-medium mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setSearch("");
        }}
        className="w-full h-11 rounded-lg border px-4 flex items-center justify-between bg-white"
        style={{
          border: "1px solid #E4D9C7",
        }}
      >
        <span
          className={
            value
              ? "text-[#2B231C]"
              : "text-[#B9AC99]"
          }
        >
          {value || placeholder}
        </span>

        <ChevronDown size={18} />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full rounded-xl border bg-white shadow-xl"
          style={{ borderColor: "#E4D9C7" }}
        >
          <div className="p-3 border-b">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />

              <input
                autoFocus
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="ค้นหา..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border outline-none"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="p-4 text-sm text-gray-400">
                ไม่พบข้อมูล
              </div>
            )}

            {filtered.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  onChange(item);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#F8F5EE]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}