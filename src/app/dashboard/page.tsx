import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { TopEventsChart } from "@/components/dashboard/TopEventsChart";

export default async function DashboardPage() {
  const project = await prisma.project.findUnique({
    where: {
      apiKey: "demo_api_key",
    },
  });

  if (!project) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold">No project found.</h1>
      </main>
    );
  }

  const totalEvents = await prisma.event.count({
    where: { projectId: project.id },
  });

  const uniquePlayers = await prisma.player.count({
    where: { projectId: project.id },
  });

  const totalSessions = await prisma.session.count({
    where: { projectId: project.id },
  });

  const topEvents = await prisma.event.groupBy({
    by: ["eventName"],
    where: { projectId: project.id },
    _count: {
      eventName: true,
    },
    orderBy: {
      _count: {
        eventName: "desc",
      },
    },
    take: 10,
  });

  const chartData = topEvents.map((event) => ({
    eventName: event.eventName,
    count: event._count.eventName,
  }));

  return (
    <main className="min-h-screen bg-white p-8 text-black">
      <div>
        <h1 className="text-3xl font-bold">PlaytestIQ Dashboard</h1>
        <p className="mt-2 text-gray-500">Analytics for {project.name}</p>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard label="Total Events" value={totalEvents} />
        <StatCard label="Unique Players" value={uniquePlayers} />
        <StatCard label="Sessions" value={totalSessions} />
      </section>

      <section className="mt-8 rounded-xl border p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Top Events</h2>
        <div className="mt-4">
          <TopEventsChart data={chartData} />
        </div>
      </section>
    </main>
  );
}