import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "#/ui/Button/Button";
import { useSensors } from "#/hooks/useSensors/useSensors";
import { MazeCanvas } from "./MazeCanvas";
import classes from "./MazeGame.module.css";
import { MazeBall } from "./MazeBall";
import { getBallSize, MAZE_WALLS, updateBallCoordinates } from "./helpers";
import { Coordinate } from "./types";
import { GamepadsSelectList } from "#/components/GamepadControl/GamepadsSelectList";
import { useGamepadControl } from "#/components/GamepadControl/useGamepadControl";
import classNames from "classnames";
import { useWakeLock } from "#/hooks/useWakeLock/useWakeLock";

const DEFAUL_COORDINATES = {
  x: 22,
  y: 182,
};

const DPAD_UP = 12;
const DPAD_DOWN = 13;
const DPAD_LEFT = 14;
const DPAD_RIGHT = 15;

export const MazeGame = () => {
  const [ballCoordinates, setBallCoordinates] =
    useState<Coordinate>(DEFAUL_COORDINATES);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isPageFocus = document.hasFocus();

  const deviceMotionHandler = useCallback(
    (e: DeviceMotionEvent) => {
      if (!isPageFocus) {
        return;
      }
      const gameFieldWrapper = wrapperRef.current;
      const x = e.accelerationIncludingGravity?.x;
      const y = e.accelerationIncludingGravity?.y;

      if (
        !gameFieldWrapper ||
        gameFieldWrapper.offsetHeight !== gameFieldWrapper.offsetWidth ||
        typeof x !== "number" ||
        typeof y !== "number"
      ) {
        return;
      }

      setBallCoordinates((prev) =>
        updateBallCoordinates(prev, { x, y }, gameFieldWrapper.offsetWidth)
      );
    },
    [isPageFocus]
  );

  const onAxesChange = useCallback(
    (gamepad: Gamepad) => {
      if (!isPageFocus) {
        return;
      }
      const [y, x] = gamepad.axes;
      const gameFieldWrapper = wrapperRef.current;

      if (
        !gameFieldWrapper ||
        gameFieldWrapper.offsetHeight !== gameFieldWrapper.offsetWidth
      ) {
        return;
      }
      let newX = x * -2;
      let newY = y * -2;

      const turboButton = gamepad.buttons[7];
      if (turboButton?.pressed && turboButton.value > 0.1) {
        newX *= turboButton.value * 5;
        newY *= turboButton.value * 5;
      }
      const slowButton = gamepad.buttons[6];
      if (slowButton?.pressed && slowButton.value > 0.1) {
        newX *= slowButton.value / 5;
        newY *= slowButton.value / 5;
      }
      setBallCoordinates((prev) =>
        updateBallCoordinates(
          prev,
          { x: newX, y: newY },
          gameFieldWrapper.offsetWidth
        )
      );
    },
    [isPageFocus]
  );

  const onButtonChange = useCallback(
    (gamepad: Gamepad) => {
      if (!isPageFocus) {
        return;
      }
      let x = 0;
      let y = 0;
      const gameFieldWrapper = wrapperRef.current;
      const buttons = gamepad.buttons;

      if (!(buttons[0]?.pressed && buttons[1]?.pressed)) {
        if (buttons[0]?.pressed) {
          setIsPlaying(true);
          return;
        }
        if (buttons[1]?.pressed) {
          setIsPlaying(false);
          return;
        }
      }

      if (
        !gameFieldWrapper ||
        gameFieldWrapper.offsetHeight !== gameFieldWrapper.offsetWidth
      ) {
        return;
      }
      if (buttons[DPAD_LEFT]?.pressed) {
        y = 2;
      } else if (buttons[DPAD_RIGHT]?.pressed) {
        y = -2;
      }
      if (buttons[DPAD_UP]?.pressed) {
        x = 2;
      } else if (buttons[DPAD_DOWN]?.pressed) {
        x = -2;
      }
      setBallCoordinates((prev) =>
        updateBallCoordinates(prev, { x, y }, gameFieldWrapper.offsetWidth)
      );
    },
    [isPageFocus]
  );

  const {
    isMotionDetecting,
    startMotionDetecting,
    stopMotionDetecting,
    avaialbleSensors,
  } = useSensors({
    onDeviceMotion: deviceMotionHandler,
  });

  const {
    isDetecting: isGamepadDetecting,
    setIsDetecting,
    selectedGamepadId,
    setSelectedGamepadId,
    gamepads,
    isButtonPressed,
    isAxesMoving,
  } = useGamepadControl({ onAxesChange, onButtonChange });

  const { request, release } = useWakeLock();

  useEffect(() => {
    return () => {
      stopMotionDetecting();
    };
  }, [stopMotionDetecting]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        await request();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      release();
    };
  }, [request, release]);

  useEffect(() => {
    if (isPlaying) {
      setBallCoordinates(DEFAUL_COORDINATES);
      request();
    } else {
      release();
    }
  }, [isPlaying, request, release]);

  useEffect(() => {
    if (!isGamepadDetecting) {
      setIsPlaying(false);
    }
  }, [isGamepadDetecting]);

  const isPlayAvailable =
    avaialbleSensors.motion ||
    (isGamepadDetecting && selectedGamepadId !== undefined);

  return (
    <div className={classes.gameContainer}>
      <Button
        isDisabled={!isPlayAvailable}
        onClick={() => {
          if (avaialbleSensors.motion) {
            if (!isMotionDetecting) {
              startMotionDetecting();
            } else {
              stopMotionDetecting();
            }
          }
          setIsPlaying(!isPlaying);
          setBallCoordinates(DEFAUL_COORDINATES);
        }}
      >
        {isPlaying
          ? `Остановить игру${isGamepadDetecting ? " (O)" : ""}`
          : `Начать игру${isGamepadDetecting ? " (X)" : ""}`}
      </Button>
      {!avaialbleSensors.motion && (
        <>
          {!isGamepadDetecting && (
            <>
              <p>
                Датчик движения недоступен. Нажмите ниже, чтобы играть через
                геймпад
              </p>
              <Button
                onClick={() => {
                  setIsDetecting(true);
                }}
              >
                Играть через геймпад
              </Button>
            </>
          )}
          {isGamepadDetecting &&
            !isPlaying &&
            (gamepads.filter((g) => g?.connected).length ? (
              <GamepadsSelectList
                gamepads={gamepads.filter((g) => g?.connected)}
                selectedGamepad={selectedGamepadId ?? 0}
                setSelectedGamepad={setSelectedGamepadId}
              />
            ) : (
              <p>Подключите геймпад и нажмите любую кнопку...</p>
            ))}
        </>
      )}
      {isPlaying && (
        <>
          <div ref={wrapperRef} className={classes.gameFieldWrapper}>
            <MazeCanvas grid={MAZE_WALLS} />
            {}
            <MazeBall
              {...ballCoordinates}
              ballSize={getBallSize(200, MAZE_WALLS)}
            />
          </div>
          {isGamepadDetecting && (
            <div>
              <p>
                <span
                  className={classNames(classes.buttonName, {
                    [classes.buttonName_pressed]: isButtonPressed([
                      DPAD_UP,
                      DPAD_DOWN,
                      DPAD_LEFT,
                      DPAD_RIGHT,
                    ]),
                  })}
                >
                  Стрелки
                </span>
                /
                <span
                  className={classNames(classes.buttonName, {
                    [classes.buttonName_pressed]:
                      isAxesMoving[0] || isAxesMoving[1],
                  })}
                >
                  LS
                </span>
                - управление
              </p>
              <p>
                <span
                  className={classNames(classes.buttonName, {
                    [classes.buttonName_pressed]:
                      isAxesMoving[0] || isAxesMoving[1],
                  })}
                >
                  LS
                </span>{" "}
                +{" "}
                <span
                  className={classNames(classes.buttonName, {
                    [classes.buttonName_pressed]: isButtonPressed([7]),
                  })}
                >
                  RT
                </span>{" "}
                - ускорение
              </p>
              <p>
                <span
                  className={classNames(classes.buttonName, {
                    [classes.buttonName_pressed]:
                      isAxesMoving[0] || isAxesMoving[1],
                  })}
                >
                  LS
                </span>{" "}
                +{" "}
                <span
                  className={classNames(classes.buttonName, {
                    [classes.buttonName_pressed]: isButtonPressed([6]),
                  })}
                >
                  LT
                </span>{" "}
                - замедление
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
