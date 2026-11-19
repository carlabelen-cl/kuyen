import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme/colors';

type Props = { step: 1 | 2 | 3; onBack: () => void };

export default function OnboardingHeader({ step, onBack }: Props) {
  return (
    <View style={{ marginBottom: 24 }}>
      <View style={styles.row}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.label}>TU ESPACIO · {step} DE 3</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.bars}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={[styles.bar, i <= step && { backgroundColor: colors.primary }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  label: { fontFamily: fonts.semi, fontSize: 12, letterSpacing: 1.2, color: colors.muted },
  bars: { flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
});