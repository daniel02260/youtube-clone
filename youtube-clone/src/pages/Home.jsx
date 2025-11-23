import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { videoService } from '../services/videoService'
import { Upload } from 'lucide-react'
import UploadVideo from '../components/video/UploadVideo'
import VideoCard from '../components/video/VideoCard'
import VideoPlayer from '../components/video/VideoPlayer'

export default function Home({ searchQuery = '', onSearchChange }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [allVideos, setAllVideos] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const categories = ['Todos', 'Música', 'Mixes', 'En directo', 'Videojuegos', 'Películas', 'Series de televisión']

  useEffect(() => {
    loadVideos()
  }, [])

  useEffect(() => {
    filterVideos()
  }, [selectedCategory, searchQuery, allVideos])

  const loadVideos = async () => {
    try {
      const data = await videoService.getAllVideos()
      setAllVideos(data || [])
    } catch (error) {
      console.error('Error al cargar videos:', error)
      setAllVideos([])
    } finally {
      setLoading(false)
    }
  }

  const filterVideos = () => {
    let filtered = allVideos

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      filtered = filtered.filter(video =>
        video.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtrar por categoría (por ahora todas van a "Todos" ya que no hay categorías en BD)
    // En el futuro se puede agregar un campo de categoría en la tabla de videos

    setVideos(filtered)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Categorías */}
      <div className="sticky top-0 bg-black border-b border-gray-900 z-30 backdrop-blur-sm bg-opacity-95">
        <div className="overflow-x-auto scroll-smooth max-w-full">
          <div className="flex gap-3 px-4 py-3 min-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  // Si se pulsa 'Todos' limpiamos la búsqueda para mostrar todos los videos
                  if (cat === 'Todos' && typeof onSearchChange === 'function') {
                    onSearchChange('')
                  }
                }}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all text-sm ${
                  selectedCategory === cat
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-900 text-gray-200 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-red-600"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-6">No hay videos disponibles</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all font-semibold shadow-lg"
            >
              Subir el primer video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={setSelectedVideo}
              />
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <UploadVideo
          onClose={() => setShowUploadModal(false)}
          onSuccess={loadVideos}
        />
      )}

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  )
}