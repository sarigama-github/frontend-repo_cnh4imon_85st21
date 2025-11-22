import { useEffect } from 'react'

export default function Navbar({ user, onLogout, onNavigate }) {
  useEffect(() => {}, [user])
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-slate-900/70 border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/flame-icon.svg" alt="logo" className="w-7 h-7" />
          <span className="text-white font-semibold">Store Ratings</span>
        </div>
        <nav className="flex items-center gap-3">
          <button onClick={() => onNavigate('stores')} className="text-slate-200 hover:text-white text-sm">Stores</button>
          {user?.role === 'owner' && (
            <button onClick={() => onNavigate('owner')} className="text-slate-200 hover:text-white text-sm">Owner</button>
          )}
          {user?.role === 'admin' && (
            <button onClick={() => onNavigate('admin')} className="text-slate-200 hover:text-white text-sm">Admin</button>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-300 text-sm">{user.name} · {user.role}</span>
              <button onClick={onLogout} className="text-sm bg-slate-700 hover:bg-slate-600 text-white rounded px-3 py-1">Logout</button>
          </div>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
