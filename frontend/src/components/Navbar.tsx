import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = (path: string) => `
    text-sm font-medium transition-all duration-300
    ${location.pathname === path 
      ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' 
      : 'text-gray-400 hover:text-gray-200'}
  `;

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-12">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition duration-300">
              <CreditCard className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-lg tracking-tight text-white group-hover:opacity-90 transition">FlexiPay<span className="text-indigo-400">.</span></span>
          </Link>
          
          {user && (
            <div className="hidden md:flex space-x-8">
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin" className={navLinkClass('/admin')}>Dashboard</Link>
                  <Link to="/webhooks" className={navLinkClass('/webhooks')}>Webhooks</Link>
                </>
              ) : (
                <>
                  <Link to="/pricing" className={navLinkClass('/pricing')}>Pricing</Link>
                  <Link to="/subscriber" className={navLinkClass('/subscriber')}>My Subscription</Link>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-5">
              <div className="text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-purple-400' : 'bg-blue-400'}`}></span>
                <span>{user.role === 'admin' ? 'Admin Mode' : 'Subscriber Mode'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition group"
                title="Logout"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="text-xs font-medium text-gray-500 flex items-center space-x-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>System Operational</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
