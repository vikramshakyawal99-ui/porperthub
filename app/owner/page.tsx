"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function OwnerDashboard() {

  const { user, role, loading } = useAuth();

  const router = useRouter();


  useEffect(()=>{

    if(!loading){

      if(!user){
        router.push("/login");
      }

      if(
        user &&
        role !== "hostel_owner" &&
        role !== "pg_owner" &&
        role !== "room_owner"
      ){
        router.push("/");
      }

    }

  },[user, role, loading]);


  if(loading){
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }


  return (

    <div className="min-h-screen bg-zinc-950 text-white p-10">

      <div className="max-w-5xl mx-auto">


        <h1 className="text-4xl font-bold mb-3">
          🏢 Owner Dashboard
        </h1>


        <p className="text-gray-400 mb-8">
          Welcome {user?.email}
        </p>



        <div className="grid md:grid-cols-4 gap-6">


          <Link
            href="/owner/add-property"
            className="bg-green-600 p-6 rounded-2xl text-center hover:scale-105 transition"
          >
            ➕
            <br/>
            Add Hostel
          </Link>



          <Link
            href="/owner/listings"
            className="bg-blue-600 p-6 rounded-2xl text-center hover:scale-105 transition"
          >
            🏠
            <br/>
            My Listings
          </Link>



          <div className="bg-purple-600 p-6 rounded-2xl text-center">
            📞
            <br/>
            Leads
          </div>



          <div className="bg-orange-600 p-6 rounded-2xl text-center">
            👥
            <br/>
            Site Visits
          </div>



        </div>


      </div>

    </div>

  );

}
