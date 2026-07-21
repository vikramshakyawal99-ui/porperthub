"use client";

import SearchableSelect from "./ui/SearchableSelect";

interface PropertyFormProps {
  description: string;
  setDescription: (value: string) => void;

  images: File[];
  setImages: (value: File[]) => void;

  projectName: string;
  setProjectName: (value: string) => void;

  reraNumber: string;
  setReraNumber: (value: string) => void;

  propertyType: string;
  setPropertyType: (value: string) => void;

  title: string;
  setTitle: (value: string) => void;
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

  setImages: (value: File[]) => void;
}

export default function PropertyForm({
  title,
  setTitle,
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

  images,
  setImages,

  projectName,
  setProjectName,

  reraNumber,
  setReraNumber,

  propertyType,
  setPropertyType,
}: PropertyFormProps) {
  return (
    <div className="space-y-5">
      <SearchableSelect
        label="Property Title"
        value={title}
        onChange={setTitle}
        options={[
          "Luxury 3 BHK Apartment",
          "Premium Villa",
          "Modern 2 BHK Flat",
          "Luxury Penthouse",
          "Residential Plot",
          "Commercial Space",
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
          "Durgapura",
          "Jhotwara",
          "Sodala",
          "Vidhyadhar Nagar",
          "Pratap Nagar",
          "Sanganer",
          "Bani Park",
          "Civil Lines",
          "Shyam Nagar",
          "Gopalpura",
          "Khatipura",
          "Mahapura",
        ]}
      />

      <input
        className="w-full rounded-xl border p-3"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
    
      <SearchableSelect
        label="Builder"
        value={builder}
        onChange={setBuilder}
        options={[
          "Mahima Group",
          "Ashiana Housing",
          "Manglam Group",
          "Ravi Builders",
          "Okay Plus",
          "Unique Builders",
        ]}
      />

      <input
        type="tel"
        className="w-full rounded-xl border p-3"
        placeholder="Builder Contact Number"
        value={builderContact}
        onChange={(e) => setBuilderContact(e.target.value)}
      />

      <input
        type="number"
        className="w-full rounded-xl border p-3"
        placeholder="Bedrooms"
        value={bedrooms}
        onChange={(e) => setBedrooms(Number(e.target.value))}
      />

      <input
        type="number"
        className="w-full rounded-xl border p-3"
        placeholder="Bathrooms"
        value={bathrooms}
        onChange={(e) => setBathrooms(Number(e.target.value))}
      />

      <input
        className="w-full rounded-xl border p-3"
        placeholder="Area (e.g. 1650 sq.ft.)"
        value={area}
        onChange={(e) => setArea(e.target.value)}
      />

      <input
        type="number"
        step="0.1"
        className="w-full rounded-xl border p-3"
        placeholder="Rating"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />

      <SearchableSelect
        label="Project Name"
        value={projectName}
        onChange={setProjectName}
        options={[
          "Mahima Panorama",
          "Mahima Nirvana",
          "Ashiana Amantran",
          "Manglam Ananda",
          "Okay Plus Solitaire",
          "Unique Sapphire",
        ]}
      />

      <input
        type="text"
        className="w-full rounded-xl border p-3"
        placeholder="RERA Number"
        value={reraNumber}
        onChange={(e) => setReraNumber(e.target.value)}
      />

      <SearchableSelect
        label="Property Type"
        value={propertyType}
        onChange={setPropertyType}
        options={[
          "Apartment",
          "Villa",
          "Plot",
          "Penthouse",
          "Commercial",
        ]}
      />

      <textarea
        className="w-full rounded-xl border p-3"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div>
        <label className="block mb-2 font-medium">
          Property Images
        </label>

        <input
          type="file"
          accept="image/*"
          multiple
          className="w-full rounded-xl border p-3"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setImages(files);
          }}
        />

        {images.length > 0 && (
          <p className="mt-2 text-sm text-gray-300">
            {images.length} images selected
          </p>
        )}
      </div>

    </div>
  );
}
