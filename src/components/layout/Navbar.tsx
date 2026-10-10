import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

type NavigationLink = {
  to: string;
  label: string;
  end?: boolean;
};

const navigationLinks: NavigationLink[] = [
  {
    to: "/search",
    label: "Properties",
  },
  {
    to: "/assistant",
    label: "AI Assistant",
  },
  {
    to: "/price-prediction",
    label: "Price Prediction",
  },
  // {
  //   to: "/book-viewing",
  //   label: "Book a Viewing",
  // },
  {
    to: "/bookings",
    label: "My Bookings",
  },
  {
    to: "/favorites",
    label: "Favorites",
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

function navLinkClass({
  isActive,
  isHome,
}: {
  isActive: boolean;
  isHome: boolean;
}) {
  return `
    shrink-0 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold transition sm:px-3 sm:text-[15px]
    ${
      isActive
        ? isHome
          ? "bg-white/15 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
          : "bg-slate-50 text-slate-950"
        : isHome
          ? "text-white hover:bg-white/10 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }
  `;
}

export function Navbar() {
  const location = useLocation();
  const { token } = useAppSelector((state) => state.auth);
  const isHome = location.pathname === "/";
  const [hasScrolled, setHasScrolled] = useState(false);
  const transparentHome = isHome && !hasScrolled;

  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 80);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        transparentHome
          ? "-mb-16 bg-transparent text-white"
          : "border-b border-slate-200 bg-white text-slate-900"
      }`}
    >
      <div className="w-full px-[50px] sm:px-[100px]">
        <div className="flex min-h-16 items-center gap-3">
          <Link
            to="/"
            className={`flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight ${transparentHome ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]" : "text-slate-900"}`}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-lg text-sm font-bold shadow-sm ${transparentHome ? "border border-white/70 bg-white/10 text-white" : "bg-slate-950 text-white"}`}
            >
              E
            </span>

            <span>
              Estate
              <span className={transparentHome ? "text-white/80" : "text-slate-950"}>
                AI
              </span>
            </span>
          </Link>
          <nav
            className="ml-auto flex min-w-0 items-center justify-start gap-1 overflow-x-auto py-2 sm:justify-end"
            aria-label="Main navigation"
          >
            {navigationLinks.map((link) => {
              const requiresLogin = link.to === "/profile" && !token;
              const target = requiresLogin ? "/login" : link.to;
              return (
              <NavLink
                key={link.to}
                to={target}
                state={requiresLogin ? { returnTo: location.pathname + location.search } : undefined}
                end={link.end}
                aria-label={requiresLogin ? "Sign in" : link.label}
                title={requiresLogin ? "Sign in" : link.label}
                className={({ isActive }) => navLinkClass({ isActive, isHome: transparentHome })}
              >
                {link.to === "/favorites" ? (
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                  </svg>
                ) : link.to === "/messages" ? (
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" />
                  </svg>
                ) : link.to === "/profile" ? (
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21a7 7 0 0 1 14 0" />
                  </svg>
                ) : (
                  link.label
                )}
              </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
