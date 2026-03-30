import { useCallback, useEffect, useRef, useState } from "react";
import { areGamepadsEqual } from "./helpers";

interface UseGamepad {
  onGamepadConnected?: (e: GamepadEvent) => void;
  onGamepadDisconnected?: (e: GamepadEvent) => void;
  onButtonChange?: (gamepads: Gamepad[]) => void;
  onAxesChange?: (gamepads: Gamepad[]) => void;
  deathzone?: number;
  isDetecting: boolean;
}

export const useGamepad = ({
  onGamepadConnected,
  onGamepadDisconnected,
  onButtonChange,
  onAxesChange,
  deathzone = 0.1,
  isDetecting,
}: UseGamepad) => {
  const animationFrameId = useRef<number | null>(null);
  const [gamepads, setGamepads] = useState<(Gamepad | null)[]>(
    navigator.getGamepads()
  );

  const gameLoop = useCallback(() => {
    if (isDetecting) {
      const newGamepads = navigator.getGamepads();

      const gamepadsEqual = areGamepadsEqual(gamepads, newGamepads, deathzone);

      if (
        gamepadsEqual.axesChanged.length ||
        gamepadsEqual.buttonsChanged.length ||
        gamepadsEqual.isGamepadsCountChanged
      ) {
        setGamepads(newGamepads);
      }

      if (gamepadsEqual.buttonsChanged.length) {
        onButtonChange?.(gamepadsEqual.buttonsChanged);
      }
      if (gamepadsEqual.axesChanged.length) {
        onAxesChange?.(gamepadsEqual.axesChanged);
      }
    }
    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [gamepads, deathzone, isDetecting, onAxesChange, onButtonChange]);

  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      onGamepadConnected?.(e);
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      onGamepadDisconnected?.(e);
    };

    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

    animationFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected);
      window.removeEventListener(
        "gamepaddisconnected",
        handleGamepadDisconnected
      );

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameLoop, onGamepadConnected, onGamepadDisconnected]);

  return gamepads;
};
