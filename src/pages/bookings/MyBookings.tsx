
export default function MyBookings() {
  return (
    <main className="w-full px-[50px] py-10 sm:px-[100px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          My Bookings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your property viewing requests and bookings.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
        <h2 className="text-lg font-semibold text-slate-900">
          No bookings yet
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Your upcoming and previous property viewings
          will appear here.
        </p>
      </div>
    </main>
  );
}
