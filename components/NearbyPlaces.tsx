"use client";

import { useEffect,useMemo,useState } from "react";


type Place={
name:string;
lat:number;
lng:number;
distance:number;
priority?:number;
category:string;
};


type Props={
location:string;
latitude:number;
longitude:number;
};


export default function NearbyPlaces({
location,
latitude,
longitude
}:Props){


const [places,setPlaces]=useState<Place[]>([]);
const [filtered,setFiltered]=useState<Place[]>([]);
const [active,setActive]=useState("");
const [loading,setLoading]=useState(true);



useEffect(()=>{


async function load(){

try{

const res=await fetch(
`/api/nearby?lat=${latitude}&lng=${longitude}`
);


const data=await res.json();



const all:Place[]=[


...(data.hospital||[]).map((p:any)=>({
...p,
category:"🏥 Hospital"
})),



...(data.school||[]).map((p:any)=>({
...p,
category:"🏫 School"
})),


...(data.college||[]).map((p:any)=>({
...p,
category:"🎓 College"
})),


...(data.mall||[]).map((p:any)=>({
...p,
category:"🛒 Mall"
})),


...(data.railway||[]).map((p:any)=>({
...p,
category:"🚆 Railway Station"
})),


...(data.metro||[]).map((p:any)=>({
...p,
category:"🚇 Metro Station"
})),


...(data.bus||[]).map((p:any)=>({
...p,
category:"🚌 Bus Stand"
}))



];



all.sort(
(a,b)=>a.distance-b.distance
);


setPlaces(all);


}
catch(e){
console.log(e);
}
finally{
setLoading(false);
}


}


load();


},[latitude,longitude]);





function filter(cat:string){


if(active===cat){

setActive("");
setFiltered([]);

return;

}


setActive(cat);

setFiltered(
places.filter(
(p)=>p.category===cat
)
);


}




const buttons=[
"🏥 Hospital",
"🏫 School",
"🎓 College",
"🛒 Mall",
"🚆 Railway Station",
"🚇 Metro Station",
"🚌 Bus Stand"
];



const counts=useMemo(()=>{

let obj:any={};

buttons.forEach(b=>{
obj[b]=places.filter(
p=>p.category===b
).length;
});


return obj;


},[places]);




return (

<section className="mt-10 rounded-3xl bg-zinc-900 p-6">


<h2 className="text-3xl font-bold text-white">
📍 Nearby Places
</h2>


<p className="text-gray-400 mt-2">
{location}
</p>



{
loading?

<p className="text-white mt-5">
Loading...
</p>


:

<>


<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">


{
buttons.map(btn=>(


<button
key={btn}
onClick={()=>filter(btn)}
className="bg-zinc-800 text-white rounded-xl p-4"
>


<div>
{btn}
</div>


<div className="text-green-400 text-sm mt-2">
{counts[btn]} Nearby
</div>


</button>


))

}


</div>




{
active &&


<div className="grid md:grid-cols-3 gap-5 mt-8">


{
filtered.map((p,i)=>(


<div
key={i}
className="bg-zinc-800 rounded-xl p-5 text-white"
>


<div className="text-blue-400">
{p.category}
</div>


<h3 className="font-bold text-lg mt-2">
{p.name}
</h3>


<p className="text-green-400 mt-2">
📍 {p.distance} km
</p>


<button

onClick={()=>window.open(
`https://maps.google.com/?q=${p.lat},${p.lng}`,
"_blank"
)}

className="mt-4 bg-blue-600 rounded-lg px-4 py-2 w-full"

>

🗺 Direction

</button>


</div>


))
}



</div>


}



</>

}


</section>


);


}
