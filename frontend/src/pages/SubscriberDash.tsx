import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { RefreshCw, XCircle, ArrowUpCircle, Component } from 'lucide-react';
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
      // 1. Get active subscription for user
      const subRes = await apiClient.get(`/subscriptions/user/${user!.id}`);
      const activeSub = subRes.data.data;
      
      if (activeSub) {
        setSubscription(activeSub);
        // 2. Fetch plan details
        const planRes = await apiClient.get(`/plans/${activeSub.planId}`);
        setPlan(planRes.data.data);
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

  if (!user || user.role !== 'subscriber') {
    return <div className="text-center text-gray-400 mt-20">Subscriber access only.</div>;
  }

  if (loading) {
    return <div className="text-center text-gray-500 py-20 flex items-center justify-center space-x-2 animate-pulse"><Component className="w-5 h-5 animate-spin"/><span>Loading status...</span></div>;
  }

  if (!subscription || subscription.status === 'canceled') {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center p-12 bg-gray-900 border border-gray-800 rounded-2xl">
        <h2 className="text-2xl font-semibold text-white mb-4">No active subscription</h2>
        <p className="text-gray-400 mb-8">You are not currently subscribed to any plan.</p>
        <button onClick={() => navigate('/pricing')} className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-6 rounded-lg transition">
          View Pricing Plans
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white tracking-tight">My Subscription</h1>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          subscription.status === 'active' ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20' : 
          subscription.status === 'past_due' ? 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20' : 
          'bg-gray-800 text-gray-400'
        }`}>
          {subscription.status}
        </span>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Current Plan</p>
            <h2 className="text-2xl font-semibold text-white">{plan?.name || 'Loading...'}</h2>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <div className="flex items-baseline space-x-1 justify-end">
              <span className="text-3xl font-bold text-white">₹{plan?.price || 0}</span>
              <span className="text-gray-500">/{plan?.interval || 'month'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
            <p className="text-gray-500 mb-1">Period Started</p>
            <p className="font-medium text-gray-200">
              {new Date(subscription.currentPeriodStart).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
            <p className="text-gray-500 mb-1">Period Ends</p>
            <p className="font-medium text-gray-200">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/pricing')}
            disabled={actionLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition disabled:opacity-50"
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>Change Plan</span>
          </button>
          
          <button
            onClick={handleRenewMock}
            disabled={actionLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
            <span>Simulate Renewal</span>
          </button>

          <button
            onClick={handleCancel}
            disabled={actionLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition disabled:opacity-50 ml-auto"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
