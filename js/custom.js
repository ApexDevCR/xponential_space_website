/* ═══════════════════════════ INITIALIZATION ═══════════════════ */
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

document.addEventListener("DOMContentLoaded", () => {
  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  // Initialize header state
  const header = document.querySelector("header");
  if (header) {
    header.classList.add("header-visible");
  }

  /* ═══════════════════════ LENIS SMOOTH SCROLL ═══════════════ */
  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1.05,
  });
  window._lenis = lenis;

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  window.addEventListener("load", () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      if (lenis && typeof lenis.scrollTo === "function") {
        lenis.scrollTo(0, { duration: 0 });
      }
      ScrollTrigger.refresh();
      handleAllScroll();
    }, 50);
  });

  /* ═══════════════════════ BANNER FADE-UP ANIMATION — run early ══════════ */
  (function animateBanner() {
    const tl = gsap.timeline();
    tl.to(".bnnr_title", {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power3.out",
    }).to(
      ".bnnr_subtitle",
      { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" },
      "-=0.2",
    );
  })();

  /* GSAP PINNING LOGIC disabled: scroll animation removed per request */

  /* ═══════════════════════ SLICK SLIDERS ═════════════════════ */
  $(".work_sldr").slick({
    dots: true,
    arrows: true,
    infinite: false,
    speed: 600,
    slidesToShow: 4,
    autoplay: false,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  });

  $(".team_sldr").slick({
    dots: true,
    arrows: true,
    infinite: false,
    speed: 600,
    slidesToShow: 4,
    autoplay: false,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  });

  document.querySelectorAll('[data-bs-toggle="tab"]').forEach(function (tab) {
    tab.addEventListener('shown.bs.tab', function () {
      $('.slick-slider').slick('setPosition');
    });
  });

  const newsSlickConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    arrows: true,
    dots: false,
    speed: 400,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 560, settings: { slidesToShow: 1 } },
    ],
  };

  function updateSliderUI($slider) {
    const $pane = $slider.closest(".tab-pane, .slider-container-wrap");
    const $fill = $pane.find(".slider-progress-fill");
    const $prev = $pane.find(".prev-btn");
    const $next = $pane.find(".next-btn");

    const slickObj = $slider.slick("getSlick");
    const current = $slider.slick("slickCurrentSlide");
    const slidesToShow = $slider.slick("slickGetOption", "slidesToShow");

    const maxSlide = slickObj.slideCount - slidesToShow;

    let pct = 0;

    if (slickObj.slideCount > slidesToShow) {
      pct = ((current + 1) / (maxSlide + 1)) * 100;
    }

    $fill.css("width", Math.min(pct, 100) + "%");

    $prev.toggleClass("disabled", current <= 0);
    $next.toggleClass("disabled", current >= maxSlide);
  }

  $(".news-slider").each(function () {
    const $s = $(this);
    const $pane = $s.closest(".tab-pane");
    $s.slick(newsSlickConfig);
    updateSliderUI($s);
    $s.on("afterChange", () => updateSliderUI($s));
    $pane.find(".prev-btn").on("click", function () {
      if (!$(this).hasClass("disabled")) $s.slick("slickPrev");
    });
    $pane.find(".next-btn").on("click", function () {
      if (!$(this).hasClass("disabled")) $s.slick("slickNext");
    });
  });

  $("#newsTabs button").on("shown.bs.tab", function (e) {
    const target = $(e.target).data("bs-target");
    const $slider = $(target).find(".news-slider");
    if ($slider.length) {
      $slider.slick("setPosition");
      updateSliderUI($slider);
    }
  });

  /* ═══════════════════════ STARS GENERATOR ═══════════════════ */
  const starWrap = document.getElementById("stars-layer");
  if (starWrap) {
    for (let i = 0; i < 220; i++) {
      const el = document.createElement("div");
      el.className = "star";
      const sz = (Math.random() * 2.2 + 0.5).toFixed(2);
      const lo = (Math.random() * 0.3 + 0.05).toFixed(2);
      el.style.cssText = `width:${sz}px;height:${sz}px;
        top:${(Math.random() * 100).toFixed(2)}%;left:${(Math.random() * 100).toFixed(2)}%;
        --dur:${(Math.random() * 3 + 2).toFixed(1)}s;--delay:${(Math.random() * 5).toFixed(1)}s;
        --lo:${lo};opacity:${lo};`;
      starWrap.appendChild(el);
    }
  }

  /* ═══════════════════════ COUNTER LOGIC ═════════════════════ */
  const counters = document.querySelectorAll(".counter");
  const easeOut = (t) => 1 - Math.pow(1 - t, 1.5);

  const runCounter = (el) => {
    const target = +el.getAttribute("data-target");
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    let start = null;
    const step = (now) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / 6000, 1);
      const currentVal = Math.floor(easeOut(progress) * target);
      el.innerText = prefix + currentVal + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.innerText = prefix + target + suffix;
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => runCounter(entry.target), 400);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 1 },
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ═══════════════════════ GLOBE & SCROLL STORY ══════════════ */
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const easeOut2 = (t) => 1 - Math.pow(1 - t, 2);
  const easeOut3 = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const globeEls = {
    header: $("header"),
    story: document.getElementById("scroll-story"),
    stars: document.getElementById("stars-layer"),
    globe: document.getElementById("globe"),
    ring: document.getElementById("tick-ring"),
    glow: document.getElementById("glow-disc"),
    head: document.getElementById("headline"),
    stats: document.getElementById("stat-block"),
    valMain: document.getElementById("val-main"),
    hint: document.getElementById("scroll-hint"),
    curve: document.getElementById("curve-svg"),
  };

  let headerStickyPos = globeEls.header.length
    ? globeEls.header.offset().top
    : 0;

  // Variables for header hide/show on scroll
  let lastScrollY = window.scrollY;
  let isHeaderHidden = false;

  /* ═══════════════════════════════════════════════════════════
   * ARC PATH — getPointAtLength approach
   *
   * We inject a hidden <svg> into <body> containing the EXACT
   * same path as your curved-svg.svg. The browser parses the
   * bezier and getPointAtLength() samples it at any position.
   * This is pixel-perfect and works for any curve shape.
   *
   * ARC_T_START / ARC_T_END define which portion of the full
   * path length is "visible" inside the image's viewBox.
   *   0.0 = very start of the path (off-screen top-right)
   *   1.0 = very end  of the path (bottom-left corner)
   *
   * The visible segment runs roughly 0.43 → 1.00.
   * Increase ARC_T_START if the dot starts too far right/up.
   * Decrease ARC_T_START if it starts too far left/down.
   * ═══════════════════════════════════════════════════════════ */
  const ARC_T_START = 1.0; // entry: bottom-left corner (2025 start)
  const ARC_T_END = 0.43; // exit : top-right visible edge (2035 end)

  let _arcPath = null;
  let _arcPathLen = 0;

  function ensureArcPath() {
    if (_arcPath) return;
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 1280 677");
    svg.style.cssText =
      "position:fixed;top:-9999px;left:-9999px;width:1280px;height:677px;pointer-events:none;visibility:hidden;";
    const path = document.createElementNS(ns, "path");
    // ← exact path data from your curved-svg.svg
    path.setAttribute("d", "m1592-991c0 920.11-712.76 1666-1592 1666");
    svg.appendChild(path);
    document.body.appendChild(svg);
    _arcPath = path;
    _arcPathLen = path.getTotalLength();
  }

  /**
   * getArcScreenPoint(curveT, imgRect, parRect)
   *
   * curveT  0 → bottom-left of image (2025 — arc start)
   *         1 → top-right of image   (2035 — arc end, growth direction)
   *
   * Returns {x, y} in px relative to parRect (sticky-layer).
   */
  function getArcScreenPoint(curveT, imgRect, parRect) {
    ensureArcPath();

    // Sample within the visible segment only
    const pathT = lerp(ARC_T_START, ARC_T_END, curveT);
    const pt = _arcPath.getPointAtLength(pathT * _arcPathLen);

    // pt.x / pt.y are in the SVG's own viewBox (1280 × 677).
    // Scale to the <img> element's rendered pixels on screen.
    const scaleX = imgRect.width / 1280;
    const scaleY = imgRect.height / 677;

    return {
      x: imgRect.left - parRect.left + pt.x * scaleX,
      y: imgRect.top - parRect.top + pt.y * scaleY,
    };
  }

  /* ═══════════════════════════════════════════════════════════
   * OPACITY VALLEY — bright at start & end, dim in the middle
   *
   * VALLEY_DEPTH: how dim the midpoint gets (0 = no dip, 1 = invisible)
   * ═══════════════════════════════════════════════════════════ */
  const VALLEY_DEPTH = 0.8;

  function valleyOpacity(curveT) {
    // |curveT*2 - 1| is 1 at both ends and 0 at the midpoint
    return 1 - VALLEY_DEPTH * (1 - Math.abs(curveT * 2 - 1));
  }

  /* ═══════════════════════════════════════════════════════════
   * MAIN SCROLL HANDLER
   * ═══════════════════════════════════════════════════════════ */
  function handleAllScroll() {
    const scrollY = window.scrollY;

    // Handle header scrolled class
    if (scrollY > 200) globeEls.header.addClass("scrolled");
    else globeEls.header.removeClass("scrolled");

    // Handle header hide/show on scroll direction
    const scrollDelta = scrollY - lastScrollY;
    const scrollThreshold = 10; // Minimum scroll distance to trigger hide/show

    if (Math.abs(scrollDelta) > scrollThreshold) {
      if (scrollDelta > 0 && scrollY > 100) {
        // Scrolling down - hide header
        if (!isHeaderHidden) {
          globeEls.header
            .removeClass("header-visible")
            .addClass("header-hidden");
          isHeaderHidden = true;
        }
      } else if (scrollDelta < 0) {
        // Scrolling up - show header
        if (isHeaderHidden) {
          globeEls.header
            .removeClass("header-hidden")
            .addClass("header-visible");
          isHeaderHidden = false;
        }
      }
    }

    lastScrollY = scrollY;

    if (!globeEls.story) return;
    const storyTop = globeEls.story.getBoundingClientRect().top + scrollY;
    const storyH = globeEls.story.offsetHeight;
    const vh = window.innerHeight;

    const rawP = clamp01((scrollY - storyTop) / storyH);
    const p1 = clamp01((scrollY - storyTop) / vh);
    const p2 = clamp01((scrollY - storyTop - vh) / vh);
    const p3 = clamp01((scrollY - storyTop - 2 * vh) / vh);

    if (globeEls.stars) globeEls.stars.style.opacity = clamp01(1 - p2 * 1.8);
    if (globeEls.hint) globeEls.hint.style.opacity = clamp01(1 - p1 * 5);

    /* ── Globe ── */
    let sc, gray, bri;
    if (rawP < 0.25) {
      const t = easeOut2(rawP / 0.25);
      sc = lerp(0.7, 1.0, t);
      gray = 1;
      bri = lerp(0.7, 0.75, t);
    } else if (rawP < 0.5) {
      const t = easeInOut((rawP - 0.25) / 0.25);
      sc = lerp(1.0, 0.88, t);
      gray = lerp(1, 0, t);
      bri = lerp(0.58, 0.75, t);
      if (globeEls.glow)
        globeEls.glow.style.background = `radial-gradient(circle, rgba(${Math.round(lerp(255, 180, t))},${Math.round(lerp(255, 235, t))},255,${lerp(0.06, 0.35, t)}) 0%, transparent 68%)`;
    } else {
      const t = easeOut2(Math.max(0, (rawP - 0.5) / 0.25));
      sc = rawP < 0.75 ? lerp(0.88, 0.8, t) : 0.8;
      gray = 0;
      bri = 0.75;
    }

    if (globeEls.globe) {
      globeEls.globe.style.transform = `scale(${sc})`;
      globeEls.globe.style.filter = `grayscale(${gray}) brightness(${bri}) blur(${4 * (1 - clamp01(p2))}px)`;
    }
    if (globeEls.ring)
      globeEls.ring.style.transform = `scale(${sc * 1.3}) rotate(${rawP * 160}deg)`;
    if (globeEls.glow) globeEls.glow.style.transform = `scale(${sc * 1.04})`;

    /* ── Headline ── */
    let hS, hO;
    if (rawP < 0.3) {
      hS = lerp(0.3, 1.2, easeOut2(rawP / 0.3));
      hO = lerp(1.0, 0.3, easeOut2(rawP / 0.3));
    } else if (rawP < 0.65) {
      hS = lerp(1.2, 0.3, easeInOut((rawP - 0.3) / 0.35));
      hO = lerp(0.3, 0, easeInOut((rawP - 0.3) / 0.35));
    } else {
      hS = 0;
      hO = 0;
    }
    if (globeEls.head) {
      globeEls.head.style.transform = `scale(${hS})`;
      globeEls.head.style.opacity = hO;
    }

    /* ── Curve + journey-year + stat-block ── */
    if (p3 > 0) {
      const t = easeOut3(p3);

      /* Curve image reveal */
      if (globeEls.curve) {
        globeEls.curve.style.opacity = clamp01(t * 2);
        globeEls.curve.style.visibility = "visible";
        globeEls.curve.style.clipPath = `inset(${Math.round((1 - t) * 100)}% 0% 0% 0%)`;
      }

      /* Journey year — fixed 2025 anchor + traveling current-year label */
      const journeyYear = document.getElementById("journey-year");

      // Lazily create the traveling label once
      let travelLabel = document.getElementById("journey-year-travel");
      if (!travelLabel && journeyYear && journeyYear.parentElement) {
        travelLabel = document.createElement("div");
        travelLabel.id = "journey-year-travel";
        travelLabel.style.cssText = `
          position: absolute;
          pointer-events: none;
          visibility: hidden;
          opacity: 0;
          color: ${window.getComputedStyle(journeyYear).color || "#f60504"};
          font-size: ${window.getComputedStyle(journeyYear).fontSize || "14px"};
          font-weight: 500;
          font-family: inherit;
          white-space: nowrap;
          letter-spacing: 0.05em;
        `;
        journeyYear.parentElement.appendChild(travelLabel);
      }

      if (journeyYear && globeEls.curve) {
        const imgRect = globeEls.curve.getBoundingClientRect();
        const parRect = globeEls.curve.parentElement.getBoundingClientRect();

        /* ── Fixed 2025 label — always pinned at the arc's bottom-left start ── */
        const startPt = getArcScreenPoint(0, imgRect, parRect);
        journeyYear.style.left = startPt.x + 50 + "px";
        journeyYear.style.top = startPt.y - 25 + "px";
        journeyYear.style.transform = "translate(-50%, -100%)";
        journeyYear.style.visibility = "visible";
        journeyYear.style.opacity = clamp01(t * 5);
        journeyYear.textContent = "2025";
      }

      /* Counter value animates $630B → $1.8T */
      const cp = clamp01((rawP - 0.52) / (0.88 - 0.52));
      const ce = easeOut3(cp);

      if (globeEls.valMain) {
        const val = lerp(630, 1800, ce);
        globeEls.valMain.textContent =
          val < 1000
            ? "$" + Math.round(val) + "B"
            : "$" + (val / 1000).toFixed(1) + "T";
      }

      /* ── Traveling label — moves along arc, shows current year ── */
      if (travelLabel && globeEls.curve) {
        const imgRect = globeEls.curve.getBoundingClientRect();
        const parRect = globeEls.curve.parentElement.getBoundingClientRect();
        const curveT = Math.pow(clamp01(t), 1.4);

        // Only show once it has visibly separated from the 2025 anchor
        if (curveT > 0.08) {
          const { x, y } = getArcScreenPoint(curveT, imgRect, parRect);
          const fadeIn = clamp01(t * 5);
          const opacity = fadeIn * valleyOpacity(curveT);

          travelLabel.textContent = Math.round(lerp(2025, 2035, ce));
          travelLabel.style.left = x + "px";
          travelLabel.style.top = y - 18 + "px";
          travelLabel.style.transform = "translate(-50%, -100%)";
          travelLabel.style.visibility = "visible";
          travelLabel.style.opacity = opacity;
        } else {
          travelLabel.style.visibility = "hidden";
          travelLabel.style.opacity = "0";
        }
      }

      /* Stat block */
      if (globeEls.stats) {
        globeEls.stats.style.opacity = clamp01(t * 2.5);
        globeEls.stats.style.visibility = "visible";
        globeEls.stats.style.transform = `translateX(-50%) translateY(${lerp(24, 0, t)}px)`;
      }
    } else {
      /* Reset everything when above this section */
      if (globeEls.curve) {
        globeEls.curve.style.opacity = 0;
        globeEls.curve.style.visibility = "hidden";
        globeEls.curve.style.clipPath = "inset(100% 0% 0% 0%)";
      }
      if (globeEls.stats) {
        globeEls.stats.style.opacity = 0;
        globeEls.stats.style.visibility = "hidden";
      }
      const journeyYear = document.getElementById("journey-year");
      if (journeyYear) {
        journeyYear.style.visibility = "hidden";
        journeyYear.style.opacity = 0;
      }
      const travelLabelReset = document.getElementById("journey-year-travel");
      if (travelLabelReset) {
        travelLabelReset.style.visibility = "hidden";
        travelLabelReset.style.opacity = 0;
      }
      if (globeEls.valMain) globeEls.valMain.textContent = "$630B";
    }
  }

  lenis.on("scroll", handleAllScroll);
  window.addEventListener("resize", handleAllScroll, { passive: true });
  handleAllScroll();
  setTimeout(() => {
    if (globeEls.hint) globeEls.hint.style.opacity = "1";
  }, 800);

  /* ═══════════════════════ ADDITIONAL ANIMATIONS ══════════════ */
  const lineVTarget = Math.min(window.innerHeight * 1, 130);
  const lineHHalf = Math.min(window.innerWidth * 0.275, 200);

  function animateShootingStar(starEl, direction) {
    const container = starEl.parentElement;
    const arinnr = container.querySelector(".arinnr");
    const textEl = document.querySelector(".typing-text");
    if (!textEl || !arinnr) return;

    function getPosition(progress) {
      const containerRect = container.getBoundingClientRect();
      const textRect = textEl.getBoundingClientRect();
      const startX = direction === "left" ? 0 : containerRect.width;
      const endX = textRect.left + textRect.width / 2 - containerRect.left;
      const startY = arinnr.offsetHeight * 0.9;
      const endY = 10;
      return {
        x: startX + (endX - startX) * progress,
        y: startY + (endY - startY) * progress,
      };
    }

    let startTime = null;
    const duration = 600;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedP = 1 - Math.pow(1 - progress, 3);
      const pos = getPosition(easedP);
      const trail = starEl.querySelector(".strail");

      starEl.style.display = "block";
      starEl.style.left = pos.x + "px";
      starEl.style.top = pos.y + "px";
      trail.style.transform = `rotate(${direction === "left" ? -45 : 45}deg)`;
      starEl.style.opacity =
        progress < 0.1
          ? progress * 10
          : progress > 0.7
            ? 1 - (progress - 0.7) / 0.3
            : 1;

      if (progress < 1) requestAnimationFrame(animate);
      else {
        starEl.style.opacity = 0;
        starEl.style.display = "none";
        setTimeout(() => animateShootingStar(starEl, direction), 2500);
      }
    }
    requestAnimationFrame(animate);
  }

  const introTl = gsap.timeline({ delay: 0.5 });
  introTl
    .fromTo(
      ".arclft .arinnr",
      { width: "0%" },
      { width: "100%", duration: 1, ease: "power2.out" },
    )
    .fromTo(
      ".arcrgt .arinnr",
      { width: "0%" },
      { width: "100%", duration: 1, delay: 0.3, ease: "power2.out" },
      "-=0.5",
    )
    .add(() => {
      const el = document.querySelector(".typing-text");
      if (!el) return;
      const text = el.textContent;
      el.textContent = "";
      el.style.visibility = "visible";
      gsap.to(
        {},
        {
          duration: 1.2,
          delay: 0.5,
          onUpdate: function () {
            el.textContent = text.substring(
              0,
              Math.floor(this.progress() * text.length),
            );
          },
        },
      );
    }, "-=0.8")
    .to(
      "#line-v",
      { height: lineVTarget, duration: 0.6, ease: "power2.out" },
      "-=0.3",
    )
    .add(() => {
      gsap.to("#line-h-left", { width: lineHHalf, duration: 0.7 });
      gsap.to("#line-h-right", { width: lineHHalf, duration: 0.7 });
    })
    .to(
      "#text-block",
      { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" },
      "-=0.4",
    )
    .to("#subtitle", { opacity: 1, y: 0, duration: 0.9 }, "-=0.6")
    .add(() => {
      const sL = document.getElementById("star-left");
      const sR = document.getElementById("star-right");
      if (sL) setTimeout(() => animateShootingStar(sL, "left"), 1800);
      if (sR) setTimeout(() => animateShootingStar(sR, "right"), 2200);
    }, "-=0.5");

  window.addEventListener("resize", () => {
    const newH = Math.min(window.innerHeight * 0.1, 130);
    const newW = Math.min(window.innerWidth * 0.275, 200);
    gsap.set("#line-v", { height: newH });
    gsap.set("#line-h-left", { width: newW });
    gsap.set("#line-h-right", { width: newW });
  });

  /* ═══════════════════════ CAPABILITY SECTION ══════════════════ */
  const capSection = document.querySelector(".capablty_sec");
  if (capSection) {
    gsap.from(".capablty_sec .sec_ttle", {
      scrollTrigger: {
        trigger: ".capablty_sec",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 40,
      duration: 0.75,
      ease: "power3.out",
    });
    gsap.from(".cap_info_bx", {
      scrollTrigger: {
        trigger: ".cap_bx_wrrpr",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 0.7,
      stagger: 0.15,
      ease: "power3.out",
    });
  }

  /* ═══════════════════════ SPACE ECONOMY SECTION ══════════════ */
  const spaceEconSection = document.querySelector(".space-economy-sec");
  if (spaceEconSection) {
    gsap.from(".space-economy-sec .hdng", {
      scrollTrigger: {
        trigger: ".space-economy-sec",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
    });
    gsap.from(".econmy-crd", {
      scrollTrigger: {
        trigger: ".space-economy-con",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 0.7,
      stagger: 0.15,
      ease: "power3.out",
    });
  }

  /* ═══════════════════════ OUR WORK SECTION ═══════════════════ */
  const ourWorkSection = document.querySelector(".our_wrk_sec");
  if (ourWorkSection) {
    gsap.from(".our_wrk_sec .ourwrk_ttl", {
      scrollTrigger: {
        trigger: ".our_wrk_sec",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
    });
  }

  /* ═══════════════════════ PARTNER SECTION ════════════════════ */
  const partnerSection = document.querySelector(".prtnr_sec");
  if (partnerSection) {
    gsap.from(".prtnr_sec .prnr_ttle", {
      scrollTrigger: {
        trigger: ".prtnr_sec",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
    });

    function initMarquee(trackId, direction) {
      var track = document.getElementById(trackId);
      var halfWidth = track.scrollWidth / 2;
      gsap.set(track, { x: direction === 1 ? -halfWidth : 0 });
      var tween = gsap.to(track, {
        x: direction === 1 ? 0 : -halfWidth,
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(function (x) {
            var val = parseFloat(x);
            if (direction === 1)
              return (((val % halfWidth) + halfWidth) % halfWidth) - halfWidth;
            else return ((val % -halfWidth) - halfWidth) % -halfWidth;
          }),
        },
      });
      track.addEventListener("mouseenter", () => tween.timeScale(0));
      track.addEventListener("mouseleave", () => tween.timeScale(1));
    }

    initMarquee("track1", -1);
    initMarquee("track2", 1);
  }

  /* ═══════════════════════ NEWSROOM SECTION ═══════════════════ */
  const newsroomSection = document.querySelector(".newsroom_Sec");
  if (newsroomSection) {
    gsap.from(".newsroom_Sec .newsroom-hdng", {
      scrollTrigger: {
        trigger: ".newsroom_Sec",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
    });
  }

  /* ═══════════════════════ CURVE IMAGE ANIMATION ══════════════ */
  const curveImg = document.querySelector(".curve-img");
  if (curveImg) {
    gsap.to(curveImg, {
      clipPath: "inset(0% 0 0 0)",
      ease: "none",
      scrollTrigger: {
        trigger: "#curveSection",
        start: "top 90%",
        end: "bottom 80%",
        scrub: 1.2,
      },
    });
  }
});

/* ═══════════════════════════ ORBIT TAB SECTION ════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  // Keep only unique categories (removed duplicated set)
  const categories = [
    {
      bg: "1",
      label: "Life Sciences & Pharma",
      desc: "Microgravity research enables new approaches to drug discovery, formulation, and biological modeling—improving translational relevance and reducing development risk.",
    },
    {
      bg: "2",
      label: "Advanced Materials",
      // desc: "Space enables ultra-pure materials and next-gen composites.",
      desc: "Microgravity research enables the development of advanced materials with novel structures and properties that are difficult or impossible to achieve on Earth, unlocking new opportunities in performance, manufacturing, and product innovation.",
    },
    {
      bg: "3",
      label: "Data Centers & Edge Computing",
      desc: "Orbital infrastructure unlocks global compute efficiency.",
    },
    {
      bg: "4",
      label: "Energy & Sustainability",
      desc: "Space solar power drives clean energy innovation.",
    },
    {
      bg: "5",
      label: "Agriculture & Food Systems",
      desc: "Precision agriculture powered by satellite insights.",
    },
    {
      bg: "6",
      label: "Space Tourism & Human Spaceflight",
      desc: "Commercial human space travel is expanding rapidly.",
    },
  ];

  const sec = document.getElementById("orbt_tb_sec");
  const cardDesc = document.getElementById("card_desc");
  const cardTitle = document.getElementById("card_title");

  document.querySelectorAll(".orbt_cnct_bg").forEach((bg) => {
    gsap.set(bg, { opacity: 0, visibility: "hidden", zIndex: 1 });
  });

  let currentBg = document.querySelector('[data-bg="1"]');
  gsap.set(currentBg, { opacity: 1, visibility: "visible", zIndex: 2 });

  const initialCat = categories.find((c) => c.bg === "1");
  if (initialCat) {
    cardTitle.textContent = initialCat.label;
    cardDesc.textContent = initialCat.desc;
  }

  function activateCat(cat) {
    const nextBg = document.querySelector(`[data-bg="${cat.bg}"]`);
    if (currentBg === nextBg) return;
    gsap.killTweensOf([currentBg, nextBg]);
    gsap.set(nextBg, { visibility: "visible", zIndex: 2 });
    gsap.set(currentBg, { zIndex: 1 });
    const tl = gsap.timeline();
    tl.to(currentBg, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, 0)
      .fromTo(
        nextBg,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.inOut" },
        0,
      )
      .set(currentBg, { visibility: "hidden", zIndex: 1 });
    currentBg = nextBg;
    cardTitle.textContent = cat.label;
    cardDesc.textContent = cat.desc;
  }

  function makeChip(cat) {
    const btn = document.createElement("button");
    btn.className = "nav_link";
    btn.textContent = cat.label;
    btn.addEventListener("mouseenter", () => {
      activateCat(cat);
      sec
        .querySelectorAll(".nav_link")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
    return btn;
  }

  // Build only two centered buttons (no marquee)
  function buildTwoButtons(list) {
    const wrap = document.createElement("div");
    wrap.className = "orbt_buttons_wrap";
    wrap.style.display = "flex";
    wrap.style.justifyContent = "center";
    wrap.style.gap = "12px";
    // show first two categories only
    const visible = list.slice(0, 2);
    visible.forEach((cat) => wrap.appendChild(makeChip(cat)));
    sec.appendChild(wrap);
  }

  buildTwoButtons(categories);

  setTimeout(() => {
    const firstChip = sec.querySelector(".nav_link");
    if (firstChip) firstChip.classList.add("active");
  }, 100);
});

/* ═══════════════════════════ GLOBE VIZ ════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {
  (function () {
    const container = document.getElementById("globeViz");
    const buttons = document.querySelectorAll(".city-btn");
    if (!container) return;

    const locations = [
      { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
      { name: "Barcelona", lat: 41.3851, lng: 2.1734 },
      { name: "London", lat: 51.5074, lng: -0.1278 },
      { name: "Budapest", lat: 47.4979, lng: 19.0402 },
      { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
      { name: "Singapore", lat: 1.3521, lng: 103.8198 },
    ];

    const myGlobe = Globe()(container)
      .backgroundColor("rgba(0,0,0,0)")
      .showGlobe(false)
      .showAtmosphere(false)
      .atmosphereColor("#cbd5e1")
      .atmosphereAltitude(0.15)
      .htmlElement((d) => {
        const el = document.createElement("div");
        el.className = "marker-container";
        el.innerHTML = `<div class="locat_pin"></div>`;
        return el;
      });

    fetch(
      "https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson",
    )
      .then((res) => res.json())
      .then((countries) => {
        myGlobe
          .hexPolygonsData(countries.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.65)
          .hexPolygonColor(() => "#0f172a")
          .hexPolygonAltitude(0.015);
      })
      .catch((err) => console.error("GeoJSON load failed:", err));

    myGlobe.htmlElementsData([locations[0]]);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width && height) {
          myGlobe.width(width);
          myGlobe.height(height);
        }
      }
    });
    resizeObserver.observe(container);

    const controls = myGlobe.controls();
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = false;

    let autoRotateTimeout;

    function focusLocation(lat, lng) {
      controls.autoRotate = false;
      clearTimeout(autoRotateTimeout);
      const activeLoc = locations.find((l) => l.lat === lat && l.lng === lng);
      if (activeLoc) myGlobe.htmlElementsData([activeLoc]);
      myGlobe.pointOfView({ lat, lng, altitude: 1.8 }, 600);
      autoRotateTimeout = setTimeout(() => {
        controls.autoRotate = false;
      }, 3000);
    }

    requestAnimationFrame(() => {
      focusLocation(locations[0].lat, locations[0].lng);
      if (buttons[0]) buttons[0].classList.add("active");
    });

    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        buttons.forEach((b) => b.classList.remove("active"));
        const target = e.currentTarget;
        target.classList.add("active");
        focusLocation(
          parseFloat(target.getAttribute("data-lat")),
          parseFloat(target.getAttribute("data-lng")),
        );
      });
    });

    controls.addEventListener("start", () => {
      controls.autoRotate = false;
      clearTimeout(autoRotateTimeout);
    });
    controls.addEventListener("end", () => {
      autoRotateTimeout = setTimeout(() => {
        controls.autoRotate = false;
      }, 3000);
    });
  })();
});

/* ═══════════════════════════ BACK TO TOP ══════════════════════ */
(function () {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    function () {
      btn.classList.toggle("visible", window.scrollY > 400);
    },
    { passive: true },
  );

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();


/* ═══════════════════════ xpo_top_sec ══════════════ */
// const xpoTopSec = document.querySelector('.xpo_top_sec');
// if (xpoTopSec) {
//   const heading = xpoTopSec.querySelector('h2');
//   const text = heading.textContent.trim();
//   heading.innerHTML = text
//     .split(' ')
//     .map(word => `<span class="word">${word}</span>`)
//     .join(' ');
//   const words = heading.querySelectorAll('.word');
//   gsap.timeline({
//     scrollTrigger: {
//       trigger: xpoTopSec,
//       start: 'top top',
//       end: '+=100%',
//       pin: true,
//       scrub: true,
//     }
//   })
//   .to(words, {
//     opacity: 1,
//     y: 0,
//     stagger: 0.10,
//     ease: 'none'
//   });
// }

/* ═══════════════════════════ Navigation Slider ════════════════════════ */
$(function () {
  const setSlider = el => $("#sol_tb .nav_slider").css({
    left: $(el).position().left,
    width: $(el).outerWidth()
  });
  setSlider($("#sol_tb .nav_link.active"));
  $('#sol_tb').on('shown.bs.tab', '[data-bs-toggle="tab"]', e => setSlider(e.target));
});


function updateSlider() {
  const active = document.querySelector('#step-nav-buttons .step-nav-btn.active');
  const slider = document.querySelector('.nav_btn_sldr');
  if (!active || !slider) return;
  slider.style.left = active.offsetLeft + 'px';
  slider.style.width = active.offsetWidth + 'px';
}

/* ═══════════════════════════  Counter ════════════════════════ */
document.querySelectorAll('.elv_rplce_itm span').forEach(el => {
  const obs = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    const target = +el.dataset.count, start = Date.now();
    (function tick() {
      const p = Math.min((Date.now() - start) / 1000, 1);
      el.textContent = Math.floor(p * target);
      p < 1 ? requestAnimationFrame(tick) : el.textContent = target;
    })();
    obs.disconnect();
  }, { threshold: 0.5 });
  obs.observe(el);
});


/* ═══════════════════════════ Eleveight Framework Page Scroll and Active function ════════════════════════ */
(function () {
  'use strict';
  const STEPS = [
    {
      num: 1, phase: 'k', name: 'Opportunity <br/> discovery', question: 'What could space solve for you?',
      actions: ['Map space capabilities to R&D gaps and product challenges', 'Identify high-value scientific and industrial use cases', 'Prioritize applications with strongest impact potential'],
      why: 'Most organizations never engage with space because they never see it as relevant. This step builds that first concrete bridge.',
      deliverable: 'Opportunity map',
      image: './images/frmewrkIimg.png'
    },
    {
      num: 2, phase: 'k', name: 'Internal <br/>alignment', question: 'Is the organization aligned around why space matters?',
      actions: ['Educate teams on space opportunities and constraints', 'Align leadership around opportunity and objectives', 'Build a shared language for space-enabled innovation'],
      why: 'Without leadership buy-in, even the most promising opportunity stalls before it gets evaluated.',
      deliverable: 'Executive alignment & readiness',
      image: './images/frmewrkIimg.png'
    },
    {
      num: 3, phase: 'i', name: 'Scientific & technical feasibility', question: 'Does space materially improve your science or product?',
      actions: ['Evaluate hypothesis strength and scientific validity', 'Assess sensitivity to microgravity or space conditions', 'Define platform fit and data-capture requirements'],
      why: 'Not every idea benefits from space. This step separates genuine opportunities from interesting but non-viable ones.',
      deliverable: 'Technical feasibility assessment',
      image: './images/frmewrkIimg.png'
    },
    {
      num: 4, phase: 'i', name: 'Commercial & strategic case', question: 'Is this commercially worth it?',
      actions: ['Model improvement impact \u2014 yield, purity, performance', 'Cost\u2013benefit and ROI analysis across scenarios', 'IP potential, competitive advantage & time-to-market implications'],
      why: 'Scientific validity alone doesn\u2019t justify investment. This step quantifies the business case.',
      deliverable: 'Commercial business case',
      image: './images/frmewrkIimg.png'
    },
    {
      num: 5, phase: 's', name: 'Commercialization roadmap', question: 'What is the pathway to translate space capabilities into commercial value?',
      actions: ['Translate hypotheses into staged mission architecture', 'Define experiments, hardware, and validation metrics', 'Plan TRL progression and scale-up pathway'],
      why: 'A validated opportunity still needs a plan. This step turns insight into an executable sequence of milestones.',
      deliverable: 'Commercialization roadmap',
      image: './images/frmewrkIimg.png'
    },
    {
      num: 6, phase: 's', name: 'Ecosystem <br/> strategy', question: 'Which platforms and partners enable the opportunity?',
      actions: ['Evaluate stations, free-flyers, and microgravity labs', 'Identify optimal partners across the value chain', 'Assess integration constraints, pricing, and timelines'],
      why: 'No organization executes a space mission alone. This step identifies who you need, and on what terms.',
      deliverable: 'Platform & partner strategy',
      image: './images/frmewrkIimg.png'
    },
    {
      num: 7, phase: 'e', name: 'Mission <br/> execution', question: 'How do we successfully run the mission and capture the data?',
      actions: ['Oversee experiment integration and flight readiness', 'Coordinate launch operations and mission execution', 'Capture, return, and analyze mission data'],
      why: 'This is where the roadmap becomes reality \u2014 hands-on management of the actual mission.',
      deliverable: 'Completed mission + data package',
      image: './images/frmewrkIimg.png'
    },
    {
      num: 8, phase: 'e', name: 'Scale-up & commercial deployment', question: 'How do we translate results into scalable products or capabilities?',
      actions: ['Design follow-on missions and manufacturing pathways', 'Develop IP, regulatory, and partnership strategies', 'Define market positioning and go-to-market strategy'],
      why: 'Mission success means nothing without a path to scale. This final step converts results into a market-ready strategy.',
      deliverable: 'Commercial deployment strategy',
      image: './images/frmewrkIimg.png'
    }
  ];

  const PHASE_META = {
    k: { label: 'Knowledge', sub: 'Recognize the value' },
    i: { label: 'Insights', sub: 'Understand & validate' },
    s: { label: 'Strategy', sub: 'Architect the value' },
    e: { label: 'Execution', sub: 'Capture the value' }
  };

  let currentStep = 0;

  function renderStepNav() {
    document.getElementById('step-nav-buttons').innerHTML =
      STEPS.map((s, i) => `
          <button class="step-nav-btn ph-${s.phase}${i === currentStep ? ' active' : ''}"
                  onclick="goStep(${i})">
            <span class="sn-label">${s.name}</span>
          </button>
        `).join('');

    requestAnimationFrame(updateSlider);
  }

  function renderStepDetail() {
    const s = STEPS[currentStep];
    const pm = PHASE_META[s.phase];
    const varClass = `ph-${s.phase}-vars`;

    const detail = document.getElementById('step-detail');
    detail.className = `step-detail ph-${s.phase} ${varClass}`;
    detail.innerHTML = `
          <div class="jrny_stp_wrp">
            <div class="jrny_head">
              <h6>${pm.label} &#8212; ${pm.sub}</h6>
              <h2>${(s.name || "").replace(/<br\s*\/?>/gi, "").charAt(0).toUpperCase() + (s.name || "").replace(/<br\s*\/?>/gi, "").slice(1)}</h2>
              <p>${s.question}</p>
            </div>
            <div class="jrny_row">
              <div class="jrny_rw_cnct">
                <div class="jrny_rw_cnct_tp">
                  <h5>Key actions</h5>
                  <ul>${s.actions.map(a => `<li>${a}</li>`).join('')}</ul>
                </div>
                <div class="jrny_rw_cnct_btm">
                  <h5>Why it matters</h5>
                  <div class="why_box">${s.why}</div>
                </div>
              </div>
              <div class="jrny_rw_img">
                <img src="${s.image}" alt="${(s.name || "").replace(/<br\s*\/?>/gi, "").replace(/&lt;br\s*\/?&gt;/gi, "")}" />
                <span class="dlvr_bdge">
                  Deliverable
                </span>
                <div class="dlvrbl_box">
                  <h6>Output</h6>
                  <p>${s.deliverable}</p>
                </div>
              </div>
            </div>
          </div>
      `;

    updatePhaseBlocks();
  }

  function renderDeliverables() {
    document.getElementById('del-grid').innerHTML = STEPS.map(s => {
      const pm = PHASE_META[s.phase];
      return `<div class="del-card d-${s.phase}" onclick="goStepAndScroll(${s.num - 1})">
                  <div class="del-card-cnct">
                    <span class="dc-num">Step ${s.num}</span>
                    <h4>${s.deliverable}</h4>
                    <p>${s.why}</p>
                  </div>
                  <span class="dc-badge">${pm.label}</span>
                </div>`;
    }).join('');
  }

  function updatePhaseBlocks() {
    document.querySelectorAll('.pb-step-chip').forEach(chip => {
      chip.classList.remove('active');
    });

    const activeChip = document.querySelector('.pb-step-chip[data-step="' + (currentStep + 1) + '"]');

    if (activeChip) {
      activeChip.classList.add('active');
    }
  }

  function goStep(i) {
    if (i < 0 || i > 7) return;
    currentStep = i;
    renderStepNav();
    renderStepDetail();
  }

  function goStepAndScroll(i) {
    goStep(i);
    requestAnimationFrame(function () {
      var el = document.getElementById('framework');
      if (!el) return;
      var targetY = el.getBoundingClientRect().top + window.scrollY - 20;
      if (window._lenis && typeof window._lenis.scrollTo === 'function') {
        window._lenis.scrollTo(targetY, { duration: 0.8 });
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; } });
  }, { threshold: .08 });

  function addReveal(sel) {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.opacity = '0'; el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity .55s ease ${i * 70}ms,transform .55s ease ${i * 70}ms`;
      io.observe(el);
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goStep(currentStep + 1);
    if (e.key === 'ArrowLeft') goStep(currentStep - 1);
  });

  renderStepNav();
  renderStepDetail();
  renderDeliverables();

  setTimeout(() => {
    addReveal('.phase-block');
    addReveal('.del-card');
    addReveal('.why-item');
  }, 150);

  window.goStep = goStep;
  window.goStepAndScroll = goStepAndScroll;
})();

/* ═══════════════════════════ Block hash(#) tag════════════════════════ */
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href="#"]');
  if (link) {
    e.preventDefault();
  }
});