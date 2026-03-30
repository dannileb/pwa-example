/// <reference lib="webworker" />
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import {
  NavigationRoute,
  registerRoute,
  setDefaultHandler,
} from "workbox-routing";
import { offlineFallback } from "workbox-recipes";
import { NetworkOnly } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

// self.__WB_MANIFEST - кеширование оболочки приложения
precacheAndRoute(self.__WB_MANIFEST);

// очищение устаревших ресурсов
cleanupOutdatedCaches();

/** @type {RegExp[] | undefined} */
let allowlist;
// кэширование только "/" в режиме разработки
if (import.meta.env.DEV) {
  allowlist = [/^\/$/];
}

// кэширование навигационных запросов для доступности приложения оффлайн
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { allowlist })
);

// отбработка остальных запросов только по сети, без кэша
setDefaultHandler(new NetworkOnly());

// fallback если остальные запросы выполяются оффлайн
offlineFallback({
  pageFallback: "./offline.html",
});

self.addEventListener("push", (event) => {
  const payloadJSON = event.data?.text();

  if (!payloadJSON) {
    return;
  }
  const payload = JSON.parse(payloadJSON);

  if (
    !("title" in payload && typeof payload.title === "string") ||
    !("body" in payload && typeof payload.body === "string")
  ) {
    return;
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
    })
  );
});
