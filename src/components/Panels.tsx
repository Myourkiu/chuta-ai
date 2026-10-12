import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BUCKETS, goalCry, msUntilMidnight, plural, type Game, type Mark, type ModeStats } from '../game';
import { fonts, usePalette } from '../theme';
import { displayLetters } from '../words';
import { Sheet, SheetButton } from './Sheet';
import { MiniRow } from './Tile';

type Base = { visible: boolean; onClose: () => void };

export function HelpSheet({ visible, onClose }: Base) {
  const p = usePalette();
  const text = [styles.text, { color: p.fg }];
  return (
    <Sheet visible={visible} title="Como jogar" onClose={onClose}>
      <Text style={text}>
        Descubra a palavra de 5 letras. Aqui os chutes são ilimitados: chute quantas vezes quiser, mas o placar conta
        todos.
      </Text>
      <Text style={text}>Acentos e cedilha entram sozinhos. Depois de cada chute, as letras mudam de cor:</Text>
      <View style={styles.example}>
        <MiniRow letters={Array.from('chute')} marks={['hit', 'miss', 'miss', 'miss', 'miss']} size={40} />
        <Text style={text}>
          <Text style={styles.strong}>C</Text> está na palavra e no lugar certo.
        </Text>
      </View>
      <View style={styles.example}>
        <MiniRow letters={Array.from('golpe')} marks={['miss', 'near', 'miss', 'miss', 'miss']} size={40} />
        <Text style={text}>
          <Text style={styles.strong}>O</Text> está na palavra, mas em outro lugar.
        </Text>
      </View>
      <View style={styles.example}>
        <MiniRow letters={Array.from('trave')} marks={['miss', 'miss', 'miss', 'miss', 'miss']} size={40} />
        <Text style={text}>Cinza: nenhuma dessas letras aparece na palavra.</Text>
      </View>
      <Text style={[styles.text, { color: p.muted }]}>
        No modo Do dia, todo mundo recebe a mesma palavra. Compare quantos chutes cada um precisou. No modo Livre, é
        uma palavra nova sempre que você quiser.
      </Text>
      <SheetButton label="Bora jogar" onPress={onClose} />
    </Sheet>
  );
}

function Numbers({ stats, daily }: { stats: ModeStats; daily: boolean }) {
  const p = usePalette();
  const avg = stats.chutes.length ? stats.chutes.reduce((a, b) => a + b, 0) / stats.chutes.length : 0;
  const items = [
    { value: String(stats.played), label: 'jogos' },
    { value: stats.played ? `${Math.round((stats.wins / stats.played) * 100)}%` : '–', label: 'vitórias' },
    { value: avg ? avg.toFixed(1).replace('.', ',') : '–', label: 'média de chutes' },
    { value: String(stats.streak), label: daily ? 'dias seguidos' : 'em sequência' },
  ];
  return (
    <View style={styles.numbers}>
      {items.map((it) => (
        <View key={it.label} style={styles.number}>
          <Text style={[styles.bigNumber, { color: p.fg }]}>{it.value}</Text>
          <Text style={[styles.numberLabel, { color: p.muted }]}>{it.label}</Text>
        </View>
      ))}
    </View>
  );
}

function Distribution({ stats, highlight }: { stats: ModeStats; highlight?: number }) {
  const p = usePalette();
  const counts = BUCKETS.map((b) => stats.chutes.filter((c) => c >= b.min && c <= b.max).length);
  const max = Math.max(1, ...counts);
  return (
    <View style={styles.dist}>
      <Text style={[styles.caption, { color: p.muted }]}>CHUTES POR VITÓRIA</Text>
      {BUCKETS.map((b, i) => {
        const active = highlight !== undefined && highlight >= b.min && highlight <= b.max;
        return (
          <View key={b.label} style={styles.distRow}>
            <Text style={[styles.distLabel, { color: p.fg }]}>{b.label}</Text>
            <View style={styles.distTrack}>
              <View
                style={[
                  styles.distBar,
                  { flex: counts[i] / max, backgroundColor: active ? p.hit : p.miss, minWidth: 28 },
                ]}
              >
                <Text style={[styles.distCount, { color: active ? p.hitFg : p.missFg }]}>{counts[i]}</Text>
              </View>
              <View style={{ flex: 1 - counts[i] / max }} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function StatsSheet({ visible, onClose, stats, daily }: Base & { stats: ModeStats; daily: boolean }) {
  const p = usePalette();
  return (
    <Sheet visible={visible} title={daily ? 'Estatísticas · Do dia' : 'Estatísticas · Livre'} onClose={onClose}>
      <Numbers stats={stats} daily={daily} />
      <Text style={[styles.text, { color: p.muted }]}>Recorde de sequência: {stats.best}</Text>
      <Distribution stats={stats} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 16, lineHeight: 23 },
  strong: { fontFamily: fonts.bold },
  lead: { fontSize: 18, lineHeight: 25, fontFamily: fonts.medium },
  example: { gap: 8 },
  answer: { alignItems: 'center', paddingVertical: 4 },
  numbers: { flexDirection: 'row', justifyContent: 'space-between' },
  number: { flex: 1, alignItems: 'center' },
  bigNumber: { fontFamily: fonts.display, fontSize: 30, fontVariant: ['tabular-nums'] },
  numberLabel: { fontSize: 12, textAlign: 'center' },
  caption: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.2 },
  dist: { gap: 6 },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  distLabel: { width: 44, fontFamily: fonts.bold, fontSize: 14, fontVariant: ['tabular-nums'] },
  distTrack: { flex: 1, flexDirection: 'row' },
  distBar: { height: 24, borderRadius: 4, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 8 },
  distCount: { fontFamily: fonts.bold, fontSize: 13 },
  countdown: { textAlign: 'center', fontSize: 15 },
  clock: { fontFamily: fonts.bold, fontVariant: ['tabular-nums'] },
});
