(() => {
  const initialize = () => {
    document.querySelectorAll("[data-slider]").forEach((slider) => {
      const slides = [...slider.querySelectorAll("[data-slide]")];

      // 동적 상세페이지는 사진 데이터가 들어오기 전 빈 슬라이더가 먼저 존재합니다.
      // 사진이 없을 때는 초기화 완료 표시를 하지 않아야 나중에 다시 초기화할 수 있습니다.
      if (!slides.length) return;
      if (slider.dataset.sliderReady === "true") return;

      const thumbs = [...slider.querySelectorAll("[data-slide-to]")];
      const prev = slider.querySelector(".project-slider-prev");
      const next = slider.querySelector(".project-slider-next");
      const counter = slider.querySelector(".project-slider-counter b");

      slider.dataset.sliderReady = "true";

      let current = 0;

      const show = (index) => {
        current = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
          slide.classList.toggle("is-active", i === current);
        });

        thumbs.forEach((thumb, i) => {
          thumb.classList.toggle("is-active", i === current);
        });

        if (counter) {
          counter.textContent = String(current + 1);
        }
      };

      prev?.addEventListener("click", () => show(current - 1));
      next?.addEventListener("click", () => show(current + 1));

      thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
          show(Number(thumb.dataset.slideTo));
        });
      });

      show(0);
    });
  };

  window.initProjectSliders = initialize;
  document.addEventListener("DOMContentLoaded", initialize);
})();
