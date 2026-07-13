npm run dev
cat data/properties.ts
from "react";
import { properties } from "../data/properties";
import PropertyCard from "./PropertyCard";

export default function PropertySearch() {
  const [search, setSearch] = useState("");
  const [bhk, setBhk] = useState("All");

  const filteredProperties = properties.filter((property) => {
    const text =
      `${property.title} ${property.location} ${property.builder}`.toLowerCase();

    const searchMatch = text.includes(search.toLowerCase());

    const bhkMatch =
      bhk === "All" ||
      `${property.bedrooms} BHK` === bhk;

    return searchMatch && bhkMatch;
  });

  return (
    <section className="mx-auto mt-16 max-w-7xl rounded-3xl bg-white p-8 shadow-xl">

      <h2 className="mb-6 text-3xl font-bold">
        🔍 Find Your Perfect Property
      </h2>

      <div className="grid gap-5 md:grid-cols-3">

        <input
          type="text"
          placeholder="Search City, Builder, Project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border p-4"
        />

        <select
          value={bhk}
          onChange={(e) => setBhk(e.target.value)}
          className="rounded-xl border p-4"
        >
          <option>All</option>
          <option>2 BHK</option>
          <option>3 BHK</option>
          <option>4 BHK</option>
        </select>

        <div className="rounded-xl bg-blue-600 p-4 text-center font-bold text-white">
          {filteredProperties.length} Properties Found
        </div>

      </div>


      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}

      </div>

    </section>
  );
}