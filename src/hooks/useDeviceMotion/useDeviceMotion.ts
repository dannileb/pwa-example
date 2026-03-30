import { useCallback, useEffect, useState } from "react";
import { useSensors } from "../useSensors/useSensors";

export const useDeviceMotion = () => {
  const [acceleration, setAcceleration] =
    useState<DeviceMotionEventAcceleration | null>(null);

  const deviceMotionHandler = useCallback((e: DeviceMotionEvent) => {
    setAcceleration(e.accelerationIncludingGravity);
  }, []);

  const { isMotionDetecting, startMotionDetecting, stopMotionDetecting } =
    useSensors({
      onDeviceMotion: deviceMotionHandler,
    });

  useEffect(() => {
    return () => {
      stopMotionDetecting();
    };
  }, [stopMotionDetecting]);

  return {
    isMotionDetecting,
    startMotionDetecting,
    stopMotionDetecting,
    acceleration,
  };
};
