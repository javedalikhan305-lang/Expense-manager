import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fintech-dark via-[#071b2d] to-[#0b2337] text-fintech-text">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-fintech-border bg-[#0c253c]/80 px-4 py-2 text-sm text-fintech-muted">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-fintech-primary text-black font-bold">F</span>
              FinTrack — Professional expense management for modern teams
            </div>
            <div>
              <h1 className="text-5xl font-semibold tracking-tight text-white lg:text-6xl">Run your finances with clarity, confidence, and speed.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-fintech-muted">
                A modern dashboard designed for serious budgeting. See income, expenses, and insights in one elegant workspace.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-2xl bg-fintech-primary px-8 py-4 text-sm font-semibold text-black shadow-soft transition hover:bg-fintech-primaryDark"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-fintech-border bg-[#0c2038] px-8 py-4 text-sm font-semibold text-fintech-text transition hover:border-fintech-primary hover:text-white"
              >
                Sign In
              </Link>
            </div>
          </section>

          <section className="space-y-6 rounded-[2rem] border border-fintech-border bg-[#11263d]/70 p-8 shadow-soft backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-fintech-muted">Live reports</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Unified spending overview</h2>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-fintech-primary text-black font-bold">₹</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#0c2038] p-5">
                <p className="text-sm text-fintech-muted">Monthly savings</p>
                <p className="mt-3 text-3xl font-semibold text-white">₹24,580</p>
              </div>
              <div className="rounded-3xl bg-[#0c2038] p-5">
                <p className="text-sm text-fintech-muted">Expenses today</p>
                <p className="mt-3 text-3xl font-semibold text-white">₹3,254</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#0c2038] p-5">
                <p className="text-sm text-fintech-muted">Budget utilization</p>
                <p className="mt-3 text-3xl font-semibold text-white">74%</p>
              </div>
              <div className="rounded-3xl bg-[#0c2038] p-5">
                <p className="text-sm text-fintech-muted">AI alerts</p>
                <p className="mt-3 text-3xl font-semibold text-white">5 active</p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {[
            { label: 'Track Expenses', copy: 'Manage every payment with detailed category summaries and smart filters.' },
            { label: 'Monitor Income', copy: 'Visualize revenue sources and compare trends across your timeframes.' },
            { label: 'Actionable Insights', copy: 'Receive AI-backed recommendations that help you save more each month.' },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl border border-fintech-border bg-[#0d263d] p-8 shadow-soft">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fintech-primary">{item.label}</p>
              <p className="mt-4 text-base leading-7 text-fintech-muted">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
