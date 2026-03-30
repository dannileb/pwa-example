import { createContext, useContext } from "react";
import { NavBarContextType } from "./types";

export const NavBarContext = createContext<NavBarContextType | null>(null);

export const useNavBarContext = () => {
  const context = useContext(NavBarContext);

  if (!context) {
    throw new Error("Using useNavBarContext without Provider");
  }

  return context;
};
