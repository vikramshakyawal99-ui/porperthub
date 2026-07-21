"use client";

import { useState } from "react";
import PropertyForm from "@/components/PropertyForm";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function AddPropertyPage() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [builder, setBuilder] = useState("");
  const [builderContact, setBuilderContact] = useState("");
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [area, setArea] = useState("");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [projectName, setProjectName] = useState("");
  const [reraNumber, setReraNumber] = useState("");
  const [propertyType, setPropertyType] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      console.log('START SUBMIT', images.length);

      const imageUrls: string[] = [];

      for (const image of images) {
        const imageRef = ref(
          storage,
          `properties/${Date.now()}-${image.name}`
        );

        console.log("Uploading:", image.name);

        await uploadBytes(imageRef, image);

        console.log("Upload done:", image.name);

        console.log("Getting URL:", image.name);

        const url = await getDownloadURL(imageRef);

        console.log("URL done:", url);
        imageUrls.push(url);
      }



      

      console.log('FIRESTORE START');
      await addDoc(collection(db, "properties"), {
        title,
        location,
        price,
        builder,
        builderContact,
        bedrooms,
        bathrooms,
        area,
        rating,
        description,
        projectName,
        reraNumber,
        propertyType,
        image: imageUrls[0] || "",
        images: imageUrls,
        createdAt: new Date(),
      });

      console.log('SUCCESS');
      alert("✅ Property Added Successfully!");

      setTitle("");
      setLocation("");
      setPrice("");
      setImages([]);
      setBuilderContact("");
      setProjectName("");
      setReraNumber("");
      setPropertyType("");
    } catch (error) {
      console.error("Firebase Error:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(String(error));
      }
      alert("❌ Error adding property");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-10">
      <div className="mx-auto max-w-2xl rounded-3xl bg-zinc-900 p-8 shadow-xl">
        <h1 className="mb-6 text-3xl font-bold">
          Add Property
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <PropertyForm
            title={title}
            setTitle={setTitle}
            location={location}
            setLocation={setLocation}
            price={price}
            setPrice={setPrice}
            builder={builder}
            setBuilder={setBuilder}
            builderContact={builderContact}
            setBuilderContact={setBuilderContact}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            bathrooms={bathrooms}
            setBathrooms={setBathrooms}
            area={area}
            setArea={setArea}
            rating={rating}
            setRating={setRating}
            description={description}
            setDescription={setDescription}

            images={images}
            setImages={setImages}

            projectName={projectName}
            setProjectName={setProjectName}

            reraNumber={reraNumber}
            setReraNumber={setReraNumber}

            propertyType={propertyType}
            setPropertyType={setPropertyType}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 p-3 text-white"
          >
            {loading ? "Adding..." : "Add Property"}
          </button>

        </form>
      </div>
    </main>
  );
}
