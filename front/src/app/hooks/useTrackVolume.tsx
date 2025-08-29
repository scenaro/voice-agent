import { Track } from "livekit-client";
import { useEffect, useState } from "react";

export const useMultibandTrackVolume = (
  track: Track | undefined,
  bands: number
): number[][] => {
  const [volumes, setVolumes] = useState<number[][]>(() =>
    Array.from({ length: bands }, () => [0.0])
  );

  useEffect(() => {
    if (!track) {
      setVolumes(Array.from({ length: bands }, () => [0.0]));
      return;
    }

    let intervalId: NodeJS.Timeout;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let mediaStream: MediaStream | null = null;

    const setupAudioAnalysis = async () => {
      try {
        // Create audio context
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();

        // Analyser configuration
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        // Get the MediaStream from the track
        mediaStream = new MediaStream([track.mediaStreamTrack]);
        const source = audioContext.createMediaStreamSource(mediaStream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Calculate the size of each band
        const bandSize = Math.floor(bufferLength / bands);

        const updateVolume = () => {
          if (!analyser) return;

          analyser.getByteFrequencyData(dataArray);

          const newVolumes: number[][] = [];

          for (let i = 0; i < bands; i++) {
            const start = i * bandSize;
            const end = Math.min(start + bandSize, bufferLength);

            let sum = 0;
            for (let j = start; j < end; j++) {
              sum += dataArray[j];
            }

            const average = sum / (end - start);
            const normalized = average / 255; // Normalize between 0 and 1

            newVolumes.push([normalized]);
          }

          setVolumes(newVolumes);
        };

        // Update volume every 50ms
        intervalId = setInterval(updateVolume, 50);
      } catch (error) {
        console.error("Error setting up audio analysis:", error);
        setVolumes(Array.from({ length: bands }, () => [0.0]));
      }
    };

    setupAudioAnalysis();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [track, bands]);

  return volumes;
};

export const useTrackVolume = (track: Track | undefined): number => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!track) {
      setVolume(0);
      return;
    }

    let intervalId: NodeJS.Timeout;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;

    const setupAudioAnalysis = async () => {
      try {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        const mediaStream = new MediaStream([track.mediaStreamTrack]);
        const source = audioContext.createMediaStreamSource(mediaStream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateVolume = () => {
          if (!analyser) return;

          analyser.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }

          const average = sum / bufferLength;
          const normalized = average / 255;

          setVolume(normalized);
        };

        intervalId = setInterval(updateVolume, 50);
      } catch (error) {
        console.error("Error setting up audio analysis:", error);
        setVolume(0);
      }
    };

    setupAudioAnalysis();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [track]);

  return volume;
};