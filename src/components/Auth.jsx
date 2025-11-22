import { useState } from 'react'

export default function Auth({ onAuthed, backendUrl }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        const res = await fetch(`${backendUrl}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
        if (!res.ok) throw new Error('Registration failed')
      }
      const res = await fetch(`${backendUrl}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      onAuthed(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    const map = {
      admin: { email: 'admin@demo.com', password: 'admin123' },
      owner: { email: 'owner@demo.com', password: 'owner123' },
      user: { email: 'user@demo.com', password: 'user123' },
    }
    setEmail(map[role].email)
    setPassword(map[role].password)
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">{mode === 'login' ? 'Log in' : 'Create account'}</h3>
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-blue-300 text-sm hover:underline">
          {mode === 'login' ? 'Need an account?' : 'Have an account? Log in'}
        </button>
      </div>

      {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

      <form onSubmit={submit} className="space-y-3">
        {mode === 'register' && (
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full bg-slate-900 text-white border border-slate-700 rounded px-3 py-2" />
        )}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-slate-900 text-white border border-slate-700 rounded px-3 py-2" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full bg-slate-900 text-white border border-slate-700 rounded px-3 py-2" />
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-70 text-white rounded px-3 py-2">{loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register & Login')}</button>
      </form>

      <div className="text-slate-300 text-sm mt-4">Try demo accounts:</div>
      <div className="flex gap-2 mt-2">
        <button onClick={()=>fillDemo('user')} className="text-xs bg-slate-700 hover:bg-slate-600 text-white rounded px-2 py-1">User</button>
        <button onClick={()=>fillDemo('owner')} className="text-xs bg-slate-700 hover:bg-slate-600 text-white rounded px-2 py-1">Owner</button>
        <button onClick={()=>fillDemo('admin')} className="text-xs bg-slate-700 hover:bg-slate-600 text-white rounded px-2 py-1">Admin</button>
      </div>
    </div>
  )
}
