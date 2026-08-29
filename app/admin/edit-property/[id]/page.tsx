"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import PropertyForm from "@/components/PropertyForm";
import LocationPicker from "@/components/LocationPicker";
import PropertyConfigurationsField, {
  type PropertyConfiguration,
} from "@/components/PropertyConfigurationsField";

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

  const [locationData,setLocationData]=useState({
    latitude:"",
    longitude:"",
  });

  const [price,setPrice]=useState("");

  const [configurations, setConfigurations] =
    useState<PropertyConfiguration[]>([]);

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

setLocationData({
  latitude: data.latitude ?? "",
  longitude: data.longitude ?? "",
});

setPrice(data.price || "");

setConfigurations(
  Array.isArray(data.configurations)
    ? data.configurations.map(
        (item: any, index: number) => ({
          id: `saved-${index}-${Date.now()}`,
          bhk: String(item.bhk || ""),
          areaMin: String(item.areaMin || ""),
          areaMax: String(item.areaMax || ""),
          priceMin: String(item.priceMin || ""),
          priceMax: String(item.priceMax || ""),
        })
      )
    : []
);



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

price:
primaryConfiguration
  ? String(primaryConfiguration.priceMin)
  : price,

configurations:normalizedConfigurations,

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


images:uploadedImages,

image:uploadedImages[0] || "",

latitude: locationData.latitude,
longitude: locationData.longitude,

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

<div className="mt-5">
  <LocationPicker
    onLocationSelect={(data)=>{
      setLocationData(data);
    }}
  />

  {(locationData.latitude !== "" || locationData.longitude !== "") && (
    <p className="mt-2 text-sm text-slate-500">
      📍 Saved coordinates: {String(locationData.latitude)}, {String(locationData.longitude)}
    </p>
  )}
</div>







{purpose === "new" &&
  ["flat", "villa", "house"].includes(
    propertyType
  ) && (
    <PropertyConfigurationsField
      value={configurations}
      onChange={setConfigurations}
    />
  )}


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
