"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator, SafeAreaView } from "react-native"
import { Feather } from "@expo/vector-icons"
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps"
import * as Location from "expo-location"

const { width, height } = Dimensions.get("window")

const MapScreen = ({ onBack }) => {
  const [location, setLocation] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        // Solicitar permisos de ubicación
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          setErrorMsg("Se requiere permiso para acceder a la ubicación")
          setLoading(false)
          return
        }

        // Obtener la ubicación actual
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })
        setLocation(currentLocation)
      } catch (error) {
        console.error("Error al obtener la ubicación:", error)
        setErrorMsg("No se pudo obtener la ubicación")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Ubicación por defecto (Ciudad de México)
  const defaultLocation = {
    latitude: 19.4326,
    longitude: -99.1332,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  // Ubicación actual si está disponible
  const currentRegion = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    : defaultLocation

  // Simular una ruta de entrega (para demostración)
  const demoRoute = [
    // Punto de inicio (origen)
    {
      latitude: currentRegion.latitude,
      longitude: currentRegion.longitude,
    },
    // Puntos intermedios (simulados)
    {
      latitude: currentRegion.latitude + 0.005,
      longitude: currentRegion.longitude + 0.01,
    },
    {
      latitude: currentRegion.latitude - 0.003,
      longitude: currentRegion.longitude + 0.02,
    },
    {
      latitude: currentRegion.latitude - 0.008,
      longitude: currentRegion.longitude + 0.025,
    },
    // Punto final (destino)
    {
      latitude: currentRegion.latitude - 0.01,
      longitude: currentRegion.longitude + 0.03,
    },
  ]

  // Obtener el punto de destino (último punto de la ruta)
  const destinationPoint = demoRoute[demoRoute.length - 1]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seguimiento de Paquete</Text>
      </View>

      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4B48C9" />
            <Text style={styles.loadingText}>Cargando mapa...</Text>
          </View>
        ) : errorMsg ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={32} color="#FF3B30" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={currentRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* Marcador de origen (ubicación actual) */}
            <Marker
              coordinate={{
                latitude: currentRegion.latitude,
                longitude: currentRegion.longitude,
              }}
              title="Mi ubicación"
              description="Estás aquí"
              pinColor="#4B48C9"
            />

            {/* Marcador de destino */}
            <Marker coordinate={destinationPoint} title="Destino" description="Punto de entrega" pinColor="#FF3B30" />

            {/* Ruta de entrega (simulada) */}
            <Polyline coordinates={demoRoute} strokeWidth={4} strokeColor="#4B48C9" lineDashPattern={[1]} />
          </MapView>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Información del Envío</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <Text style={styles.infoValue}>En camino</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tiempo estimado:</Text>
            <Text style={styles.infoValue}>25 minutos</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Distancia:</Text>
            <Text style={styles.infoValue}>4.2 km</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mensajero:</Text>
            <Text style={styles.infoValue}>Carlos Rodríguez</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    color: "#333",
  },
  mapContainer: {
    height: height * 0.6,
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },
  infoContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  infoCard: {
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
})

export default MapScreen

