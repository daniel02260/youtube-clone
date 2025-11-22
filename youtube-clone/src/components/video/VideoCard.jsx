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
      <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3">
        {video.url_miniatura ? (
          <img
            src={video.url_miniatura}
            alt={video.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span className="text-gray-500">Sin miniatura</span>
          </div>
        )}
        
        {video.duracion && (
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
            {formatDuration(video.duracion)}
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
            {video.perfiles?.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
            {video.titulo}
          </h3>
          
          <p className="text-xs text-gray-600 mb-1">
            {video.perfiles?.nombre || 'Canal desconocido'}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
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