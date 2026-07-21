"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Property = {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  images?: string[];
  builder: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  rating: number;
  description: string;
};

export default function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "properties"),
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Property[];

        setProperties(data);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { properties, loading };
}
