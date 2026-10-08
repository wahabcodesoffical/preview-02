/* DELUXE ROOFING SERVICES — demo concept interactions
   - Mobile nav toggle + active link states
   - Sticky header state
   - GSAP hero word-split intro, parallax, scroll reveals
   - Demo quote form (non-functional by design)
*/
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.classList.remove("is-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Demo quote form (does NOT send data anywhere) ---------- */
  var form = document.getElementById("quote-form");
  var notice = document.getElementById("form-notice");
  if (form && notice) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // demo only — no backend, no data collection
      notice.hidden = false;
      notice.setAttribute("tabindex", "-1");
      notice.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
      notice.focus({ preventScroll: true });
    });
  }

  /* ---------- GSAP animations ---------- */
  var hasGsap = typeof window.gsap !== "undefined";
  var root = document.documentElement;

  if (!hasGsap || prefersReduced) {
    root.classList.add("no-anim");
    return; // content stays fully visible without animation
  }
  root.classList.add("js-anim");

  var hasTrigger = typeof window.ScrollTrigger !== "undefined";
  if (hasTrigger) gsap.registerPlugin(ScrollTrigger);

  /* Hero headline: word-mask staggered intro */
  var splitEl = document.querySelector("[data-hero-split]");
  if (splitEl) {
    var words = splitEl.textContent.trim().split(/\s+/);
    splitEl.setAttribute("aria-label", splitEl.textContent.trim());
    splitEl.innerHTML = words
      .map(function (w) {
        return '<span class="wmask"><span class="wword">' + w + "</span></span>";
      })
      .join(" ");
    gsap.fromTo(
      splitEl.querySelectorAll(".wword"),
      { yPercent: 110 },
      { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.07, delay: 0.15 }
    );
  }

  /* Hero fade-up elements */
  gsap.fromTo(
    "[data-hero]",
    { opacity: 0, y: 34 },
    { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.35 }
  );

  /* Hero background parallax */
  if (hasTrigger) {
    gsap.to(".hero__bg .hero__photo", {
      yPercent: 14,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* Scroll reveals */
  if (hasTrigger) {
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        }
      );
    });

    /* Card image settle zoom */
    gsap.utils.toArray(".card__media img").forEach(function (img) {
      gsap.fromTo(
        img,
        { scale: 1.12 },
        {
          scale: 1,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: img, start: "top 92%", once: true }
        }
      );
    });
  } else {
    gsap.to("[data-reveal]", { opacity: 1, duration: 0.6 });
  }

  /* Active nav link on scroll */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (a) {
              a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) { obs.observe(s); });
  }
})();
