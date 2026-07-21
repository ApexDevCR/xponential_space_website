/* ═══════════════════════ FOOTER NAV → SECTION + TAB ═══════════════════════
   Handles footer links that should:
     1. Take the user to the Home page (if not already there)
     2. Smoothly scroll to a target section (elveigh_sec / frm_orbt_sec)
     3. Automatically open the correct tab inside that section

   Works with:
     - elveigh_sec  -> Bootstrap tabs (#sol_tb1 "For Earth Organizations",
                        #sol_tb2 "For Space Organizations")
     - frm_orbt_sec -> dynamically built chips (#orbt_tb_sec) for
                        "Life Sciences & Pharma" / "Advanced Materials"
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  const TAB_LABELS = {
    lifesciences: "Life Sciences & Pharma",
    advancedmaterials: "Advanced Materials",
  };

  function isHomePage() {
    const path = window.location.pathname;
    return (
      path === "/" ||
      path === "" ||
      /(^|\/)index\.html$/.test(path)
    );
  }

  function getHeaderOffset() {
    const header = document.querySelector(".hdr_sec");
    return header ? header.offsetHeight + 16 : 0;
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

  function activateTab(section, tab) {
    if (section === "elveigh_sec") {
      activateElveighTab(tab);
    } else if (section === "frm_orbt_sec") {
      activateOrbitTab(tab);
    }
  }

  // Smoothly scrolls to the section, then activates the tab once the
  // scroll has settled so the correct tab is visibly active in view.
  function goToSectionAndTab(section, tab) {
    const target = document.querySelector("." + section);
    if (!target) return;

    const finish = () => activateTab(section, tab);

    if (window.lenis && typeof window.lenis.scrollTo === "function") {
      window.lenis.scrollTo(target, {
        offset: -getHeaderOffset(),
        duration: 1.2,
        onComplete: finish,
      });
      // Safety net in case onComplete doesn't fire for any reason
      setTimeout(finish, 1400);
    } else {
      const top =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        getHeaderOffset();
      window.scrollTo({ top, behavior: "smooth" });
      setTimeout(finish, 700);
    }
  }

  function handleLinkClick(e) {
    const link = e.currentTarget;
    const section = link.getAttribute("data-section");
    const tab = link.getAttribute("data-tab");
    if (!section || !tab) return;

    if (isHomePage()) {
      // Already on Home: no reload, just scroll + switch tab in place.
      e.preventDefault();
      goToSectionAndTab(section, tab);

      const url = new URL(window.location.href);
      url.searchParams.set("section", section);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url);
    }
    // On any other page: let the default navigation happen — the link
    // already points to index.html?section=...&tab=..., which is picked
    // up by the code below once the Home page loads.
  }

  function bindFooterLinks() {
    document
      .querySelectorAll("a[data-section][data-tab]")
      .forEach((link) => {
        link.addEventListener("click", handleLinkClick);
      });
  }

  function handleIncomingParams() {
    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    const tab = params.get("tab");
    if (!section || !tab || !isHomePage()) return;
    if (!document.querySelector("." + section)) return;

    // Wait for the page (fonts/images/GSAP setup + orbit chips) to fully
    // settle before scrolling, so the offset/position is accurate.
    window.addEventListener("load", () => {
      setTimeout(() => goToSectionAndTab(section, tab), 350);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindFooterLinks();
    handleIncomingParams();
  });
})();