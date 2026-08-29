import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeLanding from './pages/HomeLanding';
import Register from './pages/Register';
import Login from './pages/Login';
import Verify from './pages/Verify';
import ResetRequest from './pages/ResetRequest';
import ResetConfirm from './pages/ResetConfirm';
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Routes>
        <Route path="/" element={<HomeLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/reset" element={<ResetRequest />} />
        <Route path="/reset/confirm" element={<ResetConfirm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}
