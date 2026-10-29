import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  shape: 'rect' | 'circle' | 'emoji';
  emoji?: string;
  angle: number;
  velocity: number;
  rotation: number;
  size: number;
}

const COLORS = ['#10D989', '#FF4766', '#93C5FD', '#C4B5FD', '#F9A8D4', '#FDE047', '#0F172A'];
const EMOJIS = ['💸', '🚀', '🔥', '✨', '🎉', '🧋', '💎'];

export const ConfettiBurst: React.FC<{ triggerKey: number }> = ({ triggerKey }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!triggerKey) return;

    const generated: Particle[] = Array.from({ length: 56 }, (_, i) => {
      const shapeRoll = i % 5;
      return {
        id: Date.now() + i,
        x: 20 + Math.random() * 60,
        y: 25 + Math.random() * 35,
        color: COLORS[i % COLORS.length],
        shape: shapeRoll === 0 ? 'emoji' : shapeRoll % 2 === 0 ? 'rect' : 'circle',
        emoji: EMOJIS[i % EMOJIS.length],
        angle: (Math.random() - 0.5) * 280,
        velocity: 120 + Math.random() * 240,
        rotation: (Math.random() - 0.5) * 720,
        size: 12 + Math.random() * 14,
      };
    });

    setParticles(generated);
    const timer = setTimeout(() => setParticles([]), 2200);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `translate(${p.angle}px, ${p.velocity}px) rotate(${p.rotation}deg)`,
            transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.8s ease-out',
          }}
          className="absolute animate-bounce"
        >
          {p.shape === 'emoji' ? (
            <span className="text-2xl emoji-3d select-none">{p.emoji}</span>
          ) : (
            <div
              style={{
                width: `${p.size}px`,
                height: p.shape === 'rect' ? `${p.size * 0.6}px` : `${p.size}px`,
                backgroundColor: p.color,
              }}
              className={`border-2 border-[#0F172A] ${p.shape === 'circle' ? 'rounded-full' : 'rounded-sm'} shadow-[2px_2px_0px_0px_#0F172A]`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
