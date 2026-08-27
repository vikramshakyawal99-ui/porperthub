"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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
  const [open, setOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  const filteredOptions =
    options.filter((item) =>
      item
        .toLowerCase()
        .includes(
          search.trim().toLowerCase()
        )
    );

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      <label className="mb-2 block font-medium text-slate-900">
        {label}
      </label>

      <input
        value={
          open
            ? search
            : value
        }
        onFocus={() => {
          setOpen(true);
          setSearch("");
        }}
        onChange={(event) => {
          setSearch(
            event.target.value
          );

          setOpen(true);
        }}
        placeholder={`Select ${label}`}
        autoComplete="off"
        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
      />

      {open && (
        <div className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">

          {filteredOptions.length >
          0 ? (
            filteredOptions.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onMouseDown={(
                    event
                  ) =>
                    event.preventDefault()
                  }
                  onClick={() => {
                    onChange(item);
                    setSearch("");
                    setOpen(false);
                  }}
                  className={`block w-full rounded-lg px-3 py-3 text-left text-sm font-semibold transition ${
                    value === item
                      ? "bg-green-50 text-green-700"
                      : "text-slate-800 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {item}
                </button>
              )
            )
          ) : (
            <div className="px-3 py-4 text-sm text-slate-500">
              No options found
            </div>
          )}

        </div>
      )}
    </div>
  );
}
