type Props = {
  location: string;
};

export default function NearbyPlaces({ location }: Props) {
  const places = [
    {
      name: "Metro Station",
      distance: "1.2 km",
      icon: "🚇",
    },
    {
      name: "Hospital",
      distance: "900 m",
      icon: "🏥",
    },
    {
      name: "School",
      distance: "700 m",
      icon: "🏫",
    },
    {
      name: "Shopping Mall",
      distance: "2.3 km",
      icon: "🛍️",
    },
    {
      name: "Airport",
      distance: "14 km",
      icon: "✈️",
    },
    {
      name: "Railway Station",
      distance: "8 km",
      icon: "🚉",
    },
  ];

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg">
      <h2 className="mb-2 text-3xl font-bold">
        📍 Nearby Places
      </h2>

      <p className="mb-8 text-gray-500">
        Around {location}
      </p>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {places.map((place, index) => (
          <div
            key={index}
            className="rounded-2xl border p-6 transition hover:scale-105 hover:shadow-xl"
          >
            <div className="text-4xl">
              {place.icon}
            </div>

            <h3 className="mt-4 text-xl font-bold">
              {place.name}
            </h3>

            <p className="mt-2 text-gray-600">
              Distance: {place.distance}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}