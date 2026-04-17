import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { Check, CreditCard, Sparkles } from 'lucide-react';

interface Plan {
  _id: string;
  name: string;
  price: number;
  interval: string;
}

export const Pricing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribingTo, setSubscribingTo] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role === 'subscriber') {
      fetchPlans();
    }
  }, [user]);

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

  const handleSubscribe = async (planId: string) => {
    setSubscribingTo(planId);
    try {
      const idempotencyKey = crypto.randomUUID();
      await apiClient.post('/subscriptions', {
        userId: user!.id,
        planId: planId
      }, {
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      });
      navigate('/subscriber');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to subscribe');
    } finally {
      setSubscribingTo(null);
    }
  };

  if (!user || user.role !== 'subscriber') {
    return <div className="text-center text-gray-400 mt-20">Access Denied. Subscriber context required.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <div className="text-center space-y-5 pt-12 relative">
        <h1 className="text-5xl font-bold text-white tracking-tight">Flexible tiers for <span className="premium-gradient">seamless scaling</span></h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Upgrade or downgrade at any time. Proration logic securely handles mid-cycle credit allocation automatically.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 text-gray-500 animate-pulse font-medium">Synchronizing plans...</div>
      ) : plans.length === 0 ? (
        <div className="text-center p-12 glass-card rounded-2xl max-w-2xl mx-auto border-dashed">
          <p className="text-gray-400">No active plans detected for this organization context.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 justify-center max-w-5xl mx-auto items-end">
          {plans.map((plan, i) => {
            const isPopular = plans.length > 1 ? i === 1 : true;
            
            return (
              <div 
                key={plan._id} 
                className={`relative glass-card rounded-3xl p-8 flex flex-col transition-all duration-300 ${
                  isPopular 
                    ? 'border-indigo-500/50 shadow-[0_4px_40px_-15px_rgba(99,102,241,0.25)] md:-mt-6 bg-[#0f0f11]' 
                    : 'hover:border-white/20'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg shadow-indigo-500/20">
                    <Sparkles className="w-3 h-3" />
                    <span>Recommended</span>
                  </div>
                )}
                
                <h3 className="text-xl font-medium text-gray-200 mb-4">{plan.name}</h3>
                <div className="flex items-baseline space-x-1 mb-8">
                  <span className="text-4xl font-bold tracking-tight text-white">₹{plan.price}</span>
                  <span className="text-gray-500 text-sm font-medium">/{plan.interval}</span>
                </div>
                
                <div className="space-y-4 mb-10 flex-grow text-sm text-gray-300">
                  <div className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">Mock payment gateway integration</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">MongoDB ACID transaction safety</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">Automated invoice generation</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleSubscribe(plan._id)}
                  disabled={subscribingTo !== null}
                  className={`w-full py-3.5 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isPopular 
                      ? 'bg-indigo-500 hover:bg-indigo-400 text-white shadow hover:shadow-indigo-500/25' 
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {subscribingTo === plan._id ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>{isPopular ? 'Subscribe Now' : 'Select Plan'}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
