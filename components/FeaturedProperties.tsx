import { properties } from "../data/properties";
import PropertyCard from "./PropertyCard";

export default function FeaturedProperties() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-4xl font-bold">
          Featured Properties
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              {...property}
            />
          ))}
        </div>
      </div>
    </section>
  );
}