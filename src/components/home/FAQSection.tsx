function Faq({ question, children }: { question: string; children: string }) {
  return (
    <details className="group py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-slate-900 marker:content-none">
        {question}
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200 text-lg font-normal text-slate-500 transition group-open:rotate-45 group-open:text-slate-950"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <p className="max-w-3xl pt-3 pr-10 text-sm leading-6 text-slate-600">
        {children}
      </p>
    </details>
  );
}

export function FAQSection() {
  return (
    <section className="w-full px-[50px] py-14 sm:px-[100px] sm:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mb-7 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-950">
            Good to know
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          <Faq question="How do I find a property that fits my needs?">
            Use Search to describe what you’re looking for in plain language, or
            choose filters for location, price, rooms, and area.
          </Faq>
          <Faq question="Can EstateAI help me compare properties?">
            Yes. Ask the EstateAI assistant about listings and what to consider
            when comparing their details.
          </Faq>
          <Faq question="How accurate is the price estimate?">
            Price predictions are estimates based on available property data.
            Use them as a guide, not as a valuation or offer.
          </Faq>
          <Faq question="How do I ask about a viewing?">
            Open Book a Viewing from the navigation or use Contact an Agent to
            start a conversation about a listing.
          </Faq>
        </div>
      </div>
    </section>
  );
}
