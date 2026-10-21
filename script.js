(function () {
  const root = document.documentElement;
  root.classList.add("js");

  const body = document.body;
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

  function applyTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const isDark = theme === "dark";
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme",
      );
      const label = button.querySelector("[data-theme-label]");
      if (label) {
        label.textContent = isDark ? "Light" : "Dark";
      }
    });
  }

  applyTheme(initialTheme);

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });
  });

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");

  function setMenuOpen(isOpen) {
    if (!menuToggle || !navPanel) return;
    navPanel.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  }

  if (menuToggle && navPanel) {
    menuToggle.addEventListener("click", () => {
      setMenuOpen(!navPanel.classList.contains("is-open"));
    });

    navPanel.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (link) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("click", (event) => {
      if (!navPanel.classList.contains("is-open")) return;
      const clickedInside = navPanel.contains(event.target) || menuToggle.contains(event.target);
      if (!clickedInside) setMenuOpen(false);
    });
  }

  const currentPage = body.dataset.page || "";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    if (link.dataset.navLink === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    reveals.forEach((node) => observer.observe(node));
  } else {
    reveals.forEach((node) => node.classList.add("is-visible"));
  }

  function shouldInterceptNavigation(anchor) {
    if (!anchor || !anchor.href) return false;
    if (anchor.target && anchor.target !== "_self") return false;
    if (anchor.hasAttribute("download")) return false;
    if (anchor.getAttribute("href").startsWith("#")) return false;
    const url = new URL(anchor.href, window.location.href);
    return url.origin === window.location.origin && url.pathname !== window.location.pathname;
  }

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a");
    if (!anchor || !shouldInterceptNavigation(anchor)) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    body.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = anchor.href;
    }, 140);
  });

  window.addEventListener("pageshow", () => {
    body.classList.remove("is-leaving");
    body.classList.add("is-ready");
  });

  window.addEventListener("load", () => {
    body.classList.add("is-ready");
  });

  const year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const topic = String(formData.get("topic") || "").trim();
      const message = String(formData.get("message") || "").trim();

      const subject = encodeURIComponent(`Portfolio inquiry${topic ? `: ${topic}` : ""}`);
      const bodyText = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
      );

      window.location.href = `mailto:swatirani0106@gmail.com?subject=${subject}&body=${bodyText}`;
    });
  }
})();
