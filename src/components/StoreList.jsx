import { useEffect, useState } from 'react'

export default function StoreList({ backendUrl, user }) {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchStores = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${backendUrl}/stores`)
      const data = await res.json()
      setStores(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStores() }, [])

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">All Stores</h3>
        <button onClick={fetchStores} className="text-xs text-blue-300 hover:underline">Refresh</button>
      </div>

      {loading ? <div className="text-slate-300">Loading...</div> : error ? <div className="text-red-400">{error}</div> : (
        <ul className="divide-y divide-slate-700">
          {stores.map(s => (
            <li key={s.id} className="py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-white font-medium">{s.name}</div>
                  <div className="text-slate-300 text-sm">{s.description}</div>
                  <div className="text-amber-300 text-sm mt-1">{'★'.repeat(Math.round(s.average_rating))}{'☆'.repeat(5-Math.round(s.average_rating))} <span className="text-slate-400">({s.review_count})</span></div>
                  <Reviews backendUrl={backendUrl} storeId={s.id} user={user} onRated={fetchStores} />
                </div>
                <div className="text-slate-400 text-sm">{s.address}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Reviews({ backendUrl, storeId, user, onRated }) {
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const load = async () => {
    const res = await fetch(`${backendUrl}/stores/${storeId}/reviews`)
    const data = await res.json()
    setReviews(data)
  }
  useEffect(() => { load() }, [storeId])

  const submit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) return alert('Login to review')
    const res = await fetch(`${backendUrl}/stores/${storeId}/reviews`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ rating, comment }) })
    if (res.ok) {
      setComment('')
      await load()
      onRated?.()
    } else {
      const err = await res.json().catch(()=>({detail:'Error'}))
      alert(err.detail || 'Error')
    }
  }

  return (
    <div className="mt-3">
      <form onSubmit={submit} className="flex items-center gap-2">
        <select value={rating} onChange={e=>setRating(parseInt(e.target.value))} className="bg-slate-900 text-white border border-slate-700 rounded px-2 py-1 text-sm">
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
        </select>
        <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Write a review..." className="flex-1 bg-slate-900 text-white border border-slate-700 rounded px-3 py-1 text-sm" />
        <button className="text-sm bg-blue-600 hover:bg-blue-500 text-white rounded px-3 py-1">Submit</button>
      </form>
      <ul className="mt-3 space-y-2">
        {reviews.map(r => (
          <li key={r.id} className="text-slate-300 text-sm bg-slate-900/60 border border-slate-700 rounded p-2">
            <div className="text-amber-300">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
            <div>{r.comment}</div>
            <div className="text-slate-500 text-xs">{new Date(r.created_at).toLocaleString?.() || ''}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
