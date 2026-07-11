export interface WaveSpawn {
  enemyId: number;
  count: number;
}

export interface Wave {
  spawns: WaveSpawn[];
  intervalMs: number;
  reward: number;
}

// 6 waves total, ramping difficulty.
export const WAVES: Wave[] = [
  { spawns: [{ enemyId: 1, count: 6 }], intervalMs: 900, reward: 20 },
  {
    spawns: [
      { enemyId: 1, count: 8 },
      { enemyId: 4, count: 3 },
    ],
    intervalMs: 800,
    reward: 26,
  },
  {
    spawns: [
      { enemyId: 2, count: 6 },
      { enemyId: 1, count: 4 },
    ],
    intervalMs: 750,
    reward: 32,
  },
  {
    spawns: [
      { enemyId: 3, count: 5 },
      { enemyId: 2, count: 6 },
    ],
    intervalMs: 700,
    reward: 38,
  },
  {
    spawns: [
      { enemyId: 4, count: 8 },
      { enemyId: 2, count: 6 },
      { enemyId: 3, count: 3 },
    ],
    intervalMs: 650,
    reward: 46,
  },
  {
    spawns: [
      { enemyId: 3, count: 10 },
      { enemyId: 2, count: 6 },
      { enemyId: 4, count: 6 },
    ],
    intervalMs: 600,
    reward: 60,
  },
];

export const STARTING_LIVES = 5;
export const STARTING_COINS = 40;
