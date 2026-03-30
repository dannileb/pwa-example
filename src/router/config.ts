export const ROUTES = {
  START_PAGE: "/",
  NOTES_LIST: "/notes",
  NOTE_PAGE: "/notes/:id",
  NOTIFICATIONS: "/notifications",
  SHARE_TARGET: "/share-target",
  CAMERA: "/camera",
  LOGIN: "/login",
  SENSORS: "/sensors",
} as const;

export type PathParams = {
  [ROUTES.NOTE_PAGE]: {
    id: string;
  };
};

declare module "react-router" {
  interface Register {
    params: PathParams;
  }
}
