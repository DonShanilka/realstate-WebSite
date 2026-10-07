import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/search", label: "Advanced Search" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/price-prediction", label: "Price Prediction" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-sm text-white">E</span>
          Estate<span className="text-blue-600">AI</span>
        </Link>
        <nav className="flex flex-wrap gap-1" aria-label="Main">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
