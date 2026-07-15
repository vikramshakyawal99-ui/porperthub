"use client";

interface PropertyFormProps {
  title: string;
  setTitle: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
}

export default function PropertyForm({
  title,
  setTitle,
  location,
  setLocation,
  price,
  setPrice,
}: PropertyFormProps) {
  return (
    <div className="space-y-5">
      <input
        className="w-full rounded-xl border p-3"
        placeholder="Property Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="w-full rounded-xl border p-3"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <input
        className="w-full rounded-xl border p-3"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
    </div>
  );
}
