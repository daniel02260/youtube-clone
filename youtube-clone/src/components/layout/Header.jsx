import { Youtube, Search, Bell, User, Mic, Upload, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function Header({ onUploadClick, onSearch }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <header className="w-full bg-black border-b border-black sticky top-0 z-30 shadow-lg">
      <div className="max-w-full mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
          <Youtube className="text-red-600 w-7 h-7" />
          <span className="font-bold text-lg text-white hidden sm:inline">YouTube</span>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden sm:flex items-center">
          <div className="flex items-center w-full gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar"
              className="w-full bg-gray-900 text-white border border-gray-800 rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder-gray-600 transition-all"
            />
            <button type="submit" className="bg-gray-900 text-gray-200 px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <button type="button" className="bg-gray-900 text-gray-200 px-4 py-2.5 rounded-full hover:bg-gray-800 transition-colors hover:text-white">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-1" style={{minWidth: '160px'}}>
          {user ? (
            <>
              <button 
                onClick={onUploadClick}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-900 text-gray-100 rounded-full hover:bg-gray-800 hover:text-white transition-all"
                title="Subir video"
              >
                <Upload className="w-5 h-5" />
                <span className="text-sm font-medium">Crear</span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-900 transition-colors md:hidden">
                <Search className="w-5 h-5 text-gray-200 hover:text-white" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-900 transition-colors hidden sm:block">
                <Bell className="w-6 h-6 text-gray-200 hover:text-white" />
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="p-2 rounded-full hover:bg-gray-900 transition-colors"
                title="Mi perfil"
              >
                <User className="w-6 h-6 text-gray-200 hover:text-white" />
              </button>
            </>
          ) : (
            <>
              <button className="p-2 rounded-full hover:bg-gray-900 transition-colors md:hidden">
                <Search className="w-5 h-5 text-gray-200 hover:text-white" />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
                title="Iniciar sesión"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Iniciar sesión</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
