'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './CircuitBackground.module.scss';
import { Node, Particle } from './types';
import { generateNewParticles, updateParticles } from './particleSystem';

export const CircuitBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastParticleUpdate = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle window resize and initial dimensions
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width;
      canvas.height = height;
      setDimensions({ width, height });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize nodes and particles
  useEffect(() => {
    const generateNodes = () => {
      const newNodes: Node[] = [];
      const gridSize = 8;
      const padding = 100;

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          newNodes.push({
            x: padding + (dimensions.width - padding * 2) * (i / (gridSize - 1)),
            y: padding + (dimensions.height - padding * 2) * (j / (gridSize - 1)),
            connections: [],
            pulse: 0,
            baseGlow: 0.5 + Math.random() * 0.5,
          });
        }
      }

      // Create connections
      newNodes.forEach((node, index) => {
        const connections = [];
        for (let i = 0; i < newNodes.length; i++) {
          if (i !== index && Math.random() < 0.3) {
            connections.push(i);
          }
        }
        node.connections = connections;
      });

      return newNodes;
    };

    if (dimensions.width > 0 && dimensions.height > 0) {
      setNodes(generateNodes());
    }
  }, [dimensions]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !nodes.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      if (!ctx || !canvas || !nodes.length) return;

      // Clear canvas
      ctx.fillStyle = '#0a0f1c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = 'rgba(0, 255, 204, 0.2)';
      ctx.lineWidth = 1;

      nodes.forEach((node, i) => {
        node.connections.forEach((targetIndex) => {
          const target = nodes[targetIndex];
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const glow = node.baseGlow + Math.sin(Date.now() * 0.001 + node.x) * 0.2;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 204, ${glow})`;
        ctx.fill();

        // Glow effect
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          20
        );
        gradient.addColorStop(0, `rgba(0, 255, 204, ${glow * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 255, 204, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Update and draw particles
      const now = Date.now();
      if (now - lastParticleUpdate.current > 100) {
        setParticles((currentParticles) => {
          const updatedParticles = updateParticles(currentParticles);
          return generateNewParticles(nodes, updatedParticles);
        });
        lastParticleUpdate.current = now;
      }

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 204, 0.8)';
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodes, particles]);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}; 