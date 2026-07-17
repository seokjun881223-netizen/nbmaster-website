document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const menuDim = document.querySelector(".menu-dim");

  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  const closeMenu = () => {
    if (!menuToggle || !mainNav || !menuDim) return;
    menuToggle.classList.remove("is-active");
    mainNav.classList.remove("is-open");
    menuDim.classList.remove("is-visible");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    if (!menuToggle || !mainNav || !menuDim) return;
    menuToggle.classList.add("is-active");
    mainNav.classList.add("is-open");
    menuDim.classList.add("is-visible");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (menuToggle && mainNav && menuDim) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.contains("is-open") ? closeMenu() : openMenu();
    });
    menuDim.addEventListener("click", closeMenu);
    mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }
});
