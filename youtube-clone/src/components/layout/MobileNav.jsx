import { Home, Compass, Upload, Library, User, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function MobileNav({ onUploadClick }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-black lg:hidden z-40">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-around">
        <button onClick={() => navigate('/')} className="flex flex-col items-center text-sm text-gray-500 hover:text-white">
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Inicio</span>
        </button>

        <button onClick={() => navigate('/explore')} className="flex flex-col items-center text-sm text-gray-500 hover:text-white">
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-1">Explorar</span>
        </button>

        {user && (
          <button onClick={onUploadClick} className="flex flex-col items-center text-sm text-gray-500 hover:text-white">
            <Upload className="w-5 h-5" />
            <span className="text-[10px] mt-1">Subir</span>
          </button>
        )}

        {user && (
          <button onClick={() => navigate('/library')} className="flex flex-col items-center text-sm text-gray-500 hover:text-white">
            <Library className="w-5 h-5" />
            <span className="text-[10px] mt-1">Biblioteca</span>
          </button>
        )}

        {user ? (
          <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-sm text-gray-500 hover:text-white">
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-1">Cuenta</span>
          </button>
        ) : (
          <button onClick={() => navigate('/login')} className="flex flex-col items-center text-sm text-gray-500 hover:text-white">
            <LogIn className="w-5 h-5" />
            <span className="text-[10px] mt-1">Iniciar</span>
          </button>
        )}
      </div>
    </nav>
  )
}
