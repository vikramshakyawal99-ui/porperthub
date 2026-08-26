"use client";

import Image from "next/image";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import LocationPicker from "@/components/LocationPicker";


export default function AddPropertyPage(){

const {user}=useAuth();

const router=useRouter();


const [loading,setLoading]=useState(false);

const [images,setImages]=useState<File[]>([]);

const [previewImages,setPreviewImages]=useState<string[]>([]);


const [locationData,setLocationData]=useState({

latitude:"",
longitude:""

});


const [form,setForm]=useState({

title:"",

propertyType:"flat",

purpose:"new",

location:"",

price:"",

rent:"",

bedrooms:"",

area:"",

contact:"",

description:"",

roomType:"",

sharingType:"",

gender:"",

food:"",

ac:"",

kitchen:"",

amenities:[] as string[],

suitableFor:"",

society:"",

plotSize:"",

parking:"",

furnished:""

});


function handleChange(
e:React.ChangeEvent<
HTMLInputElement |
HTMLTextAreaElement |
HTMLSelectElement
>
){

setForm({

...form,

[e.target.name]:e.target.value

});

}



async function handleSubmit(e:React.FormEvent){

e.preventDefault();


if(!user){

alert("Please login first");

return;

}


setLoading(true);


try{


let imageUrl="";


let uploadedImages:string[]=[];

if(images.length){

uploadedImages = await Promise.all(
images.map(file=>uploadToCloudinary(file))
);

imageUrl = uploadedImages[0];

}



await addDoc(

collection(db,"properties"),

{

...form,

image:imageUrl,

images:uploadedImages,


latitude:locationData.latitude,

longitude:locationData.longitude,

ownerId:user.uid,

ownerEmail:user.email,

status:"approved",

createdAt:serverTimestamp()

}

);



alert("Listing Added Successfully");


router.push("/owner/my-properties");


}

catch(error:any){

alert(error.message);

}


setLoading(false);


}



return (

<div className="min-h-screen bg-[#F4FAF6] px-4 py-10 text-[#102A1A] sm:px-6">

<div className="mx-auto max-w-3xl rounded-3xl border border-[#DCE9DF] bg-white p-6 shadow-[0_20px_60px_rgba(16,42,26,0.10)] sm:p-8">


<h1 className="mb-8 text-3xl font-black text-[#102A1A]">
➕ Add New Listing
</h1>


<form onSubmit={handleSubmit} className="space-y-4">


<input
name="title"
placeholder="Property Title"
value={form.title}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
/>

<div className="rounded-2xl border border-dashed border-[#8BC99A] bg-[#F1FAF3] p-5">
  <div className="mb-4">
    <h2 className="text-lg font-black text-[#102A1A]">
      Property Images
    </h2>

    <p className="mt-1 text-sm text-[#64756A]">
      Upload up to 10 JPG, PNG or WebP images. Maximum 10 MB each.
    </p>
  </div>

  <label
    htmlFor="owner-property-images"
    className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-[#B8D9C0] bg-white px-5 py-6 text-center transition hover:border-[#16A34A] hover:bg-[#F7FCF8]"
  >
    <span className="text-3xl">
      📷
    </span>

    <span className="mt-2 font-extrabold text-[#15803D]">
      Choose Property Images
    </span>

    <span className="mt-1 text-xs text-[#7A897F]">
      First image will be used as the cover
    </span>
  </label>

  <input
    id="owner-property-images"
    type="file"
    accept="image/jpeg,image/png,image/webp,image/avif"
    multiple
    className="sr-only"
    onChange={(event) => {
      const selected = Array.from(
        event.target.files || []
      );

      const allowedTypes = new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
  "image/avif",
      ]);

      if (selected.length > 10) {
        alert(
          "You can upload a maximum of 10 images."
        );
        event.target.value = "";
        return;
      }

      const invalidFile = selected.find(
        (file) =>
          !allowedTypes.has(file.type) ||
          file.size <= 0 ||
          file.size > 10 * 1024 * 1024
      );

      if (invalidFile) {
        alert(
          "Only JPG, PNG or WebP images under 10 MB are allowed."
        );
        event.target.value = "";
        return;
      }

      previewImages.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      setImages(selected);
      setPreviewImages(
        selected.map((file) =>
          URL.createObjectURL(file)
        )
      );
    }}
  />

  {previewImages.length > 0 && (
    <>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-bold text-[#102A1A]">
          {previewImages.length} image
          {previewImages.length === 1 ? "" : "s"} selected
        </span>

        <button
          type="button"
          className="text-sm font-bold text-red-600 hover:text-red-700"
          onClick={() => {
            previewImages.forEach((url) => {
              URL.revokeObjectURL(url);
            });

            setImages([]);
            setPreviewImages([]);
          }}
        >
          Remove all
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        {previewImages.map((imageUrl, index) => (
          <div
            key={imageUrl}
            className="relative overflow-hidden rounded-xl border border-[#DCE9DF] bg-white"
          >
            <Image
              src={imageUrl}
              alt={`Property preview ${index + 1}`}
              width={600}
              height={400}
              className="h-32 w-full object-cover"
            />

            {index === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-[#16A34A] px-2.5 py-1 text-xs font-bold text-white">
                Cover
              </span>
            )}

            <button
              type="button"
              aria-label={`Remove image ${index + 1}`}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm font-bold text-white"
              onClick={() => {
                URL.revokeObjectURL(
                  previewImages[index]
                );

                setImages((current) =>
                  current.filter(
                    (_, itemIndex) =>
                      itemIndex !== index
                  )
                );

                setPreviewImages((current) =>
                  current.filter(
                    (_, itemIndex) =>
                      itemIndex !== index
                  )
                );
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  )}
</div>




<select
name="purpose"
value={form.purpose}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
>

<option value="new">
New
</option>

<option value="rent">
Rent
</option>

<option value="resale">
Resale
</option>

</select>




<select
name="propertyType"
value={form.propertyType}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
>


<option value="flat">
Flat
</option>

<option value="villa">
Villa
</option>

<option value="house">
House
</option>

<option value="plot">
Plot
</option>

<option value="room_rent">
Room Rent
</option>

<option value="shop">
Shop
</option>

<option value="warehouse">
Warehouse
</option>

<option value="office_space">
Office Space
</option>

<option value="showroom">
Showroom
</option>

<option value="commercial_building">
Commercial Building
</option>

<option value="industrial_space">
Industrial Space
</option>

<option value="pg">
PG
</option>

<option value="hostel">
Hostel
</option>


</select>


<select
name="parking"
value={form.parking}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
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


<select
name="furnished"
value={form.furnished}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
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





<input
name="location"
placeholder="Location"
value={form.location}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
/>

<LocationPicker
onLocationSelect={(data)=>{
setLocationData({
latitude:String(data.latitude),
longitude:String(data.longitude)
});
}}
/>

<div className="grid grid-cols-2 gap-4">

<input
readOnly
value={locationData.latitude}
placeholder="Latitude"
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
/>

<input
readOnly
value={locationData.longitude}
placeholder="Longitude"
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
/>

</div>




{
(form.purpose==="rent" ||
form.propertyType==="room_rent" ||
form.propertyType==="pg" ||
form.propertyType==="hostel") ? (

<input
name="rent"
placeholder="Rent"
value={form.rent}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
/>

) : (

<input
name="price"
placeholder="Price"
value={form.price}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
/>

)
}




{
(form.propertyType==="flat" ||
form.propertyType==="villa" ||
form.propertyType==="house") &&

<input
name="bedrooms"
placeholder="Bedrooms"
value={form.bedrooms}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
/>

}




{
form.purpose !== "rent" &&
![
  "pg",
  "hostel",
  "room_rent",
  "plot",
].includes(form.propertyType) && (

<input
name="area"
placeholder="Area / Size"
value={form.area}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
/>

)}




{
form.propertyType==="plot" &&

<>

<input
name="society"
placeholder="Society / JDA"
value={form.society}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
/>


<input
name="plotSize"
placeholder="Plot Size"
value={form.plotSize}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
/>

</>

}





{
(
form.propertyType==="room_rent" ||
form.propertyType==="pg" ||
form.propertyType==="hostel"
)

&&

<>


<select
name="roomType"
value={form.roomType}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
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
name="sharingType"
value={form.sharingType}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
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
name="ac"
value={form.ac}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
>

<option value="">
AC Facility
</option>

<option value="yes">
AC
</option>

<option value="no">
Non AC
</option>

</select>

<select
name="kitchen"
value={form.kitchen}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
>

<option value="">
Kitchen Facility
</option>

<option value="yes">
Kitchen Available
</option>

<option value="no">
No Kitchen
</option>

</select>




<select
name="food"
value={form.food}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
>

<option value="">
Food Facility
</option>

<option value="yes">
Food Available
</option>

<option value="no">
Non Food
</option>

</select>




<select
name="suitableFor"
value={form.suitableFor}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
>

<option value="">
Suitable For
</option>

<option value="boys">
Boys
</option>

<option value="girls">
Girls
</option>

<option value="co_living">
Co-Living
</option>

<option value="anyone">
Anyone
</option>

</select>


</>

}





{
form.propertyType==="flat" &&
form.purpose==="rent" &&

<select
name="suitableFor"
value={form.suitableFor}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
>

<option value="">
Rent For
</option>

<option value="family">
Family
</option>

<option value="boys">
Boys
</option>

<option value="girls">
Girls
</option>

<option value="anyone">
Anyone
</option>

</select>

}





<input
name="contact"
placeholder="Contact Number"
value={form.contact}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
/>



<textarea
name="description"
placeholder="Description"
value={form.description}
onChange={handleChange}
className="w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
/>





<div className="mt-5">

<h3 className="font-bold mb-3">
⭐ Amenities
</h3>

<div className="grid grid-cols-2 gap-3">

{(
form.propertyType === "room_rent"
? [
"WiFi",
"CCTV / Security",
"Parking",
"Power Backup",
"AC",
"Attached Bathroom",
"Kitchen",
"Geyser",
"Bed",
"Wardrobe",
"Study Table",
]
: form.propertyType === "pg"
? [
"WiFi",
"CCTV / Security",
"Food",
"Laundry",
"Cleaning",
"Parking",
"Power Backup",
"AC",
"Geyser",
"Bed",
"Wardrobe",
"Study Table",
]
: form.propertyType === "hostel"
? [
"WiFi",
"CCTV / Security",
"Laundry",
"Cleaning",
"Parking",
"Food / Mess",
"Power Backup",
"Bed",
"Wardrobe",
"Study Table",
"Common Area",
]
: [
"Parking",
"Lift",
"24x7 Security",
"Power Backup",
"Swimming Pool",
"Gym",
"Garden",
"Kids Play Area",
"Sports Court",
"Club House",
"High Speed WiFi",
]
).map((item) => (

<label
key={item}
className="flex items-center gap-2"
>

<input
type="checkbox"
checked={form.amenities.includes(item)}
onChange={(e) => {

setForm({
...form,

amenities: e.target.checked
? [...form.amenities, item]
: form.amenities.filter(
(x: string) => x !== item
),
});

}}
/>

{item}

</label>

))}

</div>

</div>

<button
disabled={loading}
className="w-full bg-[#60A5FA] p-3 rounded font-bold"
>
{loading ? "Adding..." : "Add Listing"}
</button>

</form>


</div>

</div>

);


}