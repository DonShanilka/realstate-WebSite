const questions = [
  {
    question: "How do I view a property I'm interested in?",
    answer: "Open the property details and choose Book a Viewing, or contact our team. We'll help arrange a time that works for you and the property owner.",
  },
  {
    question: "Can EstateAI help me find the right property?",
    answer: "Yes. Search by location, price, and property features, or describe what you're looking for to get started.",
  },
  {
    question: "How do I compare properties?",
    answer: "Review each listing's location, price, size, and features. You can also save properties to your Favorites for easy reference.",
  },
  {
    question: "How can I contact an agent?",
    answer: "Use the Contact an Agent section or send us a message. Our team can answer questions and guide you through the next steps.",
  },
];

export function FAQSection() {
  return (
    <section className="w-full bg-white px-[50px] py-16 sm:px-[100px] sm:py-20 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:pt-1">
          <p className="text-sm uppercase tracking-wide text-slate-900">All question</p>
          <h2 className="mt-4 max-w-lg text-4xl font-medium leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
            Frequently Asked Question
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
            Here are some common questions along with their answers to help clear up any confusion.
          </p>
        </div>

        <div className="space-y-3">
          {questions.map(({ question, answer }, index) => (
            <details
              key={question}
              open={index === 0}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white open:border-slate-950 open:bg-[#101010]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 text-lg font-medium tracking-tight text-slate-950 marker:content-none group-open:text-white sm:px-6 sm:py-6 sm:text-xl">
                {question}
                <span className="shrink-0 text-2xl font-normal leading-none transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
              </summary>
              <p className="max-w-3xl px-5 pb-6 text-sm leading-6 text-slate-300 sm:px-6 sm:text-base sm:leading-7">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
