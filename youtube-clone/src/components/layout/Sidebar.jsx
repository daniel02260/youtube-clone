import { Home, Compass, Library, Play, Clock, ThumbsUp } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  const mainItems = [
    { to: '/', label: 'Inicio', icon: Home },
    { to: '/shorts', label: 'Shorts', icon: Play },
    { to: '/subscriptions', label: 'Suscripciones', icon: Compass },
  ]

  const secondaryItems = [
    { to: '/library', label: 'Biblioteca', icon: Library },
    { to: '/history', label: 'Historial', icon: Clock },
    { to: '/watch-later', label: 'Ver más tarde', icon: ThumbsUp },
  ]

  return (
    <aside className="w-64 hidden lg:block border-r border-gray-700 bg-gray-900 overflow-y-auto h-screen sticky top-20">
      <nav className="p-3">
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-700">
          {mainItems.map((it) => {
            const Icon = it.icon
            return (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-3 py-2 rounded hover:bg-gray-800 transition ${isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`
                }
              >
                <Icon className="w-6 h-6" />
                <span className="font-medium">{it.label}</span>
              </NavLink>
            )
          })}
        </div>
        <div className="space-y-2">
          {secondaryItems.map((it) => {
            const Icon = it.icon
            return (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-3 py-2 rounded hover:bg-gray-800 transition ${isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`
                }
              >
                <Icon className="w-6 h-6" />
                <span className="font-medium">{it.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
