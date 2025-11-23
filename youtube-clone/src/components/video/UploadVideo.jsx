import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { videoService } from '../../services/videoService'
import { Upload, X, Loader2 } from 'lucide-react'

export default function UploadVideo({ onClose, onSuccess }) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    videoFile: null,
    thumbnailFile: null
  })

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('video/')) {
      setFormData({ ...formData, videoFile: file })
    } else {
      alert('Por favor selecciona un archivo de video válido')
    }
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, thumbnailFile: file })
    } else {
      alert('Por favor selecciona una imagen válida')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.videoFile) {
      alert('Por favor selecciona un video')
      return
    }

    setUploading(true)
    setProgress(10)

    try {
      setProgress(30)
      const videoUpload = await videoService.uploadVideo(
        formData.videoFile,
        user.id
      )

      setProgress(50)
      let thumbnailUpload = null
      if (formData.thumbnailFile) {
        thumbnailUpload = await videoService.uploadThumbnail(
          formData.thumbnailFile,
          user.id
        )
      }

      const video = document.createElement('video')
      video.preload = 'metadata'
      video.src = URL.createObjectURL(formData.videoFile)
      
      video.onloadedmetadata = async () => {
        const duracion = Math.round(video.duration)
        
        setProgress(70)
        await videoService.createVideo({
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          url_video: videoUpload.url,
          url_miniatura: thumbnailUpload?.url || null,
          duracion: duracion,
          usuario_id: user.id
        })

        setProgress(100)
        alert('¡Video subido exitosamente!')
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      console.error('Error al subir video:', error)
      alert('Error al subir el video: ' + error.message)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Subir Video</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            disabled={uploading}
          >
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Escribe un título cautivador..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white placeholder-gray-500 transition-all"
                required
                disabled={uploading}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.titulo.length}/200</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Describe el contenido de tu video..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 text-white placeholder-gray-500 resize-none transition-all"
                rows={4}
                disabled={uploading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Video *
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-600 transition-colors bg-gray-800/50">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                  id="video-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="mb-3 p-3 bg-gray-700 rounded-full">
                    <Upload className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-sm text-gray-300 font-medium">
                    {formData.videoFile
                      ? `✓ ${formData.videoFile.name}`
                      : 'Haz clic para seleccionar un video'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    MP4, WebM, AVI — Máximo 500MB
                  </p>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Miniatura (opcional)
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-gray-600 transition-colors bg-gray-800/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="mb-3 p-3 bg-gray-700 rounded-full">
                    <Upload className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-sm text-gray-300 font-medium">
                    {formData.thumbnailFile
                      ? `✓ ${formData.thumbnailFile.name}`
                      : 'Haz clic para seleccionar una miniatura'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG — Recomendado 1280x720
                  </p>
                </label>
              </div>
            </div>

            {uploading && (
              <div className="mb-6 bg-gray-800 p-4 rounded-lg">
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-300 mt-3 text-center font-medium">
                  Subiendo... {progress}%
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                disabled={uploading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-all"
                disabled={uploading || !formData.titulo || !formData.videoFile}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Subir Video
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}