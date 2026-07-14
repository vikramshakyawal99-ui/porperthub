import {
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function addFavorite(
  uid: string,
  propertyId: number
) {
  await setDoc(
    doc(db, "users", uid, "favorites", propertyId.toString()),
    {
      propertyId,
      createdAt: Date.now(),
    }
  );
}

export async function removeFavorite(
  uid: string,
  propertyId: number
) {
  await deleteDoc(
    doc(db, "users", uid, "favorites", propertyId.toString())
  );
}
