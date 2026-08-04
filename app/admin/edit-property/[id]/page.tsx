"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PropertyForm from "@/components/PropertyForm";

export default function EditPropertyPage() {

  const [parking,setParking] = useState("");
  const [furnished,setFurnished] = useState("");

  const { id } = useParams();
  const router = useRouter();

  const [loading,setLoading]=useState(true);

  const [title,setTitle]=useState("");
  const [location,setLocation]=useState("");
  const [price,setPrice]=useState("");

  const [builder,setBuilder]=useState("");
  const [builderContact,setBuilderContact]=useState("");

  const [projectName,setProjectName]=useState("");
  const [reraNumber,setReraNumber]=useState("");

  // CATEGORY SYSTEM
  const [purpose,setPurpose]=useState("buy");
  const [propertyCondition,setPropertyCondition]=useState("new");
  const [propertyType,setPropertyType]=useState("flat");


  const [bedrooms,setBedrooms]=useState(0);
  const [bathrooms,setBathrooms]=useState(0);

  const [area,setArea]=useState("");
  const [rating,setRating]=useState(0);

  const [description,setDescription]=useState("");

  const [images,setImages]=useState<string[]>([]);
  const [newImages,setNewImages]=useState<File[]>([]);



useEffect(()=>{

async function loadProperty(){

const snap=await getDoc(
doc(db,"properties",id as string)
);


if(!snap.exists()){

alert("Property not found");

router.push("/admin/dashboard");

return;

}


const data=snap.data();


setTitle(data.title || "");

setLocation(data.location || "");

setPrice(data.price || "");


setBuilder(data.builder || "");

setBuilderContact(data.builderContact || "");


setProjectName(data.projectName || "");

setReraNumber(data.reraNumber || "");


setPurpose(data.purpose || "buy");

setPropertyCondition(data.propertyCondition || "new");

setPropertyType(data.propertyType || "flat");


setBedrooms(data.bedrooms || 0);

setBathrooms(data.bathrooms || 0);


setArea(data.area || "");

setRating(data.rating || 0);


setDescription(data.description || "");


setImages(data.images || []);


setLoading(false);


}


loadProperty();


},[id,router]);





async function handleSubmit(e:React.FormEvent){

e.preventDefault();


const uploadedImages=[...images];


for(const image of newImages){

const imageRef=ref(
storage,
`properties/${Date.now()}-${image.name}`
);


await uploadBytes(imageRef,image);


const url=await getDownloadURL(imageRef);


uploadedImages.push(url);

}



await updateDoc(
doc(db,"properties",id as string),
{

title,

location,

price,


builder,

builderContact,


projectName,

reraNumber,


purpose,

propertyCondition,

propertyType,


bedrooms,

bathrooms,


area,

rating,


description,


images:uploadedImages,

image:uploadedImages[0] || "",

}

);


alert("✅ Property Updated Successfully");


router.push("/admin/dashboard");


}





if(loading){

return(

<main className="p-10">
Loading...
</main>

)

}





return(

<main className="min-h-screen bg-zinc-950 p-10">


<div className="mx-auto max-w-2xl rounded-3xl bg-zinc-900 p-8 shadow-xl">


<h1 className="mb-6 text-3xl font-bold">
Edit Property
</h1>



<form 
onSubmit={handleSubmit}
className="space-y-5"
>



{images.length>0 && (

<div className="grid grid-cols-3 gap-3">

{
images.map((img,index)=>(

<div key={index}>

<img
src={img}
alt="property"
className="h-24 w-full rounded-lg object-cover"
/>

</div>

))
}

</div>

)}





<input

type="file"

accept="image/*"

multiple

onChange={(e)=>{

setNewImages(
Array.from(e.target.files || [])
)

}}

className="w-full rounded-xl border p-3"

/>





<PropertyForm

parking={parking}
setParking={setParking}

furnished={furnished}
setFurnished={setFurnished}



title={title}
setTitle={setTitle}


location={location}
setLocation={setLocation}


price={price}
setPrice={setPrice}


builder={builder}
setBuilder={setBuilder}


builderContact={builderContact}
setBuilderContact={setBuilderContact}



projectName={projectName}
setProjectName={setProjectName}



reraNumber={reraNumber}
setReraNumber={setReraNumber}




purpose={purpose}
setPurpose={setPurpose}



propertyCondition={propertyCondition}
setPropertyCondition={setPropertyCondition}



propertyType={propertyType}
setPropertyType={setPropertyType}



bedrooms={bedrooms}
setBedrooms={setBedrooms}


bathrooms={bathrooms}
setBathrooms={setBathrooms}


area={area}
setArea={setArea}


rating={rating}
setRating={setRating}


description={description}
setDescription={setDescription}



images={newImages}
setImages={setNewImages}


/>




<button

type="submit"

className="w-full rounded-xl bg-green-600 p-3 text-white"

>

Save Changes

</button>




</form>


</div>


</main>

)

}
