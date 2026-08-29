import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, User, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api';

export default function Register() {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.target);
    const email = fd.get('email');
    const full_name = fd.get('full_name');
    const password = fd.get('password');
    try {
      const r = await api.register({ email, full_name, password });
      if (r.id || r.email || r.status === 'ok') {
        setMsg({ status: 'ok', detail: 'Student Registration Complete! Redirecting to email verification...' });
        setTimeout(() => navigate('/verify'), 1500);
      } else {
        setMsg({ status: 'error', detail: r.detail || 'Registration failed' });
      }
    } catch (err) {
      setMsg({ status: 'error', detail: err.message || 'Connection error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-slate-200 shadow-xl relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-50 border border-violet-200 text-violet-600 mb-3">
            <GraduationCap className="w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Student Registration</h2>
          <p className="text-xs text-slate-500 mt-1">Join the campus peer-to-peer marketplace</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              STUDENT EMAIL (.EDU)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                name="email"
                type="email"
                required
                placeholder="student@university.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              FULL NAME
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                name="full_name"
                type="text"
                placeholder="Alex Rivera"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-95 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-violet-500/20 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Join Student Marketplace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {msg && (
          <div
            className={`mt-6 p-3 rounded-xl text-xs flex items-center gap-2 border ${
              msg.status === 'ok'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {msg.status === 'ok' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{msg.detail}</span>
          </div>
        )}

        <div className="mt-6 text-center pt-4 border-t border-slate-200 text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-violet-600 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
