"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

export default function DealerProfile() {
  const [profile, setProfile] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    city: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = auth.currentUser;

        if (!user) {
          setLoading(false);
          return;
        }

        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          const data = snap.data();

          setProfile({
            name: data.name || "",
            business: data.business || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            city: data.city || "",
          });
        }
      } catch (error) {
        console.log("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function saveProfile() {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert("Login required");
        return;
      }

      setSaving(true);

      await updateDoc(doc(db, "users", user.uid), {
        name: profile.name,
        business: profile.business,
        phone: profile.phone,
        city: profile.city,
      });

      setEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.log("Profile update error:", error);
      alert("Profile update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading profile...
      </div>
    );
  }

  const initial = profile.name
    ? profile.name.charAt(0).toUpperCase()
    : "D";

  return (
    <div className="max-w-4xl mx-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#3B82F6]">
          Dealer Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your business information
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-8">

        <div className="flex items-center gap-5">

          <div className="
            w-20 h-20 rounded-full
            bg-[#3B82F6] text-white
            flex items-center justify-center
            text-3xl font-bold
          ">
            {initial}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {profile.name || "Dealer"}
            </h2>

            <p className="text-gray-500">
              Property Dealer
            </p>
          </div>

        </div>

        {editing ? (

          <div className="grid md:grid-cols-2 gap-5 mt-8">

            <div>
              <label className="text-sm text-gray-500">
                Dealer Name
              </label>

              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Business Name
              </label>

              <input
                value={profile.business}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    business: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Mobile Number
              </label>

              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">
                City
              </label>

              <input
                value={profile.city}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    city: e.target.value,
                  })
                }
                className="w-full border rounded-xl p-3 mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-500">
                Email
              </label>

              <input
                value={profile.email}
                disabled
                className="w-full border rounded-xl p-3 mt-1 bg-gray-100 text-gray-500"
              />

              <p className="text-xs text-gray-400 mt-1">
                Email is linked to your Firebase account.
              </p>
            </div>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-5 mt-8">

            <div className="border rounded-xl p-4">
              <p className="text-gray-500">Business Name</p>
              <p className="font-semibold mt-1">
                {profile.business || "Not added"}
              </p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500">Mobile Number</p>
              <p className="font-semibold mt-1">
                {profile.phone || "Not added"}
              </p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500">Email</p>
              <p className="font-semibold mt-1 break-all">
                {profile.email || "Not added"}
              </p>
            </div>

            <div className="border rounded-xl p-4">
              <p className="text-gray-500">City</p>
              <p className="font-semibold mt-1">
                {profile.city || "Not added"}
              </p>
            </div>

          </div>
        )}

        <div className="mt-8 flex gap-3">

          {editing ? (
            <>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-[#3B82F6] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#60A5FA] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                className="bg-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-[#3B82F6] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#60A5FA]"
            >
              Edit Profile
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
