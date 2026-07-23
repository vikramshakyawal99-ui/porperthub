import Image from "next/image";
import Link from "next/link";

type Property = {
  id: string | number;
  title: string;
  location: string;
  price: string;
  image: string;
  builder: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  rating: number;
};

export default function PropertyCard({
  property,
}: {
  property: Property;
}) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

        <div className="relative h-64">

          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover"
          />


          <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
            Featured
          </span>


          <span className="absolute right-4 top-4 rounded-full bg-zinc-900 px-3 py-1 font-bold text-yellow-500 shadow">
            ⭐ {property.rating}
          </span>

        </div>


        <div className="p-6">

          <h2 className="text-2xl font-bold text-gray-900">
            {property.title}
          </h2>


          <p className="mt-2 text-gray-300">
            📍 {property.location}
          </p>


          <p className="mt-2 text-gray-700">
            🏢 {property.builder}
          </p>


          <div className="mt-5 flex justify-between text-gray-700">

            <span>🛏 {property.bedrooms} Bed</span>

            <span>🛁 {property.bathrooms} Bath</span>

            <span>📐 {property.area}</span>

          </div>


          <div className="mt-6 flex items-center justify-between">

            <h3 className="text-3xl font-bold text-blue-700">
              {property.price}
            </h3>


            <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
              View Details →
            </button>

          </div>

        </div>

      </div>
    </Link>
  );
}
