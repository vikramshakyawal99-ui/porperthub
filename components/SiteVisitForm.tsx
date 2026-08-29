"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

interface Props {
  propertyId: string;
  propertyTitle: string;
  ownerId: string;
  dealerId?: string;
}

export default function SiteVisitForm({
  propertyId,
  propertyTitle,
  ownerId,
  dealerId,
}: Props) {

  const {user}=useAuth();
  const router = useRouter();

  const [name,setName] = useState("");
  const [phone,setPhone] = useState("");
  const [date,setDate] = useState("");
  const [time,setTime] = useState("");
  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const buyerUid = user.uid;

    const params =
      new URLSearchParams(
        window.location.search
      );

    if (
      params.get("resumeSiteVisit") !== "1"
    ) {
      return;
    }

    const raw =
      sessionStorage.getItem(
        "propertyhub_pending_site_visit"
      );

    if (!raw) {
      return;
    }

    try {
      const pending = JSON.parse(raw);

      if (
        String(pending.propertyId || "") !==
        String(propertyId)
      ) {
        return;
      }

      setName(String(pending.name || ""));
      setPhone(String(pending.phone || ""));
      setDate(String(pending.date || ""));
      setTime(String(pending.time || ""));
      setMessage(String(pending.message || ""));

      async function resumeBooking() {
        try {
          setLoading(true);

          await addDoc(
            collection(db,"siteVisits"),
            {
              name:
                String(pending.name || ""),
              phone:
                String(pending.phone || ""),
              date:
                String(pending.date || ""),
              time:
                String(pending.time || ""),
              message:
                String(pending.message || ""),

              propertyId,
              propertyTitle,
              ownerId,
              dealerId:
                dealerId || "",

              buyerId:buyerUid,

              status:"Pending",

              createdAt:serverTimestamp()
            }
          );

          await addDoc(
            collection(db,"notifications"),
            {
              ownerId,

              buyerId:buyerUid,

              title:
                "New Site Visit Request",

              message:
                `${String(
                  pending.name || ""
                )} requested a visit for ${propertyTitle}`,

              propertyId,

              propertyTitle,

              read:false,

              createdAt:serverTimestamp()
            }
          );

          sessionStorage.removeItem(
            "propertyhub_pending_site_visit"
          );

          window.history.replaceState(
            {},
            "",
            `/properties/${propertyId}#site-visit`
          );

          alert(
            "Site Visit Booked Successfully ✅"
          );

          setName("");
          setPhone("");
          setDate("");
          setTime("");
          setMessage("");
        } catch (error) {
          console.error(
            "Resume Site Visit failed:",
            error
          );

          alert(
            "Site Visit booking complete nahi ho payi. Please dobara submit karein."
          );
        } finally {
          setLoading(false);
        }
      }

      resumeBooking();
    } catch (error) {
      console.error(
        "Pending Site Visit parse failed:",
        error
      );

      sessionStorage.removeItem(
        "propertyhub_pending_site_visit"
      );
    }
  }, [
    user,
    propertyId,
    propertyTitle,
    ownerId,
    dealerId,
  ]);


  async function handleSubmit(e:React.FormEvent){

    e.preventDefault();

    if (!user) {
      sessionStorage.setItem(
        "propertyhub_pending_site_visit",
        JSON.stringify({
          propertyId,
          propertyTitle,
          ownerId,
          dealerId: dealerId || "",
          name,
          phone,
          date,
          time,
          message,
        })
      );

      router.push(
        `/buyer-login?redirect=${encodeURIComponent(
          `/properties/${propertyId}?resumeSiteVisit=1#site-visit`
        )}`
      );

      return;
    }

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
        dealerId: dealerId || "",

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
className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-[#60A5FA] focus:bg-white"
/>


<input
type="tel"
placeholder="Mobile Number"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
required
className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-[#60A5FA] focus:bg-white"
/>


<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
required
className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-[#60A5FA] focus:bg-white"
/>


<select
value={time}
onChange={(e)=>setTime(e.target.value)}
required
className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-[#60A5FA] focus:bg-white"
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
className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 shadow-inner outline-none transition focus:border-[#60A5FA] focus:bg-white"
/>



<button
type="submit"
disabled={loading}
className="w-full rounded-xl bg-[#D4A855] py-4 font-black text-[#080C15] shadow-xl transition hover:bg-[#E5C27A] hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
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
