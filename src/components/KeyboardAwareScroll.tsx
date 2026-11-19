import { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleProp, ViewStyle } from 'react-native';

type Props = { children: ReactNode; contentContainerStyle?: StyleProp<ViewStyle> };

export default function KeyboardAwareScroll({ children, contentContainerStyle }: Props) {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle, { paddingBottom: 48 }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}