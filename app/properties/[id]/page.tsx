import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
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

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetails({ params }: Props) {
  const { id } = await params;

  const docRef = doc(db, "properties", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const property = {
    id: docSnap.id,
    ...docSnap.data(),
  } as any;

  console.log("PROPERTY IMAGES:", property.images);

  return (
    <main className="min-h-screen bg-zinc-950 py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl">
          
          {/* Image Gallery */}
          <ImageGallery
            images={
              property.images && property.images.length > 0
                ? property.images
                : [property.image]
            }
          />

          <div className="p-8">

            {/* Header */}
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
            </div>

            <hr className="my-10" />

            {/* Property Highlights */}
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

              <div className="rounded-2xl bg-blue-50 p-5 shadow">
                <h3 className="text-gray-400">RERA Number</h3>
                <p className="mt-2 text-xl font-bold">
                  📋 {property.reraNumber || "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-5 shadow">
                <h3 className="text-gray-400">Parking</h3>
                <p className="mt-2 text-xl font-bold">
                  🚗 {property.parking}
                </p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-5 shadow">
                <h3 className="text-gray-400">Possession</h3>
                <p className="mt-2 text-xl font-bold">
                  🏠 {property.possession}
                </p>
              </div>

            </div>

            {/* Amenities */}
            <Amenities />

            {/* Builder Information */}
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

            {/* Description */}
            <h2 className="mb-5 text-3xl font-bold text-gray-900">
              Description
            </h2>

            <p className="text-lg leading-9 text-gray-700">
              {property.description}
            </p>

            {/* EMI Calculator */}
            <EMICalculator />

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap gap-5">

              <a
                href={`tel:${property.builderContact}`}
                className="rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:scale-105 hover:bg-blue-700"
              >
                📞 Call Builder
              </a>

              <FavoriteButton propertyId={property.id} />

            </div>

            {/* Property Actions */}
            <div className="flex flex-wrap gap-4">
              <PropertyActions propertyId={property.id} propertyTitle={property.title} />
              <WhatsAppButton propertyTitle={property.title} />
              <ShareButton />
            </div>

            {/* Site Visit Form */}
            <GoogleMap location={property.location} />

            <NearbyPlaces location={property.location} />

            <SiteVisitForm
              propertyId={property.id}
              propertyTitle={property.title}
            />

          </div>
        </div>
      </div>
    </main>
  );
}