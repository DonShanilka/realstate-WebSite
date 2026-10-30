import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/redux";
import { bookingApi } from "../../features/bookings/booking.api";
import type { Booking } from "../../features/bookings/booking.types";
import { propertyApi } from "../../features/properties/property.api";
import {
  messageApi,
  type AgentInboxConversation,
} from "../../features/messages/message.api";
import { ErrorAlert, Spinner } from "../../components/ui";

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

interface AgentDashboardData {
  stats: {
    properties: number;
    bookings: number;
    newMessages: number;
    clients: number;
  };
  bookings: DashboardBooking[];
  analytics: BookingAnalyticsItem[];
}

function buildMonthlyAnalytics(bookings: Booking[]): BookingAnalyticsItem[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const month = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const count = bookings.filter((booking) => {
      const createdAt = new Date(booking.created_at ?? booking.check_in);
      return (
        !Number.isNaN(createdAt.getTime()) &&
        createdAt.getFullYear() === month.getFullYear() &&
        createdAt.getMonth() === month.getMonth()
      );
    }).length;

    return {
      month: month.toLocaleDateString(undefined, { month: "short" }),
      bookings: count,
    };
  });
}

function mapDashboardBookings(bookings: Booking[]): DashboardBooking[] {
  return bookings.map((booking) => ({
    id: booking.id,
    propertyTitle: booking.property?.title ?? `Property #${booking.property_id}`,
    buyerName: booking.buyer?.full_name ?? `Buyer #${booking.user_id}`,
    date: booking.check_in,
    createdAt: booking.created_at,
    status: booking.status,
  }));
}

function buildAgentDashboard(
  propertyCount: number,
  bookings: Booking[],
  conversations: AgentInboxConversation[],
): AgentDashboardData {
  return {
    stats: {
      properties: propertyCount,
      bookings: bookings.length,
      newMessages: conversations.reduce(
        (total, conversation) => total + conversation.unread_count,
        0,
      ),
      clients: new Set(conversations.map((conversation) => conversation.buyer_id))
        .size,
    },
    bookings: mapDashboardBookings(bookings),
    analytics: buildMonthlyAnalytics(bookings),
  };
}

export default function AgentDashboard() {
  const auth = useAppSelector((state) => state.auth);
  const [dashboard, setDashboard] = useState<AgentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.token) return;
    let active = true;
    setLoading(true);
    setError("");
    setDashboard(null);

    void Promise.all([
      propertyApi.assignedToMe(),
      bookingApi.forAgent(),
      messageApi.agentInbox(),
    ])
      .then(([properties, bookings, conversations]) => {
        if (!active) return;
        setDashboard(
          buildAgentDashboard(properties.length, bookings, conversations),
        );
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            (cause as Error).message || "Could not load your dashboard data.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [auth.token]);

  return (
    <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-10 sm:py-12 lg:px-12">
      {loading && (
        <div className="mt-8">
          <Spinner label="Loading your dashboard" />
        </div>
      )}
      {error && (
        <div className="mt-8">
          <ErrorAlert message={error} />
        </div>
      )}

      {/* Overview */}
      {dashboard && !loading && (
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

          <AgentDashboardStats stats={dashboard.stats} />
        </section>
      )}

      {/* Analytics and calendar */}
      {dashboard && !loading && (
        <>
          <section className="mt-8 grid items-start gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.9fr)]">
            <BookingAnalyticsChart data={dashboard.analytics} />

            <BookingCalendar bookings={dashboard.bookings} />
          </section>

          {/* Recent bookings */}
          <section className="mt-8">
            <RecentBookings bookings={dashboard.bookings} />
          </section>
        </>
      )}

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
