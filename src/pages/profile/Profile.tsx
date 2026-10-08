
export default function Profile() {
  return (
    <main className="w-full px-[50px] py-10 sm:px-[100px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your EstateAI account.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-xl font-bold text-slate-950">
            U
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              User Profile
            </h2>

            <p className="text-sm text-slate-500">
              Manage your personal information
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Your name"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Your email"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-950 focus:ring-2 focus:ring-slate-950/20"
            />
          </div>
        </div>

        <button
          type="button"
          className="mt-6 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-950"
        >
          Save Changes
        </button>
      </div>
    </main>
  );
}
