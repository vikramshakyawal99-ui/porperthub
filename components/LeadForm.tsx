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
  dealerId?: string;
  ownerEmail?: string;
  propertyType?: string;
};

export default function LeadForm({
  propertyId,
  propertyTitle,
  ownerId,
  dealerId,
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
          dealerId: dealerId || "",
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

          propertyId,

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

    <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl">

      <h2 className="mb-6 text-4xl font-black tracking-tight text-slate-900">
        {enquiryTitle}
      </h2>

      <form
        onSubmit={submitLead}
        className="space-y-4"
      >        <input
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-[#60A5FA] focus:bg-white"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required
        />

        <input
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-[#60A5FA] focus:bg-white"
          placeholder="Phone"
          value={phone}
          onChange={(e)=>setPhone(e.target.value)}
          required
        />

        <input
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-[#60A5FA] focus:bg-white"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <textarea
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-[#60A5FA] focus:bg-white"
          placeholder="Message"
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          rows={4}
        />        <button
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-[#60A5FA] to-[#60A5FA] px-6 py-4 font-black text-white shadow-xl transition hover:scale-[1.02] disabled:opacity-50"
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
