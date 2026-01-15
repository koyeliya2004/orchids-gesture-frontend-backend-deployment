'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DetectedGesture, PerformanceMetrics } from '@/types/gesture';
import {
  saveGestureToHistory,
  updateAnalytics,
  createSessionId,
  saveSessionData,
  getSessionData,
} from '@/lib/storage';

export interface UseGestureTrackingReturn {
  recentGestures: DetectedGesture[];
  metrics: PerformanceMetrics;
  addGesture: (gesture: DetectedGesture) => void;
  updateMetrics: (fps: number, processingTime: number) => void;
  reset: () => void;
}

export function useGestureTracking(): UseGestureTrackingReturn {
  const [recentGestures, setRecentGestures] = useState<DetectedGesture[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    average_fps: 0,
    average_processing_time_ms: 0,
    frames_processed: 0,
    gestures_detected: 0,
  });

  const [fpsHistory, setFpsHistory] = useState<number[]>([]);
  const [processingTimeHistory, setProcessingTimeHistory] = useState<number[]>([]);
  const [sessionId] = useState(() => {
    if (typeof window === 'undefined') return '';
    const existingSession = getSessionData();
    if (existingSession) {
      return existingSession.sessionId;
    }
    const newSessionId = createSessionId();
    saveSessionData(newSessionId, Date.now());
    return newSessionId;
  });

  const addGesture = useCallback((gesture: DetectedGesture) => {
    setRecentGestures((prev) => {
      const updated = [gesture, ...prev];
      return updated.slice(0, 10);
    });

    setMetrics((prev) => ({
      ...prev,
      gestures_detected: prev.gestures_detected + 1,
    }));

    saveGestureToHistory({
      type: gesture.gesture_type,
      confidence: gesture.confidence,
      timestamp: Date.now(),
      sessionId,
    });

    updateAnalytics({
      type: gesture.gesture_type,
      confidence: gesture.confidence,
      timestamp: Date.now(),
      sessionId,
    });
  }, [sessionId]);

  const updateMetricsCallback = useCallback((fps: number, processingTime: number) => {
    setFpsHistory((prev) => {
      const updated = [...prev, fps];
      return updated.slice(-30);
    });

    setProcessingTimeHistory((prev) => {
      const updated = [...prev, processingTime];
      return updated.slice(-30);
    });

    setMetrics((prev) => ({
      ...prev,
      frames_processed: prev.frames_processed + 1,
    }));
  }, []);

  const reset = useCallback(() => {
    setRecentGestures([]);
    setFpsHistory([]);
    setProcessingTimeHistory([]);
    setMetrics({
      average_fps: 0,
      average_processing_time_ms: 0,
      frames_processed: 0,
      gestures_detected: 0,
    });
  }, []);

  useEffect(() => {
    if (fpsHistory.length > 0) {
      const avgFps = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
      const avgProcessingTime =
        processingTimeHistory.reduce((a, b) => a + b, 0) / processingTimeHistory.length;

      setMetrics((prev) => ({
        ...prev,
        average_fps: avgFps,
        average_processing_time_ms: avgProcessingTime,
      }));
    }
  }, [fpsHistory, processingTimeHistory]);

  return {
    recentGestures,
    metrics,
    addGesture,
    updateMetrics: updateMetricsCallback,
    reset,
  };
}
