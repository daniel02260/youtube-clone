import { Home, Compass, Upload, Library, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function MobileNav({ onUploadClick }) {
  const navigate = useNavigate()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 lg:hidden z-40">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-around">
        <button onClick={() => navigate('/')} className="flex flex-col items-center text-sm text-gray-400 hover:text-white">
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Inicio</span>
        </button>

        <button onClick={() => navigate('/explore')} className="flex flex-col items-center text-sm text-gray-400 hover:text-white">
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-1">Explorar</span>
        </button>

        <button onClick={onUploadClick} className="flex flex-col items-center text-sm text-gray-400 hover:text-white">
          <Upload className="w-5 h-5" />
          <span className="text-[10px] mt-1">Subir</span>
        </button>

        <button onClick={() => navigate('/library')} className="flex flex-col items-center text-sm text-gray-400 hover:text-white">
          <Library className="w-5 h-5" />
          <span className="text-[10px] mt-1">Biblioteca</span>
        </button>

        <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-sm text-gray-400 hover:text-white">
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1">Cuenta</span>
        </button>
      </div>
    </nav>
  )
}
