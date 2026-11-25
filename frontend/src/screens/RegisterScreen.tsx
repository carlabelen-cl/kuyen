import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import OnboardingHeader from '../components/OnboardingHeader';
import KeyboardAwareScroll from '../components/KeyboardAwareScroll';
import TextField from '../components/TextField';
import SelectField from '../components/SelectField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const NACIONALIDADES = ['Chile', 'Argentina', 'Perú', 'Bolivia', 'Colombia', 'Venezuela', 'México', 'España', 'Otra'];

export default function RegisterScreen({ navigation }: Props) {
  const { registrar } = useAuth();
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [nacionalidad, setNacionalidad] = useState<string>();
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const valido = nombre.trim() && edad && nacionalidad && correo.includes('@') && clave.length >= 8;

  const continuar = async () => {
    setError('');
    setGuardando(true);
    try {
      await registrar({ nombre, edad: parseInt(edad, 10), nacionalidad: nacionalidad!, correo, clave });
      navigation.navigate('ClinicalProfile');
    } catch (e) {
      setError(
        e instanceof Error && e.message === 'CORREO_EXISTE'
          ? 'Este correo ya está registrado.'
          : 'No pudimos crear tu cuenta. Intenta de nuevo.'
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAwareScroll contentContainerStyle={styles.content}>
        <OnboardingHeader step={1} onBack={() => navigation.goBack()} />
        <Text style={styles.title}>Comencemos por ti</Text>
        <Text style={styles.subtitle}>Crea tu cuenta para empezar a conocerte mejor.</Text>

        <TextField label="Nombre" placeholder="Tu nombre" value={nombre} onChangeText={setNombre} />
        <TextField label="Edad" placeholder="Tu edad" value={edad} onChangeText={setEdad} keyboardType="number-pad" maxLength={2} />
        <SelectField label="Nacionalidad" placeholder="Selecciona tu nacionalidad" value={nacionalidad} options={NACIONALIDADES} onSelect={setNacionalidad} />
        <TextField label="Correo" placeholder="nombre@correo.com" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
        <TextField label="Contraseña" placeholder="Crea una contraseña" value={clave} onChangeText={setClave} password hint="Usa al menos 8 caracteres." />

        {error !== '' && <Text style={styles.error}>{error}</Text>}
        <Button title="Continuar" disabled={!valido || guardando} onPress={continuar} />

        <View style={styles.privacy}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.muted} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.privacyTitle}>Tu información de salud es privada.</Text>
            <Text style={styles.privacyText}>Al continuar, aceptas los Términos y la Privacidad.</Text>
          </View>
        </View>
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
  privacy: { flexDirection: 'row', marginTop: 20, padding: 14, borderRadius: 14, backgroundColor: colors.surface },
  privacyTitle: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },
  privacyText: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
});