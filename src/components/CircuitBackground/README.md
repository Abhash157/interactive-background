# Circuit Background Component

A dynamic, interactive circuit board-inspired background component for Next.js applications. This component creates an animated canvas background that simulates a circuit board with glowing nodes, animated particles, and interactive effects.

## Features

- 🎨 Dark theme with neon accents
- 🔄 Animated particle system simulating data flow
- 💫 Interactive node glow effects
- 🖱️ Mouse movement parallax
- 📱 Responsive design
- ⚡ GPU-optimized animations

## Usage

```tsx
import { CircuitBackground } from '@/components/CircuitBackground';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CircuitBackground />
      {children}
    </>
  );
}
```

## Customization

The component uses the following color scheme by default:

- Base background: `#0a0f1c` (deep space blue-black)
- Primary glow: `#00ffcc` (neon cyan)
- Secondary glow: `#00ff66` (neon green)
- Accent colors: `#ff00ff` (magenta) and `#6600ff` (cyber purple)

## Performance Considerations

- The component uses the Canvas API for optimal performance
- Animations are throttled on mobile devices
- Particle system is optimized to maintain smooth performance
- Uses requestAnimationFrame for efficient animation loops

## Technical Details

- Built with TypeScript
- Uses CSS Modules for styling
- Implements a custom particle system
- Handles window resize events
- Supports mouse interaction 