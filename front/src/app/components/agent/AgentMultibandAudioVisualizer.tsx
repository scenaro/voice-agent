import React, { useEffect, useState } from "react";

import type { AgentMultibandAudioVisualizerProps } from ":types/index";

export default function AgentMultibandAudioVisualizer({
  state,
  barWidth,
  minBarHeight,
  maxBarHeight,
  frequencies,
  gap,
} : AgentMultibandAudioVisualizerProps) {
  const summedFrequencies = frequencies.map((bandFrequencies) => {
    const sum = (bandFrequencies as number[]).reduce((a, b) => a + b, 0);
    return Math.sqrt(sum / bandFrequencies.length);
  });

  const [thinkingIndex, setThinkingIndex] = useState(
    Math.floor(summedFrequencies.length / 2)
  );
  const [thinkingDirection, setThinkingDirection] = useState<"left" | "right">(
    "right"
  );

  useEffect(() => {
    if (state !== "thinking") {
      setThinkingIndex(Math.floor(summedFrequencies.length / 2));
      return;
    }

    const timeout = setTimeout(() => {
      if (thinkingDirection === "right") {
        if (thinkingIndex === summedFrequencies.length - 1) {
          setThinkingDirection("left");
          setThinkingIndex((prev) => prev - 1);
        } else {
          setThinkingIndex((prev) => prev + 1);
        }
      } else {
        if (thinkingIndex === 0) {
          setThinkingDirection("right");
          setThinkingIndex((prev) => prev + 1);
        } else {
          setThinkingIndex((prev) => prev - 1);
        }
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [state, summedFrequencies.length, thinkingDirection, thinkingIndex]);

  return (
    <div
      className={`${
        state === "disconnected" ? "opacity-10" : ""
      } flex flex-row items-center transition-opacity duration-300`}
      style={{
        gap: gap + "px",
      }}
    >
      {summedFrequencies.map((frequency, index) => {
        const isCenter = index === Math.floor(summedFrequencies.length / 2);
        const isThinking = state === "thinking" && index === thinkingIndex;

        let barHeight = minBarHeight + frequency * (maxBarHeight - minBarHeight);

        // thinking
        if (isThinking) {
          barHeight = Math.max(barHeight, minBarHeight + (maxBarHeight - minBarHeight) * 0.5);
        }

        return (
          <div
            className={`transition-all duration-250 ease-out bg-gray-500 ${
              isCenter && state === "listening" ? "animate-pulse" : ""
            } ${
              isThinking ? "bg-blue-400" : "bg-gray-500"
            }`}
            key={"frequency-" + index}
            style={{
              height: barHeight + "px",
              width: barWidth + "px",
            }}
          />
        );
      })}
    </div>
  );
};