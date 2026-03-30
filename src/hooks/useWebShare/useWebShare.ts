import { useCallback, useMemo } from "react";

export const useWebShare = () => {
  const canShare = useMemo(() => {
    return "share" in navigator;
  }, []);

  const share = useCallback(async (data: ShareData) => {
    if (!navigator.canShare(data)) {
      return;
    }

    return navigator.share(data);
  }, []);
  return { canShare, share };
};
