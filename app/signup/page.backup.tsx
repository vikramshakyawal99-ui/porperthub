"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createUserProfile } from "@/lib/user";


export default function SignupPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);


  async function handleSignup(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);


    try {

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


      await createUserProfile(
        result.user.uid,
        {
          name,
          email,
          role,
        }
      );


      alert("Account created successfully!");

      window.location.href = "/profile";


    } catch (error: any) {

      alert(error.message);

    }


    setLoading(false);

  }



  return (

    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">

      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-md">


        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>


        <form onSubmit={handleSignup} className="space-y-4">


          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg text-black"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />


          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg text-black"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />


          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg text-black"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />


          <select
            className="w-full p-3 rounded-lg text-black"
            value={role}
            onChange={(e)=>setRole(e.target.value)}
          >

            <option value="buyer">
              Buyer
            </option>

            <option value="property_owner">
              Property Owner
            </option>

            <option value="hostel_owner">
              Hostel Owner
            </option>

            <option value="pg_owner">
              PG Owner
            </option>

            <option value="room_owner">
              Room Rent Owner
            </option>

            <option value="resale_seller">
              Resale Seller
            </option>

          </select>



          <button
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg"
          >

            {loading ? "Creating..." : "Create Account"}

          </button>


        </form>


      </div>

    </div>

  );

}
