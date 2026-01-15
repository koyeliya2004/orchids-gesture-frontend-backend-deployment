'use client';

import { useRef, useEffect } from 'react';
import type { HandLandmarks } from '@/types/gesture';

interface GestureCanvasProps {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  isCameraActive?: boolean;
  frameImage?: string | null;
  hands?: HandLandmarks[];
  backendStatus?: 'connecting' | 'ready' | 'error' | 'idle';
  backendError?: string | null;
  width?: number;
  height?: number;
}

export function GestureCanvas({
  videoRef,
  isCameraActive = false,
  frameImage,
  hands = [],
  backendStatus = 'idle',
  backendError = null,
  width = 640,
  height = 480,
}: GestureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef?.current;
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      if (isCameraActive && video && video.readyState >= 2) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-width, 0);
        ctx.drawImage(video, 0, 0, width, height);
        ctx.restore();
        
        if (hands && hands.length > 0) {
          drawLandmarks(ctx, hands, width, height);
        }
        
        if (backendStatus === 'connecting') {
          drawStatusOverlay(ctx, 'Connecting to backend...', 'info', width, height);
        } else if (backendStatus === 'error' && backendError) {
          drawStatusOverlay(ctx, `Backend: ${backendError}`, 'error', width, height);
        }
      } else if (frameImage) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          drawLandmarks(ctx, hands, width, height);
        };
        img.src = `data:image/jpeg;base64,${frameImage}`;
      } else {
        drawPlaceholder(ctx, width, height);
      }

      if (isCameraActive) {
        animationFrameRef.current = requestAnimationFrame(drawFrame);
      }
    };

    if (isCameraActive) {
      drawFrame();
    } else {
      drawFrame();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoRef, isCameraActive, frameImage, hands, backendStatus, backendError, width, height]);

  const drawPlaceholder = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 0, 255, 0.1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '24px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Click "Start Camera" to begin', w / 2, h / 2);
  };

  const drawStatusOverlay = (
    ctx: CanvasRenderingContext2D,
    message: string,
    type: 'info' | 'error',
    w: number,
    h: number
  ) => {
    ctx.fillStyle = type === 'error' ? 'rgba(255, 51, 102, 0.8)' : 'rgba(0, 240, 255, 0.8)';
    ctx.fillRect(0, h - 50, w, 50);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, w / 2, h - 25);
  };

  const drawLandmarks = (
    ctx: CanvasRenderingContext2D,
    handsData: HandLandmarks[],
    w: number,
    h: number
  ) => {
    handsData.forEach((hand) => {
      const color = hand.handedness === 'Left' ? '#00f0ff' : '#ff00ff';
      
      hand.landmarks.forEach((landmark, i) => {
        const x = landmark.x * w;
        const y = landmark.y * h;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        if ([0, 4, 8, 12, 16, 20].includes(i)) {
          ctx.fillStyle = 'white';
          ctx.font = '10px Inter, system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(i.toString(), x, y - 10);
        }
      });

      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [0, 5], [5, 6], [6, 7], [7, 8],
        [0, 9], [9, 10], [10, 11], [11, 12],
        [0, 13], [13, 14], [14, 15], [15, 16],
        [0, 17], [17, 18], [18, 19], [19, 20],
        [5, 9], [9, 13], [13, 17],
      ];

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      connections.forEach(([start, end]) => {
        const startLm = hand.landmarks[start];
        const endLm = hand.landmarks[end];
        
        ctx.beginPath();
        ctx.moveTo(startLm.x * w, startLm.y * h);
        ctx.lineTo(endLm.x * w, endLm.y * h);
        ctx.stroke();
      });

      const wrist = hand.landmarks[0];
      ctx.fillStyle = color;
      ctx.font = 'bold 16px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${hand.handedness} (${(hand.handedness_confidence * 100).toFixed(0)}%)`,
        wrist.x * w,
        wrist.y * h - 20
      );
    });
  };

  return (
    <div className="gesture-canvas-container">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="gesture-canvas"
      />
    </div>
  );
}
