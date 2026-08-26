type Props = {
  amenities?: string[];
};

const amenityIcons: Record<string, string> = {
  "Swimming Pool": "🏊",
  "Gym": "🏋️",
  "Garden": "🌳",
  "Parking": "🚗",
  "Lift": "🛗",
  "24x7 Security": "🔒",
  "CCTV / Security": "🔒",
  "Power Backup": "⚡",
  "Kids Play Area": "🎮",
  "Sports Court": "🏸",
  "Club House": "🏢",
  "High Speed WiFi": "📶",
  "WiFi": "📶",
  "Food": "🍱",
  "Food / Mess": "🍽️",
  "Laundry": "🧺",
  "Cleaning": "🧹",
  "AC": "❄️",
  "Attached Bathroom": "🚿",
  "Kitchen": "🍳",
  "Geyser": "🔥",
  "Bed": "🛏️",
  "Wardrobe": "👔",
  "Study Table": "📚",
  "Common Area": "🛋️",
};

export default function Amenities({ amenities = [] }: Props) {
  const selectedAmenities = amenities.filter(
    (item) => item && amenityIcons[item]
  );

  if (selectedAmenities.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-3xl font-extrabold text-slate-900">
        ⭐ Amenities
      </h2>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {selectedAmenities.map((item) => (
          <div
            key={item}
            className="group rounded-3xl border border-slate-200/80 bg-white/80 p-6 text-center shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#60A5FA] hover:shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 text-5xl shadow-inner transition duration-300 group-hover:scale-110">
              {amenityIcons[item]}
            </div>

            <h3 className="font-bold text-slate-900">
              {item}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
