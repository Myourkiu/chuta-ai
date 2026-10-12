import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Mark } from '../game';
import { fonts, markColors, usePalette } from '../theme';

const ROWS = ['qwertyuiop', 'asdfghjkl', '>zxcvbnm<'];

type Props = {
  states: Record<string, Mark>;
  onKey: (key: string) => void;
};

export function Keyboard({ states, onKey }: Props) {
  const p = usePalette();

  return (
    <View style={styles.wrap}>
      {ROWS.map((row, r) => (
        <View key={r} style={styles.row}>
          {r === 1 && <View style={styles.half} />}
          {Array.from(row).map((k) => {
            const isEnter = k === '>';
            const isDel = k === '<';
            const wide = isEnter || isDel;
            const colored = states[k] ? markColors(p, states[k]) : null;
            const bg = colored?.bg ?? p.key;
            const fg = colored?.fg ?? p.keyFg;
            const name = isEnter ? 'ENTER' : isDel ? 'DEL' : k;
            return (
              <Pressable
                key={k}
                onPress={() => onKey(name)}
                accessibilityRole="button"
                accessibilityLabel={isEnter ? 'Chutar' : isDel ? 'Apagar' : k}
                style={({ pressed }) => [
                  styles.key,
                  wide && styles.wide,
                  { backgroundColor: bg, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={[wide ? styles.small : styles.label, { color: fg }]}>
                  {isEnter ? 'CHUTAR' : isDel ? '⌫' : k.toUpperCase()}
                </Text>
              </Pressable>
            );
          })}
          {r === 1 && <View style={styles.half} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 7, paddingHorizontal: 6, paddingTop: 6, paddingBottom: 4 },
  row: { flexDirection: 'row', gap: 5 },
  half: { flex: 0.5 },
  key: {
    flex: 1,
    height: 56,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wide: { flex: 1.6 },
  label: { fontFamily: fonts.bold, fontSize: 19 },
  small: { fontFamily: fonts.bold, fontSize: 13, letterSpacing: 0.5 },
});
