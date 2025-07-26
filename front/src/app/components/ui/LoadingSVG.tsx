import React from "react";

interface LoadingSVGProps {
  diameter?: number;
  strokeWidth?: number;
  className?: string;
}

export function LoadingSVG({
  diameter = 16,
  strokeWidth = 2,
  className = "",
}: LoadingSVGProps) {
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg
      width={diameter}
      height={diameter}
      viewBox={`0 0 ${diameter} ${diameter}`}
      className={`animate-spin ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={diameter / 2}
        cy={diameter / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeOpacity={0.25}
      />
      <circle
        cx={diameter / 2}
        cy={diameter / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.75}
        className="animate-spin"
      />
    </svg>
  );
}