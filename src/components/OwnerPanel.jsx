import { useEffect, useState } from 'react'

export default function OwnerPanel({ backendUrl }) {
  const [stores, setStores] = useState([])
  const [form, setForm] = useState({ name: '', description: '', address: '' })

  const token = localStorage.getItem('token')

  const load = async () => {
    const res = await fetch(`${backendUrl}/stores/my`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setStores(data)
  }
  useEffect(()=>{ load() },[])

  const create = async (e) => {
    e.preventDefault()
    const res = await fetch(`${backendUrl}/stores`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
    if (res.ok) {
      setForm({ name: '', description: '', address: '' })
      load()
    } else {
      const err = await res.json().catch(()=>({detail:'Error'}))
      alert(err.detail || 'Error')
    }
  }

  const save = async (id, payload) => {
    const res = await fetch(`${backendUrl}/stores/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
    if (res.ok) load(); else alert('Error')
  }

  const removeStore = async (id) => {
    if (!confirm('Delete this store?')) return
    const res = await fetch(`${backendUrl}/stores/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) load(); else alert('Error')
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-white font-semibold mb-4">Owner Panel</h3>

      <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4">
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-2" />
        <input value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-2" />
        <input value={form.address} onChange={e=>setForm({...form, address:e.target.value})} placeholder="Address" className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-2" />
        <button className="bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-2">Add Store</button>
      </form>

      <ul className="divide-y divide-slate-700">
        {stores.map(s => (
          <li key={s.id} className="py-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <div className="text-white font-medium">{s.name}</div>
              <div className="text-slate-400 text-sm">{s.address}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
              <input defaultValue={s.name} onBlur={e=>save(s.id, { ...s, name: e.target.value })} className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-1 text-sm" />
              <input defaultValue={s.description || ''} onBlur={e=>save(s.id, { ...s, description: e.target.value })} className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-1 text-sm" />
              <input defaultValue={s.address || ''} onBlur={e=>save(s.id, { ...s, address: e.target.value })} className="bg-slate-900 text-white border border-slate-700 rounded px-3 py-1 text-sm" />
            </div>
            <div className="mt-2">
              <button onClick={()=>removeStore(s.id)} className="text-xs bg-red-600 hover:bg-red-500 text-white rounded px-2 py-1">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
