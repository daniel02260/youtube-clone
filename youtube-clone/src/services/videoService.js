import { supabase } from '../lib/supabase'

const videosBucket = 'videos'
const thumbsBucket = 'thumbnails'

const getPathFromUrl = (url) => {
	try {
		const u = new URL(url)
		// Supabase public URL format: /storage/v1/object/public/<bucket>/<path>
		const parts = u.pathname.split('/')
		const idx = parts.indexOf('public')
		if (idx >= 0 && parts.length > idx + 2) {
			// join remaining parts after 'public' and bucket
			return parts.slice(idx + 2).join('/')
		}
		// fallback: return last two segments
		return parts.slice(-2).join('/')
	} catch (e) {
		return null
	}
}

export const videoService = {
	async getAllVideos() {
		try {
			const { data, error } = await supabase
				.from('videos')
				.select('*, perfiles(*)')
				.order('created_at', { ascending: false })
			if (error) throw error
			if (data && data.length > 0) {
				// Combinar videos de Supabase con videos de la API
				const apiVideos = await this.getApiVideos()
				return [...data, ...apiVideos]
			}
		} catch (e) {
			// ignore and fallback to mock
			console.warn('Supabase getAllVideos failed, falling back to mock', e)
		}

		// Fallback to local mock JSON
		try {
			const res = await fetch('/mock-videos.json')
			if (!res.ok) throw new Error('Mock videos not found')
			const json = await res.json()
			// Combinar con videos de API
			const apiVideos = await this.getApiVideos()
			return [...json, ...apiVideos]
		} catch (e) {
			console.error('Failed to load mock videos', e)
			return []
		}
	},

	async getApiVideos() {
		try {
			// Traer videos musicales de Pexels API (requiere key, pero usaremos mock data o alternativa)
			// Por ahora usaremos una lista de videos musicales públicos
			const musicVideos = [
				{
					id: 'api_1',
					titulo: 'Lo-Fi Beats for Studying',
					descripcion: 'Relaxing lo-fi hip hop beats perfect for studying and working',
					url_video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
					url_miniatura: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=280&fit=crop',
					duracion: 3600,
					usuario_id: 'api_user_1',
					vistas: 15000,
					likes: 520,
					created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
					perfiles: { nombre: 'Music Channel' }
				},
				{
					id: 'api_2',
					titulo: 'Deep House Sessions 2024',
					descripcion: 'Premium deep house and tech house music mix',
					url_video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
					url_miniatura: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=280&fit=crop',
					duracion: 2880,
					usuario_id: 'api_user_2',
					vistas: 28500,
					likes: 1250,
					created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
					perfiles: { nombre: 'DJ Studio' }
				},
				{
					id: 'api_3',
					titulo: 'Ambient Music for Relaxation',
					descripcion: 'Calming ambient sounds for meditation and relaxation',
					url_video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
					url_miniatura: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=280&fit=crop',
					duracion: 2400,
					usuario_id: 'api_user_3',
					vistas: 32100,
					likes: 1840,
					created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
					perfiles: { nombre: 'Zen Sounds' }
				},
				{
					id: 'api_4',
					titulo: 'Electronic Music Compilation',
					descripcion: 'Best electronic and synth pop tracks',
					url_video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
					url_miniatura: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=280&fit=crop',
					duracion: 3240,
					usuario_id: 'api_user_4',
					vistas: 18900,
					likes: 670,
					created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
					perfiles: { nombre: 'Synthwave Vibes' }
				},
				{
					id: 'api_5',
					titulo: 'Jazz Classics Collection',
					descripcion: 'Smooth jazz music for all occasions',
					url_video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
					url_miniatura: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=280&fit=crop',
					duracion: 3900,
					usuario_id: 'api_user_5',
					vistas: 45200,
					likes: 2310,
					created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
					perfiles: { nombre: 'Jazz Lounge' }
				},
				{
					id: 'api_6',
					titulo: 'Indie Pop Hits 2024',
					descripcion: 'Latest indie pop tracks and covers',
					url_video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
					url_miniatura: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=280&fit=crop',
					duracion: 2700,
					usuario_id: 'api_user_6',
					vistas: 22400,
					likes: 950,
					created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
					perfiles: { nombre: 'Indie Vibes' }
				},
				{
					id: 'api_7',
					titulo: 'Trap Beats Production',
					descripcion: 'Original trap and hip hop beat production',
					url_video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
					url_miniatura: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=280&fit=crop',
					duracion: 3000,
					usuario_id: 'api_user_7',
					vistas: 38700,
					likes: 1620,
					created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
					perfiles: { nombre: 'Beat Maker Studio' }
				},
				{
					id: 'api_8',
					titulo: 'Classical Orchestra Music',
					descripcion: 'Beautiful classical orchestral compositions',
					url_video: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
					url_miniatura: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=280&fit=crop',
					duracion: 4200,
					usuario_id: 'api_user_8',
					vistas: 51800,
					likes: 2850,
					created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
					perfiles: { nombre: 'Classical Music Society' }
				}
			]
			return musicVideos
		} catch (e) {
			console.error('Failed to fetch API videos:', e)
			return []
		}
	},

	async getUserVideos(userId) {
		const { data, error } = await supabase
			.from('videos')
			.select('*, perfiles(*)')
			.eq('usuario_id', userId)
			.order('created_at', { ascending: false })
		if (error) throw error
		return data
	},

	async uploadVideo(file, userId) {
		if (!file) throw new Error('No file provided')
		const path = `${userId}/${Date.now()}_${file.name}`
		const { data, error } = await supabase.storage
			.from(videosBucket)
			.upload(path, file)

		if (error) throw error

		const { data: urlData } = supabase.storage.from(videosBucket).getPublicUrl(path)
		return { url: urlData.publicUrl }
	},

	async uploadThumbnail(file, userId) {
		if (!file) throw new Error('No file provided')
		const path = `${userId}/${Date.now()}_${file.name}`
		const { data, error } = await supabase.storage
			.from(thumbsBucket)
			.upload(path, file)

		if (error) throw error

		const { data: urlData } = supabase.storage.from(thumbsBucket).getPublicUrl(path)
		return { url: urlData.publicUrl }
	},

	async createVideo(payload) {
		const { data, error } = await supabase
			.from('videos')
			.insert(payload)
			.select()
		if (error) throw error
		return data
	},

	async updateVideo(id, updates) {
		const { data, error } = await supabase
			.from('videos')
			.update(updates)
			.eq('id', id)
			.select()
			.single()
		if (error) throw error
		return data
	},

	async deleteVideo(id, videoUrl, thumbUrl) {
		// attempt to remove storage files if URLs provided
		try {
			if (videoUrl) {
				const path = getPathFromUrl(videoUrl)
				if (path) await supabase.storage.from(videosBucket).remove([path])
			}
			if (thumbUrl) {
				const path = getPathFromUrl(thumbUrl)
				if (path) await supabase.storage.from(thumbsBucket).remove([path])
			}
		} catch (e) {
			// ignore storage removal errors
			console.warn('Storage removal error', e)
		}

		const { data, error } = await supabase
			.from('videos')
			.delete()
			.eq('id', id)
			.select()
		if (error) throw error
		return data
	},

	async incrementViews(id) {
		try {
			const { data: current, error: err1 } = await supabase
				.from('videos')
				.select('vistas')
				.eq('id', id)
				.single()
			if (err1) throw err1

			const currentViews = current?.vistas ?? 0
			const { data, error } = await supabase
				.from('videos')
				.update({ vistas: currentViews + 1 })
				.eq('id', id)
				.select()
			if (error) throw error
			return data
		} catch (e) {
			throw e
		}
	}
}
