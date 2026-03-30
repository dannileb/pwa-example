import { ReactNode, useCallback, useMemo, useState } from "react";
import { NavBarContext } from "./NavBarContext";
import { NavBarContextType, NavBarLink } from "./types";

export const NavBarProvider = ({ children }: { children: ReactNode }) => {
  const [backLink, setBackLink] = useState<NavBarLink>();
  const [forwardLink, setForwardLink] = useState<NavBarLink>();
  const [title, setTitle] = useState<ReactNode>();

  const setDefault = useCallback(() => {
    setBackLink(undefined);
    setForwardLink(undefined);
    setTitle("PWA Example");
  }, []);
  const value = useMemo(
    (): NavBarContextType => ({
      backLink,
      setBackLink,
      forwardLink,
      setForwardLink,
      title,
      setTitle,
      setDefault,
    }),
    [backLink, forwardLink, setDefault, title]
  );

  return (
    <NavBarContext.Provider value={value}>{children}</NavBarContext.Provider>
  );
};
