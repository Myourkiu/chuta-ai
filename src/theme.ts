import { useColorScheme } from 'react-native';
import type { Mark } from './game';

const light = {
  bg: '#edf2ec',
  surface: '#fbfdfa',
  fg: '#14211a',
  muted: '#5c6b61',
  line: '#c3cfc5',
  typed: '#5c6b61',
  hit: '#1e8449',
  hitFg: '#ffffff',
  near: '#e3a812',
  nearFg: '#1d1600',
  miss: '#7d8a81',
  missFg: '#ffffff',
  key: '#d5ded6',
  keyFg: '#14211a',
  accent: '#203d8c',
  accentFg: '#ffffff',
  scrim: 'rgba(10, 20, 14, 0.45)',
  toast: '#14211a',
  toastFg: '#fbfdfa',
};

export type Palette = typeof light;

const dark: Palette = {
  bg: '#0e1511',
  surface: '#16201a',
  fg: '#e6eee8',
  muted: '#8fa096',
  line: '#2c3a31',
  typed: '#8fa096',
  hit: '#2a9a58',
  hitFg: '#ffffff',
  near: '#d9a21c',
  nearFg: '#1d1600',
  miss: '#36423b',
  missFg: '#e6eee8',
  key: '#27332c',
  keyFg: '#e6eee8',
  accent: '#8fa8f2',
  accentFg: '#0e1511',
  scrim: 'rgba(0, 0, 0, 0.6)',
  toast: '#e6eee8',
  toastFg: '#0e1511',
};

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}

export function markColors(p: Palette, mark: Mark) {
  if (mark === 'hit') return { bg: p.hit, fg: p.hitFg };
  if (mark === 'near') return { bg: p.near, fg: p.nearFg };
  return { bg: p.miss, fg: p.missFg };
}

export const fonts = {
  display: 'BricolageGrotesque_800ExtraBold',
  bold: 'BricolageGrotesque_700Bold',
  medium: 'BricolageGrotesque_500Medium',
};
