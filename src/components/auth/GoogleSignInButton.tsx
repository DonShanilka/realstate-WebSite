import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { googleLogin } from "../../features/auth/auth.thunks";
import { useAppDispatch } from "../../hooks/redux";
import { readTokenUser } from "../../utils/storage";
import { ErrorAlert } from "../ui";

type GoogleCredentialResponse = { credential: string };
type GoogleIdentity = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      prompt: () => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as
  | string
  | undefined;
let initializedGoogleClientId: string | null = null;
let activeGoogleCredentialHandler: ((credential: string) => void) | null = null;

export function GoogleSignInButton({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;

  useEffect(() => {
    activeGoogleCredentialHandler = async (credential) => {
      setGoogleError(null);
      try {
        const session = await dispatch(googleLogin(credential)).unwrap();
        const role = session.user?.role ?? readTokenUser(session.access_token).role;
        navigate(role === "AGENT" ? "/agent" : returnTo || "/profile", {
          replace: true,
        });
      } catch {
        // The rejected action keeps its error in Redux auth state.
      }
    };
    return () => {
      activeGoogleCredentialHandler = null;
    };
  }, [dispatch, navigate, returnTo]);

  useEffect(() => {
    if (!googleClientId) return;
    const scriptId = "google-identity-services";
    const initialize = () => {
      if (!window.google) return;
      if (initializedGoogleClientId === googleClientId) {
        setGoogleReady(true);
        return;
      }
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: ({ credential }) =>
          activeGoogleCredentialHandler?.(credential),
      });
      initializedGoogleClientId = googleClientId;
      setGoogleReady(true);
    };

    const existingScript = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null;
    if (existingScript) {
      if (window.google) initialize();
      else existingScript.addEventListener("load", initialize, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", initialize, { once: true });
    script.addEventListener(
      "error",
      () => setGoogleError("Google sign-in could not load. Please try again."),
      { once: true },
    );
    document.head.appendChild(script);
  }, []);

  function continueWithGoogle() {
    setGoogleError(null);
    if (!googleClientId) {
      setGoogleError(
        "Google sign-in needs a Google OAuth client ID and backend configuration.",
      );
      return;
    }
    if (!googleReady || !window.google) {
      setGoogleError(
        "Google sign-in is loading. Please try again in a moment.",
      );
      return;
    }
    window.google.accounts.id.prompt();
  }

  return (
    <>
      <button
        type="button"
        onClick={continueWithGoogle}
        disabled={disabled}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.62 17.74 9.5 24 9.5Z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 38.02 46.98 31.93 46.98 24.55Z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.87 2.3-8.18 2.3-6.26 0-11.57-4.12-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
          />
        </svg>
        Continue with Google
      </button>
      {googleError && (
        <div className="mt-3">
          <ErrorAlert message={googleError} />
        </div>
      )}
    </>
  );
}
