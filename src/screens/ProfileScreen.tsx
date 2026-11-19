import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme/colors';

export default function ProfileScreen() {
  const { usuaria, salir } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.title}>Mi perfil</Text>

        {/* Datos de la usuaria registrada */}
        <View style={styles.card}>
          <Text style={styles.name}>{usuaria?.nombre}</Text>
          <Text style={styles.email}>{usuaria?.correo}</Text>
        </View>

        {/* Cerrar sesión: borra la sesión y vuelve a Bienvenida */}
        <Button title="Cerrar sesión" variant="secondary" onPress={salir} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24 },
  title: { fontFamily: fonts.heading, fontSize: 28, color: colors.text, marginBottom: 20 },
  card: { padding: 20, borderRadius: 20, backgroundColor: colors.surface, marginBottom: 24 },
  name: { fontFamily: fonts.heading, fontSize: 22, color: colors.text },
  email: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 4 },
});