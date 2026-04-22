import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';  // Nisidu- Import useAuth to check authentication status
import NotificationBell from './NotificationBell';  // Nisidu- Import NotificationBell component

const Header = () => {
  const navigate = useNavigate();
   const { isAuthenticated, user, logout, isAdmin } = useAuth();  // Nisidu- Get auth state and functions

     // ADD THIS DEBUG LOG
  console.log("Header Debug:", { isAuthenticated, user, isAdmin });

    const handleLogout = () => {  // Nisidu- Logout handler
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-zinc-950 border-b border-zinc-900 px-6 py-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-yellow-400 text-black font-black p-1.5 rounded-lg text-sm group-hover:rotate-12 transition-transform">SC</div>
          <span className="text-white font-black tracking-tighter text-xl uppercase italic">Smart<span className="text-yellow-400">Campus.</span></span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-400">
          <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
          <Link to="/report-fault" className="hover:text-yellow-400 transition-colors">Maintenance</Link>
           
           {isAdmin() && (
            <>
              <Link to="/admin/tickets" className="hover:text-yellow-400 transition-colors">Console</Link>
              <Link to="/admin/users" className="hover:text-yellow-400 transition-colors">Users</Link>
            </>
          )}
          </div>

                 {/* Right side - Auth buttons */}
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
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-full text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-yellow-400 text-black px-6 py-2.5 rounded-full hover:bg-yellow-500 transition-all active:scale-95 shadow-lg shadow-yellow-400/10"
            >
              Login
            </button>
          )}
        

          <button onClick={() => navigate('/report-fault')} className="bg-yellow-400 text-black px-6 py-2.5 rounded-full hover:bg-yellow-500 transition-all active:scale-95 shadow-lg shadow-yellow-400/10">
            Report Fault
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;