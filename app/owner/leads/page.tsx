"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


export default function OwnerLeadsPage() {

  const { user } = useAuth();

  const [leads,setLeads] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);



  async function fetchLeads(){

    if(!user) return;


    const q=query(
      collection(db,"leads"),
      where("ownerId","==",user.uid)
    );


    const snap=await getDocs(q);


    const data=snap.docs.map((item)=>({
      id:item.id,
      ...item.data()
    }));


    setLeads(data);
    setLoading(false);

  }



  useEffect(()=>{

    fetchLeads();

  },[user]);





  async function updateStatus(
    id:string,
    status:string
  ){

    await updateDoc(
      doc(db,"leads",id),
      {
        status
      }
    );


    setLeads((prev)=>
      prev.map((lead)=>
        lead.id===id
        ?
        {...lead,status}
        :
        lead
      )
    );

  }





  async function saveFollowUp(
    id:string,
    notes:string,
    date:string
  ){

    await updateDoc(
      doc(db,"leads",id),
      {
        notes,
        followUpDate:date
      }
    );


    setLeads((prev)=>
      prev.map((lead)=>
        lead.id===id
        ?
        {
          ...lead,
          notes,
          followUpDate:date
        }
        :
        lead
      )
    );

  }




  if(loading){

    return(
      <div className="p-8">
        Loading Leads...
      </div>
    );

  }





  return (

    <div className="p-8 bg-zinc-950 min-h-screen text-white">


      <h1 className="text-3xl font-bold mb-8">
        📞 My Leads
      </h1>



      {
        leads.length===0 ?

        <div className="bg-zinc-900 p-6 rounded-xl">
          No Leads Found
        </div>


        :

        <div className="grid gap-6">


        {
          leads.map((lead)=>(


            <div
              key={lead.id}
              className="bg-zinc-900 rounded-2xl p-6 shadow"
            >


              <h2 className="text-xl font-bold">
                {lead.name || "Customer"}
              </h2>


              <p>
                📞 {lead.phone}
              </p>


              <p>
                🏠 {lead.propertyTitle || "Property"}
              </p>



              <div className="mt-3">

              {
                lead.status==="Closed" ?

                <span className="bg-green-600 px-3 py-1 rounded">
                  Closed
                </span>

                :

                lead.status==="Rejected" ?

                <span className="bg-red-600 px-3 py-1 rounded">
                  Rejected
                </span>

                :

                <span className="bg-yellow-500 text-black px-3 py-1 rounded">
                  {lead.status || "New"}
                </span>

              }

              </div>




              <select

                value={lead.status || "New"}

                onChange={(e)=>
                  updateStatus(
                    lead.id,
                    e.target.value
                  )
                }

                className="mt-4 text-black rounded p-2"

              >

                <option>New</option>
                <option>Contacted</option>
                <option>Interested</option>
                <option>Site Visit Scheduled</option>
                <option>Closed</option>
                <option>Rejected</option>

              </select>





              <input

                id={`date-${lead.id}`}

                type="date"

                defaultValue={lead.followUpDate || ""}

                className="mt-4 block text-black rounded p-2"

              />




              <textarea

                id={`note-${lead.id}`}

                defaultValue={lead.notes || ""}

                placeholder="Add Notes"

                className="mt-3 block w-full text-black rounded p-2"

              />





              <button

                onClick={()=>{

                  const date =
                  (document.getElementById(`date-${lead.id}`) as HTMLInputElement).value;


                  const notes =
                  (document.getElementById(`note-${lead.id}`) as HTMLTextAreaElement).value;


                  saveFollowUp(
                    lead.id,
                    notes,
                    date
                  );

                }}

                className="mt-3 bg-green-600 px-5 py-2 rounded-xl"

              >
                Save Follow-up

              </button>




              <div className="mt-5 flex gap-3">


                <a
                  href={`tel:${lead.phone}`}
                  className="bg-blue-600 px-5 py-2 rounded-xl"
                >
                  📞 Call
                </a>



                <a
                  href={`https://wa.me/91${lead.phone}`}
                  target="_blank"
                  className="bg-green-600 px-5 py-2 rounded-xl"
                >
                  WhatsApp
                </a>


              </div>



            </div>


          ))
        }


        </div>

      }


    </div>

  );

}
