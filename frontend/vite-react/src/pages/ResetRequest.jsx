import React, { useState } from 'react';
import { Key, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function ResetRequest() {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.target);
    const email = fd.get('email');
    try {
      const r = await api.resetRequest({ email });
      setMsg({ status: 'ok', detail: r.detail || 'Reset token dispatched to registered address.' });
      setTimeout(() => navigate('/reset/confirm'), 1500);
    } catch (err) {
      setMsg({ status: 'error', detail: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center mx-auto mb-4 text-violet-600">
            <Key className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">RESET PASSWORD</h2>
          <p className="text-xs text-slate-500 mt-1">SEND RESET TOKEN TO REGISTERED EMAIL</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">REGISTERED EMAIL</label>
            <input
              name="email"
              type="email"
              required
              placeholder="student@university.edu"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:bg-white"
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-md shadow-violet-500/20"
          >
            <span>{loading ? 'SENDING...' : 'SEND RESET TOKEN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {msg && (
          <div className="mt-6 p-4 rounded-xl text-xs bg-violet-50 border border-violet-200 text-violet-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{msg.detail}</span>
          </div>
        )}
      </div>
    </div>
  );
}
