"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


export default function MyEnquiriesPage(){

const {user}=useAuth();

const [leads,setLeads]=useState<any[]>([]);
const [loading,setLoading]=useState(true);



useEffect(()=>{


async function fetchEnquiries(){

if(!user){
return;
}


const q=query(
collection(db,"leads"),
where("buyerId","==",user.uid)
);


const snap=await getDocs(q);


const data=snap.docs.map(doc=>({

id:doc.id,
...doc.data()

}));


setLeads(data);

setLoading(false);

}


fetchEnquiries();


},[user]);




if(loading){

return(
<div className="p-8">
Loading Enquiries...
</div>
);

}



return(

<div className="min-h-screen bg-slate-50 text-slate-900 p-8">


<div className="max-w-5xl mx-auto">


<h1 className="text-3xl font-bold mb-8">
📩 My Enquiries
</h1>



{
leads.length===0 ?

<div className="bg-white p-6 rounded-xl">
No enquiries found
</div>


:

<div className="space-y-5">


{
leads.map((lead)=>(

<div
key={lead.id}
className="bg-white p-6 rounded-2xl"
>


<h2 className="text-xl font-bold">
🏠 {lead.propertyTitle || "Property"}
</h2>


<p className="mt-3">
Status:
<span className="ml-2 bg-green-600 px-3 py-1 rounded-full">
{lead.status || "New"}
</span>
</p>


{
lead.message &&

<p className="mt-4 text-gray-300">
💬 {lead.message}
</p>

}


{
lead.followUpDate &&

<p className="mt-3">
📅 Follow Up: {lead.followUpDate}
</p>

}



</div>

))

}


</div>

}


</div>


</div>

);


}
