"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function DealerSignup(){

  const router = useRouter();

  const [name,setName] = useState("");
  const [business,setBusiness] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [city,setCity] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);


  async function signup(){

    try{

      setLoading(true);
      setError("");

      const user = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


      await setDoc(
        doc(db,"users",user.user.uid),
        {
          name,
          business,
          email,
          phone,
          city,
          role:"property_dealer",
          createdAt:new Date()
        }
      );


      router.push("/dealer/dashboard");


    }catch(err:any){

      setError(err.message);

    }finally{

      setLoading(false);

    }

  }


  return (

    <div className="min-h-screen bg-zinc-100 flex items-center justify-center">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          Dealer Registration
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Create your PropertyHub dealer account
        </p>


        <div className="mt-6 space-y-3">


          <input
            placeholder="Dealer Name"
            className="w-full border rounded-lg p-3"
            onChange={(e)=>setName(e.target.value)}
          />

          <input
            placeholder="Business Name"
            className="w-full border rounded-lg p-3"
            onChange={(e)=>setBusiness(e.target.value)}
          />


          <input
            placeholder="Email"
            className="w-full border rounded-lg p-3"
            onChange={(e)=>setEmail(e.target.value)}
          />


          <input
            placeholder="Mobile Number"
            className="w-full border rounded-lg p-3"
            onChange={(e)=>setPhone(e.target.value)}
          />


          <input
            placeholder="City"
            className="w-full border rounded-lg p-3"
            onChange={(e)=>setCity(e.target.value)}
          />


          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3"
            onChange={(e)=>setPassword(e.target.value)}
          />


          {
            error &&
            <p className="text-red-500 text-sm">
              {error}
            </p>
          }


          <button
            onClick={signup}
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Creating..." : "Create Dealer Account"}
          </button>


        </div>

      </div>

    </div>

  );

}
