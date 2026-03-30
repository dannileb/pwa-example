import { WebAuthnProvider } from "./hooks/useWebAuthn/WebAuthnProvider";
import { MessageToastProvider } from "./components/MessageToast/useMessageToast/MessageToastProvider.tsx";
import { NavBarProvider } from "./components/NavBar/useNavBar/index.ts";
import { RouterProvider } from "react-router";
import { router } from "./router/routes.tsx";

export const AppProviders = () => {
  return (
    <WebAuthnProvider>
      <MessageToastProvider>
        <NavBarProvider>
          <RouterProvider router={router} />
        </NavBarProvider>
      </MessageToastProvider>
    </WebAuthnProvider>
  );
};
