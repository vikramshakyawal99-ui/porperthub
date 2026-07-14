import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNXI2sYhW2AjnMRlFTBe5IGzYyUzBeyDk",
  authDomain: "propertyhub-2a2da.firebaseapp.com",
  projectId: "propertyhub-2a2da",
  storageBucket: "propertyhub-2a2da.firebasestorage.app",
  messagingSenderId: "883377553052",
  appId: "1:883377553052:web:7c23f0d7abcbcdecfc3759",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
