"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, Alert } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import api from "../../config/api"

const { width } = Dimensions.get("window")

const Register = () => {
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [identification, setIdentification] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    try {
      setLoading(true)
      setErrors([]) // Limpia errores anteriores

      const response = await api.post("/auth/register", {
        name,
        last_name: lastName,
        identification: Number(identification),
        email,
        phone,
        password,
        role_id: 1,
      })

      console.log("Registro exitoso:", response.data)
      Alert.alert("Éxito", "Te has registrado correctamente")

      // Limpiar formulario después de registro exitoso
      setName("")
      setLastName("")
      setIdentification("")
      setEmail("")
      setPhone("")
      setPassword("")
    } catch (error) {
      console.error("Error en el registro:", error)

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
          setErrors([{ msg: `Error ${status}: No se pudo completar el registro` }])
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

  const handleGoogleRegister = () => {
    // Implementar registro con Google aquí
    console.log("Registro con Google")
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
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {errors.length > 0 && (
        <View style={styles.errorContainer}>
          {errors.map((err, index) => (
            <Text key={index} style={styles.errorText}>
              • {err.msg}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.formContainer}>
        <Text style={styles.title}>Crear cuenta</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={getInputStyle("name")} placeholder="Tu nombre" value={name} onChangeText={setName} />
          {getFieldError("name") && <Text style={styles.fieldErrorText}>{getFieldError("name")}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Apellidos</Text>
          <TextInput
            style={getInputStyle("last_name")}
            placeholder="Tus apellidos"
            value={lastName}
            onChangeText={setLastName}
          />
          {getFieldError("last_name") && <Text style={styles.fieldErrorText}>{getFieldError("last_name")}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número de documento de identidad</Text>
          <TextInput
            style={getInputStyle("identification")}
            placeholder="Tu número de documento"
            value={identification}
            onChangeText={setIdentification}
            keyboardType="numeric"
          />
          {getFieldError("identification") && (
            <Text style={styles.fieldErrorText}>{getFieldError("identification")}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={getInputStyle("email")}
            placeholder="Tu correo"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {getFieldError("email") && <Text style={styles.fieldErrorText}>{getFieldError("email")}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teléfono</Text>
          <TextInput
            style={getInputStyle("phone")}
            placeholder="Tu número de teléfono"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          {getFieldError("phone") && <Text style={styles.fieldErrorText}>{getFieldError("phone")}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={getInputStyle("password")}
            placeholder="Tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {getFieldError("password") && <Text style={styles.fieldErrorText}>{getFieldError("password")}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Procesando..." : "Registrarse"}</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleRegister} disabled={loading}>
          <AntDesign name="google" size={24} color="white" style={styles.googleIcon} />
          <Text style={styles.buttonText}>Registrarse con Google</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={styles.privacy}>Privacidad</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: width,
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 100, // Ajustado para dar espacio a la barra de navegación
    backgroundColor: "#fff",
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
  privacy: {
    color: "#4B48C9",
    fontSize: 14,
  },
})

export default Register

