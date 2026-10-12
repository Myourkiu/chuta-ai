import { BricolageGrotesque_500Medium } from '@expo-google-fonts/bricolage-grotesque/500Medium';
import { BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque/700Bold';
import { BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque/800ExtraBold';
import { useFonts } from 'expo-font';
import * as Haptics from 'expo-haptics';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState, Pressable, Share, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Board, BOARD_GAP } from './src/components/Board';
import { Keyboard } from './src/components/Keyboard';
import { EndSheet, HelpSheet, StatsSheet } from './src/components/Panels';
import { FLIP_MS, STAGGER_MS } from './src/components/Tile';
import {
  dayNumber,
  emptyAllStats,
  keyStates,
  newDailyGame,
  newFreeGame,
  recordResult,
  shareText,
  type Game,
  type Mode,
  type Stats,
} from './src/game';
import { load, save } from './src/storage';
import { fonts, usePalette, type Palette } from './src/theme';
import { VALID } from './src/words';

SplashScreen.preventAutoHideAsync().catch(() => {});

const REVEAL_TOTAL_MS = FLIP_MS + STAGGER_MS * 4 + 60;

type SheetName = 'help' | 'stats' | 'end' | null;

const haptic = {
  tap: () => Haptics.selectionAsync().catch(() => {}),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {}),
  win: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ChutaAi />
    </SafeAreaProvider>
  );
}

function ChutaAi() {
  const p = usePalette();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_500Medium,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });

  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<Mode>('daily');
  const [daily, setDaily] = useState<Game>(() => newDailyGame());
  const [free, setFree] = useState<Game>(() => newFreeGame());
  const [stats, setStats] = useState<Stats>(emptyAllStats);
  const [input, setInput] = useState('');
  const [sheet, setSheet] = useState<SheetName>(null);
  const [revealRow, setRevealRow] = useState(-1);
  const [winRow, setWinRow] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [armedUnknown, setArmedUnknown] = useState<string | null>(null);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const giveUpTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const game = mode === 'daily' ? daily : free;
  const setGame = mode === 'daily' ? setDaily : setFree;

  // Carrega o progresso salvo no aparelho.
  useEffect(() => {
    (async () => {
      const [m, d, f, s, seenHelp] = await Promise.all([
        load<Mode>('mode', 'daily'),
        load<Game | null>('daily', null),
        load<Game | null>('free', null),
        load<Stats>('stats', emptyAllStats()),
        load<boolean>('seenHelp', false),
      ]);
      const today = dayNumber();
      setMode(m);
      setDaily(d && d.day === today ? d : newDailyGame(today));
      if (f) setFree(f);
      setStats({ ...emptyAllStats(), ...s });
      if (!seenHelp) setSheet('help');
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready && fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [ready, fontsLoaded]);

  useEffect(() => void (ready && save('mode', mode)), [mode, ready]);
  useEffect(() => void (ready && save('daily', daily)), [daily, ready]);
  useEffect(() => void (ready && save('free', free)), [free, ready]);
  useEffect(() => void (ready && save('stats', stats)), [stats, ready]);

  // Virou o dia com o app aberto em segundo plano: carrega a palavra nova.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      const today = dayNumber();
      setDaily((d) => (d.day === today ? d : newDailyGame(today)));
    });
    return () => sub.remove();
  }, []);

  if (!ready || !fontsLoaded) return null;

  const tileSize = Math.floor(Math.min(62, (Math.min(width, 520) - 40 - BOARD_GAP * 4) / 5));
  const states = keyStates(busy ? game.guesses.slice(0, -1) : game.guesses, game.answer);
  const playing = game.status === 'playing';

  function showToast(message: string, ms = 1600) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), ms);
  }

  function reject(message: string, ms?: number) {
    setShakeKey((k) => k + 1);
    haptic.error();
    showToast(message, ms);
  }

  function resetRound() {
    setInput('');
    setArmedUnknown(null);
    setRevealRow(-1);
    setWinRow(-1);
    setConfirmGiveUp(false);
  }

  function submit() {
    if (input.length < 5) return reject('Faltam letras');
    if (!VALID.has(input) && armedUnknown !== input) {
      setArmedUnknown(input);
      return reject('Não conheço essa palavra. Toque em CHUTAR de novo para usar mesmo assim.', 2800);
    }
    const guesses = [...game.guesses, input];
    const won = input === game.answer;
    const next: Game = { ...game, guesses, status: won ? 'won' : 'playing' };
    setGame(next);
    setInput('');
    setArmedUnknown(null);
    setConfirmGiveUp(false);
    setRevealRow(guesses.length - 1);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (!won) return;
      setWinRow(guesses.length - 1);
      haptic.win();
      setStats((s) => recordResult(s, next));
      setTimeout(() => setSheet('end'), 1100);
    }, REVEAL_TOTAL_MS);
  }

  function onKey(key: string) {
    if (busy || !playing) return;
    if (key === 'ENTER') return submit();
    if (key === 'DEL') {
      if (input) {
        setInput(input.slice(0, -1));
        haptic.tap();
      }
      return;
    }
    if (input.length < 5) {
      setInput(input + key);
      haptic.tap();
    }
  }

  function giveUp() {
    if (!confirmGiveUp) {
      setConfirmGiveUp(true);
      showToast('Toque de novo em Desistir para ver a palavra.', 3000);
      clearTimeout(giveUpTimer.current);
      giveUpTimer.current = setTimeout(() => setConfirmGiveUp(false), 3000);
      return;
    }
    const next: Game = { ...game, status: 'lost' };
    setGame(next);
    setStats((s) => recordResult(s, next));
    resetRound();
    setSheet('end');
  }

  function switchMode(m: Mode) {
    if (busy || m === mode) return;
    setMode(m);
    resetRound();
    haptic.tap();
  }

  function newFreeWord() {
    setFree((f) => newFreeGame(f.answer));
    setMode('free');
    resetRound();
    setSheet(null);
  }

  function playFree() {
    if (free.status !== 'playing') setFree((f) => newFreeGame(f.answer));
    setMode('free');
    resetRound();
    setSheet(null);
  }

  function closeHelp() {
    setSheet(null);
    save('seenHelp', true);
  }

  const s = makeStyles(p);

  return (
    <View style={[s.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="auto" />
      <View style={s.column}>
        <View style={s.header}>
          <Text style={s.title}>
            Chuta <Text style={{ color: p.hit }}>Aí</Text>
          </Text>
          <View style={s.headerButtons}>
            <IconButton label="Como jogar" onPress={() => setSheet('help')} p={p}>
              <Text style={s.iconText}>?</Text>
            </IconButton>
            <IconButton label="Estatísticas" onPress={() => setSheet('stats')} p={p}>
              <View style={s.bars}>
                {[9, 15, 12].map((h, i) => (
                  <View key={i} style={[s.bar, { height: h }]} />
                ))}
              </View>
            </IconButton>
          </View>
        </View>

        <View style={s.toolbar}>
          <View style={s.segment}>
            {(['daily', 'free'] as const).map((m) => {
              const active = m === mode;
              return (
                <Pressable
                  key={m}
                  onPress={() => switchMode(m)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                  style={[s.segmentItem, active && { backgroundColor: p.surface }]}
                >
                  <Text style={[s.segmentLabel, { color: active ? p.fg : p.muted }]}>
                    {m === 'daily' ? `Do dia #${daily.day + 1}` : 'Livre'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={s.score}>
            <Text style={s.scoreLabel}>CHUTES</Text>
            <Text style={s.scoreValue}>{String(game.guesses.length).padStart(2, '0')}</Text>
          </View>
        </View>

        <View style={s.boardArea}>
          <Board
            key={mode}
            game={game}
            input={input}
            tileSize={tileSize}
            revealRow={revealRow}
            winRow={winRow}
            shakeKey={shakeKey}
          />
          {toast && (
            <View style={s.toast} pointerEvents="none">
              <Text style={s.toastText}>{toast}</Text>
            </View>
          )}
        </View>

        {playing ? (
          <>
            {game.guesses.length > 0 && !busy && (
              <Pressable onPress={giveUp} hitSlop={8} style={s.giveUp} accessibilityRole="button">
                <Text style={[s.giveUpText, confirmGiveUp && { color: p.fg }]}>
                  {confirmGiveUp ? 'Confirmar: desistir' : 'Desistir'}
                </Text>
              </Pressable>
            )}
            <Keyboard states={states} onKey={onKey} />
          </>
        ) : (
          <View style={s.doneBar}>
            <Pressable style={[s.doneButton, { backgroundColor: p.accent }]} onPress={() => setSheet('end')}>
              <Text style={[s.doneLabel, { color: p.accentFg }]}>Ver resultado</Text>
            </Pressable>
            <Pressable
              style={[s.doneButton, { borderColor: p.line, borderWidth: 2 }]}
              onPress={mode === 'free' ? newFreeWord : playFree}
            >
              <Text style={[s.doneLabel, { color: p.fg }]}>{mode === 'free' ? 'Nova palavra' : 'Modo livre'}</Text>
            </Pressable>
          </View>
        )}
      </View>

      <HelpSheet visible={sheet === 'help'} onClose={closeHelp} />
      <StatsSheet
        visible={sheet === 'stats'}
        onClose={() => setSheet(null)}
        stats={stats[mode]}
        daily={mode === 'daily'}
      />
      <EndSheet
        visible={sheet === 'end' && !playing}
        onClose={() => setSheet(null)}
        game={game}
        stats={stats[mode]}
        onShare={() => Share.share({ message: shareText(game) }).catch(() => {})}
        onNewWord={newFreeWord}
        onPlayFree={playFree}
      />
    </View>
  );
}

function IconButton({ label, onPress, p, children }: { label: string; onPress: () => void; p: Palette; children: ReactNode }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [
        { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: p.line },
        { alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 },
      ]}
    >
      {children}
    </Pressable>
  );
}

function makeStyles(p: Palette) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: p.bg },
    column: { flex: 1, width: '100%', maxWidth: 560, alignSelf: 'center' },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    title: { fontFamily: fonts.display, fontSize: 34, color: p.fg, letterSpacing: -0.5 },
    headerButtons: { flexDirection: 'row', gap: 10 },
    iconText: { fontFamily: fonts.display, fontSize: 19, color: p.fg },
    bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2.5 },
    bar: { width: 4, borderRadius: 1, backgroundColor: p.fg },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 12,
      gap: 12,
    },
    segment: { flexDirection: 'row', backgroundColor: p.key, borderRadius: 10, padding: 3 },
    segmentItem: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
    segmentLabel: { fontFamily: fonts.bold, fontSize: 15 },
    score: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
    scoreLabel: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.4, color: p.muted },
    scoreValue: { fontFamily: fonts.display, fontSize: 28, color: p.fg, fontVariant: ['tabular-nums'] },
    boardArea: { flex: 1 },
    toast: {
      position: 'absolute',
      top: 10,
      left: 24,
      right: 24,
      alignItems: 'center',
    },
    toastText: {
      backgroundColor: p.toast,
      color: p.toastFg,
      fontFamily: fonts.bold,
      fontSize: 15,
      textAlign: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    giveUp: { alignSelf: 'flex-end', paddingHorizontal: 20, paddingVertical: 4 },
    giveUpText: { fontFamily: fonts.bold, fontSize: 14, color: p.muted, textDecorationLine: 'underline' },
    doneBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingVertical: 16 },
    doneButton: { flex: 1, height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    doneLabel: { fontFamily: fonts.bold, fontSize: 17 },
  });
}
