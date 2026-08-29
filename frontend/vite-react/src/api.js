const API_BASE = '/auth'

async function request(path, opts={}){
  const token = localStorage.getItem('viba_token')
  const headers = opts.headers || {}
  if(opts.body && !(opts.body instanceof FormData)){
    headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(opts.body)
  }
  if(token) headers['Authorization'] = 'Bearer ' + token
  const prefix = path.startsWith('/admin') ? '' : API_BASE
  const res = await fetch(prefix + path, {...opts, headers})
  const text = await res.text()
  let data;
  try {
    data = JSON.parse(text)
  } catch(e) {
    data = text
  }
  if (!res.ok) {
    const msg = (data && data.detail) ? data.detail : (typeof data === 'string' ? data : `API Error ${res.status}`)
    throw new Error(msg)
  }
  return data
}

export const register = (data) => request('/register', {method:'POST', body: data})
export const login = async (username, password) => {
  const params = new URLSearchParams({username, password})
  const res = await fetch('/auth/token', {method:'POST', body: params})
  return res.json()
}
export const me = () => request('/users/me')
export const verify = (data) => request('/verify-email', {method:'POST', body: data})
export const resendOtp = (data) => request('/resend-otp', {method:'POST', body: data})
export const resetRequest = (data) => request('/password-reset', {method:'POST', body: data})
export const resetConfirm = (data) => request('/password-reset/confirm', {method:'POST', body: data})
export const updateProfile = (data) => request('/users/me', {method:'PUT', body: data})
export const changePassword = (data) => request('/change-password', {method:'POST', body: data})
export const deleteAccount = () => request('/users/me', {method:'DELETE'})

export const addSkill = (data) => request('/users/me/skills', {method:'POST', body: data})
export const removeSkill = (id) => request(`/users/me/skills/${id}`, {method:'DELETE'})

export const getListings = () => request('/listings')
export const createListing = (data) => request('/users/me/listings', {method:'POST', body: data})
export const updateListing = (id, data) => request(`/users/me/listings/${id}`, {method:'PUT', body: data})
export const deleteListing = (id) => request(`/users/me/listings/${id}`, {method:'DELETE'})

export const uploadListingMedia = (listingId, formData) => request(`/listings/${listingId}/media`, {method: 'POST', body: formData})
export const getListingMedia = (listingId) => request(`/listings/${listingId}/media`)
export const deleteListingMedia = (listingId, mediaId) => request(`/listings/${listingId}/media/${mediaId}`, {method: 'DELETE'})

export const createRequest = (data) => request('/requests', {method:'POST', body: data})
export const getIncomingRequests = () => request('/requests/incoming')
export const getOutgoingRequests = () => request('/requests/outgoing')
export const updateRequestStatus = (id, status) => request(`/requests/${id}/status`, {method:'PUT', body: {status}})

export const createReview = (data) => request('/reviews', {method:'POST', body: data})
export const createDispute = (data) => request('/disputes', {method:'POST', body: data})

export const getAdminStats = () => request('/admin/stats')
export const getAdminUsers = () => request('/admin/users')
export const deleteAdminUser = (id) => request(`/admin/users/${id}`, {method:'DELETE'})
export const getAdminListings = () => request('/admin/listings')
export const deleteAdminListing = (id) => request(`/admin/listings/${id}`, {method:'DELETE'})
export const getAdminDisputes = () => request('/admin/disputes')
export const resolveDispute = (id, resolution) => request(`/admin/disputes/${id}/resolve`, {method:'PUT', body: resolution})

export default {
  register, login, me, verify, resendOtp, resetRequest, resetConfirm, 
  updateProfile, changePassword, deleteAccount, addSkill, removeSkill,
  getListings, createListing, updateListing, deleteListing,
  uploadListingMedia, getListingMedia, deleteListingMedia,
  createRequest, getIncomingRequests, getOutgoingRequests, updateRequestStatus,
  createReview, createDispute,
  getAdminStats, getAdminUsers, deleteAdminUser, getAdminListings, deleteAdminListing, getAdminDisputes, resolveDispute
}
