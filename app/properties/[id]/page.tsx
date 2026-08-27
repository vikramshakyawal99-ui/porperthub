import { notFound } from "next/navigation";
import { cache } from "react";
import dynamic from "next/dynamic";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import EMICalculator from "../../../components/EMICalculator";
import ImageGallery from "../../../components/ImageGallery";
import Amenities from "../../../components/Amenities";
import PropertyAreaInsights from "../../../components/PropertyAreaInsights";
import PropertyConfigurations from "../../../components/PropertyConfigurations";
import PropertyHomeLoanPanel from "../../../components/PropertyHomeLoanPanel";
import ProjectShowcaseAd from "../../../components/ProjectShowcaseAd";




import FavoriteButton from "../../../components/FavoriteButton";
import WishlistButton from "../../../components/WishlistButton";
import SiteVisitForm from "../../../components/SiteVisitForm";


import PropertyActions from "../../../components/PropertyActions";
import WhatsAppButton from "../../../components/WhatsAppButton";
import ShareButton from "../../../components/ShareButton";
import LeadForm from "../../../components/LeadForm";
import PropertySchema from "../../../components/PropertySchema";
import PropertyViewTracker from "../../../components/PropertyViewTracker";
import PropertyDetailDeferred from "../../../components/PropertyDetailDeferred";




const BuilderCard = dynamic(() => import("../../../components/BuilderCard"));
const PropertyScore = dynamic(() => import("../../../components/PropertyScore"));
const PriceTrend = dynamic(() => import("../../../components/PriceTrend"));
const AIPropertyAssistant = dynamic(() => import("../../../components/AIPropertyAssistant"));
const GoogleMap = dynamic(() => import("../../../components/GoogleMap"), {
  loading: () => <div className="mt-8 h-96 animate-pulse rounded-xl bg-zinc-800" />
});
const NearbyPlaces = dynamic(() => import("../../../components/NearbyPlaces"), {
  loading: () => <div className="mt-8 h-72 animate-pulse rounded-xl bg-zinc-800" />
});
const SimilarProperties = dynamic(() => import("../../../components/SimilarProperties"), {
  loading: () => <div className="mt-8 h-96 animate-pulse rounded-xl bg-zinc-800" />
});

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const getProperty = cache(async (id: string): Promise<any | null> => {
  const docRef = doc(db, "properties", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as any;
});


export async function generateMetadata({ params }: Props) {

  const { id } = await params;

  const property = await getProperty(id);

  if (!property) {
    return {
      title: "Property Not Found | PropertyHub",
      description: "Property details not available.",
    };
  }


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


  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

const isRental =
    property.propertyType==="pg" ||
    property.propertyType==="hostel" ||
    property.propertyType==="room_rent";

const isResale =
    property.purpose === "resale" ||
    property.propertyType === "resale";

const normalizedPurpose = String(
  property.purpose || property.type || ""
).toLowerCase();

const normalizedPropertyType = String(
  property.propertyType || property.type || ""
).toLowerCase();

const isPurchaseProperty =
  ["new", "buy", "resale"].includes(
    normalizedPurpose
  ) ||
  normalizedPropertyType === "resale";


  return (
    <>
      <PropertyViewTracker
        propertyId={property.id}
        propertyTitle={property.title}
      />
      <PropertySchema property={property} />

      <main className="min-h-screen bg-slate-50 py-10">

        <div className="mx-auto max-w-7xl px-6">

          {/* SPONSORED PROJECT SHOWCASE - NEW / RESALE ONLY */}
          {isPurchaseProperty && (
            <div className="mb-8">
              <ProjectShowcaseAd />
            </div>
          )}

          <div className="overflow-hidden rounded-3xl bg-white shadow-xl border border-slate-100">

            <ImageGallery

              images={
                property.images &&
                property.images.length > 0

                ?

                property.images

                :

                property.image

                ?

                [property.image]

                :

                []

              }

            />


            <div className="p-8 md:p-10">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>

                  <div className="mb-4 inline-flex items-center rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
✓ Verified Property
</div>

<h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">

                    {property.title}

                  </h1>


                  <p className="mt-3 text-lg text-slate-600">

                    📍 {property.location}

                  </p>


                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#d4a855]/10 px-4 py-2">

                    <span>
                      ⭐⭐⭐⭐⭐
                    </span>

                    <span className="font-semibold text-slate-700">
                      {property.rating}/5 Rating
                    </span>

                  </div>


                </div>


                <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B0F14] to-[#111827] px-8 py-7 text-center text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">

                  <p className="text-xs uppercase tracking-[0.35em] text-[#DBEAFE]">

                    Price

                  </p>


                  <h2 className="mt-3 text-5xl font-black tracking-tight">

                    {property.price}

                  </h2>


                  {(property.propertyType==="pg" ||
                    property.propertyType==="hostel" ||
                    property.propertyType==="room_rent") && (

                    <div className="mt-4 flex flex-wrap justify-center gap-2">


                      <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md border border-white/20 shadow-lg">
                        {property.propertyType==="pg"
                          ? "PG"
                          : property.propertyType==="hostel"
                          ? "Hostel"
                          : "Room Rent"}
                      </span>


                      {property.gender && (
                        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md border border-white/20 shadow-lg">
                          {property.gender}
                        </span>
                      )}


                      {property.food==="yes" && (
                        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md border border-white/20 shadow-lg">
                          🍽 Food
                        </span>
                      )}


                      {property.ac && (
                        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md border border-white/20 shadow-lg">
                          ❄ {property.ac==="yes" ? "AC" : "Non AC"}
                        </span>
                      )}


                      {property.kitchen && (
                        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md border border-white/20 shadow-lg">
                          🍳 {property.kitchen==="yes" ? "Kitchen Available" : "No Kitchen"}
                        </span>
                      )}


                      {property.suitableFor && (
                        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md border border-white/20 shadow-lg">
                          👤 {
                            property.suitableFor==="family"
                            ? "Family Allowed"
                            : property.suitableFor==="boys"
                            ? "Boys"
                            : property.suitableFor==="girls"
                            ? "Girls"
                            : property.suitableFor==="co_living"
                            ? "Co-Living"
                            : "Anyone"
                          }
                        </span>
                      )}


                    </div>

                  )}

                </div>


              </div>

              {isPurchaseProperty && (
                <PropertyAreaInsights
                  location={String(
                    property.location || "Jaipur"
                  )}
                />
              )}

              {isPurchaseProperty &&
                String(
                  property.propertyType || ""
                ).toLowerCase() !== "plot" && (
                  <PropertyConfigurations
                    configurations={
                      property.configurations
                    }
                    propertyType={
                      property.propertyType
                    }
                  />
                )}

              <hr className="my-10" />


              {(() => {
                const isRoomType =
                  property.propertyType === "room_rent" ||
                  property.propertyType === "pg" ||
                  property.propertyType === "hostel";

                const highlightCards = [];

                if (!isRoomType && property.builder) {
                  highlightCards.push(
                    <div
                      key="builder"
                      className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Builder
                      </h3>
                      <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                        {property.builder}
                      </p>
                    </div>
                  );
                }

                if (!isRoomType && property.bedrooms) {
                  highlightCards.push(
                    <div
                      key="bedrooms"
                      className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Bedrooms
                      </h3>
                      <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                        🛏 {property.bedrooms}
                      </p>
                    </div>
                  );
                }

                if (!isRoomType && property.bathrooms) {
                  highlightCards.push(
                    <div
                      key="bathrooms"
                      className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Bathrooms
                      </h3>
                      <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                        🛁 {property.bathrooms}
                      </p>
                    </div>
                  );
                }

                if (
                  !isRoomType &&
                  String(property.purpose || "").toLowerCase() !== "rent" &&
                  String(property.propertyType || "").toLowerCase() !== "plot" &&
                  property.area
                ) {
                  highlightCards.push(
                    <div
                      key="area"
                      className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Area
                      </h3>
                      <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                        📐 {property.area}
                      </p>
                    </div>
                  );
                }

                if (!isRoomType && !isResale && property.projectName) {
                  highlightCards.push(
                    <div
                      key="project"
                      className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Project
                      </h3>
                      <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                        🏗 {property.projectName}
                      </p>
                    </div>
                  );
                }

                if (!isRoomType && property.propertyType) {
                  highlightCards.push(
                    <div
                      key="property-type"
                      className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                        Property Type
                      </h3>
                      <p className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                        🏢 {property.propertyType}
                      </p>
                    </div>
                  );
                }

                if (highlightCards.length === 0) {
                  return null;
                }

                return (
                  <>
                    <h2 className="mb-6 text-3xl font-bold text-slate-900">
                      Property Highlights
                    </h2>

                    <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
                      {highlightCards}
                    </div>
                  </>
                );
              })()}

              {!isResale && property.propertyType !== "plot" && (
                <Amenities
                  amenities={
                    Array.isArray(property.amenities)
                      ? property.amenities
                      : []
                  }
                />
              )}


              {!isRental && !isResale && (
                <>
                  <BuilderCard
                    builder={property.builder}
                    builderContact={property.builderContact}
                    projectName={property.projectName}
                    reraNumber={property.reraNumber}
                  />


                  <PropertyScore rating={property.rating} />

                  <PriceTrend price={property.price} />

                  <AIPropertyAssistant />
                </>
              )}


              <hr className="my-10" />


              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-xl">

              <h2 className="mb-5 text-3xl font-extrabold text-slate-900">
                Description
              </h2>


              <p className="text-lg leading-9 text-slate-600">
                {property.description}
              </p>

              </div>


              {!isRental && (
                <EMICalculator />
              )}




{/* ROOM / PG / HOSTEL DETAILS */}

{isRental && (

<div className="mt-8 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl backdrop-blur-xl">

<h3 className="mb-6 text-2xl font-extrabold text-slate-900">
🏠 Room Details
</h3>


<div className="grid grid-cols-2 gap-5 text-slate-700">


{property.roomType && (
<p>
🛏 Room:
<b className="text-slate-900">
 {property.roomType==="single"
 ? " Single Room"
 : property.roomType==="shared"
 ? " Shared Room"
 : " Private Room"}
</b>
</p>
)}



{property.sharingType && (
<p>
👥 Sharing:
<b className="text-slate-900">
 {property.sharingType} Sharing
</b>
</p>
)}



{property.food && (
<p>
🍽 Food:
<b className="text-slate-900">
 {property.food==="yes"
 ? " Available"
 : " Non Food"}
</b>
</p>
)}



{property.ac && (
<p>
❄ AC:
<b className="text-slate-900">
 {property.ac==="yes"
 ? " AC Room"
 : " Non AC Room"}
</b>
</p>
)}



{property.kitchen && (
<p>
🍳 Kitchen:
<b className="text-slate-900">
 {property.kitchen==="yes"
 ? " Available"
 : " Not Available"}
</b>
</p>
)}



{property.suitableFor && (
<p>
👤 Suitable:
<b className="text-slate-900">
 {property.suitableFor}
</b>
</p>
)}



</div>

</div>

)}



{/* PREMIUM AMENITIES */}

{property.propertyType !== "plot" &&
property.amenities &&
property.amenities.length > 0 && (

<div className="mt-8 rounded-xl bg-gray-50 p-5">

<h3 className="text-xl font-bold mb-4">
⭐ Premium Amenities
</h3>


<div className="flex flex-wrap gap-3">

{property.amenities.map((item:string)=>(

<span
key={item}
className="bg-[#F8FAFC] px-3 py-2 rounded-lg text-[#60A5FA]"
>
✓ {item}
</span>

))}

</div>

</div>

)}

              <div className="mt-10 flex flex-wrap gap-5">


                {!isRental && !isResale && property.builderContact && (
<a
                  href={`tel:${property.builderContact}`}
                  className="rounded-xl bg-[#60A5FA] px-8 py-4 font-bold text-white"
                >
                  📞 Call Builder
                </a>
)}


                <div className="flex flex-wrap gap-4">
                <FavoriteButton propertyId={property.id} />
                <WishlistButton propertyId={property.id} />
              </div>


              </div>



              <div className="mt-8 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-xl">

              <div className="mb-4 text-xl font-extrabold text-slate-900">
                Contact Property Owner
              </div>

              <div className="flex flex-wrap gap-4">


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

              </div>



              <GoogleMap
  location={property.location}
  latitude={Number(property.latitude)}
  longitude={Number(property.longitude)}
/>


              <PropertyDetailDeferred
                fallback={
                  <div className="mt-8 space-y-6">
                    <div className="h-72 animate-pulse rounded-xl bg-zinc-100" />
                    <div className="h-48 animate-pulse rounded-xl bg-zinc-100" />
                  </div>
                }
              >
                <NearbyPlaces
                  location={property.location}
                  latitude={Number(property.latitude)}
                  longitude={Number(property.longitude)}
                />

                <SimilarProperties
                  currentId={property.id}
                  location={property.location}
                  propertyType={property.propertyType}
                />
              </PropertyDetailDeferred>


              {(
                property.propertyType !== "pg" &&
                property.propertyType !== "hostel" &&
                property.propertyType !== "room_rent"
              ) && (
                <SiteVisitForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                  ownerId={property.ownerId}
                  dealerId={property.dealerId}
                />
              )}

              <LeadForm
                propertyId={property.id}
                propertyTitle={property.title}
                ownerId={property.ownerId}
                dealerId={property.dealerId}
              />

              {isPurchaseProperty && (
                <PropertyHomeLoanPanel
                  propertyTitle={String(
                    property.title || "Property"
                  )}
                  propertyPrice={String(
                    property.price || ""
                  )}
                />
              )}

            </div>


          </div>


        </div>


      </main>

    </>
  );
}
