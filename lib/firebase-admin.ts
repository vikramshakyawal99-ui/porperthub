import {
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

const adminApp =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId: requiredEnv(
        "FIREBASE_ADMIN_PROJECT_ID"
      ),
      clientEmail: requiredEnv(
        "FIREBASE_ADMIN_CLIENT_EMAIL"
      ),
      privateKey: requiredEnv(
        "FIREBASE_ADMIN_PRIVATE_KEY"
      ).replace(/\\n/g, "\n"),
    }),
  });

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
