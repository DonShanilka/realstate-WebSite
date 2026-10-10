import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAuthError } from "../../features/auth/auth.slice";
import { register } from "../../features/auth/auth.thunks";
import type { UserRole } from "../../features/auth/auth.types";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Button, ErrorAlert, Field, SelectField } from "../ui";
import { AuthModalFrame } from "./AuthModalFrame";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function RegisterModal() {
  
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { status, error, registrationMessage } = useAppSelector(
    (state) => state.auth,
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("BUYER");
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const isLoading = status === "loading";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage(null);
    dispatch(clearAuthError());
    try {
      const result = await dispatch(
        register({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
          role,
        }),
      ).unwrap();
      setFormMessage(
        result.message ||
          registrationMessage ||
          "Your account is ready. Sign in to continue.",
      );
      setPassword("");
    } catch {
      // Redux auth state displays the rejected request message.
    }
  }

  return (
    <AuthModalFrame mode="register">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Join EstateAI
      </p>
      <h1
        id="auth-title"
        className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
      >
        Create your account
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        Save properties and make your next move with confidence.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-3.5">
        <Field
          label="Full name"
          autoComplete="name"
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
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
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          hint="Use at least 8 characters."
        />
        <SelectField
          label="I am joining as"
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
        >
          <option value="BUYER">Buyer</option>
          <option value="OWNER">Property owner</option>
          <option value="AGENT">Real estate agent</option>
        </SelectField>
        {error && <ErrorAlert message={error} />}
        {formMessage && (
          <p
            role="status"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          >
            {formMessage}
            <button
              type="button"
              onClick={() =>
                navigate("/login", { replace: true, state: location.state })
              }
              className="ml-1 font-semibold text-slate-950 underline underline-offset-2"
            >
              Sign in
            </button>
          </p>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl py-3"
        >
          {isLoading ? "Creating account…" : "Create account"}
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
