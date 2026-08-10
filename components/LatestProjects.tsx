import Image from "next/image";
const projects = [
  {
    id: 1,
    name: "Mahima Panorama",
    location: "Jagatpura, Jaipur",
    price: "Starting ₹65 Lac",
    builder: "Mahima Group",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
  },
  {
    id: 2,
    name: "Vatika Infotech City",
    location: "Ajmer Road, Jaipur",
    price: "Starting ₹72 Lac",
    builder: "Vatika Group",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
  },
  {
    id: 3,
    name: "Manglam Radiance",
    location: "Vaishali Nagar, Jaipur",
    price: "Starting ₹58 Lac",
    builder: "Manglam Group",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
  },
];

export default function LatestProjects() {
  return (
    <section className="bg-gradient-to-b from-white via-blue-50 to-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">

          <p className="inline-block rounded-full bg-blue-100 px-5 py-2 text-sm font-black text-blue-700">
            New Launches
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-tight text-slate-900">
            Latest Projects
          </h2>

          <p className="mt-4 text-slate-600">
            Discover upcoming premium residential projects.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl"
            >
              <Image
src={project.image}
alt={project.name}
width={600}
height={400}
className="h-60 w-full object-cover transition duration-500 group-hover:scale-110"
/>

              <div className="p-7">
                <h3 className="text-xl font-bold">
                  {project.name}
                </h3>

                <p className="mt-3 text-slate-600">
                  📍 {project.location}
                </p>

                <p className="mt-2 font-semibold text-green-600">
                  {project.price}
                </p>

                <p className="mt-3 text-sm text-slate-600">
                  Builder: {project.builder}
                </p>

                <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-black text-white shadow-lg transition hover:scale-[1.02]">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}