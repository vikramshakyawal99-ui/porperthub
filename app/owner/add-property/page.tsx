"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import LocationPicker from "@/components/LocationPicker";


export default function AddPropertyPage(){

const {user}=useAuth();
const router=useRouter();

const [loading,setLoading]=useState(false);

const [image,setImage]=useState<File|null>(null);


const [locationData,setLocationData]=useState({
 latitude:"",
 longitude:""
});


const [form,setForm]=useState({

title:"",
type:"property_sale",

roomType:"",
sharingType:"",
food:"",
bathroom:"",
ac:"",

location:"",
price:"",
bedrooms:"",
area:"",
contact:"",
description:"",

});



function handleChange(e:any){

setForm({

...form,

[e.target.name]:e.target.value

});

}



async function handleSubmit(e:React.FormEvent){

e.preventDefault();


if(!user){

alert("Please login first");
return;

}


setLoading(true);


try{


let imageUrl="";


if(image){

imageUrl=await uploadToCloudinary(image);

}



await addDoc(

collection(db,"properties"),

{

...form,

image:imageUrl,

latitude:locationData.latitude,

longitude:locationData.longitude,

ownerId:user.uid,

ownerEmail:user.email,

status:"pending",

createdAt:serverTimestamp()

}

);



alert("✅ Listing Added Successfully");


router.push("/owner/listings");


}

catch(error:any){

alert(error.message);

}


setLoading(false);


}





return (

<div className="min-h-screen bg-zinc-950 text-white p-10">


<div className="max-w-3xl mx-auto bg-zinc-900 p-8 rounded-2xl">


<h1 className="text-3xl font-bold mb-6">
➕ Add New Listing
</h1>



<form onSubmit={handleSubmit} className="space-y-4">



<input
name="title"
placeholder="Property Title"
className="w-full p-3 rounded text-black"
onChange={handleChange}
required
/>



<select
name="type"
className="w-full p-3 rounded text-black"
value={form.type}
onChange={handleChange}
>


<option value="property_sale">
New Property Sale
</option>


<option value="property_rent">
Property Rent
</option>


<option value="resale">
Resale Property
</option>


<option value="hostel">
Hostel
</option>


<option value="pg_boys">
Boys PG
</option>


<option value="pg_girls">
Girls PG
</option>


<option value="room_rent">
Room Rent
</option>


</select>





{
(
form.type==="hostel" ||
form.type==="pg_boys" ||
form.type==="pg_girls" ||
form.type==="room_rent"
)
&&
<>


<select
name="roomType"
className="w-full p-3 rounded text-black"
onChange={handleChange}
>

<option value="">
Select Room Type
</option>

<option value="one_room">
1 Room
</option>

<option value="two_room">
2 Room
</option>

<option value="double_seater">
Double Seater
</option>

<option value="triple_seater">
Triple Seater
</option>

<option value="four_seater">
Four Seater
</option>


</select>




<select
name="sharingType"
className="w-full p-3 rounded text-black"
onChange={handleChange}
>

<option value="">
Sharing Type
</option>

<option value="single">
Single
</option>

<option value="double">
Double Sharing
</option>

<option value="triple">
Triple Sharing
</option>

</select>




<select
name="food"
className="w-full p-3 rounded text-black"
onChange={handleChange}
>

<option value="">
Food Available?
</option>

<option value="yes">
Yes
</option>

<option value="no">
No
</option>

</select>




<select
name="bathroom"
className="w-full p-3 rounded text-black"
onChange={handleChange}
>

<option value="">
Bathroom
</option>

<option value="attached">
Attached Bathroom
</option>

<option value="common">
Common Bathroom
</option>

</select>




<select
name="ac"
className="w-full p-3 rounded text-black"
onChange={handleChange}
>

<option value="">
AC Type
</option>

<option value="ac">
AC
</option>

<option value="non_ac">
Non AC
</option>

</select>


</>

}





<input
name="location"
placeholder="Location"
className="w-full p-3 rounded text-black"
onChange={handleChange}
/>



<LocationPicker

onLocationSelect={(data)=>{

setLocationData(data)

}}

/>




<input
name="price"
placeholder="Price / Rent"
className="w-full p-3 rounded text-black"
onChange={handleChange}
required
/>



<input
name="bedrooms"
placeholder="Bedrooms"
className="w-full p-3 rounded text-black"
onChange={handleChange}
/>



<input
name="area"
placeholder="Area sq ft"
className="w-full p-3 rounded text-black"
onChange={handleChange}
/>



<input
name="contact"
placeholder="Contact Number"
className="w-full p-3 rounded text-black"
onChange={handleChange}
/>



<textarea

name="description"

placeholder="Description"

className="w-full p-3 rounded text-black"

onChange={handleChange}

/>




<input

type="file"

accept="image/*"

className="w-full p-3 rounded text-black bg-white"

onChange={(e)=>{

if(e.target.files){

setImage(e.target.files[0]);

}

}}

/>



<button

disabled={loading}

className="w-full bg-green-600 p-3 rounded-xl"

>

{loading ? "Uploading..." : "Add Listing"}

</button>



</form>


</div>


</div>

);

}
