import { useCallback, useEffect, useState } from "react";
import { useSensors } from "../useSensors/useSensors";

export const useOrientanion = () => {
  const [zeroDeviation, setZeroDeviation] = useState<number>();

  const deviceOrientationHandler = useCallback((e: DeviceOrientationEvent) => {
    const deviation =
      "webkitCompassHeading" in e && typeof e.webkitCompassHeading === "number"
        ? e.webkitCompassHeading
        : e.alpha;

    setZeroDeviation(deviation ?? undefined);
    // setZeroDeviation((prev) => {
    //   if (deviation) {
    //     if (!prev) {
    //       return Math.round(deviation);
    //     }
    //     return Math.abs(Math.round(deviation) - prev) > 1
    //       ? Math.round(deviation)
    //       : prev;
    //   }
    //   return prev;
    // });
  }, []);

  const {
    startOrientationDetecting,
    stopOrientationDetecting,
    isOrientationDetecting,
  } = useSensors({
    onDeviceOrientation: deviceOrientationHandler,
  });

  useEffect(() => {
    return () => {
      stopOrientationDetecting();
    };
  }, [stopOrientationDetecting]);

  return {
    isOrientationDetecting,
    stopOrientationDetecting,
    startOrientationDetecting,
    zeroDeviation,
  };
};
