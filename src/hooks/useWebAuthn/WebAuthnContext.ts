import { createContext, useContext } from "react";
import { WebAuthnContextType } from "./types";

export const WebAuthnContext = createContext<WebAuthnContextType | null>(null);

export const useWebAuthnContext = () => {
  const context = useContext(WebAuthnContext);

  if (!context) {
    throw new Error("Using useWebAuthnContext without Provider");
  }

  return context;
};
