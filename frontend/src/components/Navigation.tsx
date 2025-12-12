import { Link, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-4">
          <Link
            to="/"
            className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
              location.pathname === "/"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            Comparison Page
          </Link>
          <Link
            to="/determinism-tester"
            className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
              location.pathname === "/determinism-tester"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            Determinism Tester
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

