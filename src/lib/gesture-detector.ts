'use client';

import type { HandLandmarks, DetectedGesture, LandmarkPoint } from '@/types/gesture';
import { GestureType } from '@/types/gesture';

export interface GestureDetectorResult {
  hands: HandLandmarks[];
  gestures: DetectedGesture[];
  processingTimeMs: number;
}

function distance(p1: LandmarkPoint, p2: LandmarkPoint): number {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + 
    Math.pow(p1.y - p2.y, 2) + 
    Math.pow(p1.z - p2.z, 2)
  );
}

function isFingerExtended(landmarks: LandmarkPoint[], fingerTip: number, fingerPip: number, wrist: number): boolean {
  const tipToWrist = distance(landmarks[fingerTip], landmarks[wrist]);
  const pipToWrist = distance(landmarks[fingerPip], landmarks[wrist]);
  return tipToWrist > pipToWrist * 1.1;
}

function isThumbExtended(landmarks: LandmarkPoint[]): boolean {
  const thumbTip = landmarks[4];
  const thumbIp = landmarks[3];
  const thumbMcp = landmarks[2];
  const indexMcp = landmarks[5];
  
  const tipToIndex = distance(thumbTip, indexMcp);
  const mcpToIndex = distance(thumbMcp, indexMcp);
  
  return tipToIndex > mcpToIndex * 0.8;
}

export function classifyGesture(landmarks: LandmarkPoint[]): { type: GestureType; confidence: number } {
  if (landmarks.length < 21) {
    return { type: GestureType.UNKNOWN, confidence: 0 };
  }

  const thumbExtended = isThumbExtended(landmarks);
  const indexExtended = isFingerExtended(landmarks, 8, 6, 0);
  const middleExtended = isFingerExtended(landmarks, 12, 10, 0);
  const ringExtended = isFingerExtended(landmarks, 16, 14, 0);
  const pinkyExtended = isFingerExtended(landmarks, 20, 18, 0);

  const extendedCount = [thumbExtended, indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const pinchDistance = distance(thumbTip, indexTip);
  
  const wrist = landmarks[0];
  const middleMcp = landmarks[9];
  const handSize = distance(wrist, middleMcp);

  if (pinchDistance < handSize * 0.25 && !middleExtended && !ringExtended && !pinkyExtended) {
    return { type: GestureType.PINCH, confidence: 0.85 };
  }

  if (thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const thumbTipY = thumbTip.y;
    const indexMcpY = landmarks[5].y;
    
    if (thumbTipY < indexMcpY - 0.05) {
      return { type: GestureType.THUMBS_UP, confidence: 0.9 };
    } else if (thumbTipY > indexMcpY + 0.05) {
      return { type: GestureType.THUMBS_DOWN, confidence: 0.9 };
    }
  }

  if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    const thumbTipY = thumbTip.y;
    const wristY = wrist.y;
    
    if (thumbTipY < wristY) {
      return { type: GestureType.THUMBS_UP, confidence: 0.85 };
    } else {
      return { type: GestureType.THUMBS_DOWN, confidence: 0.85 };
    }
  }

  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    const indexMiddleDistance = distance(indexTip, landmarks[12]);
    if (indexMiddleDistance < handSize * 0.3) {
      return { type: GestureType.PEACE, confidence: 0.88 };
    }
    return { type: GestureType.PEACE, confidence: 0.82 };
  }

  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return { type: GestureType.POINTING, confidence: 0.9 };
  }

  if (thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
    return { type: GestureType.OPEN_PALM, confidence: 0.92 };
  }

  if (extendedCount >= 4) {
    return { type: GestureType.OPEN_PALM, confidence: 0.85 };
  }

  if (extendedCount <= 1 && !thumbExtended) {
    return { type: GestureType.FIST, confidence: 0.88 };
  }

  const thumbToIndex = distance(thumbTip, indexTip);
  const indexToMiddle = distance(indexTip, landmarks[12]);
  if (thumbToIndex < handSize * 0.3 && indexExtended && middleExtended && ringExtended) {
    return { type: GestureType.OK_SIGN, confidence: 0.85 };
  }

  return { type: GestureType.UNKNOWN, confidence: 0.5 };
}

export class ClientGestureDetector {
  private hands: any = null;
  private isInitialized = false;
  private isProcessing = false;
  private onResultsCallback: ((results: GestureDetectorResult) => void) | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const { Hands } = await import('@mediapipe/hands');
      
      this.hands = new Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      this.hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.hands.onResults((results: any) => {
        this.processResults(results);
      });

      await this.hands.initialize();
      this.isInitialized = true;
      console.log('MediaPipe Hands initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MediaPipe Hands:', error);
      throw error;
    }
  }

  private processResults(results: any): void {
    const startTime = performance.now();
    const hands: HandLandmarks[] = [];
    const gestures: DetectedGesture[] = [];

    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const landmarks = results.multiHandLandmarks[i];
        const handedness = results.multiHandedness[i];

        const landmarkPoints: LandmarkPoint[] = landmarks.map((lm: any) => ({
          x: lm.x,
          y: lm.y,
          z: lm.z || 0
        }));

        hands.push({
          landmarks: landmarkPoints,
          handedness: handedness.label,
          handedness_confidence: handedness.score
        });

        const gestureResult = classifyGesture(landmarkPoints);
        
        if (gestureResult.type !== GestureType.UNKNOWN) {
          gestures.push({
            gesture_type: gestureResult.type,
            confidence: gestureResult.confidence,
            hand: handedness.label,
            timestamp: Date.now() / 1000
          });
        }
      }
    }

    const processingTimeMs = performance.now() - startTime;

    if (this.onResultsCallback) {
      this.onResultsCallback({
        hands,
        gestures,
        processingTimeMs
      });
    }

    this.isProcessing = false;
  }

  async processFrame(videoElement: HTMLVideoElement): Promise<void> {
    if (!this.isInitialized || this.isProcessing) return;
    
    if (videoElement.readyState < 2) return;

    this.isProcessing = true;
    
    try {
      await this.hands.send({ image: videoElement });
    } catch (error) {
      console.error('Error processing frame:', error);
      this.isProcessing = false;
    }
  }

  onResults(callback: (results: GestureDetectorResult) => void): void {
    this.onResultsCallback = callback;
  }

  dispose(): void {
    if (this.hands) {
      this.hands.close();
      this.hands = null;
    }
    this.isInitialized = false;
    this.onResultsCallback = null;
  }
}
