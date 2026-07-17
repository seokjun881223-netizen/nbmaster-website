document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const slides = [...slider.querySelectorAll(".project-slide")];
    const thumbs = [...slider.querySelectorAll(".project-thumb")];
    const prev = slider.querySelector(".project-slider-prev");
    const next = slider.querySelector(".project-slider-next");
    const counter = slider.querySelector(".project-slider-counter b");

    if (!slides.length) return;

    let current = 0;

    const show = (index) => {
      current = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === current);
      });

      thumbs.forEach((thumb, i) => {
        thumb.classList.toggle("is-active", i === current);
      });

      if (counter) counter.textContent = String(current + 1);
    };

    prev?.addEventListener("click", () => show(current - 1));
    next?.addEventListener("click", () => show(current + 1));

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        show(Number(thumb.dataset.slideTo));
      });
    });

    let startX = 0;
    const stage = slider.querySelector(".project-slider-stage");

    stage?.addEventListener("touchstart", (event) => {
      startX = event.touches[0].clientX;
    }, { passive: true });

    stage?.addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - startX;
      if (Math.abs(distance) < 45) return;
      show(distance > 0 ? current - 1 : current + 1);
    }, { passive: true });

    show(0);
  });
});
