import { MetadataRoute } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const baseUrl = "https://propertyhub.com";

const categoryMap: Record<string, string> = {
  room_rent: "rooms",
  pg: "pg",
  hostel: "hostels",
  flat: "flats",
  villa: "villas",
  plot: "plots",
  resale: "resale",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const snapshot = await getDocs(
    query(
      collection(db, "properties"),
      where("status", "==", "approved")
    )
  );

  const approvedProperties = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as any),
  }));

  const propertyUrls = approvedProperties.map((property) => ({
    url: `${baseUrl}/properties/${property.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const locations = new Set<string>();

  approvedProperties.forEach((property) => {
    if (property.location) {
      locations.add(slugify(String(property.location)));
    }
  });

  const locationUrls = Array.from(locations).map((location) => ({
    url: `${baseUrl}/jaipur/${location}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const categoryUrls = new Set<string>();

  approvedProperties.forEach((property) => {
    if (!property.location || !property.type) return;

    const category =
      categoryMap[String(property.type)] ?? String(property.type);

    const location = slugify(String(property.location));

    categoryUrls.add(
      `${baseUrl}/jaipur/${location}/${slugify(category)}`
    );
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...Array.from(locationUrls),
    ...Array.from(categoryUrls).map((url) => ({
      url,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...propertyUrls,
  ];
}
