"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";

import { useRouter, useParams } from "next/navigation";
import LocationPicker from "@/components/LocationPicker";


export default function EditPropertyPage(){

const router = useRouter();
const params = useParams();


const [loading,setLoading]=useState(false);

const [image,setImage]=useState<File|null>(null);


const [locationData,setLocationData]=useState({

latitude:"",
longitude:""

});



const [form,setForm]=useState({

title:"",

purpose:"buy",

propertyType:"flat",

location:"",

price:"",

bedrooms:"",

area:"",

contact:"",

description:"",

roomType:"",

sharingType:"",

gender:"",

food:"",

rent:"",

image:""

});




useEffect(()=>{


async function loadProperty(){


const snap = await getDoc(

doc(
db,
"properties",
params.id as string
)

);



if(!snap.exists()){

alert("Property not found");

router.push("/owner/my-properties");

return;

}



const data:any=snap.data();



setForm({

title:data.title || "",

purpose:data.purpose || "buy",

propertyType:data.propertyType || "flat",

location:data.location || "",

price:data.price || "",

bedrooms:data.bedrooms || "",

area:data.area || "",

contact:data.contact || "",

description:data.description || "",

roomType:data.roomType || "",

sharingType:data.sharingType || "",

gender:data.gender || "",

food:data.food || "",

rent:data.rent || "",

image:data.image || ""

});



setLocationData({

latitude:data.latitude || "",

longitude:data.longitude || ""

});



}


loadProperty();



},[params.id,router]);





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





async function handleSubmit(
e:React.FormEvent
){

e.preventDefault();

setLoading(true);


try{


let imageUrl=form.image;



if(image){

imageUrl=await uploadToCloudinary(image);

}



await updateDoc(

doc(
db,
"properties",
params.id as string
),

{

...form,

image:imageUrl,

latitude:locationData.latitude,

longitude:locationData.longitude

}

);



alert("✅ Property Updated");


router.push("/owner/my-properties");


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
✏️ Edit Property
</h1>



<form
onSubmit={handleSubmit}
className="space-y-4"
>



<input

name="title"

value={form.title}

onChange={handleChange}

placeholder="Property Title"

className="w-full rounded p-3 text-black"

/>




<select

name="purpose"

value={form.purpose}

onChange={handleChange}

className="w-full rounded p-3 text-black"

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

className="w-full rounded p-3 text-black"

>


<option value="flat">
Flat / Apartment
</option>


<option value="villa">
Villa / House
</option>


<option value="plot">
Plot
</option>


<option value="room">
Room
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

value={form.location}

onChange={handleChange}

placeholder="Location"

className="w-full rounded p-3 text-black"

/>





<LocationPicker

onLocationSelect={(data)=>{

setLocationData(data);

}}

/>





{
(
form.propertyType==="flat" ||
form.propertyType==="villa"
)

&&

<>


<input

name="bedrooms"

value={form.bedrooms}

onChange={handleChange}

placeholder="Bedrooms / BHK"

className="w-full rounded p-3 text-black"

/>



<input

name="price"

value={form.price}

onChange={handleChange}

placeholder="Price"

className="w-full rounded p-3 text-black"

/>


</>

}





{
form.propertyType==="plot"

&&

<>

<input

name="area"

value={form.area}

onChange={handleChange}

placeholder="Plot Area"

className="w-full rounded p-3 text-black"

/>



<input

name="price"

value={form.price}

onChange={handleChange}

placeholder="Plot Price"

className="w-full rounded p-3 text-black"

/>


</>

}





{
(
form.propertyType==="pg" ||
form.propertyType==="room" ||
form.propertyType==="hostel"
)

&&

<>

<input

name="roomType"

value={form.roomType}

onChange={handleChange}

placeholder="Single / Shared Room"

className="w-full rounded p-3 text-black"

/>




<input

name="sharingType"

value={form.sharingType}

onChange={handleChange}

placeholder="Sharing"

className="w-full rounded p-3 text-black"

/>




<input

name="gender"

value={form.gender}

onChange={handleChange}

placeholder="Boys / Girls"

className="w-full rounded p-3 text-black"

/>




<input

name="food"

value={form.food}

onChange={handleChange}

placeholder="Food Available"

className="w-full rounded p-3 text-black"

/>




<input

name="rent"

value={form.rent}

onChange={handleChange}

placeholder="Monthly Rent"

className="w-full rounded p-3 text-black"

/>


</>

}




<input

name="contact"

value={form.contact}

onChange={handleChange}

placeholder="Contact"

className="w-full rounded p-3 text-black"

/>





<textarea

name="description"

value={form.description}

onChange={handleChange}

placeholder="Description"

className="w-full rounded p-3 text-black"

/>





<input

type="file"

accept="image/*"

className="w-full rounded bg-white p-3 text-black"

onChange={(e)=>{

setImage(
e.target.files?.[0] || null
)

}}

/>




<button

disabled={loading}

className="w-full rounded-xl bg-blue-600 p-3 font-bold"

>

{

loading

?

"Updating..."

:

"Update Property"

}


</button>



</form>


</div>


</div>


);


}
