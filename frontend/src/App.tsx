import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { AdminDash } from './pages/AdminDash';
import { Pricing } from './pages/Pricing';
import { SubscriberDash } from './pages/SubscriberDash';
import { WebhooksLog } from './pages/Webhooks';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDash />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/subscriber" element={<SubscriberDash />} />
            <Route path="/webhooks" element={<WebhooksLog />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
