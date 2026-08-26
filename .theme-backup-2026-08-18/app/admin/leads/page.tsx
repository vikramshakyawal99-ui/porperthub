"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LeadsPage() {

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchLeads = async () => {

      try {

        const snap = await getDocs(collection(db, "leads"));

        const data = snap.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setLeads(data);

      } catch (error) {

        console.log("Leads Error:", error);

      } finally {

        setLoading(false);

      }

    };


    fetchLeads();

  }, []);



  const updateStatus = async (id:string, status:string)=>{

    await updateDoc(
      doc(db,"leads",id),
      {status}
    );


    setLeads((prev)=>
      prev.map((lead)=>
        lead.id===id
        ? {...lead,status}
        : lead
      )
    );

  };



  const updateLeadDetails = async(
    id:string,
    notes:string,
    followUpDate:string
  )=>{

    await updateDoc(
      doc(db,"leads",id),
      {
        notes,
        followUpDate
      }
    );


    setLeads((prev)=>
      prev.map((lead)=>
        lead.id===id
        ? {
            ...lead,
            notes,
            followUpDate
          }
        : lead
      )
    );

  };


  const deleteLead = async(id:string)=>{

    if(!confirm("Delete this lead?")) return;


    await deleteDoc(
      doc(db,"leads",id)
    );


    setLeads((prev)=>
      prev.filter((lead)=>lead.id!==id)
    );

  };



  if(loading){

    return (
      <div className="p-8">
        Loading Leads...
      </div>
    );

  }



  return (

    <div className="p-8 bg-zinc-950 min-h-screen">

      <h1 className="text-3xl font-bold mb-8">
        Leads Management
      </h1>


      {
        leads.length===0 ?

        <div className="bg-zinc-900 p-6 rounded-xl shadow">
          No Leads Found
        </div>

        :

        <div className="grid gap-6">

        {
          leads.map((lead)=>(

            <div
              key={lead.id}
              className="bg-zinc-900 rounded-2xl shadow p-6 flex justify-between items-center"
            >

              <div>

                <h2 className="text-xl font-semibold">
                  {lead.name || "No Name"}
                </h2>

                <p>📞 {lead.phone}</p>

                <p>🏠 {lead.propertyTitle || "Property"}</p>

                <p>
                  Status: {lead.status || "Pending"}
                </p>


                <input
                  placeholder="Add Notes"
                  defaultValue={lead.notes || ""}
                  id={`notes-${lead.id}`}
                  className="mt-3 w-full rounded border p-2"
                />


                <input
                  type="date"
                  defaultValue={lead.followUpDate || ""}
                  id={`date-${lead.id}`}
                  className="mt-2 w-full rounded border p-2"
                />


                <button
                  onClick={() =>
                    updateLeadDetails(
                      lead.id,
                      (document.getElementById(`notes-${lead.id}`) as HTMLInputElement).value,
                      (document.getElementById(`date-${lead.id}`) as HTMLInputElement).value
                    )
                  }
                  className="mt-2 rounded-xl bg-green-600 px-4 py-2 text-white"
                >
                  Save Follow-up
                </button>

              </div>


              <div className="flex gap-3">

                <select
                  value={lead.status || "New"}
                  onChange={(e)=>updateStatus(lead.id,e.target.value)}
                  className="rounded-xl border px-4 py-2"
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Interested</option>
                  <option>Site Visit Scheduled</option>
                  <option>Closed</option>
                  <option>Rejected</option>
                </select>


                <a
                  href={`tel:${lead.phone}`}
                  className="bg-[#60A5FA] text-white px-5 py-2 rounded-xl"
                >
                  Call
                </a>


                <button
                  onClick={()=>deleteLead(lead.id)}
                  className="bg-red-600 text-white px-5 py-2 rounded-xl"
                >
                  Delete
                </button>


              </div>


            </div>

          ))
        }

        </div>

      }


    </div>

  );

}
