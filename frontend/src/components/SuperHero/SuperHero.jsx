import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SuperHero.css";
import { useAssetGate } from "../../helpers/superHeroPreloader";

gsap.registerPlugin(ScrollTrigger);

const isExport =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("export");

function makeFramePaths(prefix, count = 4, ext = "png") {
  return Array.from(
    { length: count },
    (_, i) => `/hero/${prefix}${i + 1}.${ext}`
  );
}

function usePreload(paths) {
  useEffect(() => {
    paths.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [paths]);
}

export default function SuperHero() {
  const EXT = "png";

  // Refs
  const sectionRef = useRef(null);
  const tailImgRef = useRef(null);
  const tailRef = useRef(null);
  const splashRef = useRef(null);
  const splashImgRef = useRef(null);
  const shipWrapRef = useRef(null);
  const hasCompletedRef = useRef(false);
  const sunRef = useRef(null);
  const titleRef = useRef(null);

  // Static background
  const bgSrc = `/hero/background1.${EXT}`;

  // Boiling bands
  const midFrames = useMemo(() => makeFramePaths("midground", 4, EXT), [EXT]);
  const fgFrames = useMemo(() => makeFramePaths("foreground", 4, EXT), [EXT]);

  // Splash frames
  const splashFrames = useMemo(
    () => Array.from({ length: 7 }, (_, i) => `/hero/splash${i + 1}.png`),
    []
  );

  // Boat paddle frames
  const boatFrames = useMemo(() => makeFramePaths("boat", 6, EXT), [EXT]);

  // Tail frames
  const tailFrames = useMemo(
    () => Array.from({ length: 7 }, (_, i) => `/hero/tail${i + 1}.png`),
    []
  );

  const tailPingPong = useMemo(
    () => tailFrames.concat(tailFrames.slice(0, -1).reverse()),
    [tailFrames]
  );

  usePreload([bgSrc]);
  usePreload(midFrames);
  usePreload(fgFrames);
  usePreload(splashFrames);
  usePreload(boatFrames);
  usePreload(tailPingPong);

  // Boiling frame state
  const [midFrame, setMidFrame] = useState(1);
  const [fgFrame, setFgFrame] = useState(2);

  useEffect(() => {
    const MID_MS = 200;
    const FG_MS = 100;

    const midId = setInterval(() => {
      setMidFrame((f) => (f + 1) % midFrames.length);
    }, MID_MS);

    const fgId = setInterval(() => {
      setFgFrame((f) => (f + 1) % fgFrames.length);
    }, FG_MS);

    return () => {
      clearInterval(midId);
      clearInterval(fgId);
    };
  }, [midFrames.length, fgFrames.length]);

  // Boat paddling state
  const [isPaddling, setIsPaddling] = useState(false);
  const [boatIdx, setBoatIdx] = useState(0);

  useEffect(() => {
    if (!isPaddling) return;

    const MS = 90;
    const id = setInterval(() => {
      setBoatIdx((i) => (i + 1) % boatFrames.length);
    }, MS);

    return () => clearInterval(id);
  }, [isPaddling, boatFrames.length]);

  const critical = useMemo(
    () => [
      "/hero/boat1.png",
      "/hero/stars.jpg",
      fgFrames[0],
      midFrames[0],
    ],
    [fgFrames, midFrames]
  );

  const ready = useAssetGate(critical);

  const tune = useMemo(
    () => ({
      "--bg-bottom": "15%",
      "--mid-bottom": "15%",
      "--fg-bottom": "25%",
      "--bg-x": "0vw",
      "--mid-x": "0vw",
      "--fg-x": "0vw",

      "--ship-right": "0.5vw",
      "--ship-bottom": "10vh",

      "--title-top": "6vh",
      "--title-w": "clamp(420px, 35vw, 980px)",

      "--bg-drift-amp": "30px",
      "--bg-drift-dur": "5s",
      "--bg-bob-amp": "3px",
      "--bg-bob-dur": "8s",
      "--mid-drift-amp": "12px",
      "--mid-drift-dur": "7s",
      "--mid-bob-amp": "6px",
      "--mid-bob-dur": "6s",
      "--fg-drift-amp": "22px",
      "--fg-drift-dur": "4.5s",
      "--fg-bob-amp": "9px",
      "--fg-bob-dur": "4.6s",

      "--ship-bob-amp": "7px",
      "--ship-bob-dur": "1s",

      "--sun-size": "34vw",
      "--sun-x": "0px",
      "--sun-y": "50vh",
      "--sun-rise-target": "-4vh",
      "--sun-rot-dur": "60s",
      "--sun-brightness": "0.8",

      "--bg-opacity": "0",
      "--stars-opacity": "1",

      "--nav-reveal-offset": "80vh",

      "--ship-x": "0px",
      "--ship-y": "0px",
      "--ship-scale": "1",
      "--ship-rot": "-20deg",
      "--ship-clip": "0%",
    }),
    []
  );

  useLayoutEffect(() => {
    if (!ready) return;

    const el = sectionRef.current;
    const tailEl = tailRef.current;
    const tailImgEl = tailImgRef.current;
    const splashEl = splashRef.current;
    const splashImgEl = splashImgRef.current;
    const boatEl = shipWrapRef.current;
    const sunEl = sunRef.current;

    if (
      !el ||
      !tailEl ||
      !tailImgEl ||
      !splashEl ||
      !splashImgEl ||
      !boatEl ||
      !sunEl
    ) {
      return;
    }

    // Clean start.
    // Important: no kill(true), no scrollTo, no refresh inside onLeave.
    el.classList.remove("hero-final");
    hasCompletedRef.current = false;

    gsap.killTweensOf(el);
    gsap.killTweensOf(sunEl);
    gsap.killTweensOf(boatEl);

    // Safer HMR/dev cleanup.
    // Kills only this trigger id, without aggressive pin reversion.
    const oldTrigger = ScrollTrigger.getById("super-hero");
    if (oldTrigger) oldTrigger.kill(false);

    const getVar = (node, name, fallback) => {
      const value = getComputedStyle(node).getPropertyValue(name).trim();
      return value || fallback;
    };

    const SUN_Y_END = getVar(el, "--sun-rise-target", "-6vh");

    const ctx = gsap.context(() => {
      gsap.set(el, {
        "--stars-opacity": getVar(el, "--stars-opacity", "1"),
        "--bg-opacity": getVar(el, "--bg-opacity", "0"),
        "--sun-y": getVar(el, "--sun-y", "50vh"),
        "--sun-x": getVar(el, "--sun-x", "0px"),
        "--sun-brightness": getVar(el, "--sun-brightness", "0.8"),
        "--ship-x": getVar(el, "--ship-x", "0px"),
        "--ship-y": getVar(el, "--ship-y", "0px"),
        "--ship-rot": getVar(el, "--ship-rot", "-20deg"),
        "--ship-scale": getVar(el, "--ship-scale", "1"),
        "--ship-clip": getVar(el, "--ship-clip", "0%"),
      });

      gsap.set(boatEl, { zIndex: 25 });

      gsap.set(sunEl, {
        "--sun-y": getVar(el, "--sun-y", "50vh"),
        "--sun-x": getVar(el, "--sun-x", "0px"),
        "--sun-brightness": getVar(el, "--sun-brightness", "0.8"),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "super-hero",
          trigger: el,
          start: "top top",
          end: "+=160%",
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // markers: true,

          onLeave(self) {
            // Paint final frame, but do not destroy ScrollTrigger.
            self.animation.progress(1);

            hasCompletedRef.current = true;
            el.classList.add("hero-final");

            setIsPaddling(false);
            gsap.set([tailEl, splashEl], { autoAlpha: 0 });

            boatEl.style.zIndex = "13";

            if (sunEl && sunEl.style) {
              sunEl.style.removeProperty("--sun-y");
              sunEl.style.removeProperty("--sun-x");
              sunEl.style.removeProperty("--sun-brightness");
            }

            el.style.removeProperty("--sun-y");
            el.style.removeProperty("--sun-brightness");
          },

          onEnterBack(self) {
            if (!hasCompletedRef.current) return;

            self.animation.progress(1);
            el.classList.add("hero-final");
          },
        },
      });

      // --- Sunrise ---
      tl.to(el, { duration: 0.5, "--bg-opacity": 1, ease: "none" }, 0)
        .to(el, { duration: 0.5, "--stars-opacity": 0, ease: "none" }, 0)
        .to(
          sunEl,
          {
            duration: 0.5,
            "--sun-y": SUN_Y_END,
            ease: "power1.out",
          },
          0
        )
        .to(
          sunEl,
          {
            duration: 0.5,
            "--sun-brightness": 1.15,
            ease: "none",
          },
          0.1
        );

      // --- Tail segment ---
      const SUNRISE_END = 0.6;
      const TAIL_DUR = 1.2;
      const segStart = SUNRISE_END;
      const segEnd = SUNRISE_END + TAIL_DUR;

      tl.add("tailStart", segStart);
      tl.add("tailEnd", segEnd);

      tl.set(tailEl, { autoAlpha: 1 }, "tailStart");
      tl.set(tailEl, { autoAlpha: 0 }, "tailEnd+=0.01");

      const tailProxy = { i: 0 };
      const tailTotal = tailPingPong.length;

      tl.to(
        tailProxy,
        {
          i: tailTotal - 1,
          duration: TAIL_DUR,
          ease: "none",
          onUpdate: () => {
            const idx = Math.round(tailProxy.i);
            const nextSrc = tailPingPong[idx];

            if (tailImgEl && tailImgEl.dataset.src !== nextSrc) {
              tailImgEl.src = nextSrc;
              tailImgEl.dataset.src = nextSrc;
            }
          },
        },
        "tailStart"
      );

      // --- Splash segment ---
      const OVERLAP = 0.08;
      const splashStart = segEnd - OVERLAP;
      const splashDur = 0.4;
      const splashEnd = splashStart + splashDur;

      tl.add("splashStart", splashStart);
      tl.add("splashEnd", splashEnd);

      tl.set(
        splashEl,
        {
          autoAlpha: 0.65,
          scale: 0.92,
          yPercent: 0,
        },
        "splashStart"
      );

      const splashProxy = { i: 0 };
      const splashTotal = splashFrames.length;

      tl.to(
        splashProxy,
        {
          i: splashTotal - 1,
          duration: splashDur,
          ease: "power2.out",
          onUpdate: () => {
            const idx = Math.round(splashProxy.i);
            const src = splashFrames[idx];

            if (splashImgEl && splashImgEl.dataset.src !== src) {
              splashImgEl.src = src;
              splashImgEl.dataset.src = src;
            }
          },
        },
        "splashStart"
      );

      tl.to(
        splashEl,
        {
          autoAlpha: 0,
          duration: 0.15,
          ease: "power1.out",
        },
        "splashEnd"
      );

      // --- Paddling window ---
      const LEAD = 0.33;

      tl.add("paddleStart", splashEnd);

      tl.call(() => setIsPaddling(true), null, "paddleStart")
        .to(
          el,
          {
            "--ship-bob-amp": "11px",
            duration: 0.12,
            ease: "none",
          },
          "paddleStart"
        )
        .to(
          el,
          {
            "--ship-bob-amp": "9px",
            duration: LEAD - 0.12,
            ease: "none",
          },
          "paddleStart+=0.12"
        );

      // --- Boat travel finale ---
      const TRAVEL_START = splashEnd + LEAD;
      const TRAVEL_MID = TRAVEL_START + 0.55;
      const TRAVEL_END = TRAVEL_START + 1.2;

      // These labels must exist before being referenced.
      tl.add("travelStart", TRAVEL_START);
      tl.add("travelMid", TRAVEL_MID);
      tl.add("travelEnd", TRAVEL_END);

      tl.call(() => setIsPaddling(true), null, "travelStart");
      tl.call(() => setIsPaddling(false), null, "travelEnd");

      const A_DUR = TRAVEL_MID - TRAVEL_START;
      const NADIR_FRAC = 0.55;
      const NADIR_TIME = `travelStart+=${A_DUR * NADIR_FRAC}`;

      tl.to(
        el,
        {
          "--ship-x": "-18vw",
          "--ship-y": "70vh",
          duration: A_DUR * NADIR_FRAC,
          ease: "power2.in",
        },
        "travelStart"
      )
        .add("nadir", NADIR_TIME)
        .to(
          el,
          {
            "--ship-x": "-30vw",
            "--ship-y": "18vh",
            duration: A_DUR * (1 - NADIR_FRAC),
            ease: "power1.out",
          },
          "nadir"
        );

      tl.set(boatEl, { zIndex: 14 }, "travelStart+=0.20");

      tl.to(
        el,
        {
          "--ship-rot": "50deg",
          "--ship-scale": "2",
          duration: (TRAVEL_END - TRAVEL_MID) * 0.55,
          ease: "power2.out",
        },
        "nadir"
      );

      tl.to(".ship-img", { animationPlayState: "paused" }, "nadir");

      tl.to(
        ".ship-img",
        { animationPlayState: "running" },
        "travelEnd+=0.05"
      );

      tl.to(
        el,
        {
          "--ship-x": "-30vw",
          "--ship-y": "20vh",
          duration: TRAVEL_END - TRAVEL_MID,
          ease: "power1.inOut",
        },
        "travelMid"
      );

      tl.set(boatEl, { zIndex: 13 }, "travelEnd-=0.18");

      tl.to(
        el,
        {
          "--ship-clip": "6%",
          duration: 0.18,
          ease: "none",
        },
        "travelEnd-=0.18"
      );
    }, sectionRef);

    const refreshId = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshId);
      setIsPaddling(false);
      ctx.revert();
    };
  }, [ready, tailPingPong, splashFrames, boatFrames.length]);

  return (
    <section
      ref={sectionRef}
      className={`super-hero ${ready ? "is-ready" : "is-loading"} ${
        isExport ? "export-mode" : ""
      }`}
      style={tune}
    >
      {/* Backdrops */}
      <div
        className="bg-stars layer"
        style={{ backgroundImage: "url(/hero/stars.jpg)" }}
        aria-hidden="true"
      />

      <div
        className="bg-cover layer"
        style={{ backgroundImage: "url(/hero/sunrise4.png)" }}
        aria-hidden="true"
      />

      <div className="hero-stage">
        {/* Title */}
        <img
          ref={titleRef}
          className="hero-title layer"
          src="/hero/title.svg"
          alt="Ahab’s Dream"
          draggable="false"
          decoding="async"
          loading="eager"
        />

        {/* Sun */}
        <div className="sun layer" ref={sunRef}>
          <img
            className="sun-img"
            src="/hero/sun.png"
            alt=""
            draggable="false"
          />
        </div>

        {/* Background band */}
        <div className="band band-bg layer" aria-hidden="true">
          <img className="band-img" src={bgSrc} alt="" draggable="false" />
        </div>

        {/* Midground */}
        <div className="band band-mid layer" aria-hidden="true">
          <img
            className="band-img"
            src={midFrames[midFrame]}
            alt=""
            draggable="false"
          />
        </div>

        {/* Foreground */}
        <div className="band band-fg layer" aria-hidden="true">
          <img
            className="band-img"
            src={fgFrames[fgFrame]}
            alt=""
            draggable="false"
          />
        </div>

        {/* Splash */}
        <div ref={splashRef} className="splash layer" aria-hidden="true">
          <img
            ref={splashImgRef}
            className="splash-img"
            src="/hero/splash1.png"
            alt=""
            draggable="false"
          />
        </div>

        {/* Tail */}
        <div
          ref={tailRef}
          className="tail layer"
          aria-hidden="true"
          style={{ "--splash-opacity": 0.7 }}
        >
          <img
            ref={tailImgRef}
            className="tail-img"
            src="/hero/tail1.png"
            alt=""
            draggable="false"
          />
        </div>

        {/* Boat */}
        <div ref={shipWrapRef} className="ship-wrap layer">
          <div className="ship-bob">
            <img
              className="ship-img"
              src={isPaddling ? boatFrames[boatIdx] : "/hero/boat1.png"}
              alt=""
              draggable="false"
              width={1120}
              height={415}
            />
          </div>
        </div>

        <div
          id="hero-sentinel"
          className="hero-sentinel layer"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}