import { View, Text } from 'react-native';
import { colors, fonts } from '../theme/colors';

export default function PlaceholderScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 20, color: colors.muted }}>Próximamente</Text>
    </View>
  );
}