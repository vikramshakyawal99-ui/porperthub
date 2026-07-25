"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useRouter, useParams } from "next/navigation";
import LocationPicker from "@/components/LocationPicker";

export default function EditPropertyPage() {

  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const [locationData, setLocationData] = useState({
    latitude: "",
    longitude: "",
  });

  const [form, setForm] = useState({
    title: "",
    type: "property_sale",

    roomType: "",
    sharingType: "",
    food: "",
    bathroom: "",
    ac: "",

    location: "",
    price: "",
    bedrooms: "",
    area: "",
    contact: "",
    description: "",

    image: "",
  });

  useEffect(() => {
    async function loadProperty() {

      const snap = await getDoc(
        doc(db, "properties", params.id as string)
      );

      if (!snap.exists()) {
        alert("Property not found");
        router.push("/owner/my-properties");
        return;
      }

      const data: any = snap.data();

      setForm({
        title: data.title || "",
        type: data.type || "property_sale",

        roomType: data.roomType || "",
        sharingType: data.sharingType || "",
        food: data.food || "",
        bathroom: data.bathroom || "",
        ac: data.ac || "",

        location: data.location || "",
        price: data.price || "",
        bedrooms: data.bedrooms || "",
        area: data.area || "",
        contact: data.contact || "",
        description: data.description || "",

        image: data.image || "",
      });

      setLocationData({
        latitude: data.latitude || "",
        longitude: data.longitude || "",
      });

    }

    loadProperty();

  }, [params.id, router]);

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }


async function handleSubmit(e: React.FormEvent) {

  e.preventDefault();

  setLoading(true);

  try {

    let imageUrl = form.image;

    if (image) {

      imageUrl = await uploadToCloudinary(image);

    }

    await updateDoc(

      doc(db, "properties", params.id as string),

      {

        ...form,

        image: imageUrl,

        latitude: locationData.latitude,

        longitude: locationData.longitude,

      }

    );

    alert("✅ Property Updated Successfully");

    router.push("/owner/my-properties");

  } catch (error: any) {

    alert(error.message);

  }

  setLoading(false);

}

return (

<div className="min-h-screen bg-zinc-950 text-white p-10">

<div className="max-w-3xl mx-auto bg-zinc-900 p-8 rounded-2xl">

<h1 className="text-3xl font-bold mb-6">

✏️ Edit Property

</h1>

<form onSubmit={handleSubmit} className="space-y-4">

<input
name="title"
value={form.title}
onChange={handleChange}
placeholder="Property Title"
className="w-full p-3 rounded text-black"
required
/>

<select
name="type"
value={form.type}
onChange={handleChange}
className="w-full p-3 rounded text-black"
>

<option value="property_sale">New Property Sale</option>
<option value="property_rent">Property Rent</option>
<option value="resale">Resale Property</option>
<option value="hostel">Hostel</option>
<option value="pg_boys">Boys PG</option>
<option value="pg_girls">Girls PG</option>
<option value="room_rent">Room Rent</option>

</select>

<input
name="location"
value={form.location}
onChange={handleChange}
placeholder="Location"
className="w-full p-3 rounded text-black"
/>

<LocationPicker
onLocationSelect={(data)=>setLocationData(data)}
/>

<input
name="price"
value={form.price}
onChange={handleChange}
placeholder="Price"
className="w-full p-3 rounded text-black"
/>

<input
name="bedrooms"
value={form.bedrooms}
onChange={handleChange}
placeholder="Bedrooms"
className="w-full p-3 rounded text-black"
/>

<input
name="area"
value={form.area}
onChange={handleChange}
placeholder="Area"
className="w-full p-3 rounded text-black"
/>

<input
name="contact"
value={form.contact}
onChange={handleChange}
placeholder="Contact"
className="w-full p-3 rounded text-black"
/>

<textarea
name="description"
value={form.description}
onChange={handleChange}
placeholder="Description"
className="w-full p-3 rounded text-black"
/>

<input
type="file"
accept="image/*"
className="w-full p-3 rounded text-black bg-white"
onChange={(e)=>{
if(e.target.files){
setImage(e.target.files[0]);
}
}}
/>


<button
disabled={loading}
className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl"
>
{loading ? "Updating..." : "Update Property"}
</button>

</form>

</div>

</div>

);

}
