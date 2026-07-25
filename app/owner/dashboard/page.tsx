"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


export default function OwnerDashboardPage() {

  const { user } = useAuth();


  const [stats,setStats] = useState({
    properties:0,
    pending:0,
    approved:0,
    leads:0,
    visits:0,
  });


  const [recentProperties,setRecentProperties] = useState<any[]>([]);



  useEffect(()=>{


    async function loadDashboard(){

      if(!user) return;


      try{


        const propertyQuery=query(
          collection(db,"properties"),
          where("ownerId","==",user.uid)
        );


        const propertySnap=await getDocs(propertyQuery);



        const propertyData=propertySnap.docs.map((item)=>({
          id:item.id,
          ...item.data()
        }));



        let pending=0;
        let approved=0;



        propertyData.forEach((property:any)=>{

          if(property.status==="pending"){
            pending++;
          }


          if(property.status==="approved"){
            approved++;
          }

        });



        const leadsQuery=query(
          collection(db,"leads"),
          where("ownerId","==",user.uid)
        );


        const leadsSnap=await getDocs(leadsQuery);



        const visitsQuery=query(
          collection(db,"siteVisits"),
          where("ownerId","==",user.uid)
        );


        const visitsSnap=await getDocs(visitsQuery);



        setStats({

          properties:propertyData.length,
          pending,
          approved,
          leads:leadsSnap.size,
          visits:visitsSnap.size,

        });



        setRecentProperties(
          propertyData.slice(0,5)
        );



      }catch(error){

        console.log(error);

      }


    }



    loadDashboard();


  },[user]);




  const approvalRate =
    stats.properties===0
    ? 0
    : Math.round(
      (stats.approved/stats.properties)*100
    );




return(

<div className="min-h-screen bg-zinc-950 text-white p-8">


<div className="max-w-7xl mx-auto">


<h1 className="text-4xl font-bold mb-8">
🏠 Owner Dashboard
</h1>



<div className="grid gap-5 md:grid-cols-6">


<Card title="Properties" value={stats.properties}/>
<Card title="Pending" value={stats.pending}/>
<Card title="Approved" value={stats.approved}/>
<Card title="Leads" value={stats.leads}/>
<Card title="Visits" value={stats.visits}/>
<Card title="Approval %" value={`${approvalRate}%`}/>


</div>





<div className="grid md:grid-cols-4 gap-5 mt-10">


<Link
href="/owner/add-property"
className="bg-zinc-900 rounded-xl p-6"
>
<h2 className="text-xl font-bold">
➕ Add Property
</h2>
<p>Create listing</p>
</Link>



<Link
href="/owner/my-properties"
className="bg-zinc-900 rounded-xl p-6"
>
<h2 className="text-xl font-bold">
🏠 My Properties
</h2>
<p>Edit/Delete</p>
</Link>




<Link
href="/owner/leads"
className="bg-zinc-900 rounded-xl p-6"
>
<h2 className="text-xl font-bold">
📞 Leads
</h2>
<p>Customer enquiries</p>
</Link>




<Link
href="/owner/site-visits"
className="bg-zinc-900 rounded-xl p-6"
>
<h2 className="text-xl font-bold">
📅 Site Visits
</h2>
<p>Appointments</p>
</Link>


</div>





<h2 className="text-2xl font-bold mt-10 mb-5">
Latest Properties
</h2>




<div className="grid md:grid-cols-3 gap-6">


{
recentProperties.length===0 ? (

<p>No properties added yet</p>

)

:

recentProperties.map((property)=>(


<div
key={property.id}
className="bg-zinc-900 rounded-xl p-5"
>


{
property.image &&

<img
src={property.image}
className="h-48 w-full object-cover rounded-xl mb-4"
/>

}



<h3 className="text-xl font-bold">
{property.title}
</h3>


<p>
📍 {property.location}
</p>


<p>
💰 ₹ {property.price}
</p>



<span className="inline-block mt-3 rounded-full bg-yellow-600 px-3 py-1 text-sm">
{property.status || "pending"}
</span>



</div>


))


}



</div>


</div>


</div>

);


}



function Card(
{
title,
value
}:{
title:string;
value:any;
}){

return(

<div className="rounded-xl bg-zinc-900 p-5">

<h2 className="text-lg font-bold">
{title}
</h2>


<p className="text-3xl font-bold mt-3">
{value}
</p>


</div>

);

}
