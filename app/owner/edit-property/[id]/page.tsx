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
import { useAuth } from "@/components/AuthProvider";


export default function EditPropertyPage(){

const router = useRouter();
const params = useParams();

const {
  user,
  loading: authLoading,
} = useAuth();

const [loading,setLoading]=useState(false);

const [images,setImages]=useState<File[]>([]);

const [existingImages,setExistingImages]=useState<string[]>([]);


const [locationData,setLocationData]=useState({

latitude:"",
longitude:""

});



const [form,setForm]=useState({

title:"",

purpose:"new",

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

if(authLoading){
return;
}

if(!user){
router.replace(
  `/owner-login?redirect=${encodeURIComponent(
    `/owner/edit-property/${String(params.id)}`
  )}`
);
return;
}

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

if(String(data.ownerId || "") !== user.uid){
alert("You are not authorized to edit this property.");
router.replace("/owner/my-properties");
return;
}

setForm({

title:data.title || "",

purpose:data.purpose || "new",

propertyType:
data.propertyType === "room"
  ? "room_rent"
  : data.propertyType || "flat",

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



},[
  params.id,
  router,
  user,
  authLoading,
]);





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

longitude:locationData.longitude,

status:"approved"

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

<div className="min-h-screen bg-[#F4FAF6] px-4 py-10 text-[#102A1A] sm:px-6">


<div className="mx-auto max-w-3xl rounded-3xl border border-[#DCE9DF] bg-white p-6 shadow-[0_20px_60px_rgba(16,42,26,0.10)] sm:p-8">


<h1 className="mb-8 text-3xl font-black text-[#102A1A]">
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

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

/>




<select

name="purpose"

value={form.purpose}

onChange={handleChange}

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

>

<option value="new">
New
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

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

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

value={form.location}

onChange={handleChange}

placeholder="Location"

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

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

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

/>



<input

name="price"

value={form.price}

onChange={handleChange}

placeholder="Price"

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

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

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

/>



<input

name="price"

value={form.price}

onChange={handleChange}

placeholder="Plot Price"

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

/>


</>

}





{
(
form.propertyType==="pg" ||
form.propertyType==="room_rent" ||
form.propertyType==="hostel"
)

&&

<>

<input

name="roomType"

value={form.roomType}

onChange={handleChange}

placeholder="Single / Shared Room"

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

/>




<input

name="sharingType"

value={form.sharingType}

onChange={handleChange}

placeholder="Sharing"

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

/>




<select

name="suitableFor"

value={form.suitableFor}

onChange={handleChange}

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

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

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

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

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

/>




<input

name="rent"

value={form.rent}

onChange={handleChange}

placeholder="Monthly Rent"

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

/>


</>

}




<input

name="contact"

value={form.contact}

onChange={handleChange}

placeholder="Contact"

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

/>





<textarea

name="description"

value={form.description}

onChange={handleChange}

placeholder="Description"

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"

/>






{existingImages.length>0 && (

<div className="rounded-2xl border border-[#DCE9DF] bg-[#F7FBF8] p-4">

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
<span className="absolute left-2 top-2 rounded bg-[#60A5FA] px-2 py-1 text-xs text-white">
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
className="absolute bottom-2 left-2 rounded bg-[#60A5FA] px-2 py-1 text-xs text-white"
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

accept="image/jpeg,image/png,image/webp,image/avif"

multiple

className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] file:mr-4 file:rounded-lg file:border-0 file:bg-[#EAF7EE] file:px-4 file:py-2 file:font-bold file:text-[#15803D]"

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

className="w-full rounded-xl bg-[#16A34A] p-3 font-bold text-white shadow-lg transition hover:bg-[#15803D] disabled:cursor-wait disabled:opacity-60"

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
