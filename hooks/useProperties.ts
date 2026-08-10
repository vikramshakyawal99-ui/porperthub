"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Property = {
  id: string;

  title?: string;
  location?: string;

  propertyType?: string;
  type?: string;
  purpose?: string;

  image?: string;
  images?: string[];

  builder?: string;
  projectName?: string;

  bedrooms?: number | string;
  bathrooms?: number | string;

  area?: string;
  price?: string | number;

  description?: string;

  ownerId?: string;
  ownerEmail?: string;

  status?: string;

  [key: string]: any;
};

// Memory cache (shared in browser session)
let cachedProperties: Property[] | null = null;

export default function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProperties() {
      try {
        // Use cache if already loaded
        if (cachedProperties) {
          if (mounted) {
            setProperties(cachedProperties);
            setLoading(false);
          }
          return;
        }

        const snapshot = await getDocs(
          query(
            collection(db, "properties"),
            where("status", "==", "approved")
          )
        );

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Property[];

        cachedProperties = data;

        if (mounted) {
          setProperties(data);
        }
      } catch (error) {
        console.error("Failed to load properties:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProperties();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    properties,
    loading,
  };
}
