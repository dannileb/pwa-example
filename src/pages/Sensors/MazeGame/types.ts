export type Coordinate = { x: number; y: number };
export type WallCoordinates = { from: Coordinate; to: Coordinate }[];

export interface LabytinthCell {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export type LabytinthCellLayout = LabytinthCell[][];

export type MazeGrid = number[][];
