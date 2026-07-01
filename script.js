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
const spotlightTargets = document.querySelectorAll(
  ".button, .stat-card, .attraction-card, .game-card, .gallery-item, .birthday-panel, .contact-card, .contact-list a, .social-link, .mobile-social, .mobile-action-dock a",
);
const mobileMotionQuery = window.matchMedia("(max-width: 640px)");
const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
const supportedLanguages = ["RO", "RU", "EN"];

let toastTimer;
let lastFocusedElement;
let ticking = false;
let activeObserver;
let currentLanguage = "RO";
let activeAttractionKey = null;

const attractionAssets = {
  "vr-zone": ["assets/vr-original.jpg", "assets/hero-original.jpg", "assets/experience-poster.jpg"],
  "playstation-zone": ["assets/playstation-original.jpg", "assets/menu-prices.png", "assets/reception.jpg"],
  "vr-shooter-zone": ["assets/hero-original.jpg", "assets/vr-players.jpg", "assets/inside.jpg"],
};

const translations = {
  RO: {
    lang: "ro",
    title: "GALAXY VR - VR, Shootere și Gaming Premium",
    metaDescription: "GALAXY VR - experiențe VR premium, shootere, PlayStation, curse RC și motion ride.",
    skip: "Sari la conținut",
    brand: { home: "GALAXY VR - Acasă" },
    nav: {
      aria: "Navigație principală",
      mobileAria: "Navigație mobilă",
      fun: "Distracții",
      gallery: "Galerie",
      birthdays: "Zile de naștere",
      contacts: "Contacte",
    },
    social: {
      aria: "Rețele sociale",
      mobileAria: "Rețele sociale mobile",
    },
    language: {
      aria: "Selectare limbă",
      mobileAria: "Selectare limbă mobilă",
      changed: "Limba română este activă.",
    },
    menu: {
      open: "Deschide meniul",
      close: "Închide meniul",
    },
    hero: {
      kicker: "Distracție VR la GALAXY VR",
      titleVr: "VR",
      titleMiddle: ", shootere, curse RC și ",
      titleEnd: "Galaxy Truck.",
      lead: "16 căști VR, shooter zone, labirint laser și motion ride.",
      primary: "Vezi distracțiile",
      call: "Sună",
    },
    console: {
      live: "Live VR",
      laser: "Laser",
    },
    stats: {
      aria: "Statistici GALAXY VR",
      headsets: "căști VR",
      motionGames: "jocuri Motion",
      rcPlayers: "jucători RC",
      motionRide: "Motion Ride",
    },
    marquee: {
      aria: "Atracții GALAXY VR",
      vr: "VR ZONE",
      rc: "GALAXY RC RACING",
      motion: "MOTION RIDE",
    },
    adventure: {
      eyebrow: "Alege-ți aventura",
      titleStart: "Adrenalină. Acțiune. ",
      titleVr: "VR.",
      subtitle:
        "Intră într-o zonă de gaming construită pentru energie, competiție și seri care se simt ca un trailer de film SF.",
    },
    attraction: {
      cta: "Vezi detalii",
      vr: {
        alt: "Jucători în zona VR",
        tag: "16 headset-uri",
        title: "VR Zone",
        sub: "Univers multiplayer",
        desc: "Experiențe imersive pentru prieteni, familie și echipe care vor să intre direct în acțiune.",
      },
      ps: {
        alt: "Zonă PlayStation cu lumină neon",
        tag: "dueluri premium",
        title: "Playstation Zone",
        sub: "Gaming social",
        desc: "Canapele, ecrane mari și atmosferă competitivă pentru sesiuni relaxate sau turnee rapide.",
      },
      shooter: {
        alt: "Jucători cu căști VR și controllere",
        tag: "shooter arena",
        title: "VR Shooter Zone",
        sub: "Team vs team",
        desc: "Sesiuni tactice, reflexe rapide și misiuni VR cu energie de arena futuristă.",
      },
    },
    attractions: {
      "vr-zone": {
        tag: "16 headset-uri",
        title: "VR Zone",
        description:
          "Zona VR este gândită pentru grupuri care vor să intre rapid în joc: headset-uri multiple, lumi imersive, sesiuni multiplayer și lumină neon care ține atmosfera sus.",
      },
      "playstation-zone": {
        tag: "dueluri premium",
        title: "Playstation Zone",
        description:
          "O zonă socială pentru meciuri, turnee scurte și seri de gaming. Ecrane mari, setup confortabil și o atmosferă curată, întunecată, făcută pentru competiție.",
      },
      "vr-shooter-zone": {
        tag: "shooter arena",
        title: "VR Shooter Zone",
        description:
          "Alege misiunea, intră cu echipa și joacă în ritm rapid. VR Shooter Zone combină reflexele, mișcarea și energia unei arene futuriste.",
      },
    },
    lineup: {
      eyebrow: "Gaming lineup",
      title: "Cele mai tari noutăți gaming 2026 în VR",
    },
    gallery: {
      eyebrow: "Galerie",
      title: "Neon, VR și energie de seară memorabilă.",
      receptionAlt: "Recepție gaming cu lumini neon",
      reception: "Recepție neon",
      playersAlt: "Jucători în VR",
      multiplayer: "VR multiplayer",
      entranceAlt: "Intrare în zona VR",
      entrance: "Intrare GALAXY VR",
    },
    birthday: {
      eyebrow: "Zile de naștere",
      title: "Transformă aniversarea într-o misiune VR.",
      text:
        "Rezervări pentru grupuri, sesiuni pe echipe, jocuri ușor de ales și o atmosferă care ține invitații conectați de la primul minut.",
      cta: "Cere disponibilitate",
    },
    contact: {
      eyebrow: "Contacte",
      title: "Rezervă următoarea rundă la GALAXY VR.",
      text: "Spune-ne câți sunteți, ce zonă vreți și când ajungeți. Echipa confirmă intervalul.",
      phone: "Telefon",
      cardText: "VR Zone, Playstation Zone, shooter zone, labirint laser și motion ride.",
      callNow: "Sună acum",
    },
    footer: {
      copy: "© 2026 GALAXY VR. Experiențe gaming premium.",
    },
    dock: {
      aria: "Acțiuni rapide",
      fun: "Distracții",
      call: "Sună",
      contact: "Contact",
    },
    modal: {
      close: "Închide detaliile",
      thumbs: "Imagini atracție",
      thumbnail: "imagine",
    },
  },
  RU: {
    lang: "ru",
    title: "GALAXY VR - VR, шутеры и премиальный гейминг",
    metaDescription: "GALAXY VR - премиальные VR-развлечения, шутеры, PlayStation, RC-гонки и motion ride.",
    skip: "Перейти к содержимому",
    brand: { home: "GALAXY VR - Главная" },
    nav: {
      aria: "Основная навигация",
      mobileAria: "Мобильная навигация",
      fun: "Развлечения",
      gallery: "Галерея",
      birthdays: "Дни рождения",
      contacts: "Контакты",
    },
    social: {
      aria: "Социальные сети",
      mobileAria: "Социальные сети на мобильной версии",
    },
    language: {
      aria: "Выбор языка",
      mobileAria: "Выбор языка в мобильном меню",
      changed: "Русская версия включена.",
    },
    menu: {
      open: "Открыть меню",
      close: "Закрыть меню",
    },
    hero: {
      kicker: "VR-развлечения в GALAXY VR",
      titleVr: "VR",
      titleMiddle: ", шутеры, RC-гонки и ",
      titleEnd: "Galaxy Truck.",
      lead: "16 VR-шлемов, зона шутеров, лазерный лабиринт и motion ride.",
      primary: "Смотреть развлечения",
      call: "Позвонить",
    },
    console: {
      live: "Live VR",
      laser: "Лазер",
    },
    stats: {
      aria: "Статистика GALAXY VR",
      headsets: "VR-шлемов",
      motionGames: "игр Motion",
      rcPlayers: "RC-игроков",
      motionRide: "Motion Ride",
    },
    marquee: {
      aria: "Развлечения GALAXY VR",
      vr: "VR ЗОНА",
      rc: "GALAXY RC ГОНКИ",
      motion: "MOTION RIDE",
    },
    adventure: {
      eyebrow: "Выбери свое приключение",
      titleStart: "Адреналин. Экшен. ",
      titleVr: "VR.",
      subtitle:
        "Погрузись в игровое пространство с энергией, соревнованием и атмосферой вечера из трейлера фантастического фильма.",
    },
    attraction: {
      cta: "Подробнее",
      vr: {
        alt: "Игроки в VR-зоне",
        tag: "16 headset-ов",
        title: "VR Zone",
        sub: "Мультиплеерная вселенная",
        desc: "Иммерсивные развлечения для друзей, семьи и команд, которые хотят сразу войти в игру.",
      },
      ps: {
        alt: "Зона PlayStation с неоновой подсветкой",
        tag: "премиальные дуэли",
        title: "Playstation Zone",
        sub: "Социальный гейминг",
        desc: "Диваны, большие экраны и соревновательная атмосфера для спокойных игровых сессий или быстрых турниров.",
      },
      shooter: {
        alt: "Игроки с VR-шлемами и контроллерами",
        tag: "shooter arena",
        title: "VR Shooter Zone",
        sub: "Команда против команды",
        desc: "Тактические сессии, быстрые реакции и VR-миссии с энергией футуристической арены.",
      },
    },
    attractions: {
      "vr-zone": {
        tag: "16 headset-ов",
        title: "VR Zone",
        description:
          "VR Zone создана для компаний, которые хотят быстро войти в игру: несколько headset-ов, иммерсивные миры, мультиплеерные сессии и неоновый свет, который держит атмосферу на максимуме.",
      },
      "playstation-zone": {
        tag: "премиальные дуэли",
        title: "Playstation Zone",
        description:
          "Социальная зона для матчей, коротких турниров и игровых вечеров. Большие экраны, комфортный setup и чистая темная атмосфера для соревнования.",
      },
      "vr-shooter-zone": {
        tag: "shooter arena",
        title: "VR Shooter Zone",
        description:
          "Выбери миссию, заходи с командой и играй в быстром темпе. VR Shooter Zone соединяет реакцию, движение и энергию футуристической арены.",
      },
    },
    lineup: {
      eyebrow: "Игровая линейка",
      title: "Самые яркие VR-новинки 2026 года",
    },
    gallery: {
      eyebrow: "Галерея",
      title: "Неон, VR и энергия незабываемого вечера.",
      receptionAlt: "Игровая ресепшн-зона с неоновой подсветкой",
      reception: "Неоновая ресепшн-зона",
      playersAlt: "Игроки в VR",
      multiplayer: "VR-мультиплеер",
      entranceAlt: "Вход в VR-зону",
      entrance: "Вход в GALAXY VR",
    },
    birthday: {
      eyebrow: "Дни рождения",
      title: "Преврати день рождения в VR-миссию.",
      text:
        "Бронирование для групп, командные сессии, понятный выбор игр и атмосфера, которая удерживает гостей в игре с первой минуты.",
      cta: "Узнать доступность",
    },
    contact: {
      eyebrow: "Контакты",
      title: "Забронируй следующий раунд в GALAXY VR.",
      text: "Напиши, сколько вас, какую зону хотите и когда планируете прийти. Команда подтвердит время.",
      phone: "Телефон",
      cardText: "VR Zone, Playstation Zone, зона шутеров, лазерный лабиринт и motion ride.",
      callNow: "Позвонить сейчас",
    },
    footer: {
      copy: "© 2026 GALAXY VR. Премиальные игровые развлечения.",
    },
    dock: {
      aria: "Быстрые действия",
      fun: "Развлечения",
      call: "Звонок",
      contact: "Контакт",
    },
    modal: {
      close: "Закрыть детали",
      thumbs: "Изображения развлечения",
      thumbnail: "изображение",
    },
  },
  EN: {
    lang: "en",
    title: "GALAXY VR - VR, Shooters and Premium Gaming",
    metaDescription: "GALAXY VR - premium VR experiences, shooters, PlayStation, RC racing and motion ride.",
    skip: "Skip to content",
    brand: { home: "GALAXY VR - Home" },
    nav: {
      aria: "Main navigation",
      mobileAria: "Mobile navigation",
      fun: "Attractions",
      gallery: "Gallery",
      birthdays: "Birthdays",
      contacts: "Contacts",
    },
    social: {
      aria: "Social media",
      mobileAria: "Mobile social media",
    },
    language: {
      aria: "Language selection",
      mobileAria: "Mobile language selection",
      changed: "English version is active.",
    },
    menu: {
      open: "Open menu",
      close: "Close menu",
    },
    hero: {
      kicker: "VR fun at GALAXY VR",
      titleVr: "VR",
      titleMiddle: ", shooters, RC racing and ",
      titleEnd: "Galaxy Truck.",
      lead: "16 VR headsets, shooter zone, laser labyrinth and motion ride.",
      primary: "See attractions",
      call: "Call",
    },
    console: {
      live: "Live VR",
      laser: "Laser",
    },
    stats: {
      aria: "GALAXY VR stats",
      headsets: "VR headsets",
      motionGames: "Motion games",
      rcPlayers: "RC players",
      motionRide: "Motion Ride",
    },
    marquee: {
      aria: "GALAXY VR attractions",
      vr: "VR ZONE",
      rc: "GALAXY RC RACING",
      motion: "MOTION RIDE",
    },
    adventure: {
      eyebrow: "Choose your adventure",
      titleStart: "Adrenaline. Action. ",
      titleVr: "VR.",
      subtitle:
        "Step into a gaming zone built for energy, competition and nights that feel like a sci-fi movie trailer.",
    },
    attraction: {
      cta: "View details",
      vr: {
        alt: "Players in the VR zone",
        tag: "16 headsets",
        title: "VR Zone",
        sub: "Multiplayer universe",
        desc: "Immersive experiences for friends, families and teams ready to jump straight into the action.",
      },
      ps: {
        alt: "PlayStation zone with neon light",
        tag: "premium duels",
        title: "Playstation Zone",
        sub: "Social gaming",
        desc: "Sofas, big screens and a competitive atmosphere for relaxed sessions or quick tournaments.",
      },
      shooter: {
        alt: "Players with VR headsets and controllers",
        tag: "shooter arena",
        title: "VR Shooter Zone",
        sub: "Team vs team",
        desc: "Tactical sessions, fast reflexes and VR missions with the energy of a futuristic arena.",
      },
    },
    attractions: {
      "vr-zone": {
        tag: "16 headsets",
        title: "VR Zone",
        description:
          "The VR Zone is built for groups that want to jump in fast: multiple headsets, immersive worlds, multiplayer sessions and neon light that keeps the energy high.",
      },
      "playstation-zone": {
        tag: "premium duels",
        title: "Playstation Zone",
        description:
          "A social zone for matches, short tournaments and gaming nights. Big screens, a comfortable setup and a clean dark atmosphere made for competition.",
      },
      "vr-shooter-zone": {
        tag: "shooter arena",
        title: "VR Shooter Zone",
        description:
          "Pick the mission, enter with your team and play at full speed. VR Shooter Zone blends reflexes, movement and the energy of a futuristic arena.",
      },
    },
    lineup: {
      eyebrow: "Gaming lineup",
      title: "The hottest 2026 VR gaming releases",
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Neon, VR and the energy of a memorable night.",
      receptionAlt: "Gaming reception with neon lights",
      reception: "Neon reception",
      playersAlt: "Players in VR",
      multiplayer: "VR multiplayer",
      entranceAlt: "Entrance to the VR zone",
      entrance: "GALAXY VR entrance",
    },
    birthday: {
      eyebrow: "Birthdays",
      title: "Turn a birthday into a VR mission.",
      text:
        "Bookings for groups, team sessions, easy game selection and an atmosphere that keeps guests connected from the first minute.",
      cta: "Check availability",
    },
    contact: {
      eyebrow: "Contacts",
      title: "Book your next round at GALAXY VR.",
      text: "Tell us how many people are coming, which zone you want and when you plan to arrive. The team will confirm the time slot.",
      phone: "Phone",
      cardText: "VR Zone, Playstation Zone, shooter zone, laser labyrinth and motion ride.",
      callNow: "Call now",
    },
    footer: {
      copy: "© 2026 GALAXY VR. Premium gaming experiences.",
    },
    dock: {
      aria: "Quick actions",
      fun: "Attractions",
      call: "Call",
      contact: "Contact",
    },
    modal: {
      close: "Close details",
      thumbs: "Attraction images",
      thumbnail: "image",
    },
  },
};

function getNestedValue(source, path) {
  return path.split(".").reduce((value, part) => value?.[part], source);
}

function translate(path, lang = currentLanguage) {
  return getNestedValue(translations[lang], path) ?? getNestedValue(translations.RO, path) ?? path;
}

function getStoredLanguage() {
  try {
    const stored = window.localStorage.getItem("galaxy-vr-language");
    return supportedLanguages.includes(stored) ? stored : "RO";
  } catch {
    return "RO";
  }
}

function storeLanguage(lang) {
  try {
    window.localStorage.setItem("galaxy-vr-language", lang);
  } catch {
    // Local storage can be unavailable in strict privacy modes.
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function updateMenuLabel() {
  const isOpen = header.classList.contains("menu-active");
  menuToggle.setAttribute("aria-label", translate(isOpen ? "menu.close" : "menu.open"));
}

function applyLanguage(lang, options = {}) {
  if (!supportedLanguages.includes(lang)) return;
  currentLanguage = lang;
  const content = translations[lang];

  document.documentElement.lang = content.lang;
  document.title = content.title;
  document.querySelector('meta[name="description"]')?.setAttribute("content", content.metaDescription);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n, lang);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel, lang));
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.setAttribute("alt", translate(element.dataset.i18nAlt, lang));
  });

  document.querySelectorAll(".lang-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === lang);
  });

  updateMenuLabel();
  if (modal.classList.contains("is-open") && activeAttractionKey) renderModal(activeAttractionKey);
  if (!options.silent) showToast(content.language.changed);
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
  updateMenuLabel();
}

function renderModal(key) {
  const details = translations[currentLanguage].attractions[key] ?? translations.RO.attractions[key];
  const images = attractionAssets[key];
  if (!details || !images) return;

  modalImage.src = images[0];
  modalImage.alt = details.title;
  modalTag.textContent = details.tag;
  modalTitle.textContent = details.title;
  modalDescription.textContent = details.description;
  modalThumbs.innerHTML = "";

  images.slice(1).forEach((src, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "modal-thumb";
    thumb.innerHTML = `<img src="${src}" alt="${details.title} ${translate("modal.thumbnail")} ${index + 1}" />`;
    thumb.addEventListener("click", () => {
      modalImage.src = src;
    });
    modalThumbs.appendChild(thumb);
  });
}

function openModal(key) {
  if (!attractionAssets[key]) return;
  activeAttractionKey = key;
  lastFocusedElement = document.activeElement;
  renderModal(key);
  modal.setAttribute("aria-hidden", "false");
  modal.classList.add("is-open");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  modal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  activeAttractionKey = null;
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
  if (!finePointerQuery.matches) return;

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

function setupInteractiveSpotlights() {
  if (!finePointerQuery.matches) return;

  spotlightTargets.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty("--pointer-x", `${Math.max(0, Math.min(100, x)).toFixed(2)}%`);
      element.style.setProperty("--pointer-y", `${Math.max(0, Math.min(100, y)).toFixed(2)}%`);
    });

    element.addEventListener("pointerleave", () => {
      element.style.setProperty("--pointer-x", "50%");
      element.style.setProperty("--pointer-y", "50%");
    });
  });
}

applyLanguage(getStoredLanguage(), { silent: true });
updateHeader();
updateScrollProgress();
updateParallax();
createParticles();
setupMobileActiveStates();
setupDesktopTilt();
setupInteractiveSpotlights();
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
  updateMenuLabel();
});

mobilePanel.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.querySelectorAll(".lang-button").forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.dataset.lang;
    storeLanguage(lang);
    applyLanguage(lang);
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
