"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  doc,
  getDoc,
setDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "@/lib/firebase";

const OWNER_ROLES = [
  "property_owner",
  "hostel_owner",
  "pg_owner",
  "room_owner",
  "resale_seller",
];

export default function OwnerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {

      if(isSignup){

        const credential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        await setDoc(
          doc(db,"users",credential.user.uid),
          {
            name,
            email,
            role:"property_owner",
            createdAt:new Date()
          }
        );

        alert("Owner account created");
        window.location.href="/owner/dashboard";
        return;
      }


      const credential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const snap = await getDoc(
        doc(db, "users", credential.user.uid)
      );

      if (!snap.exists()) {
        alert("Account not found.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      const role = snap.data().role;

      if (!OWNER_ROLES.includes(role)) {
        alert("Please use the correct login page.");
        await auth.signOut();
        setLoading(false);
        return;
      }

      window.location.href = "/owner/dashboard";
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-xl">

        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Owner Login
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

        {isSignup && (
          <input
            type="text"
            placeholder="Owner Name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            className="w-full rounded-lg p-3 text-black"
            required
          />
        )}

          <input
            type="email"
            placeholder="Owner Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full rounded-lg p-3 text-black"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full rounded-lg p-3 text-black"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-green-600 p-3 text-white hover:bg-green-700"
          >
            {loading ? "Please wait..." : (isSignup ? "Create Owner Account" : "Owner Login")}
          </button>

        </form>

        <button
          onClick={()=>setIsSignup(!isSignup)}
          className="mt-4 w-full text-center text-green-400"
        >
          {isSignup ? "Already have account? Login" : "Create New Owner ID"}
        </button>

      </div>
    </div>
  );
}
