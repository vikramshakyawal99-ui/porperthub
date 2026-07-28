"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
  limit
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


export default function OwnerDashboardPage(){

const { user } = useAuth();

const [loading,setLoading]=useState(true);


const [data,setData]=useState({

properties:0,
pending:0,
approved:0,
rejected:0,
leads:0,
visits:0,

recentProperties:[],
recentLeads:[]

});



useEffect(()=>{


async function load(){

if(!user){

setLoading(false);
return;

}


try{


const propertyQuery=query(
collection(db,"properties"),
where("ownerId","==",user.uid)
);


const propertySnap=await getDocs(propertyQuery);


let pending=0;
let approved=0;
let rejected=0;


propertySnap.docs.forEach((doc)=>{

const property=doc.data();


if(property.status==="pending"){
pending++;
}

if(property.status==="approved"){
approved++;
}

if(property.status==="rejected"){
rejected++;
}

});



const recentPropertyQuery=query(
collection(db,"properties"),
where("ownerId","==",user.uid),
limit(5)
);


const recentPropertySnap=await getDocs(
recentPropertyQuery
);


const recentProperties:any =
recentPropertySnap.docs.map((doc)=>({

id:doc.id,
...doc.data()

}));




const leadsQuery=query(
collection(db,"leads"),
where("ownerId","==",user.uid)
);


const leadsSnap=await getDocs(leadsQuery);



const recentLeadQuery=query(
collection(db,"leads"),
where("ownerId","==",user.uid),
limit(5)
);


const recentLeadSnap=await getDocs(
recentLeadQuery
);


const recentLeads:any =
recentLeadSnap.docs.map((doc)=>({

id:doc.id,
...doc.data()

}));




const visitsQuery=query(
collection(db,"siteVisits"),
where("ownerId","==",user.uid)
);


const visitsSnap=await getDocs(visitsQuery);



setData({

properties:propertySnap.size,

pending,

approved,

rejected,

leads:leadsSnap.size,

visits:visitsSnap.size,

recentProperties,

recentLeads

});


}
catch(error){

console.log(
"DASHBOARD ERROR",
error
);

}

finally{

setLoading(false);

}


}


load();


},[user]);




if(loading){

return(

<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">

Loading Dashboard...

</div>

);

}





return(

<div className="min-h-screen bg-zinc-950 text-white p-10">


<h1 className="text-4xl font-bold mb-8">
🏠 Owner Dashboard
</h1>




<div className="grid md:grid-cols-6 gap-5 mb-10">


<Link
href="/owner/add-property"
className="bg-blue-600 p-5 rounded-xl"
>
<h2 className="font-bold">
➕ Add Property
</h2>
<p>Create listing</p>
</Link>



<Link
href="/owner/my-properties"
className="bg-green-600 p-5 rounded-xl"
>
<h2 className="font-bold">
🏠 My Properties
</h2>
<p>Manage listings</p>
</Link>



<Link
href="/owner/leads"
className="bg-purple-600 p-5 rounded-xl"
>
<h2 className="font-bold">
📞 Leads
</h2>
<p>Customer enquiries</p>
</Link>



<Link
href="/owner/site-visits"
className="bg-orange-600 p-5 rounded-xl"
>
<h2 className="font-bold">
📅 Site Visits
</h2>
<p>Customer visits</p>
</Link>



<Link
href="/owner/notifications"
className="bg-pink-600 p-5 rounded-xl"
>
<h2 className="font-bold">
🔔 Notifications
</h2>
<p>Owner alerts</p>
</Link>



<Link
href="/owner/dashboard"
className="bg-zinc-800 p-5 rounded-xl"
>
<h2 className="font-bold">
📊 Analytics
</h2>
<p>Dashboard stats</p>
</Link>


</div>





<div className="grid md:grid-cols-3 gap-6">


<div className="bg-zinc-900 p-6 rounded-xl">
<h2>Total Properties</h2>
<p className="text-3xl">{data.properties}</p>
</div>


<div className="bg-yellow-600 p-6 rounded-xl">
<h2>Pending</h2>
<p className="text-3xl">{data.pending}</p>
</div>


<div className="bg-green-600 p-6 rounded-xl">
<h2>Approved</h2>
<p className="text-3xl">{data.approved}</p>
</div>


<div className="bg-red-600 p-6 rounded-xl">
<h2>Rejected</h2>
<p className="text-3xl">{data.rejected}</p>
</div>


<div className="bg-blue-600 p-6 rounded-xl">
<h2>Leads</h2>
<p className="text-3xl">{data.leads}</p>
</div>


<div className="bg-purple-600 p-6 rounded-xl">
<h2>Site Visits</h2>
<p className="text-3xl">{data.visits}</p>
</div>


</div>





<h2 className="text-3xl font-bold mt-12 mb-5">
Recent Properties
</h2>


<div className="grid md:grid-cols-3 gap-6">


{
data.recentProperties.length===0 ?

<p>No properties found</p>

:

data.recentProperties.map((property:any)=>(

<div
key={property.id}
className="bg-zinc-900 p-5 rounded-xl"
>

<h3 className="font-bold">
{property.title}
</h3>

<p>
📍 {property.location}
</p>

<p>
Status: {property.status}
</p>

<p>
₹ {property.price}
</p>

</div>

))

}


</div>





<h2 className="text-3xl font-bold mt-12 mb-5">
Recent Leads
</h2>


<div className="grid md:grid-cols-3 gap-6">


{
data.recentLeads.length===0 ?

<p>No leads found</p>

:

data.recentLeads.map((lead:any)=>(

<div
key={lead.id}
className="bg-zinc-900 p-5 rounded-xl"
>

<h3 className="font-bold">
{lead.name}
</h3>

<p>
📞 {lead.phone}
</p>

<p>
{lead.propertyTitle}
</p>

</div>

))

}


</div>


</div>

);

}
