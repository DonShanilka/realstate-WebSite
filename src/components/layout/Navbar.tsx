import { NavLink, Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

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
  // {
  //   to: "/book-viewing",
  //   label: "Book a Viewing",
  // },
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
          ? "bg-white/20 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]"
          : "bg-slate-50 text-slate-950"
        : isHome
          ? "text-white hover:bg-white/10 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }
  `;
}

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { token, user } = useAppSelector((state) => state.auth);

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-0 z-40 border-b border-white/15 bg-transparent text-white"
          : "sticky top-0 z-40 border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur"
      }
    >
      <div className="w-full px-[50px] sm:px-[100px]">
        <div className="flex min-h-16 items-center gap-3">
          <Link
            to="/"
            className={`flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight ${isHome ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]" : "text-slate-900"}`}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-lg text-sm font-bold shadow-sm ${isHome ? "border border-white/70 bg-white/10 text-white" : "bg-slate-950 text-white"}`}
            >
              E
            </span>

            <span>
              Estate
              <span className={isHome ? "text-white/75" : "text-slate-950"}>
                AI
              </span>
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
                className={({ isActive }) => navLinkClass({ isActive, isHome })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          {token ? (
            <button
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
              className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold sm:px-4 ${isHome ? "border-white/60 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)] hover:bg-white/10" : "border-slate-300 text-slate-700 hover:bg-slate-50"}`}
              title={
                user?.full_name ? `Signed in as ${user.full_name}` : "Sign out"
              }
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className={`shrink-0 rounded-lg px-3 py-2 text-sm font-semibold sm:px-4 ${isHome ? "border border-white/60 bg-white/10 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)] hover:bg-white/15" : "bg-slate-950 text-white"}`}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
