/* ═══════════════════════ FOOTER NAV → SECTION + TAB ═══════════════════════
   Handles every footer link that should:
     1. Take the user to the right page (if they aren't already there)
     2. Smoothly scroll to a target section / element
     3. Automatically activate the correct tab inside that section,
        where applicable

   Each footer link carries:
     - data-section  -> class name of the target section/element to scroll to
     - data-tab      -> (optional) which tab to activate inside that section
     - data-idx      -> (optional) which repeated child element to scroll to
                         inside the section (0-based, e.g. the nth .cap_info_bx)

   The same info is mirrored in the link's href as query params
   (?section=...&tab=...&idx=...) so that:
     - On the SAME page: the click is intercepted, the query params are
       stripped, and we just scroll + switch tab in place.
     - On a DIFFERENT page: the browser navigates normally to that page,
       which then reads the query params on load and scrolls once ready.

   Works with:
     - elveigh_sec      -> Bootstrap tabs (#sol_tb1 "For Earth Organizations",
                            #sol_tb2 "For Space Organizations")
     - elveigh_sec_cnct -> plain scroll target (eleveight framework link,
                            no tab switching)
     - frm_orbt_sec     -> dynamically built chips (#orbt_tb_sec) for
                            "Life Sciences & Pharma" / "Advanced Materials"
     - newsroom_Sec     -> Bootstrap tabs (#newsTabs) for
                            Articles / Insights / Events / News / Press Releases
     - capablty_sec     -> scrolls to the nth .cap_info_bx (via data-idx)
     - what_we_sec / our_vision_sec / team_sec / join_sec / prtnr_sec
                        -> plain scroll targets (Company page + Home page)
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  const TAB_LABELS = {
    lifesciences: "Life Sciences & Pharma",
    advancedmaterials: "Advanced Materials",
  };

  // Newsroom footer link -> #newsTabs button[data-category]. "events" has
  // no dedicated tab/content yet, so it falls back to "View All".
  const NEWSROOM_FALLBACK_CATEGORY = "all";

  // Some sections scroll to a more precise element than the section root
  // itself (e.g. straight to the tab block rather than the top of the section).
  const SCROLL_TARGET_OVERRIDE = {
    elveigh_sec: ".sol_tb_mn",
    newsroom_Sec: ".tabAreaWrp",
  };

  function normalizePage(pathname) {
    const seg = pathname.split("/").pop();
    return seg && seg.length ? seg.toLowerCase() : "index.html";
  }

  function getCurrentPage() {
    return normalizePage(window.location.pathname);
  }

  function getHeaderOffset() {
    const header = document.querySelector(".hdr_sec");
    return 0;
  }

  // Activates the Bootstrap tab inside elveigh_sec
  function activateElveighTab(tabKey) {
    const btnId = tabKey === "space" ? "sol_tb2" : "sol_tb1";
    const btn = document.getElementById(btnId);
    if (!btn) return;

    if (window.bootstrap && window.bootstrap.Tab) {
      window.bootstrap.Tab.getOrCreateInstance(btn).show();
    } else {
      // Fallback: manually toggle classes if Bootstrap JS isn't available yet
      btn.click();
    }
  }

  // Activates the dynamically-built chip inside frm_orbt_sec
  function activateOrbitTab(tabKey) {
    const sec = document.getElementById("orbt_tb_sec");
    if (!sec) return;
    const targetLabel = TAB_LABELS[tabKey];
    if (!targetLabel) return;

    const buttons = Array.from(sec.querySelectorAll(".nav_link"));
    const targetBtn = buttons.find(
      (b) => b.textContent.trim() === targetLabel,
    );
    if (!targetBtn) return;

    buttons.forEach((b) => b.classList.remove("active"));
    targetBtn.classList.add("active");
    // The chips listen for "mouseenter" to swap background/content —
    // dispatch it so the same logic runs on programmatic activation.
    targetBtn.dispatchEvent(new Event("mouseenter", { bubbles: true }));
  }

  // Activates the Bootstrap tab inside newsroom_Sec (#newsTabs)
  function activateNewsroomTab(tabKey) {
    const tabsWrap = document.getElementById("newsTabs");
    if (!tabsWrap) return;

    let btn = tabsWrap.querySelector('button[data-category="' + tabKey + '"]');
    if (!btn) {
      // No dedicated tab/content for this category yet — land on "View All"
      // instead of doing nothing.
      btn = tabsWrap.querySelector(
        'button[data-category="' + NEWSROOM_FALLBACK_CATEGORY + '"]',
      );
    }
    if (!btn) return;

    if (window.bootstrap && window.bootstrap.Tab) {
      window.bootstrap.Tab.getOrCreateInstance(btn).show();
    } else {
      btn.click();
    }
  }

  function activateTab(section, tab) {
    if (!tab) return;
    if (section === "elveigh_sec") {
      activateElveighTab(tab);
    } else if (section === "frm_orbt_sec") {
      activateOrbitTab(tab);
    } else if (section === "newsroom_Sec") {
      activateNewsroomTab(tab);
    }
  }

  function getScrollTarget(section, idx) {
    // capablty_sec footer links point at a specific .cap_info_bx card
    // (Activation/Insights/Strategy/Execution) rather than the section top.
    if (section === "capablty_sec" && idx !== null && idx !== undefined && idx !== "") {
      const boxes = document.querySelectorAll(".capablty_sec .cap_info_bx");
      const box = boxes[Number(idx)];
      if (box) return box;
    }

    const overrideSelector = SCROLL_TARGET_OVERRIDE[section];
    if (overrideSelector) {
      const el = document.querySelector(overrideSelector);
      if (el) return el;
    }
    return document.querySelector("." + section);
  }

  // Activates the tab right away, then smoothly scrolls to the section —
  // so the correct tab is already switched before the user arrives there.
  function goToSectionAndTab(section, tab, idx) {
    const target = getScrollTarget(section, idx);
    if (!target) return;

    activateTab(section, tab);

    if (window.lenis && typeof window.lenis.scrollTo === "function") {
      window.lenis.scrollTo(target, {
        offset: -getHeaderOffset(),
        duration: 1.2,
      });
    } else {
      const top =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        getHeaderOffset();
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  function handleLinkClick(e) {
    const link = e.currentTarget;
    const section = link.getAttribute("data-section");
    if (!section) return;

    const tab = link.getAttribute("data-tab");
    const idx = link.getAttribute("data-idx");

    // link.href is resolved by the browser to an absolute URL, so this
    // works correctly no matter which page the link lives on.
    const linkPage = normalizePage(new URL(link.href).pathname);

    if (linkPage === getCurrentPage()) {
      // Already on the destination page: no reload, just scroll (+ switch
      // tab) in place. URL is intentionally left unchanged.
      e.preventDefault();
      goToSectionAndTab(section, tab, idx);
    }
    // Otherwise: let the default navigation happen — the link already
    // points to TARGET_PAGE?section=...&tab=...&idx=..., which is picked
    // up by the code below once that page loads.
  }

  function bindFooterLinks() {
    document.querySelectorAll("a[data-section]").forEach((link) => {
      link.addEventListener("click", handleLinkClick);
    });
  }

  function handleIncomingParams() {
    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    if (!section) return;

    const tab = params.get("tab");
    const idx = params.get("idx");

    // Wait for the page (fonts/images/GSAP setup + orbit chips) to fully
    // settle before scrolling, so the offset/position is accurate.
    window.addEventListener("load", () => {
      setTimeout(() => {
        if (!getScrollTarget(section, idx)) return;

        goToSectionAndTab(section, tab, idx);

        // Strip the params back out once handled so the URL returns to normal.
        const url = new URL(window.location.href);
        url.searchParams.delete("section");
        url.searchParams.delete("tab");
        url.searchParams.delete("idx");
        window.history.replaceState(null, "", url);
      }, 350);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindFooterLinks();
    handleIncomingParams();
  });
})();