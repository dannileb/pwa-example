import { SetStateAction } from "react";

export interface NavBarLink {
  url: string;
  text?: string;
}

export interface NavBarContextType {
  backLink: NavBarLink | undefined;
  forwardLink: NavBarLink | undefined;
  setBackLink: React.Dispatch<SetStateAction<NavBarLink | undefined>>;
  setForwardLink: React.Dispatch<SetStateAction<NavBarLink | undefined>>;
  title: React.ReactNode;
  setTitle: React.Dispatch<SetStateAction<React.ReactNode>>;
  setDefault: () => void;
}
