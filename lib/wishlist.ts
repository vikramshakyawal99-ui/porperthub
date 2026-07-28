import {
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function addWishlist(
  uid: string,
  propertyId: string
) {
  await setDoc(
    doc(db, "users", uid, "wishlist", propertyId),
    {
      propertyId,
      createdAt: Date.now(),
    }
  );
}

export async function removeWishlist(
  uid: string,
  propertyId: string
) {
  await deleteDoc(
    doc(db, "users", uid, "wishlist", propertyId)
  );
}
