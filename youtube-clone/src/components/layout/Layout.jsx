import Header from './Header'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import { useState } from 'react'
import UploadVideo from '../video/UploadVideo'

export default function Layout({ children, onSearch }) {
  const [showUploadModal, setShowUploadModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 pb-16 lg:pb-0 flex flex-col">
      <Header onUploadClick={() => setShowUploadModal(true)} onSearch={onSearch} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-900 overflow-y-auto">{children}</main>
      </div>
      <MobileNav onUploadClick={() => setShowUploadModal(true)} />
      
      {showUploadModal && (
        <UploadVideo
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false)
            // Reload videos if needed - parent component handles this
          }}
        />
      )}
    </div>
  )
}
