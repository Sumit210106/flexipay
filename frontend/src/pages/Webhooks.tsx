import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { Webhook, RefreshCcw } from 'lucide-react';

export const WebhooksLog: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  const fetchWebhooks = async () => {
    // We didn't build a list endpoint for webhooks in the backend, 
    // but the backend logs when it receives one. 
    // Let's just create a mock UI since real Stripe webhooks will hit /api/webhooks via POST.
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-3xl font-bold tracking-tight text-white flex items-center space-x-3">
           <Webhook className="w-8 h-8 text-purple-500" />
           <span>Webhook Simulator</span>
         </h1>
      </div>
      
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <p className="text-gray-400 mb-6">
          To test how FlexiPay handles external payment notifications, simulate an incoming webhook from Stripe.
        </p>

        <div className="flex space-x-4 mb-8">
          <button 
            onClick={async () => {
              await apiClient.post('/webhooks', {
                type: 'payment.succeeded',
                payload: { event: "mock_success_event" }
              });
              alert("Webhook sent successfully");
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded-lg transition"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Send payment.succeeded</span>
          </button>
          
          <button 
             onClick={async () => {
              await apiClient.post('/webhooks', {
                type: 'payment.failed',
                payload: { event: "mock_failed_event" }
              });
              alert("Webhook sent successfully");
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition"
          >
             <RefreshCcw className="w-4 h-4" />
            <span>Send payment.failed</span>
          </button>
        </div>

        <div className="bg-gray-950 rounded-xl border border-gray-800 p-4 min-h-[200px] flex items-center justify-center text-sm text-gray-500 font-mono">
          See backend console logs for webhook processing details.
        </div>
      </div>
    </div>
  );
};
