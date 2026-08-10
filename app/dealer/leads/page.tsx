"use client";

import {useEffect,useState} from "react";
import {collection,query,where,getDocs,deleteDoc,doc,updateDoc} from "firebase/firestore";
import {auth,db} from "../../../lib/firebase";


export default function DealerLeads(){

const [leads,setLeads]=useState<any[]>([]);
const [loading,setLoading]=useState(true);



async function fetchLeads(){

try{

const user=auth.currentUser;

if(!user){
setLoading(false);
return;
}


const q=query(
collection(db,"leads"),
where("dealerId","==",user.uid)
);


const snap=await getDocs(q);


setLeads(
snap.docs.map(d=>({
id:d.id,
...d.data()
}))
);


}
catch(e){

console.log(e);

}
finally{

setLoading(false);

}

}



useEffect(()=>{

fetchLeads();

},[]);




async function changeStatus(id:string,status:string){

await updateDoc(
doc(db,"leads",id),
{
status
}
);

fetchLeads();

}



async function removeLead(id:string){

await deleteDoc(
doc(db,"leads",id)
);

fetchLeads();

}



return(

<div className="min-h-screen bg-zinc-100 p-8">


<div className="max-w-6xl mx-auto">


<h1 className="text-3xl font-bold text-blue-700">
Customer Leads
</h1>

<p className="text-gray-500">
Manage your customer enquiries
</p>



{
loading ?

<p className="mt-8">
Loading...
</p>


:

leads.length===0 ?

<div className="bg-white rounded-2xl shadow p-8 mt-8 text-center">

<div className="text-5xl">
📞
</div>

<h2 className="font-bold text-xl mt-4">
No Leads Available
</h2>

</div>


:


<div className="grid md:grid-cols-2 gap-6 mt-8">


{
leads.map(lead=>(


<div
key={lead.id}
className="bg-white rounded-2xl shadow p-6"
>


<h2 className="text-xl font-bold">
{lead.name || "Customer"}
</h2>


<p className="mt-2">
📱 {lead.phone}
</p>


<p className="mt-2">
🏠 {lead.propertyTitle || "Property"}
</p>


<p className="text-gray-500 mt-3">
{lead.message}
</p>



<div className="mt-4">

<span className="bg-blue-100 px-3 py-1 rounded-full text-sm">
{lead.status || "New"}
</span>

</div>



<div className="flex gap-3 mt-5">


<a
href={`tel:${lead.phone}`}
className="flex-1 text-center bg-green-600 text-white py-2 rounded-lg"
>
Call
</a>



<a
href={`https://wa.me/91${lead.phone}`}
className="flex-1 text-center bg-green-500 text-white py-2 rounded-lg"
>
WhatsApp
</a>


</div>



<div className="flex gap-3 mt-3">


<button
onClick={()=>changeStatus(lead.id,"Contacted")}
className="flex-1 bg-blue-700 text-white rounded-lg"
>
Contacted
</button>


<button
onClick={()=>removeLead(lead.id)}
className="flex-1 bg-red-600 text-white rounded-lg"
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

)

}
