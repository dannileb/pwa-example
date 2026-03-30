import { useOrientanion } from "#/hooks/useOrientanion/useOrientanion";
import { Button } from "#/ui/Button/Button";
import { ArrowUpOutlined } from "@ant-design/icons";
import classes from "./Compass.module.css";
import { getDirectionByDeviation } from "./helpers";

export const Compass = () => {
  const {
    zeroDeviation,
    startOrientationDetecting,
    stopOrientationDetecting,
    isOrientationDetecting,
  } = useOrientanion();
  return (
    <div className={classes.compassWrapper}>
      <Button
        onClick={
          isOrientationDetecting
            ? stopOrientationDetecting
            : startOrientationDetecting
        }
      >
        {isOrientationDetecting ? "Остановить" : "Включить"} отслеживание
      </Button>
      {isOrientationDetecting && zeroDeviation && (
        <div className={classes.compass}>
          <div
            className={classes.compassNorthArrow}
            style={{
              transform: `rotateZ(${360 - zeroDeviation}deg)`,
            }}
          />
          <p className={classes.compassDeviation}>
            {Math.round(zeroDeviation)}°{" "}
            {getDirectionByDeviation(zeroDeviation)}
          </p>
          <ArrowUpOutlined className={classes.compassDirectionArrow} />
        </div>
      )}
    </div>
  );
};
