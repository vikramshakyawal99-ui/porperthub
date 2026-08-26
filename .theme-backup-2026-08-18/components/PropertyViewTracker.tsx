"use client";

import { useEffect } from "react";
import {
  doc,
  setDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "@/lib/firebase";

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

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        sessionStorage.setItem(key, "1");
        return;
      }

      sessionStorage.setItem(key, "1");

      try {
        await setDoc(
          doc(db, "propertyViews", propertyId),
          {
            propertyId,
            propertyTitle,
            views: increment(1),
            updatedAt: serverTimestamp(),
          },
          {
            merge: true,
          }
        );
      } catch (err) {
        console.error("View tracking failed", err);
      }
    });

    return () => unsubscribe();
  }, [propertyId, propertyTitle]);

  return null;
}
