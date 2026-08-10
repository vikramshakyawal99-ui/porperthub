"use client";

import Link from "next/link";
import {useEffect,useState} from "react";
import {collection,query,where,getDocs} from "firebase/firestore";
import {auth,db} from "../../../lib/firebase";


export default function DealerDashboard(){

const [stats,setStats]=useState({
properties:0,
leads:0,
visits:0
});


useEffect(()=>{


async function loadStats(){

const user=auth.currentUser;

if(!user)return;


const propertiesSnap=await getDocs(
query(
collection(db,"properties"),
where("dealerId","==",user.uid)
)
);


const leadsSnap=await getDocs(
query(
collection(db,"leads"),
where("dealerId","==",user.uid)
)
);


const visitsSnap=await getDocs(
query(
collection(db,"siteVisits"),
where("dealerId","==",user.uid)
)
);



setStats({

properties:propertiesSnap.size,
leads:leadsSnap.size,
visits:visitsSnap.size

});


}


loadStats();


},[]);



return (

<div className="min-h-screen bg-zinc-100 p-8">

<div className="max-w-6xl mx-auto">


<h1 className="text-3xl font-bold text-blue-700">
Dealer Dashboard
</h1>


<p className="text-gray-500 mt-2">
Manage your PropertyHub business
</p>



<div className="grid md:grid-cols-3 gap-6 mt-8">


<div className="bg-white rounded-2xl shadow p-6">

<p className="text-gray-500">
Total Properties
</p>

<h2 className="text-4xl font-bold text-blue-700">
{stats.properties}
</h2>

</div>



<div className="bg-white rounded-2xl shadow p-6">

<p className="text-gray-500">
Customer Leads
</p>

<h2 className="text-4xl font-bold text-green-600">
{stats.leads}
</h2>

</div>



<div className="bg-white rounded-2xl shadow p-6">

<p className="text-gray-500">
Site Visits
</p>

<h2 className="text-4xl font-bold text-purple-600">
{stats.visits}
</h2>

</div>



</div>




<div className="grid md:grid-cols-3 gap-6 mt-8">


<Link href="/dealer/add-property">
<div className="card">
🏠 Add Property
<p>Create new listing</p>
</div>
</Link>


<Link href="/dealer/listings">
<div className="card">
📋 My Listings
<p>Manage properties</p>
</div>
</Link>


<Link href="/dealer/leads">
<div className="card">
📞 Leads
<p>Customer enquiries</p>
</div>
</Link>


<Link href="/dealer/site-visits">
<div className="card">
📅 Site Visits
<p>Appointments</p>
</div>
</Link>


<Link href="/dealer/profile">
<div className="card">
👤 Profile
<p>Dealer details</p>
</div>
</Link>


</div>


</div>

</div>

)

}
