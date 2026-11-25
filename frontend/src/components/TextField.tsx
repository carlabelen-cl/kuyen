import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme/colors';

type Props = TextInputProps & { label: string; hint?: string; password?: boolean };

export default function TextField({ label, hint, password, ...rest }: Props) {
  const [hidden, setHidden] = useState(!!password);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        <TextInput {...rest} secureTextEntry={hidden} placeholderTextColor={colors.muted} style={styles.input} />
        {password && (
          <Pressable onPress={() => setHidden((h) => !h)}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.muted} />
          </Pressable>
        )}
      </View>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.text, marginBottom: 6 },
  box: {
    flexDirection: 'row', alignItems: 'center', height: 50, paddingHorizontal: 14,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14,
  },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.text },
  hint: { fontFamily: fonts.body, fontSize: 12, color: colors.muted, marginTop: 6 },
});