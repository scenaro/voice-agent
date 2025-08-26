import { useMediaDeviceSelect } from "@livekit/components-react";
import React, { useEffect, useState } from "react";

import { cn } from ":app/utils/cn";

interface DeviceSelectorProps {
  kind: MediaDeviceKind;
}

export function DeviceSelector({ kind }: DeviceSelectorProps) {
  const [showMenu, setShowMenu] = useState(false);
  const deviceSelect = useMediaDeviceSelect({
    kind: kind,
    requestPermissions: true,
    onError: (e) => {
      console.error("DeviceSelector error:", e);
    }
  });

  const [selectedDeviceName, setSelectedDeviceName] = useState("");
  useEffect(() => {
    deviceSelect.devices.forEach((device) => {
      if (device.deviceId === deviceSelect.activeDeviceId) {
        setSelectedDeviceName(device.label);
      }
    });
  }, [deviceSelect.activeDeviceId, deviceSelect.devices]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu) {
        setShowMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showMenu]);

  const activeClassName = showMenu ? "rotate-180" : "rotate-0";

  return (
    <div id="sc-device-selector">
      <button
        id="sc-device-selector-btn"
        className={activeClassName}
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
        {
          deviceSelect.devices.length
            ? deviceSelect.devices.map((device, index) => {
              return (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    deviceSelect.setActiveMediaDevice(device.deviceId);
                    setShowMenu(false);
                  }}
                  className={cn(
                    'sc-device-selector-item',
                    device.deviceId === deviceSelect.activeDeviceId ? 'active' : ''
                  )}
                  key={index}
                >
                  {device.label}
                </div>
              );
            })
            : <div className="sc-device-selector-item">Aucun périphérique (micro) détecté</div>
        }
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