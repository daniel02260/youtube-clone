import { useEffect } from 'react'
import { videoService } from '../../services/videoService'
import { X, ThumbsUp, Eye, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export default function VideoPlayer({ video, onClose }) {
  useEffect(() => {
    if (video?.id) {
      videoService.incrementViews(video.id)
    }
  }, [video?.id])

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 bg-black bg-opacity-90 backdrop-blur-sm z-10 p-4">
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-black rounded-lg overflow-hidden mb-4">
                <video
                  className="w-full aspect-video"
                  controls
                  autoPlay
                  src={video.url_video}
                >
                  Tu navegador no soporta el tag de video.
                </video>
              </div>

              <h1 className="text-white text-xl font-bold mb-3">
                {video.titulo}
              </h1>

              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatNumber(video.vistas || 0)} vistas
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDistanceToNow(new Date(video.created_at), {
                      addSuffix: true,
                      locale: es
                    })}
                  </span>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-full transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                  <span>{formatNumber(video.likes || 0)}</span>
                </button>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {video.perfiles?.nombre?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-white font-semibold">
                      {video.perfiles?.nombre || 'Canal desconocido'}
                    </p>
                  </div>
                </div>

                {video.descripcion && (
                  <div className="text-gray-300 text-sm whitespace-pre-wrap">
                    {video.descripcion}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <h2 className="text-white font-semibold mb-4">Videos relacionados</h2>
              <p className="text-gray-400 text-sm">
                Próximamente: Videos sugeridos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}