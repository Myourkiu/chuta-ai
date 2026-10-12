import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, ScrollView, StyleSheet, useAnimatedValue } from 'react-native';
import { score, type Game } from '../game';
import { displayLetters } from '../words';
import { Tile } from './Tile';

const GAP = 6;

type Props = {
  game: Game;
  input: string;
  tileSize: number;
  /** Linha que acabou de ser enviada e deve virar com animação. */
  revealRow: number;
  /** Linha da vitória, que pula depois de revelada. */
  winRow: number;
  /** Muda de valor a cada chute recusado, para tremer a linha atual. */
  shakeKey: number;
};

function ShakeRow({ shakeKey, children }: { shakeKey: number; children: ReactNode }) {
  const x = useAnimatedValue(0);
  useEffect(() => {
    if (!shakeKey) return;
    const step = (to: number) => Animated.timing(x, { toValue: to, duration: 45, useNativeDriver: true });
    Animated.sequence([step(-9), step(9), step(-7), step(7), step(-4), step(0)]).start();
  }, [shakeKey, x]);
  return <Animated.View style={[styles.row, { transform: [{ translateX: x }] }]}>{children}</Animated.View>;
}

export function Board({ game, input, tileSize, revealRow, winRow, shakeKey }: Props) {
  const scroll = useRef<ScrollView>(null);
  const playing = game.status === 'playing';
  const rows = Math.max(6, game.guesses.length + (playing ? 1 : 0));

  return (
    <ScrollView
      ref={scroll}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
      showsVerticalScrollIndicator={false}
    >
      {Array.from({ length: rows }, (_, r) => {
        const guess = game.guesses[r];
        if (guess) {
          const marks = score(guess, game.answer);
          const letters = displayLetters(guess);
          return (
            <Animated.View key={`g${r}`} style={styles.row}>
              {letters.map((l, i) => (
                <Tile
                  key={i}
                  index={i}
                  letter={l}
                  mark={marks[i]}
                  size={tileSize}
                  reveal={r === revealRow}
                  bounce={r === winRow}
                />
              ))}
            </Animated.View>
          );
        }
        if (playing && r === game.guesses.length) {
          return (
            <ShakeRow key={`c${r}`} shakeKey={shakeKey}>
              {Array.from({ length: 5 }, (_, i) => (
                <Tile key={i} index={i} letter={input[i] ?? ''} size={tileSize} />
              ))}
            </ShakeRow>
          );
        }
        return (
          <Animated.View key={`e${r}`} style={styles.row}>
            {Array.from({ length: 5 }, (_, i) => (
              <Tile key={i} letter="" size={tileSize} />
            ))}
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

export const BOARD_GAP = GAP;

const styles = StyleSheet.create({
  scroll: { flex: 1, alignSelf: 'stretch' },
  content: { alignItems: 'center', paddingVertical: 14, gap: GAP },
  row: { flexDirection: 'row', gap: GAP },
});
