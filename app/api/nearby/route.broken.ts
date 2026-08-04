import { NextResponse } from "next/server";



function calcDistance(
lat1:number,
lng1:number,
lat2:number,
lng2:number
){

const R=6371;

const dLat =
(lat2-lat1)*Math.PI/180;

const dLng =
(lng2-lng1)*Math.PI/180;


const a =
Math.sin(dLat/2)**2 +
Math.cos(lat1*Math.PI/180) *
Math.cos(lat2*Math.PI/180) *
Math.sin(dLng/2)**2;


return (
R *
2 *
Math.atan2(
Math.sqrt(a),
Math.sqrt(1-a)
)
);

}




function scorePlace(
name:string,
type:string
){

let score=0;

const n=name.toLowerCase();



const premium=[

"apollo",
"fortis",
"sms",
"sawai",
"jaipuria",
"amar jain",
"narayana",
"manipal",
"max",

"dps",
"delhi public",
"neerja",
"ryan",
"jayshree",
"mnit",

"world trade",
"gt central",
"central mall"

];



premium.forEach(word=>{

if(n.includes(word))
score+=10;

});




if(type==="hospital"){

if(n.includes("hospital"))
score+=5;

}


if(type==="school"){

if(n.includes("school"))
score+=5;

}



if(type==="college"){

if(n.includes("university"))
score+=5;

if(n.includes("college"))
score+=5;

}



if(type==="mall"){

if(n.includes("mall"))
score+=5;

}


return score;

}






const popular:any={


hospital:[

{
name:"Amar Jain Hospital",
lat:26.872,
lng:75.801
},

{
name:"Jaipuria Hospital",
lat:26.8535,
lng:75.805
},

{
name:"Narayana Multispeciality Hospital",
lat:26.8518,
lng:75.8058
},

{
name:"Fortis Escorts Hospital Jaipur",
lat:26.8748,
lng:75.8105
},

{
name:"SMS Hospital",
lat:26.9115,
lng:75.8065
}

],



school:[

{
name:"Neerja Modi School",
lat:26.8555,
lng:75.7515
},

{
name:"Ryan International School Jaipur",
lat:26.8807,
lng:75.7549
},

{
name:"Jayshree Periwal International School",
lat:26.8615,
lng:75.7205
}

],



college:[

{
name:"MNIT Jaipur",
lat:26.8625,
lng:75.8069
},

{
name:"University of Rajasthan",
lat:26.8887,
lng:75.815
}

],



mall:[

{
name:"GT Central Mall",
lat:26.853,
lng:75.804
},

{
name:"World Trade Park Jaipur",
lat:26.8507,
lng:75.8048
},

{
name:"Mgf Metropolitan Mall",
lat:26.907,
lng:75.795
},

{
name:"Central Mall Jaipur",
lat:26.9005,
lng:75.803
}

]

};async function search(
lat:number,
lng:number,
query:string
){

try{

const url =
`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query+" Jaipur")}&limit=10`;


const res = await fetch(url,{
headers:{
"User-Agent":"PropertyHub"
}
});


const data=await res.json();



return data.map((x:any)=>({

name:x.display_name?.split(",")[0] || query,

address:x.display_name,

lat:Number(x.lat),

lng:Number(x.lon)

}));


}catch(e){

console.log("search error",e);

return [];

}

}






function clean(
items:any[],
lat:number,
lng:number,
type:string
){

const unique=new Map();



items.forEach((x:any)=>{


if(
!x.name ||
!x.lat ||
!x.lng
)
return;



const distance =
calcDistance(
lat,
lng,
x.lat,
x.lng
);



if(distance>10)
return;



const key =
x.name
.toLowerCase()
.replace(
/hospital|school|college|university|mall|jaipur|railway|metro|station/g,
""
)
.trim();



if(!unique.has(key)){

unique.set(key,{

...x,

distance

});

}


});



return Array.from(unique.values())

.sort((a:any,b:any)=>{


const s =
scorePlace(
b.name,
type
)
-
scorePlace(
a.name,
type
);


if(s!==0)
return s;


return a.distance-b.distance;


})



.slice(0,5)

.map((x:any)=>({

name:x.name,

address:x.address || "Jaipur",

lat:x.lat,

lng:x.lng,

distance:Number(
x.distance.toFixed(2)
),

score:
scorePlace(
x.name,
type
)

}));

}








export async function GET(
req:Request
){


const {searchParams}=new URL(req.url);



const lat =
Number(
searchParams.get("lat")
);


const lng =
Number(
searchParams.get("lng")
);



if(
!lat ||
!lng
){

return NextResponse.json(
{
error:"Invalid coordinates"
},
{
status:400
}
);

}




const [

hospitalsSearch,

schoolsSearch,

collegeSearch,

mallSearch

]=await Promise.all([


search(
lat,
lng,
"hospital"
),


search(
lat,
lng,
"school"
),


search(
lat,
lng,
"college university"
),


search(
lat,
lng,
"mall shopping mall"
)


]);





return NextResponse.json({


hospitals:

clean(
[
...popular.hospital,
...hospitalsSearch
],
lat,
lng,
"hospital"
),




schools:

clean(
[
...popular.school,
...schoolsSearch
],
lat,
lng,
"school"
),




colleges:

clean(
[
...popular.college,
...collegeSearch
],
lat,
lng,
"college"
),




malls:

clean(
[
...popular.mall,
...mallSearch
],
lat,
lng,
"mall"
),




railwayStations:
[],



metroStations:
[],



busStations:
[]


});


}
