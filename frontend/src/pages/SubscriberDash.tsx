import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { RefreshCw, XCircle, ArrowUpCircle, Component, CircleDot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Subscription {
  _id: string;
  planId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

interface Plan {
  _id: string;
  name: string;
  price: number;
  interval: string;
}

export const SubscriberDash: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'subscriber') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const subRes = await apiClient.get(`/subscriptions/user/${user!.id}`);
      const activeSub = subRes.data.data;
      
      if (activeSub) {
        setSubscription(activeSub);
        const planRes = await apiClient.get(`/plans/${activeSub.planId}`);
        setPlan(planRes.data.data);
      } else {
        setSubscription(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription || !window.confirm("Cancel subscription immediately?")) return;
    setActionLoading(true);
    try {
      await apiClient.patch(`/subscriptions/${subscription._id}/cancel`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to cancel');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRenewMock = async () => {
    if (!subscription) return;
    setActionLoading(true);
    try {
      await apiClient.post('/subscriptions/renew', { subscriptionId: subscription._id });
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Renewal failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (!user || user.role !== 'subscriber') return null;

  if (loading) {
    return <div className="text-center text-gray-500 py-20 flex items-center justify-center space-x-2 animate-pulse"><Component className="w-5 h-5 animate-spin"/><span>Synchronizing ledger...</span></div>;
  }

  if (!subscription || subscription.status === 'canceled') {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center p-12 glass-card rounded-[2rem]">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <CircleDot className="w-8 h-8 text-indigo-400 opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">No active plans</h2>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">You are not currently subscribed to any product tier. Start by exploring our flexible pricing models.</p>
        <button onClick={() => navigate('/pricing')} className="bg-white text-black hover:bg-gray-200 font-semibold py-3 px-8 rounded-xl transition shadow-[0_4px_12px_rgba(255,255,255,0.1)]">
          View Pricing Plans
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Subscription Overview</h1>
          <p className="text-gray-400 mt-1.5 text-sm">Manage your billing lifecycle and product tier.</p>
        </div>
        
        <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest border ${
          subscription.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
          subscription.status === 'past_due' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
          'bg-gray-800 text-gray-400 border-transparent'
        }`}>
          • {subscription.status}
        </span>
      </div>

      <div className="glass-card rounded-[2rem] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[60px] -mr-32 -mt-32 pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-8 mb-8 relative z-10">
          <div>
            <p className="text-[11px] uppercase font-bold tracking-widest text-gray-500 mb-2">Current Tier</p>
            <h2 className="text-3xl font-bold text-white tracking-tight">{plan?.name || 'Loading...'}</h2>
          </div>
          <div className="text-right mt-6 md:mt-0">
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-bold tracking-tight text-white">₹{plan?.price || 0}</span>
              <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">/{plan?.interval || 'month'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
          <div className="bg-[#0a0a0b] p-5 rounded-2xl border border-white/5">
            <p className="text-[11px] uppercase font-bold tracking-widest text-gray-500 mb-2">Cycle Started</p>
            <p className="font-medium text-gray-200">
              {new Date(subscription.currentPeriodStart).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
            </p>
          </div>
          <div className="bg-[#0a0a0b] p-5 rounded-2xl border border-white/5">
            <p className="text-[11px] uppercase font-bold tracking-widest text-gray-500 mb-2">Cycle Ends</p>
            <p className="font-medium text-gray-200">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <button
            onClick={() => navigate('/pricing')}
            disabled={actionLoading}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20 font-medium text-sm rounded-xl transition disabled:opacity-50 flex-1 md:flex-none"
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>Switch Tier</span>
          </button>
          
          <button
            onClick={handleRenewMock}
            disabled={actionLoading}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-medium text-sm rounded-xl transition border border-white/5 disabled:opacity-50 flex-1 md:flex-none"
          >
            <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
            <span>Simulate Renewal</span>
          </button>

          <button
            onClick={handleCancel}
            disabled={actionLoading}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium text-sm rounded-xl transition disabled:opacity-50 ml-auto w-full md:w-auto mt-4 md:mt-0 border border-red-500/10"
          >
            <XCircle className="w-4 h-4" />
            <span>Terminate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
