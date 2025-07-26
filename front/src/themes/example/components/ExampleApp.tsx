import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";
import { useCallback, useState } from "react";

import Agent from ":app/components/agent/Agent";
import { ConnectionProvider, useConnection } from ":app/hooks/useConnection";

import Toaster, { type ToastMessage } from ":app/components/ui/Toaster";
import "../assets/css/style.css";
import ToolContent from "./ToolContent";

function ExampleAppContent({ children } : { children: React.ReactNode }) {
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const { shouldConnect, wsUrl, token, connect, disconnect } = useConnection();

  const title = "Voice Agent";

  const handleConnect = useCallback(
    async (c: boolean) => {
      try {
        c ? await connect() : await disconnect();
      } catch (error) {
        setToastMessage({
          message: error instanceof Error ? error.message : "Connection failed",
          type: "error",
        });
      }
    },
    [connect, disconnect]
  );

  return (
    <div id="sc-container">
      {toastMessage && (
        <Toaster
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
        />
      )}

      <main id="sc-main">
        <LiveKitRoom
          id="sc-room"
          serverUrl={wsUrl}
          token={token}
          connect={shouldConnect}
          onError={(e) => {
            setToastMessage({ message: e.message, type: "error" });
            console.error(e);
          }}
        >
          <Agent
            title={title}
            onConnect={handleConnect}
          />
          <RoomAudioRenderer />
          <StartAudio label="Click to enable audio playback" />
          {children}
        </LiveKitRoom>
      </main>
    </div>
  );
}

function ExampleApp(){
  return (
    <ConnectionProvider>
      <ExampleAppContent>
        <ToolContent />
      </ExampleAppContent>
    </ConnectionProvider>
  );
};

export default ExampleApp;