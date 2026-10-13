export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Check for service worker updates periodically
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                  console.info("SaathHisab: New update available. Refresh to activate.");
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn("SaathHisab: Service worker registration skipped or failed:", error);
        });
    });
  }
}
