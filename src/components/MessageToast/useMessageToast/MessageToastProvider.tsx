import { ReactNode, useCallback, useState } from "react";
import { MessageToastContext } from "./MessageToastContext";
import { Toast } from "./types";

const MAX_TOASTS = 3;

export const MessageToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = window.crypto.randomUUID();
    setToasts((prevToasts) => {
      const updatedToasts = [...prevToasts, { id, ...toast }];

      return updatedToasts.length > MAX_TOASTS
        ? updatedToasts.slice(-MAX_TOASTS)
        : updatedToasts;
    });
    return id;
  }, []);

  const removeToastById = useCallback((id: Toast["id"]) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <MessageToastContext.Provider value={{ toasts, addToast, removeToastById }}>
      {children}
    </MessageToastContext.Provider>
  );
};
