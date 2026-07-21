"use client";

import { useState } from "react";

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export default function SearchableSelect({
  label,
  value,
  onChange,
  options,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);

  const filtered = options.filter((item) =>
    item.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block mb-2 font-medium">
        {label}
      </label>

      <input
        className="w-full rounded-xl border p-3"
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        placeholder={`Enter ${label}`}
      />

      {open && filtered.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-xl border bg-zinc-900 shadow">
          {filtered.map((item) => (
            <div
              key={item}
              className="cursor-pointer p-3 hover:bg-zinc-950"
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
