"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


export default function OwnerListingsPage() {


  const { user } = useAuth();

  const [properties,setProperties] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);



  async function fetchProperties(){


    if(!user) return;


    const q = query(
      collection(db,"properties"),
      where("ownerId","==",user.uid)
    );


    const snapshot = await getDocs(q);


    const data = snapshot.docs.map((item)=>({

      id:item.id,
      ...item.data()

    }));


    setProperties(data);

    setLoading(false);


  }





  async function deleteProperty(id:string){


    const confirmDelete = confirm(
      "Delete this listing?"
    );


    if(!confirmDelete) return;



    await deleteDoc(
      doc(db,"properties",id)
    );


    fetchProperties();


  }





  useEffect(()=>{

    fetchProperties();

  },[user]);





  if(loading){

    return (

      <div className="min-h-screen flex items-center justify-center">

        Loading...

      </div>

    );

  }





  return (

    <div className="min-h-screen bg-zinc-950 text-white p-10">


      <div className="max-w-6xl mx-auto">


        <h1 className="text-4xl font-bold mb-8">

          🏠 My Listings

        </h1>




        {properties.length === 0 ? (

          <div className="bg-zinc-900 p-8 rounded-xl">

            No listings added yet

          </div>

        ) : (


          <div className="grid md:grid-cols-3 gap-6">


            {properties.map((property)=>(


              <div
                key={property.id}
                className="bg-zinc-900 rounded-xl p-6"
              >


                <h2 className="text-xl font-bold">

                  {property.title}

                </h2>


                <p className="text-gray-400">

                  {property.location}

                </p>


                <p className="mt-2 text-green-400">

                  {property.type}

                </p>


                <p>

                  ₹ {property.price}

                </p>



                <button

                  onClick={()=>deleteProperty(property.id)}

                  className="mt-5 bg-red-600 px-4 py-2 rounded-lg"

                >

                  Delete

                </button>



              </div>


            ))}


          </div>


        )}



      </div>


    </div>

  );

}
