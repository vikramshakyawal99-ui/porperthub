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
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-3xl font-bold text-gray-900">
          Latest Projects
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-2 hover:shadow-xl"
            >
              <img
                src={project.image}
                alt={project.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold">
                  {project.name}
                </h3>

                <p className="mt-2 text-gray-500">
                  📍 {project.location}
                </p>

                <p className="mt-2 font-semibold text-green-600">
                  {project.price}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Builder: {project.builder}
                </p>

                <button className="mt-5 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white">
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