"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


export default function OwnerLeadsPage(){

  const { user } = useAuth();

  const [leads,setLeads] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);


  useEffect(()=>{

    async function fetchLeads(){

      if(!user) return;


      const q = query(
        collection(db,"leads"),
        where(
          "ownerId",
          "==",
          user.uid
        )
      );


      const snap = await getDocs(q);


      const data = snap.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }));


      setLeads(data);
      setLoading(false);

    }


    fetchLeads();


  },[user]);



  if(loading){

    return (
      <div className="p-8">
        Loading Leads...
      </div>
    );

  }



  return (

    <div className="min-h-screen bg-zinc-950 p-8">


      <h1 className="mb-8 text-3xl font-bold text-white">
        My Property Leads
      </h1>



      {
        leads.length===0 ?

        <div className="rounded-xl bg-zinc-900 p-6 text-white">
          No Leads Found
        </div>


        :


        <div className="grid gap-5">


        {
          leads.map((lead)=>(


            <div
              key={lead.id}
              className="rounded-xl bg-zinc-900 p-6 text-white shadow"
            >


              <h2 className="text-xl font-bold">
                {lead.propertyTitle}
              </h2>


              <p className="mt-2">
                👤 Name: {lead.name}
              </p>


              <p>
                📞 Phone: {lead.phone}
              </p>


              <p>
                Status: {lead.status}
              </p>


              <a
                href={`tel:${lead.phone}`}
                className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2"
              >
                Call Customer
              </a>


            </div>


          ))
        }


        </div>

      }


    </div>

  );

}
