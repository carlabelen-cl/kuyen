import { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme/colors';

type Props = { label?: string; placeholder: string; value?: string; options: string[]; onSelect: (v: string) => void };

export default function SelectField({ label, placeholder, value, options, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable style={styles.box} onPress={() => setOpen(true)}>
        <Text style={[styles.value, !value && { color: colors.muted }]}>{value ?? placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color={colors.muted} />
      </Pressable>

      <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            {options.map((o) => (
              <Pressable key={o} style={styles.option} onPress={() => { onSelect(o); setOpen(false); }}>
                <Text style={styles.optionText}>{o}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.text, marginBottom: 6 },
  box: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 50, paddingHorizontal: 14,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14,
  },
  value: { fontFamily: fonts.body, fontSize: 15, color: colors.text },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 },
  sheet: { backgroundColor: colors.card, borderRadius: 18, paddingVertical: 8 },
  option: { paddingVertical: 14, paddingHorizontal: 20 },
  optionText: { fontFamily: fonts.body, fontSize: 16, color: colors.text },
});