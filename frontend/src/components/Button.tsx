import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme/colors';

type Props = { title: string; onPress?: () => void; variant?: 'primary' | 'secondary'; disabled?: boolean };

export default function Button({ title, onPress, variant = 'primary', disabled }: Props) {
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.base, primary ? styles.primary : styles.secondary, disabled && { opacity: 0.45 }]}
    >
      <Text style={[styles.text, { color: primary ? '#fff' : colors.primary }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.primary },
  secondary: { borderWidth: 1.5, borderColor: colors.primary },
  text: { fontFamily: fonts.semi, fontSize: 16 },
});