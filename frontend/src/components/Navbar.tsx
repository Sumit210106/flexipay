import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-purple-400 transition">
              <CreditCard className="w-6 h-6 text-purple-500" />
              <span className="font-bold text-xl tracking-tight">FlexiPay</span>
            </Link>
            
            {user && (
              <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
                {user.role === 'admin' ? (
                  <>
                    <Link to="/admin" className="hover:text-white transition">Dashboard</Link>
                    <Link to="/webhooks" className="hover:text-white transition">Webhooks</Link>
                  </>
                ) : (
                  <>
                    <Link to="/pricing" className="hover:text-white transition">Pricing</Link>
                    <Link to="/subscriber" className="hover:text-white transition">My Subscription</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-400">
                  {user.role === 'admin' ? '🏢 Tenant Admin' : '👤 Subscriber'}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-sm font-medium text-gray-400 flex items-center space-x-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                <span>System Online</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
