"use client";

import {useState} from "react";
import {addDoc,collection} from "firebase/firestore";
import {db,auth} from "../../../lib/firebase";
import {useRouter} from "next/navigation";

export default function AddProperty(){

const router=useRouter();

const [form,setForm]=useState({
title:"",
type:"",
location:"",
city:"",
price:"",
bhk:"",
area:"",
contact:"",
description:""
});

const [loading,setLoading]=useState(false);


function update(key:string,value:string){
setForm({...form,[key]:value});
}


async function addProperty(){

try{

setLoading(true);

const user=auth.currentUser;

if(!user){
alert("Login required");
return;
}


await addDoc(collection(db,"properties"),{

...form,

propertyType:form.type,

dealerId:user.uid,
ownerId:user.uid,
role:"property_dealer",

createdAt:new Date()

});


alert("Property Added Successfully");

router.push("/dealer/listings");


}
catch(err){

console.log(err);
alert("Error");

}
finally{

setLoading(false);

}

}



return(

<div className="min-h-screen bg-zinc-100 p-8">

<div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">


<h1 className="text-3xl font-bold text-blue-700">
Add New Property
</h1>


<div className="mt-6 space-y-4">


<input
placeholder="Property Title"
className="input"
onChange={(e)=>update("title",e.target.value)}
/>


<select
className="input"
onChange={(e)=>update("type",e.target.value)}
>

<option>Select Property Type</option>
<option>Flat</option>
<option>Villa</option>
<option>Plot</option>
<option>PG</option>
<option>Hostel</option>

</select>


<input
placeholder="City"
className="input"
onChange={(e)=>update("city",e.target.value)}
/>


<input
placeholder="Location / Area"
className="input"
onChange={(e)=>update("location",e.target.value)}
/>


<input
placeholder="Price / Rent"
className="input"
onChange={(e)=>update("price",e.target.value)}
/>


<input
placeholder="BHK"
className="input"
onChange={(e)=>update("bhk",e.target.value)}
/>


<input
placeholder="Area (sq ft)"
className="input"
onChange={(e)=>update("area",e.target.value)}
/>


<input
placeholder="Contact Number"
className="input"
onChange={(e)=>update("contact",e.target.value)}
/>


<textarea
placeholder="Description"
className="input h-32"
onChange={(e)=>update("description",e.target.value)}
/>


<button
onClick={addProperty}
disabled={loading}
className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold"
>

{loading?"Adding...":"Add Property"}

</button>


</div>


</div>

</div>

)

}
