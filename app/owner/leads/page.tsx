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


type Lead = {
  id:string;
  name?:string;
  phone?:string;
  propertyTitle?:string;
  status?:string;
  notes?:string;
  followUpDate?:string;
};



export default function OwnerLeadsPage(){


const {user}=useAuth();


const [loading,setLoading]=useState(true);

const [leads,setLeads]=useState<Lead[]>([]);



const [followNotes,setFollowNotes]=useState<Record<string,string>>({});

const [followDates,setFollowDates]=useState<Record<string,string>>({});





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

},[user]);






async function updateStatus(
id:string,
status:string
){


await updateDoc(

doc(db,"leads",id),

{
status,
updatedAt:serverTimestamp()
}

);



setLeads((prev)=>

prev.map((lead)=>

lead.id===id

?

{
...lead,
status
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
status:"Follow Up"
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




<div className="bg-yellow-500 text-black p-5 rounded-xl">

<h2>New</h2>

<p className="text-3xl font-bold">
{newLeads}
</p>

</div>




<div className="bg-blue-600 p-5 rounded-xl">

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








<h2 className="text-3xl font-bold mb-5">

All Leads

</h2>







{
leads.length===0 ?


<div className="bg-zinc-900 p-6 rounded-xl">

No Leads Found

</div>



:


<div className="grid md:grid-cols-2 gap-6">



{

leads.map((lead)=>(



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

className="bg-blue-600 px-5 py-2 rounded-xl"

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



</div>


);

}
