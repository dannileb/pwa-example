interface IOSNavigator extends Navigator {
  standalone?: boolean;
}

export const SERVICE_WORKER_PATH = "sw.js";

export function getPWADisplayMode() {
  if (document.referrer.startsWith("android-app://")) return "twa";
  if (window.matchMedia("(display-mode: browser)").matches) return "browser";
  if (window.matchMedia("(display-mode: standalone)").matches)
    return "standalone";
  if (window.matchMedia("(display-mode: minimal-ui)").matches)
    return "minimal-ui";
  if (window.matchMedia("(display-mode: fullscreen)").matches)
    return "fullscreen";
  if (window.matchMedia("(display-mode: window-controls-overlay)").matches)
    return "window-controls-overlay";

  return "unknown";
}

export function isIOSNavigator(
  navigator: Navigator
): navigator is IOSNavigator {
  return (navigator as IOSNavigator).standalone !== undefined;
}

export function getIsIOSPlatform() {
  if (isIOSNavigator(navigator)) {
    return navigator.standalone ? "PWA" : "BROWSER";
  }
  return false;
}

export const getWebAuthnAvailability = async () => {
  try {
    if (
      !window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable
    ) {
      return false;
    }
    const isAvailable =
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return isAvailable;
  } catch (error) {
    console.error("WebAuthn check failed:", error);
    return false;
  }
};

export function haptic() {
  try {
    if (navigator.vibrate) {
      navigator.vibrate(50);
      return;
    }
    const labelEl = document.createElement("label");
    labelEl.ariaHidden = "true";
    labelEl.style.display = "none";

    const inputEl = document.createElement("input");
    inputEl.type = "checkbox";
    inputEl.setAttribute("switch", "");
    labelEl.appendChild(inputEl);

    document.head.appendChild(labelEl);
    labelEl.click();
    document.head.removeChild(labelEl);
  } catch (e) {
    console.debug(e);
  }
}
