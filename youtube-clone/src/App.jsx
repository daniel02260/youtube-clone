import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useState } from 'react'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import Layout from './components/layout/Layout'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/" />
}

function AppRoutes({ searchQuery, onSearchChange }) {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      <Route path="/" element={
        <Home searchQuery={searchQuery} onSearchChange={onSearchChange} />
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminPanel />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout onSearch={setSearchQuery}>
          <AppRoutes searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App