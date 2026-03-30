import { useGamepad } from "#/hooks/useGamepad";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UseGamepadControl {
  onButtonChange?: (gamepad: Gamepad) => void;
  onAxesChange?: (gamepad: Gamepad) => void;
}

const DEATHZONE = 0.1;

export const useGamepadControl = ({
  onButtonChange,
  onAxesChange,
}: UseGamepadControl) => {
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [selectedGamepadId, setSelectedGamepadId] = useState<number>();

  const handleAxesChange = useCallback(
    (gamepads: Gamepad[]) => {
      const selectedGamepad = gamepads.find(
        (a) => a.index === selectedGamepadId
      );

      if (selectedGamepad) {
        onAxesChange?.(selectedGamepad);
      }
    },
    [onAxesChange, selectedGamepadId]
  );

  const handleButtonPress = useCallback(
    (gamepads: Gamepad[]) => {
      const selectedGamepad = gamepads.find(
        (g) => g.index === selectedGamepadId
      );

      if (selectedGamepad) {
        onButtonChange?.(selectedGamepad);
      }
    },
    [onButtonChange, selectedGamepadId]
  );

  const gamepads = useGamepad({
    deathzone: DEATHZONE,
    isDetecting,
    onGamepadDisconnected: (e) => {
      if (selectedGamepadId === e.gamepad.index) {
        setIsDetecting(false);
        const connectedGamepad = gamepads.find(
          (g) => g?.connected && g.index !== selectedGamepadId
        );
        if (connectedGamepad) {
          setSelectedGamepadId(connectedGamepad.index);
        }
      }
    },
    onAxesChange: handleAxesChange,
    onButtonChange: handleButtonPress,
  });

  const isButtonPressed = useCallback(
    (indexes: number[]) => {
      const selectedGamepad = gamepads.find(
        (g) => g?.index === selectedGamepadId
      );
      if (!selectedGamepad) {
        return false;
      }
      return selectedGamepad.buttons.some(
        (b, i) => b.pressed && indexes.includes(i)
      );
    },
    [gamepads, selectedGamepadId]
  );

  const isAxesMoving = useMemo(() => {
    const selectedGamepad = gamepads.find(
      (g) => g?.index === selectedGamepadId
    );

    return (selectedGamepad?.axes ?? []).map(
      (a) => Math.abs(a) > DEATHZONE + 0.1
    );
  }, [gamepads, selectedGamepadId]);

  useEffect(() => {
    if (selectedGamepadId === undefined) {
      const connectedGamepad = gamepads.find((g) => g?.connected);
      if (connectedGamepad) {
        setSelectedGamepadId(connectedGamepad.index);
      }
    }
  }, [gamepads, selectedGamepadId, onAxesChange, onButtonChange]);

  return {
    isDetecting,
    setIsDetecting,
    gamepads,
    selectedGamepadId,
    setSelectedGamepadId,
    isButtonPressed,
    isAxesMoving,
  };
};
