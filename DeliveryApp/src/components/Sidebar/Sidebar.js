"use client"

import React from "react"
import { StyleSheet, View, Text, Animated, TouchableOpacity, Dimensions, SafeAreaView } from "react-native"
import { Feather } from "@expo/vector-icons"

const { width } = Dimensions.get("window")
const SIDEBAR_WIDTH = width * 0.7 // 70% del ancho de la pantalla

const Sidebar = ({ isOpen, onClose }) => {
  // Valor de animación para la posición del sidebar
  const [animation] = React.useState(new Animated.Value(-SIDEBAR_WIDTH))

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 0 : -SIDEBAR_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [isOpen])

  return (
    <>
      {/* Overlay oscuro cuando el sidebar está abierto */}
      {isOpen && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
          <View style={styles.overlay} />
        </TouchableOpacity>
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: animation }],
          },
        ]}
      >
        <SafeAreaView style={styles.content}>
          {/* Encabezado del Sidebar */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Opciones del menú */}
          <View style={styles.menuItems}>
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="user" size={20} color="#333" />
              <Text style={styles.menuText}>Mi Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="package" size={20} color="#333" />
              <Text style={styles.menuText}>Mis Envíos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="clock" size={20} color="#333" />
              <Text style={styles.menuText}>Historial</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="settings" size={20} color="#333" />
              <Text style={styles.menuText}>Configuración</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="help-circle" size={20} color="#333" />
              <Text style={styles.menuText}>Ayuda</Text>
            </TouchableOpacity>
          </View>

          {/* Versión de la app */}
          <View style={styles.footer}>
            <Text style={styles.version}>Versión 1.0.0</Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: "#fff",
    zIndex: 150,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeButton: {
    padding: 8,
  },
  menuItems: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  version: {
    fontSize: 12,
    color: "#666",
  },
})

export default Sidebar

