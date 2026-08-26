"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  where,
  limit,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  auth,
  db,
} from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


export default function OwnerDashboardPage(){

const { user } = useAuth();


const [loading,setLoading]=useState(true);


const [data,setData]=useState<any>({

properties:0,
pending:0,
approved:0,
rejected:0,
leads:0,
visits:0,
conversion:0,

followUps:0,
todayFollowUps:0,
overdueFollowUps:0,
notesCount:0,

viewCount:0,
topViewedProperties:[],
performanceData:[],

recentProperties:[],
recentLeads:[],

interestedLeads:0,
siteVisitLeads:0,
lostLeads:0,

notifications:0,
recentVisits:[]

});


async function updateLeadStatus(
leadId:string,
status:string
){

try{

const oldLead =
data.recentLeads.find(
(lead:any)=>lead.id===leadId
);


await updateDoc(
doc(db,"leads",leadId),
{

status,


priority:
(
status==="Closed" ||
status==="Lost"
)
?
"Cold"
:
(
status==="Interested" ||
status==="Follow Up" ||
status==="Site Visit"
)
?
"Warm"
:
"Hot",


activities:[
...(oldLead?.activities || []),

{

type:"status",

text:`Status changed from ${oldLead?.status || "New"} to ${status}`,

date:new Date().toLocaleDateString()

}

],


updatedAt:serverTimestamp()

}
);


setData((prev:any)=>({

...prev,

recentLeads:prev.recentLeads.map((lead:any)=>
lead.id===leadId
?
{
...lead,
status,
priority:
(
status==="Closed" ||
status==="Lost"
)
?
"Cold"
:
(
status==="Interested" ||
status==="Follow Up" ||
status==="Site Visit"
)
?
"Warm"
:
"Hot"
}
:
lead
)

}));


}
catch(error){

console.log(
"STATUS UPDATE ERROR",
error
);

}

}






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


console.log("DASHBOARD STEP 1: properties");
const propertySnap=await getDocs(propertyQuery);
console.log("DASHBOARD STEP 1 OK:", propertySnap.size);


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


console.log("DASHBOARD STEP 2: recent properties");
const recentPropertySnap=await getDocs(
recentPropertyQuery
);
console.log("DASHBOARD STEP 2 OK:", recentPropertySnap.size);


const recentProperties:any =
recentPropertySnap.docs.map((doc)=>({

id:doc.id,
...doc.data()

}));

const ownerPropertyIds =
recentProperties.map(
(property:any)=>property.id
);

console.log("DASHBOARD STEP 3: property views");
const viewsSnap = await getDocs(
collection(db,"propertyViews")
);
console.log("DASHBOARD STEP 3 OK:", viewsSnap.size);

let totalViews = 0;
const topViewedProperties:any[] = [];

viewsSnap.docs.forEach((viewDoc)=>{

const view:any = viewDoc.data();

if(ownerPropertyIds.includes(view.propertyId)){

totalViews += view.views || 0;

topViewedProperties.push({
title:view.propertyTitle,
views:view.views || 0
});

}

});

topViewedProperties.sort(
(a,b)=>b.views-a.views
);

topViewedProperties.splice(5);





async function createOwnerNotification(
title:string,
message:string,
propertyTitle?:string,
notificationKey?:string
){

if(!user){
return;
}



if(notificationKey){

const existingQuery=query(
collection(db,"notifications"),
where("ownerId","==",user.uid),
where("notificationKey","==",notificationKey)
);


const existingSnap=await getDocs(existingQuery);


if(!existingSnap.empty){
return;
}

}



await addDoc(
collection(db,"notifications"),
{
ownerId:user.uid,
title,
message,
propertyTitle:propertyTitle || "",
notificationKey:notificationKey || "",
read:false,
createdAt:serverTimestamp()
}
);

}



const leadsQuery=query(
collection(db,"leads"),
where("ownerId","==",user.uid)
);


console.log("DASHBOARD STEP 4: leads");
const leadsSnap=await getDocs(leadsQuery);
console.log("DASHBOARD STEP 4 OK:", leadsSnap.size);


let followUps=0;
let todayFollowUps=0;
let overdueFollowUps=0;
let notesCount=0;

let hotLeads=0;
let urgentHotLeads=0;
let warmLeads=0;
let coldLeads=0;

let interestedLeads=0;
let siteVisitLeads=0;
let lostLeads=0;

let closedLeads=0;

let highPriorityLeads=0;
let mediumPriorityLeads=0;
let lowPriorityLeads=0;

let totalLeads=0;


const today=new Date()
.toISOString()
.split("T")[0];



const todayLeads:any[] = leadsSnap.docs.map((doc)=>({
  id:doc.id,
  ...doc.data()
})).filter(
  (lead:any)=>
    lead.followUpDate===today &&
    lead.status!=="Closed"
);


for(const lead of todayLeads){

  const notificationKey =
    "followup_"+lead.id+"_"+today;


  const existingQuery=query(
    collection(db,"notifications"),
    where("ownerId","==",user.uid),
    where("notificationKey","==",notificationKey)
  );


  const existingSnap=await getDocs(existingQuery);


  if(existingSnap.empty){

    await addDoc(
      collection(db,"notifications"),
      {
        ownerId:user.uid,
        title:"Follow-up Reminder",
        message:
          `${lead.name || lead.customerName || "Customer"} follow-up is due today`,
        propertyTitle:
          lead.propertyTitle || "",
        notificationKey,
        read:false,
        createdAt:serverTimestamp()
      }
    );

  }

}


const todayReminderLeads:any[]=[];
const overdueReminderLeads:any[]=[];
const newHotLeads:any[]=[];


leadsSnap.docs.forEach((doc)=>{

const lead:any=doc.data();

totalLeads++;


if(lead.priority==="High"){
  highPriorityLeads++;
}

if(lead.priority==="Medium" || !lead.priority){
  mediumPriorityLeads++;
}

if(lead.priority==="Low"){
  lowPriorityLeads++;
}


if(
lead.status==="New" ||
!lead.status
){
hotLeads++;
}
else if(
lead.status==="Contacted" ||
lead.status==="Follow Up"
){
warmLeads++;
}
else if(
lead.status==="Interested"
){
interestedLeads++;
}
else if(
lead.status==="Site Visit"
){
siteVisitLeads++;
}
else if(
lead.status==="Closed"
){
closedLeads++;
}
else if(
lead.status==="Lost"
){
lostLeads++;
coldLeads++;
}



if(lead.followUpDate){
  followUps++;

  if(lead.followUpDate===today){
    todayFollowUps++;
    todayReminderLeads.push(lead);
  }


  if(lead.followUpDate < today &&
     lead.status !== "Closed" &&
     lead.status !== "Lost"){
    overdueFollowUps++;
    overdueReminderLeads.push(lead);
  }

}


if(
lead.status==="New" ||
!lead.status
){
newHotLeads.push(lead);
}


if(
(lead.priority==="Hot" ||
lead.status==="New" ||
!lead.status)
&&
lead.status !== "Closed"
&&
lead.status !== "Lost"
){
urgentHotLeads++;
}


if(lead.notes && lead.notes.trim()!==""){
  notesCount++;
}

});



// 🔔 Smart CRM Notifications

for(const lead of todayReminderLeads){

await createOwnerNotification(
"📅 Today's Follow Up",
`Follow up pending with ${lead.name || "Customer"}`,
lead.propertyTitle
);

}


for(const lead of overdueReminderLeads){

await createOwnerNotification(
"⚠️ Overdue Follow Up",
`Missed follow up with ${lead.name || "Customer"}`,
lead.propertyTitle
);

}



for(const lead of newHotLeads){

await createOwnerNotification(
"🔥 New Hot Lead",
`New inquiry from ${lead.name || "Customer"}`,
lead.propertyTitle,
"hotlead_" + lead.id
);

}



const recentLeadQuery=query(
collection(db,"leads"),
where("ownerId","==",user.uid),
limit(5)
);


console.log("DASHBOARD STEP 5: recent leads");
const recentLeadSnap=await getDocs(
recentLeadQuery
);
console.log("DASHBOARD STEP 5 OK:", recentLeadSnap.size);


const recentLeads:any =
recentLeadSnap.docs.map((doc)=>({

id:doc.id,
...doc.data()

}));




const visitsQuery=query(
collection(db,"siteVisits"),
where("ownerId","==",user.uid)
);


console.log("DASHBOARD STEP 6: site visits");
const visitsSnap=await getDocs(visitsQuery);
console.log("DASHBOARD STEP 6 OK:", visitsSnap.size);


const recentVisits:any =
visitsSnap.docs
.slice(0,5)
.map((doc)=>({

id:doc.id,
...doc.data()

}));


// Owner unread notifications

const notificationQuery=query(
collection(db,"notifications"),
where("ownerId","==",user.uid),
where("read","==",false)
);


console.log("DASHBOARD STEP 7: notifications");
const notificationSnap=await getDocs(
notificationQuery
);
console.log("DASHBOARD STEP 7 OK:", notificationSnap.size);


const notificationCount =
notificationSnap.size;



const performanceData = recentProperties.map((property:any)=>{

  const views = viewsSnap.docs.find(
    (d)=>d.id===property.id
  )?.data()?.views || 0;

  const leads = leadsSnap.docs.filter(
    (d:any)=>d.data().propertyId===property.id
  ).length;

  const visits = visitsSnap.docs.filter(
    (d:any)=>d.data().propertyId===property.id
  ).length;

  const conversion =
    leads>0
      ? Math.round((visits/leads)*100)
      : 0;

  return {
    ...property,
    views,
    leads,
    visits,
    conversion
  };

});




setData({

properties:propertySnap.size,

pending,

approved,

rejected,

leads:leadsSnap.size,

visits:visitsSnap.size,

conversion:
leadsSnap.size > 0
?
Math.round((visitsSnap.size / leadsSnap.size) * 100)
:
0,

followUps,
todayFollowUps,
overdueFollowUps,
urgentHotLeads,
notesCount,

hotLeads,
warmLeads,
coldLeads,
closedLeads,

interestedLeads,
siteVisitLeads,
lostLeads,

highPriorityLeads,
mediumPriorityLeads,
lowPriorityLeads,

totalLeads,

viewCount:totalViews,

topViewedProperties,
performanceData,

recentProperties,

recentLeads,

notifications:notificationCount,

recentVisits

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

<div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">

Loading Dashboard...




{/* Property Performance */}

<h2 className="text-3xl font-bold mt-12 mb-5">
📊 Property Performance
</h2>


<div className="grid md:grid-cols-2 gap-6">


{
data.performanceData.length===0 ?

<div className="bg-white p-5 rounded-xl">
No performance data
</div>

:

data.performanceData.map((property:any)=>(

<div
key={property.id}
className="bg-white p-5 rounded-xl space-y-2"
>

<h3 className="text-xl font-bold">
🏠 {property.title || property.propertyTitle || "Property"}
</h3>


<p>
👁 Views: {property.views}
</p>


<p>
📩 Leads: {property.leads}
</p>


<p>
📅 Visits: {property.visits}
</p>


<p className="text-green-700 font-bold">
Conversion: {property.conversion}%
</p>


</div>

))

}


</div>




{/* Recent Site Visits */}

<h2 className="text-3xl font-bold mt-12 mb-5">
📅 Recent Site Visits
</h2>


<div className="grid md:grid-cols-3 gap-6">

{
data.recentVisits.length===0 ?

<div className="bg-white p-5 rounded-xl">
No site visits
</div>

:

data.recentVisits.map((visit:any)=>(

<div
key={visit.id}
className="bg-white p-5 rounded-xl"
>

<h3 className="font-bold">
{visit.propertyTitle || "Property Visit"}
</h3>


<p>
📅 {visit.date || "Date"}
</p>


<p>
⏰ {visit.time || "Time"}
</p>


<p className="text-slate-500">
{visit.status || "Pending"}
</p>


</div>

))

}

</div>

</div>

);

}





async function handleOwnerLogout() {
  await signOut(auth);
  window.location.href = "/";
}

return(

<div className="min-h-screen bg-slate-50 text-slate-900 px-5 py-6 sm:px-8 lg:px-10">

<header className="mb-8 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

    <Link
      href="/"
      className="inline-flex w-fit items-center"
    >
      <Image
        src="/branding/propertyhub-logo.svg"
        alt="PropertyHub"
        width={205}
        height={58}
        priority
        className="h-[52px] w-auto object-contain"
      />
    </Link>

    <nav className="flex flex-wrap items-center gap-2">

      <Link
        href="/"
        className="rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-bold text-green-800 transition hover:bg-green-100"
      >
        ← Home Page
      </Link>

      <Link
        href="/properties"
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-green-300 hover:text-green-700"
      >
        Browse Properties
      </Link>

      <Link
        href="/owner/my-properties"
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-green-300 hover:text-green-700"
      >
        My Properties
      </Link>

      <button
        type="button"
        onClick={handleOwnerLogout}
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100"
      >
        Logout
      </button>

    </nav>
  </div>
</header>

<div className="mb-7">
  <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-green-700">
    Property Owner Panel
  </p>

  <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
    🏠 Owner Dashboard
  </h1>

  <p className="mt-2 text-sm text-slate-500 sm:text-base">
    Manage listings, enquiries, visits and property performance.
  </p>
</div>




<div className="grid md:grid-cols-6 gap-5 mb-10">


<Link
href="/owner/add-property"
className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
>
<h2 className="font-bold">
➕ Add Property
</h2>
<p>Create listing</p>
</Link>



<Link
href="/owner/my-properties"
className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
>
<h2 className="font-bold">
🏠 My Properties
</h2>
<p>Manage listings</p>
</Link>



<Link
href="/owner/leads"
className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
>
<h2 className="font-bold">
📞 Leads
</h2>
<p>Customer enquiries</p>
</Link>



<Link
href="/owner/site-visits"
className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
>
<h2 className="font-bold">
📅 Site Visits
</h2>
<p>Customer visits</p>
</Link>



<Link
href="/owner/notifications"
className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
>
<h2 className="font-bold">
🔔 Notifications
</h2>
<p>Owner alerts</p>
</Link>



<Link
href="/owner/dashboard"
className="group rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
>
<h2 className="font-bold">
📊 Analytics
</h2>
<p>Dashboard stats</p>
</Link>


</div>





<div className="grid md:grid-cols-3 gap-6">


<div className="bg-white p-6 rounded-xl">
<h2>Total Properties</h2>
<p className="text-3xl">{data.properties}</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>Pending</h2>
<p className="text-3xl">{data.pending}</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>Approved</h2>
<p className="text-3xl">{data.approved}</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>Rejected</h2>
<p className="text-3xl">{data.rejected}</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>Leads</h2>
<p className="text-3xl">{data.leads}</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>Site Visits</h2>
<p className="text-3xl">{data.visits}</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>🔔 Unread Notifications</h2>
<p className="text-3xl">{data.notifications}</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>Conversion Rate</h2>
<p className="text-3xl">
{data.conversion}%
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>Follow Ups</h2>
<p className="text-3xl">
{data.followUps}
</p>
</div>


<Link href="/owner/leads?filter=today" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>Today's Follow Ups</h2>
<p className="text-3xl">
{data.todayFollowUps}
</p>
</Link>


<Link href="/owner/leads?filter=overdue" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>⚠️ Overdue Follow Ups</h2>
<p className="text-3xl">
{data.overdueFollowUps}
</p>
</Link>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>🔥 Urgent Hot Leads</h2>
<p className="text-3xl">
{data.urgentHotLeads}
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>Notes Added</h2>
<p className="text-3xl">
{data.notesCount}
</p>
</div>


<Link href="/owner/leads?filter=hot" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>🔥 Hot Leads</h2>
<p className="text-3xl">
{data.hotLeads}
</p>
</Link>


<Link href="/owner/leads?filter=warm" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>🌤 Warm Leads</h2>
<p className="text-3xl">
{data.warmLeads}
</p>
</Link>


<Link href="/owner/leads?filter=cold" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>❄ Cold Leads</h2>
<p className="text-3xl">
{data.coldLeads}
</p>
</Link>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>🔥 Interested Leads</h2>
<p className="text-3xl">
{data.interestedLeads}
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>📅 Site Visit Leads</h2>
<p className="text-3xl">
{data.siteVisitLeads}
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>❌ Lost Leads</h2>
<p className="text-3xl">
{data.lostLeads}
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>✅ Closed Leads</h2>
<p className="text-3xl">
{data.closedLeads}
</p>
</div>

<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h2>👀 Property Views</h2>
<p className="text-3xl">
{data.viewCount}
</p>
</div>


</div>






<h2 className="text-3xl font-bold mt-12 mb-5">
📈 Property Performance
</h2>

<div className="overflow-x-auto mb-12">

<table className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

<thead className="border-b border-slate-200 bg-green-50">

<tr>
<th className="text-left p-4">Property</th>
<th className="text-center p-4">Views</th>
<th className="text-center p-4">Leads</th>
<th className="text-center p-4">Visits</th>
<th className="text-center p-4">Conversion</th>
</tr>

</thead>

<tbody>

{data.performanceData.length===0 ? (

<tr>
<td colSpan={5} className="p-8 text-center text-slate-500">
No analytics available
</td>
</tr>

) : (

data.performanceData.map((item:any)=>(

<tr
key={item.id}
className="border-t border-slate-200"
>

<td className="p-4 font-semibold">
{item.title}
</td>

<td className="text-center">
👁 {item.views}
</td>

<td className="text-center">
📞 {item.leads}
</td>

<td className="text-center">
📅 {item.visits}
</td>

<td className="text-center font-bold text-green-700">
{item.conversion}%
</td>

</tr>

))

)}

</tbody>

</table>

</div>

<h2 className="text-3xl font-bold mt-12 mb-5">
📊 Lead Conversion Funnel
</h2>


<div className="grid md:grid-cols-7 gap-4 mb-12">


<div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">🆕 New</h3>
<p className="text-4xl">{data.hotLeads}</p>
</div>


<div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">📞 Contacted</h3>
<p className="text-4xl">{data.warmLeads}</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">🔥 Interested</h3>
<p className="text-4xl">{data.interestedLeads}</p>
</div>


<div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">📅 Site Visit</h3>
<p className="text-4xl">{data.siteVisitLeads}</p>
</div>


<div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">📝 Follow Up</h3>
<p className="text-4xl">{data.followUps}</p>
</div>


<div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">✅ Closed</h3>
<p className="text-4xl">{data.closedLeads}</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">❌ Lost</h3>
<p className="text-4xl">{data.lostLeads}</p>
</div>


</div>




<h2 className="text-3xl font-bold mt-12 mb-5">
📅 Follow Up Analytics
</h2>


<div className="grid md:grid-cols-4 gap-6 mb-12">


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
Total Follow Ups
</h3>
<p className="text-4xl">
{data.followUps}
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
Today's Follow Ups
</h3>
<p className="text-4xl">
{data.todayFollowUps}
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
Overdue Follow Ups
</h3>
<p className="text-4xl">
{data.overdueFollowUps}
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
Completed
</h3>
<p className="text-4xl">
{
data.closedLeads
}
</p>
</div>


</div>



<h2 className="text-3xl font-bold mt-12 mb-5">
📈 Conversion Analytics
</h2>


<div className="grid md:grid-cols-4 gap-6 mb-12">


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
Lead To Interested
</h3>

<p className="text-4xl">
{
data.leads>0
?
Math.round(
(data.interestedLeads/data.leads)*100
)
:
0
}%
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
Interested To Visit
</h3>

<p className="text-4xl">
{
data.interestedLeads>0
?
Math.round(
(data.siteVisitLeads/data.interestedLeads)*100
)
:
0
}%
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
Visit To Closed
</h3>

<p className="text-4xl">
{
data.siteVisitLeads>0
?
Math.round(
(data.closedLeads/data.siteVisitLeads)*100
)
:
0
}%
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
Overall Closing
</h3>

<p className="text-4xl">
{
data.leads>0
?
Math.round(
(data.closedLeads/data.leads)*100
)
:
0
}%
</p>
</div>


</div>



<h2 className="text-3xl font-bold mt-12 mb-5">
📊 Lead Funnel Analytics
</h2>


<div className="grid md:grid-cols-5 gap-6 mb-12">


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
New Leads
</h3>

<p className="text-4xl">
{data.leads}
</p>
</div>



<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
Interested
</h3>

<p className="text-4xl">
{data.interestedLeads || 0}
</p>
</div>



<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
Site Visits
</h3>

<p className="text-4xl">
{data.siteVisitLeads || 0}
</p>
</div>



<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
Closed
</h3>

<p className="text-4xl">
{data.closedLeads || 0}
</p>
</div>



<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
Lost
</h3>

<p className="text-4xl">
{data.lostLeads || 0}
</p>
</div>


</div>



<h2 className="text-3xl font-bold mt-12 mb-5">
🎯 Lead Priority Analytics
</h2>


<div className="grid md:grid-cols-3 gap-6 mb-12">


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
🔥 High Priority
</h3>
<p className="text-4xl">
{data.highPriorityLeads}
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
🟡 Medium Priority
</h3>
<p className="text-4xl">
{data.mediumPriorityLeads}
</p>
</div>


<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md">
<h3 className="font-bold">
❄ Low Priority
</h3>
<p className="text-4xl">
{data.lowPriorityLeads}
</p>
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
className="bg-white p-5 rounded-xl"
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
₹ {
(
property.propertyType==="rent" ||
property.propertyType==="room_rent" ||
property.propertyType==="pg" ||
property.propertyType==="hostel"
)
?
property.rent
:
property.price
}
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
className="bg-white p-5 rounded-xl space-y-3"
>

<h3 className="font-bold text-xl">
{lead.name}
</h3>


<p>
📞 {lead.phone}
</p>


<p>
🏠 {lead.propertyTitle}
</p>


{
lead.priority && (

<span
className={
lead.priority==="Hot"
?
"inline-block rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700"
:
lead.priority==="Warm"
?
"inline-block rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-semibold text-green-700"
:
"inline-block rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600"
}
>
{
lead.priority==="Hot"
?
"🔥 Hot"
:
lead.priority==="Warm"
?
"🌤 Warm"
:
"❄ Cold"
}
</span>

)

}


{
lead.followUpDate && (

<p className="text-sm text-slate-500">
📅 Follow Up: {lead.followUpDate}
</p>

)

}


{
lead.notes && (

<p className="text-sm text-slate-500">
📝 {lead.notes}
</p>

)

}


<div className="flex gap-3 pt-2">

<a
href={`tel:${lead.phone}`}
className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
>
📞 Call
</a>


<a
href={`https://wa.me/${lead.phone}`}
target="_blank"
className="bg-emerald-600 px-3 py-2 rounded-lg text-sm"
>
💬 WhatsApp
</a>


<button
onClick={()=>updateLeadStatus(lead.id,"Contacted")}
className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
>
📞 Contacted
</button>


<button
onClick={()=>updateLeadStatus(lead.id,"Closed")}
className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
>
✅ Close
</button>


<button
onClick={()=>updateLeadStatus(lead.id,"New")}
className="rounded-xl bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
>
🔄 Reopen
</button>


</div>


{
lead.status==="Closed" ?

<span className="inline-block rounded-full bg-green-600 px-3 py-1 text-sm">
✅ Closed
</span>

:

lead.status==="Contacted" ?

<span className="inline-block rounded-full bg-green-600 px-3 py-1 text-sm">
📞 Contacted
</span>

:

<span className="inline-block rounded-full bg-green-600 px-3 py-1 text-sm text-black">
🆕 New Lead
</span>

}


{
lead.createdAt && (

<p className="text-sm text-slate-500">
📅 {
lead.createdAt.toDate
?
lead.createdAt.toDate().toLocaleDateString()
:
""
}
</p>

)
}


</div>

))

}


</div>



<h2 className="text-3xl font-bold mt-12 mb-5">
🔔 Today's Follow Ups
</h2>


<div className="grid md:grid-cols-3 gap-6">


{
data.recentLeads.filter((lead:any)=>
lead.followUpDate === new Date().toISOString().split("T")[0]
).length===0

?

<div className="bg-white p-5 rounded-xl">
No Follow Ups Today
</div>

:

data.recentLeads
.filter((lead:any)=>
lead.followUpDate === new Date().toISOString().split("T")[0]
)
.map((lead:any)=>(


<div
key={lead.id}
className="bg-white p-5 rounded-xl space-y-3"
>

<h3 className="font-bold text-xl">
{lead.name || "Customer"}
</h3>


<p>
📞 {lead.phone}
</p>


<p>
🏠 {lead.propertyTitle}
</p>


<div className="flex gap-3">

<a
href={`tel:${lead.phone}`}
className="bg-green-600 px-3 py-2 rounded-lg"
>
📞 Call
</a>


<a
href={`https://wa.me/${lead.phone}`}
target="_blank"
className="bg-emerald-600 px-3 py-2 rounded-lg"
>
💬 WhatsApp
</a>


</div>


</div>


))


}


</div>






{/* Property Performance */}

<h2 className="text-3xl font-bold mt-12 mb-5">
📊 Property Performance
</h2>


<div className="grid md:grid-cols-2 gap-6">


{
data.performanceData.length===0 ?

<div className="bg-white p-5 rounded-xl">
No performance data
</div>

:

data.performanceData.map((property:any)=>(

<div
key={property.id}
className="bg-white p-5 rounded-xl space-y-2"
>

<h3 className="text-xl font-bold">
🏠 {property.title || property.propertyTitle || "Property"}
</h3>


<p>
👁 Views: {property.views}
</p>


<p>
📩 Leads: {property.leads}
</p>


<p>
📅 Visits: {property.visits}
</p>


<p className="text-green-700 font-bold">
Conversion: {property.conversion}%
</p>


</div>

))

}


</div>




{/* Recent Site Visits */}

<h2 className="text-3xl font-bold mt-12 mb-5">
📅 Recent Site Visits
</h2>


<div className="grid md:grid-cols-3 gap-6">

{
data.recentVisits.length===0 ?

<div className="bg-white p-5 rounded-xl">
No site visits
</div>

:

data.recentVisits.map((visit:any)=>(

<div
key={visit.id}
className="bg-white p-5 rounded-xl"
>

<h3 className="font-bold">
{visit.propertyTitle || "Property Visit"}
</h3>


<p>
📅 {visit.date || "Date"}
</p>


<p>
⏰ {visit.time || "Time"}
</p>


<p className="text-slate-500">
{visit.status || "Pending"}
</p>


</div>

))

}

</div>

</div>

);

}
