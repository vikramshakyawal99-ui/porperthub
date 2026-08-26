import { Metadata } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PropertyCard from "@/components/PropertyCard";


export const metadata: Metadata = {

  title:
    "Rooms in Mansarovar Jaipur | Affordable Room Rent | PropertyHub",

  description:
    "Find rooms for rent in Mansarovar Jaipur. Explore affordable room rental properties, verified listings and owner contacts on PropertyHub.",

  keywords: [
    "rooms in Mansarovar Jaipur",
    "room rent Mansarovar",
    "single room Mansarovar",
    "property rent Jaipur",
  ],

};



export default async function RoomsPage() {


  const q = query(

    collection(db, "properties"),

    where("location", "==", "Mansarovar"),

    where("type", "==", "room_rent")

  );


  const snapshot = await getDocs(q);



  const properties = snapshot.docs.map((doc) => ({

    id: doc.id,

    ...doc.data(),

  }));



  return (

    <main className="min-h-screen bg-zinc-950 text-white p-10">


      <div className="mx-auto max-w-7xl">


        <h1 className="text-4xl font-bold">

          Rooms in Mansarovar Jaipur

        </h1>



        <p className="mt-4 text-lg text-gray-300">

          Find affordable rooms for rent in Mansarovar Jaipur.
          Verified owner listings available on PropertyHub.

        </p>




        <div className="mt-10 grid gap-6 md:grid-cols-3">


          {
            properties.map((property:any)=>(

              <PropertyCard

                key={property.id}

                property={property}

              />

            ))
          }


        </div>


      </div>


    </main>

  );

} 