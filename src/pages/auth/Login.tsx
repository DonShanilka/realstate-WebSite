import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, ErrorAlert, Field, PageHeader } from "../../components/ui";
import { login } from "../../features/auth/auth.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    try { await dispatch(login({ email: email.trim(), password })).unwrap(); navigate("/profile"); }
    catch { /* The rejected thunk stores its message in auth state. */ }
  }
  return <><PageHeader title="Welcome back" subtitle="Sign in to manage your property search and account." /><form onSubmit={submit} className="mx-auto my-10 max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
    <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
    <Field label="Password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
    {error && <ErrorAlert message={error} />}
    <Button type="submit" disabled={status === "loading"}>{status === "loading" ? "Signing in…" : "Sign in"}</Button>
    <p className="text-sm text-slate-600">New to EstateAI? <Link className="font-semibold text-slate-950" to="/register">Create an account</Link></p>
  </form></>;
}
