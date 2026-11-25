import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Button from '../components/Button';
import { colors, fonts } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Identidad lunar */}
      <View style={styles.brand}>
        <View style={styles.halo}>
          <Ionicons name="moon" size={44} color={colors.primary} />
        </View>
        <Text style={styles.name}>Kuyén</Text>
        <Text style={styles.tagline}>TU CUERPO, TU PROPIO RITMO</Text>
      </View>

      {/* Mensaje de bienvenida */}
      <View style={styles.message}>
        <Text style={styles.title}>Bienvenida a Kuyén,</Text>
        <Text style={styles.body}>una aplicación que te acompaña en tu diario vivir con tu diagnóstico</Text>
        <Ionicons name="heart-outline" size={22} color={colors.primarySoft} style={{ marginTop: 16 }} />
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        <Button title="Registrarse" onPress={() => navigation.navigate('Register')} />
        <View style={{ height: 12 }} />
        <Button title="Iniciar sesión" variant="secondary" onPress={() => navigation.navigate('Login')} />
        <Text style={styles.footer}>Un espacio seguro, a tu ritmo.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24, justifyContent: 'space-between' },
  brand: { alignItems: 'center', marginTop: 56 },
  halo: {
    width: 104, height: 104, borderRadius: 52, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  name: { fontFamily: fonts.heading, fontSize: 44, color: colors.text },
  tagline: { fontFamily: fonts.medium, fontSize: 12, letterSpacing: 2, color: colors.muted, marginTop: 6 },
  message: { alignItems: 'center', paddingHorizontal: 8 },
  title: { fontFamily: fonts.heading, fontSize: 26, color: colors.text, textAlign: 'center' },
  body: { fontFamily: fonts.body, fontSize: 16, color: colors.muted, textAlign: 'center', marginTop: 10, lineHeight: 24 },
  actions: { paddingBottom: 16 },
  footer: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 16 },
});