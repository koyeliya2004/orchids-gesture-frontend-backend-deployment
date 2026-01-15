'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Camera, CameraOff, RefreshCw, Hand, Activity, Zap, Clock, 
  Upload, Video, BarChart3, LogOut, X, Play, Pause, Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type GestureType = 'open_palm' | 'fist' | 'pointing' | 'peace' | 'thumbs_up' | 'thumbs_down' | 'pinch' | 'ok_sign' | 'unknown';
type InputMode = 'camera' | 'video';

interface DetectedGesture {
  type: GestureType;
  confidence: number;
  hand: string;
  timestamp: number;
}

interface LandmarkPoint {
  x: number;
  y: number;
  z: number;
}

interface HandData {
  landmarks: LandmarkPoint[];
  handedness: string;
}

const gestureEmojis: Record<GestureType, string> = {
  unknown: '❓', open_palm: '✋', fist: '✊', pinch: '🤏',
  pointing: '👉', thumbs_up: '👍', thumbs_down: '👎', peace: '✌️', ok_sign: '👌',
};

const gestureNames: Record<GestureType, string> = {
  unknown: 'Unknown', open_palm: 'Open Palm', fist: 'Fist', pinch: 'Pinch',
  pointing: 'Pointing', thumbs_up: 'Thumbs Up', thumbs_down: 'Thumbs Down', peace: 'Peace', ok_sign: 'OK Sign',
};

const STABILITY_THRESHOLD = 5;
const NO_HAND_THRESHOLD = 8;

function distance(p1: LandmarkPoint, p2: LandmarkPoint): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
}

function isFingerExtended(landmarks: LandmarkPoint[], tip: number, pip: number, wrist: number): boolean {
  return distance(landmarks[tip], landmarks[wrist]) > distance(landmarks[pip], landmarks[wrist]) * 1.1;
}

function classifyGesture(landmarks: LandmarkPoint[]): { type: GestureType; confidence: number } {
  if (landmarks.length < 21) return { type: 'unknown', confidence: 0 };
  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const indexTip = landmarks[8];
  const middleMcp = landmarks[9];
  const indexMcp = landmarks[5];
  const handSize = distance(wrist, middleMcp);
  const thumbExt = distance(thumbTip, indexMcp) > distance(landmarks[2], indexMcp) * 0.8;
  const indexExt = isFingerExtended(landmarks, 8, 6, 0);
  const middleExt = isFingerExtended(landmarks, 12, 10, 0);
  const ringExt = isFingerExtended(landmarks, 16, 14, 0);
  const pinkyExt = isFingerExtended(landmarks, 20, 18, 0);
  const extCount = [thumbExt, indexExt, middleExt, ringExt, pinkyExt].filter(Boolean).length;
  const pinchDist = distance(thumbTip, indexTip);

  if (pinchDist < handSize * 0.25 && !middleExt && !ringExt && !pinkyExt) return { type: 'pinch', confidence: 0.85 };
  if (thumbExt && !indexExt && !middleExt && !ringExt && !pinkyExt)
    return thumbTip.y < wrist.y ? { type: 'thumbs_up', confidence: 0.88 } : { type: 'thumbs_down', confidence: 0.88 };
  if (indexExt && middleExt && !ringExt && !pinkyExt) return { type: 'peace', confidence: 0.85 };
  if (indexExt && !middleExt && !ringExt && !pinkyExt) return { type: 'pointing', confidence: 0.9 };
  if (extCount >= 4) return { type: 'open_palm', confidence: 0.9 };
  if (extCount <= 1 && !thumbExt) return { type: 'fist', confidence: 0.88 };
  if (pinchDist < handSize * 0.3 && middleExt && ringExt) return { type: 'ok_sign', confidence: 0.82 };
  return { type: 'unknown', confidence: 0.5 };
}

export default function DetectPage() {
  const [inputMode, setInputMode] = useState<InputMode>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [detectorReady, setDetectorReady] = useState(false);
  const [hands, setHands] = useState<HandData[]>([]);
  const [currentGesture, setCurrentGesture] = useState<DetectedGesture | null>(null);
  const [recentGestures, setRecentGestures] = useState<DetectedGesture[]>([]);
  const [fps, setFps] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [framesProcessed, setFramesProcessed] = useState(0);
  const [gesturesDetected, setGesturesDetected] = useState(0);
  const [user, setUser] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const uploadedVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handsRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const gestureBufferRef = useRef<GestureType[]>([]);
  const stableGestureRef = useRef<GestureType | null>(null);
  const noHandCountRef = useRef<number>(0);
  const processingRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const video = inputMode === 'camera' ? videoRef.current : uploadedVideoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (video.readyState >= 2) {
      ctx.save();
      if (inputMode === 'camera') {
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      hands.forEach((hand) => {
        const color = hand.handedness === 'Left' ? '#06b6d4' : '#a855f7';
        hand.landmarks.forEach((lm) => {
          const x = inputMode === 'camera' ? (1 - lm.x) * canvas.width : lm.x * canvas.width;
          const y = lm.y * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        const connections = [
          [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[0,9],[9,10],[10,11],[11,12],
          [0,13],[13,14],[14,15],[15,16],[0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17]
        ];
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        connections.forEach(([s, e]) => {
          const start = hand.landmarks[s];
          const end = hand.landmarks[e];
          const sx = inputMode === 'camera' ? (1 - start.x) * canvas.width : start.x * canvas.width;
          const ex = inputMode === 'camera' ? (1 - end.x) * canvas.width : end.x * canvas.width;
          ctx.beginPath();
          ctx.moveTo(sx, start.y * canvas.height);
          ctx.lineTo(ex, end.y * canvas.height);
          ctx.stroke();
        });
        ctx.shadowBlur = 0;
      });
    } else {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0.05)');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.font = '18px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(inputMode === 'camera' ? 'Click "Start Camera" to begin' : 'Upload a video to analyze', canvas.width / 2, canvas.height / 2);
    }

    if (cameraActive || videoActive) {
      animationRef.current = requestAnimationFrame(drawCanvas);
    }
  }, [cameraActive, videoActive, hands, inputMode]);

  useEffect(() => {
    if (cameraActive || videoActive) drawCanvas();
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [cameraActive, videoActive, drawCanvas]);

  const initializeHands = async () => {
    if (handsRef.current) return handsRef.current;
    const { Hands } = await import('@mediapipe/hands');
    const mpHands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    mpHands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });

    mpHands.onResults((results: any) => {
      const startTime = performance.now();
      const newHands: HandData[] = [];
      if (results.multiHandLandmarks?.length > 0) {
        noHandCountRef.current = 0;
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
          const landmarks = results.multiHandLandmarks[i].map((lm: any) => ({ x: lm.x, y: lm.y, z: lm.z || 0 }));
          newHands.push({ landmarks, handedness: results.multiHandedness[i].label });
          const gesture = classifyGesture(landmarks);
          if (gesture.type !== 'unknown') {
            gestureBufferRef.current.push(gesture.type);
            if (gestureBufferRef.current.length > 10) gestureBufferRef.current.shift();
            const counts: Record<string, number> = {};
            gestureBufferRef.current.forEach(g => { counts[g] = (counts[g] || 0) + 1; });
            let mostCommon: GestureType = gesture.type;
            let maxCount = 0;
            for (const [g, count] of Object.entries(counts)) {
              if (count > maxCount) { maxCount = count; mostCommon = g as GestureType; }
            }
            if (maxCount >= STABILITY_THRESHOLD) {
              const detected: DetectedGesture = {
                type: mostCommon,
                confidence: Math.min(0.95, gesture.confidence + (maxCount / 10) * 0.1),
                hand: results.multiHandedness[i].label,
                timestamp: Date.now()
              };
              setCurrentGesture(detected);
              if (mostCommon !== stableGestureRef.current) {
                stableGestureRef.current = mostCommon;
                setRecentGestures(prev => [detected, ...prev].slice(0, 10));
                setGesturesDetected(prev => prev + 1);
              }
            }
          }
        }
      } else {
        noHandCountRef.current++;
        if (noHandCountRef.current >= NO_HAND_THRESHOLD) {
          setCurrentGesture(null);
          stableGestureRef.current = null;
          gestureBufferRef.current = [];
        }
      }
      setHands(newHands);
      const now = Date.now();
      const elapsed = now - lastTimeRef.current;
      if (elapsed > 0) setFps(1000 / elapsed);
      lastTimeRef.current = now;
      setProcessingTime(performance.now() - startTime);
      setFramesProcessed(prev => prev + 1);
    });

    await mpHands.initialize();
    handsRef.current = mpHands;
    setDetectorReady(true);
    return mpHands;
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      const mpHands = await initializeHands();
      const processFrame = async () => {
        if (videoRef.current && mpHands && videoRef.current.readyState >= 2 && !processingRef.current) {
          processingRef.current = true;
          await mpHands.send({ image: videoRef.current });
          processingRef.current = false;
        }
        if (streamRef.current) setTimeout(processFrame, 50);
      };
      processFrame();
    } catch (err) { console.error('Camera error:', err); }
  };

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setCameraActive(false);
    setHands([]);
    setCurrentGesture(null);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedVideo(url);
      setInputMode('video');
    }
  };

  const videoActiveRef = useRef<boolean>(false);
  
  const startVideoAnalysis = async () => {
    if (!uploadedVideoRef.current || !uploadedVideo) return;
    setVideoActive(true);
    videoActiveRef.current = true;
    setVideoPlaying(true);
    uploadedVideoRef.current.play();
    const mpHands = await initializeHands();
    const processFrame = async () => {
      if (uploadedVideoRef.current && mpHands && uploadedVideoRef.current.readyState >= 2 && !processingRef.current && !uploadedVideoRef.current.paused) {
        processingRef.current = true;
        await mpHands.send({ image: uploadedVideoRef.current });
        processingRef.current = false;
      }
      if (videoActiveRef.current && uploadedVideoRef.current && !uploadedVideoRef.current.ended) {
        setTimeout(processFrame, 50);
      }
    };
    processFrame();
  };

  const toggleVideoPlayback = () => {
    if (!uploadedVideoRef.current) return;
    if (uploadedVideoRef.current.paused) {
      uploadedVideoRef.current.play();
      setVideoPlaying(true);
    } else {
      uploadedVideoRef.current.pause();
      setVideoPlaying(false);
    }
  };

  const removeVideo = () => {
    if (uploadedVideo) URL.revokeObjectURL(uploadedVideo);
    setUploadedVideo(null);
    setVideoActive(false);
    videoActiveRef.current = false;
    setVideoPlaying(false);
    setInputMode('camera');
  };

  const resetStats = () => {
    setRecentGestures([]);
    setGesturesDetected(0);
    setFramesProcessed(0);
    setCurrentGesture(null);
    stableGestureRef.current = null;
    gestureBufferRef.current = [];
    noHandCountRef.current = 0;
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.06)_0%,transparent_60%)]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05)_0%,transparent_60%)]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.05)_0%,transparent_60%)]" />
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <video ref={videoRef} className="hidden" playsInline autoPlay muted />
      <video ref={uploadedVideoRef} src={uploadedVideo || undefined} className="hidden" playsInline onEnded={() => setVideoPlaying(false)} />
      <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleVideoUpload} />

      <aside className="relative z-20 w-80 border-r border-white/[0.06] bg-[#050508]/80 backdrop-blur-2xl p-6 flex flex-col">
        <Link href="/" className="flex items-center gap-4 mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl blur-lg opacity-40" />
            <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl flex items-center justify-center shadow-xl">
              <Hand className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-2xl font-bold tracking-tight">Phantome</span>
        </Link>

        <div className="space-y-4 flex-1">
          <motion.button
            onClick={inputMode === 'camera' ? (cameraActive ? stopCamera : startCamera) : (videoActive ? toggleVideoPlayback : startVideoAnalysis)}
            className="group relative w-full py-4 rounded-xl font-semibold overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`absolute inset-0 ${(cameraActive || videoActive) ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gradient-to-r from-cyan-500 to-violet-500'}`} />
            <span className="relative flex items-center justify-center gap-2">
              {inputMode === 'camera' ? (
                cameraActive ? <><CameraOff size={20} /> Stop Camera</> : <><Camera size={20} /> Start Camera</>
              ) : (
                videoActive ? (videoPlaying ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Resume</>) : <><Play size={20} /> Analyze Video</>
              )}
            </span>
          </motion.button>

          <button onClick={resetStats} className="w-full py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
            <RefreshCw size={18} /> Reset Tracking
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
            <Upload size={18} /> Upload Video
          </button>

          {uploadedVideo && (
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-cyan-400 font-medium flex items-center gap-2"><Video size={16} /> Video loaded</span>
                <button onClick={removeVideo} className="text-white/50 hover:text-rose-400 transition"><X size={16} /></button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setInputMode('video')} className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${inputMode === 'video' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1]'}`}>Video</button>
                <button onClick={() => setInputMode('camera')} className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${inputMode === 'camera' ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1]'}`}>Camera</button>
              </div>
            </div>
          )}

          <button className="w-full py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
            <BarChart3 size={18} /> Analytics
          </button>
        </div>

        <div className="pt-6 border-t border-white/[0.06] space-y-4">
          <div className={`py-3 px-4 rounded-xl text-sm font-medium flex items-center gap-3 ${detectorReady ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/[0.03] border border-white/[0.08] text-white/50'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${detectorReady ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
            {detectorReady ? 'AI Model Ready' : 'Loading AI...'}
          </div>
          {user && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-white/40 truncate">{user.email}</span>
              <button onClick={handleLogout} className="text-white/40 hover:text-rose-400 transition" title="Logout"><LogOut size={18} /></button>
            </div>
          )}
        </div>
      </aside>

      <main className="relative z-10 flex-1 p-8 flex flex-col lg:flex-row gap-8">
        <section className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-[800px] aspect-[4/3]">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-violet-500/10 to-fuchsia-500/20 rounded-3xl blur-2xl opacity-30" />
            <div className="relative h-full bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
              <canvas ref={canvasRef} width={640} height={480} className="w-full h-full object-contain" />
              {(cameraActive || videoActive) && (
                <div className="absolute top-5 left-5 flex items-center gap-2 px-4 py-2 bg-rose-500/20 backdrop-blur-xl border border-rose-500/30 rounded-full text-sm text-rose-400 font-semibold">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" /> {inputMode === 'camera' ? 'LIVE' : 'VIDEO'}
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="w-full lg:w-96 space-y-6">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-violet-600/10" />
            <div className="absolute inset-[1px] bg-[#0a0a0f]/90 rounded-[15px]" />
            <div className="relative p-6">
              <h3 className="text-cyan-400 font-semibold mb-5 flex items-center gap-2"><Sparkles size={18} /> Current Gesture</h3>
              <AnimatePresence mode="wait">
                {currentGesture ? (
                  <motion.div key={currentGesture.type} className="text-center py-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <motion.div className="text-7xl mb-4" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>{gestureEmojis[currentGesture.type]}</motion.div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">{gestureNames[currentGesture.type]}</h2>
                    <p className="text-white/40 text-sm mt-2">{currentGesture.hand} Hand • {(currentGesture.confidence * 100).toFixed(0)}% confidence</p>
                  </motion.div>
                ) : (
                  <motion.div className="text-center py-10 text-white/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Hand size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No gesture detected</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10" />
            <div className="absolute inset-[1px] bg-[#0a0a0f]/90 rounded-[15px]" />
            <div className="relative p-6">
              <h3 className="text-violet-400 font-semibold mb-4 flex items-center gap-2"><Zap size={18} /> Performance</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'FPS', value: fps.toFixed(1), icon: <Zap size={14} />, gradient: 'from-cyan-400 to-cyan-600' },
                  { label: 'Latency', value: `${processingTime.toFixed(0)}ms`, icon: <Clock size={14} />, gradient: 'from-violet-400 to-violet-600' },
                  { label: 'Frames', value: framesProcessed, icon: <Activity size={14} />, gradient: 'from-emerald-400 to-emerald-600' },
                  { label: 'Gestures', value: gesturesDetected, icon: <Hand size={14} />, gradient: 'from-amber-400 to-amber-600' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                    <div className={`text-xs flex items-center gap-1.5 mb-2 bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent font-medium`}>{s.icon} {s.label}</div>
                    <div className="text-2xl font-bold font-mono">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl max-h-[280px] flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10" />
            <div className="absolute inset-[1px] bg-[#0a0a0f]/90 rounded-[15px]" />
            <div className="relative p-6 flex flex-col flex-1 overflow-hidden">
              <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2"><Activity size={18} /> History</h3>
              <div className="flex-1 overflow-y-auto space-y-2">
                <AnimatePresence>
                  {recentGestures.map((g, i) => (
                    <motion.div key={`${g.timestamp}-${i}`} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                      <span className="text-2xl">{gestureEmojis[g.type]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{gestureNames[g.type]}</div>
                        <div className="text-xs text-white/40">{g.hand} • {(g.confidence * 100).toFixed(0)}%</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {recentGestures.length === 0 && <div className="text-center text-white/30 py-8 text-sm">No history yet</div>}
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
