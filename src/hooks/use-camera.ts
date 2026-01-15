'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface CameraOptions {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
  frameRate?: number;
}

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
  startCamera: (options?: CameraOptions) => Promise<void>;
  stopCamera: () => void;
  captureFrame: () => string | null;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async (options: CameraOptions = {}) => {
    const {
      width = 1280,
      height = 720,
      facingMode = 'user',
      frameRate = 30,
    } = options;

    try {
      setError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: facingMode,
          frameRate: { ideal: frameRate },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setStream(mediaStream);
      setIsActive(true);
      
      console.log('Camera started successfully');
    } catch (err) {
      let errorMessage = 'Failed to start camera';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera access denied. Please allow camera permissions in your browser.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found. Please connect a camera and try again.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera is in use by another application. Please close other apps and try again.';
        } else {
          errorMessage = `Camera error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      setIsActive(false);
      console.error('Camera error:', err);
      throw new Error(errorMessage);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setStream(null);
      setIsActive(false);
      console.log('Camera stopped');
    }
  }, [stream]);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !isActive) {
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return null;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frameData = canvas.toDataURL('image/jpeg', 0.8);
      return frameData;
    } catch (err) {
      console.error('Error capturing frame:', err);
      return null;
    }
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    stream,
    isActive,
    error,
    startCamera,
    stopCamera,
    captureFrame,
  };
}
