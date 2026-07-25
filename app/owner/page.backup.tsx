"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function OwnerDashboard() {

  const { user } = useAuth();


  return (

    <div className="min-h-screen bg-zinc-950 text-white p-10">


      <div className="max-w-5xl mx-auto">


        <h1 className="text-4xl font-bold mb-3">
          🏢 Owner Dashboard
        </h1>


        <p className="text-gray-400 mb-8">
          Welcome {user?.email}
        </p>



        <div className="grid md:grid-cols-3 gap-6">


          <Link
            href="/owner/add-property"
            className="bg-green-600 p-8 rounded-2xl text-center hover:scale-105 transition"
          >
            ➕
            <br />
            Add Listing
          </Link>



          <Link
            href="/owner/listings"
            className="bg-blue-600 p-8 rounded-2xl text-center hover:scale-105 transition"
          >
            🏠
            <br />
            My Listings
          </Link>



          <div
            className="bg-purple-600 p-8 rounded-2xl text-center"
          >
            📞
            <br />
            Leads
            <br />
            Coming Soon
          </div>



        </div>


      </div>


    </div>

  );

}
