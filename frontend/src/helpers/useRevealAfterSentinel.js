import { useEffect, useState } from "react";

export default function useRevealAfterSentinel(id = "hero-sentinel", rootMargin = "0px") {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      // Show navbar when the sentinel is NOT visible (we’ve scrolled past the hero)
      setVisible(!entry.isIntersecting);
    }, { root: null, rootMargin, threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [id, rootMargin]);
  return visible;
}
