import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { RefreshCw, XCircle, ArrowUpCircle } from 'lucide-react';
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
      // Find active sub for user (assuming an endpoint exists, or we just fetch user profile.
      // Wait, we didn't add a "GET /subscriptions/user" route in backend.
      // But we can hit the DB or just rely on a known subscription ID.
      // Let's assume we have to get the ID somehow. 
      // Actually, since I don't have a /users/:id/subscription endpoint, 
      // I'll fetch ALL plans and maybe we just need the backend to expose that.
      // For now, I'll add a quick route in the backend or fake it.
      
      // Let's modify the backend PlanController or SubscriptionController later.
      // Wait, I am writing frontend now, let me just assume I can call a hypothetical endpoint.
      // ACTUALLY I can't. Let me fetch plans first, then I'll use the ID.
      alert('We need a minor backend tweak to fetch subscription by userId. I will add it.');
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>Building...</div>
  )
}
