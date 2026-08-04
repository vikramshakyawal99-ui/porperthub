import { NextRequest, NextResponse } from "next/server";
import { popularPlaces } from "@/data/popularPlaces";


function distanceKm(
  lat1:number,
  lon1:number,
  lat2:number,
  lon2:number
){

const R = 6371;

const dLat=(lat2-lat1)*Math.PI/180;
const dLon=(lon2-lon1)*Math.PI/180;

const a =
Math.sin(dLat/2)**2 +
Math.cos(lat1*Math.PI/180) *
Math.cos(lat2*Math.PI/180) *
Math.sin(dLon/2)**2;

return Number((R * 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a))).toFixed(2));

}



const transport = {


railway:[

{
name:"Durgapura Railway Station",
address:"Jaipur",
lat:26.8508,
lng:75.7869,
priority:10
},

{
name:"Gandhinagar Jaipur Railway Station",
address:"Jaipur",
lat:26.8648,
lng:75.7875,
priority:9
},

{
name:"Jaipur Junction Railway Station",
address:"Jaipur",
lat:26.9196,
lng:75.7878,
priority:10
}

],


metro:[

{
name:"Mansarovar Metro Station",
address:"Jaipur Metro",
lat:26.8855,
lng:75.7515,
priority:10
},

{
name:"New Aatish Market Metro Station",
address:"Jaipur Metro",
lat:26.8787,
lng:75.7527,
priority:9
},

{
name:"Civil Lines Metro Station",
address:"Jaipur Metro",
lat:26.9115,
lng:75.7875,
priority:8
}

],


bus:[

{
name:"Sindhi Camp Bus Stand",
address:"Jaipur",
lat:26.9239,
lng:75.7998,
priority:10
},

{
name:"Durgapura Bus Stand",
address:"Jaipur",
lat:26.8510,
lng:75.7860,
priority:9
}

]

};



function prepare(
arr:any[],
lat:number,
lng:number
){

return arr
.map((p)=>({

...p,
distance:distanceKm(
lat,
lng,
p.lat,
p.lng
)

}))
.filter((p)=>p.distance<=10)
.sort((a,b)=>{

if(b.priority!==a.priority)
return b.priority-a.priority;

return a.distance-b.distance;

})
.slice(0,5);

}




export async function GET(
req:NextRequest
){

try{


const {searchParams}=new URL(req.url);


const lat=Number(searchParams.get("lat"));
const lng=Number(searchParams.get("lng"));


if(!lat || !lng){

return NextResponse.json(
{
error:"Latitude longitude missing"
},
{
status:400
}
)

}



let all:any={

hospital:[],
school:[],
college:[],
mall:[],
railway:[],
metro:[],
bus:[]

};



Object.values(popularPlaces).forEach((place:any)=>{


if(place.hospitals)
all.hospital.push(...place.hospitals);


if(place.schools)
all.school.push(...place.schools);


if(place.colleges)
all.college.push(...place.colleges);


if(place.malls)
all.mall.push(...place.malls);



});



all.railway=[
...transport.railway
];


all.metro=[
...transport.metro
];


all.bus=[
...transport.bus
];




// duplicate remove

for(const key of Object.keys(all)){


const unique:any={};


all[key]=all[key].filter((item:any)=>{

const id=item.name.toLowerCase();

if(unique[id])
return false;

unique[id]=true;

return true;

});


all[key]=prepare(
all[key],
lat,
lng
);


}



return NextResponse.json(all);



}
catch(error){

console.log(error);

return NextResponse.json(
{
error:"Server error"
},
{
status:500
}
)


}


}
