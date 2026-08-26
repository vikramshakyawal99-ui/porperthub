import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50">

      <AdminSidebar />

      <main className="flex-1 p-10">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-300">
              Welcome to PropertyHub Admin Panel
            </p>
          </div>

          <Link
            href="/admin/add-property"
            className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-slate-900 hover:bg-green-700"
          >
            + Add Property
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-4">

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-slate-500">Properties</p>
            <h2 className="mt-3 text-4xl font-bold">24</h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-slate-500">Users</p>
            <h2 className="mt-3 text-4xl font-bold">120</h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-slate-500">Enquiries</p>
            <h2 className="mt-3 text-4xl font-bold">35</h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-slate-500">Builders</p>
            <h2 className="mt-3 text-4xl font-bold">8</h2>
          </div>

        </div>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow">
          <h2 className="mb-4 text-2xl font-bold">
            Quick Actions
          </h2>

          <div className="flex flex-wrap gap-4">

            <Link
              href="/admin/add-property"
              className="rounded-xl bg-green-600 px-5 py-3 text-slate-900"
            >
              Add Property
            </Link>

            <Link
              href="/admin/properties"
              className="rounded-xl bg-green-600 px-5 py-3 text-slate-900"
            >
              Manage Properties
            </Link>

          </div>
        </div>

      </main>

    </div>
  );
}
