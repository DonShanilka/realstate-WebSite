
export default function BookViewing() {
  return (
    <main className="w-full px-[50px] py-10 sm:px-[100px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Book a Viewing
        </h1>

        <p className="mt-2 text-slate-500">
          Schedule a property viewing with the seller.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">
          Select a property from the property details page
          to book a viewing.
        </p>
      </div>
    </main>
  );
}
