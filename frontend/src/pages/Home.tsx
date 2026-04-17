import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, User, ArrowRight, Activity } from 'lucide-react';

// Hardcoded seed IDs - must match your backend seed!
const DEFAULT_ORG_ID = '60d5ecb8b392cb364c4c23c1'; // Example string, wait, backend seed generates dynamically.
// We should allow the user to input the ID or we can fetch the first org!
// For simplicity, let's just make the user paste their Organization ID.

export const Home: React.FC = () => {
  const { loginAsAdmin, loginAsSubscriber } = useAuth();
  const navigate = useNavigate();
  
  const [orgId, setOrgId] = useState('60d5ecb8b392cb364c4c23c1');
  const [userId, setUserId] = useState('60d5ecb8b392cb364c4c23c2');

  const handleAdminLogin = () => {
    if (!orgId) return alert('Enter Org ID');
    loginAsAdmin(orgId);
    navigate('/admin');
  };

  const handleSubscriberLogin = () => {
    if (!orgId || !userId) return alert('Enter Org and User ID');
    loginAsSubscriber(userId, orgId);
    navigate('/pricing');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full mb-4 ring-1 ring-purple-500/20">
          <Activity className="w-8 h-8 text-purple-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Welcome to FlexiPay
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The headless, multi-tenant subscription engine. 
          Select a role below to explore the reference implementation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-8">
        {/* Admin Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition duration-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-purple-500/10 transition"></div>
          
          <Building className="w-10 h-10 text-purple-400 mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-2">Tenant Admin</h2>
          <p className="text-gray-400 text-sm mb-6 h-10">
            Create pricing plans and view all subscriptions for your organization.
          </p>
          
          <div className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Organization ID</label>
              <input 
                type="text" 
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                placeholder="MongoDB ObjectId"
              />
            </div>
            <button 
              onClick={handleAdminLogin}
              className="w-full bg-white text-gray-950 hover:bg-gray-200 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition"
            >
              <span>Login as Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subscriber Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-blue-500/50 transition duration-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition"></div>
          
          <User className="w-10 h-10 text-blue-400 mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-2">Subscriber</h2>
          <p className="text-gray-400 text-sm mb-6 h-10">
            View plans, subscribe, upgrade mid-cycle, and manage billing.
          </p>
          
          <div className="space-y-4 relative z-10">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Org ID</label>
                <input 
                  type="text" 
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="ID"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">User ID</label>
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="ID"
                />
              </div>
            </div>
            <button 
              onClick={handleSubscriberLogin}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition"
            >
              <span>Login as Subscriber</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-400 text-center">
        💡 <strong>Pro Tip:</strong> Run <code className="bg-gray-950 px-1.5 py-0.5 rounded text-purple-400 border border-gray-800">npm run seed</code> in the backend, then paste the generated ObjectIds here to test without creating from scratch.
      </div>
    </div>
  );
};
