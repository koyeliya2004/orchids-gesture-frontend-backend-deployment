'use client';

import { motion } from 'framer-motion';
import { Activity, Clock, Zap } from 'lucide-react';
import type { PerformanceMetrics } from '@/types/gesture';

interface PerformanceHUDProps {
  metrics: PerformanceMetrics;
  isLive?: boolean;
}

export function PerformanceHUD({
  metrics,
  isLive = false,
}: PerformanceHUDProps) {
  const getFPSColor = (fps: number) => {
    if (fps >= 25) return 'var(--color-accent)';
    if (fps >= 15) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <motion.div
      className="performance-hud glass-card"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isLive && (
        <div className="live-indicator">
          <motion.div
            className="live-dot"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <span>LIVE</span>
        </div>
      )}

      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-icon">
            <Zap size={16} />
          </div>
          <div className="metric-content">
            <div className="metric-label">FPS</div>
            <motion.div
              className="metric-value"
              style={{ color: getFPSColor(metrics.average_fps) }}
              key={metrics.average_fps}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {metrics.average_fps.toFixed(1)}
            </motion.div>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon">
            <Clock size={16} />
          </div>
          <div className="metric-content">
            <div className="metric-label">Latency</div>
            <div className="metric-value">
              {metrics.average_processing_time_ms.toFixed(1)}
              <span className="metric-unit">ms</span>
            </div>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon">
            <Activity size={16} />
          </div>
          <div className="metric-content">
            <div className="metric-label">Frames</div>
            <div className="metric-value">
              {metrics.frames_processed.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-icon">
            <span className="emoji-icon">✋</span>
          </div>
          <div className="metric-content">
            <div className="metric-label">Gestures</div>
            <motion.div
              className="metric-value"
              key={metrics.gestures_detected}
              initial={{ scale: 1.3, color: 'var(--color-accent)' }}
              animate={{ scale: 1, color: 'white' }}
              transition={{ duration: 0.3 }}
            >
              {metrics.gestures_detected}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
