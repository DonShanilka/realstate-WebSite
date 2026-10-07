
export default function Messages() {
  return (
    <main className="w-full px-[50px] py-10 sm:px-[100px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Messages
        </h1>

        <p className="mt-2 text-slate-500">
          Chat directly with property sellers.
        </p>
      </div>

      <div className="grid min-h-[500px] overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-[280px_1fr]">
        {/* Conversations */}
        <aside className="border-b border-slate-200 md:border-b-0 md:border-r">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">
              Conversations
            </h2>
          </div>

          <div className="p-6 text-center text-sm text-slate-400">
            No conversations yet.
          </div>
        </aside>

        {/* Chat */}
        <section className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl">💬</div>

            <h2 className="mt-3 font-semibold text-slate-900">
              Select a conversation
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your messages will appear here.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
