export default function CityBar() {
  return (
    <section className="relative z-20 border-b border-[#60A5FA]/15 bg-[#17130f]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-10">

        <button
          className="
            flex items-center gap-2
            rounded-xl
            border border-[#60A5FA]/25
            bg-[#211b15]/70
            px-5 py-2
            text-sm font-semibold
            text-[#eee5d8]
            shadow-sm
            backdrop-blur-md
            transition-all duration-300
            hover:border-[#60A5FA]/60
            hover:bg-[#60A5FA]/10
            hover:text-[#60A5FA]
          "
        >
          <span className="text-[#60A5FA]">📍</span>
          Jaipur
          <span className="text-xs text-[#9f9586]">▼</span>
        </button>

        <button
          className="
            rounded-xl
            border border-[#60A5FA]/25
            bg-[#211b15]/70
            px-5 py-2
            text-sm font-semibold
            text-[#eee5d8]
            shadow-sm
            backdrop-blur-md
            transition-all duration-300
            hover:border-[#60A5FA]/60
            hover:bg-[#60A5FA]/10
            hover:text-[#60A5FA]
          "
        >
          📞 Help & Contact
        </button>

      </div>
    </section>
  );
}
