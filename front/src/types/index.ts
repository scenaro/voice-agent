export interface Voice {
  id: string;
  user_id: string | null;
  is_public: boolean;
  name: string;
  description: string;
  created_at: Date;
  embedding: number[];
}

export interface AgentProps {
  title?: string;
  logo?: React.ReactNode;
  onConnect: (connect: boolean, opts?: { token: string; url: string }) => void;
}

export interface ButtonProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  state?: "primary" | "secondary" | "destructive";
  size?: "small" | "medium" | "large";
  onClick?: () => void;
}

export interface AgentMultibandAudioVisualizerProps {
  state: any; // LiveKit AgentState
  barWidth: number;
  minBarHeight: number;
  maxBarHeight: number;
  frequencies: Float32Array[] | number[][];
  gap: number;
}

export interface ConnectionContextType {
  shouldConnect: boolean;
  wsUrl?: string;
  token?: string;
  disconnect: () => Promise<void>;
  connect: () => Promise<void>;
}