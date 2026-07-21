(() => {
  const CATEGORY_LABELS = {
    excavation: "홈파기시공",
    heating: "난방시공",
    plumbing: "수도설비시공",
    leak: "누수탐지"
  };
  const CATEGORY_LINKS = {
    excavation: "excavation.html",
    heating: "heating.html",
    plumbing: "plumbing.html",
    leak: "leak.html"
  };

  const text = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value || "";
  };

  const showError = (message) => {
    const loading = document.getElementById("projectDetailLoading");
    const content = document.getElementById("projectDetailContent");
    if (loading) {
      loading.innerHTML = `<strong>게시글을 불러오지 못했습니다.</strong><p>${message}</p><a class="btn btn-primary" href="portfolio.html">시공사례로 돌아가기</a>`;
    }
    if (content) content.hidden = true;
  };

  const buildSlider = (images, title) => {
    const slider = document.getElementById("dynamicProjectSlider");
    if (!slider) return;

    if (!images.length) {
      slider.innerHTML = '<div class="cms-detail-no-image">등록된 사진이 없습니다.</div>';
      return;
    }

    const slides = images.map((image, index) => `
      <div class="project-slide${index === 0 ? " is-active" : ""}" data-slide="${index}">
        <img src="${image.image_url}" alt="${title} 사진 ${index + 1}">
      </div>`).join("");

    const thumbs = images.map((image, index) => `
      <button class="project-thumb${index === 0 ? " is-active" : ""}"
              type="button"
              data-slide-to="${index}"
              aria-label="${index + 1}번째 사진 보기">
        <img src="${image.image_url}" alt="">
      </button>`).join("");

    slider.innerHTML = `
      <div class="project-slider-stage">
        ${slides}
        ${images.length > 1 ? `
          <button class="project-slider-button project-slider-prev" type="button" aria-label="이전 사진">‹</button>
          <button class="project-slider-button project-slider-next" type="button" aria-label="다음 사진">›</button>
          <span class="project-slider-counter"><b>1</b> / ${images.length}</span>
        ` : ""}
      </div>
      ${images.length > 1 ? `<div class="project-slider-thumbs">${thumbs}</div>` : ""}`;

    if (window.initProjectSliders) {
      window.initProjectSliders();
    }
  };

  const load = async () => {
    const id = new URLSearchParams(location.search).get("id");
    if (!id) {
      showError("게시글 번호가 없습니다.");
      return;
    }

    try {
      if (!window.nbSupabase) throw new Error("Supabase 연결 설정을 불러오지 못했습니다.");

      const { data, error } = await window.nbSupabase
        .from("projects")
        .select("id,category,title,summary,description,region,work_details,is_published,created_at,project_images(image_url,sort_order)")
        .eq("id", id)
        .eq("is_published", true)
        .single();

      if (error || !data) throw new Error("존재하지 않거나 비공개 처리된 게시글입니다.");

      const images = [...(data.project_images || [])].sort(
        (a, b) => Number(a.sort_order) - Number(b.sort_order)
      );
      const label = CATEGORY_LABELS[data.category] || "시공사례";
      const categoryLink = CATEGORY_LINKS[data.category] || "portfolio.html";

      document.title = `${data.title} | 난방 마스터 시공사례`;
      text("projectCategory", label);
      text("projectTitle", data.title);
      text("projectSummary", data.summary);
      text("projectInfoCategory", label);
      text("projectWorkDetails", data.work_details || data.summary);
      text("projectRegion", data.region || "서울 · 인천 · 경기");
      text("projectDescription", data.description || data.summary);

      const categoryAnchor = document.getElementById("projectCategoryLink");
      if (categoryAnchor) {
        categoryAnchor.href = categoryLink;
        categoryAnchor.textContent = `${label} 서비스 자세히 보기 →`;
      }

      buildSlider(images, data.title);

      document.getElementById("projectDetailLoading").hidden = true;
      document.getElementById("projectDetailContent").hidden = false;
    } catch (error) {
      showError(error.message);
    }
  };

  document.addEventListener("DOMContentLoaded", load);
})();
