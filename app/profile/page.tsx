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

          className="bg-green-600 text-slate-900 px-6 py-3 rounded-xl"

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



  const role = profile?.role || "buyer";

  const isOwner = ownerRoles.includes(role);
  const isBuyer = role === "buyer";
  const isDealer = role === "property_dealer";
  const isTeamMember = role === "team_member";
  const isAdmin = role === "admin";





  return (


    <div className="min-h-screen bg-slate-50 text-slate-900 p-10">


      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-xl">



        <h1 className="text-3xl font-bold mb-6">

          👤 My Profile

        </h1>




        <div className="space-y-4">



          <div className="border border-slate-200/10 rounded-xl p-4">

            <p className="text-slate-500">
              Name
            </p>


            <p className="text-xl">
              {profile?.name || "User"}
            </p>

          </div>






          <div className="border border-slate-200/10 rounded-xl p-4">


            <p className="text-slate-500">
              Email
            </p>


            <p>
              {user.email}
            </p>


          </div>






          <div className="border border-slate-200/10 rounded-xl p-4">


            <p className="text-slate-500">
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







            {isBuyer && (

              <Link

                href="/buyer/dashboard"

                className="bg-green-600 p-5 rounded-xl text-center"

              >

                👤 Buyer Dashboard

              </Link>

            )}


            {isTeamMember && (

              <Link

                href="/team/dashboard"

                className="bg-green-600 p-5 rounded-xl text-center"

              >

                👥 Team Dashboard

              </Link>

            )}


            {isDealer && (

              <Link

                href="/dealer/dashboard"

                className="bg-green-600 p-5 rounded-xl text-center"

              >

                🏢 Dealer Dashboard

              </Link>

            )}


            {isAdmin && (

              <Link

                href="/admin/dashboard"

                className="bg-green-600 p-5 rounded-xl text-center"

              >

                🛡️ Admin Panel

              </Link>

            )}




            <Link

              href="/properties"

              className="bg-green-600 p-5 rounded-xl text-center"

            >

              🏠 Browse Properties

            </Link>







            {isOwner && (

              <Link

                href="/owner/dashboard"

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
