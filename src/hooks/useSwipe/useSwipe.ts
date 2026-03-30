import React, { useCallback, useRef } from "react";

type Direction = "left" | "right" | "up" | "down";
type CallbackFunc = (direction: Direction) => void;

interface TouchState {
  x: number;
  y: number;
  lockedDirection: "horizontal" | "vertical" | null;
}
export function useSwipe<T extends HTMLElement = HTMLElement>(
  callback: CallbackFunc,
  offsetSensitivity: number = 50
) {
  const touchStateRef = useRef<TouchState>(null);

  const onTouchStart = useCallback((e: React.TouchEvent<T>) => {
    const touch = e.changedTouches[0];
    if (touch) {
      touchStateRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        lockedDirection: null,
      };
    }
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent<T>) => {
      if (!touchStateRef.current) {
        return;
      }

      const touch = e.changedTouches[0];
      if (!touch) {
        return;
      }

      const { x: startX, y: startY } = touchStateRef.current;
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (touchStateRef.current.lockedDirection === null) {
        if (Math.abs(deltaX) > offsetSensitivity) {
          touchStateRef.current.lockedDirection = "horizontal";
          e.preventDefault();
        } else if (Math.abs(deltaY) > offsetSensitivity) {
          touchStateRef.current.lockedDirection = "vertical";
        }
      }
    },
    [offsetSensitivity]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent<T>) => {
      const touchState = touchStateRef.current;
      const touch = e.changedTouches[0];

      if (!touchState || !touch) {
        touchStateRef.current = null;
        return;
      }

      if (!touchState.lockedDirection) {
        touchStateRef.current = null;
        return;
      }

      const { x: startX, y: startY } = touchState;
      let direction: Direction | null = null;

      if (touchState.lockedDirection === "horizontal") {
        const deltaX = touch.clientX - startX;

        if (Math.abs(deltaX) > offsetSensitivity) {
          direction = deltaX > 0 ? "right" : "left";
        }
      } else {
        const deltaY = touch.clientY - startY;
        if (Math.abs(deltaY) > offsetSensitivity) {
          direction = deltaY > 0 ? "down" : "up";
        }
      }

      if (direction) {
        callback(direction);
      }

      touchStateRef.current = null;
    },
    [callback, offsetSensitivity]
  );

  return { onTouchStart, onTouchEnd, onTouchMove };
}
