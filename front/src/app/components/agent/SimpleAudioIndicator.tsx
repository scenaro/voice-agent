import type { AgentState } from "@livekit/components-react";

interface SimpleAudioIndicatorProps {
  state: AgentState;
}

export default function SimpleAudioIndicator({ state }: SimpleAudioIndicatorProps) {
  const getAnimationClass = () => {
    switch (state) {
      case "listening":
        return "animate-pulse-slow";
      case "thinking":
        return "animate-pulse-fast";
      case "speaking":
        return "animate-pulse-medium";
      case "connecting":
      case "initializing":
        return "animate-pulse-medium";
      default:
        return "";
    }
  };

  const getOpacity = () => {
    return state === "disconnected" ? "opacity-30" : "opacity-70";
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center w-16 h-16">
        <div
          className={`
          w-4 h-4 rounded-full bg-gray-400
          ${getOpacity()}
          ${getAnimationClass()}
          transition-opacity duration-300
          `}
        />
      </div>
      <div className="flex items-center text-sm text-gray-400">
        {state}
      </div>
    </div>
  );
}