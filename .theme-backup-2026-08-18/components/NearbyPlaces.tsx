"use client";

import { useEffect,useMemo,useState } from "react";


type Place={
name:string;
address?:string;
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


setLoading(true);


const controller = new AbortController();

const timer = setTimeout(()=>{
controller.abort();
},15000);


const res=await fetch(
`/api/nearby?lat=${latitude}&lng=${longitude}`,
{
signal: controller.signal
}
);


clearTimeout(timer);


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
(a,b)=>{

return a.distance - b.distance;

}
);


console.log("NEARBY FRONTEND ALL", all);

setPlaces(all);


const firstCategory =
all.some(p=>p.category==="🏥 Hospital")
? "🏥 Hospital"
: all.length > 0
? all[0].category
: "";

setActive(firstCategory);

setFiltered([]);
setActive("");



}
catch(e){

console.log("Nearby Error:",e);

setPlaces([]);
setFiltered([]);

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
places
.filter(
p=>p.category===cat
)
.slice(0,5)
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

const obj:any={};

buttons.forEach(b=>{

obj[b]=places.filter(
p=>p.category===b
).length;

});


return obj;


},[places]);




return (

<section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">


<h2 className="text-3xl font-black tracking-tight text-slate-900">
📍 Nearby Places
</h2>


<p className="mt-2 text-slate-500">
{location}
</p>



{
loading ?

<p className="mt-5 text-slate-700 font-semibold">
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

className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#60A5FA] hover:bg-white hover:shadow-xl"

>


<div>
{btn}
</div>


<div className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
{counts[btn]} Nearby
</div>


</button>


))

}


</div>







<div className="grid md:grid-cols-3 gap-5 mt-8">


{filtered
.slice(0,15)
.map((p)=>( 


<div
key={`${p.name}-${p.lat}-${p.lng}`}
className="group rounded-3xl border border-slate-200 bg-white p-6 text-slate-800 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
>


<div className="inline-flex rounded-full bg-[#F8FAFC] px-3 py-1 text-sm font-bold text-[#3B82F6]">
{p.category}
</div>


<h3 className="mt-3 text-xl font-extrabold text-slate-900">
{p.name}
</h3>


<p className="mt-2 text-sm text-slate-500">
{p.address}
</p>


<p className="mt-3 inline-flex rounded-full bg-emerald-50 px-4 py-2 font-bold text-emerald-700">
📍 {p.distance} km
</p>


<button

onClick={()=>window.open(
`https://maps.google.com/?q=${p.lat},${p.lng}`,
"_blank"
)}

className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#60A5FA] to-[#60A5FA] px-4 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02]"

>

🗺 Direction

</button>


</div>


))}


</div>





</>


}



</section>


);


}
