import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAuthError } from "../../features/auth/auth.slice";
import { login } from "../../features/auth/auth.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { readTokenUser } from "../../utils/storage";
import { Button, ErrorAlert, Field } from "../ui";
import { AuthModalFrame } from "./AuthModalFrame";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function LoginModal() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLoading = status === "loading";
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    dispatch(clearAuthError());

    try {
      const session = await dispatch(
        login({
          email: email.trim(),
          password,
        }),
      ).unwrap();

      const role =
        session.user?.role ?? readTokenUser(session.access_token).role;

      if (role === "AGENT") {
        navigate("/agent", {
          replace: true,
        });
      } else {
        navigate(returnTo || "/profile", {
          replace: true,
        });
      }
    } catch {
      // Redux auth state displays the login error.
    }
  }

  return (
    <AuthModalFrame mode="login">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Welcome back
      </p>
      <h1
        id="auth-title"
        className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
      >
        Sign in to your account
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        Pick up where you left off and keep your favorite homes close.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-3.5">
        <Field
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <ErrorAlert message={error} />}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl py-3"
        >
          {isLoading ? "Signing in…" : "Sign in"}
          {!isLoading && <span aria-hidden="true">↗</span>}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-4 text-xs font-medium text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        OR
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <GoogleSignInButton disabled={isLoading} />
      <p className="mt-6 text-center text-xs leading-5 text-slate-500">
        By continuing, you agree to EstateAI’s terms and privacy policy.
      </p>
    </AuthModalFrame>
  );
}
