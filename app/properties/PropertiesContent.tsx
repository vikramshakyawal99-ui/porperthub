"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import useProperties from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import Navbar from "@/components/Navbar";


export default function PropertiesContent(){

const searchParams = useSearchParams();

const {properties,loading}=useProperties();



const [filters,setFilters]=useState({

search:"",
location:"",
bhk:"",
price:"",
rent:"",
sharingType:"",
roomType:"",
ac:"",
food:"",
suitableFor:"",
society:"",
plotSize:"",
parking:"",
furnished:"",
sort:""

});



const [categoryProperties,setCategoryProperties]=useState<any[]>([]);

const [visible,setVisible]=useState(12);



useEffect(()=>{


let data=[...properties];


const purpose=searchParams.get("purpose");

const type=searchParams.get("type");

const builder=searchParams.get("builder");



if (purpose) {
  const requestedPurpose = purpose.toLowerCase().trim();

  data = data.filter((p: any) => {
    const propertyPurpose = (p.purpose || "").toLowerCase().trim();
    const propertyCondition = (p.propertyCondition || "").toLowerCase().trim();

    // New properties
    // New system: purpose = "new"
    // Old records: purpose = "buy" + propertyCondition = "new"
    if (requestedPurpose === "new") {
      return (
        propertyPurpose === "new" ||
        (propertyPurpose === "buy" && propertyCondition === "new")
      );
    }

    // Resale properties
    // New system: purpose = "resale"
    // Old records: propertyCondition = "resale"
    if (requestedPurpose === "resale") {
      return (
        propertyPurpose === "resale" ||
        propertyCondition === "resale"
      );
    }

    // Rental properties
    if (requestedPurpose === "rent") {
      return propertyPurpose === "rent";
    }

    return propertyPurpose === requestedPurpose;
  });
}



if(builder){

const builderName = builder.toLowerCase().trim();

data = data.filter((p:any)=>
  (p.builder || "").toLowerCase().trim() === builderName
);

}

if(type){
const urlType = type.toLowerCase().trim();

data = data.filter((p:any)=>{
const propertyType = (p.propertyType || "").toLowerCase().trim();
const propertyCategory = (p.type || "").toLowerCase().trim();
const propertyPurpose = (p.purpose || "").toLowerCase().trim();
const propertyCondition = (p.propertyCondition || "").toLowerCase().trim();
const gender = (p.gender || "").toLowerCase().trim();
const suitableFor = (p.suitableFor || "").toLowerCase().trim();
const roomType = (p.roomType || "").toLowerCase().trim();

const isNewProperty =
  propertyPurpose === "new" ||
  (propertyPurpose === "buy" && propertyCondition === "new");

const isResaleProperty =
  propertyPurpose === "resale" ||
  propertyCondition === "resale";

const combined = `
${propertyType}
${propertyCategory}
${gender}
${suitableFor}
${roomType}
`.toLowerCase();

switch(urlType){

case "flat":
case "apartment":
  return (
    (
      propertyType === "flat" ||
      propertyType === "apartment" ||
      propertyCategory === "flat" ||
      propertyCategory === "apartment"
    ) &&
    (
      !purpose ||
      (purpose.toLowerCase().trim() === "new" && isNewProperty) ||
      (purpose.toLowerCase().trim() === "resale" && isResaleProperty) ||
      (purpose.toLowerCase().trim() === "rent" && propertyPurpose === "rent")
    )
  );

case "villa":
  return (
    (
      propertyType === "villa" ||
      propertyCategory === "villa"
    ) &&
    (
      !purpose ||
      (purpose.toLowerCase().trim() === "new" && isNewProperty) ||
      (purpose.toLowerCase().trim() === "resale" && isResaleProperty) ||
      (purpose.toLowerCase().trim() === "rent" && propertyPurpose === "rent")
    )
  );

case "resale house":
case "resale_house":
case "resale":
  return (
    propertyType === "resale" ||
    propertyType === "resale_house" ||
    propertyType === "house" ||
    propertyCategory === "resale" ||
    propertyCategory === "resale house" ||
    propertyCategory === "house"
  );

case "flat rent":
  return (
    propertyPurpose === "rent" &&
    (
      propertyType === "flat" ||
      propertyType === "apartment" ||
      propertyCategory === "flat" ||
      propertyCategory === "apartment"
    )
  );

case "house rent":
  return (
    propertyPurpose === "rent" &&
    (
      propertyType === "house" ||
      propertyType === "resale_house" ||
      propertyCategory === "house"
    )
  );

case "shop":
case "warehouse":
case "office space":
case "office_space":
case "showroom":
case "commercial building":
case "commercial_building":
case "industrial space":
case "industrial_space":
  return (
    propertyPurpose === "rent" &&
    (
      propertyType === urlType.replace(/\s+/g, "_") ||
      propertyCategory === urlType.replace(/\s+/g, "_") ||
      propertyType === urlType ||
      propertyCategory === urlType
    )
  );

case "room":
case "room rent":
case "room_rent":
  return (
    propertyType === "room" ||
    propertyType === "room_rent" ||
    propertyCategory === "room" ||
    propertyCategory === "room_rent"
  );

case "pg":
case "boys pg":
case "girls pg":
case "co-living pg":
  if(propertyType !== "pg" && propertyCategory !== "pg"){
    return false;
  }

  if(urlType === "boys pg"){
    return gender === "boys" || combined.includes("boys");
  }

  if(urlType === "girls pg"){
    return gender === "girls" || combined.includes("girls");
  }

  if(urlType === "co-living pg"){
    return (
      suitableFor === "co_living" ||
      suitableFor === "co-living" ||
      combined.includes("co_living") ||
      combined.includes("co-living")
    );
  }

  return true;

case "hostel":
case "boys hostel":
case "girls hostel":
  if(propertyType !== "hostel" && propertyCategory !== "hostel"){
    return false;
  }

  if(urlType === "boys hostel"){
    return gender === "boys" || combined.includes("boys");
  }

  if(urlType === "girls hostel"){
    return gender === "girls" || combined.includes("girls");
  }

  return true;

case "plot":
case "jda approved plot":
case "society plot":
  if(propertyType !== "plot" && propertyCategory !== "plot"){
    return false;
  }

  if(urlType === "jda approved plot"){
    return (
      combined.includes("jda") ||
      combined.includes("approved")
    );
  }

  if(urlType === "society plot"){
    return (
      combined.includes("society")
    );
  }

  return true;

default:
  return (
    propertyType === urlType ||
    propertyCategory === urlType
  );
}
});
}

setCategoryProperties(data);

setVisible(12);



},[properties,searchParams]);







const filteredProperties = categoryProperties.filter((property:any)=>{

const searchMatch=

`

${property.title||""}

${property.location||""}

${property.builder||""}

`

.toLowerCase()

.includes(

filters.search.toLowerCase()

);



const locationMatch=

(property.location||"")
.toLowerCase()
.includes(
filters.location.toLowerCase()
);



const bhkMatch=

filters.bhk===""

?

true

:

String(property.bedrooms||"")
===filters.bhk;




const priceMatch=

filters.price===""

?

true

:

Number(property.price||0)
<=Number(filters.price);





const rentMatch=

filters.rent===""

?

true

:

Number(property.rent||0)
<=Number(filters.rent);





const sharingMatch=

filters.sharingType===""

?

true

:

(property.sharingType||"")
.toLowerCase()
.includes(
filters.sharingType.toLowerCase()
);





const roomMatch=

filters.roomType===""

?

true

:

(property.roomType||"")
.toLowerCase()
.includes(
filters.roomType.toLowerCase()
);





const acMatch=

filters.ac===""

?

true

:

(property.ac||"")
.toLowerCase()
.includes(
filters.ac.toLowerCase()
);




const foodMatch=

filters.food===""

?

true

:

(property.food||"")
.toLowerCase()
.includes(
filters.food.toLowerCase()
);




const suitableMatch=

filters.suitableFor===""

?

true

:

(property.suitableFor||"")
.toLowerCase()
.includes(
filters.suitableFor.toLowerCase()
);




const societyMatch=

filters.society===""

?

true

:

(property.society||"")
.toLowerCase()
.includes(
filters.society.toLowerCase()
);






const furnishedMatch=

filters.furnished===""

?

true

:

(property.furnished||"")
.toLowerCase()
===filters.furnished.toLowerCase();




const parkingMatch=

filters.parking===""

?

true

:

(property.parking||"")
.toLowerCase()
.includes(
filters.parking.toLowerCase()
);




const plotSizeMatch=

filters.plotSize===""

?

true

:

(property.plotSize||"")
.toLowerCase()
.includes(
filters.plotSize.toLowerCase()
);





return(

searchMatch &&

locationMatch &&

bhkMatch &&

priceMatch &&

rentMatch &&

sharingMatch &&

furnishedMatch &&

parkingMatch &&

roomMatch &&

acMatch &&

foodMatch &&

suitableMatch &&

societyMatch &&

plotSizeMatch

);



});





const finalProperties=[...filteredProperties];

switch(filters.sort){

case "price_low":

finalProperties.sort(
(a:any,b:any)=>
Number(a.price||0)-Number(b.price||0)
);

break;

case "price_high":

finalProperties.sort(
(a:any,b:any)=>
Number(b.price||0)-Number(a.price||0)
);

break;

case "newest":

finalProperties.reverse();

break;

case "oldest":

break;

}



if(loading){

return(

<main className="flex min-h-screen items-center justify-center text-2xl font-bold">

Loading properties...

</main>

);

}




return(

<>

<Navbar/>


<main className="min-h-screen bg-slate-50 py-10">


<div className="mx-auto max-w-7xl px-6">


<h1 className="mb-8 text-4xl font-bold text-slate-900">

🏠 Explore Properties

</h1>



<PropertyFilters

type={searchParams.get("type")||""}

onFilterChange={setFilters}

/>



<div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

<p className="text-lg font-bold text-slate-900">

🏠 {finalProperties.length} Properties Found

</p>

</div>



<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">


{
finalProperties.slice(0,visible).map((property:any)=>(

<PropertyCard

key={property.id}

property={property}

/>

))
}



</div>

{

visible<finalProperties.length && (

<div className="mt-10 flex justify-center">

<button

onClick={()=>setVisible(v=>v+12)}

className="rounded-xl bg-[#60A5FA] px-8 py-3 text-white hover:bg-[#3B82F6]"

>

Load More

</button>

</div>

)

}


</div>


</main>


</>

);


}