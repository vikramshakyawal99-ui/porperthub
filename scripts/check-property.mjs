import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});

const db = getFirestore(app);

const snap = await getDoc(
  doc(db, "properties", "CKe1tcOOaIEtKNA2X3Oy")
);

if (!snap.exists()) {
  console.log("Document not found");
  process.exit(0);
}

const d = snap.data();

console.log(JSON.stringify({
  title: d.title,
  latitude: d.latitude,
  longitude: d.longitude,
  lat: d.lat,
  lng: d.lng
}, null, 2));
