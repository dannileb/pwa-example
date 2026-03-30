import classes from "./MazeGame.module.css";
import { Coordinate } from "./types";

interface MazeBallProps extends Coordinate {
  ballSize: number;
}

export const MazeBall = ({ x, y, ballSize }: MazeBallProps) => {
  return (
    <div
      className={classes.ball}
      style={{
        width: ballSize,
        left: `${x}px`,
        top: `${y}px`,
      }}
    />
  );
};
