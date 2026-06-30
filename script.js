const header = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3600);
}

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-active");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Închide meniul" : "Deschide meniul");
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("menu-active");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Deschide meniul");
  });
});

const revealElements = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" },
  );
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const langButtons = document.querySelectorAll(".lang-button");
langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.lang === "ru") {
      showToast("Versiunea în limba rusă este pregătită pentru următoarea etapă.");
      return;
    }
    langButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  });
});

const faqItems = document.querySelectorAll(".faq-list details");
faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const bookingForm = document.querySelector("#booking-form");
const formMessage = bookingForm.querySelector(".form-message");
const dateInput = bookingForm.querySelector('input[type="date"]');
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);
dateInput.min = localToday;

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";
  bookingForm.querySelectorAll(".is-invalid").forEach((field) => field.classList.remove("is-invalid"));

  const requiredFields = [...bookingForm.querySelectorAll("[required]")];
  const invalidFields = requiredFields.filter((field) => {
    if (field.type === "checkbox") return !field.checked;
    return !field.value.trim();
  });

  if (invalidFields.length) {
    invalidFields.forEach((field) => field.classList.add("is-invalid"));
    formMessage.textContent = "Completează câmpurile obligatorii pentru a continua.";
    invalidFields[0].focus();
    return;
  }

  const name = bookingForm.elements.name.value.trim();
  formMessage.textContent = `Mulțumim, ${name}. Formularul este valid și pregătit pentru conectarea la WhatsApp sau email.`;
  showToast("Cererea a fost validată local. Nu a fost transmisă încă.");
  bookingForm.reset();
  bookingForm.elements.participants.value = "2";
});
