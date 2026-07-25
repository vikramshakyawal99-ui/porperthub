import { Metadata } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PropertyCard from "@/components/PropertyCard";

type Props = {
  params: Promise<{
    location: string;
    category: string;
  }>;
};

const categoryMap: Record<string, { type: string; title: string }> = {
  rooms: { type: "room_rent", title: "Rooms" },
  pg: { type: "pg", title: "PG" },
  hostels: { type: "hostel", title: "Hostels" },
  flats: { type: "flat", title: "Flats" },
  villas: { type: "villa", title: "Villas" },
  plots: { type: "plot", title: "Plots" },
  resale: { type: "resale", title: "Resale Properties" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { location, category } = await params;

  const locationName = location
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const categoryTitle =
    categoryMap[category]?.title ?? category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${categoryTitle} in ${locationName}, Jaipur | PropertyHub`,
    description: `Find verified ${categoryTitle.toLowerCase()} in ${locationName}, Jaipur on PropertyHub.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { location, category } = await params;

  const locationName = location
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const config = categoryMap[category];

  if (!config) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white p-10">
        <h1 className="text-3xl font-bold">Category Not Found</h1>
      </main>
    );
  }

  const q = query(
    collection(db, "properties"),
    where("location", "==", locationName),
    where("type", "==", config.type),
    where("status", "==", "approved")
  );

  const snapshot = await getDocs(q);

  const properties = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold">
          {config.title} in {locationName}, Jaipur
        </h1>

        <p className="mt-4 text-gray-300">
          Browse verified {config.title.toLowerCase()} available in {locationName}.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {properties.length === 0 ? (
            <p>No approved properties available.</p>
          ) : (
            properties.map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
