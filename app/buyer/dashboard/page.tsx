"use client";

import Image from "next/image";

import Link from "next/link";
import { useEffect, useState } from "react";

import { signOut } from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { properties } from "../../../data/properties";


export default function BuyerDashboard(){

const {user,role}=useAuth();

const [enquiries,setEnquiries]=useState<any[]>([]);
const [notifications,setNotifications]=useState<any[]>([]);
const [siteVisits,setSiteVisits]=useState<any[]>([]);
const [loanApplications,setLoanApplications]=useState<any[]>([]);
const [wishlistCount,setWishlistCount]=useState(0);
const [wishlistProperties,setWishlistProperties]=useState<any[]>([]);
const recommendedProperties = properties.slice(0,3);

const [loading,setLoading]=useState(true);



useEffect(()=>{


async function loadDashboard(){

if(!user){
window.location.href="/buyer-login";
return;
}

if(role && role!=="buyer"){
window.location.href="/buyer-login";
return;
}


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




// loan applications

const loanQuery=query(
collection(db,"loanApplications"),
where("buyerId","==",user.uid)
);

const loanSnap=await getDocs(loanQuery);

setLoanApplications(
loanSnap.docs.map(doc=>({
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

<main className="min-h-screen bg-slate-50 text-slate-900 p-8">


<div className="max-w-7xl mx-auto">


<div className="bg-white rounded-3xl p-8 mb-8">

<div className="flex items-start justify-between">

<div>

<h1 className="text-4xl font-bold">
👋 Welcome {user?.displayName || "Buyer"}
</h1>


<p className="text-slate-500 mt-3">
Manage your properties, enquiries and visits.
</p>


<p className="text-sm text-slate-500 mt-2">
📧 {user?.email}
</p>

</div>

<button
onClick={async()=>{

await signOut(auth);

window.location.href="/buyer-login";

}}
className="rounded-lg bg-red-600 px-4 py-2 text-slate-900 hover:bg-red-700"
>
Logout
</button>

</div>

</div>



<div className="grid md:grid-cols-4 gap-6">


<div className="bg-white rounded-2xl p-6">
<h2 className="text-3xl font-bold">
{wishlistCount}
</h2>
<p className="text-slate-500">
❤️ Wishlist
</p>
</div>



<div className="bg-white rounded-2xl p-6">
<h2 className="text-3xl font-bold">
{enquiries.length}
</h2>
<p className="text-slate-500">
📞 Enquiries
</p>
</div>



<div className="bg-white rounded-2xl p-6">
<h2 className="text-3xl font-bold">
{siteVisits.length}
</h2>
<p className="text-slate-500">
🏠 Site Visits
</p>
</div>



<div className="bg-white rounded-2xl p-6">
<h2 className="text-3xl font-bold">
{notifications.length}
</h2>
<p className="text-slate-500">
🔔 Notifications
</p>
</div>


<div className="bg-white rounded-2xl p-6">
<h2 className="text-3xl font-bold text-green-700">
{loanApplications.length}
</h2>
<p className="text-slate-500">
💰 Loan Applications
</p>
</div>


</div>




<div className="grid md:grid-cols-3 gap-6 mt-10">


<Link
href="/properties"
className="bg-green-600 p-6 rounded-2xl font-bold text-xl"
>
🏠 Browse Properties
</Link>


<Link
href="/my-enquiries"
className="bg-white p-6 rounded-2xl font-bold text-xl"
>
📩 My Enquiries
</Link>


<Link
href="/wishlist"
className="bg-white p-6 rounded-2xl font-bold text-xl"
>
❤️ My Wishlist
</Link>


</div>




{/* MY LOAN APPLICATIONS */}

<div className="mt-10">

  <div className="mb-5 flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold">
        💰 My Loan Applications
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Track your home loan requirement and application progress.
      </p>
    </div>
  </div>

  {
    loanApplications.length === 0 ?

    <div className="rounded-2xl border border-slate-200/10 bg-white p-6">
      <p className="font-semibold">
        No loan applications yet
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Check your loan eligibility to explore suitable financing options.
      </p>

      <Link
        href="/"
        className="mt-4 inline-block rounded-xl bg-green-600 px-5 py-3 font-bold text-[#080b12]"
      >
        Check Loan Eligibility
      </Link>
    </div>

    :

    <div className="space-y-5">

      {
        loanApplications.map((application:any) => {

          const status = application.status || "new";

          const statusLabel =
            status === "application_submitted"
              ? "Application Submitted"
              : status === "under_review"
              ? "Under Review"
              : status === "sanctioned"
              ? "Sanctioned"
              : status === "disbursed"
              ? "Disbursed"
              : status === "rejected"
              ? "Rejected"
              : status === "contacted"
              ? "Contacted"
              : "New";

          const statusClass =
            status === "sanctioned" || status === "disbursed"
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : status === "rejected"
              ? "bg-red-500/10 text-red-400 border-red-500/20"
              : "bg-green-600/10 text-green-700 border-green-200/20";

          return (
            <div
              key={application.id}
              className="rounded-2xl border border-slate-200/10 bg-white p-6"
            >

              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                <div>
                  <div className="flex flex-wrap items-center gap-3">

                    <h3 className="text-xl font-black">
                      Home Loan Application
                    </h3>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass}`}
                    >
                      {statusLabel}
                    </span>

                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Application ID: {application.leadId || application.id}
                  </p>
                </div>


                <div className="text-sm text-slate-500">
                  {application.createdAt?.toDate
                    ? application.createdAt.toDate().toLocaleDateString("en-IN")
                    : "Recently submitted"}
                </div>

              </div>


              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">

                <div className="rounded-xl bg-slate-50/30 p-4">
                  <p className="text-xs text-slate-500">
                    Required Loan
                  </p>

                  <p className="mt-1 font-black text-green-700">
                    ₹ {(Number(application.requiredLoanAmount) || 0).toLocaleString("en-IN")}
                  </p>
                </div>


                <div className="rounded-xl bg-slate-50/30 p-4">
                  <p className="text-xs text-slate-500">
                    Estimated Eligibility
                  </p>

                  <p className="mt-1 font-black text-green-700">
                    ₹ {(Number(application.estimatedEligibleAmount) || 0).toLocaleString("en-IN")}
                  </p>
                </div>


                <div className="rounded-xl bg-slate-50/30 p-4">
                  <p className="text-xs text-slate-500">
                    Sanctioned
                  </p>

                  <p className="mt-1 font-black">
                    ₹ {(Number(application.sanctionedAmount) || 0).toLocaleString("en-IN")}
                  </p>
                </div>


                <div className="rounded-xl bg-slate-50/30 p-4">
                  <p className="text-xs text-slate-500">
                    Disbursed
                  </p>

                  <p className="mt-1 font-black">
                    ₹ {(Number(application.disbursedAmount) || 0).toLocaleString("en-IN")}
                  </p>
                </div>

              </div>

            </div>
          );
        })
      }

    </div>
  }

</div>



<div className="mt-10">


<h2 className="text-2xl font-bold mb-5">
Recent Enquiries
</h2>



{
enquiries.length===0 ?

<div className="bg-white p-6 rounded-xl">
No enquiries yet
</div>

:

<div className="space-y-4">

{
enquiries.slice(0,5).map(item=>(

<div
key={item.id}
className="bg-white p-5 rounded-xl"
>

<h3 className="font-bold">
🏠 {item.propertyTitle || "Property"}
</h3>

<p className="text-slate-500">
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
className="bg-white rounded-2xl overflow-hidden"
>

<Image
src={property.image}
alt={property.title}
width={600}
height={400}
className="h-48 w-full object-cover"
/>


<div className="p-5">

<h3 className="font-bold text-xl">
{property.title}
</h3>


<p className="text-slate-500 mt-2">
📍 {property.location}
</p>


<p className="text-[#93C5FD] font-bold mt-3">
{property.price}
</p>


<Link
href={`/properties/${property.id}`}
className="inline-block mt-4 bg-green-600 px-4 py-2 rounded-xl"
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

<div className="bg-white p-6 rounded-xl">
No saved properties yet
</div>

:

<div className="grid md:grid-cols-3 gap-6">

{
wishlistProperties.map((property:any)=>(

<div
key={property.id}
className="bg-white rounded-2xl overflow-hidden"
>

<Image
src={property.image}
alt={property.title}
width={600}
height={400}
className="h-48 w-full object-cover"
/>


<div className="p-5">

<h3 className="font-bold text-xl">
{property.title}
</h3>


<p className="text-slate-500 mt-2">
📍 {property.location}
</p>


<p className="text-[#93C5FD] font-bold mt-3">
{property.price}
</p>


<Link
href={`/properties/${property.id}`}
className="inline-block mt-4 bg-green-600 px-4 py-2 rounded-xl"
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

<div className="bg-white p-6 rounded-xl">
No site visits yet
</div>

:

<div className="space-y-4">

{
siteVisits.slice(0,5).map((visit)=>(

<div
key={visit.id}
className="bg-white p-5 rounded-xl"
>

<h3 className="font-bold text-xl">
{visit.propertyTitle || "Property Visit"}
</h3>

<p className="text-slate-500">
📅 {visit.date || "Date not available"}
</p>

<p className="text-slate-500">
⏰ {visit.time || "Time not available"}
</p>

<p className="mt-2 text-[#93C5FD]">
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

<div className="bg-white p-6 rounded-xl">
No notifications
</div>

:

<div className="space-y-4">

{
notifications.slice(0,5).map((item)=>(

<div
key={item.id}
className="bg-white p-5 rounded-xl"
>

<h3 className="font-bold">
{item.title || "Notification"}
</h3>

<p className="text-slate-500 mt-2">
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
