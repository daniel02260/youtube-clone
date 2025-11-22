import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { videoService } from '../services/videoService'
import { ArrowLeft, Edit2, Trash2, Save, X } from 'lucide-react'

export default function Profile() {
  const { user, profile, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [nombre, setNombre] = useState(profile?.nombre || '')
  const [editingVideo, setEditingVideo] = useState(null)
  const [editForm, setEditForm] = useState({ titulo: '', descripcion: '' })

  useEffect(() => {
    loadUserVideos()
  }, [])

  const loadUserVideos = async () => {
    try {
      const data = await videoService.getUserVideos(user.id)
      setVideos(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ nombre })
      setEditing(false)
      alert('Perfil actualizado')
    } catch (error) {
      alert('Error al actualizar perfil')
    }
  }

  const handleEditVideo = (video) => {
    setEditingVideo(video.id)
    setEditForm({ titulo: video.titulo, descripcion: video.descripcion || '' })
  }

  const handleUpdateVideo = async (videoId) => {
    try {
      await videoService.updateVideo(videoId, editForm)
      setEditingVideo(null)
      loadUserVideos()
      alert('Video actualizado')
    } catch (error) {
      alert('Error al actualizar video')
    }
  }

  const handleDeleteVideo = async (video) => {
    if (!confirm('¿Eliminar este video?')) return
    
    try {
      await videoService.deleteVideo(video.id, video.url_video, video.url_miniatura)
      loadUserVideos()
      alert('Video eliminado')
    } catch (error) {
      alert('Error al eliminar video')
    }
  }

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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Mi Perfil</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setNombre(profile?.nombre || '')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              {editing ? (
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              ) : (
                <p className="text-gray-700">{profile?.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <p className="text-gray-700">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Mis Videos ({videos.length})</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : videos.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No has subido videos aún
            </p>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="border rounded-lg p-4">
                  {editingVideo === video.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.titulo}
                        onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Título"
                      />
                      <textarea
                        value={editForm.descripcion}
                        onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                        placeholder="Descripción"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateVideo(video.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingVideo(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <img
                        src={video.url_miniatura || '/placeholder.jpg'}
                        alt={video.titulo}
                        className="w-40 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{video.titulo}</h3>
                        <p className="text-sm text-gray-600 mb-2">{video.descripcion}</p>
                        <p className="text-xs text-gray-500">{video.vistas} vistas</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditVideo(video)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}