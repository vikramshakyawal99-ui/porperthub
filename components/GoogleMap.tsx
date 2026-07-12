type Props = {
  location: string;
};

export default function GoogleMap({ location }: Props) {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    location
  )}&output=embed`;

  const openMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location
  )}`;

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="mb-2 text-3xl font-bold text-gray-900">
        🗺️ Property Location
      </h2>

      <p className="mb-6 text-gray-600">
        {location}
      </p>

      <div className="overflow-hidden rounded-2xl border shadow">
        <iframe
          title="Property Location"
          src={mapUrl}
          width="100%"
          height="450"
          loading="lazy"
          className="border-0"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-6">
        <a
          href={openMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          📍 Open in Google Maps
        </a>
      </div>
    </div>
  );
}