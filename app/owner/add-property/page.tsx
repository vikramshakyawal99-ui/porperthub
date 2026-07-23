"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";


export default function AddPropertyPage() {


  const { user } = useAuth();
  const router = useRouter();


  const [loading, setLoading] = useState(false);


  const [form, setForm] = useState({

    title: "",
    type: "property_sale",
    location: "",
    price: "",
    bedrooms: "",
    area: "",
    contact: "",
    description: "",

  });




  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ){

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  }





  async function handleSubmit(e: React.FormEvent){

    e.preventDefault();


    if(!user){

      alert("Please login first");
      return;

    }


    setLoading(true);


    try{


      await addDoc(collection(db,"properties"),{


        ...form,


        ownerId:user.uid,

        ownerEmail:user.email,

        createdAt:serverTimestamp(),

      });



      alert("Listing Added Successfully");


      router.push("/owner/listings");


    }catch(error:any){


      alert(error.message);


    }


    setLoading(false);


  }






  return (

    <div className="min-h-screen bg-zinc-950 text-white p-10">


      <div className="max-w-3xl mx-auto bg-zinc-900 p-8 rounded-2xl">


        <h1 className="text-3xl font-bold mb-6">
          ➕ Add New Listing
        </h1>



        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >



          <input

            name="title"

            placeholder="Property Title"

            className="w-full p-3 rounded text-black"

            onChange={handleChange}

            required

          />




          <select

            name="type"

            className="w-full p-3 rounded text-black"

            onChange={handleChange}

          >

            <option value="property_sale">
              Property Sale
            </option>


            <option value="resale">
              Resale Property
            </option>


            <option value="hostel">
              Hostel
            </option>


            <option value="pg_boys">
              Boys PG
            </option>


            <option value="pg_girls">
              Girls PG
            </option>


            <option value="room_rent">
              Room Rent
            </option>


            <option value="property_rent">
              Property Rent
            </option>


          </select>





          <input

            name="location"

            placeholder="Location"

            className="w-full p-3 rounded text-black"

            onChange={handleChange}

            required

          />





          <input

            name="price"

            placeholder="Price / Rent"

            className="w-full p-3 rounded text-black"

            onChange={handleChange}

            required

          />





          <input

            name="bedrooms"

            placeholder="Bedrooms"

            className="w-full p-3 rounded text-black"

            onChange={handleChange}

          />





          <input

            name="area"

            placeholder="Area (sq ft)"

            className="w-full p-3 rounded text-black"

            onChange={handleChange}

          />





          <input

            name="contact"

            placeholder="Contact Number"

            className="w-full p-3 rounded text-black"

            onChange={handleChange}

          />





          <textarea

            name="description"

            placeholder="Description"

            className="w-full p-3 rounded text-black"

            onChange={handleChange}

          />





          <button

            disabled={loading}

            className="w-full bg-green-600 p-3 rounded-xl"

          >

            {loading ? "Adding..." : "Add Listing"}

          </button>



        </form>



      </div>



    </div>

  );

}
