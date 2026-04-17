import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Plus, Package, CreditCard } from 'lucide-react';

interface Plan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
}

export const AdminDash: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  // New Plan Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('199');
  const [interval, setInterval] = useState('month');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await apiClient.get('/plans');
      setPlans(res.data.data);
    } catch (err) {
      console.error('Failed to fetch plans', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await apiClient.post('/plans', {
        name,
        price: Number(price),
        currency: 'INR',
        interval,
      });
      setName('');
      setPrice('199');
      fetchPlans();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to create plan');
    } finally {
      setFormLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="text-center text-gray-400 mt-20">Access Denied. Admin only.</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Organization Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your pricing tiers.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Create Plan Form */}
        <div className="md:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-6 h-fit">
          <div className="flex items-center space-x-2 mb-6 text-white font-medium">
            <Plus className="w-5 h-5 text-purple-400" />
            <span>Create New Plan</span>
          </div>
          
          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Plan Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pro Tier"
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Price (INR)</label>
              <input 
                required
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Billing Interval</label>
              <select 
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:ring-purple-500 focus:border-purple-500 outline-none"
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
            
            <button 
              disabled={formLoading}
              type="submit"
              className="w-full mt-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
            >
              {formLoading ? 'Creating...' : 'Create Plan'}
            </button>
          </form>
        </div>

        {/* Plans List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Package className="w-5 h-5 text-gray-500" />
            <span>Active Plans</span>
          </h2>
          
          {loading ? (
            <div className="text-gray-500 animate-pulse">Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="p-8 border border-dashed border-gray-800 rounded-xl text-center text-gray-500">
              No plans found. Create one to get started.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {plans.map(plan => (
                <div key={plan._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-white">{plan.name}</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-800 text-gray-300 rounded">
                      ID: {plan._id.slice(-6)}
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-white">₹{plan.price}</span>
                    <span className="text-gray-500 text-sm">/{plan.interval}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
