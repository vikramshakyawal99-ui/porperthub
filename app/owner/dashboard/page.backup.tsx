"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


export default function OwnerDashboardPage(){

  const { user } = useAuth();

  const [properties,setProperties] = useState(0);
  const [leads,setLeads] = useState(0);
  const [visits,setVisits] = useState(0);



  useEffect(()=>{

    async function loadStats(){

      if(!user) return;


      try {


        const propertiesQuery = query(
          collection(db,"properties"),
          where("ownerId","==",user.uid)
        );


        const propertiesSnap = await getDocs(
          propertiesQuery
        );



        const leadsQuery = query(
          collection(db,"leads"),
          where("ownerId","==",user.uid)
        );


        const leadsSnap = await getDocs(
          leadsQuery
        );



        const visitsQuery = query(
          collection(db,"siteVisits"),
          where("ownerId","==",user.uid)
        );


        const visitsSnap = await getDocs(
          visitsQuery
        );



        setProperties(
          propertiesSnap.size
        );


        setLeads(
          leadsSnap.size
        );


        setVisits(
          visitsSnap.size
        );


      }
      catch(error){

        console.log(error);

      }

    }


    loadStats();


  },[user]);



  return (

    <div className="p-6">


      <h1 className="mb-8 text-3xl font-bold">
        Owner Dashboard
      </h1>



      <div className="grid gap-5 md:grid-cols-3 mb-8">


        <div className="rounded-xl border p-6 shadow">

          <h2 className="text-xl font-bold">
            🏠 Properties
          </h2>

          <p className="mt-3 text-3xl font-bold">
            {properties}
          </p>

        </div>




        <div className="rounded-xl border p-6 shadow">

          <h2 className="text-xl font-bold">
            📞 Leads
          </h2>

          <p className="mt-3 text-3xl font-bold">
            {leads}
          </p>

        </div>




        <div className="rounded-xl border p-6 shadow">

          <h2 className="text-xl font-bold">
            📅 Visits
          </h2>

          <p className="mt-3 text-3xl font-bold">
            {visits}
          </p>

        </div>


      </div>





      <div className="grid gap-6 md:grid-cols-5">



        <Link
          href="/owner/add-property"
          className="rounded-xl border p-6 shadow"
        >

          <h2 className="text-xl font-bold">
            ➕ Add Property
          </h2>

          <p>
            Create new listing
          </p>

        </Link>




        <Link
          href="/owner/my-properties"
          className="rounded-xl border p-6 shadow"
        >

          <h2 className="text-xl font-bold">
            🏠 My Properties
          </h2>

          <p>
            Manage properties
          </p>

        </Link>




        <Link
          href="/owner/listings"
          className="rounded-xl border p-6 shadow"
        >

          <h2 className="text-xl font-bold">
            📋 Listings
          </h2>

          <p>
            View listings
          </p>

        </Link>




        <Link
          href="/owner/leads"
          className="rounded-xl border p-6 shadow"
        >

          <h2 className="text-xl font-bold">
            📞 My Leads
          </h2>

          <p>
            Customer inquiries
          </p>

        </Link>




        <Link
          href="/owner/site-visits"
          className="rounded-xl border p-6 shadow"
        >

          <h2 className="text-xl font-bold">
            📅 Site Visits
          </h2>

          <p>
            Manage visits
          </p>

        </Link>



      </div>


    </div>

  );

}
