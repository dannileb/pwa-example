import { ReactNode } from "react";

export interface SectionCardType {
  title: string;
  description: string;
  icon?: ReactNode;
  onClick?: () => void;
  onLongPress?: () => void;
}
