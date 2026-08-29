import React, { useState } from 'react';
import { KeyRound, Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Verify() {
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const fd = new FormData(e.target);
    const email = fd.get('email');
    const code = fd.get('code');
    try {
      const r = await api.verify({ email, code });
      setMsg({ status: 'ok', detail: r.detail || 'Email Neural Handshake Confirmed!' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMsg({ status: 'error', detail: err.message || 'Verification token invalid' });
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    const email = document.querySelector('input[name="email"]').value;
    if (!email) {
      setMsg({ status: 'error', detail: 'Please enter your email first.' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const r = await api.resendOtp({ email });
      setMsg({ status: 'ok', detail: r.detail || 'OTP Resent successfully!' });
    } catch (err) {
      setMsg({ status: 'error', detail: err.message || 'Failed to resend OTP' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-4 text-blue-600">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 font-heading">VERIFY EMAIL OTP</h2>
          <p className="text-xs text-slate-500 mt-1">INPUT 6-DIGIT VERIFICATION CODE</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">EMAIL</label>
            <input
              name="email"
              type="email"
              required
              placeholder="student@university.edu"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">OTP VERIFICATION CODE</label>
            <input
              name="code"
              type="text"
              required
              placeholder="123456"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-mono text-center tracking-widest placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-xs uppercase flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
          >
            <span>{loading ? 'VERIFYING...' : 'CONFIRM VERIFICATION'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            type="button"
            disabled={loading}
            onClick={handleResend}
            className="w-full py-2.5 mt-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs uppercase transition-all disabled:opacity-50"
          >
            RESEND OTP
          </button>
        </form>

        {msg && (
          <div className="mt-6 p-4 rounded-xl text-xs bg-blue-50 border border-blue-200 text-blue-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{msg.detail}</span>
          </div>
        )}
      </div>
    </div>
  );
}
