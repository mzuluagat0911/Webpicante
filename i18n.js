/* Picante — ES / EN */
(function () {
  const STORAGE_KEY = "picante-lang";

  const translations = {
    es: {
      meta: {
        title: "Picante Studio | Agencia de Growth, Performance e IA para marcas que escalan",
        description:
          "Agencia de growth con estrategia, creatividad, performance e IA. Escala tu marca en USA, LATAM y Europa con un sistema medible.",
      },
      a11y: {
        navMain: "Principal",
        navMobile: "Móvil",
        navOpen: "Abrir menú de navegación",
        navClose: "Cerrar menú de navegación",
        langSwitch: "Idioma del sitio",
        langLabel: "Idioma",
        brand: "Picante",
        calendarHidden: "Agendar en Google Calendar",
        floatingWa: "Abrir WhatsApp para agendar diagnóstico",
        formSummary: "Resumen del mensaje",
      },
      nav: {
        services: "Servicios",
        philosophy: "Filosofía",
        methodology: "Metodología",
        process: "Proceso",
        clients: "Clientes",
        cases: "Casos",
        pulse: "Pulse",
        faq: "FAQ",
        schedule: "Agendar",
        scheduleMeeting: "Agendar reunión",
      },
      hero: {
        regions: "USA · LATAM · Europa",
        titleL1: "Las marcas que ganan",
        titleL2a: "atención ",
        titleL2em: "no gritan.",
        titleL3: "Conectan.",
        sub: "Diseñamos sistemas de crecimiento donde estrategia, creatividad e inteligencia artificial trabajan como uno solo.",
        ctaPrimary: "Descubrir el sistema",
        ctaSecondary: "Agendar reunión",
        scroll: "Scroll",
        marquee: ["Estrategia", "Creatividad", "Performance", "Social", "Tech", "IA & growth"],
      },
      inlineCta: {
        text: "Reserva 30 minutos: sales con diagnóstico y próximos pasos claros.",
        btn: "Abrir agenda",
      },
      philosophy: {
        eyebrow: "Filosofía",
        l1: "Creatividad humana.",
        l2: "Tecnología real.",
        lead: "No creemos en piezas sueltas. Creemos en sistemas. Cada idea, cada campaña y cada línea de código trabaja para un mismo objetivo.",
      },
      services: {
        eyebrow: "Servicios",
        l1: "Seis disciplinas.",
        l2: "Una arquitectura.",
        lead: "Seis capacidades integradas que funcionan como un solo motor de crecimiento. Sin fricción, sin silos, sin ruido.",
        badge: "Nuevo",
        aiTitle: "Sistemas de crecimiento con IA",
        aiDesc:
          "IA en el core del negocio. Agentes autónomos, automatizaciones y optimización continua para escalar con estructura.",
        aiL1: "Agentes de IA",
        aiL2: "Automatización",
        aiL3: "Data + ML",
        s1Title: "Estrategia & Branding",
        s1Desc: "Primero el sistema, después la pieza. La marca como base de todo lo que viene después.",
        s2Title: "Creación de Contenido",
        s2Desc: "Ideas hechas para ser vistas, recordadas y compartidas. Cada pieza con un objetivo.",
        s3Title: "Performance",
        s3Desc: "Escalamos lo que funciona. Descartamos lo que no. Decisiones guiadas por datos.",
        s4Title: "Social Media",
        s4Desc: "Relación, no solo presencia. Comunidades que conectan, conversan y compran.",
        s5Title: "Desarrollo & Tech",
        s5Desc: "Infraestructura para escalar sin fricción. Web, e-commerce, integraciones y plataformas a medida.",
      },
      methodology: {
        eyebrow: "Metodología",
        l1: "Menos ocurrencias.",
        l2: "Más sistema y evidencia.",
        c1Title: "1. Diagnóstico de embudo",
        c1Desc: "Auditoría de tráfico, narrativa, oferta y conversión para detectar el cuello de botella real.",
        c2Title: "2. Roadmap de crecimiento",
        c2Desc: "Hipótesis priorizadas por impacto, velocidad y costo para ejecutar con foco y sin dispersión.",
        c3Title: "3. Ejecución integrada",
        c3Desc: "Contenido, anuncios, automatizaciones y optimización corriendo como un solo sistema.",
      },
      reach: {
        eyebrow: "Alcance",
        l1: "Visión global.",
        l2: "Ejecución local.",
        lead: "Operamos en ocho países. Un mismo estándar de excelencia, adaptado a cada cultura, mercado y audiencia.",
        statCountries: "Países",
        statBrands: "Marcas impactadas",
        statRetention: "Retención de clientes",
      },
      results90: {
        title: "Resultados que buscamos en los primeros 90 días",
        l1: "Reducir CAC y elevar tasa de conversión.",
        l2: "Aumentar velocidad de aprendizaje del equipo comercial.",
        l3: "Construir activos repetibles de contenido y adquisición.",
      },
      process: {
        eyebrow: "Proceso",
        l1: "Un sistema.",
        l2: "Cuatro movimientos.",
        s1Title: "Diagnóstico",
        s1Desc: "Entendemos tu marca, tu mercado y tu momento. Antes de proponer, escuchamos y medimos.",
        s2Title: "Arquitectura",
        s2Desc: "Diseñamos el sistema completo: posicionamiento, narrativa, canales, contenido, métricas.",
        s3Title: "Ejecución",
        s3Desc: "Producimos, lanzamos y optimizamos. Con velocidad. Sin perder criterio ni excelencia.",
        s4Title: "Escala",
        s4Desc: "Amplificamos lo que funciona con IA, performance y creatividad continua. Sin techo.",
      },
      clients: {
        eyebrow: "Clientes",
        l1: "Marcas que ya confiaron",
        l2: "en el sistema.",
        notes: [
          "Delivery · Apertura Colombia y México",
          "Gastronomía · Sitio web",
          "Gastronomía · E-commerce",
          "Gastronomía · Paid media",
          "Gastronomía · E-commerce",
          "Gastronomía · Branding y mailing",
          "Logística · Contenidos y paid media",
          "Retail · Branding",
          "Fintech · Contenidos y paid media",
          "Fintech · Contenidos y paid media",
          "Cine · Estrategia de contenidos",
          "Fintech · Contenidos y paid media",
        ],
        alts: [
          "Cliente: delivery y expansión regional",
          "Cliente: gastronomía, sitio web",
          "Cliente: gastronomía, e-commerce",
          "Cliente: gastronomía, paid media",
          "Cliente: gastronomía, e-commerce",
          "Cliente: gastronomía, branding y mailing",
          "Cliente: logística, contenidos y paid media",
          "Cliente: retail, branding",
          "Cliente: fintech, contenidos y paid media",
          "Cliente: fintech, contenidos y paid media",
          "Cliente: entretenimiento, estrategia de contenidos",
          "Cliente: fintech, contenidos y paid media",
        ],
      },
      cases: {
        eyebrow: "Impacto",
        l1: "Tipo de resultados",
        l2: "que buscamos generar.",
        m1: "−22% CAC",
        l1label: "Performance + creatividad",
        d1: "Reestructura de embudo y pruebas semanales en anuncios y landing.",
        m2: "+31% tasa de conversión",
        l2label: "Sitio + narrativa",
        d2: "Mensaje alineado a intención de búsqueda y pruebas con prueba social.",
        m3: "+2.4× ROAS",
        l3label: "Escala controlada",
        d3: "Presupuesto gradual con reglas de apagado y optimización por cohorte.",
      },
      faq: {
        eyebrow: "Preguntas frecuentes",
        l1: "Respuestas claras.",
        l2: "Decisiones más rápidas.",
        q1: "¿Para qué tipo de marca es ideal Picante?",
        a1: "Para marcas que ya venden y necesitan escalar con estrategia, ejecución y medición, no solo más piezas sueltas.",
        q2: "¿Qué recibo en la llamada inicial de 30 minutos?",
        a2: "Un diagnóstico de situación, oportunidades priorizadas y una ruta accionable de corto plazo.",
        q3: "¿En cuánto tiempo se empiezan a ver mejoras?",
        a3: "Normalmente en 4 a 8 semanas vemos señales claras en eficiencia y calidad de resultados; la escala sólida se consolida en 90 días.",
      },
      cta: {
        eyebrow: "Siguiente capítulo",
        l1: "Si tu marca ya vende,",
        l2: "el próximo paso es escalar.",
        lead: "Conversemos 30 minutos. Sin compromiso. Sales con un diagnóstico claro, prioridades por impacto y un camino accionable.",
        hint: "Paso recomendado:",
        hintRest:
          " agenda en el calendario. Si prefieres, escribe por WhatsApp o correo; el formulario sirve para dejarnos contexto antes de hablar.",
        ideal: "Ideal para:",
        idealRest: " marcas con producto validado y objetivo de crecimiento.",
        notIdeal: "No ideal para:",
        notIdealRest: " proyectos en etapa de idea sin operación comercial activa.",
        calendarLead: "Elige horario que te encaje:",
        calendarBtn: "Programar una cita",
        channels: "Otras vías",
        formName: "Nombre",
        formEmail: "Email de trabajo",
        formGoal: "¿Qué quieres escalar primero?",
        formSubmit: "Enviar resumen",
        backServices: "Volver a servicios",
        successTitle: "Listo. Siguiente paso:",
        successCopy:
          "Abre tu correo para enviarnos el resumen, o copia el texto y pégalo en WhatsApp si prefieres.",
        openMail: "Abrir correo",
        copySummary: "Copiar resumen",
        copied: "Copiado",
        copyFromBox: "Copia desde el recuadro",
        openWa: "Abrir WhatsApp",
        sendAnother: "Enviar otro mensaje",
      },
      footer: {
        tagline: "Sistemas de crecimiento para marcas ambiciosas.",
        company: "Compañía",
        contact: "Contacto",
        regions: "Regiones",
        designed: "Diseñado con intención.",
      },
      form: {
        mailSubject: "Nuevo diagnóstico desde sitio web",
        mailBodyName: "Nombre",
        mailBodyEmail: "Email",
        mailBodyGoal: "Objetivo principal",
        waIntro: "Hola Mateo, te escribo desde el sitio Picante:",
        waHero: "Hola Mateo, quiero agendar un diagnóstico.",
      },
      calendar: {
        label: "Programar una cita",
      },
    },
    en: {
      meta: {
        title: "Picante Studio | Growth, Performance & AI Agency for Scaling Brands",
        description:
          "Growth agency combining strategy, creativity, performance, and AI. Scale your brand across the US, LATAM, and Europe with a measurable system.",
      },
      a11y: {
        navMain: "Main",
        navMobile: "Mobile",
        navOpen: "Open navigation menu",
        navClose: "Close navigation menu",
        langSwitch: "Site language",
        langLabel: "Language",
        brand: "Picante",
        calendarHidden: "Book on Google Calendar",
        floatingWa: "Open WhatsApp to book a diagnostic call",
        formSummary: "Message summary",
      },
      nav: {
        services: "Services",
        philosophy: "Philosophy",
        methodology: "Methodology",
        process: "Process",
        clients: "Clients",
        cases: "Case studies",
        pulse: "Pulse",
        faq: "FAQ",
        schedule: "Book",
        scheduleMeeting: "Book a call",
      },
      hero: {
        regions: "US · LATAM · Europe",
        titleL1: "Brands that win",
        titleL2a: "attention ",
        titleL2em: "don't shout.",
        titleL3: "They connect.",
        sub: "We design growth systems where strategy, creativity, and artificial intelligence work as one.",
        ctaPrimary: "Explore the system",
        ctaSecondary: "Book a call",
        scroll: "Scroll",
        marquee: ["Strategy", "Creativity", "Performance", "Social", "Tech", "AI & growth"],
      },
      inlineCta: {
        text: "Book 30 minutes: leave with a diagnostic and clear next steps.",
        btn: "Open calendar",
      },
      philosophy: {
        eyebrow: "Philosophy",
        l1: "Human creativity.",
        l2: "Real technology.",
        lead: "We don't believe in isolated pieces. We believe in systems. Every idea, campaign, and line of code serves one goal.",
      },
      services: {
        eyebrow: "Services",
        l1: "Six disciplines.",
        l2: "One architecture.",
        lead: "Six integrated capabilities working as a single growth engine. No friction, no silos, no noise.",
        badge: "New",
        aiTitle: "AI-powered growth systems",
        aiDesc:
          "AI at the core of the business. Autonomous agents, automation, and continuous optimization to scale with structure.",
        aiL1: "AI agents",
        aiL2: "Automation",
        aiL3: "Data + ML",
        s1Title: "Strategy & Branding",
        s1Desc: "System first, assets second. Brand as the foundation for everything that follows.",
        s2Title: "Content Creation",
        s2Desc: "Ideas built to be seen, remembered, and shared. Every piece with a purpose.",
        s3Title: "Performance",
        s3Desc: "We scale what works. Cut what doesn't. Decisions driven by data.",
        s4Title: "Social Media",
        s4Desc: "Relationships, not just presence. Communities that connect, talk, and buy.",
        s5Title: "Development & Tech",
        s5Desc: "Infrastructure to scale without friction. Web, e-commerce, integrations, and custom platforms.",
      },
      methodology: {
        eyebrow: "Methodology",
        l1: "Fewer random ideas.",
        l2: "More system and evidence.",
        c1Title: "1. Funnel diagnostic",
        c1Desc: "Audit of traffic, narrative, offer, and conversion to find the real bottleneck.",
        c2Title: "2. Growth roadmap",
        c2Desc: "Hypotheses prioritized by impact, speed, and cost for focused execution.",
        c3Title: "3. Integrated execution",
        c3Desc: "Content, ads, automation, and optimization running as one system.",
      },
      reach: {
        eyebrow: "Reach",
        l1: "Global vision.",
        l2: "Local execution.",
        lead: "We operate in eight countries. One standard of excellence, adapted to each culture, market, and audience.",
        statCountries: "Countries",
        statBrands: "Brands impacted",
        statRetention: "Client retention",
      },
      results90: {
        title: "Results we target in the first 90 days",
        l1: "Lower CAC and higher conversion rate.",
        l2: "Faster learning velocity for the sales team.",
        l3: "Repeatable content and acquisition assets.",
      },
      process: {
        eyebrow: "Process",
        l1: "One system.",
        l2: "Four moves.",
        s1Title: "Diagnostic",
        s1Desc: "We understand your brand, market, and moment. Before proposing, we listen and measure.",
        s2Title: "Architecture",
        s2Desc: "We design the full system: positioning, narrative, channels, content, metrics.",
        s3Title: "Execution",
        s3Desc: "We produce, launch, and optimize. Fast. Without losing judgment or quality.",
        s4Title: "Scale",
        s4Desc: "We amplify what works with AI, performance, and ongoing creativity. No ceiling.",
      },
      clients: {
        eyebrow: "Clients",
        l1: "Brands that already trust",
        l2: "the system.",
        notes: [
          "Delivery · Colombia & Mexico launch",
          "Food & beverage · Website",
          "Food & beverage · E-commerce",
          "Food & beverage · Paid media",
          "Food & beverage · E-commerce",
          "Food & beverage · Branding & email",
          "Logistics · Content & paid media",
          "Retail · Branding",
          "Fintech · Content & paid media",
          "Fintech · Content & paid media",
          "Entertainment · Content strategy",
          "Fintech · Content & paid media",
        ],
        alts: [
          "Client: delivery and regional expansion",
          "Client: food & beverage, website",
          "Client: food & beverage, e-commerce",
          "Client: food & beverage, paid media",
          "Client: food & beverage, e-commerce",
          "Client: food & beverage, branding and email",
          "Client: logistics, content and paid media",
          "Client: retail, branding",
          "Client: fintech, content and paid media",
          "Client: fintech, content and paid media",
          "Client: entertainment, content strategy",
          "Client: fintech, content and paid media",
        ],
      },
      cases: {
        eyebrow: "Impact",
        l1: "The kind of results",
        l2: "we aim to deliver.",
        m1: "−22% CAC",
        l1label: "Performance + creative",
        d1: "Funnel rebuild and weekly tests on ads and landing pages.",
        m2: "+31% conversion rate",
        l2label: "Site + narrative",
        d2: "Message aligned to search intent and social-proof tests.",
        m3: "+2.4× ROAS",
        l3label: "Controlled scale",
        d3: "Gradual budget with kill rules and cohort-based optimization.",
      },
      faq: {
        eyebrow: "FAQ",
        l1: "Clear answers.",
        l2: "Faster decisions.",
        q1: "What type of brand is Picante ideal for?",
        a1: "Brands that already sell and need to scale with strategy, execution, and measurement—not just more isolated assets.",
        q2: "What do I get in the initial 30-minute call?",
        a2: "A situation diagnostic, prioritized opportunities, and an actionable short-term path.",
        q3: "How soon do improvements show up?",
        a3: "Usually within 4–8 weeks we see clear signals in efficiency and result quality; solid scale consolidates around 90 days.",
      },
      cta: {
        eyebrow: "Next chapter",
        l1: "If your brand already sells,",
        l2: "the next step is to scale.",
        lead: "Let's talk for 30 minutes. No commitment. You'll leave with a clear diagnostic, impact priorities, and an actionable path.",
        hint: "Recommended step:",
        hintRest:
          " book on the calendar. Or reach out via WhatsApp or email; the form helps us get context before we talk.",
        ideal: "Ideal for:",
        idealRest: " brands with a validated product and a growth goal.",
        notIdeal: "Not ideal for:",
        notIdealRest: " idea-stage projects without active commercial operations.",
        calendarLead: "Pick a time that works for you:",
        calendarBtn: "Schedule an appointment",
        channels: "Other channels",
        formName: "Name",
        formEmail: "Work email",
        formGoal: "What do you want to scale first?",
        formSubmit: "Send summary",
        backServices: "Back to services",
        successTitle: "Done. Next step:",
        successCopy:
          "Open your email to send us the summary, or copy the text and paste it in WhatsApp if you prefer.",
        openMail: "Open email",
        copySummary: "Copy summary",
        copied: "Copied",
        copyFromBox: "Copy from the box below",
        openWa: "Open WhatsApp",
        sendAnother: "Send another message",
      },
      footer: {
        tagline: "Growth systems for ambitious brands.",
        company: "Company",
        contact: "Contact",
        regions: "Regions",
        designed: "Designed with intent.",
      },
      form: {
        mailSubject: "New diagnostic from website",
        mailBodyName: "Name",
        mailBodyEmail: "Email",
        mailBodyGoal: "Primary goal",
        waIntro: "Hi Mateo, I'm reaching out from the Picante site:",
        waHero: "Hi Mateo, I'd like to book a diagnostic call.",
      },
      calendar: {
        label: "Schedule an appointment",
      },
    },
  };

  let currentLang = "es";

  function resolve(obj, path) {
    return path.split(".").reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
  }

  function t(key, lang) {
    const l = lang || currentLang;
    const value = resolve(translations[l], key);
    if (value != null) return value;
    return resolve(translations.es, key);
  }

  function applyMarquee(lang) {
    const items = t("hero.marquee", lang);
    if (!Array.isArray(items)) return;
    document.querySelectorAll(".marquee-track").forEach((track) => {
      const buildSequence = () => {
        const fragment = document.createDocumentFragment();
        items.forEach((label) => {
          const text = document.createElement("span");
          text.textContent = label;
          fragment.appendChild(text);
          const dot = document.createElement("span");
          dot.className = "dot";
          dot.textContent = "●";
          fragment.appendChild(dot);
        });
        return fragment;
      };
      track.textContent = "";
      track.appendChild(buildSequence());
      track.appendChild(buildSequence());
    });
  }

  function applyClientCards(lang) {
    const notes = t("clients.notes", lang);
    const alts = t("clients.alts", lang);
    document.querySelectorAll(".client-logo-card").forEach((card, i) => {
      if (Array.isArray(notes) && notes[i]) card.setAttribute("data-client-note", notes[i]);
      const img = card.querySelector("img");
      if (img && Array.isArray(alts) && alts[i]) img.alt = alts[i];
    });
  }

  function applyLanguage(lang) {
    if (!translations[lang]) lang = "es";
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = t(key, lang);
      if (typeof value === "string") el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const value = t(key, lang);
      if (typeof value === "string") el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label"), lang));
    });

    const navToggle = document.getElementById("navToggle");
    if (navToggle) {
      const open = document.getElementById("siteHeader")?.classList.contains("nav-open");
      navToggle.setAttribute(
        "aria-label",
        open ? t("a11y.navClose", lang) : t("a11y.navOpen", lang)
      );
    }

    document.querySelectorAll("[data-i18n-wa]").forEach((el) => {
      const key = el.getAttribute("data-i18n-wa");
      const text = encodeURIComponent(t(key, lang));
      const base = el.getAttribute("data-wa-base") || "https://wa.me/573135076319";
      el.href = `${base}?text=${text}`;
    });

    applyMarquee(lang);
    applyClientCards(lang);

    document.title = t("meta.title", lang);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t("meta.description", lang));

    document.querySelectorAll(".lang-switch-btn").forEach((btn) => {
      const active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    window.dispatchEvent(new CustomEvent("picante:langchange", { detail: { lang } }));
  }

  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "es" || stored === "en") return stored;
    const nav = (navigator.language || "").toLowerCase();
    return nav.startsWith("en") ? "en" : "es";
  }

  function init() {
    document.querySelectorAll(".lang-switch-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang && lang !== currentLang) applyLanguage(lang);
      });
    });
    applyLanguage(detectLang());
  }

  window.PicanteI18n = {
    t,
    applyLanguage,
    getLang: () => currentLang,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
