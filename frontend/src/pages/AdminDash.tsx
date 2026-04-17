import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Plus, Package, CreditCard, LayoutTemplate } from 'lucide-react';

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

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <div className="flex items-center space-x-4 border-b border-white/5 pb-8">
        <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
          <LayoutTemplate className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Organization Admin</h1>
          <p className="text-gray-400 mt-1.5 text-sm">Configure subscription products and billing intervals.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Create Plan Form */}
        <div className="md:col-span-4 glass-card rounded-2xl p-6 h-fit relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
          
          <div className="flex items-center space-x-2 mb-6 justify-between">
            <span className="text-white font-medium">Create Model</span>
            <div className=" bg-indigo-500/20 p-1.5 rounded text-indigo-300">
               <Plus className="w-4 h-4" />
            </div>
          </div>
          
          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-gray-500 mb-1.5">Product Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pro Tier"
                className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 outline-none transition placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-gray-500 mb-1.5">Price (INR)</label>
              <input 
                required
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-wider uppercase text-gray-500 mb-1.5">Billing Interval</label>
              <select 
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="w-full bg-[#0a0a0b] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 outline-none transition"
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
              className="w-full mt-4 bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20 disabled:opacity-50 font-medium py-2.5 rounded-lg transition-all"
            >
              {formLoading ? 'Publishing...' : 'Publish Product'}
            </button>
          </form>
        </div>

        {/* Plans List */}
        <div className="md:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white flex items-center space-x-2">
              <Package className="w-5 h-5 text-gray-500" />
              <span>Active Pricing Products</span>
            </h2>
          </div>
          
          {loading ? (
            <div className="text-gray-500 animate-pulse text-sm">Fetching catalog...</div>
          ) : plans.length === 0 ? (
            <div className="p-12 glass-card rounded-2xl text-center text-gray-500 flex flex-col items-center">
              <Package className="w-8 h-8 text-white/10 mb-4" />
              <p>No pricing models have been deployed yet.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {plans.map(plan => (
                <div key={plan._id} className="glass-card rounded-2xl p-5 hover:border-white/20 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-gray-200 group-hover:text-white transition">{plan.name}</h3>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-white/5 border border-white/10 text-gray-400 rounded">
                      ID: {plan._id.slice(-6)}
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold tracking-tight text-white">₹{plan.price}</span>
                    <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">/{plan.interval}</span>
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
