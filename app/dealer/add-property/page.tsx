"use client";

import Image from "next/image";
import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import LocationPicker from "@/components/LocationPicker";
import PropertyConfigurationsField, {
  type PropertyConfiguration,
} from "@/components/PropertyConfigurationsField";

const TYPES_BY_PURPOSE: Record<string, string[]> = {
  new: [
    "flat",
    "villa",
    "house",
    "plot",
  ],
  resale: [
    "flat",
    "villa",
    "house",
    "plot",
  ],
  rent: [
    "flat",
    "house",
    "pg",
    "hostel",
    "room_rent",
    "shop",
    "office_space",
  ],
  commercial: [
    "shop",
    "warehouse",
    "office_space",
    "showroom",
    "commercial_building",
    "industrial_space",
  ],
};

const TYPE_LABELS: Record<string, string> = {
  flat: "Apartment / Flat",
  villa: "Villa",
  house: "House",
  plot: "Plot",
  pg: "PG",
  hostel: "Hostel",
  room_rent: "Room Rent",
  shop: "Shop",
  warehouse: "Warehouse",
  office_space: "Office Space",
  showroom: "Showroom",
  commercial_building: "Commercial Building",
  industrial_space: "Industrial Space",
};

const AMENITIES_BY_TYPE: Record<string, string[]> = {
  flat: [
    "Parking",
    "Lift",
    "CCTV / Security",
    "Power Backup",
    "Park",
    "Gym",
    "Swimming Pool",
    "Club House",
    "Water Supply",
    "Gas Pipeline",
  ],
  villa: [
    "Parking",
    "CCTV / Security",
    "Power Backup",
    "Park",
    "Swimming Pool",
    "Club House",
    "Water Supply",
    "Gas Pipeline",
  ],
  house: [
    "Parking",
    "CCTV / Security",
    "Power Backup",
    "Park",
    "Water Supply",
    "Gas Pipeline",
  ],
  plot: [
    "Boundary Wall",
    "Gated Community",
    "Road Access",
    "Water Connection",
    "Electricity",
    "Sewerage",
  ],
  pg: [
    "WiFi",
    "Food",
    "AC",
    "Attached Bathroom",
    "Bed",
    "Wardrobe",
    "Study Table",
    "CCTV / Security",
    "Power Backup",
    "Parking",
    "Laundry",
    "Geyser",
    "Kitchen",
  ],
  hostel: [
    "WiFi",
    "Food / Mess",
    "AC",
    "Attached Bathroom",
    "Bed",
    "Wardrobe",
    "Study Table",
    "CCTV / Security",
    "Power Backup",
    "Parking",
    "Laundry",
    "Common Area",
  ],
  room_rent: [
    "WiFi",
    "AC",
    "Attached Bathroom",
    "Kitchen",
    "Bed",
    "Wardrobe",
    "Study Table",
    "CCTV / Security",
    "Power Backup",
    "Parking",
    "Geyser",
  ],
  shop: [
    "Parking",
    "Power Backup",
    "CCTV / Security",
    "Main Road",
    "Water Supply",
  ],
  warehouse: [
    "Parking",
    "Power Backup",
    "Security",
    "Truck Access",
    "Water Supply",
  ],
  office_space: [
    "Parking",
    "Lift",
    "Power Backup",
    "CCTV / Security",
    "Reception",
    "Conference Room",
  ],
  showroom: [
    "Parking",
    "Main Road",
    "Power Backup",
    "CCTV / Security",
  ],
  commercial_building: [
    "Parking",
    "Lift",
    "Power Backup",
    "CCTV / Security",
    "Fire Safety",
  ],
  industrial_space: [
    "Power Connection",
    "Water Supply",
    "Truck Access",
    "Security",
    "Boundary Wall",
  ],
};

const inputClass =
  "w-full rounded-xl border border-[#C9DACE] bg-white px-4 py-3 text-[#102A1A] outline-none transition placeholder:text-[#7A897F] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10";

type FormState = {
  title: string;
  purpose: string;
  propertyType: string;
  constructionStatus: string;
  city: string;
  location: string;
  price: string;
  rent: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  contact: string;
  description: string;
  projectName: string;
  reraNumber: string;
  parking: string;
  furnished: string;
  roomType: string;
  sharingType: string;
  suitableFor: string;
  food: string;
  ac: string;
  kitchen: string;
  society: string;
  plotSize: string;
  amenities: string[];
};

const initialForm: FormState = {
  title: "",
  purpose: "new",
  propertyType: "flat",
  constructionStatus: "under_construction",
  city: "Jaipur",
  location: "",
  price: "",
  rent: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  contact: "",
  description: "",
  projectName: "",
  reraNumber: "",
  parking: "",
  furnished: "",
  roomType: "",
  sharingType: "",
  suitableFor: "",
  food: "",
  ac: "",
  kitchen: "",
  society: "",
  plotSize: "",
  amenities: [],
};

export default function DealerAddPropertyPage() {
  const router = useRouter();

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [configurations, setConfigurations] =
    useState<PropertyConfiguration[]>([]);

  const [featured, setFeatured] =
    useState(false);

  const [images, setImages] =
    useState<File[]>([]);

  const [previewImages, setPreviewImages] =
    useState<string[]>([]);

  const [locationData, setLocationData] =
    useState({
      latitude: "",
      longitude: "",
    });

  const [loading, setLoading] =
    useState(false);

  const availableTypes =
    TYPES_BY_PURPOSE[form.purpose] || [];

  const availableAmenities =
    AMENITIES_BY_TYPE[
      form.propertyType
    ] || [];

  const isRent =
    form.purpose === "rent";

  const isNew =
    form.purpose === "new";

  const isResidential = [
    "flat",
    "villa",
    "house",
  ].includes(form.propertyType);

  const isAccommodation = [
    "pg",
    "hostel",
    "room_rent",
  ].includes(form.propertyType);

  function update(
    key: keyof FormState,
    value: string | string[]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function selectPurpose(
    nextPurpose: string
  ) {
    const nextTypes =
      TYPES_BY_PURPOSE[nextPurpose] || [];

    setForm((current) => ({
      ...current,
      purpose: nextPurpose,
      propertyType:
        nextTypes.includes(
          current.propertyType
        )
          ? current.propertyType
          : nextTypes[0] || "",
      amenities: [],
      price:
        nextPurpose === "rent"
          ? ""
          : current.price,
      rent:
        nextPurpose === "rent"
          ? current.rent
          : "",
    }));
  }

  function selectPropertyType(
    nextType: string
  ) {
    setForm((current) => ({
      ...current,
      propertyType: nextType,
      amenities: [],
    }));
  }

  function toggleAmenity(
    amenity: string
  ) {
    setForm((current) => ({
      ...current,
      amenities:
        current.amenities.includes(
          amenity
        )
          ? current.amenities.filter(
              (item) => item !== amenity
            )
          : [
              ...current.amenities,
              amenity,
            ],
    }));
  }

  function selectImages(
    event:
      React.ChangeEvent<HTMLInputElement>
  ) {
    const selected = Array.from(
      event.target.files || []
    ).slice(0, 10);

    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ]);

    const invalidFile =
      selected.find(
        (file) =>
          !allowedTypes.has(file.type) ||
          file.size >
            10 * 1024 * 1024
      );

    if (invalidFile) {
      alert(
        "Only JPG, PNG, WebP and AVIF images under 10 MB are allowed."
      );
      event.target.value = "";
      return;
    }

    previewImages.forEach((url) =>
      URL.revokeObjectURL(url)
    );

    setImages(selected);
    setPreviewImages(
      selected.map((file) =>
        URL.createObjectURL(file)
      )
    );
  }

  function removeImage(index: number) {
    const removedUrl =
      previewImages[index];

    if (removedUrl) {
      URL.revokeObjectURL(
        removedUrl
      );
    }

    setImages((current) =>
      current.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );

    setPreviewImages((current) =>
      current.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const user =
      auth.currentUser;

    if (!user) {
      alert("Please login first.");
      router.replace(
        "/dealer-login"
      );
      return;
    }

    const normalizedConfigurations = configurations
      .filter(
        (item) =>
          item.bhk.trim() &&
          item.priceMin.trim()
      )
      .map((item) => ({
        bhk: Number(item.bhk),
        areaMin: Number(item.areaMin) || 0,
        areaMax:
          Number(item.areaMax) ||
          Number(item.areaMin) ||
          0,
        priceMin: Number(item.priceMin) || 0,
        priceMax:
          Number(item.priceMax) ||
          Number(item.priceMin) ||
          0,
      }))
      .filter(
        (item) =>
          item.bhk > 0 &&
          item.priceMin > 0
      )
      .sort(
        (first, second) =>
          first.priceMin - second.priceMin
      );

    const primaryConfiguration =
      normalizedConfigurations[0];

    const amount = isRent
      ? form.rent.trim()
      : primaryConfiguration
        ? String(primaryConfiguration.priceMin)
        : form.price.trim();

    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.city.trim() ||
      !amount ||
      form.contact.trim().length < 10
    ) {
      alert(
        "Title, city, location, price/rent and valid contact number are required."
      );
      return;
    }

    if (
      !locationData.latitude ||
      !locationData.longitude
    ) {
      alert(
        "Please click on the map to select exact property location."
      );
      return;
    }

    if (images.length === 0) {
      alert(
        "Please upload at least one property image."
      );
      return;
    }

    try {
      setLoading(true);

      const uploadedImages =
        await Promise.all(
          images.map((file) =>
            uploadToCloudinary(file)
          )
        );

      const possession =
        isNew
          ? form.constructionStatus ===
            "ready_to_move"
            ? "Ready to Move"
            : form.constructionStatus ===
                "complete_within_1_year"
              ? "Complete Within 1 Year"
              : "Under Construction"
          : "";

      await addDoc(
        collection(
          db,
          "properties"
        ),
        {
          ...form,

          type:
            form.propertyType,

          propertyCondition:
            form.purpose === "resale"
              ? "resale"
              : "new",

          price:
            isRent
              ? ""
              : primaryConfiguration
                ? String(primaryConfiguration.priceMin)
                : form.price.trim(),

          bedrooms:
            primaryConfiguration
              ? String(primaryConfiguration.bhk)
              : form.bedrooms,

          area:
            primaryConfiguration
              ? String(primaryConfiguration.areaMin)
              : form.area,

          configurations:
            normalizedConfigurations,

          rent:
            isRent
              ? form.rent.trim()
              : "",

          constructionStatus:
            isNew
              ? form.constructionStatus
              : "",

          possession,

          featured:
            isNew && featured,

          latitude:
            Number(
              locationData.latitude
            ),

          longitude:
            Number(
              locationData.longitude
            ),

          image:
            uploadedImages[0] || "",

          images:
            uploadedImages,

          dealerId:
            user.uid,

          ownerId:
            user.uid,

          ownerEmail:
            user.email || "",

          role:
            "property_dealer",

          status:
            "approved",

          createdAt:
            serverTimestamp(),
        }
      );

      alert(
        "Property added successfully."
      );

      router.push(
        "/dealer/listings"
      );
    } catch (error) {
      console.error(
        "DEALER ADD PROPERTY ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to add property."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4FAF6] px-4 py-8 text-[#102A1A] sm:px-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-[#DCE9DF] bg-white p-5 shadow-[0_20px_60px_rgba(16,42,26,0.10)] sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#16A34A]">
            Create Listing
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Add New Property
          </h1>

          <p className="mt-2 text-sm text-[#64756A]">
            Add accurate property details,
            images and exact map location.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >
          <section className="rounded-2xl border border-[#D8EBDD] bg-[#F9FCFA] p-5">
            <h2 className="mb-4 text-lg font-black">
              Listing Category
            </h2>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["new", "New"],
                ["resale", "Resale"],
                ["rent", "Rent"],
                [
                  "commercial",
                  "Commercial",
                ],
              ].map(
                ([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      selectPurpose(
                        value
                      )
                    }
                    className={`rounded-xl border px-4 py-3 font-bold transition ${
                      form.purpose ===
                      value
                        ? "border-[#16A34A] bg-[#16A34A] text-white"
                        : "border-[#C9DACE] bg-white text-[#102A1A] hover:border-[#16A34A]"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableTypes.map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      selectPropertyType(
                        type
                      )
                    }
                    className={`rounded-xl border px-4 py-3 font-bold transition ${
                      form.propertyType ===
                      type
                        ? "border-[#15803D] bg-[#EAF7EE] text-[#15803D]"
                        : "border-[#C9DACE] bg-white"
                    }`}
                  >
                    {TYPE_LABELS[type] ||
                      type}
                  </button>
                )
              )}
            </div>
          </section>

          {isNew && (
            <section className="rounded-2xl border border-[#D8EBDD] p-5">
              <h2 className="mb-4 text-lg font-black">
                Construction Status
              </h2>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  [
                    "under_construction",
                    "Under Construction",
                  ],
                  [
                    "ready_to_move",
                    "Ready to Move",
                  ],
                  [
                    "complete_within_1_year",
                    "Complete Within 1 Year",
                  ],
                ].map(
                  ([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        update(
                          "constructionStatus",
                          value
                        )
                      }
                      className={`rounded-xl border px-4 py-3 font-bold transition ${
                        form.constructionStatus ===
                        value
                          ? "border-[#16A34A] bg-[#EAF7EE] text-[#15803D]"
                          : "border-[#C9DACE] bg-white"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </section>
          )}

          {isNew && (
            <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-[#BFE5C9] bg-[#EAF7EE] p-5">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) =>
                  setFeatured(
                    event.target.checked
                  )
                }
                className="mt-1 h-5 w-5 accent-green-600"
              />

              <span>
                <span className="block font-black">
                  Featured Property
                </span>

                <span className="mt-1 block text-sm text-[#64756A]">
                  Show this new property in the
                  homepage Featured Properties
                  section.
                </span>
              </span>
            </label>
          )}

          <section className="space-y-4">
            <h2 className="text-lg font-black">
              Property Details
            </h2>

            <input
              className={inputClass}
              placeholder="Property Title *"
              value={form.title}
              onChange={(event) =>
                update(
                  "title",
                  event.target.value
                )
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className={inputClass}
                placeholder="City *"
                value={form.city}
                onChange={(event) =>
                  update(
                    "city",
                    event.target.value
                  )
                }
              />

              <input
                className={inputClass}
                placeholder="Location / Area *"
                value={form.location}
                onChange={(event) =>
                  update(
                    "location",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isRent ? (
                <input
                  className={inputClass}
                  placeholder="Monthly Rent *"
                  value={form.rent}
                  onChange={(event) =>
                    update(
                      "rent",
                      event.target.value
                    )
                  }
                />
              ) : (
                <input
                  className={inputClass}
                  placeholder="Property Price *"
                  value={form.price}
                  onChange={(event) =>
                    update(
                      "price",
                      event.target.value
                    )
                  }
                />
              )}

              {!isRent &&
                !isAccommodation &&
                form.propertyType !== "plot" && (
                <input
                  className={inputClass}
                  placeholder="Area / Size"
                  value={form.area}
                  onChange={(event) =>
                    update(
                      "area",
                      event.target.value
                    )
                  }
                />
              )}

              <input
                className={inputClass}
                placeholder="Contact Number *"
                inputMode="numeric"
                value={form.contact}
                onChange={(event) =>
                  update(
                    "contact",
                    event.target.value
                  )
                }
              />
            </div>

            {isResidential && (
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Bedrooms / BHK"
                  value={form.bedrooms}
                  onChange={(event) =>
                    update(
                      "bedrooms",
                      event.target.value
                    )
                  }
                />

                <input
                  className={inputClass}
                  placeholder="Bathrooms"
                  value={form.bathrooms}
                  onChange={(event) =>
                    update(
                      "bathrooms",
                      event.target.value
                    )
                  }
                />
              </div>
            )}

            {form.propertyType ===
              "plot" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Society / JDA Approval"
                  value={form.society}
                  onChange={(event) =>
                    update(
                      "society",
                      event.target.value
                    )
                  }
                />

                <input
                  className={inputClass}
                  placeholder="Plot Size"
                  value={form.plotSize}
                  onChange={(event) =>
                    update(
                      "plotSize",
                      event.target.value
                    )
                  }
                />
              </div>
            )}

            {isAccommodation && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <select
                  className={inputClass}
                  value={form.roomType}
                  onChange={(event) =>
                    update(
                      "roomType",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Room Type
                  </option>
                  <option value="single">
                    Single Room
                  </option>
                  <option value="shared">
                    Shared Room
                  </option>
                  <option value="private">
                    Private Room
                  </option>
                </select>

                <select
                  className={inputClass}
                  value={form.sharingType}
                  onChange={(event) =>
                    update(
                      "sharingType",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Sharing
                  </option>
                  <option value="1">
                    1 Sharing
                  </option>
                  <option value="2">
                    2 Sharing
                  </option>
                  <option value="3">
                    3 Sharing
                  </option>
                  <option value="4">
                    4 Sharing
                  </option>
                </select>

                <select
                  className={inputClass}
                  value={form.suitableFor}
                  onChange={(event) =>
                    update(
                      "suitableFor",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Suitable For
                  </option>

                  <option value="boys">
                    Boys
                  </option>

                  <option value="girls">
                    Girls
                  </option>

                  {form.propertyType ===
                    "pg" && (
                    <option value="co_living">
                      Co-Living
                    </option>
                  )}

                  {form.propertyType ===
                    "room_rent" && (
                    <option value="family">
                      Family
                    </option>
                  )}
                </select>

                <select
                  className={inputClass}
                  value={form.ac}
                  onChange={(event) =>
                    update(
                      "ac",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    AC Facility
                  </option>
                  <option value="yes">
                    AC
                  </option>
                  <option value="no">
                    Non-AC
                  </option>
                </select>

                <select
                  className={inputClass}
                  value={form.food}
                  onChange={(event) =>
                    update(
                      "food",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Food Facility
                  </option>
                  <option value="yes">
                    Food Available
                  </option>
                  <option value="no">
                    No Food
                  </option>
                </select>

                <select
                  className={inputClass}
                  value={form.kitchen}
                  onChange={(event) =>
                    update(
                      "kitchen",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Kitchen
                  </option>
                  <option value="yes">
                    Kitchen Available
                  </option>
                  <option value="no">
                    No Kitchen
                  </option>
                </select>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <select
                className={inputClass}
                value={form.parking}
                onChange={(event) =>
                  update(
                    "parking",
                    event.target.value
                  )
                }
              >
                <option value="">
                  Parking
                </option>
                <option value="Yes">
                  Yes
                </option>
                <option value="No">
                  No
                </option>
                <option value="1 Car">
                  1 Car
                </option>
                <option value="2 Cars">
                  2 Cars
                </option>
              </select>

              <select
                className={inputClass}
                value={form.furnished}
                onChange={(event) =>
                  update(
                    "furnished",
                    event.target.value
                  )
                }
              >
                <option value="">
                  Furnished Status
                </option>
                <option value="Fully Furnished">
                  Fully Furnished
                </option>
                <option value="Semi Furnished">
                  Semi Furnished
                </option>
                <option value="Unfurnished">
                  Unfurnished
                </option>
              </select>
            </div>

            {isNew &&
              form.propertyType !==
                "plot" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    className={inputClass}
                    placeholder="Project Name"
                    value={form.projectName}
                    onChange={(event) =>
                      update(
                        "projectName",
                        event.target.value
                      )
                    }
                  />

                  <input
                    className={inputClass}
                    placeholder="RERA Number"
                    value={form.reraNumber}
                    onChange={(event) =>
                      update(
                        "reraNumber",
                        event.target.value
                      )
                    }
                  />
                </div>
              )}

            <textarea
              className={`${inputClass} min-h-32 resize-y`}
              placeholder="Property Description"
              value={form.description}
              onChange={(event) =>
                update(
                  "description",
                  event.target.value
                )
              }
            />
          </section>

          <section className="rounded-2xl border border-[#D8EBDD] p-5">
            <h2 className="text-lg font-black">
              Facilities & Amenities
            </h2>

            <p className="mt-1 text-sm text-[#64756A]">
              Select all facilities available
              at this property.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableAmenities.map(
                (amenity) => {
                  const selected =
                    form.amenities.includes(
                      amenity
                    );

                  return (
                    <label
                      key={amenity}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                        selected
                          ? "border-[#16A34A] bg-[#EAF7EE]"
                          : "border-[#C9DACE] bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          toggleAmenity(
                            amenity
                          )
                        }
                        className="h-4 w-4 accent-green-600"
                      />

                      <span className="font-semibold">
                        {amenity}
                      </span>
                    </label>
                  );
                }
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[#D8EBDD] p-5">
            <h2 className="text-lg font-black">
              Exact Property Location
            </h2>

            <p className="mb-4 mt-1 text-sm text-[#64756A]">
              Click on the map to place the
              property pin.
            </p>

            <div className="overflow-hidden rounded-2xl border border-[#C9DACE]">
              <LocationPicker
                onLocationSelect={(
                  data
                ) => {
                  setLocationData({
                    latitude:
                      String(
                        data.latitude
                      ),
                    longitude:
                      String(
                        data.longitude
                      ),
                  });
                }}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                readOnly
                className={inputClass}
                value={
                  locationData.latitude
                }
                placeholder="Latitude"
              />

              <input
                readOnly
                className={inputClass}
                value={
                  locationData.longitude
                }
                placeholder="Longitude"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-[#8BC99A] bg-[#F1FAF3] p-5">
            <h2 className="text-lg font-black">
              Property Images
            </h2>

            <p className="mt-1 text-sm text-[#64756A]">
              Upload up to 10 images. First
              image will be used as cover.
            </p>

            <label
              htmlFor="dealer-property-images"
              className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-[#B8D9C0] bg-white p-6 text-center transition hover:border-[#16A34A]"
            >
              <span className="text-3xl">
                📷
              </span>

              <span className="mt-2 font-black text-[#15803D]">
                Choose Property Images
              </span>

              <span className="mt-1 text-xs text-[#7A897F]">
                JPG, PNG, WebP or AVIF ·
                maximum 10 MB each
              </span>
            </label>

            <input
              id="dealer-property-images"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="sr-only"
              onChange={selectImages}
            />

            {previewImages.length >
              0 && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {previewImages.map(
                  (src, index) => (
                    <div
                      key={src}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#C9DACE]"
                    >
                      <Image
                        src={src}
                        alt={`Property image ${index + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />

                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-[#16A34A] px-2 py-1 text-xs font-bold text-white">
                          Cover
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 font-bold text-white"
                      >
                        ×
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </section>


          {isNew &&
            ["flat", "villa", "house"].includes(
              form.propertyType
            ) && (
              <PropertyConfigurationsField
                value={configurations}
                onChange={setConfigurations}
              />
            )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#16A34A] px-6 py-4 text-lg font-black text-white shadow-lg shadow-green-200 transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:bg-[#9DBFA6]"
          >
            {loading
              ? "Publishing Property..."
              : "Publish Property →"}
          </button>
        </form>
      </div>
    </div>
  );
}
