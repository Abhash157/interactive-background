export interface Node {
  x: number;
  y: number;
  connections: number[];
  pulse: number;
  baseGlow: number;
}

export interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
} 