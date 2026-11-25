import { useEffect, useState } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import KeyboardAwareScroll from '../components/KeyboardAwareScroll';
import TextField from '../components/TextField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { usuaria, ingresar } = useAuth();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  // Si la cuenta existe pero el registro quedó a medias, continúa donde se quedó
  useEffect(() => {
    if (usuaria && !usuaria.onboardingCompleto) {
      navigation.navigate('ClinicalProfile');
    }
  }, [usuaria]);

  const entrar = async () => {
    setError('');
    try {
      await ingresar(correo, clave);
    } catch {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAwareScroll contentContainerStyle={styles.content}>
        {/* Volver a Bienvenida */}
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={{ marginBottom: 24 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        {/* Encabezado */}
        <Text style={styles.title}>Qué bueno verte de nuevo</Text>
        <Text style={styles.subtitle}>Ingresa con tu correo y contraseña.</Text>

        {/* Formulario */}
        <TextField label="Correo" placeholder="nombre@correo.com" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
        <TextField label="Contraseña" placeholder="Tu contraseña" value={clave} onChangeText={setClave} password />

        {/* Error y acción */}
        {error !== '' && <Text style={styles.error}>{error}</Text>}
        <Button title="Entrar" disabled={!correo || !clave} onPress={entrar} />
      </KeyboardAwareScroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24 },
  title: { fontFamily: fonts.heading, fontSize: 28, color: colors.text },
  subtitle: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, marginTop: 6, marginBottom: 24 },
  error: { fontFamily: fonts.medium, fontSize: 13, color: '#B3261E', marginBottom: 12, textAlign: 'center' },
});