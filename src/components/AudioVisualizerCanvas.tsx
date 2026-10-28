import React, { useEffect, useRef } from 'react';

export interface AudioVisualizerCanvasProps {
  isPlaying: boolean;
  barCount?: number;
  height?: number;
  width?: number;
  className?: string;
}

export const AudioVisualizerCanvas: React.FC<AudioVisualizerCanvasProps> = ({
  isPlaying,
  barCount = 24,
  height = 40,
  width = 160,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const barWidth = width / barCount - 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);

        // Calculate dynamic bar height
        let barHeight = 4;
        if (isPlaying) {
          // Organic simulated Fourier waveform using harmonic sines
          const t = Date.now() / 250;
          const factor = (Math.sin(t + i * 0.4) + Math.cos(t * 1.5 + i * 0.7) + 2) / 4;
          barHeight = Math.max(4, factor * (height - 4));
        }

        const y = height - barHeight;

        // Gradient from cyan (#00f2fe) to violet (#7928ca)
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#00f2fe');
        gradient.addColorStop(1, '#9333ea');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, barCount, height, width]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      aria-label="Audio Frequency Spectrum Visualizer"
      role="img"
      className={`rounded ${className}`}
    />
  );
};
