import { useRef } from "react";
import { Link } from "react-router-dom";

const stories = [
  {
    title: "Make your next move with confidence.",
    detail:
      "Explore homes, compare the details, and keep the properties you love close at hand.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=700&q=85",
    alt: "Bright modern home interior",
  },
  {
    title: "Your experience can help someone find home.",
    detail:
      "We’re building EstateAI to make every step of the property search clearer and easier.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=85",
    alt: "Warm modern living room",
  },
  {
    title: "A better home search starts with the right support.",
    detail:
      "Have a question about your search? Our team is ready to help you take the next step.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=700&q=85",
    alt: "Comfortable contemporary living space",
  },
];

export function TestimonialsSection() {
  const track = useRef<HTMLDivElement>(null);

  const move = (direction: -1 | 1) => {
    if (!track.current) return;
    track.current.scrollBy({
      left: direction * track.current.clientWidth * 0.72,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full overflow-hidden bg-white px-[50px] py-16 sm:px-[100px] sm:py-20 lg:py-24">
      <div>
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-900">
              Testimonials
            </p>
            <h2 className="mt-4 text-4xl font-medium leading-tight tracking-tight text-slate-950 sm:text-5xl">
              What Our Client Are Saying
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              We’re here to make your property search feel simpler, clearer, and
              more personal.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous story"
              className="grid h-12 w-12 place-items-center rounded-full border border-slate-300 text-2xl text-slate-950 transition hover:bg-slate-100"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next story"
              className="grid h-12 w-12 place-items-center rounded-full bg-[#101010] text-2xl text-white transition hover:bg-slate-800"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={track}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {stories.map((story) => (
            <article
              key={story.title}
              className="grid min-w-[88%] snap-center gap-6 rounded-3xl border border-slate-200 bg-white p-3 sm:min-w-[78%] sm:grid-cols-[0.65fr_1fr] sm:gap-8 sm:p-4 lg:min-w-[72%]"
            >
              <img
                src={story.image}
                alt={story.alt}
                loading="lazy"
                className="h-56 w-full rounded-2xl object-cover sm:h-full sm:min-h-[270px]"
              />
              <div className="flex flex-col px-3 py-3 sm:px-5 sm:py-5">
                <span
                  className="text-5xl leading-none text-slate-950"
                  aria-hidden="true"
                >
                  “
                </span>
                <h3 className="mt-3 text-2xl font-medium leading-snug tracking-tight text-slate-950 sm:text-3xl">
                  {story.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {story.detail}
                </p>
                <Link
                  to="/messages"
                  className="mt-7 inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-950"
                >
                  Talk with our team <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
