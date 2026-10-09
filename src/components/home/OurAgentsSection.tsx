import { useState } from "react";
import { Link } from "react-router-dom";

const agents = [
  {
    name: "Family Home Advisor",
    specialty: "Residential properties",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
    alt: "Portrait of a property advisor",
  },
  {
    name: "Apartment Specialist",
    specialty: "Apartments and city living",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
    alt: "Portrait of an apartment specialist",
  },
  {
    name: "Investment Advisor",
    specialty: "Land and investments",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
    alt: "Portrait of a property investment advisor",
  },
  {
    name: "Luxury Home Advisor",
    specialty: "Villas and premium homes",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85",
    alt: "Portrait of a luxury home advisor",
  },
];

export function OurAgentsSection() {
  return (
    <section className="w-full bg-white px-[50px] py-16 sm:px-[100px] sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <p className="text-xl uppercase text-slate-950">Our Agents</p>
          <h2 className="mt-4 text-5xl font-medium tracking-tight text-slate-950 sm:text-6xl">Contact with Our Agents</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">Get personal guidance from our property team and find the right next step for your home search.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {agents.map((agent) => <AgentCard key={agent.name} {...agent} />)}
        </div>
      </div>
    </section>
  );
}

function AgentCard({ name, specialty, image, alt }: (typeof agents)[number]) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[0.94] overflow-hidden rounded-2xl bg-slate-100">
        {!imageFailed ? <img src={image} alt={alt} loading="lazy" onError={() => setImageFailed(true)} className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]" /> : <div className="grid h-full place-items-center text-5xl font-medium text-slate-400">{name[0]}</div>}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div><h3 className="text-lg font-semibold tracking-tight text-slate-950">{name}</h3><p className="mt-1 text-sm text-slate-600">{specialty}</p></div>
        <Link to="/messages" aria-label={`Contact our ${name.toLowerCase()}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-lg text-slate-900 transition hover:bg-slate-950 hover:text-white">↗</Link>
      </div>
    </article>
  );
}
