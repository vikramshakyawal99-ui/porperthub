"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

interface Props {
  propertyId: string;
  propertyTitle: string;
  ownerId: string;
}

export default function SiteVisitForm({
  propertyId,
  propertyTitle,
  ownerId,
}: Props) {

  const {user}=useAuth();

  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [date,setDate] = useState("");
  const [time,setTime] = useState("");
  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(false);


  async function handleSubmit(e:React.FormEvent){

    e.preventDefault();

    try{

      setLoading(true);


      // Site Visit Save

      await addDoc(collection(db,"siteVisits"),{

        name,
        phone,
        date,
        time,
        message,

        propertyId,
        propertyTitle,
        ownerId,

        buyerId:user?.uid || "",

        status:"Pending",

        createdAt:serverTimestamp()

      });



      // Owner Notification Create

      await addDoc(collection(db,"notifications"),{

        ownerId,

        buyerId:user?.uid || "",

        title:"New Site Visit Request",

        message:
        `${name} requested a visit for ${propertyTitle}`,

        propertyId,

        propertyTitle,

        read:false,

        createdAt:serverTimestamp()

      });



      alert("Site Visit Booked Successfully ✅");


      setName("");
      setPhone("");
      setDate("");
      setTime("");
      setMessage("");


    }catch(error){

      console.log(error);

      alert("Something went wrong");

    }
    finally{

      setLoading(false);

    }

  }



return (

<div className="mt-12 rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl">


<h2 className="mb-3 text-4xl font-black tracking-tight text-slate-900">
📅 Book a Site Visit
</h2>


<p className="mb-8 text-lg text-slate-500">
Fill the form and our property expert will contact you.
</p>


<form
onSubmit={handleSubmit}
className="space-y-5"
>


<input
placeholder="Your Name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-blue-500 focus:bg-white"
/>


<input
type="tel"
placeholder="Mobile Number"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
required
className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-blue-500 focus:bg-white"
/>


<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
required
className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-blue-500 focus:bg-white"
/>


<select
value={time}
onChange={(e)=>setTime(e.target.value)}
required
className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-blue-500 focus:bg-white"
>

<option value="">
Select Time
</option>

<option>
Morning (9 AM - 12 PM)
</option>

<option>
Afternoon (12 PM - 4 PM)
</option>

<option>
Evening (4 PM - 7 PM)
</option>

</select>



<textarea
placeholder="Message (Optional)"
value={message}
onChange={(e)=>setMessage(e.target.value)}
className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-blue-500 focus:bg-white"
/>



<button
disabled={loading}
className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-black text-white shadow-xl transition hover:scale-[1.02]"
>

{
loading
?"Booking..."
:"Book Free Visit"
}

</button>


</form>


</div>

);

}
