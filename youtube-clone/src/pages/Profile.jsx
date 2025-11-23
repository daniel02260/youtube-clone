import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { videoService } from '../services/videoService'
import { ArrowLeft, Edit2, Trash2, Save, X, Eye, EyeOff, LogOut } from 'lucide-react'

export default function Profile() {
  const { user, profile, updateProfile, updateEmail, updatePassword, signOut } = useAuth()
  const navigate = useNavigate()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingPassword, setEditingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [nombre, setNombre] = useState(profile?.nombre || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [editingVideo, setEditingVideo] = useState(null)
  const [editForm, setEditForm] = useState({ titulo: '', descripcion: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadUserVideos()
  }, [user])

  const loadUserVideos = async () => {
    try {
      if (user?.id) {
        const data = await videoService.getUserVideos(user.id)
        setVideos(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setError('')
      setMessage('')
      
      if (nombre !== profile?.nombre) {
        await updateProfile({ nombre })
      }

      if (email !== user?.email) {
        const { error: emailError } = await updateEmail(email)
        if (emailError) throw emailError
      }

      setMessage('Perfil actualizado correctamente')
      setEditingProfile(false)
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleUpdatePassword = async () => {
    try {
      setError('')
      setMessage('')

      if (newPassword !== confirmPassword) {
        setError('Las contraseñas no coinciden')
        return
      }

      if (newPassword.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres')
        return
      }

      const { error: pwError } = await updatePassword(newPassword)
      if (pwError) throw pwError

      setMessage('Contraseña actualizada correctamente')
      setEditingPassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.message || 'Error al actualizar contraseña')
      setTimeout(() => setError(''), 3000)
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
      setMessage('Video actualizado')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setError('Error al actualizar video')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleDeleteVideo = async (video) => {
    if (!confirm('¿Eliminar este video?')) return
    
    try {
      await videoService.deleteVideo(video.id, video.url_video, video.url_miniatura)
      loadUserVideos()
      setMessage('Video eliminado')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setError('Error al eliminar video')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mensajes */}
        {message && (
          <div className="mb-4 p-4 bg-green-600 text-white rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-600 text-white rounded-lg">
            {error}
          </div>
        )}

        {/* Perfil */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Mi Perfil</h2>
            {!editingProfile ? (
              <button
                onClick={() => setEditingProfile(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setEditingProfile(false)
                    setNombre(profile?.nombre || '')
                    setEmail(user?.email || '')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de Usuario</label>
              {editingProfile ? (
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                />
              ) : (
                <p className="text-gray-200">{profile?.nombre || 'Sin nombre'}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              {editingProfile ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white"
                />
              ) : (
                <p className="text-gray-200">{user?.email}</p>
              )}
            </div>

            {/* Cambiar Contraseña */}
            {!editingProfile && (
              <div className="pt-4 border-t border-gray-700">
                {!editingPassword ? (
                  <button
                    onClick={() => setEditingPassword(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Cambiar Contraseña
                  </button>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-200">Cambiar Contraseña</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña Actual</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Tu contraseña actual"
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white placeholder-gray-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nueva Contraseña</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nueva contraseña (min 6 caracteres)"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Contraseña</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma tu nueva contraseña"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white placeholder-gray-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdatePassword}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Actualizar Contraseña
                      </button>
                      <button
                        onClick={() => {
                          setEditingPassword(false)
                          setCurrentPassword('')
                          setNewPassword('')
                          setConfirmPassword('')
                        }}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="pt-6 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Mis Videos */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6">Mis Videos ({videos.length})</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-red-600"></div>
            </div>
          ) : videos.length === 0 ? (
            <p className="text-center text-gray-400 py-12">
              No has subido videos aún
            </p>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                  {editingVideo === video.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.titulo}
                        onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        placeholder="Título"
                      />
                      <textarea
                        value={editForm.descripcion}
                        onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        rows={3}
                        placeholder="Descripción"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateVideo(video.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingVideo(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
                        className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1 truncate">{video.titulo}</h3>
                        <p className="text-sm text-gray-400 mb-2 line-clamp-2">{video.descripcion}</p>
                        <p className="text-xs text-gray-500">{video.vistas} vistas</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleEditVideo(video)}
                          className="p-2 text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video)}
                          className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Eliminar"
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
