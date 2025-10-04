import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SuperHero.css";
import {preload, useAssetGate} from '../../helpers/superHeroPreloader';
gsap.registerPlugin(ScrollTrigger);
const isExport = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('export');



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

  // refs for scroll pinning
  const sectionRef = useRef(null);
  const tailImgRef = useRef(null);
  const tailRef = useRef(null);
  const splashRef = useRef(null);
  const splashImgRef = useRef(null);
  const shipWrapRef = useRef(null);
  const hasCompletedRef = useRef(false);
  const sunRef = useRef(null);
  const titleRef = useRef(null);



  // STATIC background (no boil)
  const bgSrc = `/hero/background1.${EXT}`;

  // Boiling bands
  const midFrames = useMemo(() => makeFramePaths("midground", 4, EXT), [EXT]);
  const fgFrames = useMemo(() => makeFramePaths("foreground", 4, EXT), [EXT]);

  

  //splash frames
  const splashFrames = useMemo(
    () => Array.from({ length: 7 }, (_, i) => `/hero/splash${i + 1}.png`),
    []
  );
  usePreload(splashFrames);

  // Boat paddle frames
  const boatFrames = useMemo(() => makeFramePaths("boat", 6, EXT), [EXT]);
  usePreload(boatFrames);

  usePreload([bgSrc]);
  usePreload(midFrames);
  usePreload(fgFrames);

  // Tail frames (7 total), then build a 1→7→1 ping-pong (13 frames)
  const tailFrames = useMemo(
    () => Array.from({ length: 7 }, (_, i) => `/hero/tail${i + 1}.png`),
    []
  );

  const tailPingPong = useMemo(
    () =>
      // forward [1..7] + backward [6..1] => 13 total
      tailFrames.concat(tailFrames.slice(0, -1).reverse()),
    [tailFrames]
  );

  usePreload(tailPingPong);

  // separate counters (different boil speeds)
  const [midFrame, setMidFrame] = useState(1);
  const [fgFrame, setFgFrame] = useState(2);

  useEffect(() => {
    const MID_MS = 200; // slower midground
    const FG_MS = 100; // faster foreground
    const midId = setInterval(() => setMidFrame((f) => (f + 1) & 3), MID_MS);
    const fgId = setInterval(() => setFgFrame((f) => (f + 1) & 3), FG_MS);
    return () => {
      clearInterval(midId);
      clearInterval(fgId);
    };
  }, []);

  // paddling on/off, current paddle frame
  const [isPaddling, setIsPaddling] = useState(false);
  const [boatIdx, setBoatIdx] = useState(0);

  // step the paddle frames ONLY while paddling
  useEffect(() => {
    if (!isPaddling) return;
    const MS = 90; // stroke feel; 70–120ms works well (faster = more urgency)
    const id = setInterval(() => {
      setBoatIdx((i) => (i + 1) % boatFrames.length);
    }, MS);
    return () => clearInterval(id);
  }, [isPaddling, boatFrames.length]);


  const critical = React.useMemo(() => [
    "/hero/boat1.png",          // base boat
    "/hero/stars.jpg",
    fgFrames[0], midFrames[0],  // first wave frames
  ], [fgFrames, midFrames]);
  
  const ready = useAssetGate(critical);
  
  // alignment + motion “dials”
  const tune = {
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

    // per-layer sway
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

    // boat bounce
    "--ship-bob-amp": "7px",
    "--ship-bob-dur": "1s",

    // SUN + BG initial states for scroll
    "--sun-size": "34vw",
    "--sun-x": "0px",
    "--sun-y": "50vh", // starts lower, will rise on scroll
    "--sun-rise-target": "-4vh",   
    "--sun-rot-dur": "60s",
    "--sun-brightness": "0.8", // starts dimmer, will brighten
    "--bg-opacity": "0", // starts black, will fade in

    "--nav-reveal-offset": "80vh", //nav reveal

    "--stars-opacity": "1", // starts visible
    "--bg-opacity": "0", // starts hidden (fade in)
    //ship wrap
    "--ship-x": "0px",
    "--ship-y": "0px",
    "--ship-scale": "1",
    "--ship-rot": "-20deg",
    "--ship-clip": "0%",   // 0% = no crop; increase to “dip” the hull
  };


  

  // Scroll-driven sunrise (pin & scrub)
  useLayoutEffect(() => {
    if (!ready) return;
  
    const el          = sectionRef.current;
    const tailEl      = tailRef.current;
    const tailImgEl   = tailImgRef.current;
    const splashEl    = splashRef.current;
    const splashImgEl = splashImgRef.current;
    const boatEl      = shipWrapRef.current;
    const sunEl = sunRef.current;

    if (!el || !tailEl || !tailImgEl || !splashEl || !splashImgEl || !boatEl || !sunEl) return;
  
    // --- clean start ---
    el.classList.remove("hero-final");
    gsap.killTweensOf(el);
    ScrollTrigger.getAll().forEach(t => { if (t.trigger === el) t.kill(true); });
  
    // helper to read CSS var from computed style – respects your `tune` inline style
    const getVar = (node, name, fallback) => {
      const v = getComputedStyle(node).getPropertyValue(name).trim();
      return v || fallback;
    };
    const SUN_Y_END = getVar(el, "--sun-rise-target", "-6vh");
  
    const ctx = gsap.context(() => {
      // set starting values FROM current (tune) values, not hard-coded
      gsap.set(el, {
        "--stars-opacity":  getVar(el, "--stars-opacity", "1"),
        "--bg-opacity":     getVar(el, "--bg-opacity", "0"),
        "--sun-y":          getVar(el, "--sun-y", "50vh"),
        "--sun-x":          getVar(el, "--sun-x", "0px"),
        "--sun-brightness": getVar(el, "--sun-brightness", "0.8"),
        "--ship-x":         getVar(el, "--ship-x", "0px"),
        "--ship-y":         getVar(el, "--ship-y", "0px"),
        "--ship-rot":       getVar(el, "--ship-rot", "-20deg"),
        "--ship-scale":     getVar(el, "--ship-scale", "1"),
        "--ship-clip":      getVar(el, "--ship-clip", "0%"),
      });
      // ensure boat is visible above FG at start
      gsap.set(boatEl, { zIndex: 25 });

      gsap.set(sunEl, {
          "--sun-y":          getVar(el, "--sun-y", "50vh"),   // inherits from tune
          "--sun-x":          getVar(el, "--sun-x", "0px"),
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
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // markers: true,
  
          onLeave(self) {
            // Paint last frame + mark done
            self.animation.progress(1).pause();
            hasCompletedRef.current = true;
            el.classList.add("hero-final");
          
            // Stop stateful bits
            setIsPaddling(false);
            gsap.set([tailEl, splashEl], { autoAlpha: 0 });
          
            // Remove pin + revert tweened inline styles
            self.kill(true);
            
            //keep boat behind foreground 
            boatEl.style.zIndex = "13";
            
        
            // Hand control to .hero-final by clearing inline sun vars
            if (sunEl && sunEl.style) {
              sunEl.style.removeProperty("--sun-y");
              sunEl.style.removeProperty("--sun-x");
              sunEl.style.removeProperty("--sun-brightness");
            }
            // Also clear any sun vars left on the parent (they override classes)
            el.style.removeProperty("--sun-y");
            el.style.removeProperty("--sun-brightness");
            // (no need to clear --sun-x on parent unless you set a final there)
          
            // Keep hero snug at top
            window.scrollTo(0, el.offsetTop);
            ScrollTrigger.refresh();
          },
          
          
  
          onEnterBack(self){
            if (!hasCompletedRef.current) return;
            el.classList.add("hero-final");
            self.animation.progress(1).pause();
          }
        }
      });
  
      // --- Sunrise ---
      tl.to(el, { duration: 0.5, "--bg-opacity": 1, ease: "none" }, 0)
        .to(el, { duration: 0.5, "--stars-opacity": 0, ease: "none" }, 0)
        .to(sunEl,  { duration: 0.5, "--sun-y": SUN_Y_END, ease: "power1.out" }, 0)
        .to(sunEl,  { duration: 0.5, "--sun-brightness": 1.15, ease: "none" }, 0.1);
  
      // --- Tail segment ---
      const SUNRISE_END = 0.6;
      const TAIL_DUR    = 1.2;
      const segStart    = SUNRISE_END;
      const segEnd      = SUNRISE_END + TAIL_DUR;
  
      tl.add("tailStart", segStart).add("tailEnd", segEnd);
      tl.set(tailEl, { autoAlpha: 1 }, "tailStart");
      tl.set(tailEl, { autoAlpha: 0 }, "tailEnd+=0.01");
  
      const proxy = { i: 0 };
      const total = tailPingPong.length;
      tl.to(proxy, {
        i: total - 1,
        duration: TAIL_DUR,
        ease: "none",
        onUpdate: () => {
          const idx = Math.round(proxy.i);
          const nextSrc = tailPingPong[idx];
          const img = tailImgEl;
          if (img && img.dataset.src !== nextSrc) {
            img.src = nextSrc;
            img.dataset.src = nextSrc;
          }
        }
      }, "tailStart");
  
      // --- Splash (overlap) ---
      const OVERLAP     = 0.08;
      const splashStart = segEnd - OVERLAP;
      const splashDur   = 0.40;
      const splashEnd   = splashStart + splashDur;
  
      tl.add("splashStart", splashStart).add("splashEnd", splashEnd);
      tl.set(splashEl, { autoAlpha: 0.65, scale: 0.92, yPercent: 0 }, "splashStart");
  
      const sProxy = { i: 0 }, sTotal = splashFrames.length;
      tl.to(sProxy, {
        i: sTotal - 1,
        duration: splashDur,
        ease: "power2.out",
        onUpdate: () => {
          const idx = Math.round(sProxy.i);
          const src = splashFrames[idx];
          const img = splashImgEl;
          if (img && img.dataset.src !== src) {
            img.src = src;
            img.dataset.src = src;
          }
        }
      }, "splashStart");
      tl.to(splashEl, { autoAlpha: 0, duration: 0.15, ease: "power1.out" }, "splashEnd");
  
      // --- Paddling window ---
      const LEAD = 0.33; // try 0.2–0.35 for taste

    tl.add("paddleStart", splashEnd)
      .call(() => setIsPaddling(true), null, "paddleStart")
      // tiny visual cue while still stationary
      .to(el, { "--ship-bob-amp": "11px", duration: 0.12, ease: "none" }, "paddleStart")
      .to(el, { "--ship-bob-amp": "9px",  duration: LEAD - 0.12, ease: "none" }, "paddleStart+=0.12");

    // --- Boat travel finale ---
    const TRAVEL_START = splashEnd + LEAD;
    const TRAVEL_MID   = TRAVEL_START + 0.55;
    const TRAVEL_END   = TRAVEL_START + 1.20;
  
      tl.call(() => setIsPaddling(true),  null, "travelStart");
      tl.call(() => setIsPaddling(false), null, "travelEnd");
  
      const A_DUR = TRAVEL_MID - TRAVEL_START;
      const NADIR_FRAC = 0.55;
      const NADIR_TIME = `travelStart+=${A_DUR * NADIR_FRAC}`;
  
      tl.to(el, {
        "--ship-x": "-18vw",
        "--ship-y": "70vh",
        duration: A_DUR * NADIR_FRAC,
        ease: "power2.in"
      }, "travelStart")
      .add("nadir", NADIR_TIME)
      .to(el, {
        "--ship-x": "-30vw",
        "--ship-y": "18vh",
        duration: A_DUR * (1 - NADIR_FRAC),
        ease: "power1.out"
      }, "nadir");
  
      tl.set(boatEl, { zIndex: 14 }, "travelStart+=0.20"); // hide behind FG
  
      tl.to(el, {
        "--ship-rot": "50deg",
        "--ship-scale": "2",
        duration: (TRAVEL_END - TRAVEL_MID) * 0.55,
        ease: "power2.out"
      }, "nadir");
  
      tl.to(".ship-img", { animationPlayState: "paused" }, "nadir");
      tl.to(".ship-img", { animationPlayState: "running" }, "travelEnd+=0.05");
  
      tl.to(el, {
        "--ship-x": "-30vw",
        "--ship-y": "20vh",
        duration: TRAVEL_END - TRAVEL_MID,
        ease: "power1.inOut"
      }, "travelMid");
  
      tl.set(boatEl, { zIndex: 13 }, "travelEnd-=0.18");
      tl.to(el, { "--ship-clip": "6%", duration: 0.18, ease: "none" }, "travelEnd-=0.18");
  
      // sync paddling state if user reloads mid-timeline
      const t0 = tl.time();
      setIsPaddling(t0 >= splashEnd && t0 < TRAVEL_END);
    }, sectionRef);
  
    // recalc after images finish layout
    requestAnimationFrame(() => ScrollTrigger.refresh());
  
    return () => ctx.revert();
  }, [ready, tailPingPong, splashFrames]);


  return (
    <section
      ref={sectionRef}
      className={`super-hero ${ready ? 'is-ready' : 'is-loading'} ${isExport ? 'export-mode' : ''}`}
      style={tune}
    >

      {/* Backdrops */}
      <div
          className="bg-stars layer"
          style={{ backgroundImage: 'url(/hero/stars.jpg)' }}
          aria-hidden="true"
        />
        <div
          className="bg-cover layer"
          style={{ backgroundImage: 'url(/hero/sunrise4.png)' }}
          aria-hidden="true"
        />


      {/* Stage: everything inside scales together + can fall back via CSS */}
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
  
        {/* Sun (behind waves) */}
        <div className="sun layer" ref={sunRef}>
          <img className="sun-img" src="/hero/sun.png" alt="" draggable="false" />
        </div>
  
        {/* Background band (no boil; still sways) */}
        <div className="band band-bg layer" aria-hidden="true">
          <img className="band-img" src={bgSrc} alt="" draggable="false" />
        </div>
  
        {/* Midground (boils slower) */}
        <div className="band band-mid layer" aria-hidden="true">
          <img
            className="band-img"
            src={midFrames[midFrame]}
            alt=""
            draggable="false"
          />
        </div>
  
        {/* Foreground (boils faster) */}
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
          style={{ '--splash-opacity': 0.7 }}
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
              src={isPaddling ? boatFrames[boatIdx] : '/hero/boat1.png'}
              alt=""
              draggable="false"
              width={1120}
              height={415}
            />
          </div>
        </div>
  
        {/* Sentinel for scroll/observer */}
        <div id="hero-sentinel" className="hero-sentinel layer" aria-hidden="true" />
      </div>
    </section>
  );
  
}


 