"use client";

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
  price?: string;
  image?: string;
  status?: string;
  type?: string;
};



export default function MyPropertiesPage() {


  const { user } = useAuth();

  const router = useRouter();


  const [properties, setProperties] = useState<Property[]>([]);



  useEffect(() => {

    async function loadProperties() {

      if (!user) return;


      const q = query(
        collection(db,"properties"),
        where("ownerId","==",user.uid)
      );


      const snap = await getDocs(q);


      const data = snap.docs.map((docSnap)=>({

        id: docSnap.id,
        ...docSnap.data()

      })) as Property[];


      setProperties(data);

    }


    loadProperties();


  },[user]);





  async function handleDelete(id:string){


    const ok = confirm(
      "Delete this property?"
    );


    if(!ok) return;


    await deleteDoc(
      doc(db,"properties",id)
    );


    setProperties((prev)=>
      prev.filter(
        (property)=>property.id!==id
      )
    );


    alert(
      "Property deleted successfully"
    );

  }





  return (

    <div className="p-6">


      <h1 className="mb-6 text-3xl font-bold">
        My Properties
      </h1>




      {
        properties.length===0 ? (

          <p>
            No properties found
          </p>


        ) : (


          <div className="grid gap-5 md:grid-cols-3">


          {
            properties.map((property)=>(


              <div
                key={property.id}
                className="rounded-xl border p-5 shadow"
              >


                {
                  property.image && (

                    <img
                      src={property.image}
                      alt={property.title}
                      className="mb-4 h-48 w-full rounded-xl object-cover"
                    />

                  )
                }



                <h2 className="text-xl font-bold">
                  {property.title}
                </h2>


                <p>
                  📍 {property.location}
                </p>


                <p>
                  💰 {property.price}
                </p>


                <p>
                  🏠 Type: {property.type}
                </p>



                <div className="mt-3">

                  {
                    property.status==="approved" ? (

                      <span className="rounded bg-green-600 px-3 py-1 text-white">
                        ✅ Approved
                      </span>


                    ) : property.status==="rejected" ? (

                      <span className="rounded bg-red-600 px-3 py-1 text-white">
                        ❌ Rejected
                      </span>


                    ) : (

                      <span className="rounded bg-yellow-500 px-3 py-1 text-black">
                        ⏳ Pending
                      </span>

                    )
                  }

                </div>




                <div className="mt-5 flex gap-3">


                  <button
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                    onClick={()=>
                      router.push(
                        `/owner/edit-property/${property.id}`
                      )
                    }
                  >
                    Edit
                  </button>



                  <button
                    className="rounded bg-red-600 px-4 py-2 text-white"
                    onClick={()=>
                      handleDelete(property.id)
                    }
                  >
                    Delete
                  </button>


                </div>


              </div>


            ))
          }


          </div>

        )
      }


    </div>

  );

}
