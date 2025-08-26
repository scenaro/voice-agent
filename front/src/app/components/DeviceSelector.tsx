import { useMediaDeviceSelect } from "@livekit/components-react";
import React, { useState } from "react";

import { cn } from ":app/utils/cn";

interface DeviceSelectorProps {
  kind: MediaDeviceKind;
}

export function DeviceSelector({ kind }: DeviceSelectorProps) {
  const [showMenu, setShowMenu] = useState(false);

  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind,
    requestPermissions: true,
  });

  const handleDeviceSelect = (deviceId: string) => {
    setActiveMediaDevice(deviceId);
    setShowMenu(false);
  };

  return (
    <div id="sc-device-selector">
      <button
        id="sc-device-selector-btn"
        className={showMenu ? "rotate-180" : "rotate-0"}
        onClick={(e) => {
          setShowMenu(!showMenu);
          e.stopPropagation();
        }}
      >
        <ChevronSVG />
      </button>
      <div
        id="sc-device-selector-list"
        style={{
          display: showMenu ? "block" : "none",
        }}
      >
        {devices.map((device) => (
          <div
            key={device.deviceId}
            className={cn(
              "sc-device-selector-item",
              activeDeviceId === device.deviceId ? "active" : ""
            )}
            onClick={() => handleDeviceSelect(device.deviceId)}
            style={{ cursor: "pointer" }}
          >
            {device.label || `${kind} ${device.deviceId.slice(0, 8)}...`}
          </div>
        ))}
        {devices.length === 0 && (
          <div className="sc-device-selector-item">
            Aucun périphérique (micro) détecté
          </div>
        )}
      </div>
    </div>
  );
}

function ChevronSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M13.3334 6L8.00003 11.3333L2.66669 6"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}