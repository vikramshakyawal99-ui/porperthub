import { NextResponse } from "next/server";

import { hospitals } from "@/data/hospitals";
import { schools } from "@/data/schools";
import { colleges } from "@/data/colleges";
import { malls } from "@/data/malls";
import { metro } from "@/data/metro";
import { railway } from "@/data/railway";
import { busStations } from "@/data/busStations";


function distanceKm(
 lat1:number,
 lng1:number,
 lat2:number,
 lng2:number
){

const R=6371;

const dLat=(lat2-lat1)*Math.PI/180;
const dLng=(lng2-lng1)*Math.PI/180;

const a=
Math.sin(dLat/2)**2+
Math.cos(lat1*Math.PI/180)*
Math.cos(lat2*Math.PI/180)*
Math.sin(dLng/2)**2;

return Number(
(R*2*Math.atan2(
Math.sqrt(a),
Math.sqrt(1-a)
)).toFixed(2)
);

}



function nearest(
list:any[],
lat:number,
lng:number
){

return list
.map((p:any)=>({
 ...p,
 distance:distanceKm(
  lat,
  lng,
  Number(p.lat),
  Number(p.lng)
 )
}))
.filter((p:any)=>p.distance<=10)
.sort((a:any,b:any)=>{

const scoreA =
(a.priority || 1) * 2 - a.distance;

const scoreB =
(b.priority || 1) * 2 - b.distance;

return scoreB - scoreA;

})
.slice(0,5);

}



export async function GET(req:Request){

try{

const {searchParams}=new URL(req.url);

const lat=Number(searchParams.get("lat"));
const lng=Number(searchParams.get("lng"));


return NextResponse.json({

hospital:nearest(
 hospitals,
 lat,
 lng
),

school:nearest(
 schools,
 lat,
 lng
),

college:nearest(
 colleges,
 lat,
 lng
),

mall:nearest(
 malls,
 lat,
 lng
),

metro:nearest(
 metro,
 lat,
 lng
),

railway:nearest(
 railway,
 lat,
 lng
),

bus:nearest(
 busStations,
 lat,
 lng
)

});


}catch(e:any){

return NextResponse.json({
error:e.message
},{
status:500
});

}

}
