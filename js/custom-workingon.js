/* ═══════════════════════════ INITIALIZATION ═══════════════════ */
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

document.addEventListener("DOMContentLoaded", () => {
  // Force scroll to top on refresh
  window.history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  /* ═══════════════════════ LENIS SMOOTH SCROLL ═══════════════ */
  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1.05,
  });

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

  /* ═══════════════════════ BANNER FADE-UP ANIMATION ══════════ */
  window.addEventListener("load", () => {
    const tl = gsap.timeline();

    tl.to(".bnnr_title", {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
    }).to(
      ".bnnr_subtitle",
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.4",
    ); // overlap for smooth feel
  });

  /* ═══════════════════════ GSAP PINNING LOGIC ════════════════ */
  const contents = gsap.utils.toArray(".xpo_scrl_cnct");
  if (contents.length > 0) {
    gsap.set(contents, { opacity: 0, scale: 0.95 });
    gsap.set(contents[0], { opacity: 1, scale: 1 });

    let pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".xpo_top_sec",
        start: "top top",
        end: "+=150%",
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    pinTl.to({}, { duration: 0.4 });

    contents.forEach((el, i) => {
      if (i !== 0) {
        pinTl
          .to(contents[i - 1], {
            opacity: 0,
            y: -80,
            scale: 0.9,
            duration: 1.2,
            ease: "power3.out",
          })
          .fromTo(
            el,
            { opacity: 0, y: 80, scale: 1.1 },
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" },
            "<0.2",
          );
      }
    });
  }

  /* ═══════════════════════ SLICK SLIDERS ═════════════════════ */
  $(".work_sldr").slick({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    autoplay: true,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
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
    const maxSlide =
      slickObj.slideCount - $slider.slick("slickGetOption", "slidesToShow");
    const pct = maxSlide <= 0 ? 100 : (current / maxSlide) * 100;
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
  const easeOutCubic = (e) => 1 - Math.pow(1 - e, 3);

  const runCounter = (el) => {
    const target = +el.getAttribute("data-target");
    const prefix = el.getAttribute("data-prefix") || "";
    const suffix = el.getAttribute("data-suffix") || "";
    let start = null;
    const step = (now) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / 2500, 1);
      const currentVal = Math.floor(easeOutCubic(progress) * target);
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
          setTimeout(() => runCounter(entry.target), 800);
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
    path: document.getElementById("curve-path"),
  };

  let headerStickyPos = globeEls.header.length
    ? globeEls.header.offset().top
    : 0;

  function handleAllScroll() {
    const scrollY = window.scrollY;
    if (scrollY > headerStickyPos) globeEls.header.addClass("fixed");
    else globeEls.header.removeClass("fixed");

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
      const blurValue = 4 * (1 - clamp01(p2));
      globeEls.globe.style.filter = `grayscale(${gray}) brightness(${bri}) blur(${blurValue}px)`;
    }
    if (globeEls.ring)
      globeEls.ring.style.transform = `scale(${sc * 1.3}) rotate(${rawP * 160}deg)`;
    if (globeEls.glow) globeEls.glow.style.transform = `scale(${sc * 1.04})`;

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

    if (p3 > 0) {
      const t = easeOut3(p3);

      /* ── Curve reveal ── */
      if (globeEls.curve) {
        globeEls.curve.style.opacity = clamp01(t * 2);
        globeEls.curve.style.visibility = "visible";
        const clipTop = Math.round((1 - t) * 100);
        globeEls.curve.style.clipPath = `inset(${clipTop}% 0% 0% 0%)`;
      }

      /* ── Journey year travels along the curve ── */
      const journeyYear = document.getElementById("journey-year");
      if (journeyYear && globeEls.curve) {
        const rect = globeEls.curve.getBoundingClientRect();
        const parentRect = globeEls.curve.parentElement.getBoundingClientRect();

        // Tune these to match where your curve line starts/ends in curved-svg.svg
        const START_X = 0.05;
        const START_Y = 0.92;
        const END_X = 0.95;
        const END_Y = 0.05;

        const curveT = Math.pow(clamp01(t), 1.4);

        const dotX =
          rect.left -
          parentRect.left +
          rect.width * lerp(START_X, END_X, curveT);
        const dotY =
          rect.top -
          parentRect.top +
          rect.height * lerp(START_Y, END_Y, curveT);

        // Scale: 1.0 at start → 1.15 at midpoint → 1.0 at end
        const midScale = 1 - 0.35 * (1 - Math.abs(curveT * 2 - 1));

        journeyYear.style.left = dotX + "px";
        journeyYear.style.top = dotY + "px";
        journeyYear.style.transform = `translate(-50%, -100%) scale(${midScale.toFixed(1)})`;
        journeyYear.style.visibility = "visible";
        journeyYear.style.opacity = clamp01(t * 5);
      }

      /* ── stat-num stays fixed, just animates its value ── */
      const cp = clamp01((rawP - 0.52) / (0.88 - 0.52));
      const ce = easeOut3(cp);

      if (globeEls.valMain) {
        const val = lerp(630, 1800, ce);
        globeEls.valMain.textContent =
          val < 1000
            ? "$" + Math.round(val) + "B"
            : "$" + (val / 1000).toFixed(1) + "T";
      }

      if (journeyYear) {
        journeyYear.textContent = Math.round(lerp(2025, 2035, ce));
      }

      /* ── stat-block fade + slide (your original) ── */
      if (globeEls.stats) {
        globeEls.stats.style.opacity = clamp01(t * 2.5);
        globeEls.stats.style.visibility = "visible";
        globeEls.stats.style.transform = `translateX(-50%) translateY(${lerp(24, 0, t)}px)`;
      }
    } else {
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
  // Updated logic: takes 10% of height but CAP it at 130px
  const lineVTarget = Math.min(window.innerHeight * 1, 130);

  // Updated logic: takes ~27% of width but CAP it at 200px per side
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
      let progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const pos = getPosition(easedProgress);
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

  /* ═══════════════════════ CAPABILITY SECTION ANIMATION ══════════ */
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

  /* ═══════════════════════ SPACE ECONOMY SECTION ANIMATION ══════════ */
  const spaceEconSection = document.querySelector(".space-economy-sec");
  if (spaceEconSection) {
    gsap.from(".space-economy-sec .hdng", {
      scrollTrigger: {
        trigger: ".space-economy-sec",
        start: "top 75%",
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

  /* ═══════════════════════ OUR WORK SECTION ANIMATION ══════════ */
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

  /* ═══════════════════════ PARTNER SECTION ANIMATION ══════════ */
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
            if (direction === 1) {
              return (((val % halfWidth) + halfWidth) % halfWidth) - halfWidth;
            } else {
              return ((val % -halfWidth) - halfWidth) % -halfWidth;
            }
          }),
        },
      });

      track.addEventListener("mouseenter", function () {
        tween.timeScale(0);
      });
      track.addEventListener("mouseleave", function () {
        tween.timeScale(1);
      });
    }

    initMarquee("track1", -1);
    initMarquee("track2", 1);
  }

  /* ═══════════════════════ NEWSROOM SECTION ANIMATION ══════════ */
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

  /* ═══════════════════════ CURVE IMAGE ANIMATION ═══════════════ */
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

document.addEventListener("DOMContentLoaded", () => {
  const categories = [
    {
      bg: "1",
      label: "Life Sciences & Pharma",
      desc: "Microgravity research enables new approaches to drug discovery, formulation, and biological modeling—improving translational relevance and reducing development risk.",
    },
    {
      bg: "2",
      label: "Advanced Materials",
      desc: "Space enables ultra-pure materials and next-gen composites.",
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
    {
      bg: "7",
      label: "Life Sciences & Pharma",
      desc: "Microgravity research enables new approaches to drug discovery, formulation, and biological modeling—improving translational relevance and reducing development risk.",
    },
    {
      bg: "8",
      label: "Advanced Materials",
      desc: "Space enables ultra-pure materials and next-gen composites.",
    },
    {
      bg: "9",
      label: "Data Centers & Edge Computing",
      desc: "Orbital infrastructure unlocks global compute efficiency.",
    },
    {
      bg: "10",
      label: "Energy & Sustainability",
      desc: "Space solar power drives clean energy innovation.",
    },
    {
      bg: "11",
      label: "Agriculture & Food Systems",
      desc: "Precision agriculture powered by satellite insights.",
    },
    {
      bg: "12",
      label: "Space Tourism & Human Spaceflight",
      desc: "Commercial human space travel is expanding rapidly.",
    },
  ];

  const sec = document.getElementById("orbt_tb_sec");
  const cardDesc = document.getElementById("card_desc");
  const cardTitle = document.getElementById("card_title");

  // 1. Hide ALL backgrounds first
  document.querySelectorAll(".orbt_cnct_bg").forEach((bg) => {
    gsap.set(bg, { opacity: 0, visibility: "hidden", zIndex: 1 });
  });

  // 2. Explicitly activate bg="1" on load
  let currentBg = document.querySelector('[data-bg="1"]');
  gsap.set(currentBg, { opacity: 1, visibility: "visible", zIndex: 2 });

  // 3. Set initial card content to match bg="1"
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

  function buildTrack(cls, list) {
    const track = document.createElement("div");
    track.className = "marquee-track " + cls;
    track.style.width = "max-content";
    [...list, ...list].forEach((cat) => track.appendChild(makeChip(cat)));
    sec.appendChild(track);
  }

  buildTrack("marquee-track--rtl", categories);
  buildTrack("marquee-track--ltr", [...categories].reverse());

  // 4. Mark the first chip as active after tracks are built
  setTimeout(() => {
    const firstChip = sec.querySelector(".nav_link");
    if (firstChip) firstChip.classList.add("active");
  }, 100);
});

// globe_js
document.addEventListener("DOMContentLoaded", function () {
  (function () {
    const container = document.getElementById("globeViz");
    const buttons = document.querySelectorAll(".city-btn");

    // 🚫 Exit if element not found (prevents breaking other pages)
    if (!container) return;

    const locations = [
      { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
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

    // Load globe data
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

    // Initial marker
    myGlobe.htmlElementsData([locations[0]]);

    // Resize handling
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

    // Controls
    const controls = myGlobe.controls();
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;
    controls.enableZoom = false;

    let autoRotateTimeout;

    function focusLocation(lat, lng) {
      controls.autoRotate = false;
      clearTimeout(autoRotateTimeout);

      const activeLoc = locations.find((l) => l.lat === lat && l.lng === lng);

      if (activeLoc) {
        myGlobe.htmlElementsData([activeLoc]);
      }

      myGlobe.pointOfView(
        {
          lat,
          lng,
          altitude: 1.8,
        },
        600,
      );

      autoRotateTimeout = setTimeout(() => {
        controls.autoRotate = false;
      }, 3000);
    }

    // Initial focus
    requestAnimationFrame(() => {
      focusLocation(locations[0].lat, locations[0].lng);
      if (buttons[0]) buttons[0].classList.add("active");
    });

    // Button clicks
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        buttons.forEach((b) => b.classList.remove("active"));

        const target = e.currentTarget;
        target.classList.add("active");

        const lat = parseFloat(target.getAttribute("data-lat"));
        const lng = parseFloat(target.getAttribute("data-lng"));

        focusLocation(lat, lng);
      });
    });

    // User interaction
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
