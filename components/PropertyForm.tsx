"use client";

import SearchableSelect from "./ui/SearchableSelect";

const CheckOption = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) => (
  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800/60 p-3 transition hover:border-[#d4a855]/50">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 accent-[#d4a855]"
    />
    <span className="text-sm text-white">{label}</span>
  </label>
);

interface PropertyFormProps {
  title: string;
  setTitle: (value: string) => void;

  featured: boolean;
  setFeatured: (value: boolean) => void;

  location: string;
  setLocation: (value: string) => void;

  price: string;
  setPrice: (value: string) => void;

  builder: string;
  setBuilder: (value: string) => void;

  builderContact: string;
  setBuilderContact: (value: string) => void;

  bedrooms: number;
  setBedrooms: (value: number) => void;

  bathrooms: number;
  setBathrooms: (value: number) => void;

  area: string;
  setArea: (value: string) => void;

  rating: number;
  setRating: (value: number) => void;

  description: string;
  setDescription: (value: string) => void;

  images: File[];
  setImages: (value: File[]) => void;

  projectName: string;
  setProjectName: (value: string) => void;

  reraNumber: string;
  setReraNumber: (value: string) => void;

  purpose: string;
  setPurpose: (value: string) => void;

  propertyCondition: string;
  setPropertyCondition: (value: string) => void;

  propertyType: string;
  setPropertyType: (value: string) => void;

  parking: string;
  setParking: (value: string) => void;

  furnished: string;
  setFurnished: (value: string) => void;

  plotApproval: string;
  setPlotApproval: (value: string) => void;

  societyName: string;
  setSocietyName: (value: string) => void;

  roomSharing: string;
  setRoomSharing: (value: string) => void;

  acType: string;
  setAcType: (value: string) => void;

  bathroomType: string;
  setBathroomType: (value: string) => void;

  kitchenAvailable: boolean;
  setKitchenAvailable: (value: boolean) => void;

  wifi: boolean;
  setWifi: (value: boolean) => void;

  cctv: boolean;
  setCctv: (value: boolean) => void;

  laundry: boolean;
  setLaundry: (value: boolean) => void;

  cleaning: boolean;
  setCleaning: (value: boolean) => void;

  security24x7: boolean;
  setSecurity24x7: (value: boolean) => void;
}

export default function PropertyForm({
  title,
  setTitle,

  featured,
  setFeatured,

  location,
  setLocation,

  price,
  setPrice,

  builder,
  setBuilder,
  builderContact,
  setBuilderContact,

  bedrooms,
  setBedrooms,

  bathrooms,
  setBathrooms,

  area,
  setArea,

  rating,
  setRating,

  description,
  setDescription,

  images: _images,
  setImages,

  projectName,
  setProjectName,

  reraNumber,
  setReraNumber,

  purpose,
  setPurpose,

  propertyCondition,
  setPropertyCondition,

  propertyType,
  setPropertyType,

  parking,
  setParking,

  furnished,
  setFurnished,

  plotApproval,
  setPlotApproval,

  societyName,
  setSocietyName,

  roomSharing,
  setRoomSharing,

  acType,
  setAcType,

  bathroomType,
  setBathroomType,

  kitchenAvailable,
  setKitchenAvailable,

  wifi,
  setWifi,

  cctv,
  setCctv,

  laundry,
  setLaundry,

  cleaning,
  setCleaning,

  security24x7,
  setSecurity24x7,
}: PropertyFormProps) {
  const isRent = purpose === "rent";
  const isResale = propertyCondition === "resale";
  const isCommercial = purpose === "commercial";
  const isNew = purpose === "new";

  const isResidential =
    propertyType === "flat" ||
    propertyType === "villa" ||
    propertyType === "house";

  const isPlot = propertyType === "plot";
  const isPgHostel = propertyType === "pg" || propertyType === "hostel";
  const isRoom = propertyType === "room";

  const showFurnished =
    (isResale && isResidential) ||
    (isRent && isResidential);

  const showBedrooms =
    isResidential &&
    !isPlot &&
    !isPgHostel &&
    !isRoom;

  const showBathrooms =
    isResidential &&
    !isPlot &&
    !isPgHostel &&
    !isRoom;

  const showPlotFields =
    isResale && isPlot;

  const showPgHostelFields =
    isRent && isPgHostel;

  const showRoomFields =
    isRent && isRoom;

  const showRentalAmenities =
    showPgHostelFields || showRoomFields;

  return (
    <div className="space-y-5">
      <CheckOption
        label="⭐ Featured Property — Show on Home Featured Properties"
        checked={featured}
        onChange={setFeatured}
      />

      <SearchableSelect
        label="Property Title"
        value={title}
        onChange={setTitle}
        options={[
          "Luxury 3 BHK Apartment",
          "Premium Villa",
          "Modern Flat",
          "Independent House",
          "Resale Apartment",
          "Residential Plot",
          "Room",
          "PG",
          "Hostel",
        ]}
      />

      <SearchableSelect
        label="Location"
        value={location}
        onChange={setLocation}
        options={[
          "Vaishali Nagar",
          "Jagatpura",
          "Mansarovar",
          "Ajmer Road",
          "Tonk Road",
          "C-Scheme",
          "Malviya Nagar",
          "Raja Park",
        ]}
      />

      <SearchableSelect
        label="Category"
        value={
          isRent
            ? "Rent"
            : isResale
            ? "Resale"
            : isCommercial
            ? "Commercial"
            : "New"
        }
        onChange={(value) => {
          if (value === "Rent") {
            setPurpose("rent");
            setPropertyCondition("new");
            setPropertyType("flat");

          } else if (value === "Resale") {
            setPurpose("resale");
            setPropertyCondition("resale");
            setPropertyType("flat");

          } else if (value === "Commercial") {
            setPurpose("commercial");
            setPropertyCondition("new");
            setPropertyType("shop");

          } else {
            setPurpose("new");
            setPropertyCondition("new");
            setPropertyType("flat");
          }
        }}
        options={[
          "New",
          "Resale",
          "Rent",
          "Commercial",
        ]}
      />

      <SearchableSelect
        label="Property Type"
        value={propertyType}
        onChange={setPropertyType}
        options={
          isCommercial
            ? [
                "shop",
                "warehouse",
                "office space",
                "showroom",
                "commercial building",
                "industrial space",
              ]
            : isRent
            ? [
                "flat",
                "house",
                "villa",
                "room",
                "pg",
                "hostel",
              ]
            : [
                "flat",
                "house",
                "villa",
                "plot",
              ]
        }
      />

      {showFurnished && (
        <SearchableSelect
          label="Furnished Status"
          value={furnished}
          onChange={setFurnished}
          options={[
            "Fully Furnished",
            "Semi Furnished",
            "Unfurnished",
          ]}
        />
      )}

      {showBedrooms && (
        <SearchableSelect
          label={propertyType === "flat" ? "BHK" : "Rooms"}
          value={bedrooms ? String(bedrooms) : ""}
          onChange={(value) => setBedrooms(Number(value))}
          options={
            propertyType === "flat"
              ? ["1", "2", "3"]
              : ["1", "2", "3", "4", "5"]
          }
        />
      )}

      {showBathrooms && (
        <SearchableSelect
          label="Bathrooms"
          value={bathrooms ? String(bathrooms) : ""}
          onChange={(value) => setBathrooms(Number(value))}
          options={["1", "2", "3", "4", "5"]}
        />
      )}

      {showPlotFields && (
        <>
          <input
            className="w-full rounded-xl border p-3"
            placeholder="Plot Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />

          <SearchableSelect
            label="Plot Type"
            value={plotApproval}
            onChange={setPlotApproval}
            options={["JDA Approved", "Society Plot"]}
          />

          <input
            className="w-full rounded-xl border p-3"
            placeholder="Society Name"
            value={societyName}
            onChange={(e) => setSocietyName(e.target.value)}
          />
        </>
      )}

      {showPgHostelFields && (
        <>
          <SearchableSelect
            label="AC Type"
            value={acType}
            onChange={setAcType}
            options={["AC", "Non-AC"]}
          />

          <SearchableSelect
            label="Sharing"
            value={roomSharing}
            onChange={setRoomSharing}
            options={[
              "Single Sharing",
              "2 Sharing",
              "3 Sharing",
              "Non-Sharing",
            ]}
          />

          <SearchableSelect
            label="Bathroom"
            value={bathroomType}
            onChange={setBathroomType}
            options={["Attached / Private", "Common"]}
          />
        </>
      )}

      {showRoomFields && (
        <>
          <SearchableSelect
            label="AC Type"
            value={acType}
            onChange={setAcType}
            options={["AC", "Non-AC"]}
          />

          <SearchableSelect
            label="Bathroom"
            value={bathroomType}
            onChange={setBathroomType}
            options={["Attached / Private", "Common"]}
          />

          <CheckOption
            label="Kitchen Available"
            checked={kitchenAvailable}
            onChange={setKitchenAvailable}
          />
        </>
      )}

      {showRentalAmenities && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">
            Amenities
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <CheckOption
              label="📶 Wi-Fi"
              checked={wifi}
              onChange={setWifi}
            />

            <CheckOption
              label="📹 CCTV"
              checked={cctv}
              onChange={setCctv}
            />

            <CheckOption
              label="🧺 Laundry"
              checked={laundry}
              onChange={setLaundry}
            />

            <CheckOption
              label="🧹 Cleaning"
              checked={cleaning}
              onChange={setCleaning}
            />

            <CheckOption
              label="🚗 Parking"
              checked={parking !== "" && parking !== "No"}
              onChange={(value) => setParking(value ? "Yes" : "")}
            />

            <CheckOption
              label="🛡️ 24×7 Security"
              checked={security24x7}
              onChange={setSecurity24x7}
            />
          </div>
        </div>
      )}

      {isRent && isResidential && (
        <SearchableSelect
          label="Parking"
          value={parking}
          onChange={setParking}
          options={["Yes", "No", "1 Car", "2 Cars", "3 Cars"]}
        />
      )}

      <input
        className="w-full rounded-xl border p-3"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {isNew && !isPlot && (
        <>
          <SearchableSelect
            label="Builder"
            value={builder}
            onChange={setBuilder}
            options={[
              "Mahima Group",
              "Ashiana Housing",
              "Manglam Group",
              "Okay Plus",
              "Unique Builders",
            ]}
          />

          <input
            className="w-full rounded-xl border p-3"
            placeholder="Builder Contact"
            value={builderContact}
            onChange={(e) => setBuilderContact(e.target.value)}
          />
        </>
      )}

      {isResidential && (
        <>
          <input
            type="number"
            className="w-full rounded-xl border p-3"
            placeholder="Bedrooms / BHK"
            value={bedrooms || ""}
            onChange={(e) => setBedrooms(Number(e.target.value))}
          />

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            placeholder="Bathrooms"
            value={bathrooms || ""}
            onChange={(e) => setBathrooms(Number(e.target.value))}
          />

          <input
            className="w-full rounded-xl border p-3"
            placeholder="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </>
      )}

      <input
        type="number"
        className="w-full rounded-xl border p-3"
        placeholder="Rating"
        value={rating || ""}
        onChange={(e) => setRating(Number(e.target.value))}
      />

      {isNew && !isPlot && (
        <>
          <SearchableSelect
            label="Project Name"
            value={projectName}
            onChange={setProjectName}
            options={[
              "Mahima Panorama",
              "Mahima Nirvana",
              "Ashiana Amantran",
              "Manglam Ananda",
            ]}
          />

          <input
            className="w-full rounded-xl border p-3"
            placeholder="RERA Number"
            value={reraNumber}
            onChange={(e) => setReraNumber(e.target.value)}
          />
        </>
      )}

      <textarea
        className="w-full rounded-xl border p-3"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div>
        <label className="mb-2 block font-medium">
          Property Images
        </label>

        <input
          type="file"
          accept="image/*"
          multiple
          className="w-full rounded-xl border p-3"
          onChange={(e) => {
            setImages(Array.from(e.target.files || []));
          }}
        />
      </div>
    </div>
  );
}
