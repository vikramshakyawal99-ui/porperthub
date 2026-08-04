"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

type Props = {
  propertyId: string;
  propertyTitle: string;
  ownerId: string;
  ownerEmail?: string;
  propertyType?: string;
};

export default function LeadForm({
  propertyId,
  propertyTitle,
  ownerId,
  ownerEmail,
  propertyType,
}: Props) {

  const {user}=useAuth();

  const router = useRouter();

  const enquiryTitle =
    propertyType === "pg"
      ? "Book Your Bed"
      : propertyType === "hostel"
      ? "Apply Now"
      : propertyType === "room_rent"
      ? "Contact Owner"
      : "Enquire Now";

  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [email,setEmail] = useState("");
  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(false);

  async function submitLead(e: React.FormEvent){

    e.preventDefault();


    if(!user){

      router.push(`/buyer-login?redirect=/properties/${propertyId}`);

      return;

    }


    try{

      setLoading(true);

      await addDoc(
        collection(db,"leads"),
        {
          propertyId,
          propertyTitle,
          ownerId,
          ownerEmail: ownerEmail || "",

          buyerId:user?.uid || "",
          buyerEmail:user?.email || "",

          customerName:name,
          customerPhone:phone,
          customerEmail:email,

          // CRM compatible fields
          name,
          phone,
          email,

          message,

          status:"New",
          priority:"Hot",

          createdAt:serverTimestamp()
        }
      );

      await addDoc(
        collection(db,"notifications"),
        {
          ownerId,

          buyerId:user?.uid || "",

          title:`📞 ${enquiryTitle}`,
          message:`${name} submitted an enquiry`,
          propertyTitle,
          read:false,
          createdAt:serverTimestamp()
        }
      );

      alert("Lead submitted successfully");

      setName("");
      setPhone("");
      setEmail("");
      setMessage("");

    }catch(error){

      console.log(error);
      alert("Lead failed");

    }finally{

      setLoading(false);

    }

  }

  return(

    <div className="mt-10 rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        {enquiryTitle}
      </h2>

      <form
        onSubmit={submitLead}
        className="space-y-4"
      >        <input
          className="w-full rounded-lg border p-3"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Phone"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
          required
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <textarea
          className="w-full rounded-lg border p-3"
          placeholder="Message"
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          rows={4}
        />        <button
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-bold text-white disabled:opacity-50"
        >
          {
            loading
              ? "Submitting..."
              : propertyType === "pg"
              ? "Book Bed"
              : propertyType === "hostel"
              ? "Apply Now"
              : "Submit Enquiry"
          }
        </button>

      </form>

    </div>

  );

}
