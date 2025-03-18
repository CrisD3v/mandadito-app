"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, ActivityIndicator } from "react-native"
import { StatusBar } from "expo-status-bar"
import Login from "./src/components/Login/Login"
import HomeScreen from "./src/screens/HomeScreen"
import authService from "./src/services/authService"
import * as SecureStore from "expo-secure-store"

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Verificar si el usuario ya está autenticado al iniciar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si la sesión ha expirado (marcado por el interceptor de API)
        const sessionExpired = await SecureStore.getItemAsync("auth_session_expired")

        if (sessionExpired === "true") {
          // Limpiar el estado de sesión expirada
          await SecureStore.deleteItemAsync("auth_session_expired")
          // Cerrar sesión para limpiar tokens
          await authService.logout()
          setIsLoggedIn(false)
        } else {
          // Verificar autenticación normalmente
          const authenticated = await authService.isAuthenticated()
          setIsLoggedIn(authenticated)
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Mostrar indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B48C9" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {isLoggedIn ? (
        <HomeScreen
          onLogout={async () => {
            await authService.logout()
            setIsLoggedIn(false)
          }}
        />
      ) : (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
})

