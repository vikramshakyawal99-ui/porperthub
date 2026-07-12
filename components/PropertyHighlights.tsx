type Props = {
  builder: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  parking: string;
  possession: string;
};

export default function PropertyHighlights({
  builder,
  bedrooms,
  bathrooms,
  area,
  parking,
  possession,
}: Props) {
  return (
    <>
      <h2 className="mb-6 text-3xl font-bold text-gray-900">
        Property Highlights
      </h2>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
        <Card title="Builder" value={builder} />
        <Card title="Bedrooms" value={`🛏 ${bedrooms}`} />
        <Card title="Bathrooms" value={`🛁 ${bathrooms}`} />
        <Card title="Area" value={`📐 ${area}`} />
        <Card title="Parking" value={`🚗 ${parking}`} />
        <Card title="Possession" value={`🏠 ${possession}`} />
      </div>
    </>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-blue-50 p-5 shadow">
      <h3 className="text-gray-500">{title}</h3>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}