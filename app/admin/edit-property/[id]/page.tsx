"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import PropertyForm from "@/components/PropertyForm";

export default function EditPropertyPage() {

  const [parking,setParking] = useState("");
  const [furnished,setFurnished] = useState("");

  // DYNAMIC CATEGORY FIELDS
  const [plotApproval,setPlotApproval] = useState("");
  const [societyName,setSocietyName] = useState("");
  const [roomSharing,setRoomSharing] = useState("");
  const [acType,setAcType] = useState("");
  const [bathroomType,setBathroomType] = useState("");
  const [kitchenAvailable,setKitchenAvailable] = useState(false);

  const [wifi,setWifi] = useState(false);
  const [cctv,setCctv] = useState(false);
  const [laundry,setLaundry] = useState(false);
  const [cleaning,setCleaning] = useState(false);
  const [security24x7,setSecurity24x7] = useState(false);

  const { id } = useParams();
  const router = useRouter();

  const [loading,setLoading]=useState(true);

  const [title,setTitle]=useState("");
  const [featured,setFeatured]=useState(false);
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

setFeatured(data.featured === true);

setLocation(data.location || "");

setPrice(data.price || "");


setBuilder(data.builder || "");

setBuilderContact(data.builderContact || "");


setProjectName(data.projectName || "");

setReraNumber(data.reraNumber || "");


setPurpose(data.purpose || "buy");

setPropertyCondition(data.propertyCondition || "new");

setPropertyType(data.propertyType || "flat");

setParking(data.parking || "");
setFurnished(data.furnished || "");

setPlotApproval(data.plotApproval || "");
setSocietyName(data.societyName || "");
setRoomSharing(data.roomSharing || "");
setAcType(data.acType || "");
setBathroomType(data.bathroomType || "");
setKitchenAvailable(data.kitchenAvailable || false);

setWifi(data.wifi || false);
setCctv(data.cctv || false);
setLaundry(data.laundry || false);
setCleaning(data.cleaning || false);
setSecurity24x7(data.security24x7 || false);


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

if(newImages.length){
  const newUploadedImages = await Promise.all(
    newImages.map(file => uploadToCloudinary(file))
  );

  uploadedImages.push(...newUploadedImages);
}

await updateDoc(
doc(db,"properties",id as string),
{

title,

featured,

location,

price,


builder,

builderContact,


projectName,

reraNumber,


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

<main className="min-h-screen bg-slate-50 p-10">


<div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl">


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

<Image
src={img}
alt="property"
width={96}
height={96}
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

featured={featured}
setFeatured={setFeatured}

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

className="w-full rounded-xl bg-green-600 p-3 text-slate-900"

>

Save Changes

</button>




</form>


</div>


</main>

)

}
