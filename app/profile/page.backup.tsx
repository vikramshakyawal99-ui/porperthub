"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export default function ProfilePage() {

  const { user, loading } = useAuth();


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }


  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5">

        <h1 className="text-3xl font-bold">
          Please Login First
        </h1>

        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Login
        </Link>

      </div>
    );
  }


  return (

    <div className="min-h-screen bg-zinc-950 text-white p-10">

      <div className="max-w-3xl mx-auto bg-zinc-900 rounded-2xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold mb-6">
          👤 My Profile
        </h1>


        <div className="space-y-4">

          <div className="border border-white/10 rounded-xl p-4">
            <p className="text-gray-400">
              Email
            </p>

            <p className="text-lg">
              {user.email}
            </p>
          </div>



          <div className="grid md:grid-cols-3 gap-4 mt-8">

            <Link
              href="/favorites"
              className="bg-pink-600 p-5 rounded-xl text-center"
            >
              ❤️ Saved Properties
            </Link>


            <Link
              href="/properties"
              className="bg-blue-600 p-5 rounded-xl text-center"
            >
              🏠 Browse Properties
            </Link>


            <div
              className="bg-green-600 p-5 rounded-xl text-center"
            >
              🏢 My Listings
              <br />
              Coming Soon
            </div>

          </div>


        </div>


      </div>


    </div>

  );
}
