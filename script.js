const header = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobilePanel = document.querySelector(".mobile-panel");
const toast = document.querySelector(".toast");
const heroImage = document.querySelector(".hero-bg img");
const particleField = document.querySelector("#particle-field");
const modal = document.querySelector("#attraction-modal");
const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalTag = document.querySelector("#modal-tag");
const modalDescription = document.querySelector("#modal-description");
const modalThumbs = document.querySelector("#modal-thumbs");
const quickDock = document.querySelector(".mobile-action-dock");
const dockLinks = document.querySelectorAll(".mobile-action-dock a");
const motionCards = document.querySelectorAll(".attraction-card, .game-card, .gallery-item");
const tiltCards = document.querySelectorAll(".attraction-card");
const mobileMotionQuery = window.matchMedia("(max-width: 640px)");
let toastTimer;
let lastFocusedElement;
let ticking = false;
let activeObserver;

const attractionDetails = {
  "vr-zone": {
    tag: "16 headset-uri",
    title: "VR Zone",
    description:
      "Zona VR este gândită pentru grupuri care vor să intre rapid în joc: headset-uri multiple, lumi imersive, sesiuni multiplayer și lumină neon care ține atmosfera sus.",
    images: ["assets/vr-original.jpg", "assets/hero-original.jpg", "assets/experience-poster.jpg"],
  },
  "playstation-zone": {
    tag: "dueluri premium",
    title: "Playstation Zone",
    description:
      "O zonă socială pentru meciuri, turnee scurte și seri de gaming. Ecrane mari, setup confortabil și o atmosferă curată, întunecată, făcută pentru competiție.",
    images: ["assets/playstation-original.jpg", "assets/menu-prices.png", "assets/reception.jpg"],
  },
  "vr-shooter-zone": {
    tag: "shooter arena",
    title: "VR Shooter Zone",
    description:
      "Alege misiunea, intră cu echipa și joacă în ritm rapid. VR Shooter Zone combină reflexele, mișcarea și energia unei arene futuriste.",
    images: ["assets/hero-original.jpg", "assets/vr-players.jpg", "assets/inside.jpg"],
  },
};

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function updateHeader() {
  const scrolled = window.scrollY > 28;
  header.classList.toggle("is-scrolled", scrolled);
  quickDock?.classList.toggle("is-visible", window.scrollY > 360);
}

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
}

function updateParallax() {
  if (!heroImage) return;
  const offset = Math.min(window.scrollY * 0.08, 70);
  heroImage.style.transform = `translate3d(0, ${offset}px, 0) scale(1.06)`;
}

function onScroll() {
  updateHeader();
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateScrollProgress();
    updateParallax();
    ticking = false;
  });
}

function closeMenu() {
  header.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Deschide meniul");
}

function openModal(key) {
  const details = attractionDetails[key];
  if (!details) return;

  lastFocusedElement = document.activeElement;
  modalImage.src = details.images[0];
  modalImage.alt = details.title;
  modalTag.textContent = details.tag;
  modalTitle.textContent = details.title;
  modalDescription.textContent = details.description;
  modalThumbs.innerHTML = "";

  details.images.slice(1).forEach((src, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "modal-thumb";
    thumb.innerHTML = `<img src="${src}" alt="${details.title} thumbnail ${index + 1}" />`;
    thumb.addEventListener("click", () => {
      modalImage.src = src;
    });
    modalThumbs.appendChild(thumb);
  });

  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("is-open");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  if (lastFocusedElement) lastFocusedElement.focus();
}

function createParticles() {
  if (!particleField) return;
  const fragment = document.createDocumentFragment();
  const particleCount = window.matchMedia("(max-width: 640px)").matches ? 24 : 42;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const size = Math.random() * 2.4 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 12 + 12}s`;
    particle.style.animationDelay = `${Math.random() * -10}s`;
    particle.style.opacity = `${Math.random() * 0.45 + 0.2}`;
    fragment.appendChild(particle);
  }

  particleField.appendChild(fragment);
}

function setupMobileActiveStates() {
  if (activeObserver) activeObserver.disconnect();
  motionCards.forEach((card) => card.classList.remove("is-active"));

  if (!("IntersectionObserver" in window) || !mobileMotionQuery.matches) return;

  activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-active", entry.isIntersecting);
      });
    },
    { threshold: 0.58, rootMargin: "-16% 0px -24%" },
  );

  motionCards.forEach((card) => activeObserver.observe(card));
}

function setupDesktopTilt() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-y * 3.2).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 4.2).toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

updateHeader();
updateScrollProgress();
updateParallax();
createParticles();
setupMobileActiveStates();
setupDesktopTilt();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", () => {
  updateScrollProgress();
  setupMobileActiveStates();
});

if (mobileMotionQuery.addEventListener) {
  mobileMotionQuery.addEventListener("change", setupMobileActiveStates);
}

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-active");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Închide meniul" : "Deschide meniul");
});

mobilePanel.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.querySelectorAll(".lang-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".lang-button").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.lang === button.dataset.lang);
    });

    if (button.dataset.lang !== "RO") {
      showToast(`Versiunea ${button.dataset.lang} este pregătită pentru conectarea conținutului.`);
    }
  });
});

document.querySelectorAll("[data-reveal]").forEach((element, index) => {
  element.classList.add("reveal-ready");
  element.style.setProperty("--reveal-index", index % 8);
});

document.querySelectorAll(".stat-card, .game-card").forEach((element, index) => {
  element.style.setProperty("--reveal-index", index % 8);
});

dockLinks.forEach((link) => {
  link.addEventListener("click", () => {
    dockLinks.forEach((item) => item.classList.toggle("is-active", item === link));
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px" },
  );

  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll(".attraction-card").forEach((card) => {
  card.addEventListener("click", () => openModal(card.dataset.attraction));
});

modal.querySelectorAll("[data-modal-close]").forEach((control) => {
  control.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (modal.classList.contains("is-open")) closeModal();
    if (header.classList.contains("menu-active")) closeMenu();
  }
});
