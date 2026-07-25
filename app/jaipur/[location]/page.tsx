import { Metadata } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PropertyCard from "@/components/PropertyCard";


type Props = {
  params: Promise<{
    location: string;
  }>;
};


export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const { location } = await params;

  return {
    title: `${location} Jaipur Properties | PropertyHub`,
    description:
      `Find verified properties in ${location} Jaipur on PropertyHub.`,
  };

}



export default async function LocationPage(
  { params }: Props
) {

  const { location } = await params;


  const locationName =
    location
      .replace("-", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());



  const q = query(
    collection(db, "properties"),
    where("location", "==", locationName),
    where("status", "==", "approved")
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
          Properties in {locationName} Jaipur
        </h1>


        <p className="mt-4 text-gray-300">
          Explore verified approved properties available in {locationName}.
        </p>



        <div className="mt-10 grid gap-6 md:grid-cols-3">


          {
            properties.length === 0 ? (

              <p>
                No approved properties available.
              </p>

            ) : (

              properties.map((property:any)=>(

                <PropertyCard
                  key={property.id}
                  property={property}
                />

              ))

            )
          }


        </div>


      </div>


    </main>

  );

}
