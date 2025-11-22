import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Auth from './components/Auth'
import StoreList from './components/StoreList'
import OwnerPanel from './components/OwnerPanel'
import AdminPanel from './components/AdminPanel'

function App() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const [user, setUser] = useState(null)
  const [view, setView] = useState('stores')

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
    // auto-seed demo data once
    fetch(`${backendUrl}/seed`, { method: 'POST' }).catch(()=>{})
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      <Navbar user={user} onLogout={logout} onNavigate={setView} />

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {view==='stores' && <StoreList backendUrl={backendUrl} user={user} />}
          {view==='owner' && user?.role==='owner' && <OwnerPanel backendUrl={backendUrl} />}
          {view==='admin' && user?.role==='admin' && <AdminPanel backendUrl={backendUrl} />}
        </div>
        <div className="md:col-span-1 space-y-6">
          {!user && <Auth backendUrl={backendUrl} onAuthed={setUser} />}

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-2">About</h3>
            <p className="text-slate-300 text-sm">
              Rate stores, write reviews, and manage your listings. Use the demo accounts to explore different roles.
            </p>
            <div className="text-xs text-slate-400 mt-3">
              Demo emails: admin@demo.com, owner@demo.com, user@demo.com
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
