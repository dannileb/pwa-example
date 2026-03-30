import { useCallback, useRef } from "react";

export const useWakeLock = () => {
  const wakeLockRef = useRef<WakeLockSentinel>(null);

  const request = useCallback(async () => {
    if (!("wakeLock" in navigator)) {
      console.warn("Screen Wake Lock API не поддерживается в этом браузере.");
      return;
    }
    if (wakeLockRef.current) {
      return;
    }

    try {
      const lock = await navigator.wakeLock.request("screen");
      wakeLockRef.current = lock;
      console.log("Блокировка экрана активирована.");

      lock.addEventListener("release", () => {
        console.log("Блокировка экрана снята системой.");
        wakeLockRef.current = null;
      });
    } catch {
      console.error(`Не удалось активировать блокировку`);
    }
  }, []);

  const release = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      console.log("Блокировка экрана снята вручную.");
    }
  }, []);

  return { request, release, isLocked: !!wakeLockRef.current };
};
