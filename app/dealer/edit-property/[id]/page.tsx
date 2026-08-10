"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../lib/firebase";

export default function EditPropertyPage() {

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {

    async function loadProperty() {

      const user = auth.currentUser;

      if (!user) {
        router.push("/dealer-login");
        return;
      }

      try {

        const snap = await getDoc(doc(db, "properties", id));

        if (!snap.exists()) {
          alert("Property not found");
          router.push("/dealer/listings");
          return;
        }

        const data: any = snap.data();

        if (data.dealerId !== user.uid) {
          alert("Access denied");
          router.push("/dealer/listings");
          return;
        }

        setTitle(data.title || "");
        setLocation(data.location || "");
        setPrice(data.price || "");
        setType(data.propertyType || "");
        setDescription(data.description || "");

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    }

    loadProperty();

  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-zinc-100 p-8">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-blue-700">
          Edit Property
        </h1>

        <p className="text-gray-500 mt-2">
          Property loaded successfully.
        </p>

        <div className="space-y-4 mt-8">

          <input
            value={title}
            readOnly
            className="w-full border rounded-lg p-3"
          />

          <input
            value={location}
            readOnly
            className="w-full border rounded-lg p-3"
          />

          <input
            value={price}
            readOnly
            className="w-full border rounded-lg p-3"
          />

          <input
            value={type}
            readOnly
            className="w-full border rounded-lg p-3"
          />

          <textarea
            value={description}
            readOnly
            rows={5}
            className="w-full border rounded-lg p-3"
          />

          <button
            disabled
            className="w-full bg-gray-400 text-white py-3 rounded-xl font-semibold cursor-not-allowed"
          >
            Update Property (Part 2)
          </button>

        </div>

      </div>

    </div>

  );

}
