export type GamepadsArray = ReturnType<(typeof navigator)["getGamepads"]>;

interface AreGamepadsEqualResult {
  buttonsChanged: Gamepad[];
  axesChanged: Gamepad[];
  isGamepadsCountChanged: boolean;
}

export function areGamepadsEqual(
  prevGamepads: GamepadsArray,
  newGamepads: GamepadsArray,
  deathzone: number,
  booleanReturnType: true
): boolean;

export function areGamepadsEqual(
  prevGamepads: GamepadsArray,
  newGamepads: GamepadsArray,
  deathzone: number
): AreGamepadsEqualResult;

export function areGamepadsEqual(
  prevGamepads: GamepadsArray,
  newGamepads: GamepadsArray,
  deathzone: number,
  booleanReturnType?: true
): boolean | AreGamepadsEqualResult {
  let isGamepadsCountChanged = false;
  const buttonsChanged: Gamepad[] = [];
  const axesChanged: Gamepad[] = [];

  if (
    prevGamepads.length !== newGamepads.length ||
    prevGamepads.filter((g) => g).length !== newGamepads.filter((g) => g).length
  ) {
    isGamepadsCountChanged = true;
  }
  for (const gamepad of prevGamepads) {
    if (gamepad) {
      const newGamepad = newGamepads.at(gamepad.index);
      if (!newGamepad) {
        continue;
      }
      if (gamepad.id !== newGamepad.id) {
        isGamepadsCountChanged = true;
      }

      for (let i = 0; i < gamepad.axes.length; i++) {
        const newAxis = Math.round(newGamepad.axes[i] * 100) / 100;

        if (Math.abs(newAxis) > deathzone) {
          if (!axesChanged.includes(newGamepad)) {
            axesChanged.push(newGamepad);
          }
        }
      }

      for (let i = 0; i < gamepad.buttons.length; i++) {
        const prevButton = gamepad.buttons[i];
        const newButton = newGamepad.buttons[i];

        if (
          newButton.pressed ||
          newButton.touched ||
          prevButton.value !== newButton.value
        ) {
          if (!buttonsChanged.includes(newGamepad)) {
            buttonsChanged.push(newGamepad);
          }
        }
      }
    }
  }

  return booleanReturnType
    ? !buttonsChanged.length && !axesChanged.length && !isGamepadsCountChanged
    : {
        buttonsChanged,
        axesChanged,
        isGamepadsCountChanged,
      };
}
