"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


export default function OwnerSiteVisitsPage(){

const {user}=useAuth();

const [visits,setVisits]=useState<any[]>([]);
const [loading,setLoading]=useState(true);
const [filter,setFilter]=useState("all");



async function fetchVisits(){

if(!user) return;


const q=query(
collection(db,"siteVisits"),
where("ownerId","==",user.uid)
);


const snap=await getDocs(q);


const data=snap.docs.map((item)=>({

id:item.id,
...item.data()

}));


setVisits(data);
setLoading(false);

}




useEffect(()=>{

fetchVisits();

},[user]);





async function updateStatus(
id:string,
status:string
){

await updateDoc(
doc(db,"siteVisits",id),
{
status
}
);


fetchVisits();

}





if(loading){

return(
<div className="p-8">
Loading Site Visits...
</div>
);

}





const filteredVisits =
filter==="all"
?
visits
:
visits.filter(
(visit)=>visit.status===filter
);





return(

<main className="min-h-screen bg-zinc-950 text-white p-8">


<div className="max-w-6xl mx-auto">


<h1 className="text-3xl font-bold mb-8">
📅 My Site Visits
</h1>




<div className="flex gap-3 mb-8">


{
["all","Pending","Approved","Rejected"].map((item)=>(

<button

key={item}

onClick={()=>setFilter(item)}

className="bg-blue-600 px-5 py-2 rounded-xl"

>

{item}

</button>

))

}


</div>





{
filteredVisits.length===0 ?

<div className="bg-zinc-900 p-6 rounded-xl">
No Site Visits Found
</div>


:


<div className="space-y-5">


{
filteredVisits.map((visit)=>(


<div

key={visit.id}

className="bg-zinc-900 rounded-2xl p-6 shadow"

>


<h2 className="text-xl font-bold">
🏠 {visit.propertyTitle}
</h2>


<p>
👤 {visit.name}
</p>


<p>
📞 {visit.phone}
</p>


<p>
📅 {visit.date}
</p>


<p>
⏰ {visit.time}
</p>


<p>
📝 {visit.message || "-"}
</p>



<div className="mt-3">


{
visit.status==="Approved" ?

<span className="bg-green-600 px-3 py-1 rounded-full">
✅ Approved
</span>


:

visit.status==="Rejected" ?

<span className="bg-red-600 px-3 py-1 rounded-full">
❌ Rejected
</span>


:

<span className="bg-yellow-500 text-black px-3 py-1 rounded-full">
⏳ Pending
</span>

}


</div>




<div className="mt-5 flex flex-wrap gap-3">


<a

href={`tel:${visit.phone}`}

className="bg-blue-600 px-5 py-2 rounded-xl"

>
📞 Call
</a>




<a

href={`https://wa.me/91${visit.phone}`}

target="_blank"

className="bg-green-600 px-5 py-2 rounded-xl"

>
💬 WhatsApp
</a>




<button

onClick={()=>updateStatus(
visit.id,
"Approved"
)}

className="bg-green-700 px-5 py-2 rounded-xl"

>
Approve
</button>




<button

onClick={()=>updateStatus(
visit.id,
"Rejected"
)}

className="bg-red-700 px-5 py-2 rounded-xl"

>
Reject
</button>



</div>


</div>


))

}


</div>

}


</div>


</main>

);

}
