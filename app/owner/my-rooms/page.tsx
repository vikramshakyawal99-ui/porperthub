"use client";

import Image from "next/image";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

type Property = {
  id: string;
  title?: string;
  location?: string;
  rent?: string;
  image?: string;
  status?: string;
  propertyType?: string;
  roomType?: string;
  sharingType?: string;
  food?: string;
  gender?: string;
};

export default function MyRoomsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [rooms, setRooms] = useState<Property[]>([]);

  useEffect(() => {
    async function loadRooms() {
      if (!user) return;

      const q = query(
        collection(db, "properties"),
        where("ownerId", "==", user.uid),
        where("propertyType", "==", "room_rent")
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Property[];

      setRooms(data);
    }

    loadRooms();
  }, [user]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this room?")) return;

    await deleteDoc(doc(db, "properties", id));

    setRooms((prev) => prev.filter((item) => item.id !== id));

    alert("Room deleted successfully");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">
        My Rooms
      </h1>

      {rooms.length === 0 ? (
        <p>No Rooms Found</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {rooms.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-700 p-5"
            >
              {item.image && (
                <Image
src={item.image}
alt={item.title || "Property"}
width={600}
height={400}
className="mb-4 h-52 w-full rounded-xl object-cover"
/>
              )}

              <h2 className="text-2xl font-bold">
                {item.title}
              </h2>

              <p>📍 {item.location}</p>

              <p>💰 ₹ {item.rent}/month</p>

              <p>🛏 {item.roomType}</p>

              <p>🛌 {item.sharingType} Sharing</p>

              <p>🍽 Food : {item.food}</p>

              <p>👤 {item.gender}</p>

              <div className="mt-4">
                {item.status === "approved" ? (
                  <span className="rounded bg-green-600 px-3 py-1">
                    Approved
                  </span>
                ) : item.status === "rejected" ? (
                  <span className="rounded bg-red-600 px-3 py-1">
                    Rejected
                  </span>
                ) : (
                  <span className="rounded bg-[#d4a855] px-3 py-1 text-black">
                    Pending
                  </span>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() =>
                    router.push(`/owner/edit-property/${item.id}`)
                  }
                  className="rounded bg-[#60A5FA] px-4 py-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded bg-red-600 px-4 py-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
