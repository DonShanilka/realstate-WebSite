import { useAppSelector } from "../../hooks/redux";

import { AgentWelcomeHero } from "../../components/agent/AgentWelcomeHero";
import { AgentWorkspaceToolCard } from "../../components/agent/AgentWorkspaceToolCard";

import AgentDashboardStats from "../../components/agent/dashboard/AgentDashboardStats";
import BookingCalendar from "../../components/agent/dashboard/BookingCalendar";
import BookingAnalyticsChart from "../../components/agent/dashboard/BookingAnalyticsChart";
import RecentBookings from "../../components/agent/dashboard/RecentBookings";

import type { DashboardBooking } from "../../components/agent/dashboard/BookingCalendar";
import type { BookingAnalyticsItem } from "../../components/agent/dashboard/BookingAnalyticsChart";

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

const dashboardData = {
  stats: {
    properties: 12,
    bookings: 28,
    newMessages: 4,
    clients: 19,
  },

  bookings: [
    {
      id: 1,
      propertyTitle: "Modern Family Villa",
      buyerName: "Buyer #102",
      date: "2026-10-13T10:30:00",
      status: "PENDING",
    },
    {
      id: 2,
      propertyTitle: "Luxury Apartment",
      buyerName: "Buyer #108",
      date: "2026-10-15T14:00:00",
      status: "CONFIRMED",
    },
    {
      id: 3,
      propertyTitle: "Land in Panadura",
      buyerName: "Buyer #115",
      date: "2026-10-18T09:00:00",
      status: "PENDING",
    },
    {
      id: 4,
      propertyTitle: "Family House in Colombo",
      buyerName: "Buyer #120",
      date: "2026-10-20T11:00:00",
      status: "CONFIRMED",
    },
  ] satisfies DashboardBooking[],

  analytics: [
    { month: "May", bookings: 8 },
    { month: "Jun", bookings: 12 },
    { month: "Jul", bookings: 10 },
    { month: "Aug", bookings: 15 },
    { month: "Sep", bookings: 18 },
    { month: "Oct", bookings: 13 },
  ] satisfies BookingAnalyticsItem[],
};

export default function AgentDashboard() {
  const auth = useAppSelector((state) => state.auth);

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-10 sm:py-12 lg:px-12">
      {/* Welcome */}
      {/* <AgentWelcomeHero fullName={auth.user?.full_name} /> */}

      {/* Overview */}
      <section className="mt-8">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Overview
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Your performance at a glance
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor your properties, booking activity, client messages and buyer
            relationships in one place.
          </p>
        </div>

        <AgentDashboardStats stats={dashboardData.stats} />
      </section>

      {/* Analytics and calendar */}
      <section className="mt-8 grid items-start gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.9fr)]">
        <BookingAnalyticsChart data={dashboardData.analytics} />

        <BookingCalendar bookings={dashboardData.bookings} />
      </section>

      {/* Recent bookings */}
      <section className="mt-8">
        <RecentBookings bookings={dashboardData.bookings} />
      </section>

      {/* Workspace tools */}
      <section className="mt-10 sm:mt-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Workspace tools
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Your day, in one place
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-500">
            Choose a workspace to manage properties, viewings and buyer
            conversations.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {workspaceTools.map((tool) => (
            <AgentWorkspaceToolCard key={tool.to} tool={tool} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 py-6 text-xs text-slate-500 sm:mt-16">
        <span>EstateAI Agent Workspace</span>
        <span>Find the right place. Make the next move.</span>
      </footer>
    </main>
  );
}
