export interface GuardianType {
  id: string;
  name: string;
  description: string;
  color: number;
  accent: number;
  cost: number;
  damage: number;
  range: number;
  cooldownMs: number;
  splashRadius?: number;
  projectileSpeed: number;
}

export const GUARDIAN_TYPES: GuardianType[] = [
  {
    id: "roble",
    name: "Oak Guardian",
    description: "Living-wood tank. Slow but hits hard.",
    color: 0x6b8f3a,
    accent: 0x3f5a20,
    cost: 20,
    damage: 22,
    range: 130,
    cooldownMs: 950,
    projectileSpeed: 520,
  },
  {
    id: "brisa",
    name: "Breeze Spirit",
    description: "Fast and precise, single target.",
    color: 0x8fd6ff,
    accent: 0x2f7ea8,
    cost: 20,
    damage: 9,
    range: 175,
    cooldownMs: 420,
    projectileSpeed: 780,
  },
  {
    id: "ascua",
    name: "Forest Ember",
    description: "Slow fire, but hits an area.",
    color: 0xff8a3d,
    accent: 0xa34a1c,
    cost: 20,
    damage: 15,
    range: 140,
    cooldownMs: 1150,
    splashRadius: 55,
    projectileSpeed: 460,
  },
];
