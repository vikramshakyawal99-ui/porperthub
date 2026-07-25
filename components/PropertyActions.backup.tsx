"use client";

import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Props = {
  propertyId: number;
  propertyTitle: string;
  ownerId: string;
};

export default function PropertyActions({
  propertyId,
  propertyTitle,
  ownerId,
}: Props) {

  const [favorite, setFavorite] = useState(false);
  const [compare, setCompare] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");


  useEffect(() => {

    const wishlist =
      JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      ) as number[];

    const compareList =
      JSON.parse(
        localStorage.getItem("compareProperties") || "[]"
      ) as number[];


    setFavorite(
      wishlist.includes(propertyId)
    );

    setCompare(
      compareList.includes(propertyId)
    );

  }, [propertyId]);



  function toggleWishlist() {

    const wishlist =
      JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      ) as number[];


    if (wishlist.includes(propertyId)) {

      const updated =
        wishlist.filter(
          (id) => id !== propertyId
        );

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updated)
      );

      setFavorite(false);


    } else {

      wishlist.push(propertyId);

      localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
      );

      setFavorite(true);

    }

  }



  function toggleCompare() {

    const compareList =
      JSON.parse(
        localStorage.getItem("compareProperties") || "[]"
      ) as number[];


    if(compareList.includes(propertyId)) {

      const updated =
        compareList.filter(
          (id)=>id !== propertyId
        );


      localStorage.setItem(
        "compareProperties",
        JSON.stringify(updated)
      );


      setCompare(false);

      return;

    }


    if(compareList.length >= 3){

      alert(
        "You can compare up to 3 properties only."
      );

      return;

    }


    compareList.push(propertyId);


    localStorage.setItem(
      "compareProperties",
      JSON.stringify(compareList)
    );


    setCompare(true);

  }



  async function submitLead(){

    if(!name || !phone){

      alert(
        "Please enter name and phone"
      );

      return;

    }


    await addDoc(
      collection(db,"leads"),
      {
        name,
        phone,
        propertyId,
        propertyTitle,
        ownerId,
        status:"New",
        createdAt:new Date(),
      }
    );


    alert(
      "✅ Inquiry submitted"
    );


    setName("");
    setPhone("");
    setShowForm(false);

  }



  function shareProperty(){

    navigator.share?.({

      title: propertyTitle,

      text:
        "Check this property",

      url:
        window.location.href

    });

  }



  return (

    <div className="flex flex-wrap gap-4">


      <button
        onClick={()=>setShowForm(!showForm)}
        className="rounded-xl bg-green-600 px-6 py-3 text-white"
      >
        Contact Owner
      </button>



      {
        showForm && (

          <div className="w-full rounded-xl border p-4">

            <input
              placeholder="Your Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="mb-3 w-full rounded border p-2"
            />


            <input
              placeholder="Phone"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              className="mb-3 w-full rounded border p-2"
            />


            <button
              onClick={submitLead}
              className="rounded-xl bg-green-600 px-6 py-3 text-white"
            >
              Submit
            </button>

          </div>

        )
      }



      <button
        onClick={toggleWishlist}
        className={`rounded-xl px-6 py-3 font-semibold ${
          favorite
          ? "bg-red-600 text-white"
          : "border border-red-600 text-red-600"
        }`}
      >
        {
          favorite
          ? "❤️ Remove Wishlist"
          : "🤍 Add Wishlist"
        }

      </button>



      <button
        onClick={toggleCompare}
        className="rounded-xl bg-purple-600 px-6 py-3 text-white"
      >
        {
          compare
          ? "✅ Remove Compare"
          : "⚖️ Add Compare"
        }

      </button>



      <button
        onClick={shareProperty}
        className="rounded-xl bg-gray-800 px-6 py-3 text-white"
      >
        📤 Share
      </button>


    </div>

  );

}
