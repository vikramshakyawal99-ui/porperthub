"use client";

import { useState } from "react";
import PropertyForm from "@/components/PropertyForm";
import PropertyConfigurationsField, {
  type PropertyConfiguration,
} from "@/components/PropertyConfigurationsField";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import TeamGuard from "@/components/team/TeamGuard";

function TeamPropertyForm({ user }: { user: any }) {

  const [title,setTitle]=useState("");
  const [featured] = useState(false);
  const [location,setLocation]=useState("");
  const [price,setPrice]=useState("");

  const [configurations, setConfigurations] =
    useState<PropertyConfiguration[]>([]);

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

const normalizedConfigurations = configurations
  .filter(
    (item) =>
      item.bhk.trim() &&
      item.priceMin.trim()
  )
  .map((item) => ({
    bhk: Number(item.bhk),
    areaMin: Number(item.areaMin) || 0,
    areaMax:
      Number(item.areaMax) ||
      Number(item.areaMin) ||
      0,
    priceMin: Number(item.priceMin) || 0,
    priceMax:
      Number(item.priceMax) ||
      Number(item.priceMin) ||
      0,
  }))
  .filter(
    (item) =>
      item.bhk > 0 &&
      item.priceMin > 0
  )
  .sort(
    (first, second) =>
      first.priceMin - second.priceMin
  );

const primaryConfiguration =
  normalizedConfigurations[0];

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

featured:false,

location,

price:
primaryConfiguration
  ? String(primaryConfiguration.priceMin)
  : price,

configurations:normalizedConfigurations,

builder,

builderContact,


bedrooms:
primaryConfiguration
  ? primaryConfiguration.bhk
  : bedrooms,

bathrooms,

area:
primaryConfiguration
  ? String(primaryConfiguration.areaMin)
  : area,

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

status:"pending",

source:"propertyhub_team",

addedByUid:user.uid,

addedByEmail:user.email || "",

addedByRole:"team_member",

contactHandlerUid:user.uid,

contactHandlerEmail:user.email || "",

contactHandlerRole:"team_member",

createdAt:new Date()

});


console.log("SUCCESS ID:",docRef.id);


alert("✅ Property submitted for admin approval.");


// RESET

setTitle("");



setLocation("");

setPrice("");
setConfigurations([]);

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

alert("Unable to submit property. Please try again.");

}

finally{

setLoading(false);

}


}



return(

<main className="min-h-screen bg-slate-50 p-10">


<div className="mx-auto max-w-2xl rounded-3xl bg-white p-8">


<div className="mb-6">
<p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
PropertyHub Team
</p>

<h1 className="mt-2 text-3xl font-black text-slate-950">
Add Property
</h1>

<p className="mt-2 text-sm text-slate-500">
Add a PropertyHub listing. It will be sent to admin for approval before going live.
</p>
</div>



<form 
onSubmit={handleSubmit}
className="space-y-5"
>


<PropertyForm


title={title}
setTitle={setTitle}

featured={false}
setFeatured={() => {}}



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





<PropertyConfigurationsField
  value={configurations}
  onChange={setConfigurations}
/>


<button

type="submit"

disabled={loading}

className="w-full rounded-xl bg-green-600 p-3 text-slate-900"

>

{loading ? "Submitting..." : "Submit Property for Approval"}

</button>



</form>


</div>


</main>

)

}


export default function TeamAddPropertyPage() {
  return (
    <TeamGuard>
      {({ user }) => (
        <TeamPropertyForm user={user} />
      )}
    </TeamGuard>
  );
}
