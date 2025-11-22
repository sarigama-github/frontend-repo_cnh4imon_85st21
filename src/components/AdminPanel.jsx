import { useEffect, useState } from 'react'

export default function AdminPanel({ backendUrl }) {
  const token = localStorage.getItem('token')
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [reviews, setReviews] = useState([])

  const load = async () => {
    const headers = { Authorization: `Bearer ${token}` }
    const [u, s, r] = await Promise.all([
      fetch(`${backendUrl}/admin/users`, { headers }).then(r=>r.json()),
      fetch(`${backendUrl}/admin/stores`, { headers }).then(r=>r.json()),
      fetch(`${backendUrl}/admin/reviews`, { headers }).then(r=>r.json()),
    ])
    setUsers(u); setStores(s); setReviews(r)
  }
  useEffect(()=>{ load() },[])

  const updateUser = async (id, updates) => {
    const res = await fetch(`${backendUrl}/admin/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(updates) })
    if (res.ok) load(); else alert('Error')
  }
  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    const res = await fetch(`${backendUrl}/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) load(); else alert('Error')
  }
  const deleteStore = async (id) => {
    if (!confirm('Delete this store?')) return
    const res = await fetch(`${backendUrl}/admin/stores/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) load(); else alert('Error')
  }
  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return
    const res = await fetch(`${backendUrl}/admin/reviews/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) load(); else alert('Error')
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-white font-semibold">Admin</h3>
        <div className="flex gap-2">
          {['users','stores','reviews'].map(t => (
            <button key={t} onClick={()=>setTab(t)} className={`text-xs rounded px-2 py-1 ${tab===t?'bg-blue-600 text-white':'bg-slate-700 text-slate-200'}`}>{t}</button>
          ))}
        </div>
      </div>

      {tab==='users' && (
        <ul className="divide-y divide-slate-700">
          {users.map(u => (
            <li key={u.id} className="py-3 flex items-center justify-between">
              <div className="text-slate-200 text-sm">{u.name} · {u.email}</div>
              <div className="flex items-center gap-2">
                <select defaultValue={u.role} onChange={e=>updateUser(u.id,{role:e.target.value})} className="bg-slate-900 text-white border border-slate-700 rounded px-2 py-1 text-xs">
                  <option>user</option>
                  <option>owner</option>
                  <option>admin</option>
                </select>
                <label className="text-slate-300 text-xs">Active <input type="checkbox" defaultChecked={u.is_active} onChange={e=>updateUser(u.id,{is_active:e.target.checked})} /></label>
                <button onClick={()=>deleteUser(u.id)} className="text-xs bg-red-600 hover:bg-red-500 text-white rounded px-2 py-1">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {tab==='stores' && (
        <ul className="divide-y divide-slate-700">
          {stores.map(s => (
            <li key={s.id} className="py-3 flex items-center justify-between">
              <div className="text-slate-200 text-sm">{s.name} · {s.address}</div>
              <button onClick={()=>deleteStore(s.id)} className="text-xs bg-red-600 hover:bg-red-500 text-white rounded px-2 py-1">Delete</button>
            </li>
          ))}
        </ul>
      )}

      {tab==='reviews' && (
        <ul className="divide-y divide-slate-700">
          {reviews.map(r => (
            <li key={r.id} className="py-3 flex items-center justify-between">
              <div className="text-slate-200 text-sm">Store {r.store_id} · User {r.user_id} · {r.rating}★</div>
              <button onClick={()=>deleteReview(r.id)} className="text-xs bg-red-600 hover:bg-red-500 text-white rounded px-2 py-1">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
