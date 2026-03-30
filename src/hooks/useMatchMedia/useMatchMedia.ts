import { useEffect, useState } from "react";

export const useMatchMedia = (query: string) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mathcMedia = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mathcMedia.addEventListener("change", handler);
    return () => mathcMedia.removeEventListener("change", handler);
  }, [query]);

  return matches;
};
