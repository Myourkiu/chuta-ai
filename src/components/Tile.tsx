import { useEffect } from 'react';
import { Animated, StyleSheet, Text, useAnimatedValue, View } from 'react-native';
import type { Mark } from '../game';
import { fonts, markColors, usePalette } from '../theme';

export const FLIP_MS = 420;
export const STAGGER_MS = 230;

type Props = {
  letter: string;
  size: number;
  mark?: Mark;
  /** Índice da letra na linha, usado para escalonar as animações. */
  index?: number;
  reveal?: boolean;
  bounce?: boolean;
};

export function Tile({ letter, size, mark, index = 0, reveal = false, bounce = false }: Props) {
  const p = usePalette();
  const flip = useAnimatedValue(reveal ? 0 : 1);
  const pop = useAnimatedValue(1);
  const lift = useAnimatedValue(0);

  useEffect(() => {
    if (!reveal) return;
    Animated.timing(flip, {
      toValue: 1,
      duration: FLIP_MS,
      delay: index * STAGGER_MS,
      useNativeDriver: true,
    }).start();
  }, [reveal, flip, index]);

  useEffect(() => {
    if (mark || !letter) return;
    pop.setValue(1.12);
    Animated.spring(pop, { toValue: 1, friction: 4, tension: 220, useNativeDriver: true }).start();
  }, [letter, mark, pop]);

  useEffect(() => {
    if (!bounce) return;
    Animated.sequence([
      Animated.delay(index * 90),
      Animated.timing(lift, { toValue: -size * 0.45, duration: 160, useNativeDriver: true }),
      Animated.spring(lift, { toValue: 0, friction: 3, tension: 160, useNativeDriver: true }),
    ]).start();
  }, [bounce, index, lift, size]);

  const rotateX = flip.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '90deg', '0deg'] });
  const frontOpacity = flip.interpolate({ inputRange: [0, 0.499, 0.5, 1], outputRange: [1, 1, 0, 0] });
  const backOpacity = flip.interpolate({ inputRange: [0, 0.499, 0.5, 1], outputRange: [0, 0, 1, 1] });

  const fontSize = Math.round(size * 0.52);
  const letterStyle = [styles.letter, { fontSize, lineHeight: fontSize * 1.15 }];
  const colored = mark ? markColors(p, mark) : null;

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        transform: [{ translateY: lift }, { scale: pop }, { perspective: 600 }, { rotateX }],
      }}
    >
      <Animated.View
        style={[
          styles.face,
          { backgroundColor: p.surface, borderColor: letter ? p.typed : p.line, opacity: colored ? frontOpacity : 1 },
        ]}
      >
        <Text style={[letterStyle, { color: p.fg }]}>{letter.toUpperCase()}</Text>
      </Animated.View>
      {colored && (
        <Animated.View
          style={[styles.face, { backgroundColor: colored.bg, borderColor: colored.bg, opacity: backOpacity }]}
        >
          <Text style={[letterStyle, { color: colored.fg }]}>{letter.toUpperCase()}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export function MiniRow({ letters, marks, size }: { letters: string[]; marks: Mark[]; size: number }) {
  return (
    <View style={styles.miniRow}>
      {letters.map((l, i) => (
        <Tile key={i} letter={l} mark={marks[i]} size={size} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  letter: {
    fontFamily: fonts.display,
    includeFontPadding: false,
    textAlign: 'center',
  },
  miniRow: {
    flexDirection: 'row',
    gap: 5,
  },
});
