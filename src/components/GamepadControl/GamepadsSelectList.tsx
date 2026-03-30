import { Radio, RadioGroup } from "#/ui/RadioGroup/RadioGroup";

type GamepadsArray = ReturnType<(typeof navigator)["getGamepads"]>;

interface GamepadsListProps {
  gamepads: GamepadsArray;
  selectedGamepad: number;
  setSelectedGamepad: (gamepadIndex: number) => void;
}

export const GamepadsSelectList = ({
  gamepads,
  selectedGamepad,
  setSelectedGamepad,
}: GamepadsListProps) => {
  return (
    <RadioGroup
      label="Выберите геймпад"
      value={selectedGamepad.toString()}
      onChange={(v) => {
        try {
          setSelectedGamepad(parseInt(v));
        } catch (e) {
          console.debug(e);
        }
      }}
    >
      {gamepads.map((g) => {
        if (!g) {
          return;
        }
        return (
          <Radio key={g.index} value={g.index.toString()}>
            {g.id}
          </Radio>
        );
      })}
    </RadioGroup>
  );
};
