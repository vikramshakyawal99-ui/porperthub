export default function CityBar() {
  return (
    <section className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 border-b border-white/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <button className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2 text-white backdrop-blur transition hover:bg-white/20">
          📍 Jaipur
          <span>▼</span>
        </button>

        <button className="rounded-xl border border-white/20 bg-white/10 px-5 py-2 text-white backdrop-blur transition hover:bg-white/20">
          📞 Help & Contact
        </button>

      </div>
    </section>
  );
}
