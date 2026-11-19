import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import OnboardingHeader from '../components/OnboardingHeader';
import SelectField from '../components/SelectField';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ClinicalProfile'>;

const DIAGNOSTICOS = [
  { id: 'Endometriosis', detalle: undefined },
  { id: 'Adenomiosis', detalle: undefined },
  { id: 'SOMP', detalle: 'Síndrome Ovárico Metabólico Poliquístico' },
];
const ETAPAS = ['Diagnóstico confirmado', 'Sospecha médica'];
const ANTIGUEDAD = ['Menos de 1 año', 'Entre 1 y 3 años', 'Entre 3 y 5 años', 'Más de 5 años'];

export default function ClinicalProfileScreen({ navigation }: Props) {
  const { actualizarPerfil } = useAuth();
  const [diagnosticos, setDiagnosticos] = useState<string[]>([]);
  const [etapa, setEtapa] = useState<string>();
  const [antiguedad, setAntiguedad] = useState<string>();

  const toggle = (id: string) =>
    setDiagnosticos((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));

  const valido = diagnosticos.length > 0 && etapa && antiguedad;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Cabecera */}
        <OnboardingHeader step={2} onBack={() => navigation.goBack()} />
        <Text style={styles.title}>Tu historia de salud</Text>
        <Text style={styles.subtitle}>Cada historia es distinta. Conozcamos la tuya.</Text>

        {/* Diagnósticos */}
        <Text style={styles.question}>¿Qué diagnóstico te acompaña?</Text>
        <Text style={styles.help}>Puedes seleccionar más de uno.</Text>
        {DIAGNOSTICOS.map((d) => {
          const on = diagnosticos.includes(d.id);
          return (
            <Pressable key={d.id} onPress={() => toggle(d.id)} style={[styles.card, on && styles.cardOn]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{d.id}</Text>
                {d.detalle && <Text style={styles.cardDetail}>{d.detalle}</Text>}
              </View>
              <Ionicons name={on ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={on ? colors.primary : colors.border} />
            </Pressable>
          );
        })}

        {/* Confirmación clínica */}
        <Text style={[styles.question, { marginTop: 24 }]}>¿En qué etapa estás?</Text>
        {ETAPAS.map((e) => (
          <Pressable key={e} onPress={() => setEtapa(e)} style={[styles.card, etapa === e && styles.cardOn]}>
            <Text style={[styles.cardTitle, { flex: 1 }]}>{e}</Text>
            <Ionicons name={etapa === e ? 'radio-button-on' : 'radio-button-off'} size={22} color={etapa === e ? colors.primary : colors.border} />
          </Pressable>
        ))}
        {etapa === 'Sospecha médica' && (
          <View style={styles.note}>
            <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.noteText}>La sospecha debe contar con apoyo médico.</Text>
          </View>
        )}

        {/* Antigüedad */}
        <Text style={[styles.question, { marginTop: 24, marginBottom: 10 }]}>¿Hace cuánto tienes el diagnóstico o síntomas?</Text>
        <SelectField placeholder="Antigüedad del diagnóstico o síntomas" value={antiguedad} options={ANTIGUEDAD} onSelect={setAntiguedad} />

        {/* Acciones: guarda el perfil en el mock y avanza al paso 3 */}
        <Button
          title="Continuar"
          disabled={!valido}
          onPress={async () => {
            await actualizarPerfil({ diagnosticos, etapa, antiguedad });
            navigation.navigate('OnboardingSymptoms');
          }}
        />
        <Text style={styles.footer}>Esto nos ayuda a personalizar tu experiencia.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24 },
  title: { fontFamily: fonts.heading, fontSize: 28, color: colors.text },
  subtitle: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, marginTop: 6, marginBottom: 24 },
  question: { fontFamily: fonts.semi, fontSize: 16, color: colors.text, marginBottom: 4 },
  help: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginBottom: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center', padding: 16, marginTop: 8, borderRadius: 16,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  cardOn: { borderColor: colors.primary, backgroundColor: colors.surface },
  cardTitle: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  cardDetail: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  note: { flexDirection: 'row', alignItems: 'center', marginTop: 10, padding: 12, borderRadius: 12, backgroundColor: colors.surface },
  noteText: { fontFamily: fonts.body, fontSize: 13, color: colors.text, marginLeft: 8, flex: 1 },
  footer: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: 14 },
});