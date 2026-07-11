// Plain constants shared between the Phaser layer and the React layer.
// Keep this file free of any Phaser import — React components (which get
// server-rendered) import from here, not from the scene files directly,
// so they never accidentally pull the Phaser module into SSR.
export const GAME_OVER_EVENT = "hoodguardians:gameover";

export interface GameOverDetail {
  victory: boolean;
  score: number;
}

// React -> Phaser: player picked a different guardian type to place next,
// from the selector rendered under the canvas.
export const SELECT_GUARDIAN_EVENT = "hoodguardians:selectguardian";

export interface SelectGuardianDetail {
  guardianTypeId: string;
}

// Phaser -> React: a run just started (or restarted); tells the React
// selector which guardian type is active by default (whatever was hatched
// in the menu) so its highlighted button stays in sync.
export const GUARDIAN_READY_EVENT = "hoodguardians:guardianready";

export interface GuardianReadyDetail {
  guardianTypeId: string;
}
