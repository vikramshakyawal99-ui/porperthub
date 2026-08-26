"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


type Visit = {
  id:string;
  name?:string;
  phone?:string;
  propertyTitle?:string;
  visitDate?:string;
  status?:string;
};




export default function OwnerSiteVisitsPage(){


const {user}=useAuth();


const [loading,setLoading]=useState(true);

const [visits,setVisits]=useState<Visit[]>([]);





async function fetchVisits(){


if(!user){
return;
}



try{


const q=query(

collection(db,"siteVisits"),

where(
"ownerId",
"==",
user.uid
)

);



const snap=await getDocs(q);



const data=snap.docs.map((item)=>(

{

id:item.id,

...item.data()

}

)) as Visit[];



setVisits(data);



}


catch(error){

console.log(
"SITE VISITS ERROR",
error
);

}


finally{

setLoading(false);

}


}






useEffect(()=>{

fetchVisits();

},[user]);







async function updateStatus(
id:string,
status:string
){



await updateDoc(

doc(
db,
"siteVisits",
id
),

{

status,

updatedAt:serverTimestamp()

}

);





setVisits((prev)=>

prev.map((visit)=>

visit.id===id

?

{
...visit,
status
}

:

visit

)

);



}







if(loading){


return(

<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">

Loading Site Visits...

</div>

);

}







const total=visits.length;


const pending=
visits.filter(
(v)=>!v.status || v.status==="Pending"
).length;



const scheduled=
visits.filter(
(v)=>v.status==="Scheduled"
).length;



const completed=
visits.filter(
(v)=>v.status==="Completed"
).length;








return(


<div className="min-h-screen bg-zinc-950 text-white p-8">



<h1 className="text-4xl font-bold mb-8">

📅 Owner Site Visits

</h1>






<div className="grid md:grid-cols-4 gap-5 mb-10">



<div className="bg-zinc-900 p-5 rounded-xl">

<h2>Total Visits</h2>

<p className="text-3xl font-bold">
{total}
</p>

</div>





<div className="bg-[#d4a855] text-black p-5 rounded-xl">

<h2>Pending</h2>

<p className="text-3xl font-bold">
{pending}
</p>

</div>





<div className="bg-[#60A5FA] p-5 rounded-xl">

<h2>Scheduled</h2>

<p className="text-3xl font-bold">
{scheduled}
</p>

</div>





<div className="bg-green-600 p-5 rounded-xl">

<h2>Completed</h2>

<p className="text-3xl font-bold">
{completed}
</p>

</div>



</div>









<h2 className="text-3xl font-bold mb-5">

All Site Visits

</h2>







{

visits.length===0 ?


<div className="bg-zinc-900 p-6 rounded-xl">

No Site Visits Found

</div>



:



<div className="grid md:grid-cols-2 gap-6">



{

visits.map((visit)=>(



<div

key={visit.id}

className="bg-zinc-900 p-6 rounded-2xl"

>



<h3 className="text-2xl font-bold">

{visit.name || "Customer"}

</h3>




<p className="mt-2">

📞 {visit.phone || "No phone"}

</p>




<p>

🏠 {visit.propertyTitle || "Property"}

</p>





<p>

📅 {visit.visitDate || "Date not set"}

</p>







<div className="mt-4">


<span className="bg-zinc-700 px-3 py-1 rounded">

{visit.status || "Pending"}

</span>


</div>








<select

value={visit.status || "Pending"}

onChange={(e)=>

updateStatus(
visit.id,
e.target.value
)

}

className="mt-4 text-black p-2 rounded w-full"

>


<option>
Pending
</option>

<option>
Scheduled
</option>

<option>
Completed
</option>

<option>
Cancelled
</option>


</select>








<div className="mt-5 flex gap-3">


<a

href={`tel:${visit.phone}`}

className="bg-[#60A5FA] px-5 py-2 rounded-xl"

>

📞 Call

</a>





<a

href={`https://wa.me/91${visit.phone}`}

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
