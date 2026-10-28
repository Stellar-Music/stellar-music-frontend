import React, { useEffect, useRef } from 'react';

export interface WaveformVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  height?: number;
  width?: number;
  barWidth?: number;
  barGap?: number;
  accentColor?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isPlaying,
  barCount = 28,
  height = 32,
  width = 160,
  barWidth = 3,
  barGap = 2,
  accentColor = '#00f2fe',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;

    const render = () => {
      if (!active) return;

      ctx.clearRect(0, 0, width, height);

      // Create neon gradient
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, '#7928ca');
      gradient.addColorStop(0.5, accentColor);
      gradient.addColorStop(1, '#4facfe');

      ctx.fillStyle = gradient;

      phaseRef.current += isPlaying ? 0.12 : 0.02;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + barGap);
        if (x + barWidth > width) break;

        let barHeight: number;

        if (isPlaying) {
          // Dynamic harmonic wave calculation
          const harmonic1 = Math.sin(phaseRef.current + i * 0.35);
          const harmonic2 = Math.cos(phaseRef.current * 0.7 + i * 0.2);
          const normalized = (harmonic1 + harmonic2 + 2) / 4; // 0 to 1
          barHeight = Math.max(3, normalized * (height - 4));
        } else {
          // Resting pulse state
          const resting = Math.sin(phaseRef.current + i * 0.2) * 0.5 + 0.5;
          barHeight = Math.max(2, resting * 6);
        }

        const y = height - barHeight;
        const radius = barWidth / 2;

        // Draw rounded top bar
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, height);
        ctx.closePath();
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      active = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, barCount, height, width, barWidth, barGap, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        display: 'block',
        pointerEvents: 'none',
      }}
      aria-label={isPlaying ? 'Audio playing visualization' : 'Audio resting visualization'}
    />
  );
};
