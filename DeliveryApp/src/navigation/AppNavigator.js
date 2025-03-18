import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Login from "../components/Login/Login"
import HomeScreen from "../screens/HomeScreen"
import authService from "../services/authService"

const Stack = createNativeStackNavigator()

// Crear dos stacks separados: uno para rutas autenticadas y otro para rutas públicas
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
)

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    {/* Aquí puedes añadir más pantallas protegidas */}
  </Stack.Navigator>
)

// Componente wrapper para Login que maneja la actualización del estado de autenticación
function LoginScreen({ navigation }) {
  const handleLoginSuccess = async () => {
    // Navegar a la pantalla principal
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    })
  }

  return <Login onLoginSuccess={handleLoginSuccess} />
}

// Componente wrapper para HomeScreen que maneja el cierre de sesión
function HomeScreenWithLogout({ navigation }) {
  const handleLogout = async () => {
    await authService.logout()

    // Navegar de vuelta a Login
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    })
  }

  return <HomeScreen onLogout={handleLogout} />
}

// AppNavigator principal que decide qué stack mostrar basado en el estado de autenticación
export default function AppNavigator({ userToken }) {
  return (
    <NavigationContainer>
      {userToken ? (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreenWithLogout} />
          {/* Aquí puedes añadir más pantallas protegidas */}
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}

