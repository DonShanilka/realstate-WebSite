import { useAppSelector } from "../../hooks/redux";
import { AgentWelcomeHero } from "../../components/agent/AgentWelcomeHero";
import { AgentWorkspaceToolCard } from "../../components/agent/AgentWorkspaceToolCard";

const workspaceTools = [
  {
    eyebrow: "01 / Portfolio",
    title: "My properties",
    description:
      "Review the properties currently linked to your agent account.",
    to: "/agent/properties",
    action: "Open my properties",
  },
  {
    eyebrow: "02 / Viewings",
    title: "Viewing requests",
    description: "Keep track of appointments and upcoming property visits.",
    to: "/agent/viewings",
    action: "Open viewings",
  },
  {
    eyebrow: "03 / Conversations",
    title: "Client messages",
    description: "Reply to buyers about the properties assigned to you.",
    to: "/agent/messages",
    action: "Open messages",
  },
];

export default function AgentDashboard() {
  const auth = useAppSelector((state) => state.auth);

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-10 sm:py-12 lg:px-12">
      <AgentWelcomeHero fullName={auth.user?.full_name} />

      <section className="mt-10 sm:mt-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Workspace tools
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Your day, in one place
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            Choose a workspace to continue. Your agent tools use the same
            EstateAI account.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {workspaceTools.map((tool) => (
            <AgentWorkspaceToolCard key={tool.to} tool={tool} />
          ))}
        </div>
      </section>

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-6 text-xs text-slate-500 sm:mt-16">
        <span>EstateAI Agent Workspace</span>
        <span>Find the right place. Make the next move.</span>
      </footer>
    </main>
  );
}
