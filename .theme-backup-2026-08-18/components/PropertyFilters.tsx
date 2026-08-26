"use client";

import { useState } from "react";

type Props = {
  type?: string;
  onFilterChange: (filters: any) => void;
};

export default function PropertyFilters({
  type = "",
  onFilterChange,
}: Props) {
  const category = type.toLowerCase().trim();

  const isPG =
    category === "pg" ||
    category === "boys pg" ||
    category === "girls pg" ||
    category === "co-living pg";

  const isHostel =
    category === "hostel" ||
    category === "boys hostel" ||
    category === "girls hostel";

  const isRoom =
    category === "room" ||
    category === "room rent" ||
    category === "room_rent";

  const isPlot =
    category === "plot" ||
    category === "jda approved plot" ||
    category === "society plot";

  const isRental =
    isPG ||
    isHostel ||
    isRoom ||
    category === "flat rent" ||
    category === "house rent";

  const isFlatRent = category === "flat rent";
  const isHouseRent = category === "house rent";

  const isResidentialSale =
    !isRental &&
    !isPlot;

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [bhk, setBhk] = useState("");
  const [price, setPrice] = useState("");
  const [rent, setRent] = useState("");
  const [sharingType, setSharingType] = useState("");
  const [roomType, setRoomType] = useState("");
  const [ac, setAc] = useState("");
  const [food, setFood] = useState("");
  const [suitableFor, setSuitableFor] = useState("");
  const [society, setSociety] = useState("");
  const [plotSize, setPlotSize] = useState("");
  const [parking, setParking] = useState("");
  const [furnished, setFurnished] = useState("");
  const [sort, setSort] = useState("");

  function applyFilters() {
    console.log("APPLY FILTERS CLICKED");

    onFilterChange({
      search,
      location,
      bhk,
      price,
      rent,
      sharingType,
      roomType,
      ac,
      food,
      suitableFor,
      society,
      plotSize,
      parking,
      furnished,
      sort,
    });
  }

  function clearFilters() {
    setSearch("");
    setLocation("");
    setBhk("");
    setPrice("");
    setRent("");
    setSharingType("");
    setRoomType("");
    setAc("");
    setFood("");
    setSuitableFor("");
    setSociety("");
    setPlotSize("");
    setParking("");
    setFurnished("");
    setSort("");

    onFilterChange({
      search: "",
      location: "",
      bhk: "",
      price: "",
      rent: "",
      sharingType: "",
      roomType: "",
      ac: "",
      food: "",
      suitableFor: "",
      society: "",
      plotSize: "",
      parking: "",
      furnished: "",
      sort: "",
    });
  }

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-[#d4a855] focus:ring-1 focus:ring-[#d4a855]/40";

  const selectClass =
    "w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d4a855] focus:ring-1 focus:ring-[#d4a855]/40";

  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-slate-950/90 p-5 shadow-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            🔍 Search & Filters
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Find the property that fits your needs
          </p>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-xl border border-[#d4a855]/40 px-4 py-2 text-sm font-semibold text-[#d4a855] transition hover:bg-[#d4a855] hover:text-slate-950"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* SEARCH */}
        <input
          placeholder="Search Property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />

        {/* LOCATION */}
        <input
          placeholder="Location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={inputClass}
        />

        {/* BHK - ONLY FOR NORMAL RESIDENTIAL */}
        {isResidentialSale && (
          <select
            value={bhk}
            onChange={(e) => setBhk(e.target.value)}
            className={selectClass}
          >
            <option value="">All BHK</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4 BHK</option>
            <option value="5">5+ BHK</option>
          </select>
        )}

        {/* FURNISHING - RESIDENTIAL + FLAT/HOUSE RENT */}
        {(isResidentialSale || isFlatRent || isHouseRent) && (
          <select
            value={furnished}
            onChange={(e) => setFurnished(e.target.value)}
            className={selectClass}
          >
            <option value="">All Furnishing</option>
            <option value="furnished">Furnished</option>
            <option value="semi-furnished">Semi Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>
        )}

        {/* PARKING - RESIDENTIAL + FLAT/HOUSE RENT */}
        {(isResidentialSale || isFlatRent || isHouseRent) && (
          <select
            value={parking}
            onChange={(e) => setParking(e.target.value)}
            className={selectClass}
          >
            <option value="">Parking</option>
            <option value="yes">Parking Available</option>
            <option value="no">No Parking</option>
          </select>
        )}

        {/* RENTAL / PG / HOSTEL / ROOM */}
        {isRental && (
          <>
            {/* ROOM TYPE */}
            {(isRoom || isPG || isHostel) && (
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className={selectClass}
              >
                <option value="">All Room Types</option>
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="shared">Shared Room</option>
              </select>
            )}

            {/* SHARING */}
            {(isPG || isHostel || isRoom) && (
              <select
                value={sharingType}
                onChange={(e) => setSharingType(e.target.value)}
                className={selectClass}
              >
                <option value="">All Sharing</option>
                <option value="single">Single</option>
                <option value="double">2 Sharing</option>
                <option value="triple">3 Sharing</option>
                <option value="four">4 Sharing</option>
              </select>
            )}

            {/* AC */}
            {(isPG || isHostel || isRoom) && (
              <select
                value={ac}
                onChange={(e) => setAc(e.target.value)}
                className={selectClass}
              >
                <option value="">AC / Non-AC</option>
                <option value="ac">AC</option>
                <option value="non-ac">Non-AC</option>
              </select>
            )}

            {/* FOOD */}
            {(isPG || isHostel) && (
              <select
                value={food}
                onChange={(e) => setFood(e.target.value)}
                className={selectClass}
              >
                <option value="">Food Facility</option>
                <option value="yes">Food Available</option>
                <option value="no">No Food</option>
              </select>
            )}

            {/* SUITABLE FOR */}
            {(isPG || isHostel || isRoom) && (
              <select
                value={suitableFor}
                onChange={(e) => setSuitableFor(e.target.value)}
                className={selectClass}
              >
                <option value="">Suitable For</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="students">Students</option>
                <option value="family">Family</option>
                <option value="working">Working Professionals</option>
              </select>
            )}
          </>
        )}

        {/* PLOT FILTERS */}
        {isPlot && (
          <>
            <input
              placeholder="Society / JDA"
              value={society}
              onChange={(e) => setSociety(e.target.value)}
              className={inputClass}
            />

            <input
              placeholder="Plot Size"
              value={plotSize}
              onChange={(e) => setPlotSize(e.target.value)}
              className={inputClass}
            />
          </>
        )}

        {/* PRICE / RENT */}
        <select
          value={isRental ? rent : price}
          onChange={(e) => {
            if (isRental) {
              setRent(e.target.value);
            } else {
              setPrice(e.target.value);
            }
          }}
          className={selectClass}
        >
          <option value="">
            {isRental ? "All Rent" : "All Price"}
          </option>

          {isRental ? (
            <>
              <option value="5000">Up to ₹5,000</option>
              <option value="10000">Up to ₹10,000</option>
              <option value="15000">Up to ₹15,000</option>
              <option value="25000">Up to ₹25,000</option>
            </>
          ) : (
            <>
              <option value="5000000">Up to ₹50 Lakh</option>
              <option value="10000000">Up to ₹1 Crore</option>
              <option value="20000000">Up to ₹2 Crore</option>
              <option value="50000000">Up to ₹5 Crore</option>
            </>
          )}
        </select>

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={selectClass}
        >
          <option value="">Sort By</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* ACTIONS */}
      <div className="relative z-50 mt-5 flex flex-col-reverse gap-3 pointer-events-auto sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={applyFilters}
          className="relative z-50 w-full cursor-pointer pointer-events-auto rounded-xl bg-[#d4a855] px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-[#d4a855]/20 transition hover:bg-[#e1b968] sm:w-auto"
        >
          ✓ Apply Filters
        </button>
      </div>
    </div>
  );
}
