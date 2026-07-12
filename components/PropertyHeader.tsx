type Props = {
  title: string;
  location: string;
  price: string;
  rating: number;
};

export default function PropertyHeader({
  title,
  location,
  price,
  rating,
}: Props) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900">
          {title}
        </h1>

        <p className="mt-3 text-lg text-gray-700">
          📍 {location}
        </p>

        <div className="mt-3 flex items-center gap-2">
          ⭐⭐⭐⭐⭐
          <span className="font-semibold text-gray-700">
            {rating}/5
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-blue-600 px-8 py-5 text-center text-white shadow-lg">
        <p className="text-sm uppercase tracking-wide">
          Price
        </p>

        <h2 className="text-4xl font-bold">
          {price}
        </h2>
      </div>
    </div>
  );
}