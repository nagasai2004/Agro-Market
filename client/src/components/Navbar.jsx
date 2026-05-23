import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Login", to: "/login" },
  { label: "Register", to: "/register" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="heading-font text-xl font-bold text-[var(--color-primary-dark)]">
          AgroConnect
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? "text-[var(--color-primary)]" : "text-slate-700 hover:text-[var(--color-primary)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {isAuthenticated && (
            <>
              <span className="rounded-full bg-[var(--color-bg)] px-3 py-2 text-sm text-slate-700">
                {user?.role || "member"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex rounded-full border border-slate-200 bg-white p-2 text-slate-700 md:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)]"
              >
                {item.label}
              </NavLink>
            ))}

            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-left text-sm font-semibold text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

