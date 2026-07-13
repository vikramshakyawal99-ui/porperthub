type Props = {
  location: string;
};

export default function NearbyPlaces({ location }: Props) {

  const places = [
    {
      name: "Metro Station",
      distance: "1.2 km",
      icon: "🚇",
      category: "Connectivity",
    },
    {
      name: "Hospital",
      distance: "900 m",
      icon: "🏥",
      category: "Healthcare",
    },
    {
      name: "School",
      distance: "700 m",
      icon: "🏫",
      category: "Education",
    },
    {
      name: "Shopping Mall",
      distance: "2.3 km",
      icon: "🛍️",
      category: "Lifestyle",
    },
    {
      name: "Airport",
      distance: "14 km",
      icon: "✈️",
      category: "Travel",
    },
    {
      name: "Railway Station",
      distance: "8 km",
      icon: "🚉",
      category: "Transport",
    },
  ];


  return (
    <section className="mt-10 rounded-3xl bg-white p-8 shadow-xl">

      <div className="flex flex-col justify-between gap-5 md:flex-row">

        <div>
          <h2 className="text-3xl font-bold">
            📍 Nearby Places Intelligence
          </h2>

          <p className="mt-2 text-gray-500">
            Around {location}
          </p>
        </div>


        <div className="rounded-2xl bg-green-100 px-6 py-4 text-center">

          <p className="text-gray-600">
            Location Score
          </p>

          <h3 className="text-3xl font-bold text-green-700">
            9.2/10
          </h3>

        </div>

      </div>


      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

        {places.map((place)=>(
          
          <div
            key={place.name}
            className="rounded-2xl border p-6 transition hover:-translate-y-2 hover:shadow-xl"
          >

            <div className="text-5xl">
              {place.icon}
            </div>


            <span className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              {place.category}
            </span>


            <h3 className="mt-4 text-xl font-bold">
              {place.name}
            </h3>


            <p className="mt-2 text-gray-600">
              📏 {place.distance}
            </p>


          </div>

        ))}

      </div>


      <div className="mt-8 rounded-2xl bg-blue-50 p-5">

        <h3 className="text-xl font-bold">
          🚀 Location Analysis
        </h3>

        <p className="mt-2 text-gray-700">
          This location has strong connectivity with daily
          facilities, making it suitable for living and investment.
        </p>

      </div>


    </section>
  );
}
