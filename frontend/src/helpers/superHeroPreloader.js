// helpers/superHeroPreloader.js
import * as React from "react";

export function preload(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export function useAssetGate(urls = []) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let live = true;
    const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));

    (async () => {
      await Promise.all(uniqueUrls.map(preload));
      // If you use a webfont, wait for it too
      if (document?.fonts?.ready) {
        try { await document.fonts.ready; } catch {}
      }
      if (live) setReady(true);
    })();

    return () => { live = false; };
    // Join or JSON.stringify to avoid re-running on new array identities
  }, [JSON.stringify(urls)]);

  return ready;
}
