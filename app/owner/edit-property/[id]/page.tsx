"use client";

import Image from "next/image";

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

const [images,setImages]=useState<File[]>([]);

const [existingImages,setExistingImages]=useState<string[]>([]);


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

suitableFor:"",

food:"",

ac:"",

kitchen:"",

amenities:[] as string[],

rent:"",

image:"",

images:[] as string[]

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

suitableFor:data.suitableFor || "",

food:data.food || "",

ac:data.ac || "",

kitchen:data.kitchen || "",

amenities:data.amenities || [],

rent:data.rent || "",

image:data.image || "",

images:data.images || (data.image ? [data.image] : [])

});

setExistingImages(
data.images || (data.image ? [data.image] : [])
);



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



let uploadedImages:string[]=[];

if(images.length){

uploadedImages = await Promise.all(
images.map(file=>uploadToCloudinary(file))
);

imageUrl = uploadedImages[0];

}



await updateDoc(

doc(
db,
"properties",
params.id as string
),

{

...form,

image:imageUrl || form.image,

images:[
...existingImages,
...uploadedImages
],

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
Villa
</option>

<option value="house">
House
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
form.propertyType==="villa" ||
form.propertyType==="house"
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




<select

name="suitableFor"

value={form.suitableFor}

onChange={handleChange}

className="w-full rounded p-3 text-black"

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

<option value="co_living">
Co-Living
</option>

<option value="anyone">
Anyone
</option>

</select>




<select

name="kitchen"

value={form.kitchen}

onChange={handleChange}

className="w-full rounded p-3 text-black"

>

<option value="">
Kitchen Facility
</option>

<option value="yes">
Kitchen Available
</option>

<option value="no">
No Kitchen
</option>

</select>


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






{existingImages.length>0 && (

<div className="rounded-xl border border-zinc-700 p-4">

<h3 className="mb-4 text-lg font-bold">
Existing Images
</h3>

<div className="grid grid-cols-2 gap-4 md:grid-cols-4">

{existingImages.map((img,index)=>(

<div key={index} className="relative">

<Image
src={img}
alt={""}
width={600}
height={400}
className="h-32 w-full rounded-lg object-cover"
/>

{index===0 && (
<span className="absolute left-2 top-2 rounded bg-blue-600 px-2 py-1 text-xs text-white">
Cover
</span>
)}

<button
type="button"
onClick={()=>
setExistingImages(
existingImages.filter((_,i)=>i!==index)
)
}
className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
>
✕
</button>

{index !== 0 && (

<button
type="button"
onClick={()=>{
const updated=[...existingImages];
const selected=updated.splice(index,1)[0];
updated.unshift(selected);
setExistingImages(updated);
}}
className="absolute bottom-2 left-2 rounded bg-blue-600 px-2 py-1 text-xs text-white"
>
⭐ Make Cover
</button>

)}

</div>

))}

</div>

</div>

)}


<input

type="file"

accept="image/*"

multiple

className="w-full rounded bg-white p-3 text-black"

onChange={(e)=>{

if(e.target.files){
setImages(Array.from(e.target.files));
}

}}

/>






<div className="mt-5">

<h3 className="font-bold mb-3">
⭐ Premium Amenities
</h3>


<div className="grid grid-cols-2 gap-3">

{[
"Food",
"AC",
"WiFi",
"CCTV",
"Washing Machine",
"Parking",
"Garden",
"Terrace",
"Modular Kitchen",
"Lift",
"Power Backup"
].map((item)=>(

<label key={item} className="flex gap-2">

<input

type="checkbox"

checked={form.amenities?.includes(item)}

onChange={(e)=>{

setForm({

...form,

amenities:e.target.checked

?

[...(form.amenities || []),item]

:

form.amenities.filter((x:string)=>x!==item)

})

}}

/>

{item}

</label>

))}

</div>

</div>

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
