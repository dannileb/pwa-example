import { createContext, useContext } from "react";
import { MessageToastContextType } from "./types";

export const MessageToastContext =
  createContext<MessageToastContextType | null>(null);

export const useMessageToastContext = () => {
  const context = useContext(MessageToastContext);

  if (!context) {
    throw new Error("Using useMessageToastContext without Provider");
  }

  return context;
};
