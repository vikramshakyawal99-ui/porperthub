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
society:"",
plotSize:"",
sort:""

});



const [categoryProperties,setCategoryProperties]=useState<any[]>([]);



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

const urlType=type.toLowerCase();


data=data.filter((p:any)=>{


const propertyType=
(p.propertyType||"").toLowerCase();


const propertyCategory=
(p.type||"").toLowerCase();



return(

propertyType===urlType ||

propertyCategory===urlType ||


(urlType==="flat" &&
(
propertyType==="flat" ||
propertyType==="apartment"
)) ||



(urlType==="plot" &&
propertyType.includes("plot")
) ||



(urlType==="pg" &&
propertyType.includes("pg")
) ||



(urlType==="hostel" &&
propertyType.includes("hostel")
) ||



(urlType==="room" &&
propertyType.includes("room")
) ||



(urlType==="resale" &&
propertyType.includes("resale")
)


);


});

}


setCategoryProperties(data);



},[properties,searchParams]);





const filteredProperties=

categoryProperties.filter((property:any)=>{


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

roomMatch &&

societyMatch &&

plotSizeMatch

);



});





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


<main className="min-h-screen bg-zinc-950 py-10">


<div className="mx-auto max-w-7xl px-6">


<h1 className="mb-8 text-4xl font-bold text-white">

🏠 Explore Properties

</h1>



<PropertyFilters

type={searchParams.get("type")||""}

onFilterChange={setFilters}

/>



<div className="mb-8 rounded-xl bg-zinc-900 p-5">

<p className="text-lg font-bold text-white">

🏠 {filteredProperties.length} Properties Found

</p>

</div>



<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">


{
filteredProperties.map((property:any)=>(

<PropertyCard

key={property.id}

property={property}

/>

))
}


</div>


</div>


</main>


</>

);


}
