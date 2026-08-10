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
      <h2 className="mb-6 text-3xl font-extrabold text-slate-900">
        ⭐ Premium Amenities
      </h2>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {amenities.map((item) => (
          <div
            key={item.name}
            className="group rounded-3xl border border-slate-200/80 bg-white/80 p-6 text-center shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 text-5xl shadow-inner transition duration-300 group-hover:scale-110">
              {item.icon}
            </div>

            <h3 className="font-bold text-slate-900">
              {item.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}