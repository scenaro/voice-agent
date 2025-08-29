import { useLocalParticipant } from "@livekit/components-react";
import React, { useMemo } from "react";

import { DeviceSelector } from "./DeviceSelector";
import Button from "./ui/Button";
import { MicrophoneOffSVG, MicrophoneOnSVG } from "./ui/icons";


interface MicrophoneButtonProps {
  localMultibandVolume: number[][];
}

export function MicrophoneButton({ localMultibandVolume }: MicrophoneButtonProps) {
  const { localParticipant } = useLocalParticipant();
  const isMicrophoneEnabled = localParticipant.isMicrophoneEnabled;

  const toggleMicrophone = async () => {
    // localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    await handleToggleMicrophone(localParticipant, isMicrophoneEnabled);
  };

  const microphoneVolumeIndicator = useMemo(() => {
    if (!isMicrophoneEnabled || !localMultibandVolume.length) {
      return null;
    }

    // Calculate the average volume
    const avgVolume = localMultibandVolume.reduce((sum, band) => {
      const bandAvg = band.reduce((a, b) => a + b, 0) / band.length;
      return sum + bandAvg;
    }, 0) / localMultibandVolume.length;

    // Create simple volume bars
    const volumeBars = Array.from({ length: 3 }, (_, i) => {
      const threshold = (i + 1) / 3;
      const isActive = avgVolume > threshold;

      return (
        <div
          id="sc-microphone-button-volume-bar"
          key={i}
          className={
            isActive ? "bg-green-400" : "bg-gray-600"
          }
        />
      );
    });

    return (
      <div id="sc-microphone-volume-bars">
        {volumeBars}
      </div>
    );
  }, [isMicrophoneEnabled, localMultibandVolume]);

  // Memoize the DeviceSelector separately to avoid re-renders
  const deviceSelector = useMemo(() => {
    return <DeviceSelector kind="audioinput" />;
  }, []); // No dependencies = only re-render if the parent component forces it

  return (
    <div id="sc-microphone-button-content">
      <Button
        id="sc-microphone-btn"
        state={isMicrophoneEnabled ? "primary" : "secondary"}
        size="medium"
        onClick={toggleMicrophone}
      >
        {isMicrophoneEnabled ? <MicrophoneOnSVG /> : <MicrophoneOffSVG />}
        {microphoneVolumeIndicator}
      </Button>
      {deviceSelector}
    </div>
  );
}

// -----------------------------------------------------------------------------

const handleToggleMicrophone = async (localParticipant: any, isMicrophoneEnabled: boolean) => {
  try {
    await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
  } catch (err: any) {
    if (err && err.name === "NotAllowedError") {
      alert(
        "L'accès au micro est bloqué. Vérifiez les permissions depuis les paramètres du navigateur OU du système (Cherchez votre navigateur dans les paramètres puis : Permissions > Microphone). Rechargez la page après l'activation du micro."
      );
    } else {
      alert(
        "Erreur lors de l'activation du micro. Merci de vérifier vos permissions navigateur/système."
      );
    }

    console.error("LiveKit microphone error:", err);
  }
};
