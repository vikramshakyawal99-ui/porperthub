"use client";

import { useAuth } from "@/components/AuthProvider";
import { getUserProfile } from "@/lib/user";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function ProfilePage() {

  const { user, loading } = useAuth();

  const [profile, setProfile] = useState<any>(null);



  useEffect(() => {

    async function loadProfile() {

      if (user) {

        const data = await getUserProfile(user.uid);

        console.log("PROFILE DATA:", data);

        setProfile(data);

      }

    }


    loadProfile();


  }, [user]);





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





  const ownerRoles = [

    "property_owner",

    "hostel_owner",

    "pg_owner",

    "room_owner",

    "resale_seller"

  ];



  const isOwner = ownerRoles.includes(profile?.role);





  return (


    <div className="min-h-screen bg-zinc-950 text-white p-10">


      <div className="max-w-3xl mx-auto bg-zinc-900 rounded-2xl p-8 shadow-xl">



        <h1 className="text-3xl font-bold mb-6">

          👤 My Profile

        </h1>




        <div className="space-y-4">



          <div className="border border-white/10 rounded-xl p-4">

            <p className="text-gray-400">
              Name
            </p>


            <p className="text-xl">
              {profile?.name || "User"}
            </p>

          </div>






          <div className="border border-white/10 rounded-xl p-4">


            <p className="text-gray-400">
              Email
            </p>


            <p>
              {user.email}
            </p>


          </div>






          <div className="border border-white/10 rounded-xl p-4">


            <p className="text-gray-400">
              Account Type
            </p>


            <p className="text-green-400 text-xl">

              {profile?.role || "buyer"}

            </p>


          </div>







          <div className="grid md:grid-cols-2 gap-4 mt-6">





            <Link

              href="/favorites"

              className="bg-pink-600 p-5 rounded-xl text-center"

            >

              ❤️ Saved Properties

            </Link>







            <Link

              href="/buyer/dashboard"

              className="bg-purple-600 p-5 rounded-xl text-center"

            >

              👤 Buyer Dashboard

            </Link>




            <Link

              href="/properties"

              className="bg-blue-600 p-5 rounded-xl text-center"

            >

              🏠 Browse Properties

            </Link>







            {isOwner && (

              <Link

                href="/owner"

                className="bg-green-600 p-5 rounded-xl text-center"

              >

                🏢 Owner Dashboard

              </Link>

            )}





          </div>




        </div>




      </div>




    </div>


  );


}
