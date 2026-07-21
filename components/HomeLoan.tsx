export default function HomeLoan() {
  return (
    <section className="mx-auto mt-16 max-w-7xl rounded-3xl bg-gradient-to-r from-emerald-600 to-green-500 p-10 text-white shadow-2xl">
      <div className="grid gap-10 md:grid-cols-2 items-center">

        <div>
          <span className="rounded-full bg-zinc-900/20 px-4 py-2 text-sm font-semibold">
            🏦 Home Loan Assistance
          </span>

          <h2 className="mt-5 text-4xl font-extrabold leading-tight">
            Get Your Dream Home Loan
            <br />
            at the Lowest Interest Rates
          </h2>

          <p className="mt-5 text-lg text-green-100">
            Compare offers from India's leading banks, check your eligibility,
            calculate EMI and apply online in minutes.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-xl bg-zinc-900 px-6 py-3 font-bold text-green-700 shadow-lg hover:scale-105 transition">
              Apply for Loan
            </button>

            <button className="rounded-xl border-2 border-white px-6 py-3 font-bold hover:bg-zinc-900 hover:text-green-700 transition">
              Check Eligibility
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">

          <div className="rounded-2xl bg-zinc-900 p-6 text-center shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">EMI Starts</h3>
            <p className="mt-3 text-3xl font-extrabold text-green-600">
              ₹799/Lakh
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6 text-center shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">
              Interest Rate
            </h3>
            <p className="mt-3 text-3xl font-extrabold text-blue-600">
              7.85%
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6 text-center shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">
              Partner Banks
            </h3>
            <p className="mt-3 text-3xl font-extrabold text-red-500">
              20+
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900 p-6 text-center shadow-xl">
            <h3 className="text-xl font-bold text-gray-900">
              Approval Time
            </h3>
            <p className="mt-3 text-3xl font-extrabold text-orange-500">
              24 hrs
            </p>
          </div>

        </div>

      </div>

      <div className="mt-12">
        <h3 className="mb-6 text-center text-2xl font-bold">
          Trusted Banking Partners
        </h3>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">

          {[
            "SBI",
            "HDFC",
            "ICICI",
            "Axis",
            "PNB",
            "Bank of Baroda",
          ].map((bank) => (
            <div
              key={bank}
              className="rounded-xl bg-zinc-900 p-4 text-center font-bold text-gray-800 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
            >
              {bank}
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
