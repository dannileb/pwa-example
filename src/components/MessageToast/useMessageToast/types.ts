import { ReactNode } from "react";

export interface Toast {
  id: ReturnType<Window["crypto"]["randomUUID"]>;
  text: string;
  type: "info" | "error";
  footer?: ReactNode;
}

export interface MessageToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => Toast["id"];
  removeToastById: (id: Toast["id"]) => void;
}
