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



if(purpose){

data=data.filter((p:any)=>

(p.purpose||"")
.toLowerCase()
===purpose.toLowerCase()

);

}



if(type){

const urlType = type.toLowerCase();


data = data.filter((p:any)=>{

const propertyType =
(p.propertyType || "").toLowerCase();

const propertyCategory =
(p.type || "").toLowerCase();


const text = `
${propertyType}
${propertyCategory}
${p.gender || ""}
${p.suitableFor || ""}
${p.roomType || ""}
${p.sharingType || ""}
`
.toLowerCase();



return (

text.includes(urlType)

||

(urlType==="flat" &&
(
propertyType==="flat" ||
propertyType==="apartment"
))

||

(urlType.includes("boys") &&
text.includes("boys"))

||

(urlType.includes("girls") &&
text.includes("girls"))

||

(urlType.includes("pg") &&
text.includes("pg"))

||

(urlType.includes("hostel") &&
text.includes("hostel"))

||

(urlType.includes("plot") &&
text.includes("plot"))

);


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

className="rounded-xl bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"

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