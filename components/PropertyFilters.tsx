"use client";

type Props = {
  onFilterChange: (filters: {
    search: string;
    location: string;
    bhk: string;
    price: string;
    sort: string;
  }) => void;
};

import { useState } from "react";

export default function PropertyFilters({
  onFilterChange,
}: Props) {

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [bhk, setBhk] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("");


  function update(
    newSearch: string,
    newLocation: string,
    newBhk: string,
    newPrice: string,
    newSort: string
  ) {

    onFilterChange({
      search: newSearch,
      location: newLocation,
      bhk: newBhk,
      price: newPrice,
      sort: newSort,
    });

  }


  return (
    <div className="mb-8 rounded-2xl bg-zinc-900 p-6 shadow-lg">

      <h2 className="mb-6 text-2xl font-bold">
        🔍 Search & Filters
      </h2>


      <div className="grid gap-4 md:grid-cols-5">


        <input
          placeholder="Search Property..."
          value={search}
          onChange={(e)=>{
            setSearch(e.target.value);
            update(
              e.target.value,
              location,
              bhk,
              price,
              sort
            );
          }}
          className="rounded-xl border p-3"
        />


        <input
          placeholder="Location..."
          value={location}
          onChange={(e)=>{
            setLocation(e.target.value);
            update(
              search,
              e.target.value,
              bhk,
              price,
              sort
            );
          }}
          className="rounded-xl border p-3"
        />


        <select
          value={bhk}
          onChange={(e)=>{
            setBhk(e.target.value);
            update(
              search,
              location,
              e.target.value,
              price,
              sort
            );
          }}
          className="rounded-xl border p-3"
        >
          <option value="">All BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4 BHK</option>
        </select>



        <select
          value={price}
          onChange={(e)=>{
            setPrice(e.target.value);
            update(
              search,
              location,
              bhk,
              e.target.value,
              sort
            );
          }}
          className="rounded-xl border p-3"
        >

          <option value="">All Price</option>
          <option value="50">Below 50 Lakh</option>
          <option value="100">50 Lakh - 1 Cr</option>
          <option value="200">Above 1 Cr</option>

        </select>



        <select
          value={sort}
          onChange={(e)=>{
            setSort(e.target.value);
            update(
              search,
              location,
              bhk,
              price,
              e.target.value
            );
          }}
          className="rounded-xl border p-3"
        >

          <option value="">
            Sort By
          </option>

          <option value="low">
            Price Low to High
          </option>

          <option value="high">
            Price High to Low
          </option>

        </select>


      </div>



      <button
        onClick={()=>{

          setSearch("");
          setLocation("");
          setBhk("");
          setPrice("");
          setSort("");

          onFilterChange({
            search:"",
            location:"",
            bhk:"",
            price:"",
            sort:"",
          });

        }}
        className="mt-6 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white"
      >
        Clear Filters
      </button>


    </div>
  );
}
