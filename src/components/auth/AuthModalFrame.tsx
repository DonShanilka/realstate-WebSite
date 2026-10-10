import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type AuthModalMode = "login" | "register";

export function AuthModalFrame({
  mode,
  children,
}: {
  mode: AuthModalMode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;

  function close() {
    navigate(returnTo || "/", { replace: true });
  }

  function changeMode(nextMode: AuthModalMode) {
    navigate(`/${nextMode}`, { replace: true, state: location.state });
  }

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [returnTo]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="relative my-auto flex h-[min(800px,calc(100dvh-2rem))] w-full max-w-lg items-center overflow-hidden rounded-[2rem] bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close sign-in dialog"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/90 text-xl text-slate-700 transition hover:bg-slate-950 hover:text-white/90"
        >
          ×
        </button>

        <div className="flex h-full w-full items-center justify-center overflow-y-auto px-6 py-12 sm:px-10">
          <div className="w-full max-w-sm">
            <div
              className="mb-6 flex border-b border-slate-200 bg-white"
              aria-label="Choose sign-in mode"
            >
              <button
                type="button"
                onClick={() => changeMode("login")}
                aria-pressed={mode === "login"}
                className={`flex-1 rounded-none border-b-2 bg-white px-4 py-2.5 text-sm font-semibold transition ${mode === "login" ? "border-slate-950 text-slate-950" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => changeMode("register")}
                aria-pressed={mode === "register"}
                className={`flex-1 rounded-none border-b-2 bg-white px-4 py-2.5 text-sm font-semibold transition ${mode === "register" ? "border-slate-950 text-slate-950" : "border-transparent text-slate-500 hover:text-slate-900"}`}
              >
                Create account
              </button>
            </div>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
