"use client";

import { useState } from "react";
import PropertyForm from "@/components/PropertyForm";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function AddPropertyPage() {

  const [title,setTitle]=useState("");
  const [featured,setFeatured]=useState(false);
  const [location,setLocation]=useState("");
  const [price,setPrice]=useState("");

  const [images,setImages]=useState<File[]>([]);
  const [loading,setLoading]=useState(false);

  const [builder,setBuilder]=useState("");
  const [builderContact,setBuilderContact]=useState("");

  const [bedrooms,setBedrooms]=useState(0);
  const [bathrooms,setBathrooms]=useState(0);

  const [area,setArea]=useState("");
  const [rating,setRating]=useState(0);

  const [description,setDescription]=useState("");

  const [projectName,setProjectName]=useState("");
  const [reraNumber,setReraNumber]=useState("");


  // CATEGORY SYSTEM
  const [purpose,setPurpose]=useState("new");

  const [propertyCondition,setPropertyCondition]=useState("new");

  const [propertyType,setPropertyType]=useState("flat");

  const [parking,setParking]=useState("");

  const [furnished,setFurnished]=useState("");

  // DYNAMIC PROPERTY OPTIONS
  const [plotApproval,setPlotApproval]=useState("");
  const [societyName,setSocietyName]=useState("");
  const [roomSharing,setRoomSharing]=useState("");
  const [acType,setAcType]=useState("");
  const [bathroomType,setBathroomType]=useState("");
  const [kitchenAvailable,setKitchenAvailable]=useState(false);

  const [wifi,setWifi]=useState(false);
  const [cctv,setCctv]=useState(false);
  const [laundry,setLaundry]=useState(false);
  const [cleaning,setCleaning]=useState(false);
  const [security24x7,setSecurity24x7]=useState(false);



async function handleSubmit(e:React.FormEvent){

e.preventDefault();

try{

setLoading(true);


let imageUrls:string[] = [];

if(images.length){
  imageUrls = await Promise.all(
    images.map(file => uploadToCloudinary(file))
  );
}

const docRef=await addDoc(
collection(db,"properties"),
{

title,

featured,

location,

price,


builder,

builderContact,


bedrooms,

bathrooms,


area,

rating,


description,


projectName,

reraNumber,


// CATEGORY DATA

purpose,

propertyCondition,

propertyType,

parking,

furnished,

plotApproval,
societyName,
roomSharing,
acType,
bathroomType,
kitchenAvailable,
wifi,
cctv,
laundry,
cleaning,
security24x7,

image:imageUrls[0] || "",

images:imageUrls,

status:"approved",

createdAt:new Date()

});


console.log("SUCCESS ID:",docRef.id);


alert("Property Added Successfully");


// RESET

setTitle("");

setFeatured(false);

setLocation("");

setPrice("");

setImages([]);

setBuilder("");

setBuilderContact("");

setProjectName("");

setReraNumber("");

setPurpose("new");

setPropertyCondition("new");

setPropertyType("flat");

setParking("");

setFurnished("");


}

catch(error){

console.error("ADD PROPERTY ERROR:",error);

alert("Error adding property");

}

finally{

setLoading(false);

}


}



return(

<main className="min-h-screen bg-slate-50 p-10">


<div className="mx-auto max-w-2xl rounded-3xl bg-white p-8">


<h1 className="mb-6 text-3xl font-bold">
Add Property
</h1>



<form 
onSubmit={handleSubmit}
className="space-y-5"
>


<PropertyForm


title={title}
setTitle={setTitle}

featured={featured}
setFeatured={setFeatured}



location={location}
setLocation={setLocation}



price={price}
setPrice={setPrice}



builder={builder}
setBuilder={setBuilder}



builderContact={builderContact}
setBuilderContact={setBuilderContact}



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



images={images}
setImages={setImages}



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


parking={parking}
setParking={setParking}


furnished={furnished}
setFurnished={setFurnished}

plotApproval={plotApproval}
setPlotApproval={setPlotApproval}

societyName={societyName}
setSocietyName={setSocietyName}

roomSharing={roomSharing}
setRoomSharing={setRoomSharing}

acType={acType}
setAcType={setAcType}

bathroomType={bathroomType}
setBathroomType={setBathroomType}

kitchenAvailable={kitchenAvailable}
setKitchenAvailable={setKitchenAvailable}

wifi={wifi}
setWifi={setWifi}

cctv={cctv}
setCctv={setCctv}

laundry={laundry}
setLaundry={setLaundry}

cleaning={cleaning}
setCleaning={setCleaning}

security24x7={security24x7}
setSecurity24x7={setSecurity24x7}

/>



<button

type="submit"

disabled={loading}

className="w-full rounded-xl bg-green-600 p-3 text-slate-900"

>

{loading ? "Adding..." : "Add Property"}

</button>



</form>


</div>


</main>

)

}
