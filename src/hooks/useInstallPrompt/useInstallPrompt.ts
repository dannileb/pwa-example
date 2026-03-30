import { useCallback, useState, useSyncExternalStore } from "react";

interface UserChoice {
  outcome: "accepted" | "dismissed";
  platform: string;
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<UserChoice>;
  prompt(): Promise<UserChoice>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  listeners.forEach((callback) => callback());
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  listeners.forEach((cb) => cb());
});

const promptStore = {
  subscribe: (callback: () => void): (() => void) => {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },
  getSnapshot: () => {
    return deferredPrompt;
  },
};

export const useInstallPrompt = () => {
  const prompt = useSyncExternalStore(
    promptStore.subscribe,
    promptStore.getSnapshot
  );
  const [isRejected, setIsRejected] = useState<boolean>(false);

  const invokePrompt = useCallback(async () => {
    if (!prompt) {
      return;
    }
    const result = await prompt.prompt();
    if (result.outcome === "dismissed") {
      setIsRejected(true);
    }
    deferredPrompt = null;
    listeners.forEach((cb) => cb());
  }, [prompt]);

  return {
    isRejected,
    invokePrompt,
    canInstall: !!prompt,
  };
};
