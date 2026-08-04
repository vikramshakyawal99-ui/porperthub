"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

type Props = {
  propertyId: string;
  propertyTitle: string;
  ownerId: string;
};

export default function PropertyActions({
  propertyId,
  propertyTitle,
  ownerId,
}: Props) {

  const {user}=useAuth();

  const [favorite,setFavorite] = useState(false);
  const [compare,setCompare] = useState(false);

  const [showForm,setShowForm] = useState(false);

  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [email,setEmail] = useState("");

  const [loading,setLoading] = useState(false);



  useEffect(()=>{

    async function checkWishlist(){

      if(user){

        const wishlistQuery=query(
          collection(db,"wishlist"),
          where("buyerId","==",user.uid),
          where("propertyId","==",propertyId)
        );


        const wishlistSnap=await getDocs(wishlistQuery);


        setFavorite(!wishlistSnap.empty);

      }


      const compareList =
        JSON.parse(
          localStorage.getItem("compareProperties") || "[]"
        ) as string[];


      setCompare(
        compareList.includes(propertyId)
      );

    }


    checkWishlist();


  },[propertyId,user]);


  async function toggleWishlist(){

    if(!user){

      alert("Please login first");
      return;

    }


    const wishlistQuery=query(
      collection(db,"wishlist"),
      where("buyerId","==",user.uid),
      where("propertyId","==",propertyId)
    );


    const snap=await getDocs(wishlistQuery);



    if(!snap.empty){

      await deleteDoc(
        snap.docs[0].ref
      );

      setFavorite(false);

      return;

    }



    await addDoc(
      collection(db,"wishlist"),
      {
        buyerId:user.uid,
        buyerEmail:user.email || "",
        propertyId,
        propertyTitle,
        ownerId,
        createdAt:new Date()
      }
    );


    setFavorite(true);

  }


  function toggleCompare(){

    const compareList =
      JSON.parse(
        localStorage.getItem("compareProperties") || "[]"
      ) as string[];


    if(compareList.includes(propertyId)){

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
        "Maximum 3 properties compare kar sakte hain"
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
        "Name aur mobile number required hai"
      );

      return;

    }


    if(phone.length < 10){

      alert(
        "Valid mobile number dalo"
      );

      return;

    }


    try{

      setLoading(true);


      await addDoc(
        collection(db,"leads"),
        {

          name,

          phone,

          email,

          propertyId,

          propertyTitle,

          ownerId,

          buyerId:user?.uid || "",
          buyerEmail:user?.email || "",

          status:"New",

          createdAt:new Date(),

        }
      );


      alert(
        "✅ Inquiry sent. Owner contact karega."
      );


      setName("");
      setPhone("");
      setEmail("");
      setShowForm(false);


    }
    catch(error){

      console.log(error);

      alert(
        "Something went wrong"
      );

    }
    finally{

      setLoading(false);

    }

  }



  function shareProperty(){

    navigator.share?.({

      title:propertyTitle,

      text:"Check this property",

      url:window.location.href

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

          <div className="w-full rounded-xl border p-5 space-y-3">


            <input
              placeholder="Your Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full rounded border p-3"
            />


            <input
              placeholder="Mobile Number"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              className="w-full rounded border p-3"
            />


            <input
              placeholder="Email (optional)"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full rounded border p-3"
            />


            <button
              onClick={submitLead}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white"
            >

              {
                loading
                ? "Sending..."
                : "Submit"
              }

            </button>


          </div>

        )
      }



      <button
        onClick={toggleWishlist}
        className={`rounded-xl px-6 py-3 ${
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
