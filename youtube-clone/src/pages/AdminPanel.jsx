import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { videoService } from '../services/videoService'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Trash2, Shield, Users, Video } from 'lucide-react'

export default function AdminPanel() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('videos')

  useEffect(() => {
    if (!profile?.es_admin) {
      alert('No tienes permisos de administrador')
      navigate('/')
      return
    }
    loadData()
  }, [profile])

  const loadData = async () => {
    try {
      const [videosData, usersData] = await Promise.all([
        videoService.getAllVideos(),
        supabase.from('perfiles').select('*')
      ])
      
      setVideos(videosData)
      setUsers(usersData.data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteVideo = async (video) => {
    if (!confirm('¿Eliminar este video?')) return
    
    try {
      await videoService.deleteVideo(video.id, video.url_video, video.url_miniatura)
      loadData()
      alert('Video eliminado')
    } catch (error) {
      alert('Error al eliminar video')
    }
  }

  const handleToggleAdmin = async (userId, isAdmin) => {
    try {
      await supabase
        .from('perfiles')
        .update({ es_admin: !isAdmin })
        .eq('id', userId)
      
      loadData()
      alert('Permisos actualizados')
    } catch (error) {
      alert('Error al actualizar permisos')
    }
  }

  if (!profile?.es_admin) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setTab('videos')}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 ${
                  tab === 'videos'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Video className="w-5 h-5" />
                Videos ({videos.length})
              </button>
              <button
                onClick={() => setTab('users')}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 ${
                  tab === 'users'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-5 h-5" />
                Usuarios ({users.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : tab === 'videos' ? (
              <div className="space-y-4">
                {videos.map((video) => (
                  <div key={video.id} className="flex items-center gap-4 border rounded-lg p-4">
                    <img
                      src={video.url_miniatura || '/placeholder.jpg'}
                      alt={video.titulo}
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{video.titulo}</h3>
                      <p className="text-sm text-gray-600">
                        Por: {video.perfiles?.nombre} • {video.vistas} vistas
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteVideo(video)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between border rounded-lg p-4">
                    <div>
                      <h3 className="font-semibold">{user.nombre}</h3>
                      <p className="text-sm text-gray-600">
                        {user.es_admin ? 'Administrador' : 'Usuario'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleAdmin(user.id, user.es_admin)}
                      className={`px-4 py-2 rounded-md ${
                        user.es_admin
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {user.es_admin ? 'Quitar admin' : 'Hacer admin'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}