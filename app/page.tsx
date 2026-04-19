import StopwatchShell from '@/components/StopwatchShell';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <section className="relative isolate overflow-hidden px-6 py-10 sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-hero opacity-70" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="inline-flex rounded-full bg-white/5 px-4 py-1 text-sm font-semibold uppercase tracking-[0.24em] text-sky-300 ring-1 ring-white/10 backdrop-blur">
                Precision timing for every session
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                A premium stopwatch experience built for performance, focus, and clarity.
              </h1>
              <p className="text-lg leading-8 text-slate-300">
                Track lap times, switch themes, go fullscreen, and keep your flow with fast, drift-free timing powered by React, Next.js, Tailwind, and Framer Motion.
              </p>
            </div>
          </div>
          <StopwatchShell />
        </div>
      </section>
    </main>
  );
}
