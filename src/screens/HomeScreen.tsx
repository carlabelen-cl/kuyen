import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme/colors';

// Datos de ejemplo (después vendrán del algoritmo de correlación)
const FACTORES = [
  { nombre: 'Comidas', dolor: 68, ansiedad: 24 },
  { nombre: 'Estrés', dolor: 72, ansiedad: 84 },
  { nombre: 'Dormir poco', dolor: 76, ansiedad: 81 },
];

// 4 niveles de intensidad, igual que "Escala 1-4" del Figma
const nivel = (v: number) => (v >= 80 ? 3 : v >= 70 ? 2 : v >= 50 ? 1 : 0);
const FONDOS = [colors.border, colors.primarySoft, colors.primary, colors.primaryDark];

function Celda({ valor }: { valor: number }) {
  const n = nivel(valor);
  return (
    <View style={[styles.cell, { backgroundColor: FONDOS[n] }]}>
      <Text style={[styles.cellText, { color: n >= 2 ? '#fff' : colors.text }]}>{valor}%</Text>
    </View>
  );
}

export default function HomeScreen() {
  const { usuaria } = useAuth();
  const primerNombre = usuaria?.nombre.split(' ')[0] ?? '';

  const fecha = new Date()
    .toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Saludo */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.date}>{fecha}</Text>
            <Text style={styles.hello}>Hola, {primerNombre}</Text>
            <Text style={styles.sub}>Un día a la vez, contigo.</Text>
          </View>
          <View style={styles.moon}>
            <Ionicons name="moon" size={26} color={colors.primary} />
          </View>
        </View>

        {/* Registro diario */}
        <View style={styles.dailyCard}>
          <Text style={styles.eyebrow}>Tu momento de hoy</Text>
          <Text style={styles.cardTitle}>¿Cómo te sientes hoy?</Text>
          <Text style={styles.cardText}>Registra tus síntomas, comidas y descanso.</Text>
          <View style={{ height: 16 }} />
          <Button title="Registrar mi día" onPress={() => { /* aquí irá la pantalla 06 */ }} />
        </View>

        {/* Correlaciones */}
        <Text style={styles.sectionTitle}>Conoce tus patrones</Text>
        <View style={styles.periodRow}>
          <Text style={styles.period}>Últimos 30 días</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>DATOS DE EJEMPLO</Text></View>
        </View>

        <View style={styles.matrix}>
          <Text style={styles.matrixTitle}>Posibles gatillantes</Text>
          <View style={styles.row}>
            <Text style={[styles.head, { flex: 1.3, textAlign: 'left' }]}>Factor</Text>
            <Text style={styles.head}>Dolor</Text>
            <Text style={styles.head}>Ansiedad</Text>
          </View>
          {FACTORES.map((f) => (
            <View key={f.nombre} style={styles.row}>
              <Text style={styles.factor}>{f.nombre}</Text>
              <Celda valor={f.dolor} />
              <Celda valor={f.ansiedad} />
            </View>
          ))}
          <View style={styles.legend}>
            <Text style={styles.legendText}>Menor coincidencia</Text>
            {FONDOS.map((c) => <View key={c} style={[styles.legendBox, { backgroundColor: c }]} />)}
            <Text style={styles.legendText}>Mayor</Text>
          </View>
        </View>

        {/* Nota clínica */}
        <View style={styles.clinical}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.clinicalTitle}>Información clínica</Text>
            <Text style={styles.clinicalText}>% de días con el factor en que apareció el síntoma.</Text>
            <Text style={styles.clinicalText}>Son coincidencias, no causas ni un diagnóstico.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 40 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  date: { fontFamily: fonts.semi, fontSize: 12, letterSpacing: 1.2, color: colors.muted },
  hello: { fontFamily: fonts.heading, fontSize: 30, color: colors.text, marginTop: 4 },
  sub: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, marginTop: 2 },
  moon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  dailyCard: { backgroundColor: colors.surface, borderRadius: 24, padding: 20, marginBottom: 28 },
  eyebrow: { fontFamily: fonts.semi, fontSize: 12, color: colors.primary, marginBottom: 6 },
  cardTitle: { fontFamily: fonts.heading, fontSize: 22, color: colors.text },
  cardText: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 4 },
  sectionTitle: { fontFamily: fonts.heading, fontSize: 22, color: colors.text },
  periodRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, marginBottom: 14 },
  period: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: colors.surface },
  badgeText: { fontFamily: fonts.semi, fontSize: 10, letterSpacing: 0.8, color: colors.primary },
  matrix: { backgroundColor: colors.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border },
  matrixTitle: { fontFamily: fonts.semi, fontSize: 15, color: colors.text, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  head: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.muted, textAlign: 'center' },
  factor: { flex: 1.3, fontFamily: fonts.medium, fontSize: 14, color: colors.text },
  cell: { flex: 1, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cellText: { fontFamily: fonts.semi, fontSize: 14 },
  legend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 },
  legendBox: { width: 18, height: 10, borderRadius: 3 },
  legendText: { fontFamily: fonts.body, fontSize: 11, color: colors.muted },
  clinical: { flexDirection: 'row', marginTop: 16, padding: 14, borderRadius: 14, backgroundColor: colors.surface },
  clinicalTitle: { fontFamily: fonts.semi, fontSize: 13, color: colors.text, marginBottom: 2 },
  clinicalText: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
});