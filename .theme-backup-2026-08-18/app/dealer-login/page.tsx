"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function DealerLogin() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);


  async function login(){

    try{

      setLoading(true);
      setError("");

      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );


      const userDoc = await getDoc(
        doc(db,"users",result.user.uid)
      );


      if(!userDoc.exists()){
        setError("Dealer profile not found");
        return;
      }


      const userData = userDoc.data();


      if(userData.role !== "property_dealer"){
        setError("This account is not a dealer account");
        return;
      }


      router.push("/dealer/dashboard");


    }catch(err:any){

      setError(
        err.message || "Login failed"
      );

    }finally{

      setLoading(false);

    }

  }


  return (

    <div className="min-h-screen bg-zinc-100 flex items-center justify-center">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-[#3B82F6]">
          Dealer Login
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Access your PropertyHub dealer account
        </p>


        <div className="mt-8 space-y-4">


          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border rounded-lg p-3"
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full border rounded-lg p-3"
          />


          {
            error &&
            <p className="text-red-500 text-sm">
              {error}
            </p>
          }


          <button
            onClick={login}
            disabled={loading}
            className="
            w-full
            bg-[#3B82F6]
            text-white
            py-3
            rounded-lg
            font-semibold
            hover:bg-[#60A5FA]
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>


          <p className="text-center text-sm text-gray-500">
            New dealer?{" "}
            <a
              href="/dealer-signup"
              className="text-[#3B82F6] font-semibold"
            >
              Create Account
            </a>
          </p>


        </div>

      </div>

    </div>

  );
}
