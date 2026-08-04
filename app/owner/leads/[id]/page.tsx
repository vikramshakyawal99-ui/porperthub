"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy
} from "firebase/firestore";

import { db } from "@/lib/firebase";


export default function LeadDetailsPage(){

  const { id } = useParams();

  const [lead,setLead] = useState<any>(null);

  const [status,setStatus] = useState("");
  const [notes,setNotes] = useState("");
  const [followUpDate,setFollowUpDate] = useState("");
  const [priority,setPriority] = useState("Medium");
  const [tags,setTags] = useState<string[]>([]);
  const [activities,setActivities] = useState<any[]>([]);

  const statuses = [
    "New",
    "Contacted",
    "Follow Up",
    "Interested",
    "Site Visit",
    "Closed",
    "Lost"
  ];


  useEffect(()=>{

    async function load(){

      if(!id) return;

      const snap = await getDoc(
        doc(db,"leads",id as string)
      );


      if(snap.exists()){

        const data:any = {
          id:snap.id,
          ...snap.data()
        };

        setLead(data);

        setStatus(data.status || "Follow Up");
        setNotes(data.notes || "");
        setFollowUpDate(data.followUpDate || "");
        setPriority(data.priority || "Medium");
        setTags(data.tags || []);

        if(data.activities){
          setActivities(data.activities);
        }

      }

    }


    load();


    async function loadActivities(){

      if(!id) return;


      const q = query(
        collection(db,"leadActivities"),
        where("leadId","==",id),
        orderBy("createdAt","desc")
      );


      const snap = await getDocs(q);


      const firestoreActivities =
      snap.docs.map((doc)=>({
        id:doc.id,
        ...doc.data()
      }));


      setActivities([
        ...firestoreActivities
      ]);

    }


    loadActivities();


  },[id]);





  const leadScore = ()=>{

    if(!lead) return 0;


    let score = 0;


    if(
      lead.status==="New" ||
      !lead.status
    ){
      score += 20;
    }


    if(
      lead.status==="Interested" ||
      lead.status==="Site Visit"
    ){
      score += 30;
    }


    if(
      lead.status==="Follow Up" ||
      lead.status==="Contacted"
    ){
      score += 15;
    }


    if(lead.followUpDate){

      const today =
      new Date()
      .toISOString()
      .split("T")[0];


      if(lead.followUpDate===today){
        score += 20;
      }


      if(lead.followUpDate < today){
        score -= 10;
      }

    }


    if(lead.message){
      score += 10;
    }


    if(score>100)
      score=100;


    if(score<0)
      score=0;


    return score;

  };



  const leadTemperature = ()=>{

    const score=leadScore();


    if(score>=70)
      return "🔥 Hot Lead";


    if(score>=40)
      return "🟡 Warm Lead";


    return "❄ Cold Lead";

  };


  const saveStatus = async(value:string)=>{

    if(!id) return;

    await updateDoc(
      doc(db,"leads",id as string),
      {

        status:value,


        priority:
        (
          value==="Closed" ||
          value==="Lost"
        )
        ?
        "Low"
        :
        (
          value==="Interested" ||
          value==="Site Visit"
        )
        ?
        "High"
        :
        "Medium",


        updatedAt:serverTimestamp()

      }
    );

    await addDoc(
      collection(db,"leadActivities"),
      {
        leadId:id,
        action:"Status Changed",
        value,
        createdAt:serverTimestamp()
      }
    );

    setStatus(value);

  };



  const saveDetails = async()=>{

    if(!id) return;


    await updateDoc(
      doc(db,"leads",id as string),
      {
        notes,
        followUpDate,
        priority,
        tags
      }
    );


    alert("Lead updated");

  };



  const addActivity = async(action:string,value:string)=>{

    if(!id) return;


    await addDoc(
      collection(db,"leadActivities"),
      {
        leadId:id,
        action,
        value,
        createdAt:serverTimestamp()
      }
    );


    setActivities((prev)=>[
      {
        id:Date.now(),
        action,
        value
      },
      ...prev
    ]);

  };



  const convertLead = async()=>{

    await saveStatus("Closed");

    await addActivity(
      "Lead Converted",
      "Customer converted successfully"
    );

  };



  const markLost = async()=>{

    await saveStatus("Lost");

    await addActivity(
      "Lead Lost",
      "Customer marked as lost"
    );

  };




  if(!lead){

    return(
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  }



  return(

    <div className="min-h-screen bg-zinc-950 text-white p-8">


      <h1 className="text-3xl font-bold mb-8">
        📋 Lead Details
      </h1>


      <div className="bg-zinc-900 rounded-2xl p-6 mb-6 border border-zinc-700">

<h2 className="text-3xl font-bold mb-4">
👤 {lead.name || lead.customerName || "Customer"}
</h2>

<div className="grid md:grid-cols-4 gap-4">

<div className="bg-zinc-800 p-4 rounded-xl">
<p className="text-gray-400">
Phone
</p>
<p className="font-bold">
{lead.phone || lead.customerPhone || "N/A"}
</p>
</div>


<div className="bg-zinc-800 p-4 rounded-xl">
<p className="text-gray-400">
Email
</p>
<p className="font-bold">
{lead.email || lead.customerEmail || "N/A"}
</p>
</div>


<div className="bg-zinc-800 p-4 rounded-xl">
<p className="text-gray-400">
Source
</p>
<p className="font-bold">
{lead.source || lead.leadSource || "Website"}
</p>
</div>


<div className="bg-zinc-800 p-4 rounded-xl">
<p className="text-gray-400">
Stage
</p>
<p className="font-bold">
{lead.status || "New"}
</p>
</div>


</div>

</div>


<div className="bg-gradient-to-r from-blue-900 to-zinc-900 rounded-2xl p-6 mb-6 border border-blue-500">

        <h2 className="text-2xl font-bold mb-4">
          🧠 Lead Intelligence
        </h2>

        <div className="flex gap-4 flex-wrap">

          <div className="bg-zinc-800 px-5 py-4 rounded-xl">
            <p className="text-gray-400">
              Lead Score
            </p>

            <p className="text-3xl font-bold mb-3">
              {leadScore()}/100
            </p>


<div className="w-full bg-zinc-700 rounded-full h-3">

<div
className="bg-green-500 h-3 rounded-full"
style={{
width:`${leadScore()}%`
}}
></div>

</div>
          </div>


          <div className="bg-zinc-800 px-5 py-4 rounded-xl">
            <p className="text-gray-400">
              Temperature
            </p>

            <p className="text-xl font-bold">
              {leadTemperature()}
            </p>
          </div>


        </div>


      </div>



      <div className="bg-zinc-900 rounded-2xl p-6 mb-6">


<h2 className="text-2xl font-bold mb-5">
🏠 Buyer Requirement
</h2>


<div className="grid md:grid-cols-3 gap-4">


<div className="bg-zinc-800 p-4 rounded-xl">
<p className="text-gray-400">
Property Type
</p>
<p className="font-bold">
{lead.propertyType || lead.type || "N/A"}
</p>
</div>


<div className="bg-zinc-800 p-4 rounded-xl">
<p className="text-gray-400">
Location
</p>
<p className="font-bold">
{lead.location || "N/A"}
</p>
</div>


<div className="bg-zinc-800 p-4 rounded-xl">
<p className="text-gray-400">
Budget
</p>
<p className="font-bold">
{lead.budget || lead.price || "N/A"}
</p>
</div>


<div className="bg-zinc-800 p-4 rounded-xl">
<p className="text-gray-400">
Bedrooms
</p>
<p className="font-bold">
{lead.bedrooms || "N/A"}
</p>
</div>


<div className="bg-zinc-800 p-4 rounded-xl">
<p className="text-gray-400">
Area
</p>
<p className="font-bold">
{lead.area || "N/A"}
</p>
</div>


<div className="bg-zinc-800 p-4 rounded-xl">
<p className="text-gray-400">
Interested Property
</p>
<p className="font-bold">
{lead.propertyTitle || "N/A"}
</p>
</div>


</div>


</div>



<div className="bg-zinc-900 rounded-2xl p-6 space-y-5">


        <p>
          <b>Name:</b> {lead.name || lead.customerName}
        </p>


        <p>
          <b>Phone:</b> {lead.phone || lead.customerPhone}
        </p>


        <p>
          <b>Email:</b> {lead.email || lead.customerEmail}
        </p>


        <p>
          <b>Property:</b> {lead.propertyTitle || "N/A"}
        </p>



        <div>

          <b>Status:</b>

          <select
            value={status}
            onChange={(e)=>saveStatus(e.target.value)}
            className="ml-3 bg-zinc-800 rounded-lg p-2"
          >

            {statuses.map((item)=>(

              <option key={item}>
                {item}
              </option>

            ))}

          </select>

        </div>



        <div>

          <b>Priority:</b>

          <select
          value={priority}
          onChange={(e)=>setPriority(e.target.value)}
          className="ml-3 bg-zinc-800 rounded-lg p-2"
          >

          <option value="High">
          🔥 High
          </option>

          <option value="Medium">
          🟡 Medium
          </option>

          <option value="Low">
          ❄ Low
          </option>

          </select>

        </div>



        <div>

          <b>Tags:</b>

          <div className="flex gap-2 flex-wrap mt-2">

          {[
            "Buyer",
            "Investor",
            "Urgent",
            "Call Back",
            "Commercial"
          ].map((tag)=>(

            <button
            key={tag}
            onClick={()=>{
              setTags((prev)=>
                prev.includes(tag)
                ?
                prev.filter(t=>t!==tag)
                :
                [...prev,tag]
              )
            }}
            className={
              tags.includes(tag)
              ?
              "bg-blue-600 px-3 py-2 rounded-lg"
              :
              "bg-zinc-700 px-3 py-2 rounded-lg"
            }
            >
              {tag}
            </button>

          ))}

          </div>

        </div>



        <div>

          <b>Message:</b>

          <div className="bg-zinc-800 rounded-lg p-4 mt-2">
            {lead.message || "No message"}
          </div>

        </div>



        <div>

          <b>Notes:</b>

          <textarea
            value={notes}
            onChange={(e)=>setNotes(e.target.value)}
            className="w-full bg-zinc-800 rounded-lg p-3 mt-2"
            rows={4}
          />

        </div>



        <div>

          <b>Follow Up Date:</b>

          <input
            type="date"
            value={followUpDate}
            onChange={(e)=>setFollowUpDate(e.target.value)}
            className="ml-3 bg-zinc-800 rounded-lg p-2"
          />

        </div>



        <button
          onClick={saveDetails}
          className="bg-blue-600 px-5 py-3 rounded-xl"
        >
          Save Updates
        </button>




        <div className="flex gap-3 flex-wrap pt-3">


          <button

            onClick={()=>addActivity(
              "Note Added",
              notes || "New note"
            )}

            className="bg-purple-600 px-5 py-3 rounded-xl"
          >

            📝 Add Note Activity

          </button>



          <button

            onClick={()=>addActivity(
              "Follow-up Scheduled",
              followUpDate || "No date"
            )}

            className="bg-orange-600 px-5 py-3 rounded-xl"
          >

            📅 Schedule Follow-up

          </button>



          <button

            onClick={convertLead}

            className="bg-green-700 px-5 py-3 rounded-xl"
          >

            ✅ Convert Lead

          </button>



          <button

            onClick={markLost}

            className="bg-red-700 px-5 py-3 rounded-xl"
          >

            ❌ Mark Lost

          </button>


        </div>




        <div className="mt-8">

          <h2 className="text-2xl font-bold mb-4">
            📋 Activity Timeline
          </h2>


          <div className="space-y-3">

          {activities.length===0 && (
            <p className="text-gray-400">
              No activity yet
            </p>
          )}


          {activities.map((item:any)=>(

            <div
              key={item.id}
              className="bg-zinc-800 rounded-xl p-4"
            >

              <p className="font-bold">
                {item.action}
              </p>

              <p className="text-gray-300">
                {item.value}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {
                  item.createdAt?.toDate
                  ?
                  item.createdAt.toDate().toLocaleString()
                  :
                  "Just now"
                }
              </p>

            </div>

          ))}

          </div>

        </div>


        <div className="flex gap-3 pt-4">


          <a
            href={`tel:${lead.phone || lead.customerPhone}`}
            onClick={()=>
              addActivity(
                "Call Made",
                "📞 Customer called"
              )
            }
            className="bg-green-600 px-5 py-3 rounded-xl"
          >
            📞 Call Buyer
          </a>



          <a
            target="_blank"
            href={`https://wa.me/${lead.phone || lead.customerPhone}`}
            onClick={()=>
              addActivity(
                "WhatsApp Opened",
                "💬 WhatsApp conversation started"
              )
            }
            className="bg-emerald-600 px-5 py-3 rounded-xl"
          >
            💬 WhatsApp
          </a>


        </div>


      </div>


    </div>

  );

}
