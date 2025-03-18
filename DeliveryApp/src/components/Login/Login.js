"use client"

import { useState, useRef } from "react"
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { AntDesign } from "@expo/vector-icons"
import Register from "../Register/Register"
import api from "../../config/api"
import authService from "../../services/authService"

const { width, height } = Dimensions.get("window")

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const scrollViewRef = useRef(null)

  const handleLogin = async () => {
    try {
      setLoading(true)
      setErrors([]) // Limpiar errores anteriores

      // Validación básica...
      if (!email.trim()) {
        setErrors([{ msg: "El correo electrónico es obligatorio", path: "email" }])
        return
      }

      if (!password.trim()) {
        setErrors([{ msg: "La contraseña es obligatoria", path: "password" }])
        return
      }

      // Llamada al API
      const response = await api.post("/auth/login", {
        email,
        password,
      })

      console.log("Login exitoso - Respuesta completa:", JSON.stringify(response.data, null, 2))

      // Guardar tokens y datos de usuario
      if (response.data.token) {
        // Si el backend devuelve un solo token
        console.log("Token recibido:", response.data.token.substring(0, 20) + "...")
        console.log("Datos de usuario recibidos:", JSON.stringify(response.data.user, null, 2))
        await authService.setTokens(response.data.token, null, response.data.user)
      } else if (response.data.accessToken) {
        // Si el backend devuelve accessToken y refreshToken separados
        console.log("AccessToken recibido:", response.data.accessToken.substring(0, 20) + "...")
        console.log("Datos de usuario recibidos:", JSON.stringify(response.data.user, null, 2))
        await authService.setTokens(response.data.accessToken, response.data.refreshToken, response.data.user)
      }

      // Navegar a la pantalla principal usando la prop
      if (onLoginSuccess) {
        onLoginSuccess()
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error)

      if (error.response) {
        const { data, status } = error.response
        console.log("Error data completo:", JSON.stringify(data))

        if (data && data.errors && Array.isArray(data.errors)) {
          setErrors(data.errors)
        } else if (data && data.message) {
          // Si hay un mensaje de error pero no está en el formato de array de errores
          setErrors([{ msg: data.message }])
        } else {
          // Si no hay un formato de error reconocible
          setErrors([{ msg: `Error ${status}: Credenciales incorrectas o servidor no disponible` }])
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        setErrors([{ msg: "No se recibió respuesta del servidor. Verifica tu conexión." }])
      } else {
        // Error al configurar la solicitud
        setErrors([{ msg: `Error: ${error.message}` }])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    console.log("Login con Google")
    // Implementar autenticación con Google aquí
  }

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const newIndex = Math.round(contentOffsetX / width)
    setActiveIndex(newIndex)
  }

  const scrollTo = (index) => {
    scrollViewRef.current.scrollTo({ x: index * width, animated: true })
    setActiveIndex(index)
  }

  // Función para resaltar campos con error
  const getInputStyle = (fieldName) => {
    const hasError = errors.some((err) => err.path === fieldName)
    return [styles.input, hasError ? styles.inputError : null]
  }

  // Función para obtener mensaje de error específico para un campo
  const getFieldError = (fieldName) => {
    const fieldError = errors.find((err) => err.path === fieldName)
    return fieldError ? fieldError.msg : null
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => scrollTo(0)}>
            <Text style={[styles.navText, activeIndex === 0 && styles.activeNavText]}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => scrollTo(1)}>
            <Text style={[styles.navText, activeIndex === 1 && styles.activeNavText]}>Registrarse</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={width}
          snapToAlignment="center"
        >
          <ScrollView contentContainerStyle={[styles.contentContainer, { width }]} showsVerticalScrollIndicator={false}>
            {errors.length > 0 && (
              <View style={styles.errorContainer}>
                {errors.map((err, index) => (
                  <Text key={index} style={styles.errorText}>
                    • {err.msg}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.imageContainer}>
              <Image source={require("../../../assets/delivery-man.png")} style={styles.image} />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Bienvenido a{"\n"}mandados</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>correo electrónico</Text>
                <TextInput
                  style={getInputStyle("email")}
                  placeholder="tu correo"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {getFieldError("email") && <Text style={styles.fieldErrorText}>{getFieldError("email")}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>contraseña</Text>
                <TextInput
                  style={getInputStyle("password")}
                  placeholder="tu contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                {getFieldError("password") && <Text style={styles.fieldErrorText}>{getFieldError("password")}</Text>}
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? "Procesando..." : "Iniciar sesión"}</Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>O</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} disabled={loading}>
                <AntDesign name="google" size={24} color="white" style={styles.googleIcon} />
                <Text style={styles.buttonText}>Iniciar sesión con Google</Text>
              </TouchableOpacity>

              <View style={styles.footer}>
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>¿Olvidaste la contraseña?</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.privacy}>Privacidad</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={{ width }}>
            <Register />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "#fff",
  },
  navText: {
    fontSize: 16,
    color: "#666",
  },
  activeNavText: {
    color: "#4B48C9",
    fontWeight: "bold",
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 100, // Ajustado para dar espacio a la barra de navegación
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    lineHeight: 38,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  errorContainer: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginBottom: 4,
  },
  fieldErrorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    width: "100%",
    height: 44,
    backgroundColor: "#4B48C9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#9998E3",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
  },
  googleButton: {
    width: "100%",
    height: 44,
    backgroundColor: "#DB4437",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  googleIcon: {
    marginRight: 10,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  forgotPassword: {
    color: "#4B48C9",
    fontSize: 14,
    marginBottom: 10,
  },
  privacy: {
    color: "#4B48C9",
    fontSize: 14,
  },
})

export default Login

