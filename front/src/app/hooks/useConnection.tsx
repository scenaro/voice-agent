import React, { createContext, useCallback, useContext, useState } from "react";
import { LIVEKIT_URL } from "astro:env/client";

import type { ConnectionContextType } from ":types/index";

const ConnectionContext = createContext<ConnectionContextType | undefined>(
  undefined
);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [connectionDetails, setConnectionDetails] = useState<{
    wsUrl?: string;
    token?: string;
    shouldConnect: boolean;
  }>({ shouldConnect: false });

  const connect = useCallback(async () => {
    let token = "";

    // Utiliser l'URL LiveKit depuis les variables d'environnement Astro
    if (!LIVEKIT_URL) {
      throw new Error("LIVEKIT_URL is not set");
    }
    const url = LIVEKIT_URL;

    try {
      // Appeler l'API token d'Astro
      const response = await fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch token");
      }

      const data = await response.json();
      token = data.accessToken;

      setConnectionDetails({ wsUrl: url, token, shouldConnect: true });
    } catch (error) {
      console.error("Error connecting:", error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    setConnectionDetails((prev) => ({ ...prev, shouldConnect: false }));
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        shouldConnect: connectionDetails.shouldConnect,
        wsUrl: connectionDetails.wsUrl,
        token: connectionDetails.token,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export const useConnection = (): ConnectionContextType => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
}