const API = 'http://127.0.0.1:8000/auth'
const messages = document.getElementById('messages')

function show(msg){
  messages.textContent = typeof msg === 'string' ? msg : JSON.stringify(msg, null, 2)
}

let token = localStorage.getItem('viba_token') || ''

async function apiFetch(path, opts={}){
  const headers = opts.headers || {}
  if(!headers['Content-Type'] && opts.body) headers['Content-Type'] = 'application/json'
  if(token){ headers['Authorization'] = 'Bearer ' + token }
  const res = await fetch(API+path, {...opts, headers})
  const text = await res.text()
  try{ return JSON.parse(text) }catch(e){ return text }
}

document.getElementById('form-register').addEventListener('submit', async e=>{
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target))
  const r = await apiFetch('/register', {method:'POST', body: JSON.stringify(f)})
  show(r)
})

document.getElementById('form-login').addEventListener('submit', async e=>{
  e.preventDefault();
  const f = new URLSearchParams(new FormData(e.target))
  const res = await fetch(API+'/token', {method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body: f})
  const j = await res.json()
  if(j.access_token){ token = j.access_token; localStorage.setItem('viba_token', token); show({status:'ok','token': 'saved'}) }
  else show(j)
})

document.getElementById('btn-profile').addEventListener('click', async ()=>{
  const r = await apiFetch('/users/me')
  show(r)
})

document.getElementById('btn-logout').addEventListener('click', ()=>{
  token = ''
  localStorage.removeItem('viba_token')
  show('logged out')
})

document.getElementById('form-verify').addEventListener('submit', async e=>{
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target))
  const r = await apiFetch('/verify-email', {method:'POST', body: JSON.stringify(f)})
  show(r)
})

document.getElementById('form-reset-request').addEventListener('submit', async e=>{
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target))
  const r = await apiFetch('/password-reset', {method:'POST', body: JSON.stringify(f)})
  show(r)
})

document.getElementById('form-reset-confirm').addEventListener('submit', async e=>{
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target))
  const r = await apiFetch('/password-reset/confirm', {method:'POST', body: JSON.stringify(f)})
  show(r)
})
