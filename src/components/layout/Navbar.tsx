import { NavLink, Link } from "react-router-dom";

type NavigationLink = {
  to: string;
  label: string;
  end?: boolean;
};

const navigationLinks: NavigationLink[] = [
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
    shrink-0 whitespace-nowrap rounded-lg px-2 py-2 text-xs font-medium transition sm:px-3 sm:text-sm
    ${
      isActive
        ? "bg-slate-50 text-slate-950"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }
  `;
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="w-full px-[50px] sm:px-[100px]">
        <div className="flex min-h-16 items-center gap-3">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-lg font-bold text-slate-900"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-sm font-bold text-white shadow-sm">
              E
            </span>

            <span>
              Estate<span className="text-slate-950">AI</span>
            </span>
          </Link>
          <nav
            className="ml-auto flex min-w-0 items-center justify-start gap-1 overflow-x-auto py-2 sm:justify-end"
            aria-label="Main navigation"
          >
            {navigationLinks.map((link) => (
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
        </div>
      </div>
    </header>
  );
}
