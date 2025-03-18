"use client"

import { useEffect, useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from "react-native"
import { AntDesign, Feather } from "@expo/vector-icons"
import authService from "../services/authService"
import Sidebar from "../components/Sidebar/Sidebar"
import MapScreen from "./MapScreen"

const { width } = Dimensions.get("window")

const HomeScreen = ({ onLogout }) => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentScreen, setCurrentScreen] = useState("home") // 'home' o 'map'

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)

        // Obtener datos del usuario desde el servidor y del token
        const data = await authService.fetchUserProfile()
        console.log("Datos de usuario cargados en HomeScreen:", JSON.stringify(data, null, 2))
        setUserData(data)
      } catch (error) {
        console.error("Error al cargar datos de usuario:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleSendPackage = () => {
    // Implementar lógica para enviar paquete
    console.log("Enviar paquete")
  }

  const handleBecomeCourier = () => {
    // Implementar lógica para ser mensajero
    console.log("Ser mensajero")
  }

  const handleLogout = () => {
    onLogout()
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const navigateToMap = () => {
    setCurrentScreen("map")
  }

  const navigateToHome = () => {
    setCurrentScreen("home")
  }

  // Función para obtener el nombre de usuario o email para mostrar
  const getUserDisplayName = () => {
    if (!userData) return "Usuario"

    // Buscar el nombre en diferentes posibles ubicaciones en el objeto userData
    if (userData.name) return userData.name
    if (userData.user?.name) return userData.user.name
    if (userData.username) return userData.username
    if (userData.user?.username) return userData.user.username
    if (userData.firstName) return userData.firstName
    if (userData.first_name) return userData.first_name
    if (userData.nombre) return userData.nombre

    // Si no hay nombre pero hay email, mostrar la parte antes del @
    if (userData.email) {
      const emailParts = userData.email.split("@")
      return emailParts[0] // Muestra solo la parte antes del @
    }

    // Si no hay nada, mostrar "Usuario"
    return "Usuario"
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B48C9" />
      </View>
    )
  }

  // Renderizar la pantalla de mapa si currentScreen es 'map'
  if (currentScreen === "map") {
    return <MapScreen onBack={navigateToHome} />
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <View style={styles.userInfo}>
        <Text style={styles.welcomeText}>Hola, {getUserDisplayName()}</Text>
        {userData && userData.email && <Text style={styles.emailText}>{userData.email}</Text>}
      </View>

      <View style={styles.content}>
        {/* Tarjeta Enviar Paquete */}
        <TouchableOpacity style={styles.card} onPress={handleSendPackage}>
          <View style={styles.imageContainer}>
            <View style={styles.placeholderImage}>
              <AntDesign name="picture" size={32} color="#999" />
            </View>
          </View>
          <Text style={styles.cardTitle}>Enviar Paquete</Text>
          <Text style={styles.cardSubtitle}>m/m km mensajeros y viajes disponibles</Text>
        </TouchableOpacity>

        {/* Tarjeta Ser Mensajero */}
        <TouchableOpacity style={styles.card} onPress={handleBecomeCourier}>
          <View style={styles.imageContainer}>
            <View style={styles.placeholderImage}>
              <AntDesign name="picture" size={32} color="#999" />
            </View>
          </View>
          <Text style={styles.cardTitle}>Se mensajero</Text>
          <Text style={styles.cardSubtitle}>m/m paquetes disponibles para envío</Text>
        </TouchableOpacity>
      </View>

      {/* Barra de navegación inferior */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={toggleSidebar}>
          <Feather name="menu" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={navigateToMap}>
          <Feather name="map-pin" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <AntDesign name="wallet" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
          <Feather name="log-out" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50, // Para compensar la barra de estado
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  userInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  emailText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    gap: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  navItem: {
    padding: 8,
  },
})

export default HomeScreen

