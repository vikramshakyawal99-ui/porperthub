type Props = {
  builder: string;
  builderContact?: string;
  projectName?: string;
  reraNumber?: string;
};

export default function BuilderCard({
  builder,
  builderContact,
  projectName,
  reraNumber,
}: Props) {
  return (
    <div className="mt-10 rounded-3xl border bg-zinc-900 p-8 shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        🏢 Builder Information
      </h2>

      <div className="flex flex-col items-center gap-6 md:flex-row">
        <img
          src="https://placehold.co/120x120?text=Logo"
          alt="Builder Logo"
          className="h-28 w-28 rounded-full border object-cover"
        />

        <div className="flex-1">
          <h3 className="text-2xl font-bold">{builder}</h3>

          <p className="mt-2 text-gray-300">
            Trusted real estate developer with quality residential projects
            across Jaipur.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
              ⭐ 4.8 Rating
            </span>

            <span className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700">
              🏗️ 25+ Projects
            </span>

            <span className="rounded-full bg-purple-100 px-4 py-2 font-semibold text-purple-700">
              📅 20+ Years
            </span>

            <span className="rounded-full bg-orange-100 px-4 py-2 font-semibold text-orange-700">
              ✔️ RERA Approved
            </span>
          </div>

          <div className="mt-6 space-y-3">

            <p><strong>🏗 Project:</strong> {projectName || "-"}</p>

            <p><strong>📋 RERA:</strong> {reraNumber || "-"}</p>

            <a
              href={builderContact ? `tel:${builderContact}` : "#"}
              className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              📞 Call Builder
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}