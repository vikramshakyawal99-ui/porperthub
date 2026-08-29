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
  propertyCondition?: string;

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

  sharingType?: string;
  roomType?: string;
  ac?: string;
  food?: string;
  suitableFor?: string;
  society?: string;
  plotSize?: string;
  parking?: string;
  furnished?: string;
  gender?: string;
};

let cachedProperties: Property[] | null = null;
let pendingPropertiesRequest: Promise<Property[]> | null = null;

async function fetchProperties(): Promise<Property[]> {
  if (cachedProperties) {
    return cachedProperties;
  }

  if (pendingPropertiesRequest) {
    return pendingPropertiesRequest;
  }

  pendingPropertiesRequest = getDocs(
    query(
      collection(db, "properties"),
      where("status", "==", "approved")
    )
  )
    .then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Property[];

      cachedProperties = data;
      pendingPropertiesRequest = null;

      return data;
    })
    .catch((error) => {
      pendingPropertiesRequest = null;
      throw error;
    });

  return pendingPropertiesRequest;
}

export default function useProperties() {
  const [properties, setProperties] = useState<Property[]>(
    () => cachedProperties || []
  );

  const [loading, setLoading] = useState(
    () => cachedProperties === null
  );

  useEffect(() => {
    let mounted = true;

    fetchProperties()
      .then((data) => {
        if (!mounted) return;

        setProperties(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load properties:", error);

        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    properties,
    loading,
  };
}
