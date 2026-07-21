export default function Navbar() {
  return (
    <nav className="bg-zinc-900 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">
          PropertyHub
        </h1>

        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-600">
            Home
          </a>

          <a href="#" className="hover:text-blue-600">
            Buy
          </a>

          <a href="#" className="hover:text-blue-600">
            Rent
          </a>

          <a href="#" className="hover:text-blue-600">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}