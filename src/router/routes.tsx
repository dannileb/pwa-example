import { createBrowserRouter, Navigate } from "react-router";
import { PrivateRoute } from "./PrivateRoute";
import StartPage from "#/pages/Start/StartPage";
import NotesList from "#/pages/Notes/NotesList";
import { ROUTES } from "./config";
import NotePage from "#/pages/Notes/NotePage";
import NotificationsPage from "#/pages/Notifications/NotificationsPage";
import { ShareTargetHandler } from "#/pages/ShareTarget/ShareTargetHandler";
import App from "#/App";
import LoginPage from "#/pages/Login/LoginPage";
import { getWebAuthnAvailability } from "#/utils/pwaUtils";
import { notePageLoader, notesListLoader } from "#/pages/Notes/helpers";
import { Camera } from "#/pages/Camera/Camera";
import SensorsPage from "#/pages/Sensors/SensorsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        Component: PrivateRoute,
        children: [
          { path: ROUTES.START_PAGE, Component: StartPage },
          {
            path: ROUTES.NOTES_LIST,
            Component: NotesList,
            loader: notesListLoader,
          },
          {
            path: ROUTES.NOTE_PAGE,
            Component: NotePage,
            loader: notePageLoader,
          },
          { path: ROUTES.NOTIFICATIONS, Component: NotificationsPage },
          { path: ROUTES.SHARE_TARGET, Component: ShareTargetHandler },
          { path: ROUTES.CAMERA, Component: Camera },
          { path: ROUTES.SENSORS, Component: SensorsPage },
        ],
      },
      {
        path: ROUTES.LOGIN,
        Component: LoginPage,
        loader: async () => {
          const isWebAuthnAvailable = await getWebAuthnAvailability();
          return { isWebAuthnAvailable };
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
