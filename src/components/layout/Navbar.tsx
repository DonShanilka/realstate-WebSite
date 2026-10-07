import { NavLink, Link } from "react-router-dom";

const mainLinks = [
  {
    to: "/",
    label: "Home",
    end: true,
  },
  {
    to: "/search",
    label: "Search",
  },
  {
    to: "/assistant",
    label: "AI Assistant",
  },
  {
    to: "/price-prediction",
    label: "Price Prediction",
  },
];

const userLinks = [
  {
    to: "/favorites",
    label: "Favorites",
  },
  {
    to: "/book-viewing",
    label: "Book a Viewing",
  },
  {
    to: "/bookings",
    label: "My Bookings",
  },
  {
    to: "/messages",
    label: "Messages",
  },
  {
    to: "/profile",
    label: "Profile",
  },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `
    rounded-lg px-3 py-2 text-sm font-medium transition
    ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }
  `;
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-16 items-center justify-between gap-4">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-lg font-bold text-slate-900"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
              E
            </span>

            <span>
              Estate<span className="text-blue-600">AI</span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {mainLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label="User navigation"
          >
            {userLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/favorites"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Favorites
            </Link>

            <Link
              to="/profile"
              className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              aria-label="Profile"
            >
              P
            </Link>
          </div>
        </div>

        <nav
          className="hidden overflow-x-auto pb-3 md:flex lg:hidden"
          aria-label="Secondary navigation"
        >
          <div className="flex min-w-max gap-1">
            {[...mainLinks, ...userLinks].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={navLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
