const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function closeMenu() {
  document.body.classList.remove("nav-open");
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  {
    rootMargin: "-22% 0px -58% 0px",
    threshold: [0.18, 0.32, 0.5]
  }
);

sections.forEach((section) => observer.observe(section));

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const code = document.getElementById(button.dataset.copy);
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code.textContent.trim());
      const originalText = button.textContent;
      button.textContent = "Copiato";
      window.setTimeout(() => {
        button.textContent = originalText;
      }, 1400);
    } catch {
      button.textContent = "Errore";
    }
  });
});

document.querySelectorAll("[data-endpoint][data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    const code = document.getElementById(button.dataset.query);
    if (!code) return;

    const endpointUrl = new URL(button.dataset.endpoint);
    endpointUrl.searchParams.set("query", code.textContent.trim());
    window.open(endpointUrl.toString(), "_blank", "noopener");
  });
});

document.querySelectorAll("[data-explain]").forEach((button) => {
  button.addEventListener("click", () => {
    const explanation = document.getElementById(button.dataset.explain);
    if (!explanation) return;

    const isHidden = explanation.hidden;
    explanation.hidden = !isHidden;
    button.setAttribute("aria-expanded", String(isHidden));
    button.textContent = isHidden ? "Nascondi spiegazione" : "Spiega query";
  });
});

document.querySelectorAll("[data-prompt-carousel]").forEach((carousel) => {
  const cases = Array.from(carousel.querySelectorAll("[data-case-index]"));
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const status = carousel.querySelector("[data-case-status]");
  let activeIndex = cases.findIndex((item) => item.classList.contains("is-active"));

  if (activeIndex < 0) activeIndex = 0;

  function showCase(index) {
    activeIndex = (index + cases.length) % cases.length;

    cases.forEach((item, itemIndex) => {
      const isActive = itemIndex === activeIndex;
      item.hidden = !isActive;
      item.classList.toggle("is-active", isActive);
    });

    if (status) {
      status.textContent = `${activeIndex + 1} / ${cases.length}`;
    }
  }

  previousButton?.addEventListener("click", () => {
    showCase(activeIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    showCase(activeIndex + 1);
  });

  if (cases.length > 0) {
    showCase(activeIndex);
  }
});
