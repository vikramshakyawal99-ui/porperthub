import { MetadataRoute } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://propertyhub.com";

  const snapshot = await getDocs(
    collection(db, "properties")
  );

  const properties = snapshot.docs.map((doc) => ({
    url: `${baseUrl}/properties/${doc.id}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
    },
    ...properties,
  ];
}
