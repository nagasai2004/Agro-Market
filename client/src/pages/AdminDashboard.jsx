function AdminDashboard() {
  return (
    <section className="surface-card rounded-[2rem] border border-white/70 p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Admin dashboard</p>
      <h1 className="heading-font mt-3 text-3xl font-bold text-slate-950">Review users, verification, and platform health</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
        This is positioned for operations tooling: farmer approval queues, reports, notifications, analytics, and compliance actions.
      </p>
    </section>
  );
}

export default AdminDashboard;

