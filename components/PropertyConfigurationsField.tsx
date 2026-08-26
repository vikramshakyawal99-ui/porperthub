"use client";

export type PropertyConfiguration = {
  id: string;
  bhk: string;
  areaMin: string;
  areaMax: string;
  priceMin: string;
  priceMax: string;
};

type Props = {
  value: PropertyConfiguration[];
  onChange: (value: PropertyConfiguration[]) => void;
};

function createConfiguration(): PropertyConfiguration {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    bhk: "",
    areaMin: "",
    areaMax: "",
    priceMin: "",
    priceMax: "",
  };
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-2 focus:ring-green-100";

export default function PropertyConfigurationsField({
  value,
  onChange,
}: Props) {
  function addConfiguration() {
    onChange([...value, createConfiguration()]);
  }

  function updateConfiguration(
    id: string,
    field: keyof Omit<PropertyConfiguration, "id">,
    fieldValue: string
  ) {
    onChange(
      value.map((configuration) =>
        configuration.id === id
          ? {
              ...configuration,
              [field]: fieldValue,
            }
          : configuration
      )
    );
  }

  function removeConfiguration(id: string) {
    onChange(
      value.filter(
        (configuration) => configuration.id !== id
      )
    );
  }

  return (
    <section className="rounded-3xl border border-green-100 bg-green-50/40 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
            Project Configurations
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            BHK, area and pricing
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Add separate price and area ranges for every
            available BHK configuration.
          </p>
        </div>

        <button
          type="button"
          onClick={addConfiguration}
          className="shrink-0 rounded-xl bg-green-600 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-green-700"
        >
          ＋ Add BHK
        </button>
      </div>

      {value.length === 0 ? (
        <button
          type="button"
          onClick={addConfiguration}
          className="mt-5 w-full rounded-2xl border-2 border-dashed border-green-200 bg-white px-5 py-8 text-center transition hover:border-green-400 hover:bg-green-50"
        >
          <span className="block text-2xl">🏢</span>

          <span className="mt-2 block font-bold text-slate-900">
            Add first configuration
          </span>

          <span className="mt-1 block text-sm text-slate-500">
            Example: 2 BHK · 1190–1205 sq.ft · ₹80–82 lakh
          </span>
        </button>
      ) : (
        <div className="mt-5 space-y-4">
          {value.map((configuration, index) => (
            <article
              key={configuration.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-950">
                    Configuration {index + 1}
                  </p>

                  <p className="text-xs text-slate-500">
                    Enter amounts in rupees
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeConfiguration(configuration.id)
                  }
                  className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    BHK
                  </span>

                  <select
                    value={configuration.bhk}
                    onChange={(event) =>
                      updateConfiguration(
                        configuration.id,
                        "bhk",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">Select BHK</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5 BHK</option>
                    <option value="6">6 BHK</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Minimum Area
                  </span>

                  <input
                    type="number"
                    min="0"
                    placeholder="1190 sq.ft"
                    value={configuration.areaMin}
                    onChange={(event) =>
                      updateConfiguration(
                        configuration.id,
                        "areaMin",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Maximum Area
                  </span>

                  <input
                    type="number"
                    min="0"
                    placeholder="1205 sq.ft"
                    value={configuration.areaMax}
                    onChange={(event) =>
                      updateConfiguration(
                        configuration.id,
                        "areaMax",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Minimum Price
                  </span>

                  <input
                    type="number"
                    min="0"
                    placeholder="8092000"
                    value={configuration.priceMin}
                    onChange={(event) =>
                      updateConfiguration(
                        configuration.id,
                        "priceMin",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Maximum Price
                  </span>

                  <input
                    type="number"
                    min="0"
                    placeholder="8194000"
                    value={configuration.priceMax}
                    onChange={(event) =>
                      updateConfiguration(
                        configuration.id,
                        "priceMax",
                        event.target.value
                      )
                    }
                    className={inputClass}
                  />
                </label>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
