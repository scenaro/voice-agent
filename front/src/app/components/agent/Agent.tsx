import type { ReceivedDataMessage } from '@livekit/components-core';
import {
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useTracks,
  useVoiceAssistant
} from "@livekit/components-react";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";
import { useEffect, useMemo } from "react";

import AgentAudioTrackBtn from ":app/components/agent/AgentAudioTrackBtn";
import useTool from ":app/hooks/useTool";
import { useMultibandTrackVolume } from ":app/hooks/useTrackVolume";
import { cn } from ":app/utils/cn";
import __ from ":app/utils/core";
import type { AgentProps } from ":types/index";
import { MicrophoneButton } from "../MicrophoneButton";
import Button from "../ui/Button";
import { LoadingSVG } from "../ui/LoadingSVG";
import SimpleAudioIndicator from "./SimpleAudioIndicator";

const headerHeight = 56;

export default function Agent({ title, logo, onConnect } : AgentProps) {
  const { localParticipant } = useLocalParticipant();

  const {
    agent: agentParticipant,
    state: agentState,
    audioTrack: agentAudioTrack,
  } = useVoiceAssistant();
  const isAgentConnected = agentParticipant !== undefined;

  const roomState = useConnectionState();
  const tracks = useTracks();


  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [localParticipant, roomState]);

  // Listen for data channel messages (tools)
  useDataChannel((msg: ReceivedDataMessage) => {
     const decoded = new TextDecoder("utf-8").decode(msg.payload);
     try {
      if (msg.topic?.startsWith("tool:")) {
        console.log("useDataChannel data - tool :", msg.topic, decoded);
        const data = JSON.parse(decoded);
        __.emit(msg.topic, data);
        console.log("useDataChannel data - tool :", msg.topic, data);
      }
    } catch {
      console.error("Error decoding data:", decoded);
    }
  });

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );
  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone
  );

  const localMultibandVolume = useMultibandTrackVolume(
    localMicTrack?.publication.track,
    9
  );

  const audioContent = useMemo(() => {
    const isLoading =
      roomState === ConnectionState.Connecting ||
      (!agentAudioTrack && roomState === ConnectionState.Connected);

      // conversation toolbar
    const convToolbar = (
      <div id="sc-agent-audio-track-toolbar">
        <div id="sc-agent-audio-track-toolbar-content">
          <Button
            state="destructive"
            size="medium"
            onClick={() => {
              onConnect(roomState === ConnectionState.Disconnected);
            }}
          >
            Disconnect
          </Button>
          <MicrophoneButton localMultibandVolume={localMultibandVolume} />
        </div>
      </div>
    );

    const startConvBtn = (
      <div id="sc-agent-audio-track-start">
        <div id="sc-agent-audio-track-start-content">
          <Button
            state="primary"
            size="large"
            className="sc-agent-audio-track-start-btn"
            onClick={() => {
              onConnect(roomState === ConnectionState.Disconnected);
            }}
          >
            <div
              className={`${isLoading ? "opacity-0" : "opacity-100"}`}
            >
              Start a conversation
            </div>
            <div
              className={cn(
                'track-start-btn-loader',
                isLoading ? "opacity-100" : "opacity-0"
              )}
            >
              {isLoading && <LoadingSVG diameter={24} strokeWidth={4} />}
            </div>
          </Button>
        </div>
      </div>
    );

    const visualizerContent = (
      <div id="sc-agent-visualizer">
        <div id="sc-agent-audio-visualizer">
          <SimpleAudioIndicator state={agentState} />
        </div>
        <div id="sc-agent-audio-track">
          {!agentAudioTrack && (
            <AgentAudioTrackBtn>
              {startConvBtn}
            </AgentAudioTrackBtn>
          )}
          {agentAudioTrack && (
            <AgentAudioTrackBtn>
              {convToolbar}
            </AgentAudioTrackBtn>
          )}
        </div>
      </div>
    );

    return visualizerContent;
  }, [
    localMultibandVolume,
    roomState,
    agentAudioTrack,
    onConnect,
    agentState,
  ]);

  return (
    <>
      <div
        id="sc-agent"
        style={{ height: `calc(100% - ${headerHeight}px)` }}
      >
        <div id="sc-agent-content">
          {audioContent}
        </div>
      </div>
    </>
  );
};