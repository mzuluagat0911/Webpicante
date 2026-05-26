/* =========================================================
   Picante — UX layer
   Apple-grade motion system (vanilla JS)
   ========================================================= */

const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const isTouch =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  window.matchMedia("(hover: none)").matches;

/* =========================================================
   1. Smooth scroll (Lenis)
   ========================================================= */
let lenis = null;

function initSmoothScroll() {
  if (prefersReduced || typeof Lenis === "undefined") return;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70, duration: 1.4 });
    });
  });
}
initSmoothScroll();

/* =========================================================
   2. Scroll progress bar
   ========================================================= */
const scrollProgress = document.getElementById("scrollProgress");
const siteHeader = document.getElementById("siteHeader");
const hero = document.getElementById("hero");

function onScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + "%";

  if (siteHeader) {
    if (scrollTop > 10) siteHeader.classList.add("scrolled");
    else siteHeader.classList.remove("scrolled");

    if (hero) {
      const heroBottom = hero.offsetTop + hero.offsetHeight - 80;
      if (scrollTop < heroBottom) siteHeader.classList.add("on-dark");
      else siteHeader.classList.remove("on-dark");
    }
  }
}
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* =========================================================
   3. Custom cursor (desktop only)
   ========================================================= */
const cursor = document.getElementById("cursor");
const cursorDot = cursor?.querySelector(".cursor-dot");
const cursorRing = cursor?.querySelector(".cursor-ring");

if (cursor && !isTouch) {
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = mx + "px";
      cursorDot.style.top = my + "px";
    }
  });

  function animateRing() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (cursorRing) {
      cursorRing.style.left = rx + "px";
      cursorRing.style.top = ry + "px";
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
  document.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));

  document.querySelectorAll("[data-cursor]").forEach((el) => {
    const type = el.getAttribute("data-cursor");
    el.addEventListener("mouseenter", () => {
      cursor.classList.add(type === "cta" ? "is-cta" : "is-hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-hover", "is-cta");
    });
  });
} else {
  cursor?.remove();
}

/* =========================================================
   4. Magnetic buttons
   ========================================================= */
if (!isTouch) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    const strength = 0.3;
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;

      const lx = ((e.clientX - rect.left) / rect.width) * 100;
      const ly = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", lx + "%");
      el.style.setProperty("--my", ly + "%");
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
      el.style.removeProperty("--mx");
      el.style.removeProperty("--my");
    });
  });
}

/* =========================================================
   5. Mask reveal + generic reveal
   Robust: IntersectionObserver + viewport-visible prime + safety timer.
   If the page is opened while hidden (backgrounded tab), observers may
   not fire; we still reveal what's already in the viewport, and a
   fail-safe timer un-hides anything still stuck after 2.8s so the site
   never appears half-empty.
   ========================================================= */
const revealEls = document.querySelectorAll(".reveal, .mask-reveal, .hero-title");

function isInViewport(el) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return r.top < vh * 0.92 && r.bottom > 0;
}

if (prefersReduced) {
  // A11y: skip the entrance animation entirely.
  revealEls.forEach((el) => el.classList.add("is-in"));
} else if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  // Prime: anything already in the viewport on load reveals instantly
  // (so above-the-fold content never waits for a scroll event).
  requestAnimationFrame(() => {
    revealEls.forEach((el) => {
      if (isInViewport(el)) {
        el.classList.add("is-in");
        io.unobserve(el);
      }
    });
  });

  // Hero title plays immediately on load
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    requestAnimationFrame(() => heroTitle.classList.add("is-in"));
  }

  // Fail-safe: if anything is still hidden after 2.8s, reveal it.
  // Prevents the site looking empty when observers never fire (hidden
  // tabs, off-screen windows, Lenis edge-cases).
  setTimeout(() => {
    revealEls.forEach((el) => {
      if (!el.classList.contains("is-in")) el.classList.add("is-in");
    });
  }, 2800);
} else {
  revealEls.forEach((el) => el.classList.add("is-in"));
}

/* =========================================================
   6. Card / Bento hover spotlight
   ========================================================= */
document.querySelectorAll(".card, .bento-item").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", x + "%");
    card.style.setProperty("--my", y + "%");
  });
  card.addEventListener("mouseleave", () => {
    card.style.removeProperty("--mx");
    card.style.removeProperty("--my");
  });
});

/* =========================================================
   8. Process rail progress
   ========================================================= */
function initProcessRail() {
  const section = document.querySelector(".process-section");
  const fill = document.getElementById("processFill");
  if (!section || !fill) return;

  function update() {
    const rect = section.getBoundingClientRect();
    const viewport = window.innerHeight;
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const start = viewport * 0.7;
    const end = -sectionHeight + viewport * 0.4;
    const progress = Math.max(0, Math.min(1, (start - sectionTop) / (start - end)));
    fill.style.height = progress * 100 + "%";
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}
initProcessRail();

/* =========================================================
   9. Stat counters
   ========================================================= */
function animateCounter(el, target, durationOverride) {
  const countEl = el.querySelector(".count");
  if (!countEl) return;
  if (prefersReduced) {
    countEl.textContent = target;
    el.classList.add("stat-count-done");
    return;
  }
  const staggerMs = parseFloat(el.getAttribute("data-stagger") || "0") || 0;
  const duration =
    typeof durationOverride === "number" && durationOverride > 0
      ? durationOverride
      : parseFloat(el.getAttribute("data-duration") || "3000") || 3000;

  el.classList.add("stat--counting");

  const run = () => {
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      // easeOutQuint: desacelera al final, sensación más “premium”
      const eased = 1 - Math.pow(1 - t, 5);
      const value = Math.floor(eased * target);
      countEl.textContent = value;
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        countEl.textContent = target;
        el.classList.remove("stat--counting");
        el.classList.add("stat-count-done");
      }
    }
    requestAnimationFrame(tick);
  };

  if (staggerMs > 0) setTimeout(run, staggerMs);
  else run();
}

if ("IntersectionObserver" in window) {
  const statIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = parseFloat(entry.target.getAttribute("data-count"));
        animateCounter(entry.target, target);
        statIO.unobserve(entry.target);
      });
    },
    { threshold: 0.32, rootMargin: "0px 0px -8% 0px" }
  );
  const stats = document.querySelectorAll(".stat[data-count]");
  stats.forEach((el) => statIO.observe(el));

  // Fail-safe: si el contador no arrancó, completar con animación más corta
  setTimeout(() => {
    stats.forEach((el) => {
      const countEl = el.querySelector(".count");
      if (countEl && countEl.textContent.trim() === "0") {
        const target = parseFloat(el.getAttribute("data-count"));
        if (isInViewport(el)) animateCounter(el, target, 1400);
        else countEl.textContent = target;
      }
    });
  }, 4200);
} else {
  // No IO support: just set final values
  document.querySelectorAll(".stat[data-count]").forEach((el) => {
    const countEl = el.querySelector(".count");
    const target = parseFloat(el.getAttribute("data-count"));
    if (countEl) countEl.textContent = target;
  });
}

/* =========================================================
   10. 3D tilt (CTA card)
   ========================================================= */
if (!isTouch) {
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1200px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

/* =========================================================
   11. Hero background video — graceful reveal + parallax
   ========================================================= */
function initHeroVideo() {
  const hero = document.getElementById("hero");
  const video = document.getElementById("heroVideo");
  if (!hero || !video) return;

  const markReady = () => hero.classList.add("is-ready");

  if (video.readyState >= 2) {
    markReady();
  } else {
    video.addEventListener("loadeddata", markReady, { once: true });
    setTimeout(markReady, 1200);
  }

  if (prefersReduced) {
    try { video.pause(); } catch (_) {}
    return;
  }

  // Avoid heavy eager loading on small screens.
  if (window.matchMedia("(max-width: 720px)").matches) {
    video.preload = "metadata";
  }

  const tryPlay = () => {
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };
  tryPlay();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) tryPlay();
  });

  // Pause when hero is off-screen to save CPU/battery
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) tryPlay();
          else video.pause();
        });
      },
      { threshold: 0.05 }
    );
    io.observe(hero);
  }
}
initHeroVideo();

/* =========================================================
  12. Mobile navigation
  ========================================================= */
function navToggleLabel(open) {
  const i18n = window.PicanteI18n;
  if (!i18n) return open ? "Cerrar menú de navegación" : "Abrir menú de navegación";
  return open ? i18n.t("a11y.navClose") : i18n.t("a11y.navOpen");
}

function initMobileNav() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("navToggle");
  const backdrop = document.getElementById("navBackdrop");
  const drawer = document.getElementById("navDrawer");
  if (!header || !toggle || !backdrop || !drawer) return;

  const setOpen = (open) => {
    header.classList.toggle("nav-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", navToggleLabel(open));
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    backdrop.setAttribute("aria-hidden", open ? "false" : "true");
  };

  toggle.addEventListener("click", () => setOpen(!header.classList.contains("nav-open")));
  backdrop.addEventListener("click", () => setOpen(false));

  drawer.querySelectorAll(".nav-drawer-link").forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  document.querySelector(".brand")?.addEventListener("click", () => setOpen(false));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}
initMobileNav();

/* =========================================================
  13. Google Calendar scheduling (retry + fallback)
  ========================================================= */
const CALENDAR_BOOK_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2tGRPxb4jN6Z6jf9zVSZuxGKlPQUWvckgLsWh-2YcP9gBGAz5HkezKdBU-G_V9FnDTVVzJhVvm?gv=true";

let calendarLoaded = false;

function calendarLabel() {
  return window.PicanteI18n?.t("calendar.label") || "Programar una cita";
}

function initCalendarScheduling(force) {
  const target = document.getElementById("calendar-scheduling-button");
  const fallback = document.getElementById("calendarFallback");
  if (!target) return;

  const showFallback = () => {
    if (fallback) fallback.hidden = false;
  };

  const tryLoad = () => {
    if (!window.calendar?.schedulingButton) return false;
    try {
      target.innerHTML = "";
      window.calendar.schedulingButton.load({
        url: CALENDAR_BOOK_URL,
        color: "#c31c1e",
        label: calendarLabel(),
        target,
      });
      calendarLoaded = true;
      return true;
    } catch (_) {
      calendarLoaded = true;
      showFallback();
      return true;
    }
  };

  if (!force && calendarLoaded && tryLoad()) return;
  if (tryLoad()) return;

  let attempts = 0;
  const id = setInterval(() => {
    attempts += 1;
    if (tryLoad() || attempts >= 60) {
      clearInterval(id);
      if (!calendarLoaded) showFallback();
    }
  }, 200);
}

window.addEventListener("load", () => initCalendarScheduling());
window.addEventListener("picante:langchange", () => initCalendarScheduling(true));

/* =========================================================
  14. Tracking + form conversion (sin redirección abrupta)
  ========================================================= */
function trackEvent(name, params = {}) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", name, params);
    }
  } catch (_) {}
}

document.querySelectorAll(".track-event").forEach((el) => {
  el.addEventListener("click", () => {
    const eventName = el.getAttribute("data-event-name");
    if (eventName) trackEvent(eventName, { location: "landing_page" });
  });
});

const contactMiniForm = document.getElementById("contactMiniForm");
const formSuccess = document.getElementById("formSuccess");
const formSuccessMailto = document.getElementById("formSuccessMailto");
const formSuccessWhatsapp = document.getElementById("formSuccessWhatsapp");
const formSuccessCopy = document.getElementById("formSuccessCopy");
const formSuccessReset = document.getElementById("formSuccessReset");
const formSuccessPre = document.getElementById("formSuccessPre");

let lastSummaryText = "";

if (contactMiniForm && formSuccess && formSuccessMailto && formSuccessWhatsapp) {
  contactMiniForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(contactMiniForm);
    const nombre = (formData.get("nombre") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const objetivo = (formData.get("objetivo") || "").toString().trim();
    const i18n = window.PicanteI18n;
    const subject = encodeURIComponent(i18n?.t("form.mailSubject") || "Nuevo diagnóstico desde sitio web");
    const nameLabel = i18n?.t("form.mailBodyName") || "Nombre";
    const emailLabel = i18n?.t("form.mailBodyEmail") || "Email";
    const goalLabel = i18n?.t("form.mailBodyGoal") || "Objetivo principal";
    const bodyPlain = `${nameLabel}: ${nombre}\n${emailLabel}: ${email}\n${goalLabel}: ${objetivo}`;
    const body = encodeURIComponent(bodyPlain);
    lastSummaryText = bodyPlain;
    if (formSuccessPre) formSuccessPre.textContent = lastSummaryText;
    formSuccessMailto.href = `mailto:mateo@pimenton.io?subject=${subject}&body=${body}`;
    const waIntro = i18n?.t("form.waIntro") || "Hola Mateo, te escribo desde el sitio Picante:";
    const waText = encodeURIComponent(`${waIntro}\n\n${lastSummaryText}`);
    formSuccessWhatsapp.href = `https://wa.me/573135076319?text=${waText}`;
    trackEvent("mini_form_submit", { location: "cta_section" });
    contactMiniForm.setAttribute("hidden", "");
    formSuccess.removeAttribute("hidden");
    formSuccess.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "nearest" });
  });
}

if (formSuccessCopy) {
  const copyLabel = formSuccessCopy.querySelector("span");
  const copyDefault = () =>
    window.PicanteI18n?.t("cta.copySummary") || "Copiar resumen";
  formSuccessCopy.addEventListener("click", async () => {
    if (!lastSummaryText) return;
    try {
      await navigator.clipboard.writeText(lastSummaryText);
      if (copyLabel) copyLabel.textContent = window.PicanteI18n?.t("cta.copied") || "Copiado";
      setTimeout(() => {
        if (copyLabel) copyLabel.textContent = copyDefault();
      }, 2200);
    } catch (_) {
      if (copyLabel) copyLabel.textContent = window.PicanteI18n?.t("cta.copyFromBox") || "Copia desde el recuadro";
      setTimeout(() => {
        if (copyLabel) copyLabel.textContent = copyDefault();
      }, 2800);
    }
  });
}

if (formSuccessReset && contactMiniForm && formSuccess) {
  formSuccessReset.addEventListener("click", () => {
    formSuccess.setAttribute("hidden", "");
    contactMiniForm.removeAttribute("hidden");
    contactMiniForm.reset();
  });
}

let trackedHalfScroll = false;
window.addEventListener("scroll", () => {
  if (trackedHalfScroll) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (pct >= 50) {
    trackedHalfScroll = true;
    trackEvent("scroll_50", { location: "landing_page" });
  }
}, { passive: true });
