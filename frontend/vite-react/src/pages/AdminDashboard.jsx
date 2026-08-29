import React, { useState, useEffect } from 'react';
import { Users, List, AlertTriangle, ShieldCheck, Trash2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, listings, disputes
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      if (err.message.includes('403') || err.message.includes('401')) navigate('/');
      setError('Failed to load stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const fetchListings = async () => {
    try {
      const data = await api.getAdminListings();
      setListings(data);
    } catch (err) {
      setError('Failed to load listings');
    }
  };

  const fetchDisputes = async () => {
    try {
      const data = await api.getAdminDisputes();
      setDisputes(data);
    } catch (err) {
      setError('Failed to load disputes');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await fetchStats();
      if (activeTab === 'users') await fetchUsers();
      if (activeTab === 'listings') await fetchListings();
      if (activeTab === 'disputes') await fetchDisputes();
      setLoading(false);
    };
    loadData();
  }, [activeTab]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.deleteAdminUser(id);
      setUsers(users.filter(u => u.id !== id));
      fetchStats();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.deleteAdminListing(id);
      setListings(listings.filter(l => l.id !== id));
      fetchStats();
    } catch (err) {
      alert("Failed to delete listing");
    }
  };

  const handleResolveDispute = async (id, outcome) => {
    try {
      await api.resolveDispute(id, { outcome });
      setDisputes(disputes.filter(d => d.id !== id));
      fetchStats();
    } catch (err) {
      alert("Failed to resolve dispute");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex justify-center px-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-5xl space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              Admin Control Panel
            </h1>
            <p className="text-sm text-slate-600">Platform moderation and dispute resolution.</p>
          </div>
          <Link to="/" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Exit Admin
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Menu */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'}`}
            >
              <ShieldCheck className="w-5 h-5" /> Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'}`}
            >
              <Users className="w-5 h-5" /> Manage Users
            </button>
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'listings' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'}`}
            >
              <List className="w-5 h-5" /> Moderation
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'disputes' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'}`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" /> Disputes
              </div>
              {stats?.total_disputes > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">{stats.total_disputes}</span>
              )}
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl min-h-[400px]">
            {loading ? (
              <div className="flex justify-center items-center h-full min-h-[300px]">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && stats && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Platform Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Total Users</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.total_users}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Active Listings</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.total_listings}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                        <p className="text-xs text-slate-500 font-semibold mb-1 uppercase">Total Requests</p>
                        <p className="text-3xl font-bold text-slate-900">{stats.total_requests}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                        <p className="text-xs text-rose-600 font-semibold mb-1 uppercase">Open Disputes</p>
                        <p className="text-3xl font-bold text-rose-600">{stats.total_disputes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">User Management</h2>
                    <div className="space-y-3">
                      {users.map(u => (
                        <div key={u.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <div>
                            <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              {u.full_name} 
                              {u.is_admin && <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">Admin</span>}
                            </p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                          {!u.is_admin && (
                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Listings Tab */}
                {activeTab === 'listings' && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Content Moderation</h2>
                    <div className="space-y-3">
                      {listings.length === 0 ? <p className="text-sm text-slate-500 text-center py-8">No listings found.</p> : listings.map(l => (
                        <div key={l.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{l.title}</p>
                            <p className="text-xs text-slate-500">By {l.seller_name}</p>
                          </div>
                          <button onClick={() => handleDeleteListing(l.id)} className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disputes Tab */}
                {activeTab === 'disputes' && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Dispute Resolution</h2>
                    <div className="space-y-4">
                      {disputes.length === 0 ? <p className="text-sm text-slate-500 text-center py-8">No open disputes.</p> : disputes.map(d => (
                        <div key={d.id} className="p-5 rounded-xl bg-rose-50/50 border border-rose-200">
                          <div className="flex items-center justify-between mb-3 border-b border-rose-100 pb-3">
                            <div>
                              <p className="text-sm font-bold text-slate-900">Issue reported by: <span className="text-rose-600">{d.reporter_name}</span></p>
                              <p className="text-xs text-slate-500 mt-1">Listing: <span className="text-slate-800 font-medium">{d.request.listing_title}</span></p>
                            </div>
                            <span className="px-2 py-1 rounded text-[10px] font-bold bg-rose-100 text-rose-700 uppercase">Open Dispute</span>
                          </div>
                          
                          <div className="p-3 rounded-lg bg-white border border-rose-200/60 mb-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Reason provided</span>
                            <p className="text-sm text-slate-700">{d.reason}</p>
                          </div>
                          
                          <div className="flex items-center justify-end gap-3 border-t border-rose-100 pt-3">
                            <p className="text-xs text-slate-500 mr-auto font-medium">Resolve in favor of:</p>
                            <button onClick={() => handleResolveDispute(d.id, 'cancelled')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-semibold transition-colors">
                              <XCircle className="w-4 h-4" /> Buyer (Cancel)
                            </button>
                            <button onClick={() => handleResolveDispute(d.id, 'completed')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors">
                              <CheckCircle className="w-4 h-4" /> Seller (Complete)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
