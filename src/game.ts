import { ANSWERS } from './words';

export type Mark = 'hit' | 'near' | 'miss';
export type Mode = 'daily' | 'free';
export type Status = 'playing' | 'won' | 'lost';

export type Game = {
  mode: Mode;
  /** Número do dia (só no modo diário). */
  day: number;
  answer: string;
  guesses: string[];
  status: Status;
};

// Dia 1 do Chuta Aí.
const EPOCH = new Date(2026, 9, 11);
const DAY_MS = 86_400_000;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Ordem fixa das palavras do dia: todo mundo recebe a mesma palavra na mesma data.
const DAILY_ORDER = (() => {
  const order = [...ANSWERS];
  const rnd = mulberry32(20261011);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
})();

export function dayNumber(now = new Date()): number {
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((local.getTime() - EPOCH.getTime()) / DAY_MS);
}

export function msUntilMidnight(now = new Date()): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return next.getTime() - now.getTime();
}

export function newDailyGame(day = dayNumber()): Game {
  const len = DAILY_ORDER.length;
  return { mode: 'daily', day, answer: DAILY_ORDER[((day % len) + len) % len], guesses: [], status: 'playing' };
}

export function newFreeGame(exclude?: string): Game {
  let answer: string;
  do {
    answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
  } while (answer === exclude && ANSWERS.length > 1);
  return { mode: 'free', day: 0, answer, guesses: [], status: 'playing' };
}

export function score(guess: string, answer: string): Mark[] {
  const marks: Mark[] = Array(5).fill('miss');
  const left: Record<string, number> = {};
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) marks[i] = 'hit';
    else left[answer[i]] = (left[answer[i]] ?? 0) + 1;
  }
  for (let i = 0; i < 5; i++) {
    if (marks[i] !== 'hit' && left[guess[i]] > 0) {
      marks[i] = 'near';
      left[guess[i]]--;
    }
  }
  return marks;
}

const RANK: Record<Mark, number> = { miss: 0, near: 1, hit: 2 };

export function keyStates(guesses: string[], answer: string): Record<string, Mark> {
  const states: Record<string, Mark> = {};
  for (const g of guesses) {
    score(g, answer).forEach((mark, i) => {
      const prev = states[g[i]];
      if (!prev || RANK[mark] > RANK[prev]) states[g[i]] = mark;
    });
  }
  return states;
}

