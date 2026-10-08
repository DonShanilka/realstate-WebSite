import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, ErrorAlert, Field, PageHeader, SelectField } from "../../components/ui";
import { register } from "../../features/auth/auth.thunks";
import type { UserRole } from "../../features/auth/auth.types";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, registrationMessage } = useAppSelector((state) => state.auth);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("BUYER");
  async function submit(event: FormEvent) {
    event.preventDefault();
    try { await dispatch(register({ full_name: fullName.trim(), email: email.trim(), password, role })).unwrap(); navigate("/login"); }
    catch { /* The rejected thunk stores its message in auth state. */ }
  }
  return <><PageHeader title="Create your account" subtitle="Join EstateAI to save homes and manage viewings." /><form onSubmit={submit} className="mx-auto my-10 max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-6">
    <Field label="Full name" autoComplete="name" required value={fullName} onChange={(event) => setFullName(event.target.value)} />
    <Field label="Email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
    <Field label="Password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} />
    <SelectField label="Account type" value={role} onChange={(event) => setRole(event.target.value as UserRole)}><option value="BUYER">Buyer</option><option value="OWNER">Owner</option><option value="AGENT">Agent</option></SelectField>
    {error && <ErrorAlert message={error} />}{registrationMessage && <p role="status" className="text-sm text-slate-700">{registrationMessage}</p>}
    <Button type="submit" disabled={status === "loading"}>{status === "loading" ? "Creating account…" : "Create account"}</Button>
    <p className="text-sm text-slate-600">Already registered? <Link className="font-semibold text-slate-950" to="/login">Sign in</Link></p>
  </form></>;
}
