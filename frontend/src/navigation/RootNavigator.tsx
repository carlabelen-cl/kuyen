import { createNativeStackNavigator } from '@react-navigation/native-stack'; //Trae una herramienta para crear una "pila" (Stack) de pantallas. Imagina una pila de cartas: cuando vas a una pantalla nueva, pones una carta encima; cuando das "atrás", quitas la carta de arriba.
import { RootStackParamList } from './types'; // Importa una "lista de reglas" de TypeScript que define cómo se llaman las pantallas y qué datos se le pueden enviar a cada una para evitar errores de escritura.
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ClinicalProfileScreen from '../screens/ClinicalProfileScreen';
import OnboardingSymptomsScreen from '../screens/OnboardingSymptomsScreen';
import MainTabs from './MainTabs';
import { useAuth } from '../context/AuthContext';
// usamos el stack navigator para manejar la navegación entre pantallas, y usamos el contexto de autenticación para saber si la usuaria ya completó el onboarding o no, y así mostrarle las pantallas correspondientes

const Stack = createNativeStackNavigator<RootStackParamList>(); // creamos el stack navigator con el tipo de parámetros que se pueden pasar entre pantallas, para poder usarlo en el stack navigator

export default function RootNavigator() {
  const { usuaria, cargando } = useAuth(); // si es que la usaria aún está cargando se muestra en blanco la pantalla por fracción de segundos 
  if (cargando) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>  
      {usuaria?.onboardingCompleto ? ( // arriba se crea el contenedor de las pantallas, abajo si es que el onboarding esta completo pasamos al main y sino a la lista de pestañas que se ven ahí 
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ClinicalProfile" component={ClinicalProfileScreen} />
          <Stack.Screen name="OnboardingSymptoms" component={OnboardingSymptomsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}