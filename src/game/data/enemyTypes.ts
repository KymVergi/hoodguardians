export interface EnemyType {
  id: number;
  name: string;
  hp: number;
  speed: number; // px/sec
  reward: number;
  walkKey: string;
  deathKey: string;
}

// Frame sheets are 288x48 = 6 frames of 48x48 (down-facing walk/death anims)
// from the CraftPix "Free Field Enemies" pack.
export const ENEMY_TYPES: Record<number, EnemyType> = {
  1: {
    id: 1,
    name: "Beetle",
    hp: 30,
    speed: 55,
    reward: 3,
    walkKey: "enemy1_walk",
    deathKey: "enemy1_death",
  },
  2: {
    id: 2,
    name: "Stalker",
    hp: 46,
    speed: 45,
    reward: 4,
    walkKey: "enemy2_walk",
    deathKey: "enemy2_death",
  },
  3: {
    id: 3,
    name: "Brute",
    hp: 72,
    speed: 34,
    reward: 6,
    walkKey: "enemy3_walk",
    deathKey: "enemy3_death",
  },
  4: {
    id: 4,
    name: "Fast Shade",
    hp: 22,
    speed: 78,
    reward: 3,
    walkKey: "enemy4_walk",
    deathKey: "enemy4_death",
  },
};

export const ENEMY_FRAME_SIZE = 48;
export const ENEMY_FRAME_COUNT = 6;
