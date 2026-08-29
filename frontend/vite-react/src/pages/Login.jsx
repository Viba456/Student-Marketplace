import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api';

export default function Login() {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.target);
    const username = fd.get('username');
    const password = fd.get('password');
    try {
      const r = await api.login(username, password);
      if (r.access_token) {
        localStorage.setItem('viba_token', r.access_token);
        setMsg({ status: 'ok', detail: 'Signed in successfully! Redirecting...' });
        setTimeout(() => navigate('/profile'), 1200);
      } else {
        setMsg({ status: 'error', detail: r.detail || 'Invalid student credentials' });
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
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 mb-3">
            <GraduationCap className="w-6 h-6" />
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Student Sign In</h2>
          <p className="text-xs text-slate-500 mt-1">Access your campus marketplace account</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              STUDENT EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                name="username"
                type="email"
                required
                placeholder="student@university.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase">
                PASSWORD
              </label>
              <Link to="/reset" className="text-xs font-medium text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {msg && (
          <div
            className={`mt-6 p-3 rounded-xl text-xs flex items-center gap-2 border ${
              msg.status === 'ok'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            }`}
          >
            {msg.status === 'ok' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{msg.detail}</span>
          </div>
        )}

        <div className="mt-6 text-center pt-4 border-t border-slate-200 text-xs text-slate-500">
          New to VIBA?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
}
