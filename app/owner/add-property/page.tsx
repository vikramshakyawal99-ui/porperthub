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

propertyType:"flat",

purpose:"buy",

location:"",

price:"",

rent:"",

bedrooms:"",

area:"",

contact:"",

description:"",

roomType:"",

sharingType:"",

gender:"",

food:"",

ac:"",

suitableFor:"",

society:"",

plotSize:""

});


function handleChange(
e:React.ChangeEvent<
HTMLInputElement |
HTMLTextAreaElement |
HTMLSelectElement
>
){

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



alert("Listing Added Successfully");


router.push("/owner/listings");


}

catch(error:any){

alert(error.message);

}


setLoading(false);


}



return (

<div className="min-h-screen bg-zinc-950 text-white p-10">

<div className="mx-auto max-w-3xl bg-zinc-900 rounded-2xl p-8">


<h1 className="text-3xl font-bold mb-6">
➕ Add New Listing
</h1>


<form onSubmit={handleSubmit} className="space-y-4">


<input
name="title"
placeholder="Property Title"
value={form.title}
onChange={handleChange}
className="w-full p-3 rounded text-black"
/>



<select
name="purpose"
value={form.purpose}
onChange={handleChange}
className="w-full p-3 rounded text-black"
>

<option value="buy">
Buy
</option>

<option value="rent">
Rent
</option>

<option value="resale">
Resale
</option>

</select>




<select
name="propertyType"
value={form.propertyType}
onChange={handleChange}
className="w-full p-3 rounded text-black"
>


<option value="flat">
Flat
</option>

<option value="villa">
Villa
</option>

<option value="plot">
Plot
</option>

<option value="room_rent">
Room Rent
</option>

<option value="pg">
PG
</option>

<option value="hostel">
Hostel
</option>


</select>



<input
name="location"
placeholder="Location"
value={form.location}
onChange={handleChange}
className="w-full p-3 rounded text-black"
/>



<input
name="price"
placeholder="Price"
value={form.price}
onChange={handleChange}
className="w-full p-3 rounded text-black"
/>



<input
name="rent"
placeholder="Rent"
value={form.rent}
onChange={handleChange}
className="w-full p-3 rounded text-black"
/>




{
(form.propertyType==="flat" ||
form.propertyType==="villa") &&

<input
name="bedrooms"
placeholder="Bedrooms"
value={form.bedrooms}
onChange={handleChange}
className="w-full p-3 rounded text-black"
/>

}




{
(form.propertyType==="flat" ||
form.propertyType==="villa" ||
form.propertyType==="plot") &&

<input
name="area"
placeholder="Area"
value={form.area}
onChange={handleChange}
className="w-full p-3 rounded text-black"
/>

}




{
form.propertyType==="plot" &&

<>

<input
name="society"
placeholder="Society / JDA"
value={form.society}
onChange={handleChange}
className="w-full p-3 rounded text-black"
/>


<input
name="plotSize"
placeholder="Plot Size"
value={form.plotSize}
onChange={handleChange}
className="w-full p-3 rounded text-black"
/>

</>

}





{
(
form.propertyType==="room_rent" ||
form.propertyType==="pg" ||
form.propertyType==="hostel"
)

&&

<>


<select
name="roomType"
value={form.roomType}
onChange={handleChange}
className="w-full p-3 rounded text-black"
>

<option value="">
Room Type
</option>

<option value="single">
Single Room
</option>

<option value="shared">
Shared Room
</option>

<option value="private">
Private Room
</option>

</select>



<select
name="sharingType"
value={form.sharingType}
onChange={handleChange}
className="w-full p-3 rounded text-black"
>

<option value="">
Sharing
</option>

<option value="1">
1 Sharing
</option>

<option value="2">
2 Sharing
</option>

<option value="3">
3 Sharing
</option>

<option value="4">
4 Sharing
</option>

</select>



<select
name="ac"
value={form.ac}
onChange={handleChange}
className="w-full p-3 rounded text-black"
>

<option value="">
AC Facility
</option>

<option value="yes">
AC
</option>

<option value="no">
Non AC
</option>

</select>




<select
name="food"
value={form.food}
onChange={handleChange}
className="w-full p-3 rounded text-black"
>

<option value="">
Food Facility
</option>

<option value="yes">
Food Available
</option>

<option value="no">
Non Food
</option>

</select>




<select
name="suitableFor"
value={form.suitableFor}
onChange={handleChange}
className="w-full p-3 rounded text-black"
>

<option value="">
Suitable For
</option>

<option value="boys">
Boys
</option>

<option value="girls">
Girls
</option>

<option value="family">
Family
</option>


</select>


</>

}





<input
name="contact"
placeholder="Contact Number"
value={form.contact}
onChange={handleChange}
className="w-full p-3 rounded text-black"
/>



<textarea
name="description"
placeholder="Description"
value={form.description}
onChange={handleChange}
className="w-full p-3 rounded text-black"
/>



<input
type="file"
accept="image/*"
onChange={(e)=>{

if(e.target.files)
setImage(e.target.files[0]);

}}
className="w-full p-3 bg-white text-black rounded"
/>



<LocationPicker onLocationSelect={setLocationData}/>



<button
disabled={loading}
className="w-full bg-blue-600 p-3 rounded font-bold"
>

{
loading
?
"Adding..."
:
"Add Listing"
}

</button>


</form>


</div>

</div>

);


}
