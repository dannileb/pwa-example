import { Coordinate, MazeGrid } from "./types";

export const MAZE_WALLS: MazeGrid = [
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const START_CELL: [number, number] = [2, 10];

export const getBallSize = (
  fieldSize: number | null,
  grid: MazeGrid
): number => {
  if (fieldSize) {
    return fieldSize / grid[0].length - 4;
  }
  return 0;
};

const isWallAtPixel = (
  x: number,
  y: number,
  grid: MazeGrid,
  cellSize: number
): boolean => {
  const gridX = Math.floor(x / cellSize);
  const gridY = Math.floor(y / cellSize);

  if (
    gridY < 0 ||
    gridY >= grid.length ||
    gridX < 0 ||
    gridX >= grid[0].length
  ) {
    return true;
  }
  return grid[gridY][gridX] === 1;
};

export const getBallCollision = (
  nextPos: Coordinate,
  prevPos: Coordinate,
  grid: MazeGrid,
  fieldSize: number,
  ballSize: number
): { x: boolean; y: boolean } => {
  const cellSize = fieldSize / grid.length;

  let collisionX = false;
  let collisionY = false;

  const velocityX = nextPos.x - prevPos.x;
  if (velocityX !== 0) {
    const checkX = velocityX > 0 ? nextPos.x + ballSize : nextPos.x;

    if (
      isWallAtPixel(checkX, prevPos.y, grid, cellSize) ||
      isWallAtPixel(checkX, prevPos.y + ballSize / 2, grid, cellSize) ||
      isWallAtPixel(checkX, prevPos.y + ballSize, grid, cellSize)
    ) {
      collisionX = true;
    }
  }

  const velocityY = nextPos.y - prevPos.y;
  if (velocityY !== 0) {
    const checkY = velocityY > 0 ? nextPos.y + ballSize : nextPos.y;

    if (
      isWallAtPixel(nextPos.x, checkY, grid, cellSize) ||
      isWallAtPixel(nextPos.x + ballSize / 2, checkY, grid, cellSize) ||
      isWallAtPixel(nextPos.x + ballSize, checkY, grid, cellSize)
    ) {
      collisionY = true;
    }
  }

  return { x: collisionX, y: collisionY };
};

export const updateBallCoordinates = (
  prevCoord: Coordinate,
  newCoord: Coordinate,
  fieldSize: number
) => {
  const isPortraitOrientation = [
    "portrait-primary",
    "portrait-secondary",
  ].includes(screen.orientation.type);
  const ballSize = getBallSize(fieldSize, MAZE_WALLS);

  let accX, accY;
  if (isPortraitOrientation) {
    accX = newCoord.x;
    accY = newCoord.y;
  } else {
    accX = newCoord.y;
    accY = newCoord.x;
  }

  const nextX = isPortraitOrientation ? prevCoord.x + accX : prevCoord.x - accX;

  const collisionXResult = getBallCollision(
    { x: nextX, y: prevCoord.y },
    prevCoord,
    MAZE_WALLS,
    fieldSize,
    ballSize
  );

  const finalX =
    !collisionXResult.x && nextX > 0 && nextX < fieldSize - ballSize
      ? nextX
      : prevCoord.x;

  const nextY = prevCoord.y - accY;

  const collisionYResult = getBallCollision(
    { x: finalX, y: nextY },
    { x: finalX, y: prevCoord.y },
    MAZE_WALLS,
    fieldSize,
    ballSize
  );

  const finalY =
    !collisionYResult.y && nextY > 0 && nextY < fieldSize - ballSize
      ? nextY
      : prevCoord.y;

  return {
    x: finalX,
    y: finalY,
  };
};
