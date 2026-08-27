"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Timestamp } from "firebase/firestore";

import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
  arrayUnion,
  addDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


type LeadActivity = {
  type:string;
  text:string;
  message?:string;
  date?:string | Timestamp;
};


type Lead = {
  id:string;
  name?:string;
  phone?:string;
  email?:string;
  message?:string;
  propertyId?:string;
  buyerId?:string;
  buyerEmail?:string;
  propertyTitle?:string;
  status?:string;
  notes?:string;
  followUpDate?:string;
  priority?:string;
  createdAt?:Timestamp;
  activities?:LeadActivity[];
};



function TeamEnquiriesContent(){


const {user}=useAuth();
const searchParams = useSearchParams();


const [loading,setLoading]=useState(true);

const [leads,setLeads]=useState<Lead[]>([]);

const [search,setSearch]=useState("");

const [filter,setFilter]=useState("All");

const [priorityFilter,setPriorityFilter]=useState("All");



const [followNotes,setFollowNotes]=useState<Record<string,string>>({});

const [followDates,setFollowDates]=useState<Record<string,string>>({});


const [selectedLead,setSelectedLead]=useState<Lead | null>(null);





async function fetchLeads(){


if(!user){
return;
}


try{


const q=query(
collection(db,"leads"),
where("ownerId","==",user.uid)
);



const snap=await getDocs(q);



const data=snap.docs.map((item)=>({

id:item.id,
...item.data()

})) as Lead[];



setLeads(data);



}


catch(error){

console.log(
"OWNER LEADS ERROR",
error
);

}


finally{

setLoading(false);

}


}





useEffect(()=>{

fetchLeads();

const urlFilter = searchParams.get("filter");

if(urlFilter){

if(urlFilter==="hot"){
setPriorityFilter("Hot");
}

else if(urlFilter==="warm"){
setPriorityFilter("Warm");
}

else if(urlFilter==="cold"){
setPriorityFilter("Cold");
}

else if(urlFilter==="today"){
setFilter("Follow Up");
}

else if(urlFilter==="overdue"){
setFilter("Follow Up");
}

}

},[user,searchParams]);







function handleDragStart(
e:React.DragEvent,
id:string
){

e.dataTransfer.setData(
"leadId",
id
);

}



function handleDrop(
e:React.DragEvent,
status:string
){

e.preventDefault();

const id =
e.dataTransfer.getData("leadId");


if(id){

updateStatus(
id,
status
);

}

}



async function updateStatus(
id:string,
status:string
){

const oldLead =
leads.find(
(lead)=>lead.id===id
);


await updateDoc(

doc(db,"leads",id),

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

activities:arrayUnion({

type:"status",

text:`Status changed from ${oldLead?.status || "New"} to ${status}`,

message:`Priority updated automatically`,

date:new Date().toLocaleDateString()

}),

updatedAt:serverTimestamp()

}

);



const updatedLead =
leads.find(
(lead)=>lead.id===id
);



if(updatedLead){

await addDoc(
collection(db,"notifications"),
{
ownerId:user?.uid,

title:
status==="New"
?
"🔥 New Hot Lead"
:
"📢 Lead Updated",

message:
`${updatedLead.name || "Customer"} lead status changed to ${status}`,

leadId:id,

priority:
status==="Closed" || status==="Lost"
?
"Cold"
:
status==="Interested" ||
status==="Follow Up" ||
status==="Site Visit"
?
"Warm"
:
"Hot",

read:false,

createdAt:serverTimestamp()

}
);

}



if(updatedLead?.buyerId){

await addDoc(
collection(db,"notifications"),
{
buyerId:updatedLead.buyerId,

title:"📢 Enquiry Update",

message:`Your enquiry status changed to ${status}`,

propertyTitle:updatedLead.propertyTitle || "",

read:false,

createdAt:serverTimestamp()

}
);

}



setLeads((prev)=>

prev.map((lead)=>

lead.id===id

?

{
...lead,

status,

activities:[
...(lead.activities || []),

{

type:"status",

text:`Status changed from ${lead.status || "New"} to ${status}`,

date:new Date().toLocaleDateString()

}

]

}

:

lead

)

);


}



async function updatePriority(
id:string,
priority:string
){

const oldLead =
leads.find(
(lead)=>lead.id===id
);


await updateDoc(

doc(db,"leads",id),

{
priority,

activities:arrayUnion({

type:"priority",

text:`Priority changed from ${oldLead?.priority || "Hot"} to ${priority}`,

date:new Date().toLocaleDateString()

}),

updatedAt:serverTimestamp()
}

);


setLeads((prev)=>

prev.map((lead)=>

lead.id===id

?

{
...lead,
priority
}

:

lead

)

);


}



async function addLeadActivity(
id:string,
type:string,
text:string
){

await updateDoc(

doc(db,"leads",id),

{
activities:arrayUnion({

type,
text,
date:new Date().toLocaleDateString()

}),

updatedAt:serverTimestamp()

}

);


setLeads((prev)=>

prev.map((lead)=>

lead.id===id

?

{
...lead,

activities:[
...(lead.activities || []),

{
type,
text,
date:new Date().toLocaleDateString()
}

]

}

:

lead

)

);


}



async function saveFollowUp(
id:string
){


const notes=
followNotes[id] || "";


const date=
followDates[id] || "";



await updateDoc(

doc(db,"leads",id),

{
notes,
followUpDate:date,
status:"Follow Up",

activities:arrayUnion({

type:"followup",

text:"📝 Follow Up Added",

message:notes || "Follow up scheduled",

date:new Date().toLocaleDateString()

}),

updatedAt:serverTimestamp()
}

);



setLeads((prev)=>

prev.map((lead)=>

lead.id===id

?

{
...lead,
notes,
followUpDate:date,
status:"Follow Up",

activities:[
...(lead.activities || []),

{
type:"followup",
text:"📝 Follow Up Added",
message:notes || "Follow up scheduled",
date:new Date().toLocaleDateString()
}

]

}

:

lead

)

);



alert(
"Follow up saved"
);


}






if(loading){


return(

<div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">

Loading Leads...

</div>

);

}





const total=leads.length;


const newLeads=
leads.filter(
(l)=>!l.status || l.status==="New"
).length;



const contacted=
leads.filter(
(l)=>l.status==="Contacted"
).length;



const followUps=
leads.filter(
(l)=>l.status==="Follow Up"
).length;



const closed=
leads.filter(
(l)=>l.status==="Closed"
).length;


const today = new Date()
.toISOString()
.split("T")[0];


const filteredLeads = leads.filter((lead)=>{

const text =
(search || "").toLowerCase();


const matchSearch =
(lead.name || "").toLowerCase().includes(text) ||
(lead.phone || "").toLowerCase().includes(text) ||
(lead.propertyTitle || "").toLowerCase().includes(text);


const matchFilter =
filter==="All" ||

(!lead.status && filter==="New") ||

lead.status===filter ||

(
filter==="hot" &&
(
lead.priority==="Hot" ||
!lead.status ||
lead.status==="New"
)
) ||

(
filter==="warm" &&
(
lead.priority==="Warm" ||
lead.status==="Follow Up" ||
lead.status==="Contacted"
)
) ||

(
filter==="cold" &&
(
lead.priority==="Cold" ||
lead.status==="Closed" ||
lead.status==="Lost"
)
) ||

(
filter==="today" &&
lead.followUpDate===today
) ||

(
filter==="overdue" &&
lead.followUpDate &&
lead.followUpDate < today &&
lead.status!=="Closed" &&
lead.status!=="Lost"
);


return matchSearch && matchFilter;

});




const getLeadPriority=(lead:Lead)=>{

if(lead.priority){
return lead.priority;
}


if(
lead.status==="New" ||
!lead.status
){
return "Hot";
}


if(
lead.status==="Follow Up"
){
return "Warm";
}


if(
lead.status==="Closed" ||
lead.status==="Lost"
){
return "Cold";
}


return "Warm";

};

function getLeadScore(lead:Lead){

let score = 0;


if(lead.phone){
score += 10;
}

if(lead.email){
score += 10;
}

if(lead.message){
score += 10;
}

if(lead.followUpDate){
score += 20;
}

if(lead.status==="Interested"){
score += 20;
}

if(lead.status==="Site Visit"){
score += 30;
}

if(lead.status==="Closed"){
score += 40;
}


return score;

}




const hotLeads =
leads.filter((lead)=>
getLeadPriority(lead)==="Hot"
).length;


const warmLeads =
leads.filter((lead)=>
getLeadPriority(lead)==="Warm"
).length;


const coldLeads =
leads.filter((lead)=>
getLeadPriority(lead)==="Cold"
).length;



const priorityFilteredLeads = filteredLeads.filter((lead)=>{

if(priorityFilter==="All"){
return true;
}

return getLeadPriority(lead)===priorityFilter;

});


const priorityLeads = [...priorityFilteredLeads].sort((a,b)=>{

return getLeadScore(b) - getLeadScore(a);

});


const todayFollowUps =
leads.filter((lead)=>
lead.followUpDate===today
).length;



const overdueFollowUpLeads =
leads
.filter((lead)=>
lead.followUpDate &&
lead.followUpDate < today
)
.sort((a,b)=>
getLeadScore(b)-getLeadScore(a)
);



const overdueFollowUps =
overdueFollowUpLeads.length;







return(


<div className="min-h-screen bg-zinc-950 text-white p-8">


<h1 className="text-4xl font-bold mb-8">

📞 Owner Lead CRM

</h1>





<div className="grid md:grid-cols-5 gap-5 mb-10">



<div className="bg-zinc-900 p-5 rounded-xl">

<h2>Total</h2>

<p className="text-3xl font-bold">
{total}
</p>

</div>




<div className="bg-[#d4a855] text-black p-5 rounded-xl">

<h2>New</h2>

<p className="text-3xl font-bold">
{newLeads}
</p>

</div>




<div className="bg-[#60A5FA] p-5 rounded-xl">

<h2>Contacted</h2>

<p className="text-3xl font-bold">
{contacted}
</p>

</div>




<div className="bg-purple-600 p-5 rounded-xl">

<h2>Follow Up</h2>

<p className="text-3xl font-bold">
{followUps}
</p>

</div>




<div className="bg-green-600 p-5 rounded-xl">

<h2>Closed</h2>

<p className="text-3xl font-bold">
{closed}
</p>

</div>


</div>



<div className="grid md:grid-cols-2 gap-5 mb-8">


<div className="bg-[#60A5FA] p-6 rounded-xl">

<h2 className="text-xl font-bold">
📅 Today's Follow Ups
</h2>

<p className="text-4xl font-bold mt-2">
{todayFollowUps}
</p>

</div>



<div className="bg-red-600 p-6 rounded-xl">

<h2 className="text-xl font-bold">
⚠️ Overdue Follow Ups
</h2>

<p className="text-4xl font-bold mt-2">
{overdueFollowUps}
</p>

</div>


</div>







<div className="grid md:grid-cols-2 gap-6 mb-8">

<div className="bg-orange-600 rounded-xl p-5">
<h2 className="text-xl font-bold mb-4">📅 Today's Follow-up Leads</h2>

{
leads
.filter((lead)=>lead.followUpDate===today)
.slice(0,5)
.map((lead)=>(
<div key={lead.id} className="bg-orange-700 rounded-lg p-3 mb-2">
<p className="font-bold">{lead.name || "Customer"}</p>
<p className="text-sm">{lead.propertyTitle || "Property"}</p>
</div>
))
}

</div>

<div className="bg-red-700 rounded-xl p-5">
<h2 className="text-xl font-bold mb-4">⚠️ Overdue Leads</h2>

{
leads
.filter((lead)=>lead.followUpDate && lead.followUpDate<today)
.slice(0,5)
.map((lead)=>(
<div key={lead.id} className="bg-red-800 rounded-lg p-3 mb-2">
<p className="font-bold">{lead.name || "Customer"}</p>
<p className="text-sm">{lead.followUpDate}</p>
</div>
))
}

</div>

</div>

<div className="flex flex-wrap gap-3 mb-6">


<button

onClick={()=>setPriorityFilter("All")}

className={`px-4 py-2 rounded-xl ${
priorityFilter==="All"
?
"bg-white text-black"
:
"bg-zinc-800"
}`}

>
All
</button>



<button

onClick={()=>setPriorityFilter("Hot")}

className={`px-4 py-2 rounded-xl ${
priorityFilter==="Hot"
?
"bg-red-600"
:
"bg-zinc-800"
}`}

>
🔥 Hot ({hotLeads})
</button>




<button

onClick={()=>setPriorityFilter("Warm")}

className={`px-4 py-2 rounded-xl ${
priorityFilter==="Warm"
?
"bg-[#d4a855] text-black"
:
"bg-zinc-800"
}`}

>
🟡 Warm ({warmLeads})
</button>




<button

onClick={()=>setPriorityFilter("Cold")}

className={`px-4 py-2 rounded-xl ${
priorityFilter==="Cold"
?
"bg-[#60A5FA]"
:
"bg-zinc-800"
}`}

>
❄ Cold ({coldLeads})
</button>


</div>



<h2 className="text-3xl font-bold mb-5">

📊 CRM Pipeline

</h2>


<div className="grid md:grid-cols-5 gap-4 mb-10">


{
[
{
title:"🆕 New",
value:"New",
count:newLeads,
color:"bg-[#d4a855] text-black"
},
{
title:"📞 Contacted",
value:"Contacted",
count:contacted,
color:"bg-[#60A5FA]"
},
{
title:"🔥 Follow Up",
value:"Follow Up",
count:followUps,
color:"bg-purple-600"
},
{
title:"✅ Closed",
value:"Closed",
count:closed,
color:"bg-green-600"
},
{
title:"❌ Lost",
value:"Lost",
count:
leads.filter(
(l)=>l.status==="Lost"
).length,
color:"bg-red-600"
}

].map((stage)=>(

<div
key={stage.value}
className={`${stage.color} p-5 rounded-xl cursor-pointer`}
onClick={()=>setFilter(stage.value)}
>

<h3 className="font-bold text-lg">
{stage.title}
</h3>

<p className="text-3xl font-bold mt-2">
{stage.count}
</p>

</div>

))

}


</div>




<h2 className="text-3xl font-bold mb-5">

📊 Lead Pipeline Board

</h2>



<div className="grid md:grid-cols-7 gap-5 mb-12">


{
[
"New",
"Contacted",
"Interested",
"Site Visit",
"Follow Up",
"Closed",
"Lost"

].map((stage)=>(


<div
key={stage}
onDragOver={(e)=>e.preventDefault()}
onDrop={(e)=>handleDrop(e,stage)}
className="bg-zinc-900 p-4 rounded-xl min-h-[250px]"
>


<h3 className="font-bold text-xl mb-4">

{
stage==="New" && "🆕 "
}

{
stage==="Contacted" && "📞 "
}

{
stage==="Interested" && "🔥 "
}

{
stage==="Site Visit" && "📅 "
}

{
stage==="Follow Up" && "📝 "
}

{
stage==="Closed" && "✅ "
}

{
stage==="Lost" && "❌ "
}

{stage}

</h3>



<div className="space-y-3">


{
priorityLeads
.filter((lead)=>
(lead.status || "New")===stage
)
.map((lead)=>(


<div

key={lead.id}

draggable

onDragStart={(e)=>
handleDragStart(e,lead.id)
}

onClick={()=>setSelectedLead(lead)}

className="bg-zinc-800 p-4 rounded-xl cursor-grab hover:bg-zinc-700 transition"

>


<div className="flex justify-between items-center mb-3">

<p className="font-bold text-lg">
{lead.name || "Customer"}
</p>


<span className={`px-3 py-1 rounded-full text-xs font-bold ${
getLeadPriority(lead)==="Hot"
?
"bg-red-600"
:
getLeadPriority(lead)==="Warm"
?
"bg-[#d4a855] text-black"
:
"bg-[#60A5FA]"
}`}>

{getLeadPriority(lead)}

</span>


</div>


<p className="text-sm">
📞 {lead.phone || "No phone"}
</p>


<p className="text-sm">
✉️ {lead.email || "No email"}
</p>


<p className="text-sm">
🏠 {lead.propertyTitle || "No property"}
</p>


<div className="mt-3 text-sm">

📊 Score:
<b>
 {getLeadScore(lead)}
</b>

</div>


{
lead.followUpDate && (

<div className="mt-2 text-sm">

📅 Follow Up:
{lead.followUpDate}

</div>

)
}


<div className="flex gap-2 mt-4">


<a
href={`tel:${lead.phone}`}
className="bg-green-600 px-3 py-2 rounded-lg text-sm"
onClick={(e)=>e.stopPropagation()}
>
📞
</a>


<a
target="_blank"
href={`https://wa.me/${lead.phone}`}
className="bg-emerald-600 px-3 py-2 rounded-lg text-sm"
onClick={(e)=>e.stopPropagation()}
>
💬
</a>


</div>


<select

value={lead.status || "New"}

onChange={(e)=>
updateStatus(
lead.id,
e.target.value
)
}

className="mt-3 w-full text-black rounded p-2"

>


<option>
New
</option>

<option>
Contacted
</option>

<option>
Interested
</option>

<option>
Site Visit
</option>

<option>
Follow Up
</option>

<option>
Closed
</option>

<option>
Lost
</option>


</select>



</div>


))


}



</div>


</div>


))

}



</div>




<h2 className="text-3xl font-bold mb-5">

All Leads

</h2>


<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Search name, phone, property..."

className="w-full mb-5 p-3 rounded-xl text-black"
/>


<div className="flex flex-wrap gap-3 mb-8">

{
[
"All",
"New",
"Contacted",
"Follow Up",
"Closed",
"Lost"
].map((item)=>(

<button

key={item}

onClick={()=>setFilter(item)}

className={`px-5 py-2 rounded-xl ${
filter===item
?
"bg-[#60A5FA]"
:
"bg-zinc-800"
}`}

>

{item}

</button>

))

}

</div>







{
leads.length===0 ?


<div className="bg-zinc-900 p-6 rounded-xl">

No Leads Found

</div>



:


<div className="grid md:grid-cols-2 gap-6">



{

priorityLeads.map((lead)=>(



<div

key={lead.id}

className="bg-zinc-900 p-6 rounded-2xl"

>



<h3 className="text-2xl font-bold">

{lead.name || "Customer"}

</h3>




<p className="mt-2">

📞 {lead.phone || "No phone"}

</p>



<p>

🏠 {lead.propertyTitle || "Property"}

</p>


<div className="mt-3">

<select

value={lead.priority || getLeadPriority(lead)}

onChange={(e)=>
updatePriority(
lead.id,
e.target.value
)
}

className="mt-3 text-black p-2 rounded w-full"

>

<option value="Hot">
🔥 Hot
</option>

<option value="Warm">
🟡 Warm
</option>

<option value="Cold">
❄ Cold
</option>


</select>


{
getLeadPriority(lead)==="Hot" ?

<span className="bg-red-600 px-3 py-1 rounded-full text-sm font-bold">
🔥 HOT LEAD
</span>

:

getLeadPriority(lead)==="Warm" ?

<span className="bg-[#d4a855] text-black px-3 py-1 rounded-full text-sm font-bold">
🟡 WARM LEAD
</span>

:

<span className="bg-[#60A5FA] px-3 py-1 rounded-full text-sm font-bold">
❄ COLD LEAD
</span>

}

</div>


{
lead.activities &&
lead.activities.length > 0 && (

<div className="mt-5 border-t border-zinc-700 pt-4">

<h4 className="font-bold mb-3">
📌 Activity Timeline
</h4>


<div className="space-y-3">

{
lead.activities
.slice()
.reverse()
.map((activity,index)=>(

<div
key={index}
className="bg-zinc-800 p-3 rounded-xl text-sm"
>

<p>
{
activity.type==="status"
?
"🟢 Status Changed"
:
"📝 Follow Up Added"
}
</p>


<p className="text-gray-300">
{activity.message}
</p>


<p className="text-gray-500 text-xs">
{
activity.date && typeof activity.date !== "string"
?
activity.date.toDate().toLocaleString()
:
activity.date || ""
}
</p>


</div>

))

}

</div>

</div>

)

}






<div className="mt-4">


<span className="bg-zinc-700 px-3 py-1 rounded">

{lead.status || "New"}

</span>


</div>








<select

value={lead.status || "New"}

onChange={(e)=>

updateStatus(
lead.id,
e.target.value
)

}

className="mt-4 text-black p-2 rounded w-full"

>


<option>
New
</option>

<option>
Contacted
</option>

<option>
Interested
</option>

<option>
Site Visit
</option>

<option>
Follow Up
</option>

<option>
Closed
</option>

<option>
Lost
</option>


</select>







<input


type="date"


value={

followDates[lead.id] ??

lead.followUpDate ??

""

}



onChange={(e)=>

setFollowDates({

...followDates,

[lead.id]:e.target.value

})

}



className="mt-4 text-black p-2 rounded w-full"

/>








<textarea


value={

followNotes[lead.id] ??

lead.notes ??

""

}



onChange={(e)=>

setFollowNotes({

...followNotes,

[lead.id]:e.target.value

})

}



placeholder="Follow up notes"



className="mt-3 w-full text-black p-2 rounded"

/>








<button


onClick={()=>saveFollowUp(lead.id)}


className="mt-4 bg-green-600 px-5 py-2 rounded-xl"

>


Save Follow-up


</button>







<div className="mt-5 flex gap-3">


<a

href={`tel:${lead.phone}`}

className="bg-[#60A5FA] px-5 py-2 rounded-xl"

>

📞 Call

</a>




<a

href={`https://wa.me/91${lead.phone}`}

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


{
selectedLead && (

<div className="fixed inset-0 bg-black/70 flex justify-end z-50">


<div className="w-full md:w-[450px] bg-zinc-950 h-full p-6 overflow-y-auto">


<div className="flex justify-between items-center mb-6">

<h2 className="text-3xl font-bold">
Lead Details
</h2>


<button

onClick={()=>setSelectedLead(null)}

className="bg-red-600 px-4 py-2 rounded-xl"

>
✕
</button>

</div>



<div className="bg-zinc-900 p-5 rounded-xl">

<h3 className="text-2xl font-bold">
👤 {selectedLead.name || "Customer"}
</h3>


<p className="mt-3">
📞 {selectedLead.phone || "No Phone"}
</p>


{
selectedLead.email && (
<p>
📧 {selectedLead.email}
</p>
)
}

</div>



<div className="mt-5 bg-zinc-900 p-5 rounded-xl">

<h4 className="font-bold mb-3">
🏠 Property Details
</h4>

<p>
{selectedLead.propertyTitle || "Property"}
</p>


{
selectedLead.propertyId && (
<p className="text-sm text-gray-400">
ID: {selectedLead.propertyId}
</p>
)
}

</div>



<div className="mt-5 bg-zinc-900 p-5 rounded-xl">

<h4 className="font-bold mb-3">
🔥 Lead Intelligence
</h4>


<p>
Priority: {selectedLead.priority || "Hot"}
</p>


<p>
Status: {selectedLead.status || "New"}
</p>


{
selectedLead.followUpDate && (
<p>
📅 Follow Up: {selectedLead.followUpDate}
</p>
)
}

</div>



{
selectedLead.message && (

<div className="mt-5 bg-zinc-900 p-5 rounded-xl">

<h4 className="font-bold">
💬 Buyer Message
</h4>

<p className="mt-2">
{selectedLead.message}
</p>

</div>

)

}




{
selectedLead.notes && (

<div className="mt-6 bg-zinc-900 p-4 rounded-xl">

<h4 className="font-bold">
📝 Notes
</h4>

<p>
{selectedLead.notes}
</p>

</div>

)

}




<div className="mt-6">

<h4 className="text-xl font-bold mb-3">
📌 Timeline
</h4>


{
selectedLead.activities?.map((activity,index)=>(

<div
key={index}
className="bg-zinc-900 p-3 rounded-xl mb-3"
>

<p>
{activity.text}
</p>

<p className="text-gray-400 text-sm">
{
typeof activity.date==="string"
?
activity.date
:
""
}
</p>


</div>

))

}


</div>



<div className="flex gap-3 mt-6">


<a
href={`tel:${selectedLead.phone}`}
onClick={()=>
addLeadActivity(
selectedLead.id,
"call",
"📞 Called customer"
)
}
className="bg-[#60A5FA] px-5 py-3 rounded-xl"
>
📞 Call
</a>


<a
href={`https://wa.me/91${selectedLead.phone}`}
target="_blank"
onClick={()=>
addLeadActivity(
selectedLead.id,
"whatsapp",
"💬 WhatsApp opened"
)
}
className="bg-green-600 px-5 py-3 rounded-xl"
>
💬 WhatsApp
</a>


</div>



</div>


</div>

)

}



</div>



);

}

export default function TeamEnquiriesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 p-8">
          <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 text-center font-bold text-slate-500 shadow-sm">
            Loading Property Enquiries...
          </div>
        </main>
      }
    >
      <TeamEnquiriesContent />
    </Suspense>
  );
}
