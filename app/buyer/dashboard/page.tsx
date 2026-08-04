"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { properties } from "../../../data/properties";


export default function BuyerDashboard(){

const {user}=useAuth();

const [enquiries,setEnquiries]=useState<any[]>([]);
const [notifications,setNotifications]=useState<any[]>([]);
const [siteVisits,setSiteVisits]=useState<any[]>([]);
const [wishlistCount,setWishlistCount]=useState(0);
const [wishlistProperties,setWishlistProperties]=useState<any[]>([]);
const recommendedProperties = properties.slice(0,3);

const [loading,setLoading]=useState(true);



useEffect(()=>{


async function loadDashboard(){

if(!user) return;


// enquiries

const leadQuery=query(
collection(db,"leads"),
where("buyerId","==",user.uid)
);


const leadSnap=await getDocs(leadQuery);


setEnquiries(
leadSnap.docs.map(doc=>({
id:doc.id,
...doc.data()
}))
);



// notifications

const notificationQuery=query(
collection(db,"notifications"),
where("buyerId","==",user.uid)
);


const notificationSnap=await getDocs(notificationQuery);


setNotifications(
notificationSnap.docs.map(doc=>({
id:doc.id,
...doc.data()
}))
);


// site visits

const visitQuery=query(
collection(db,"siteVisits"),
where("buyerId","==",user.uid)
);


const visitSnap=await getDocs(visitQuery);


setSiteVisits(
visitSnap.docs.map(doc=>({
id:doc.id,
...doc.data()
}))
);



// wishlist local

const saved=JSON.parse(
localStorage.getItem("wishlist") || "[]"
);


setWishlistCount(saved.length);

setWishlistProperties(
  properties.filter((property:any)=>
    saved.includes(property.id)
  ).slice(0,3)
);



setLoading(false);


}


loadDashboard();


},[user]);




if(loading){

return(
<div className="min-h-screen flex items-center justify-center">
Loading Dashboard...
</div>
);

}



return(

<main className="min-h-screen bg-zinc-950 text-white p-8">


<div className="max-w-7xl mx-auto">


<div className="bg-zinc-900 rounded-3xl p-8 mb-8">

<h1 className="text-4xl font-bold">
👋 Welcome {user?.displayName || "Buyer"}
</h1>


<p className="text-gray-400 mt-3">
Manage your properties, enquiries and visits.
</p>


<p className="text-sm text-gray-500 mt-2">
📧 {user?.email}
</p>

</div>



<div className="grid md:grid-cols-4 gap-6">


<div className="bg-zinc-900 rounded-2xl p-6">
<h2 className="text-3xl font-bold">
{wishlistCount}
</h2>
<p className="text-gray-400">
❤️ Wishlist
</p>
</div>



<div className="bg-zinc-900 rounded-2xl p-6">
<h2 className="text-3xl font-bold">
{enquiries.length}
</h2>
<p className="text-gray-400">
📞 Enquiries
</p>
</div>



<div className="bg-zinc-900 rounded-2xl p-6">
<h2 className="text-3xl font-bold">
{siteVisits.length}
</h2>
<p className="text-gray-400">
🏠 Site Visits
</p>
</div>



<div className="bg-zinc-900 rounded-2xl p-6">
<h2 className="text-3xl font-bold">
{notifications.length}
</h2>
<p className="text-gray-400">
🔔 Notifications
</p>
</div>


</div>




<div className="grid md:grid-cols-3 gap-6 mt-10">


<Link
href="/properties"
className="bg-blue-600 p-6 rounded-2xl font-bold text-xl"
>
🏠 Browse Properties
</Link>


<Link
href="/my-enquiries"
className="bg-zinc-900 p-6 rounded-2xl font-bold text-xl"
>
📩 My Enquiries
</Link>


<Link
href="/wishlist"
className="bg-zinc-900 p-6 rounded-2xl font-bold text-xl"
>
❤️ My Wishlist
</Link>


</div>




<div className="mt-10">


<h2 className="text-2xl font-bold mb-5">
Recent Enquiries
</h2>



{
enquiries.length===0 ?

<div className="bg-zinc-900 p-6 rounded-xl">
No enquiries yet
</div>

:

<div className="space-y-4">

{
enquiries.slice(0,5).map(item=>(

<div
key={item.id}
className="bg-zinc-900 p-5 rounded-xl"
>

<h3 className="font-bold">
🏠 {item.propertyTitle || "Property"}
</h3>

<p className="text-gray-400">
Status: {item.status || "New"}
</p>

</div>

))
}

</div>

}



</div>



{/* Recommended Properties */}

<div className="mt-10">

<h2 className="text-2xl font-bold mb-5">
🏡 Recommended Properties
</h2>


<div className="grid md:grid-cols-3 gap-6">

{
recommendedProperties.map((property)=>(

<div
key={property.id}
className="bg-zinc-900 rounded-2xl overflow-hidden"
>

<img
src={property.image}
alt={property.title}
className="h-48 w-full object-cover"
/>


<div className="p-5">

<h3 className="font-bold text-xl">
{property.title}
</h3>


<p className="text-gray-400 mt-2">
📍 {property.location}
</p>


<p className="text-blue-400 font-bold mt-3">
{property.price}
</p>


<Link
href={`/properties/${property.id}`}
className="inline-block mt-4 bg-blue-600 px-4 py-2 rounded-xl"
>
View Property
</Link>

</div>

</div>

))

}

</div>

</div>



{/* Wishlist Preview */}

<div className="mt-10">

<h2 className="text-2xl font-bold mb-5">
❤️ Saved Properties
</h2>


{
wishlistProperties.length===0 ?

<div className="bg-zinc-900 p-6 rounded-xl">
No saved properties yet
</div>

:

<div className="grid md:grid-cols-3 gap-6">

{
wishlistProperties.map((property:any)=>(

<div
key={property.id}
className="bg-zinc-900 rounded-2xl overflow-hidden"
>

<img
src={property.image}
alt={property.title}
className="h-48 w-full object-cover"
/>


<div className="p-5">

<h3 className="font-bold text-xl">
{property.title}
</h3>


<p className="text-gray-400 mt-2">
📍 {property.location}
</p>


<p className="text-blue-400 font-bold mt-3">
{property.price}
</p>


<Link
href={`/properties/${property.id}`}
className="inline-block mt-4 bg-blue-600 px-4 py-2 rounded-xl"
>
View
</Link>


</div>

</div>

))

}

</div>

}

</div>



{/* Upcoming Site Visits */}

<div className="mt-10">

<h2 className="text-2xl font-bold mb-5">
🏠 Upcoming Site Visits
</h2>

{
siteVisits.length===0 ?

<div className="bg-zinc-900 p-6 rounded-xl">
No site visits yet
</div>

:

<div className="space-y-4">

{
siteVisits.slice(0,5).map((visit)=>(

<div
key={visit.id}
className="bg-zinc-900 p-5 rounded-xl"
>

<h3 className="font-bold text-xl">
{visit.propertyTitle || "Property Visit"}
</h3>

<p className="text-gray-400">
📅 {visit.date || "Date not available"}
</p>

<p className="text-gray-400">
⏰ {visit.time || "Time not available"}
</p>

<p className="mt-2 text-blue-400">
Status: {visit.status || "Pending"}
</p>

</div>

))

}

</div>

}

</div>



{/* Recent Notifications */}

<div className="mt-10">

<h2 className="text-2xl font-bold mb-5">
🔔 Recent Notifications
</h2>

{
notifications.length===0 ?

<div className="bg-zinc-900 p-6 rounded-xl">
No notifications
</div>

:

<div className="space-y-4">

{
notifications.slice(0,5).map((item)=>(

<div
key={item.id}
className="bg-zinc-900 p-5 rounded-xl"
>

<h3 className="font-bold">
{item.title || "Notification"}
</h3>

<p className="text-gray-400 mt-2">
{item.message}
</p>

</div>

))

}

</div>

}

</div>



</div>


</main>

);


}
