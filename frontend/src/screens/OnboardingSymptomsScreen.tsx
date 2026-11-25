import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import OnboardingHeader from '../components/OnboardingHeader';
import KeyboardAwareScroll from '../components/KeyboardAwareScroll';
import Chip from '../components/Chip';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { CATEGORIAS, CategoriaSintoma, TODOS_LOS_SINTOMAS, NOMBRE_SINTOMA, Diagnostico } from '../data/sintomas';
import { colors, fonts } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingSymptoms'>;

// Quita tildes y mayúsculas para que "migrana" encuentre "Migraña"
const normalizar = (t: string) =>
  t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function OnboardingSymptomsScreen({ navigation }: Props) {
  const { usuaria, actualizarPerfil } = useAuth();
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState('');

  // Categorías sugeridas según el diagnóstico del paso anterior van primero
  const categorias = useMemo(() => {
    const mios = (usuaria?.diagnosticos ?? []) as Diagnostico[];
    const esSugerida = (c: CategoriaSintoma) => !!c.afinidad?.some((a) => mios.includes(a));
    return [...CATEGORIAS]
      .sort((a, b) => Number(esSugerida(b)) - Number(esSugerida(a)))
      .map((c) => ({ ...c, sugerida: esSugerida(c) }));
  }, [usuaria?.diagnosticos]);

  const [abierta, setAbierta] = useState<string>(categorias[0].id);

  const toggle = (id: string) =>
    setElegidos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // Resultados del buscador
  const q = normalizar(busqueda.trim());
  const resultados = q ? TODOS_LOS_SINTOMAS.filter((s) => normalizar(s.nombre).includes(q)) : [];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAwareScroll contentContainerStyle={styles.content}>
        {/* Cabecera */}
        <OnboardingHeader step={3} onBack={() => navigation.goBack()} />
        <Text style={styles.title}>Escuchemos tu cuerpo</Text>
        <Text style={styles.subtitle}>Elige lo que sientes. Puedes cambiarlo cuando quieras.</Text>

        {/* Buscador */}
        <View style={styles.search}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar un síntoma"
            placeholderTextColor={colors.muted}
            value={busqueda}
            onChangeText={setBusqueda}
            autoCorrect={false}
          />
          {busqueda !== '' && (
            <Pressable onPress={() => setBusqueda('')} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          )}
        </View>

        {/* Tus síntomas: tira con lo elegido (tocar uno lo quita) */}
        {elegidos.length > 0 && (
          <View style={styles.resumen}>
            <Text style={styles.resumenTitulo}>Tus síntomas · {elegidos.length}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {elegidos.map((id) => (
                <Pressable key={id} style={styles.pill} onPress={() => toggle(id)}>
                  <Text style={styles.pillText}>{NOMBRE_SINTOMA[id]}</Text>
                  <Ionicons name="close" size={14} color="#fff" style={{ marginLeft: 6 }} />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Resultados de búsqueda, o categorías plegables */}
        {q ? (
          <View>
            <Text style={styles.category}>Resultados</Text>
            {resultados.length === 0 ? (
              <Text style={styles.vacio}>No encontramos ese síntoma. Prueba con otra palabra.</Text>
            ) : (
              <View style={styles.chips}>
                {resultados.map((s) => (
                  <Chip key={s.id} label={s.nombre} selected={elegidos.includes(s.id)} onPress={() => toggle(s.id)} />
                ))}
              </View>
            )}
          </View>
        ) : (
          categorias.map((c) => {
            const nElegidos = c.sintomas.filter((s) => elegidos.includes(s.id)).length;
            const estaAbierta = abierta === c.id;
            return (
              <View key={c.id} style={[styles.card, estaAbierta && styles.cardOpen]}>
                <Pressable style={styles.cardHeader} onPress={() => setAbierta(estaAbierta ? '' : c.id)}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={c.icono} size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{c.titulo}</Text>
                    <Text style={styles.cardSub}>
                      {c.sugerida ? 'Sugerido para ti · ' : ''}
                      {c.sintomas.length} opciones
                    </Text>
                  </View>
                  {nElegidos > 0 && (
                    <View style={styles.count}>
                      <Text style={styles.countText}>{nElegidos}</Text>
                    </View>
                  )}
                  <Ionicons name={estaAbierta ? 'chevron-up' : 'chevron-down'} size={20} color={colors.muted} />
                </Pressable>

                {estaAbierta && (
                  <View style={[styles.chips, { marginTop: 14 }]}>
                    {c.sintomas.map((s) => (
                      <Chip key={s.id} label={s.nombre} selected={elegidos.includes(s.id)} onPress={() => toggle(s.id)} />
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}

        {/* Nota de apoyo */}
        <View style={styles.support}>
          <Ionicons name="heart-outline" size={20} color={colors.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.supportTitle}>No tienes que sentirlo todo, ni todos los días.</Text>
            <Text style={styles.supportText}>Este espacio se adapta a ti.</Text>
          </View>
        </View>

        {/* Acciones: guarda los ids de los síntomas y completa el registro */}
        <Button
          title="Entrar a Kuyén"
          onPress={() => actualizarPerfil({ sintomas: elegidos, onboardingCompleto: true })}
        />
        <Text style={styles.footer}>Tu bienestar empieza por escucharte.</Text>
      </KeyboardAwareScroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24 },
  title: { fontFamily: fonts.heading, fontSize: 28, color: colors.text },
  subtitle: { fontFamily: fonts.body, fontSize: 15, color: colors.muted, marginTop: 6, marginBottom: 20 },
  search: {
    flexDirection: 'row', alignItems: 'center', height: 48, paddingHorizontal: 14, marginBottom: 16,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 24,
  },
  searchInput: { flex: 1, marginLeft: 8, fontFamily: fonts.body, fontSize: 15, color: colors.text },
  resumen: { marginBottom: 16 },
  resumenTitulo: { fontFamily: fonts.semi, fontSize: 13, color: colors.primary, marginBottom: 8 },
  pill: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 34, borderRadius: 17,
    backgroundColor: colors.primary, marginRight: 8,
  },
  pillText: { fontFamily: fonts.medium, fontSize: 13, color: '#fff' },
  category: { fontFamily: fonts.semi, fontSize: 15, color: colors.text, marginBottom: 10 },
  vacio: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  card: {
    padding: 16, marginBottom: 12, borderRadius: 20,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  cardOpen: { borderColor: colors.primarySoft, backgroundColor: colors.background },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  cardTitle: { fontFamily: fonts.semi, fontSize: 16, color: colors.text },
  cardSub: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  count: {
    minWidth: 24, height: 24, borderRadius: 12, paddingHorizontal: 6, marginRight: 8,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  countText: { fontFamily: fonts.semi, fontSize: 12, color: '#fff' },
  support: { flexDirection: 'row', padding: 16, borderRadius: 16, backgroundColor: colors.surface, marginVertical: 12 },
  supportTitle: { fontFamily: fonts.medium, fontSize: 14, color: colors.text },
  supportText: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginTop: 2 },
  footer: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 14 },
});