"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../lib/firebase";

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        setPrice(String(data.price || ""));
        setType(data.propertyType || "");
        setDescription(data.description || "");
      } catch (err) {
        console.log(err);
        alert("Failed to load property");
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id, router]);

  async function saveProperty() {
    const user = auth.currentUser;

    if (!user) {
      alert("Login required");
      return;
    }

    if (!title.trim() || !location.trim() || !price.trim()) {
      alert("Title, location and price are required");
      return;
    }

    try {
      setSaving(true);

      const propertyRef = doc(db, "properties", id);
      const snap = await getDoc(propertyRef);

      if (!snap.exists()) {
        alert("Property not found");
        return;
      }

      const currentData: any = snap.data();

      if (currentData.dealerId !== user.uid) {
        alert("Access denied");
        router.push("/dealer/listings");
        return;
      }

      await updateDoc(propertyRef, {
        title: title.trim(),
        location: location.trim(),
        price: price.trim(),
        propertyType: type,
        description: description.trim(),
        updatedAt: new Date(),
      });

      alert("Property updated successfully");
      router.push("/dealer/listings");
    } catch (err) {
      console.log("Property update error:", err);
      alert("Property update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-[#3B82F6]">
          Edit Property
        </h1>

        <p className="text-gray-500 mt-2">
          Update your property information.
        </p>

        <div className="space-y-5 mt-8">

          <div>
            <label className="text-sm text-gray-500">
              Property Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Location
            </label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Price
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Property Type
            </label>
            <input
              value={type}
              readOnly
              className="w-full border rounded-lg p-3 mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full border rounded-lg p-3 mt-1"
            />
          </div>

          <div className="flex gap-3 pt-3">

            <button
              type="button"
              onClick={() => router.push("/dealer/listings")}
              className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={saveProperty}
              disabled={saving}
              className="flex-1 bg-[#3B82F6] text-white py-3 rounded-xl font-semibold hover:bg-[#60A5FA] disabled:bg-gray-400"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
