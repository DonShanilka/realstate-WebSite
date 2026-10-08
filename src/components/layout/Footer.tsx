import { Link } from "react-router-dom";

const links = [
  { to: "/search", label: "Browse properties" },
  { to: "/assistant", label: "AI assistant" },
  { to: "/price-prediction", label: "Price prediction" },
  { to: "/favorites", label: "Favorites" },
];

export function Footer() {
  return (
    <footer className="bg-white px-[50px] py-10 text-slate-950 sm:px-[100px] sm:py-14">
      <div className="grid gap-10 border-b border-slate-200 pb-9 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-sm text-white">
              E
            </span>
            <span>
              Estate<span className="text-slate-600">AI</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
            A clearer way to explore homes, compare listings, and plan your next
            move in Sri Lanka.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Explore
          </h2>
          <ul className="mt-4 space-y-3">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-slate-700 transition hover:text-black"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Get in touch
          </h2>
          <ul className="mt-4 space-y-3">
            <li>
              <Link
                to="/messages"
                className="text-sm text-slate-700 transition hover:text-black"
              >
                Contact an agent
              </Link>
            </li>
            <li>
              <Link
                to="/book-viewing"
                className="text-sm text-slate-700 transition hover:text-black"
              >
                Book a viewing
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="text-sm text-slate-700 transition hover:text-black"
              >
                Your profile
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 pt-5 text-xs text-slate-600 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} EstateAI. All rights reserved.</p>
        <p>Estimates and recommendations are guidance, not financial advice.</p>
      </div>
    </footer>
  );
}
