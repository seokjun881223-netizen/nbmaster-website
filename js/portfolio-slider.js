(() => {
  const initialize = () => {
    document.querySelectorAll("[data-slider]").forEach((slider) => {
      if (slider.dataset.sliderReady === "true") return;
      slider.dataset.sliderReady = "true";

      const slides = [...slider.querySelectorAll("[data-slide]")];
      const thumbs = [...slider.querySelectorAll("[data-slide-to]")];
      const prev = slider.querySelector(".project-slider-prev");
      const next = slider.querySelector(".project-slider-next");
      const counter = slider.querySelector(".project-slider-counter b");
      if (!slides.length) return;

      let current = 0;
      const show = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
        thumbs.forEach((thumb, i) => thumb.classList.toggle("is-active", i === current));
        if (counter) counter.textContent = String(current + 1);
      };

      prev?.addEventListener("click", () => show(current - 1));
      next?.addEventListener("click", () => show(current + 1));
      thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => show(Number(thumb.dataset.slideTo)));
      });
      show(0);
    });
  };

  window.initProjectSliders = initialize;
  document.addEventListener("DOMContentLoaded", initialize);
})();
