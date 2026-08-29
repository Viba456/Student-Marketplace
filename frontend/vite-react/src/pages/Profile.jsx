import React, { useState, useEffect } from 'react';
import { GraduationCap, ShieldCheck, LogOut, RefreshCw, Save, Trash2, KeyRound, Plus, X, Star, Video, Upload } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import MediaViewerModal from '../components/MediaViewerModal';

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [skillName, setSkillName] = useState('');
  const [skillProficiency, setSkillProficiency] = useState('Beginner');
  const [mediaSkill, setMediaSkill] = useState(null);
  const navigate = useNavigate();

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await api.me();
      setData(res);
    } catch (err) {
      setData({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  function handleLogout() {
    localStorage.removeItem('viba_token');
    navigate('/login');
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.target);
    const payload = {
      full_name: fd.get('full_name') || null,
      phone: fd.get('phone') || null,
      bio: fd.get('bio') || null,
      university: fd.get('university') || null,
      major: fd.get('major') || null,
      graduation_year: fd.get('graduation_year') ? parseInt(fd.get('graduation_year')) : null,
      profile_picture_url: fd.get('profile_picture_url') || null,
    };
    try {
      const res = await api.updateProfile(payload);
      setData(res);
      setMsg({ status: 'ok', detail: 'Profile updated' });
    } catch(err) {
      setMsg({ status: 'error', detail: err.message });
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setMsg(null);
    const fd = new FormData(e.target);
    try {
      const res = await api.changePassword({ 
        current_password: fd.get('current_password'),
        new_password: fd.get('new_password')
      });
      setMsg({ status: 'ok', detail: res.detail || 'Password changed' });
      e.target.reset();
    } catch(err) {
      setMsg({ status: 'error', detail: err.message });
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      await api.deleteAccount();
      handleLogout();
    } catch(err) {
      setMsg({ status: 'error', detail: err.message });
    }
  }
  
  async function handleAddSkill(e) {
    e.preventDefault();
    if (!skillName.trim()) return;
    setMsg(null);
    try {
      const newSkill = await api.addSkill({ skill_name: skillName, proficiency: skillProficiency });
      setData(prev => ({...prev, skills: [...(prev.skills || []), newSkill]}));
      setSkillName('');
      setSkillProficiency('Beginner');
      setMsg({ status: 'ok', detail: 'Skill added' });
    } catch (err) {
      setMsg({ status: 'error', detail: err.message });
    }
  }

  async function handleRemoveSkill(id) {
    setMsg(null);
    try {
      await api.removeSkill(id);
      setData(prev => ({...prev, skills: prev.skills.filter(s => s.id !== id)}));
      setMsg({ status: 'ok', detail: 'Skill removed' });
    } catch (err) {
      setMsg({ status: 'error', detail: err.message });
    }
  }

  async function handleDeleteListing(id) {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    setMsg(null);
    try {
      await api.deleteListing(id);
      setData(prev => ({...prev, listings: prev.listings.filter(l => l.id !== id)}));
      setMsg({ status: 'ok', detail: 'Listing removed' });
    } catch (err) {
      setMsg({ status: 'error', detail: err.message });
    }
  }

  async function handleToggleListingPause(listing) {
    setMsg(null);
    try {
      const res = await api.updateListing(listing.id, { is_active: !listing.is_active });
      setData(prev => ({
        ...prev, 
        listings: prev.listings.map(l => l.id === listing.id ? res : l)
      }));
      setMsg({ status: 'ok', detail: res.is_active ? 'Listing resumed' : 'Listing paused' });
    } catch (err) {
      setMsg({ status: 'error', detail: err.message });
    }
  }

  async function handleUploadListingMedia(listingId, e) {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    setMsg(null);
    const fd = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      fd.append('files', selectedFiles[i]);
    }
    try {
      await api.uploadListingMedia(listingId, fd);
      setMsg({ status: 'ok', detail: `${selectedFiles.length} course media item(s) uploaded successfully` });
      fetchProfile();
    } catch (err) {
      setMsg({ status: 'error', detail: err.message });
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center px-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-4xl p-8 rounded-2xl bg-white border border-slate-200 shadow-xl relative grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          <div className="flex flex-col items-center p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <div className="w-24 h-24 rounded-full bg-white border-2 border-blue-500 mb-4 overflow-hidden flex items-center justify-center text-slate-400 shadow-xs">
              {data?.profile_picture_url ? (
                <img src={data.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <GraduationCap className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{data?.full_name || 'Student'}</h2>
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Campus Verified
            </span>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-2xs">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-slate-900">{data?.average_rating?.toFixed(1) || '0.0'}</span>
              <span className="text-xs text-slate-500">({data?.rating_count || 0} reviews)</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={fetchProfile}
              disabled={loading}
              className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
            </button>
            <Link
              to="/"
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-sm font-semibold transition-colors"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {msg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${msg.status === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
              <span>{msg.detail}</span>
            </div>
          )}

          {data && !data.error && (
            <>
              {/* Profile Update */}
              <form onSubmit={handleUpdateProfile} className="space-y-4 p-6 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 border-b border-slate-200 pb-2">Profile & Academic Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email (Read Only)</label>
                    <input type="email" value={data.email} disabled className="w-full px-3 py-2 rounded-lg bg-slate-200/60 border border-slate-300 text-slate-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
                    <input name="full_name" type="text" defaultValue={data.full_name || ''} className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone</label>
                    <input name="phone" type="text" defaultValue={data.phone || ''} className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Profile Picture URL</label>
                    <input name="profile_picture_url" type="url" defaultValue={data.profile_picture_url || ''} placeholder="https://..." className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Bio</label>
                    <textarea name="bio" rows="3" defaultValue={data.bio || ''} className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">University</label>
                    <input name="university" type="text" defaultValue={data.university || ''} className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Major</label>
                    <input name="major" type="text" defaultValue={data.major || ''} className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Graduation Year</label>
                    <input name="graduation_year" type="number" defaultValue={data.graduation_year || ''} className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600" />
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
                    <Save className="w-4 h-4" /> Save Profile
                  </button>
                </div>
              </form>

              {/* Skills Section */}
              <div className="space-y-4 p-6 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 border-b border-slate-200 pb-2">Skills & Proficiency</h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.skills?.map(skill => (
                    <div key={skill.id} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                      <div>
                        <span className="text-sm text-slate-900 font-medium">{skill.skill_name}</span>
                        <span className="text-xs text-blue-600 ml-2">({skill.proficiency})</span>
                      </div>
                      <button onClick={() => handleRemoveSkill(skill.id)} className="text-slate-400 hover:text-rose-600 ml-1 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {(!data.skills || data.skills.length === 0) && (
                    <span className="text-sm text-slate-500">No skills added yet.</span>
                  )}
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Skill</label>
                    <input type="text" value={skillName} onChange={e => setSkillName(e.target.value)} placeholder="e.g. React, Python" className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600" />
                  </div>
                  <div className="w-40">
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Level</label>
                    <select value={skillProficiency} onChange={e => setSkillProficiency(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 appearance-none">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 h-[38px]">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </form>
              </div>

              {/* My Service Listings */}
              <div className="space-y-4 p-6 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">My Service Listings</h3>
                  <Link to="/" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Create New Listing &rarr;</Link>
                </div>
                <div className="flex flex-col gap-4">
                  {data.listings?.map(listing => (
                    <div key={listing.id} className={`p-4 rounded-xl border ${listing.is_active ? 'border-slate-200 bg-white shadow-2xs' : 'border-slate-200 bg-slate-100 opacity-70'} flex flex-col md:flex-row gap-4 justify-between items-start md:items-center`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-bold text-slate-900">{listing.title}</h4>
                          {!listing.is_active && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">PAUSED</span>}
                        </div>
                        <div className="flex gap-3 text-xs text-slate-500 mb-2">
                          <span>{listing.category}</span>
                          <span>•</span>
                          <span className="font-semibold text-blue-600">{listing.price}</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1">{listing.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0 justify-end flex-wrap">
                        <button
                          onClick={() => setMediaSkill(listing)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 flex items-center gap-1 transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" /> Media
                        </button>
                        
                        <label className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 font-medium border border-slate-200 cursor-pointer flex items-center gap-1 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Add Media</span>
                          <input
                            type="file"
                            multiple
                            accept="video/*,image/*"
                            onChange={(e) => handleUploadListingMedia(listing.id, e)}
                            className="hidden"
                          />
                        </label>

                        <button onClick={() => handleToggleListingPause(listing)} className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 font-medium border border-slate-200 transition-colors">
                          {listing.is_active ? 'Pause' : 'Resume'}
                        </button>
                        
                        <button onClick={() => handleDeleteListing(listing.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!data.listings || data.listings.length === 0) && (
                    <div className="text-center py-6 text-sm text-slate-500">
                      You haven't created any service listings yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Password & Danger Zone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form onSubmit={handleChangePassword} className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Change Password</h3>
                  <div>
                    <input name="current_password" type="password" placeholder="Current Password" required className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600" />
                  </div>
                  <div>
                    <input name="new_password" type="password" placeholder="New Password" required className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600" />
                  </div>
                  <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors">
                    <KeyRound className="w-4 h-4" /> Update Password
                  </button>
                </form>
                
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Account Actions</h3>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="w-full py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {data?.error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
              Failed to load profile: {data.error}
            </div>
          )}
        </div>

      </div>

      {mediaSkill && (
        <MediaViewerModal
          skill={mediaSkill}
          onClose={() => setMediaSkill(null)}
        />
      )}
    </div>
  );
}
