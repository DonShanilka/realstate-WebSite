import AgentStatCard from "./AgentStatCard";

export interface AgentDashboardStatsData {
  properties: number;
  bookings: number;
  newMessages: number;
  clients: number;
}

interface AgentDashboardStatsProps {
  stats: AgentDashboardStatsData;
}

export default function AgentDashboardStats({
  stats,
}: AgentDashboardStatsProps) {
  const items = [
    {
      title: "My Properties",
      value: stats.properties,
      description: "Properties linked to your agent account.",
      icon: "property" as const,
    },
    {
      title: "Bookings",
      value: stats.bookings,
      description: "Booking requests associated with your properties.",
      icon: "booking" as const,
    },
    {
      title: "New Messages",
      value: stats.newMessages,
      description: "Unread messages waiting for your attention.",
      icon: "message" as const,
    },
    {
      title: "Clients",
      value: stats.clients,
      description: "Unique buyers who have contacted you.",
      icon: "users" as const,
    },
  ];

  return (
    <section aria-label="Dashboard statistics">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <AgentStatCard
            key={item.title}
            title={item.title}
            value={item.value}
            description={item.description}
            icon={item.icon}
          />
        ))}
      </div>
    </section>
  );
}
