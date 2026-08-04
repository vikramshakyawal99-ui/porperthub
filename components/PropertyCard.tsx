"use client";

import Image from "next/image";
import Link from "next/link";
import { optimizeImage } from "@/lib/image";

interface Property {

  id:string | number;

  title?:string;
  location?:string;

  price?:string | number;
  rent?:string | number;

  image?:string;
  images?:string[];

  bedrooms?:string | number;
  bathrooms?:string | number;

  area?:string;

  propertyType?:string;

  ac?:string;
  food?:string;

  suitableFor?:string;
  gender?:string;

  sharingType?:string;
  roomType?:string;

}


interface PropertyCardProps {
  property:Property;
}


export default function PropertyCard({
  property
}:PropertyCardProps){


const image = optimizeImage(
property.images?.[0] ||
property.image ||
"/placeholder.jpg"
);


const isRental =
property.propertyType==="rent" ||
property.propertyType==="pg" ||
property.propertyType==="hostel" ||
property.propertyType==="room_rent";


return (

<div className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl">


<div className="relative h-64">

<Image

src={image}

alt={property.title || "Property"}

fill

sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"

className="object-cover"

/>

</div>



<div className="p-5">


<h3 className="text-xl font-bold text-gray-900">

{property.title || "Untitled Property"}

</h3>



<p className="mt-2 text-gray-600">

📍 {property.location || "Location not available"}

</p>



<p className="mt-3 text-2xl font-bold text-blue-600">

₹ {isRental ? property.rent || "N/A" : property.price || "N/A"}

</p>




<div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-700">


{property.bedrooms && (
<span>
🛏 {property.bedrooms} Beds
</span>
)}


{property.bathrooms && (
<span>
🚿 {property.bathrooms} Baths
</span>
)}


{property.area && (
<span>
📐 {property.area}
</span>
)}


{property.roomType && (
<span>
🛌 {property.roomType}
</span>
)}


{property.sharingType && (
<span>
👥 {property.sharingType} Sharing
</span>
)}


</div>




{isRental && (

<div className="mt-4 flex flex-wrap gap-2 text-sm">


{property.ac && (

<span className="rounded bg-gray-200 px-3 py-1">

❄ {property.ac==="yes" ? "AC" : "Non AC"}

</span>

)}



{property.food && (

<span className="rounded bg-gray-200 px-3 py-1">

🍛 {property.food==="yes" ? "Food Available" : "Non Food"}

</span>

)}



{(property.suitableFor || property.gender) && (

<span className="rounded bg-gray-200 px-3 py-1">

{
(property.suitableFor || property.gender)==="family"
?
"👨‍👩‍👧 Family Allowed"
:
(property.suitableFor || property.gender)==="boys"
?
"👦 Boys"
:
(property.suitableFor || property.gender)==="girls"
?
"👧 Girls"
:
(property.suitableFor || property.gender)==="co_living"
?
"🤝 Co-Living"
:
"👤 Anyone"
}

</span>

)}



</div>

)}




<Link

href={`/properties/${property.id}`}

className="mt-5 block rounded-lg bg-blue-600 py-3 text-center font-semibold text-white"

>

View Details

</Link>


</div>


</div>


);


}
