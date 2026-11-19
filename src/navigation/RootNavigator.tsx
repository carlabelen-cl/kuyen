import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ClinicalProfileScreen from '../screens/ClinicalProfileScreen';
import OnboardingSymptomsScreen from '../screens/OnboardingSymptomsScreen';
import MainTabs from './MainTabs';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { usuaria, cargando } = useAuth();
  if (cargando) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {usuaria?.onboardingCompleto ? (
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