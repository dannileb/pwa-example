import { Button } from "#/ui/Button/Button";
import classes from "./UpdateBadge.module.css";

import { useRegisterSW } from "virtual:pwa-register/react";

function UpdateBadge() {
  const period = 60 * 60 * 1000;

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target;
          if (sw instanceof ServiceWorker && sw.state === "activated")
            registerPeriodicSync(period, swUrl, r);
        });
      }
    },
  });

  function close() {
    setNeedRefresh(false);
  }

  return (
    <div
      className={classes.container}
      role="alert"
      aria-labelledby="toast-message"
    >
      {needRefresh && (
        <div className={classes.toast}>
          <div className={classes.toastMessage}>
            <span id="toast-message">
              Доступна новая версия приложения. Нажмите ниже, чтобы обновить
            </span>
          </div>
          <div className={classes.toastButtons}>
            <Button
              onPress={() => {
                updateServiceWorker(true);
                close();
              }}
            >
              Обновить
            </Button>
            <Button onPress={() => close()}>Закрыть</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateBadge;

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration
) {
  if (period <= 0) return;

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine) {
      return;
    }

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}
