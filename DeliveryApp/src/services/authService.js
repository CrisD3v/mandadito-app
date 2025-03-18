import * as SecureStore from "expo-secure-store"
import api from "../config/api"

// Claves para almacenar tokens
const ACCESS_TOKEN_KEY = "auth_access_token"
const REFRESH_TOKEN_KEY = "auth_refresh_token"
const USER_KEY = "auth_user"

// Función personalizada para decodificar JWT sin usar Buffer
const decodeJWT = (token) => {
  try {
    if (!token) return null

    // Imprimir el token completo para inspección
    console.log("Token completo a decodificar:", token)

    const parts = token.split(".")
    if (parts.length !== 3) return null

    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")

    // Decodificar base64 usando atob
    let jsonPayload
    try {
      // Primero intentamos con atob (funciona en la mayoría de entornos)
      jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
    } catch (e) {
      console.error("Error con atob:", e)
      // Si atob falla, usamos una solución alternativa
      const rawData = global.atob ? global.atob(base64) : base64
      jsonPayload = decodeURIComponent(
        Array.from(rawData)
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      )
    }

    const decoded = JSON.parse(jsonPayload)
    console.log("Token decodificado completo:", JSON.stringify(decoded, null, 2))
    return decoded
  } catch (error) {
    console.error("Error decodificando JWT:", error)
    return null
  }
}

// Servicio de autenticación
const authService = {
  // Guardar tokens y datos de usuario
  setTokens: async (accessToken, refreshToken, userData = null) => {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken)

      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken)
      }

      // Decodificar el token para obtener los datos del usuario
      const decodedToken = decodeJWT(accessToken)
      console.log("Token decodificado en setTokens:", JSON.stringify(decodedToken, null, 2))

      // Si se proporcionan datos de usuario explícitamente, usarlos
      if (userData) {
        console.log("Guardando datos de usuario proporcionados:", JSON.stringify(userData, null, 2))
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData))
      }
      // Si no hay datos de usuario pero el token decodificado tiene datos, usarlos
      else if (decodedToken) {
        console.log("Guardando datos de usuario del token decodificado")
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(decodedToken))
      }
      // Si no hay datos de usuario ni en el token, guardar un objeto vacío
      else {
        console.log("No se encontraron datos de usuario, guardando objeto vacío")
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify({}))
      }

      // Configurar el token para todas las solicitudes futuras
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`

      return true
    } catch (error) {
      console.error("Error al guardar tokens:", error)
      return false
    }
  },

  // Obtener el token de acceso
  getAccessToken: async () => {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
    } catch (error) {
      console.error("Error al obtener access token:", error)
      return null
    }
  },

  // Obtener el token de refresco
  getRefreshToken: async () => {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
    } catch (error) {
      console.error("Error al obtener refresh token:", error)
      return null
    }
  },

  // Obtener datos del usuario desde el almacenamiento local
  getUserData: async () => {
    try {
      const userData = await SecureStore.getItemAsync(USER_KEY)
      console.log("Datos de usuario recuperados de SecureStore:", userData)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Error al obtener datos de usuario:", error)
      return null
    }
  },

  // Obtener datos del usuario desde el servidor y del token
  fetchUserProfile: async (id) => {
    try {
      // Primero intentamos obtener los datos del endpoint /auth/me
      const response = await api.get("/auth/me")
      console.log("Datos de usuario obtenidos del servidor:", JSON.stringify(response.data, null, 2))

      // Obtener el token actual
      const token = await authService.getAccessToken()

      // Decodificar el token para obtener datos adicionales
      const decodedToken = token ? decodeJWT(token) : null
      console.log("Datos decodificados del token en fetchUserProfile:", JSON.stringify(decodedToken, null, 2))

      // Combinar los datos del servidor con los datos del token
      const combinedData = {
        ...decodedToken,
        ...response.data,
      }

      console.log("Datos combinados:", JSON.stringify(combinedData, null, 2))

      // Guardar los datos actualizados en SecureStore
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(combinedData))

      return combinedData
    } catch (error) {
      console.error("Error al obtener perfil de usuario:", error)

      // Si hay un error, intentamos obtener datos del token
      try {
        const token = await authService.getAccessToken()
        if (token) {
          const decodedToken = decodeJWT(token)
          if (decodedToken) {
            console.log("Usando datos del token como respaldo:", JSON.stringify(decodedToken, null, 2))
            return decodedToken
          }
        }
      } catch (tokenError) {
        console.error("Error al decodificar token como respaldo:", tokenError)
      }

      // Si todo falla, intentamos devolver los datos almacenados localmente
      return authService.getUserData()
    }
  },

  // Decodificar token JWT
  decodeToken: (token) => {
    try {
      if (!token) return null
      return decodeJWT(token)
    } catch (error) {
      console.error("Error al decodificar token:", error)
      return null
    }
  },

  // Verificar si el token ha expirado
  isTokenExpired: (token) => {
    try {
      if (!token) return true

      const decoded = decodeJWT(token)
      if (!decoded) return true

      // Si el token no tiene fecha de expiración, asumimos que no expira
      if (!decoded.exp) return false

      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch (error) {
      console.error("Error al verificar expiración del token:", error)
      return true // Si hay error, asumir que el token ha expirado
    }
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
      await SecureStore.deleteItemAsync(USER_KEY)

      // Eliminar el token de las cabeceras de API
      delete api.defaults.headers.common["Authorization"]

      return true
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      return false
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: async () => {
    try {
      const token = await authService.getAccessToken()

      if (!token) {
        return false
      }

      // Verificar si el token ha expirado
      if (authService.isTokenExpired(token)) {
        // Como no hay endpoint de refresh, si el token expiró, el usuario debe iniciar sesión nuevamente
        console.log("Token expirado, se requiere nuevo inicio de sesión")
        return false
      }

      return true
    } catch (error) {
      console.error("Error al verificar autenticación:", error)
      return false
    }
  },

  // Esta función ya no intenta refrescar el token, simplemente devuelve false
  // indicando que el usuario debe iniciar sesión nuevamente
  refreshToken: async () => {
    console.log("No hay endpoint de refresh token disponible. Se requiere nuevo inicio de sesión.")
    return false
  },
}

export default authService

