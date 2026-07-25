import Link from "next/link";

const slides = [
  {
    title: "The problem",
    body: "Restaurants lose revenue through manual queues, delayed updates, and poor visibility across service and management.",
  },
  {
    title: "The solution",
    body: "SmartServe unifies reservations, ordering, inventory, and staff coordination inside one futuristic operating system.",
  },
  {
    title: "How it works",
    body: "Guests see live availability, staff coordinate from a shared dashboard, and managers gain real-time insight for staffing and stock.",
  },
];

export default function PresentationPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_30%),_linear-gradient(135deg,_#020617,_#111827)] px-6 py-10 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl border border-cyan-400/20 bg-slate-950/70 p-8 shadow-[0_0_60px_rgba(34,211,238,0.12)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">SmartServe pitch deck</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Futuristic operations for the next era of hospitality</h1>
          </div>
          <Link href="/" className="rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-200">Back to app</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {slides.map((slide) => (
            <div key={slide.title} className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <h2 className="text-xl font-semibold text-white">{slide.title}</h2>
              <p className="mt-3 text-sm text-slate-300">{slide.body}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-5 text-sm text-slate-200">
          <p className="font-semibold text-orange-200">Demo flow</p>
          <p className="mt-2">1. Sign in as a guest or manager. 2. Explore live menu availability. 3. Create a reservation. 4. Place an order. 5. Review the operations dashboard.</p>
        </div>
      </div>
    </main>
  );
}
