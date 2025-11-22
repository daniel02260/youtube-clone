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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Subir Video</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={uploading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                disabled={uploading}
                maxLength={200}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
                disabled={uploading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Video *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {formData.videoFile
                      ? formData.videoFile.name
                      : 'Haz clic para seleccionar un video'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    MP4, WebM, AVI (max. 500MB)
                  </p>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Miniatura (opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {formData.thumbnailFile
                      ? formData.thumbnailFile.name
                      : 'Haz clic para seleccionar una miniatura'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG (recomendado 1280x720)
                  </p>
                </label>
              </div>
            </div>

            {uploading && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Subiendo... {progress}%
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={uploading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={uploading || !formData.titulo || !formData.videoFile}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  'Subir Video'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}