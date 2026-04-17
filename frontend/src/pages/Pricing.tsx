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
    // Only a subscriber can access this
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
      // Must generate an idempotency key for safe retries
      const idempotencyKey = crypto.randomUUID();
      
      await apiClient.post('/subscriptions', {
        userId: user!.id,
        planId: planId
      }, {
        headers: {
          'Idempotency-Key': idempotencyKey
        }
      });
      
      // Navigate to dashboard on success
      navigate('/subscriber');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to subscribe');
    } finally {
      setSubscribingTo(null);
    }
  };

  if (!user || user.role !== 'subscriber') {
    return <div className="text-center text-gray-400 mt-20">Access Denied. Subscriber only.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4 pt-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">Simple, transparent pricing</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Choose the plan that fits your needs. 
          Proration is automatically calculated if you upgrade mid-cycle.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 text-gray-500">Loading pricing models...</div>
      ) : plans.length === 0 ? (
        <div className="text-center text-gray-500">Your organization has not set up any plans yet.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 justify-center">
          {plans.map((plan, i) => {
            const isPopular = i === 1 || plans.length === 1; // Highlight middle plan or single plan
            
            return (
              <div 
                key={plan._id} 
                className={`relative bg-gray-900 rounded-2xl p-8 flex flex-col ${
                  isPopular ? 'border-2 border-blue-500 shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)]' : 'border border-gray-800'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 tracking-wide">
                    <Sparkles className="w-3 h-3" />
                    <span>POPULAR</span>
                  </div>
                )}
                
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline space-x-1 mb-6">
                  <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>
                
                <div className="space-y-4 mb-8 flex-grow text-sm text-gray-400">
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>Mock payment processing included</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>ACID transactional integrity</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>Seamless upgrades/downgrades</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleSubscribe(plan._id)}
                  disabled={subscribingTo !== null}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition flex items-center justify-center space-x-2 ${
                    isPopular 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  } disabled:opacity-50`}
                >
                  {subscribingTo === plan._id ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Subscribe</span>
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
