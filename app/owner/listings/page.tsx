"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


export default function OwnerListingsPage(){

const {user}=useAuth();
const router = useRouter();

const [properties,setProperties]=useState<any[]>([]);
const [filter,setFilter]=useState("all");
const [loading,setLoading]=useState(true);



async function fetchProperties(){

if(!user) return;


const q=query(
collection(db,"properties"),
where("ownerId","==",user.uid)
);


const snap=await getDocs(q);


const data=snap.docs.map((item)=>({

id:item.id,
...item.data()

}));


setProperties(data);
setLoading(false);

}



async function deleteProperty(id:string){

const ok=confirm(
"Delete this listing?"
);

if(!ok) return;


await deleteDoc(
doc(db,"properties",id)
);


fetchProperties();

}



useEffect(()=>{

fetchProperties();

},[user]);




if(loading){

return(
<div className="p-10">
Loading Listings...
</div>
);

}



const filteredProperties =
filter==="all"
?
properties
:
properties.filter(
(property)=>property.status===filter
);



return(

<div className="min-h-screen bg-zinc-950 text-white p-10">


<div className="max-w-7xl mx-auto">


<h1 className="text-4xl font-bold mb-8">
🏠 My Listings
</h1>



<div className="flex gap-3 mb-8">


{
["all","pending","approved","rejected"].map((item)=>(

<button

key={item}

onClick={()=>setFilter(item)}

className="px-5 py-2 rounded-xl bg-blue-600"

>

{item.toUpperCase()}

</button>

))

}


</div>





{
filteredProperties.length===0 ?

<div className="bg-zinc-900 p-8 rounded-xl">

No listings found

</div>


:

<div className="grid md:grid-cols-3 gap-6">


{
filteredProperties.map((property)=>(


<div
key={property.id}
className="bg-zinc-900 rounded-2xl overflow-hidden shadow-xl"
>



{
property.image &&

<Image
src={property.image}
alt={property.title || "Property"}
width={600}
height={400}
className="w-full h-48 object-cover"
/>

}




<div className="p-5">


<h2 className="text-xl font-bold">
{property.title}
</h2>


<p>
📍 {property.location}
</p>


<p>
💰 ₹ {
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


<p>
🏠 Type: {property.propertyType}
</p>


{
(property.suitableFor || property.gender) && (

<p className="mt-2">
👤 {
property.suitableFor==="family"
?
"Family Allowed"
:
property.suitableFor==="boys"
?
"Boys"
:
property.suitableFor==="girls"
?
"Girls"
:
property.suitableFor==="co_living"
?
"Co-Living"
:
property.suitableFor==="anyone"
?
"Anyone"
:
property.suitableFor || property.gender
}
</p>

)
}




<div className="mt-3">


{
property.status==="approved" ?

<span className="bg-green-600 px-3 py-1 rounded-full">
✅ Approved
</span>


:

property.status==="rejected" ?

<span className="bg-red-600 px-3 py-1 rounded-full">
❌ Rejected
</span>


:

<span className="bg-yellow-500 text-black px-3 py-1 rounded-full">
⏳ Pending
</span>

}


</div>




<button

onClick={()=>router.push(`/owner/edit-property/${property.id}`)}

className="mt-5 mr-3 bg-blue-600 px-5 py-2 rounded-xl"

>

Edit

</button>


<button

onClick={()=>deleteProperty(property.id)}

className="mt-5 bg-red-600 px-5 py-2 rounded-xl"

>

Delete

</button>



</div>


</div>


))

}


</div>


}



</div>


</div>


);

}
