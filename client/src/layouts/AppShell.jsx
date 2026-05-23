import { Outlet } from "react-router-dom";

function AppShell() {
  return (
    <main className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  );
}

export default AppShell;

