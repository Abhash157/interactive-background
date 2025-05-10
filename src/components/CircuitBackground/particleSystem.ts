import { Node, Particle } from './types';

export const createParticle = (startNode: Node, endNode: Node): Particle => ({
  x: startNode.x,
  y: startNode.y,
  targetX: endNode.x,
  targetY: endNode.y,
  progress: 0,
  speed: 0.002 + Math.random() * 0.003,
});

export const updateParticles = (particles: Particle[]): Particle[] => {
  return particles
    .map((particle) => {
      particle.progress += particle.speed;
      
      if (particle.progress >= 1) {
        return null;
      }

      particle.x = particle.x + (particle.targetX - particle.x) * particle.speed;
      particle.y = particle.y + (particle.targetY - particle.y) * particle.speed;

      return particle;
    })
    .filter((particle): particle is Particle => particle !== null);
};

export const generateNewParticles = (
  nodes: Node[],
  currentParticles: Particle[],
  maxParticles: number = 20
): Particle[] => {
  if (!nodes.length || currentParticles.length >= maxParticles) {
    return currentParticles;
  }

  const newParticles: Particle[] = [...currentParticles];
  
  // Randomly select a node to start from
  const startNode = nodes[Math.floor(Math.random() * nodes.length)];
  if (!startNode?.connections?.length) return newParticles;

  // Select a random connected node
  const endNodeIndex = startNode.connections[Math.floor(Math.random() * startNode.connections.length)];
  const endNode = nodes[endNodeIndex];
  
  if (!endNode) return newParticles;

  newParticles.push(createParticle(startNode, endNode));
  
  return newParticles;
}; 