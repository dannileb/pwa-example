import { useCallback, useEffect, useMemo, useState } from "react";

interface useSensorsProps {
  onDeviceMotion?: (e: DeviceMotionEvent) => void;
  onDeviceOrientation?: (e: DeviceOrientationEvent) => void;
}

type AvailableSensors = {
  motion?: boolean;
  orientation?: boolean;
};

type IOSDeviceEvent = (
  | typeof DeviceMotionEvent
  | typeof DeviceOrientationEvent
) & {
  requestPermission: () => Promise<PermissionState>;
};

const isIOSEvent = (
  e: typeof DeviceOrientationEvent | typeof DeviceMotionEvent
): e is IOSDeviceEvent => {
  return (
    typeof e !== "undefined" &&
    "requestPermission" in e &&
    typeof e.requestPermission === "function"
  );
};

export const useSensors = ({
  onDeviceMotion,
  onDeviceOrientation,
}: useSensorsProps) => {
  const [isOrientationDetecting, setIsOrientationDetecting] =
    useState<boolean>(false);
  const [isMotionDetecting, setIsMotionDetecting] = useState<boolean>(false);
  const [avaialbleSensors, setAvailableSensors] = useState<AvailableSensors>(
    {}
  );
  const [permissionState, setPermissionState] = useState<PermissionState>();

  const isIOS = useMemo(() => {
    return isIOSEvent(DeviceOrientationEvent);
  }, []);

  const requestPermission = useCallback(async () => {
    if (isIOSEvent(DeviceOrientationEvent)) {
      const permissionState = await DeviceOrientationEvent.requestPermission();
      setPermissionState(permissionState);
      return permissionState;
    }
  }, []);

  const startOrientationDetecting = useCallback(() => {
    if (onDeviceOrientation) {
      requestPermission()
        .then((permissionState) => {
          if (permissionState === "denied") {
            return;
          }
          setIsOrientationDetecting(true);
          window.addEventListener("deviceorientation", onDeviceOrientation);
        })
        .catch(console.error);
    }
  }, [onDeviceOrientation, requestPermission]);

  const startMotionDetecting = useCallback(() => {
    if (onDeviceMotion) {
      requestPermission()
        .then((permissionState) => {
          if (permissionState === "denied") {
            return;
          }
          setIsMotionDetecting(true);
          window.addEventListener("devicemotion", onDeviceMotion);
        })
        .catch(console.error);
    }
  }, [onDeviceMotion, requestPermission]);

  const stopOrientationDetecting = useCallback(() => {
    setIsOrientationDetecting(false);
    if (onDeviceOrientation) {
      window.removeEventListener("deviceorientation", onDeviceOrientation);
    }
  }, [onDeviceOrientation]);

  const stopMotionDetecting = useCallback(() => {
    setIsMotionDetecting(false);
    if (onDeviceMotion) {
      window.removeEventListener("devicemotion", onDeviceMotion);
    }
  }, [onDeviceMotion]);

  const updateAvailableSensors = (
    e: DeviceOrientationEvent | DeviceMotionEvent
  ) => {
    if ("alpha" in e && (e.alpha || e.beta || e.gamma)) {
      setAvailableSensors((prev) => ({
        ...prev,
        orientation: true,
      }));
    } else if (
      "acceleration" in e &&
      e.acceleration &&
      (e.acceleration.x || e.acceleration.y || e.acceleration.z)
    ) {
      setAvailableSensors((prev) => ({
        ...prev,
        motion: true,
      }));
    }
  };

  useEffect(() => {
    if (!permissionState && isIOSEvent(DeviceOrientationEvent)) {
      requestPermission();
      return;
    }
    if (permissionState === "denied") {
      return;
    }

    window.addEventListener("deviceorientation", updateAvailableSensors);
    window.addEventListener("devicemotion", updateAvailableSensors);

    return () => {
      window.removeEventListener("devicemotion", updateAvailableSensors);
      window.removeEventListener("deviceorientation", updateAvailableSensors);
    };
  }, [permissionState, requestPermission]);

  useEffect(() => {
    return () => {
      stopOrientationDetecting();
    };
  }, [stopOrientationDetecting]);

  return {
    isIOS,
    permissionState,
    avaialbleSensors,
    isOrientationDetecting,
    startOrientationDetecting,
    stopOrientationDetecting,
    isMotionDetecting,
    startMotionDetecting,
    stopMotionDetecting,
    requestPermission,
  };
};
