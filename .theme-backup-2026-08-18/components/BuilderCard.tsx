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
    <div>
      <div className="mb-6 text-2xl font-black text-white">
        🏢 Builder Information
      </div>

      <div className="flex flex-col items-center gap-6 md:flex-row">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-4 border-[#d4a855]/30 bg-[#d4a855]/10 text-5xl shadow-xl">
          🏢
        </div>

        <div className="flex-1">
          <h3 className="text-3xl font-black text-white">
            {builder}
          </h3>

          <p className="mt-3 text-lg text-slate-300">
            Trusted real estate developer with quality residential projects
            across Jaipur.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="rounded-full border border-green-400/20 bg-green-500/20 px-4 py-2 font-bold text-green-300">
              ⭐ 4.8 Rating
            </span>

            <span className="rounded-full border border-[#93C5FD]/20 bg-[#60A5FA]/20 px-4 py-2 font-bold text-[#BFDBFE]">
              🏗️ 25+ Projects
            </span>

            <span className="rounded-full border border-purple-400/20 bg-purple-500/20 px-4 py-2 font-bold text-purple-300">
              📅 20+ Years
            </span>

            <span className="rounded-full border border-orange-400/20 bg-orange-500/20 px-4 py-2 font-bold text-orange-300">
              ✔️ RERA Approved
            </span>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-slate-200">
              <strong>🏗 Project:</strong> {projectName || "-"}
            </p>

            <p className="text-slate-200">
              <strong>📋 RERA:</strong> {reraNumber || "-"}
            </p>

            <a
              href={builderContact ? `tel:${builderContact}` : "#"}
              className="inline-block rounded-xl bg-gradient-to-r from-[#60A5FA] to-[#60A5FA] px-8 py-3 font-black text-white shadow-xl hover:scale-[1.02]"
            >
              📞 Call Builder
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
