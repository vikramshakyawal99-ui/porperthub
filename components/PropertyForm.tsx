"use client";

import SearchableSelect from "./ui/SearchableSelect";

interface PropertyFormProps {

  title:string;
  setTitle:(value:string)=>void;

  location:string;
  setLocation:(value:string)=>void;

  price:string;
  setPrice:(value:string)=>void;

  builder:string;
  setBuilder:(value:string)=>void;

  builderContact:string;
  setBuilderContact:(value:string)=>void;

  bedrooms:number;
  setBedrooms:(value:number)=>void;

  bathrooms:number;
  setBathrooms:(value:number)=>void;

  area:string;
  setArea:(value:string)=>void;

  rating:number;
  setRating:(value:number)=>void;

  description:string;
  setDescription:(value:string)=>void;

  images:File[];
  setImages:(value:File[])=>void;

  projectName:string;
  setProjectName:(value:string)=>void;

  reraNumber:string;
  setReraNumber:(value:string)=>void;


  // NEW SYSTEM
  purpose:string;
  setPurpose:(value:string)=>void;

  propertyCondition:string;
  setPropertyCondition:(value:string)=>void;

  propertyType:string;
  setPropertyType:(value:string)=>void;

  parking:string;
  setParking:(value:string)=>void;

  furnished:string;
  setFurnished:(value:string)=>void;

}


export default function PropertyForm({

title,
setTitle,

location,
setLocation,

price,
setPrice,

builder,
setBuilder,

builderContact,
setBuilderContact,

bedrooms,
setBedrooms,

bathrooms,
setBathrooms,

area,
setArea,

rating,
setRating,

description,
setDescription,

images: _images,
setImages,

projectName,
setProjectName,

reraNumber,
setReraNumber,


purpose,
setPurpose,

propertyCondition,
setPropertyCondition,

propertyType,
setPropertyType,

parking,
setParking,

furnished,
setFurnished,


}:PropertyFormProps){


return (

<div className="space-y-5">


<SearchableSelect
label="Property Title"
value={title}
onChange={setTitle}
options={[
"Luxury 3 BHK Apartment",
"Premium Villa",
"Modern Flat",
"Residential Plot",
"Room",
"PG",
"Hostel"
]}
/>


<SearchableSelect
label="Location"
value={location}
onChange={setLocation}
options={[
"Vaishali Nagar",
"Jagatpura",
"Mansarovar",
"Ajmer Road",
"Tonk Road",
"C-Scheme",
"Malviya Nagar",
"Raja Park"
]}
/>



<SearchableSelect
label="Purpose"
value={purpose}
onChange={setPurpose}
options={[
"buy",
"rent"
]}
/>



<SearchableSelect
label="Property Condition"
value={propertyCondition}
onChange={setPropertyCondition}
options={[
"new",
"resale"
]}
/>



<SearchableSelect
label="Property Type"
value={propertyType}
onChange={setPropertyType}
options={[
"flat",
"villa",
"house",
"plot",
"room",
"pg",
"hostel"
]}
/>


<SearchableSelect
label="Parking"
value={parking}
onChange={setParking}
options={[
"Yes",
"No",
"1 Car",
"2 Cars",
"3 Cars"
]}
/>


<SearchableSelect
label="Furnished Status"
value={furnished}
onChange={setFurnished}
options={[
"Fully Furnished",
"Semi Furnished",
"Unfurnished"
]}
/>



<input
className="w-full rounded-xl border p-3"
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
/>



<SearchableSelect
label="Builder"
value={builder}
onChange={setBuilder}
options={[
"Mahima Group",
"Ashiana Housing",
"Manglam Group",
"Okay Plus",
"Unique Builders"
]}
/>



<input
className="w-full rounded-xl border p-3"
placeholder="Builder Contact"
value={builderContact}
onChange={(e)=>setBuilderContact(e.target.value)}
/>



<input
type="number"
className="w-full rounded-xl border p-3"
placeholder="Bedrooms"
value={bedrooms}
onChange={(e)=>setBedrooms(Number(e.target.value))}
 />



<input
type="number"
className="w-full rounded-xl border p-3"
placeholder="Bathrooms"
value={bathrooms}
onChange={(e)=>setBathrooms(Number(e.target.value))}
 />



<input
className="w-full rounded-xl border p-3"
placeholder="Area"
value={area}
onChange={(e)=>setArea(e.target.value)}
/>



<input
type="number"
className="w-full rounded-xl border p-3"
placeholder="Rating"
value={rating}
onChange={(e)=>setRating(Number(e.target.value))}
 />



<SearchableSelect
label="Project Name"
value={projectName}
onChange={setProjectName}
options={[
"Mahima Panorama",
"Mahima Nirvana",
"Ashiana Amantran",
"Manglam Ananda"
]}
/>



<input
className="w-full rounded-xl border p-3"
placeholder="RERA Number"
value={reraNumber}
onChange={(e)=>setReraNumber(e.target.value)}
/>



<textarea
className="w-full rounded-xl border p-3"
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
/>



<div>

<label className="block mb-2 font-medium">
Property Images
</label>


<input
type="file"
accept="image/*"
multiple
className="w-full rounded-xl border p-3"
onChange={(e)=>{
setImages(Array.from(e.target.files || []))
}}
/>


</div>


</div>

)

}
