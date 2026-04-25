import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, isAdmin, isTechnician } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-zinc-950 border-b border-zinc-900 px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-yellow-400 text-black font-black p-1.5 rounded-lg text-sm group-hover:rotate-12 transition-transform">
            SC
          </div>
          <span className="text-white font-black tracking-tighter text-xl uppercase italic">
            Smart<span className="text-yellow-400">Campus.</span>
          </span>
        </Link>

        {/* NAVIGATION */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-400">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-yellow-400" : "hover:text-yellow-400 transition"
            }
          >
            Home
          </NavLink>

          {/* ✅ NEW RESOURCE BUTTON */}
          <NavLink
            to="/resources"
            className={({ isActive }) =>
              isActive ? "text-yellow-400" : "hover:text-yellow-400 transition"
            }
          >
            Resources
          </NavLink>

          <NavLink
            to="/report-fault"
            className={({ isActive }) =>
              isActive ? "text-yellow-400" : "hover:text-yellow-400 transition"
            }
          >
            Maintenance
          </NavLink>

          {/* TECHNICIAN ONLY - My Tickets */}
          {isTechnician() && (
            <NavLink
              to="/my-tickets"
              className={({ isActive }) =>
                isActive ? "text-yellow-400" : "hover:text-yellow-400 transition"
              }
            >
              My Tickets
            </NavLink>
          )}

          {/* ADMIN ONLY */}
          {isAdmin() && (
            <>
              <NavLink
                to="/admin/bookings"
                className={({ isActive }) =>
                  isActive ? "text-yellow-400" : "hover:text-yellow-400 transition"
                }
              >
                Bookings
              </NavLink>

              <NavLink
                to="/admin/tickets"
                className={({ isActive }) =>
                  isActive ? "text-yellow-400" : "hover:text-yellow-400 transition"
                }
              >
                Console
              </NavLink>

              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  isActive ? "text-yellow-400" : "hover:text-yellow-400 transition"
                }
              >
                Users
              </NavLink>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {isAuthenticated ? (
            <>
              <NotificationBell />

              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400 hidden md:block">
                  {user?.name || user?.email}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full text-sm transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-yellow-400 text-black px-6 py-2.5 rounded-full hover:bg-yellow-500 transition"
            >
              Login
            </button>
          )}

          {/* QUICK ACTION */}
          <button
            onClick={() => navigate('/report-fault')}
            className="bg-yellow-400 text-black px-6 py-2.5 rounded-full hover:bg-yellow-500 transition"
          >
            Report Fault
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Header;