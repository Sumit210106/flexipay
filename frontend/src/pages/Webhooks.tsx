import React from 'react';
import { apiClient } from '../api/client';
import { Webhook, RefreshCcw, Activity } from 'lucide-react';

export const WebhooksLog: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center space-x-4 border-b border-white/5 pb-8">
        <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
          <Webhook className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Webhook Simulation</h1>
          <p className="text-gray-400 mt-1.5 text-sm">Testing async payment gateway interactions.</p>
        </div>
      </div>
      
      <div className="glass-card rounded-[2rem] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[60px] -mr-32 -mt-32 pointer-events-none" />

        <p className="text-gray-400 leading-relaxed max-w-2xl text-sm mb-8 relative z-10">
          The <code className="text-purple-400 bg-purple-500/10 px-1.5 rounded">WebhookController</code> rapidly acknowledges inbound HTTP requests to prevent timeouts, and delegates processing to the <code className="text-purple-400 bg-purple-500/10 px-1.5 rounded">WebhookService</code> which manages idempotency. Simulate gateway payloads below.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10 relative z-10">
          <button 
            onClick={async () => {
              await apiClient.post('/webhooks', {
                type: 'payment.succeeded',
                payload: { event: "mock_success_event" }
              });
              alert("Payment success simulated. Check backend logs.");
            }}
            className="flex items-center justify-center space-x-2 p-6 bg-[#0a0a0b] hover:bg-[#121215] border border-white/5 hover:border-emerald-500/30 rounded-2xl group transition-all"
          >
            <div className="text-left w-full">
              <div className="flex items-center space-x-2 mb-2">
                <RefreshCcw className="w-4 h-4 text-emerald-500 group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-semibold text-gray-200">payment.succeeded</span>
              </div>
              <p className="text-xs text-gray-500">Inject a mock successful fulfillment payload.</p>
            </div>
          </button>
          
          <button 
             onClick={async () => {
              await apiClient.post('/webhooks', {
                type: 'payment.failed',
                payload: { event: "mock_failed_event" }
              });
              alert("Payment failure simulated. Check backend logs.");
            }}
            className="flex items-center justify-center space-x-2 p-6 bg-[#0a0a0b] hover:bg-[#121215] border border-white/5 hover:border-red-500/30 rounded-2xl group transition-all"
          >
             <div className="text-left w-full">
              <div className="flex items-center space-x-2 mb-2">
                <RefreshCcw className="w-4 h-4 text-red-500 group-hover:-rotate-180 transition-transform duration-500" />
                <span className="font-semibold text-gray-200">payment.failed</span>
              </div>
              <p className="text-xs text-gray-500">Inject a mock declined transaction payload.</p>
            </div>
          </button>
        </div>

        <div className="bg-[#050506] rounded-xl border border-white/5 p-6 min-h-[160px] flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent pointer-events-none" />
          <div className="flex items-center space-x-2 text-indigo-400 mb-2">
             <Activity className="w-4 h-4 animate-pulse" />
             <span className="text-xs font-bold uppercase tracking-widest">System Monitor</span>
          </div>
          <p className="text-[13px] text-gray-500 font-mono tracking-tight leading-relaxed group-hover:text-gray-400 transition-colors">
            Switch to your terminal window. The backend process running on <span className="text-gray-300">Port 5000</span> will display the real-time fulfillment execution trail when webhooks are dispatched.
          </p>
        </div>
      </div>
    </div>
  );
};
