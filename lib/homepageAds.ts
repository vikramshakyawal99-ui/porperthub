import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type HomepageAdDocument = {
  id: string;
  [key: string]: unknown;
};

let cachedAds: HomepageAdDocument[] | null = null;
let pendingRequest: Promise<HomepageAdDocument[]> | null = null;

export async function getActiveHomepageAds() {
  if (cachedAds) {
    return cachedAds;
  }

  if (pendingRequest) {
    return pendingRequest;
  }

  pendingRequest = getDocs(
    query(
      collection(db, "homepageAds"),
      where("active", "==", true)
    )
  )
    .then((snapshot) => {
      cachedAds = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      pendingRequest = null;

      return cachedAds;
    })
    .catch((error) => {
      pendingRequest = null;
      throw error;
    });

  return pendingRequest;
}
