import { Link } from "react-router-dom";

export interface AgentWorkspaceTool {
  eyebrow: string;
  title: string;
  description: string;
  to: string;
  action: string;
}

export function AgentWorkspaceToolCard({ tool }: { tool: AgentWorkspaceTool }) {
  return (
    <Link
      to={tool.to}
      className="group flex min-h-64 flex-col rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-slate-400 hover:shadow-lg sm:p-7"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.17em] text-slate-400">
        {tool.eyebrow}
      </span>
      <h3 className="mt-8 text-2xl font-semibold tracking-tight">
        {tool.title}
      </h3>
      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
        {tool.description}
      </p>
      <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-slate-950">
        {tool.action}
        <span
          className="transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        >
          →
        </span>
      </span>
    </Link>
  );
}
