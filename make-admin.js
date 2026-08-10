const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const uid = "8N7SlofTSjee7hbWfbzVznvNvSb2";

async function makeAdmin(){

  const auth = getAuth();
  const db = getFirestore();

  await auth.setCustomUserClaims(uid,{
    role:"admin"
  });

  await db.collection("users").doc(uid).set(
    {
      role:"admin"
    },
    {
      merge:true
    }
  );

  console.log("✅ REAL USER ADMIN DONE");

}

makeAdmin().catch(console.error);
