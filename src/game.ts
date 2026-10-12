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

