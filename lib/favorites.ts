import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const favoriteCache = new Map<string, Set<string>>();
const favoriteRequests = new Map<string, Promise<Set<string>>>();

async function loadFavoriteIds(uid: string): Promise<Set<string>> {
  const cached = favoriteCache.get(uid);

  if (cached) {
    return cached;
  }

  const existingRequest = favoriteRequests.get(uid);

  if (existingRequest) {
    return existingRequest;
  }

  const request = getDocs(
    collection(db, "users", uid, "favorites")
  )
    .then((snapshot) => {
      const ids = new Set(
        snapshot.docs.map((favoriteDoc) => favoriteDoc.id)
      );

      favoriteCache.set(uid, ids);
      favoriteRequests.delete(uid);

      return ids;
    })
    .catch((error) => {
      favoriteRequests.delete(uid);
      throw error;
    });

  favoriteRequests.set(uid, request);

  return request;
}

export async function isFavorite(
  uid: string,
  propertyId: string
) {
  const favoriteIds = await loadFavoriteIds(uid);

  return favoriteIds.has(propertyId);
}

export async function addFavorite(
  uid: string,
  propertyId: string
) {
  await setDoc(
    doc(db, "users", uid, "favorites", propertyId),
    {
      propertyId,
      createdAt: Date.now(),
    }
  );

  const cached = favoriteCache.get(uid);

  if (cached) {
    cached.add(propertyId);
  }
}

export async function removeFavorite(
  uid: string,
  propertyId: string
) {
  await deleteDoc(
    doc(db, "users", uid, "favorites", propertyId)
  );

  const cached = favoriteCache.get(uid);

  if (cached) {
    cached.delete(propertyId);
  }
}
