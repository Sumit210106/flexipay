import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Layers, Zap, ArrowRight, Activity, Code2, Database, Rocket, Loader2 } from 'lucide-react';

export const Home: React.FC = () => {
  const { loginAsAdmin, loginAsSubscriber } = useAuth();
  const navigate = useNavigate();
  
  const [orgId, setOrgId] = useState('69e283d6cf78073496f1e54f');
  const [userId, setUserId] = useState('69e283d6cf78073496f1e551');
  const [bootstrapping, setBootstrapping] = useState(false);

  const handleAdminLogin = () => {
    if (!orgId) return;
    loginAsAdmin(orgId);
    navigate('/admin');
  };

  const handleSubscriberLogin = () => {
    if (!orgId || !userId) return;
    loginAsSubscriber(userId, orgId);
    navigate('/pricing');
  };

  const handleBootstrap = async () => {
    setBootstrapping(true);
    try {
      const res = await apiClient.post('/setup/bootstrap');
      const { organizationId, adminUserId } = res.data.data;
      setOrgId(organizationId);
      setUserId(adminUserId);
      alert('Production Environment Bootstrapped! You can now login.');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Bootstrap failed — make sure backend is running.');
    } finally {
      setBootstrapping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] py-12">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 blur-[100px] -z-10 rounded-full" />
        
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-xs font-semibold uppercase tracking-widest mx-auto mb-4">
          <Activity className="w-3.5 h-3.5" />
          <span>v1.0 Headless Engine</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
          Next-Gen <span className="premium-gradient">Billing API</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The underlying multi-tenant subscription engine providing state-machine powered lifecycle management and transactional idempotency.
        </p>

        {/* Bootstrap Action */}
        <div className="pt-8 flex flex-col items-center space-y-4">
          <button 
            onClick={handleBootstrap}
            disabled={bootstrapping}
            className="group relative flex items-center space-x-3 px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/20 transition-all duration-300 disabled:opacity-50"
          >
            {bootstrapping ? (
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            ) : (
              <Rocket className="w-5 h-5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
            <div className="text-left">
              <div className="text-sm font-bold text-white uppercase tracking-wider">Bootstrap Environment</div>
              <div className="text-xs text-gray-400">Initialize default Organization & Plans</div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity ml-4" />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Admin Card */}
        <div className="glass-card rounded-2xl p-8 group relative overflow-hidden transition-all duration-500 hover:border-indigo-500/30 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150" />
          
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-Inner">
            <Layers className="w-6 h-6 text-indigo-400" />
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">Tenant Provider</h2>
          <p className="text-sm text-gray-400 mb-8 flex-grow leading-relaxed">
            Act as an organization admin to define tiered pricing models and monitor incoming webhook activity.
          </p>
          
          <div className="space-y-4">
            <div className="relative">
              <Code2 className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                className="w-full bg-[#121214] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 outline-none transition"
                placeholder="Organization ID"
              />
            </div>
            <button 
              onClick={handleAdminLogin}
              className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition shadow-[0_4px_12px_rgba(255,255,255,0.1)] hover:shadow-[0_4px_16px_rgba(255,255,255,0.2)]"
            >
              <span>Initialize Admin Context</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Subscriber Card */}
        <div className="glass-card rounded-2xl p-8 group relative overflow-hidden transition-all duration-500 hover:border-purple-500/30 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)] flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-150" />
          
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-Inner">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">Subscriber Client</h2>
          <p className="text-sm text-gray-400 mb-8 flex-grow leading-relaxed">
            Act as an end-user to execute idempotent checkouts, process upgrades with automated proration, and manage renewals.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
               <div className="relative">
                <Database className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={orgId}
                  onChange={(e) => setOrgId(e.target.value)}
                  className="w-full bg-[#121214] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-purple-500/50 outline-none transition"
                  placeholder="Org ID"
                />
              </div>
              <div className="relative">
                <Code2 className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-[#121214] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-300 focus:ring-1 focus:ring-purple-500 focus:border-purple-500/50 outline-none transition"
                  placeholder="User ID"
                />
              </div>
            </div>
            <button 
              onClick={handleSubscriberLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30"
            >
              <span>Initialize User Context</span>
              <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
