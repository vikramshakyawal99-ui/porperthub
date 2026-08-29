"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import LocationPicker from "@/components/LocationPicker";
import PropertyConfigurationsField, {
  type PropertyConfiguration,
} from "@/components/PropertyConfigurationsField";


const TYPES_BY_PURPOSE: Record<string, string[]> = {
  new: ["flat", "villa", "house", "plot"],
  resale: ["flat", "villa", "house", "plot"],
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

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("");

  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [contact, setContact] = useState("");
  const [parking, setParking] = useState("");
  const [furnished, setFurnished] = useState("");
  const [society, setSociety] = useState("");
  const [plotSize, setPlotSize] = useState("");
  const [projectName, setProjectName] = useState("");
  const [reraNumber, setReraNumber] = useState("");
  const [constructionStatus, setConstructionStatus] =
    useState("under_construction");

  // PG / HOSTEL / ROOM DETAILS
  const [roomType, setRoomType] = useState("");
  const [sharingType, setSharingType] = useState("");
  const [suitableFor, setSuitableFor] = useState("");
  const [ac, setAc] = useState("");
  const [food, setFood] = useState("");
  const [kitchen, setKitchen] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  const [locationData, setLocationData] = useState({
    latitude: "",
    longitude: "",
  });

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [configurations, setConfigurations] =
    useState<PropertyConfiguration[]>([]);

  const availableTypes =
    TYPES_BY_PURPOSE[purpose] || [];

  const availableAmenities =
    AMENITIES_BY_TYPE[type] || [];

  const isRent = purpose === "rent";

  const isNew = purpose === "new";

  const isResidential = [
    "flat",
    "villa",
    "house",
  ].includes(type);

  const isAccommodation = [
    "pg",
    "hostel",
    "room_rent",
  ].includes(type);

  function selectPurpose(nextPurpose: string) {
    const nextTypes =
      TYPES_BY_PURPOSE[nextPurpose] || [];

    setPurpose(nextPurpose);

    if (!nextTypes.includes(type)) {
      setType(nextTypes[0] || "");
      setAmenities([]);
    }
  }

  function selectPropertyType(nextType: string) {
    if (nextType === type) return;

    setType(nextType);
    setAmenities([]);
  }

  function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter(
            (item) => item !== amenity
          )
        : [...current, amenity]
    );
  }

  useEffect(() => {
    async function loadProperty() {
      const user = auth.currentUser;

      if (!user) {
        router.push("/dealer-login");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "properties", id));

        if (!snap.exists()) {
          alert("Property not found");
          router.push("/dealer/listings");
          return;
        }

        const data: any = snap.data();

        if (data.dealerId !== user.uid) {
          alert("Access denied");
          router.push("/dealer/listings");
          return;
        }

        setTitle(data.title || "");
        setLocation(data.location || "");
        const savedPurpose = String(data.purpose || "");
        const savedType = String(data.propertyType || "");

        setPurpose(savedPurpose);
        setType(savedType);

        setPrice(
          savedPurpose === "rent" ||
          ["pg", "hostel", "room_rent"].includes(savedType)
            ? String(data.rent || data.price || "")
            : String(data.price || "")
        );

        setDescription(data.description || "");

        setCity(String(data.city || "Jaipur"));
        setBedrooms(String(data.bedrooms || ""));
        setBathrooms(String(data.bathrooms || ""));
        setArea(String(data.area || ""));
        setContact(
          String(
            data.contact ||
            data.phone ||
            data.ownerPhone ||
            ""
          )
        );
        setParking(String(data.parking || ""));
        setFurnished(String(data.furnished || ""));
        setSociety(String(data.society || ""));
        setPlotSize(String(data.plotSize || ""));
        setProjectName(String(data.projectName || ""));
        setReraNumber(String(data.reraNumber || ""));
        setConstructionStatus(
          String(
            data.constructionStatus ||
            "under_construction"
          )
        );

        setRoomType(String(data.roomType || ""));
        setSharingType(String(data.sharingType || ""));
        setSuitableFor(String(data.suitableFor || ""));
        setAc(String(data.ac || ""));
        setFood(String(data.food || ""));
        setKitchen(String(data.kitchen || ""));

        setAmenities(
          Array.isArray(data.amenities)
            ? data.amenities.map(String)
            : []
        );

        setLocationData({
          latitude:
            data.latitude !== undefined &&
            data.latitude !== null
              ? String(data.latitude)
              : "",
          longitude:
            data.longitude !== undefined &&
            data.longitude !== null
              ? String(data.longitude)
              : "",
        });

        const savedImages =
          Array.isArray(data.images) && data.images.length > 0
            ? data.images.map(String)
            : data.image
              ? [String(data.image)]
              : [];

        setExistingImages(savedImages.slice(0, 10));

        setConfigurations(
          Array.isArray(data.configurations)
            ? data.configurations.map(
                (item: any, index: number) => ({
                  id: `saved-${index}-${Date.now()}`,
                  bhk: String(item.bhk || ""),
                  areaMin: String(item.areaMin || ""),
                  areaMax: String(item.areaMax || ""),
                  priceMin: String(item.priceMin || ""),
                  priceMax: String(item.priceMax || ""),
                })
              )
            : []
        );

      } catch (err) {
        console.log(err);
        alert("Failed to load property");
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id, router]);

  function selectNewImages(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const picked = Array.from(event.target.files || []);

    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ]);

    const invalidFile = picked.find(
      (file) =>
        !allowedTypes.has(file.type) ||
        file.size > 10 * 1024 * 1024
    );

    if (invalidFile) {
      alert(
        "Only JPG, PNG, WebP and AVIF images under 10 MB are allowed."
      );
      event.target.value = "";
      return;
    }

    const totalCurrent =
      existingImages.length + newImages.length;

    const remainingSlots =
      Math.max(0, 10 - totalCurrent);

    if (remainingSlots === 0) {
      alert("Maximum 10 property images are allowed.");
      event.target.value = "";
      return;
    }

    const selected = picked.slice(0, remainingSlots);

    if (picked.length > remainingSlots) {
      alert(
        `Only ${remainingSlots} more image${
          remainingSlots === 1 ? "" : "s"
        } can be added. Maximum is 10.`
      );
    }

    setNewImages((current) => [
      ...current,
      ...selected,
    ]);

    setNewImagePreviews((current) => [
      ...current,
      ...selected.map((file) =>
        URL.createObjectURL(file)
      ),
    ]);

    event.target.value = "";
  }

  function removeExistingImage(index: number) {
    setExistingImages((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  }

  function removeNewImage(index: number) {
    const preview = newImagePreviews[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setNewImages((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );

    setNewImagePreviews((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  }

  async function saveProperty() {
    const user = auth.currentUser;

    if (!user) {
      alert("Login required");
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

    if (
      !title.trim() ||
      !city.trim() ||
      !location.trim() ||
      (!price.trim() && !primaryConfiguration)
    ) {
      alert(
        "Title, city, location and price/rent are required"
      );
      return;
    }

    try {
      setSaving(true);

      if (
        existingImages.length === 0 &&
        newImages.length === 0
      ) {
        alert("Please keep or upload at least one property image.");
        return;
      }

      const uploadedNewImages =
        newImages.length > 0
          ? await Promise.all(
              newImages.map((file) =>
                uploadToCloudinary(file)
              )
            )
          : [];

      const finalImages = [
        ...existingImages,
        ...uploadedNewImages,
      ].slice(0, 10);

      const propertyRef = doc(db, "properties", id);
      const snap = await getDoc(propertyRef);

      if (!snap.exists()) {
        alert("Property not found");
        return;
      }

      const currentData: any = snap.data();

      if (currentData.dealerId !== user.uid) {
        alert("Access denied");
        router.push("/dealer/listings");
        return;
      }

      await updateDoc(propertyRef, {
        title: title.trim(),
        purpose,
        propertyType: type,
        type,
        city: city.trim(),
        location: location.trim(),

        bathrooms: bathrooms.trim(),
        contact: contact.trim(),
        parking,
        furnished,
        society: society.trim(),
        plotSize: plotSize.trim(),
        projectName: projectName.trim(),
        reraNumber: reraNumber.trim(),

        constructionStatus:
          isNew
            ? constructionStatus
            : "",

        possession:
          isNew
            ? constructionStatus === "ready_to_move"
              ? "Ready to Move"
              : constructionStatus === "complete_within_1_year"
                ? "Complete Within 1 Year"
                : "Under Construction"
            : "",
        ...(purpose === "rent" ||
        ["pg", "hostel", "room_rent"].includes(type)
          ? {
              rent: price.trim(),
              price: currentData.price || "",
            }
          : {
              price: primaryConfiguration
                ? String(primaryConfiguration.priceMin)
                : price.trim(),
            }),
        bedrooms:
          primaryConfiguration
            ? String(primaryConfiguration.bhk)
            : bedrooms.trim(),

        area:
          primaryConfiguration
            ? String(primaryConfiguration.areaMin)
            : area.trim(),
        configurations:
          normalizedConfigurations,

        description: description.trim(),

        roomType,
        sharingType,
        suitableFor,
        ac,
        food,
        kitchen,
        amenities,

        latitude:
          locationData.latitude !== ""
            ? Number(locationData.latitude)
            : currentData.latitude ?? "",

        longitude:
          locationData.longitude !== ""
            ? Number(locationData.longitude)
            : currentData.longitude ?? "",

        images: finalImages,
        image: finalImages[0] || "",

        updatedAt: new Date(),
      });

      alert("Property updated successfully");
      router.push("/dealer/listings");
    } catch (err) {
      console.log("Property update error:", err);
      alert("Property update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FAF6] px-4 py-8 text-[#102A1A] sm:px-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-[#DCE9DF] bg-white p-5 shadow-[0_20px_60px_rgba(16,42,26,0.10)] sm:p-8">

        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#16A34A]">
          Manage Listing
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Edit Property
        </h1>

        <p className="mt-2 text-sm text-[#64756A]">
          Update property details, facilities, images and exact map location.
        </p>

        <div className="space-y-7 mt-8">

          {/* LISTING CATEGORY */}
          <section className="rounded-2xl border border-[#D8EBDD] bg-[#F9FCFA] p-5">
            <h2 className="mb-4 text-lg font-black">
              Listing Category
            </h2>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["new", "New"],
                ["resale", "Resale"],
                ["rent", "Rent"],
                ["commercial", "Commercial"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    selectPurpose(value)
                  }
                  className={`rounded-xl border px-4 py-3 font-bold transition ${
                    purpose === value
                      ? "border-[#16A34A] bg-[#16A34A] text-white"
                      : "border-[#C9DACE] bg-white text-[#102A1A] hover:border-[#16A34A]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableTypes.map((itemType) => (
                <button
                  key={itemType}
                  type="button"
                  onClick={() =>
                    selectPropertyType(itemType)
                  }
                  className={`rounded-xl border px-4 py-3 font-bold transition ${
                    type === itemType
                      ? "border-[#15803D] bg-[#EAF7EE] text-[#15803D]"
                      : "border-[#C9DACE] bg-white"
                  }`}
                >
                  {TYPE_LABELS[itemType] ||
                    itemType}
                </button>
              ))}
            </div>
          </section>

          {/* CONSTRUCTION STATUS */}
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
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setConstructionStatus(value)
                    }
                    className={`rounded-xl border px-4 py-3 font-bold transition ${
                      constructionStatus === value
                        ? "border-[#16A34A] bg-[#EAF7EE] text-[#15803D]"
                        : "border-[#C9DACE] bg-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* PROPERTY DETAILS */}
          <section className="space-y-4 rounded-2xl border border-[#D8EBDD] p-5">
            <h2 className="text-lg font-black">
              Property Details
            </h2>

            <input
              className={inputClass}
              placeholder="Property Title *"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className={inputClass}
                placeholder="City *"
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
              />

              <input
                className={inputClass}
                placeholder="Location / Area *"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <input
                className={inputClass}
                placeholder={
                  isRent
                    ? "Monthly Rent *"
                    : "Property Price *"
                }
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
              />

              {!isRent &&
                !isAccommodation &&
                type !== "plot" && (
                  <input
                    className={inputClass}
                    placeholder="Area / Size"
                    value={area}
                    onChange={(event) =>
                      setArea(event.target.value)
                    }
                  />
                )}

              <input
                className={inputClass}
                placeholder="Contact Number"
                inputMode="numeric"
                value={contact}
                onChange={(event) =>
                  setContact(event.target.value)
                }
              />
            </div>

            {isResidential && (
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Bedrooms / BHK"
                  value={bedrooms}
                  onChange={(event) =>
                    setBedrooms(
                      event.target.value
                    )
                  }
                />

                <input
                  className={inputClass}
                  placeholder="Bathrooms"
                  value={bathrooms}
                  onChange={(event) =>
                    setBathrooms(
                      event.target.value
                    )
                  }
                />
              </div>
            )}

            {type === "plot" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Society / JDA Approval"
                  value={society}
                  onChange={(event) =>
                    setSociety(
                      event.target.value
                    )
                  }
                />

                <input
                  className={inputClass}
                  placeholder="Plot Size"
                  value={plotSize}
                  onChange={(event) =>
                    setPlotSize(
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
                  value={roomType}
                  onChange={(e) =>
                    setRoomType(e.target.value)
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
                  value={sharingType}
                  onChange={(e) =>
                    setSharingType(
                      e.target.value
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
                  value={suitableFor}
                  onChange={(e) =>
                    setSuitableFor(
                      e.target.value
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

                  {type === "pg" && (
                    <option value="co_living">
                      Co-Living
                    </option>
                  )}

                  {type ===
                    "room_rent" && (
                    <option value="family">
                      Family
                    </option>
                  )}
                </select>

                <select
                  className={inputClass}
                  value={ac}
                  onChange={(e) =>
                    setAc(e.target.value)
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
                  value={food}
                  onChange={(e) =>
                    setFood(e.target.value)
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
                  value={kitchen}
                  onChange={(e) =>
                    setKitchen(
                      e.target.value
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
                value={parking}
                onChange={(e) =>
                  setParking(e.target.value)
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
                value={furnished}
                onChange={(e) =>
                  setFurnished(e.target.value)
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
              type !== "plot" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    className={inputClass}
                    placeholder="Project Name"
                    value={projectName}
                    onChange={(e) =>
                      setProjectName(
                        e.target.value
                      )
                    }
                  />

                  <input
                    className={inputClass}
                    placeholder="RERA Number"
                    value={reraNumber}
                    onChange={(e) =>
                      setReraNumber(
                        e.target.value
                      )
                    }
                  />
                </div>
              )}

            <textarea
              className={`${inputClass} min-h-32 resize-y`}
              placeholder="Property Description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
            />
          </section>

          {/* AMENITIES */}
          <section className="rounded-2xl border border-[#D8EBDD] p-5">
            <h2 className="text-lg font-black">
              Facilities & Amenities
            </h2>

            <p className="mt-1 text-sm text-[#64756A]">
              Select all facilities available at this property.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableAmenities.map(
                (amenity) => {
                  const selected =
                    amenities.includes(
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

          <div className="rounded-2xl border border-green-100 bg-white p-5">
            <h2 className="text-lg font-bold text-green-800">
              Exact Property Location
            </h2>

            <p className="mb-4 mt-1 text-sm text-gray-500">
              Click on the map only if you want to update the property pin.
            </p>

            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <LocationPicker
                onLocationSelect={(data) => {
                  setLocationData({
                    latitude: String(data.latitude),
                    longitude: String(data.longitude),
                  });
                }}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                readOnly
                value={locationData.latitude}
                placeholder="Latitude"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3"
              />

              <input
                readOnly
                value={locationData.longitude}
                placeholder="Longitude"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-green-300 bg-green-50/50 p-5">
            <h2 className="text-lg font-bold text-green-800">
              Property Images
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Keep existing images or add new ones. Maximum 10 images.
            </p>

            {(existingImages.length > 0 ||
              newImagePreviews.length > 0) && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {existingImages.map((src, index) => (
                  <div
                    key={`existing-${src}-${index}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    <Image
                      src={src}
                      alt={`Property image ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />

                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white">
                        Cover
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        removeExistingImage(index)
                      }
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 font-bold text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {newImagePreviews.map((src, index) => {
                  const combinedIndex =
                    existingImages.length + index;

                  return (
                    <div
                      key={`new-${src}-${index}`}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-white"
                    >
                      <Image
                        src={src}
                        alt={`New property image ${index + 1}`}
                        fill
                        unoptimized
                        className="object-cover"
                      />

                      {combinedIndex === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white">
                          Cover
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeNewImage(index)
                        }
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 font-bold text-white"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}

                {existingImages.length +
                  newImagePreviews.length <
                  10 && (
                  <label
                    htmlFor="dealer-edit-property-images"
                    className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-green-400 bg-white transition hover:bg-green-50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-600 text-2xl font-black text-green-600">
                      +
                    </span>

                    <span className="mt-3 font-bold text-green-700">
                      Add Next Image
                    </span>

                    <span className="mt-1 text-xs text-gray-500">
                      {existingImages.length +
                        newImagePreviews.length}{" "}
                      / 10 uploaded
                    </span>
                  </label>
                )}
              </div>
            )}

            {existingImages.length === 0 &&
              newImagePreviews.length === 0 && (
                <label
                  htmlFor="dealer-edit-property-images"
                  className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-green-300 bg-white p-6 text-center"
                >
                  <span className="text-3xl">📷</span>

                  <span className="mt-2 font-bold text-green-700">
                    Choose Property Images
                  </span>

                  <span className="mt-1 text-xs text-gray-500">
                    JPG, PNG, WebP or AVIF · maximum 10 MB each
                  </span>
                </label>
              )}

            <input
              id="dealer-edit-property-images"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="sr-only"
              onChange={selectNewImages}
            />

            {(existingImages.length > 0 ||
              newImagePreviews.length > 0) && (
              <div className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-bold text-green-700">
                ✓ {existingImages.length +
                  newImagePreviews.length}{" "}
                / 10 images
              </div>
            )}
          </div>

          {(purpose === "new" ||
            configurations.length > 0) &&
            ["flat", "villa", "house"].includes(
              type
            ) && (
              <PropertyConfigurationsField
                value={configurations}
                onChange={setConfigurations}
              />
            )}

          <div className="flex gap-3 pt-3">

            <button
              type="button"
              onClick={() => router.push("/dealer/listings")}
              className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={saveProperty}
              disabled={saving}
              className="flex-1 bg-[#3B82F6] text-white py-3 rounded-xl font-semibold hover:bg-[#60A5FA] disabled:bg-gray-400"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
