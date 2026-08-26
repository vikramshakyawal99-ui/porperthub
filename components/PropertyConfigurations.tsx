type Configuration = {
  bhk?: number | string;
  areaMin?: number | string;
  areaMax?: number | string;
  priceMin?: number | string;
  priceMax?: number | string;
};

type Props = {
  configurations?: Configuration[];
  propertyType?: string;
};

function formatIndianPrice(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "Price on request";
  }

  if (value >= 10000000) {
    const crore = value / 10000000;

    return `₹${crore.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })} Cr`;
  }

  if (value >= 100000) {
    const lakh = value / 100000;

    return `₹${lakh.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })} L`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}

function formatRange(
  minimumValue: number,
  maximumValue: number,
  formatter: (value: number) => string
) {
  if (
    maximumValue > 0 &&
    maximumValue !== minimumValue
  ) {
    return `${formatter(minimumValue)} – ${formatter(
      maximumValue
    )}`;
  }

  return formatter(minimumValue);
}

function getTypeLabel(propertyType?: string) {
  const normalized = String(
    propertyType || "Apartment"
  ).toLowerCase();

  const labels: Record<string, string> = {
    flat: "Apartment",
    apartment: "Apartment",
    villa: "Villa",
    house: "House",
  };

  return labels[normalized] || "Property";
}

export default function PropertyConfigurations({
  configurations,
  propertyType,
}: Props) {
  const availableConfigurations = Array.isArray(
    configurations
  )
    ? configurations
        .map((configuration) => ({
          bhk: Number(configuration.bhk) || 0,
          areaMin:
            Number(configuration.areaMin) || 0,
          areaMax:
            Number(configuration.areaMax) ||
            Number(configuration.areaMin) ||
            0,
          priceMin:
            Number(configuration.priceMin) || 0,
          priceMax:
            Number(configuration.priceMax) ||
            Number(configuration.priceMin) ||
            0,
        }))
        .filter(
          (configuration) =>
            configuration.bhk > 0 &&
            configuration.priceMin > 0
        )
        .sort(
          (first, second) =>
            first.priceMin - second.priceMin
        )
    : [];

  if (availableConfigurations.length === 0) {
    return null;
  }

  const typeLabel = getTypeLabel(propertyType);

  const overallMinimumPrice = Math.min(
    ...availableConfigurations.map(
      (configuration) =>
        configuration.priceMin
    )
  );

  const overallMaximumPrice = Math.max(
    ...availableConfigurations.map(
      (configuration) =>
        configuration.priceMax
    )
  );

  const bhkSummary = [
    ...new Set(
      availableConfigurations.map(
        (configuration) =>
          configuration.bhk
      )
    ),
  ].join(", ");

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-green-100 bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
      <div className="border-b border-green-100 bg-gradient-to-r from-green-50 via-white to-green-50 px-5 py-6 sm:px-7">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-green-700">
          Available Configurations
        </p>

        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">
              {bhkSummary} BHK {typeLabel}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Choose the configuration that matches
              your budget and space requirement.
            </p>
          </div>

          <div className="rounded-2xl bg-green-600 px-5 py-3 text-white shadow-lg shadow-green-100">
            <p className="text-xs font-bold uppercase tracking-wider text-green-100">
              Overall Price Range
            </p>

            <p className="mt-1 text-xl font-black">
              {formatRange(
                overallMinimumPrice,
                overallMaximumPrice,
                formatIndianPrice
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
        {availableConfigurations.map(
          (configuration, index) => (
            <article
              key={`${configuration.bhk}-${configuration.areaMin}-${index}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-black text-slate-950">
                    {configuration.bhk} BHK
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {typeLabel}
                  </p>
                </div>

                {index === 0 && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-green-700">
                    Starting
                  </span>
                )}
              </div>

              {configuration.areaMin > 0 && (
                <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Super Built-up Area
                  </p>

                  <p className="mt-1 font-black text-slate-900">
                    {formatRange(
                      configuration.areaMin,
                      configuration.areaMax,
                      (area) =>
                        `${area.toLocaleString(
                          "en-IN"
                        )} sq.ft`
                    )}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Price Range
                </p>

                <p className="mt-1 text-xl font-black text-green-700">
                  {formatRange(
                    configuration.priceMin,
                    configuration.priceMax,
                    formatIndianPrice
                  )}
                </p>
              </div>
            </article>
          )
        )}
      </div>

      <div className="border-t border-green-100 bg-green-50/50 px-5 py-3 text-xs leading-5 text-slate-500 sm:px-7">
        Prices and availability are indicative and
        may change. Confirm the latest details with
        the property owner or developer.
      </div>
    </section>
  );
}
