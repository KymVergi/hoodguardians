export interface Point {
  x: number;
  y: number;
}

// Waypoints for the enemy path, hand-placed to follow the winding forest
// trail baked into public/assets/bg/forest.jpg (1280x720), crossing the
// bridge in the middle of the map.
export const PATH: Point[] = [
  { x: 430, y: 0 },
  { x: 490, y: 140 },
  { x: 300, y: 280 },
  { x: 210, y: 390 },
  { x: 300, y: 520 },
  { x: 600, y: 600 },
  { x: 860, y: 600 },
  { x: 860, y: 390 },
  { x: 860, y: 120 },
  { x: 1000, y: 40 },
  { x: 1280, y: 40 },
];

export function distanceToPath(x: number, y: number): number {
  let min = Infinity;
  for (let i = 0; i < PATH.length - 1; i++) {
    const a = PATH[i];
    const b = PATH[i + 1];
    const d = distToSegment(x, y, a.x, a.y, b.x, b.y);
    if (d < min) min = d;
  }
  return min;
}

function distToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSq = dx * dx + dy * dy;
  let t = lengthSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lengthSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}
