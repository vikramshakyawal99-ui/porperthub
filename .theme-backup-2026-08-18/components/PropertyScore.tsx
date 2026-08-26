type Props = {
  rating: number;
};

export default function PropertyScore({ rating }: Props) {
  const scores = [
    { title: "📍 Location", value: 9.2 },
    { title: "📈 Investment", value: 8.8 },
    { title: "🏊 Amenities", value: 9.4 },
    { title: "🚇 Connectivity", value: 9.1 },
  ];

  const overall = (
    (scores.reduce((sum, item) => sum + item.value, 0) + rating * 2) /
    (scores.length + 1)
  ).toFixed(1);

  return (
    <section className="mt-10 rounded-3xl bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] p-8 text-white shadow-2xl">
      <h2 className="text-3xl font-bold">
        🤖 AI Property Score
      </h2>

      <p className="mt-2 opacity-90">
        AI-based analysis of this property
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {scores.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-zinc-900/10 p-5"
          >
            <div className="flex items-center justify-between">
              <span>{item.title}</span>
              <span className="font-bold">
                {item.value}/10
              </span>
            </div>

            <div className="mt-3 h-3 rounded-full bg-zinc-900/20">
              <div
                className="h-3 rounded-full bg-green-400"
                style={{ width: `${item.value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-zinc-900/20 p-6 text-center">
        <p className="text-lg">
          Overall Property Score
        </p>

        <h3 className="mt-2 text-5xl font-bold">
          {overall}/10
        </h3>
      </div>
    </section>
  );
}
