import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorAlert, Spinner } from "../../components/ui";
import { logout } from "../../features/auth/auth.slice";
import {
  fetchProfile,
  updateProfile,
} from "../../features/profile/profile.thunks";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

export default function Profile() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const profile = useAppSelector((state) => state.profile);
  const user = profile.user ?? auth.user;
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (auth.token && auth.user?.id && profile.status === "idle")
      void dispatch(fetchProfile(auth.user.id));
  }, [auth.token, auth.user?.id, dispatch, profile.status]);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user?.id, user?.full_name, user?.phone]);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (user?.id)
      void dispatch(
        updateProfile({
          id: user.id,
          changes: { full_name: fullName.trim(), phone: phone.trim() || null },
        }),
      );
  }

  return (
    <main className="w-full px-[50px] py-10 sm:px-[100px]">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
          <p className="mt-2 text-slate-500">Manage your EstateAI account.</p>
        </div>
        {auth.token && (
          <button
            type="button"
            onClick={() => {
              dispatch(logout());
              navigate("/");
            }}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:bg-slate-50 hover:text-slate-950"
          >
            Sign out
          </button>
        )}
      </div>
      {!auth.token && (
        <ErrorAlert message="Sign in to view and update your profile." />
      )}
      {profile.status === "loading" && (
        <div className="mb-4">
          <Spinner label="Loading profile" />
        </div>
      )}
      {profile.error && (
        <div className="mb-4">
          <ErrorAlert message={profile.error} />
        </div>
      )}
      {auth.token && user && (
        <form
          onSubmit={submit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-xl font-bold text-slate-950">
              {(user.full_name?.[0] ?? "U").toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                {user.full_name || "User Profile"}
              </h2>
              <p className="text-sm text-slate-500">
                Manage your personal information
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Full Name
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/20"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={user.email ?? ""}
                readOnly
                className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Phone
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/20"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={profile.status === "loading"}
            className="mt-6 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            Save Changes
          </button>
        </form>
      )}
    </main>
  );
}
