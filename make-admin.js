const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function makeAdmin() {
  const uid = "IEV1aMcJmlc9aKsHb0y6fThNF8B3";

  await db.collection("users").doc(uid).set(
    {
      role: "admin",
    },
    { merge: true }
  );

  console.log("✅ ADMIN DONE");
  process.exit(0);
}

makeAdmin().catch((err) => {
  console.error("❌ ERROR:", err);
  process.exit(1);
});
