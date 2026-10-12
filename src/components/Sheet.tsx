import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, usePalette } from '../theme';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Sheet({ visible, title, onClose, children }: Props) {
  const p = usePalette();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: p.scrim }]} onPress={onClose} />
        <View style={[styles.panel, { backgroundColor: p.surface, paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: p.fg }]}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Fechar">
              <Text style={[styles.close, { color: p.muted }]}>✕</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}

type ButtonProps = { label: string; onPress: () => void; kind?: 'primary' | 'ghost' };

export function SheetButton({ label, onPress, kind = 'primary' }: ButtonProps) {
  const p = usePalette();
  const primary = kind === 'primary';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        primary ? { backgroundColor: p.accent } : { borderColor: p.line, borderWidth: 2 },
        { opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <Text style={[styles.buttonLabel, { color: primary ? p.accentFg : p.fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  panel: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 18,
    maxHeight: '88%',
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 26 },
  close: { fontSize: 22, padding: 4 },
  body: { gap: 16, paddingBottom: 4 },
  button: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buttonLabel: { fontFamily: fonts.bold, fontSize: 17 },
});
