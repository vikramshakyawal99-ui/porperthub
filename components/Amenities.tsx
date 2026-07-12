export default function Amenities() {
  const amenities = [
    { icon: "🏊", name: "Swimming Pool" },
    { icon: "🏋️", name: "Gym" },
    { icon: "🌳", name: "Garden" },
    { icon: "🚗", name: "Parking" },
    { icon: "🛗", name: "Lift" },
    { icon: "🔒", name: "24x7 Security" },
    { icon: "⚡", name: "Power Backup" },
    { icon: "🎮", name: "Kids Play Area" },
    { icon: "🏸", name: "Sports Court" },
    { icon: "🏢", name: "Club House" },
    { icon: "📶", name: "High Speed WiFi" },
    { icon: "🛒", name: "Nearby Market" },
  ];

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        Premium Amenities
      </h2>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {amenities.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-xl"
          >
            <div className="mb-3 text-5xl">{item.icon}</div>

            <h3 className="font-semibold text-gray-800">
              {item.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}