"use client";

import { useEffect } from "react";
import {
  doc,
  setDoc,
  increment,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type Props = {
  propertyId: string;
  propertyTitle: string;
};

export default function PropertyViewTracker({
  propertyId,
  propertyTitle,
}: Props) {

  useEffect(() => {

    const key = "viewed_" + propertyId;

    if (sessionStorage.getItem(key)) {
      return;
    }

    sessionStorage.setItem(key, "1");

    async function track() {
      try {
        await setDoc(
          doc(db, "propertyViews", propertyId),
          {
            propertyId,
            propertyTitle,
            views: increment(1),
            updatedAt: new Date(),
          },
          {
            merge: true,
          }
        );
      } catch (err) {
        console.error("View tracking failed", err);
      }
    }

    track();

  }, [propertyId, propertyTitle]);

  return null;
}
