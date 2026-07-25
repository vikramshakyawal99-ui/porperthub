import { notFound } from "next/navigation";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

import EMICalculator from "../../../components/EMICalculator";
import ImageGallery from "../../../components/ImageGallery";
import Amenities from "../../../components/Amenities";
import BuilderCard from "../../../components/BuilderCard";
import PropertyScore from "../../../components/PropertyScore";
import PriceTrend from "../../../components/PriceTrend";
import AIPropertyAssistant from "../../../components/AIPropertyAssistant";
import FavoriteButton from "../../../components/FavoriteButton";
import SiteVisitForm from "../../../components/SiteVisitForm";
import GoogleMap from "../../../components/GoogleMap";
import NearbyPlaces from "../../../components/NearbyPlaces";
import PropertyActions from "../../../components/PropertyActions";
import WhatsAppButton from "../../../components/WhatsAppButton";
import ShareButton from "../../../components/ShareButton";
import PropertySchema from "../../../components/PropertySchema";


type Props = {
  params: Promise<{
    id: string;
  }>;
};


export async function generateMetadata({ params }: Props) {

  const { id } = await params;

  const docRef = doc(db, "properties", id);

  const docSnap = await getDoc(docRef);


  if (!docSnap.exists()) {

    return {

      title: "Property Not Found | PropertyHub",

      description:
        "Property details not available."

    };

  }


  const property = docSnap.data() as any;


  return {

    title:
      `${property.bedrooms || ""} ${property.propertyType || "Property"} in ${property.location} | ${property.title} | PropertyHub`,


    description:
      `Find ${property.title} in ${property.location}, Jaipur. ` +
      `${property.bedrooms || ""} bedrooms, price ${property.price || ""}. ` +
      `View images, amenities and book site visit with PropertyHub.`,


    keywords: [

      property.title,

      `${property.location} property`,

      `${property.location} Jaipur`,

      `${property.propertyType || "property"} Jaipur`,

      "Jaipur real estate",

      "PropertyHub"

    ],


    robots: {

      index:true,

      follow:true

    },


    openGraph: {

      title:
        `${property.title} | PropertyHub`,


      description:
        `Explore ${property.title} located in ${property.location}, Jaipur.`,


      type:"website",


      images:[

        property.image || "/og-image.jpg"

      ]

    }

  };

}



export default async function PropertyDetails({ params }: Props) {


  const { id } = await params;


  const docRef = doc(db,"properties",id);


  const docSnap = await getDoc(docRef);


  if(!docSnap.exists()){

    notFound();

  }


  const property = {

    id:docSnap.id,

    ...docSnap.data(),

  } as any;



  console.log(
    "PROPERTY IMAGES:",
    property.images
  );



  await setDoc(

    doc(db,"propertyViews",id),

    {

      propertyId:id,

      propertyTitle:property.title,

      views:increment(1),

      updatedAt:new Date(),

    },

    {
      merge:true
    }

  );


  return (
    <>
      <PropertySchema property={property} />

      <main className="min-h-screen bg-zinc-950 py-10">

        <div className="mx-auto max-w-7xl px-6">

          <div className="overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl">

            <ImageGallery

              images={
                property.images &&
                property.images.length > 0

                ?

                property.images

                :

                [property.image]

              }

            />


            <div className="p-8">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>

                  <h1 className="text-4xl font-extrabold text-gray-900">

                    {property.title}

                  </h1>


                  <p className="mt-3 text-lg text-gray-700">

                    📍 {property.location}

                  </p>


                  <div className="mt-3 flex items-center gap-2">

                    ⭐⭐⭐⭐⭐

                    <span className="font-semibold text-gray-700">

                      {property.rating}/5

                    </span>

                  </div>


                </div>


                <div className="rounded-2xl bg-blue-600 px-8 py-5 text-center text-white shadow-lg">

                  <p className="text-sm uppercase tracking-wide">

                    Price

                  </p>


                  <h2 className="text-4xl font-bold">

                    {property.price}

                  </h2>

                </div>


              </div>              <hr className="my-10" />


              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                Property Highlights
              </h2>


              <div className="grid grid-cols-2 gap-5 md:grid-cols-3">


                <div className="rounded-2xl bg-blue-50 p-5 shadow">
                  <h3 className="text-gray-400">Builder</h3>
                  <p className="mt-2 text-xl font-bold">
                    {property.builder}
                  </p>
                </div>


                <div className="rounded-2xl bg-blue-50 p-5 shadow">
                  <h3 className="text-gray-400">Bedrooms</h3>
                  <p className="mt-2 text-xl font-bold">
                    🛏 {property.bedrooms}
                  </p>
                </div>


                <div className="rounded-2xl bg-blue-50 p-5 shadow">
                  <h3 className="text-gray-400">Bathrooms</h3>
                  <p className="mt-2 text-xl font-bold">
                    🛁 {property.bathrooms}
                  </p>
                </div>


                <div className="rounded-2xl bg-blue-50 p-5 shadow">
                  <h3 className="text-gray-400">Area</h3>
                  <p className="mt-2 text-xl font-bold">
                    📐 {property.area}
                  </p>
                </div>


                <div className="rounded-2xl bg-blue-50 p-5 shadow">
                  <h3 className="text-gray-400">Project</h3>
                  <p className="mt-2 text-xl font-bold">
                    🏗 {property.projectName || "-"}
                  </p>
                </div>


                <div className="rounded-2xl bg-blue-50 p-5 shadow">
                  <h3 className="text-gray-400">Property Type</h3>
                  <p className="mt-2 text-xl font-bold">
                    🏢 {property.propertyType || "-"}
                  </p>
                </div>


              </div>


              <Amenities />


              <BuilderCard
                builder={property.builder}
                builderContact={property.builderContact}
                projectName={property.projectName}
                reraNumber={property.reraNumber}
              />


              <PropertyScore rating={property.rating} />

              <PriceTrend />

              <AIPropertyAssistant />


              <hr className="my-10" />


              <h2 className="mb-5 text-3xl font-bold text-gray-900">
                Description
              </h2>


              <p className="text-lg leading-9 text-gray-700">
                {property.description}
              </p>


              <EMICalculator />


              <div className="mt-10 flex flex-wrap gap-5">


                <a
                  href={`tel:${property.builderContact}`}
                  className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white"
                >
                  📞 Call Builder
                </a>


                <FavoriteButton propertyId={property.id} />


              </div>



              <div className="flex flex-wrap gap-4 mt-5">


                <PropertyActions
                  propertyId={property.id}
                  propertyTitle={property.title}
                  ownerId={property.ownerId || ""}
                />


                <WhatsAppButton
                  propertyTitle={property.title}
                />


                <ShareButton />


              </div>



              <GoogleMap location={property.location} />


              <NearbyPlaces location={property.location} />


              <SiteVisitForm
                propertyId={property.id}
                propertyTitle={property.title}
                ownerId={property.ownerId}
              />


            </div>


          </div>


        </div>


      </main>

    </>
  );

}
