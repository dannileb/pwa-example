import { ReactNode } from "react";
import { useWebAuthn } from "./useWebAuthn";
import { WebAuthnContext } from "./WebAuthnContext";

export const WebAuthnProvider = ({ children }: { children: ReactNode }) => {
  const webAuthnState = useWebAuthn();

  return (
    <WebAuthnContext.Provider value={webAuthnState}>
      {children}
    </WebAuthnContext.Provider>
  );
};
