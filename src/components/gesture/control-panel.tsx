'use client';

import { motion } from 'framer-motion';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Settings,
  Upload,
  BarChart3,
  Wifi,
  WifiOff,
  Loader,
} from 'lucide-react';
import { WebSocketState } from '@/types/gesture';

interface ControlPanelProps {
  isCameraActive: boolean;
  isConnected: boolean;
  connectionState?: WebSocketState;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onReset: () => void;
  onUploadClick: () => void;
  onAnalyticsClick?: () => void;
}

export function ControlPanel({
  isCameraActive,
  isConnected,
  connectionState = WebSocketState.DISCONNECTED,
  onStartCamera,
  onStopCamera,
  onReset,
  onUploadClick,
  onAnalyticsClick,
}: ControlPanelProps) {
  const getConnectionStatus = () => {
    switch (connectionState) {
      case WebSocketState.CONNECTING:
        return {
          text: 'Connecting to backend...',
          icon: <Loader size={16} className="animate-spin" />,
          className: 'connecting',
        };
      case WebSocketState.CONNECTED:
        return {
          text: 'Connected - Waiting for ready signal',
          icon: <Loader size={16} className="animate-spin" />,
          className: 'connecting',
        };
      case WebSocketState.READY:
        return {
          text: 'Backend Ready',
          icon: <Wifi size={16} />,
          className: 'connected',
        };
      case WebSocketState.ERROR:
        return {
          text: 'Backend Error - Camera works locally',
          icon: <WifiOff size={16} />,
          className: 'error',
        };
      case WebSocketState.DISCONNECTED:
      default:
        return {
          text: 'Backend Disconnected',
          icon: <WifiOff size={16} />,
          className: 'disconnected',
        };
    }
  };

  const status = getConnectionStatus();

  return (
    <motion.div
      className="control-panel glass-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="control-panel-header">
        <Settings size={20} />
        <h3>Controls</h3>
      </div>

      <div className="control-buttons">
        {!isCameraActive ? (
          <motion.button
            className="control-btn btn-primary"
            onClick={onStartCamera}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Camera size={20} />
            <span>Start Camera</span>
          </motion.button>
        ) : (
          <motion.button
            className="control-btn btn-danger"
            onClick={onStopCamera}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CameraOff size={20} />
            <span>Stop Camera</span>
          </motion.button>
        )}

        <motion.button
          className="control-btn"
          onClick={onReset}
          disabled={!isConnected}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw size={20} />
          <span>Reset Tracking</span>
        </motion.button>

        <motion.button
          className="control-btn"
          onClick={onUploadClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload size={20} />
          <span>Upload Video</span>
        </motion.button>

        {onAnalyticsClick && (
          <motion.button
            className="control-btn"
            onClick={onAnalyticsClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </motion.button>
        )}
      </div>

      <div className="connection-status">
        <div className={`status-indicator ${status.className}`}>
          <motion.div
            className="status-icon"
            animate={connectionState === WebSocketState.CONNECTING || connectionState === WebSocketState.CONNECTED ? {
              rotate: 360,
            } : {}}
            transition={{
              duration: 1,
              repeat: connectionState === WebSocketState.CONNECTING || connectionState === WebSocketState.CONNECTED ? Infinity : 0,
              ease: "linear",
            }}
          >
            {status.icon}
          </motion.div>
          <div className="status-text">
            <span className="status-label">{status.text}</span>
            {connectionState === WebSocketState.ERROR && (
              <span className="status-hint">Local preview still works</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
