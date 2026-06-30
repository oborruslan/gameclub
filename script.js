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
let toastTimer;
let lastFocusedElement;
let ticking = false;

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
  header.classList.toggle("is-scrolled", window.scrollY > 28);
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

updateHeader();
updateParallax();
createParticles();
window.addEventListener("scroll", onScroll, { passive: true });

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

document.querySelectorAll("[data-reveal]").forEach((element) => {
  element.classList.add("reveal-ready");
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
