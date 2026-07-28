"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
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

export default function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "properties"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Property[];
        console.log("SNAPSHOT SIZE:", snapshot.size);
        console.log("FIREBASE DATA:", data);

        setProperties(data);
        setLoading(false);
      },
      (error) => {
        console.error("🔥 FIRESTORE ERROR:", error);
alert(JSON.stringify(error));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    properties,
    loading,
  };
}
