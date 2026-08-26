import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    id: 1,
    name: "Mahima Panorama",
    location: "Jagatpura, Jaipur",
    price: "Starting ₹65 Lac",
    builder: "Mahima Group",
    image: "/images/projects/mahima-panorama.jpg",
  },
  {
    id: 2,
    name: "Vatika Infotech City",
    location: "Ajmer Road, Jaipur",
    price: "Starting ₹72 Lac",
    builder: "Vatika Group",
    image: "/images/projects/vatika-infotech-city.jpg",
  },
  {
    id: 3,
    name: "Manglam Radiance",
    location: "Vaishali Nagar, Jaipur",
    price: "Starting ₹58 Lac",
    builder: "Manglam Group",
    image: "/images/projects/manglam-radiance.jpg",
  },
];

export default function LatestProjects() {
  return (
    <section className="relative overflow-hidden py-20">
      {/* Luxury glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#60A5FA]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#60A5FA]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* HEADER */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-[#60A5FA]/30 bg-[#60A5FA]/10 px-5 py-2 text-sm font-black text-[#60A5FA]">
            New Launches
          </span>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-white md:text-5xl">
            Discover Latest{" "}
            <span className="text-[#60A5FA]">Projects</span>
          </h2>

          <p className="mt-4 text-[#bdb7ad]">
            Discover upcoming premium residential projects.
          </p>
        </div>

        {/* PROJECTS */}
        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="
                group
                overflow-hidden
                rounded-3xl
                border border-white/10
                bg-white/[0.035]
                shadow-xl
                backdrop-blur
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-[#60A5FA]/40
                hover:shadow-[0_20px_50px_rgba(212,168,85,0.1)]
              "
            >
              {/* IMAGE */}
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080c15]/80 via-transparent to-transparent" />

                <span
                  className="
                    absolute
                    left-4
                    top-4
                    rounded-full
                    border border-[#60A5FA]/40
                    bg-[#080c15]/75
                    px-4
                    py-1.5
                    text-xs
                    font-bold
                    text-[#60A5FA]
                    backdrop-blur
                  "
                >
                  NEW PROJECT
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-7">
                <h3 className="text-2xl font-black text-[#f2ede4]">
                  {project.name}
                </h3>

                <p className="mt-3 text-sm text-[#aaa49a]">
                  📍 {project.location}
                </p>

                <p className="mt-4 text-xl font-black text-[#60A5FA]">
                  {project.price}
                </p>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-sm text-[#aaa49a]">Builder</p>

                  <p className="mt-1 font-bold text-[#e8dfd0]">
                    {project.builder}
                  </p>
                </div>

                <Link
                  href={`/properties?builder=${encodeURIComponent(
                    project.builder
                  )}`}
                  className="
                    mt-6
                    block
                    w-full
                    rounded-xl
                    border border-[#60A5FA]/50
                    bg-[#60A5FA]/10
                    py-3
                    text-center
                    font-black
                    text-[#60A5FA]
                    transition-all
                    hover:bg-[#60A5FA]
                    hover:text-[#080c15]
                    hover:shadow-[0_10px_30px_rgba(212,168,85,0.2)]
                  "
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
