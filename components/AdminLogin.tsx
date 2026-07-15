export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold text-gray-800">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome to PropertyHub Admin Panel
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">
              Properties
            </h2>
            <p className="mt-3 text-3xl font-bold">
              24
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">
              Users
            </h2>
            <p className="mt-3 text-3xl font-bold">
              120
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">
              Enquiries
            </h2>
            <p className="mt-3 text-3xl font-bold">
              35
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold">
              Builders
            </h2>
            <p className="mt-3 text-3xl font-bold">
              8
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}