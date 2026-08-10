import Image from "next/image";
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
    <div className="mt-12 rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 to-zinc-900 p-10 shadow-2xl">
      <h2 className="mb-8 text-4xl font-black tracking-tight text-white">
        🏢 Builder Information
      </h2>

      <div className="flex flex-col items-center gap-6 md:flex-row">
        <Image
          src="https://placehold.co/120x120?text=Logo"
          alt="Builder Logo"
          width={120}
          height={120}
          className="h-32 w-32 rounded-full border-4 border-white/20 object-cover shadow-xl"
        />

        <div className="flex-1">
          <h3 className="text-3xl font-black text-white">{builder}</h3>

          <p className="mt-3 text-lg text-slate-300">
            Trusted real estate developer with quality residential projects
            across Jaipur.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-green-500/20 px-4 py-2 font-bold text-green-300 border border-green-400/20">
              ⭐ 4.8 Rating
            </span>

            <span className="rounded-full bg-blue-500/20 px-4 py-2 font-bold text-blue-300 border border-blue-400/20">
              🏗️ 25+ Projects
            </span>

            <span className="rounded-full bg-purple-500/20 px-4 py-2 font-bold text-purple-300 border border-purple-400/20">
              📅 20+ Years
            </span>

            <span className="rounded-full bg-orange-500/20 px-4 py-2 font-bold text-orange-300 border border-orange-400/20">
              ✔️ RERA Approved
            </span>
          </div>

          <div className="mt-6 space-y-3">

            <p className="text-slate-200"><strong>🏗 Project:</strong> {projectName || "-"}</p>

            <p className="text-slate-200"><strong>📋 RERA:</strong> {reraNumber || "-"}</p>

            <a
              href={builderContact ? `tel:${builderContact}` : "#"}
              className="inline-block rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-black text-white shadow-xl hover:scale-[1.02]"
            >
              📞 Call Builder
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}