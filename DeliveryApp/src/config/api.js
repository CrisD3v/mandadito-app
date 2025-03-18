import axios from "axios"
import * as SecureStore from "expo-secure-store"

const api = axios.create({
  baseURL: "http://192.168.1.9:3004", // Tu URL base
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // Timeout de 10 segundos
})

// Interceptor para añadir el token a todas las solicitudes
api.interceptors.request.use(
  async (config) => {
    try {
      // Obtener el token de SecureStore
      const token = await SecureStore.getItemAsync("auth_access_token")

      // Si hay token, añadirlo a las cabeceras
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    } catch (error) {
      console.error("Error al añadir token a la solicitud:", error)
      return config
    }
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el error es 401 (No autorizado)
    if (error.response && error.response.status === 401) {
      // Como no hay endpoint de refresh, simplemente notificamos que se requiere nuevo inicio de sesión
      console.log("Token inválido o expirado. Se requiere nuevo inicio de sesión.")

      // Aquí podrías implementar un evento global o callback para redirigir al usuario a la pantalla de login
      // Por ejemplo, usando un EventEmitter o un contexto de React

      // Ejemplo simple: Guardar en localStorage que se requiere inicio de sesión
      try {
        await SecureStore.setItemAsync("auth_session_expired", "true")
      } catch (storageError) {
        console.error("Error al guardar estado de sesión:", storageError)
      }
    }

    // Registrar detalles del error
    if (error.response) {
      console.log("Error data:", JSON.stringify(error.response.data, null, 2))
      console.log("Error status:", error.response.status)
    } else if (error.request) {
      console.log("Error request:", error.request._response || error.request)
    } else {
      console.log("Error message:", error.message)
    }

    return Promise.reject(error)
  },
)

export default api

