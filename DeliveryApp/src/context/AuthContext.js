"use client"

// Opcional: Crear un contexto de autenticación para acceder fácilmente
// a las funciones de autenticación desde cualquier componente

import { createContext, useState, useContext, useEffect } from "react"
import authService from "../services/authService"

// Crear el contexto
const AuthContext = createContext(null)

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext)

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const authenticated = await authService.isAuthenticated()
        setIsAuthenticated(authenticated)

        if (authenticated) {
          const userData = await authService.getUserData()
          setUser(userData)
        }
      } catch (error) {
        console.error("Error al cargar datos de usuario:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Función de login
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)

      if (response.success) {
        setUser(response.user)
        setIsAuthenticated(true)
        return { success: true }
      }

      return { success: false, error: response.error }
    } catch (error) {
      console.error("Error en login:", error)
      return { success: false, error: error.message }
    }
  }

  // Función de logout
  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      setIsAuthenticated(false)
      return { success: true }
    } catch (error) {
      console.error("Error en logout:", error)
      return { success: false, error: error.message }
    }
  }

  // Obtener datos del token
  const getTokenData = async () => {
    try {
      const token = await authService.getAccessToken()
      if (!token) return null

      return authService.decodeToken(token)
    } catch (error) {
      console.error("Error al obtener datos del token:", error)
      return null
    }
  }

  // Valor del contexto
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    getTokenData,
    refreshToken: authService.refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

