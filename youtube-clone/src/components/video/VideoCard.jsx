import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Eye } from 'lucide-react'

export default function VideoCard({ video, onClick }) {
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div onClick={() => onClick(video)} className="cursor-pointer group">
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-3 shadow-lg group-hover:shadow-xl group-hover:shadow-red-900/20 transition-all">
        {video.url_miniatura ? (
          <img
            src={video.url_miniatura}
            alt={video.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-gray-500">Sin miniatura</span>
          </div>
        )}
        
        {video.duracion && (
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-85 text-white text-xs font-semibold px-2 py-1 rounded">
            {formatDuration(video.duracion)}
          </span>
        )}
      </div>

      <div className="flex gap-3 px-1">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            {video.perfiles?.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 mb-1.5 text-white group-hover:text-gray-100 transition-colors">
            {video.titulo}
          </h3>
          
          <p className="text-xs text-gray-500 mb-1.5 hover:text-gray-400 transition-colors">
            {video.perfiles?.nombre || 'Canal desconocido'}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-gray-600 group-hover:text-gray-500 transition-colors">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(video.vistas || 0)} vistas
            </span>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(video.created_at), {
                addSuffix: true,
                locale: es
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}