"use client";

import { useState } from "react";


type Props = {

type?: string;

onFilterChange:(filters:any)=>void;

};


export default function PropertyFilters({

type="",

onFilterChange

}:Props){



const category = type.toLowerCase();



const isRental =
[
"pg",
"hostel",
"room",
"room_rent"
]
.includes(category);



const isPG =
category==="pg";



const isHostel =
category==="hostel";





const isPlot =
category==="plot";



const [search,setSearch]=useState("");

const [location,setLocation]=useState("");

const [bhk,setBhk]=useState("");

const [price,setPrice]=useState("");

const [rent,setRent]=useState("");

const [sharingType,setSharingType]=useState("");

const [roomType,setRoomType]=useState("");

const [ac,setAc]=useState("");

const [food,setFood]=useState("");

const [suitableFor,setSuitableFor]=useState("");

const [society,setSociety]=useState("");

const [plotSize,setPlotSize]=useState("");

const [parking,setParking]=useState("");

const [furnished,setFurnished]=useState("");

const [sort,setSort]=useState("");




function update(values:any){


onFilterChange({

search,

location,

bhk,

price,

rent,

sharingType,

roomType,

ac,

food,

suitableFor,

society,

plotSize,

parking,

furnished,

sort,

...values

});


}



return (

<div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">


<h2 className="mb-6 text-2xl font-bold text-slate-900">

🔍 Search & Filters

</h2>



<div className="grid gap-4 md:grid-cols-5">



<input

placeholder="Search Property..."

value={search}

onChange={(e)=>{

setSearch(e.target.value);

update({
search:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

/>




<input

placeholder="Location..."

value={location}

onChange={(e)=>{

setLocation(e.target.value);

update({
location:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

/>

<select

value={sort}

onChange={(e)=>{

setSort(e.target.value);

update({
sort:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

>

<option value="">Sort</option>

<option value="price_low">Price Low → High</option>

<option value="price_high">Price High → Low</option>

<option value="newest">Newest First</option>

<option value="oldest">Oldest First</option>

</select>






{!isRental && !isPlot && (

<select

value={bhk}

onChange={(e)=>{

setBhk(e.target.value);

update({
bhk:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

>


<option value="">
All BHK
</option>


<option value="1">
1 BHK
</option>

<option value="2">
2 BHK
</option>

<option value="3">
3 BHK
</option>

<option value="4">
4 BHK
</option>


</select>

)}





{isPlot && (

<>


<input

placeholder="Society / JDA"

value={society}

onChange={(e)=>{

setSociety(e.target.value);

update({
society:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

/>



<input

placeholder="Plot Size"

value={plotSize}

onChange={(e)=>{

setPlotSize(e.target.value);

update({
plotSize:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

/>


</>

)}






{isRental && (

<>


<select

value={roomType}

onChange={(e)=>{

setRoomType(e.target.value);

update({
roomType:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

>


<option value="">
Room Type
</option>


<option value="single">
Single Room
</option>


<option value="shared">
Shared Room
</option>


<option value="private">
Private Room
</option>


</select>





<select

value={sharingType}

onChange={(e)=>{

setSharingType(e.target.value);

update({
sharingType:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

>


<option value="">
Sharing
</option>


<option value="1">
1 Sharing
</option>


<option value="2">
2 Sharing
</option>


<option value="3">
3 Sharing
</option>


<option value="4">
4 Sharing
</option>


</select>





<select

value={ac}

onChange={(e)=>{

setAc(e.target.value);

update({
ac:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

>


<option value="">
AC / Non AC
</option>


<option value="yes">
AC
</option>


<option value="no">
Non AC
</option>


</select>





<select

value={food}

onChange={(e)=>{

setFood(e.target.value);

update({
food:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

>


<option value="">
Food
</option>


<option value="yes">
Food Available
</option>


<option value="no">
Non Food
</option>


</select>





<select

value={suitableFor}

onChange={(e)=>{

setSuitableFor(e.target.value);

update({
suitableFor:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

>


<option value="">
{
isHostel
?
"Hostel Type"
:
isPG
?
"PG For"
:
"Suitable For"
}
</option>


{isHostel && (
<>
<option value="boys">
Boys Hostel
</option>

<option value="girls">
Girls Hostel
</option>
</>
)}


{isPG && (
<>
<option value="boys">
Boys PG
</option>

<option value="girls">
Girls PG
</option>

<option value="family">
Family PG
</option>

<option value="co_living">
Co-Living PG
</option>
</>
)}


{!isHostel && !isPG && (
<>
<option value="boys">
Boys
</option>

<option value="girls">
Girls
</option>

<option value="family">
Family
</option>

<option value="co_living">
Co-Living
</option>

<option value="anyone">
Anyone
</option>
</>
)}


</select>


</>

)}







{!isRental && !isPlot && (

<>

<select
value={furnished}
onChange={(e)=>{

setFurnished(e.target.value);

update({
furnished:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"
>

<option value="">
Furnished Status
</option>

<option value="Fully Furnished">
Fully Furnished
</option>

<option value="Semi Furnished">
Semi Furnished
</option>

<option value="Unfurnished">
Unfurnished
</option>

</select>


<select
value={parking}
onChange={(e)=>{

setParking(e.target.value);

update({
parking:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"
>

<option value="">
Parking
</option>

<option value="Yes">
Yes
</option>

<option value="No">
No
</option>

<option value="1 Car">
1 Car
</option>

<option value="2 Cars">
2 Cars
</option>

<option value="3 Cars">
3 Cars
</option>

</select>

</>

)}

<select

value={isRental ? rent : price}

onChange={(e)=>{


if(isRental){

setRent(e.target.value);

update({
rent:e.target.value
});


}else{


setPrice(e.target.value);

update({
price:e.target.value
});


}


}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

>


<option value="">

{
isRental
?
"All Rent"
:
"All Price"
}

</option>


<option value="5000">
Below ₹5000
</option>


<option value="10000">
₹5000 - ₹10000
</option>


<option value="20000">
Above ₹10000
</option>


</select>






<select

value={sort}

onChange={(e)=>{

setSort(e.target.value);

update({
sort:e.target.value
});

}}

className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-blue-500"

>


<option value="">
Sort By
</option>


<option value="low">
Price Low To High
</option>


<option value="high">
Price High To Low
</option>

<option value="newest">
Newest First
</option>

<option value="oldest">
Oldest First
</option>

</select>



</div>






<button

onClick={()=>{


setSearch("");

setLocation("");

setBhk("");

setPrice("");

setRent("");

setSharingType("");

setRoomType("");

setAc("");

setFood("");

setSuitableFor("");

setSort("");



onFilterChange({

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
sort:""

});


}}

className="mt-6 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"

>

Clear Filters

</button>



</div>


);


}
