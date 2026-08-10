"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import PropertyCard from "./PropertyCard";

type Props = {
  currentId: string;
  location?: string;
  propertyType?: string;
};

export default function SimilarProperties({
  currentId,
  location: _location,
  propertyType,
}: Props) {

  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {

    async function load() {

      try {

        const q = query(
          collection(db, "properties"),
          where("status", "==", "approved"),
          where("propertyType", "==", propertyType || ""),
          limit(4)
        );

        const snap = await getDocs(q);

        const data = snap.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(p => p.id !== currentId);

        setProperties(data);

      } catch (e) {

        console.error(e);

      }

    }

    if(propertyType){
      load();
    }

  }, [currentId, propertyType]);



  if(properties.length===0){
    return null;
  }



  return (

    <section className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

      <h2 className="mb-8 text-4xl font-black tracking-tight text-slate-900">
        🏡 Similar Premium Properties
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {properties.map(property=>(

          <PropertyCard
            key={property.id}
            property={property}
          />

        ))}

      </div>

    </section>

  );

}
