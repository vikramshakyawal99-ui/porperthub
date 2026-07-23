import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


export async function createUserProfile(
  uid: string,
  data: {
    name?: string;
    email: string;
    role?: string;
    phone?: string;
  }
) {

  await setDoc(doc(db, "users", uid), {

    name: data.name || "",

    email: data.email,

    role: data.role || "buyer",

    phone: data.phone || "",

    createdAt: new Date(),

  });

}



export async function getUserProfile(uid: string) {

  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);


  if (snapshot.exists()) {

    return snapshot.data();

  }


  return null;

}
