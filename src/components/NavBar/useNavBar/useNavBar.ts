import { useLayoutEffect, useRef } from "react";
import { NavBarContextType } from "./types";
import { useNavBarContext } from "./NavBarContext";

type NavConfigKeys = Partial<
  Pick<NavBarContextType, "backLink" | "forwardLink" | "title">
>;

export const useNavBar = ({ backLink, forwardLink, title }: NavConfigKeys) => {
  const { setDefault, setBackLink, setForwardLink, setTitle } =
    useNavBarContext();

  const backLinkRef = useRef<NavConfigKeys["backLink"]>(backLink);
  const forwardLinkRef = useRef<NavConfigKeys["forwardLink"]>(forwardLink);
  const titleRef = useRef<NavConfigKeys["title"]>(title);

  useLayoutEffect(() => {
    const backLink = backLinkRef.current;
    const forwardLink = forwardLinkRef.current;
    const title = titleRef.current;

    if (backLink !== undefined) {
      setBackLink(backLink);
    }
    if (forwardLink !== undefined) {
      setForwardLink(forwardLink);
    }
    if (title) {
      setTitle(title);
      if (typeof title === "string") {
        document.title = title;
      }
    }
    return () => {
      setDefault();
    };
  }, [setDefault, setBackLink, setForwardLink, setTitle]);

  return { setBackLink, setForwardLink };
};
