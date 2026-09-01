(() => {
  const CATEGORY_LABELS = {
    excavation: "홈파기시공",
    heating: "난방시공",
    plumbing: "수도설비",
    leak: "누수탐지"
  };


  const INDEX_FALLBACKS = [
    {
      category: "excavation",
      title: "실내 바닥 홈파기 시공",
      summary: "배관 매립을 위한 바닥 홈파기 작업",
      image_url: "images/portfolio/excavation-01.jpg",
      href: "post-excavation-01.html"
    },
    {
      category: "heating",
      title: "바닥 난방배관 시공",
      summary: "단열재 위 난방배관 배치 및 고정",
      image_url: "images/portfolio/heating-01.jpg",
      href: "post-heating-01.html"
    },
    {
      category: "plumbing",
      title: "바닥 수도배관 홈파기",
      summary: "벽체와 바닥을 연결하는 배관 통로 시공",
      image_url: "images/portfolio/plumbing-02.jpg",
      href: "post-plumbing-02.html"
    },
    {
      category: "leak",
      title: "분배기 교체 후 누수 점검",
      summary: "신규 분배기 설치 후 연결부 확인",
      image_url: "images/portfolio/leak-02.jpg",
      href: "post-leak-02.html"
    }
  ];

  const indexFallbackCard = (project) => {
    const label = CATEGORY_LABELS[project.category] || "시공사례";
    return `
      <a class="portfolio-wide-card reveal is-visible index-fallback-card"
         href="${escapeHtml(project.href)}">
        <div class="portfolio-wide-image">
          <img src="${escapeHtml(project.image_url)}"
               alt="${escapeHtml(project.title)}"
               loading="lazy">
        </div>
        <div class="portfolio-wide-info">
          <span>${escapeHtml(label)}</span>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.summary)}</p>
        </div>
      </a>`;
  };

  const renderIndexWithFallback = (projects, limit = 4) => {
    const cmsProjects = (projects || []).slice(0, limit);
    const usedKeys = new Set(
      cmsProjects.map((project) =>
        `${project.category}::${String(project.title || "").trim().toLowerCase()}`
      )
    );

    const fallbacks = INDEX_FALLBACKS.filter((project) => {
      const key = `${project.category}::${project.title.trim().toLowerCase()}`;
      return !usedKeys.has(key);
    }).slice(0, Math.max(0, limit - cmsProjects.length));

    return (
      cmsProjects.map(indexCard).join("") +
      fallbacks.map(indexFallbackCard).join("")
    );
  };


  const escapeHtml = (value = "") =>
    String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);

  const getClient = () => {
    if (!window.nbSupabase) {
      throw new Error("Supabase 연결 설정을 불러오지 못했습니다.");
    }
    return window.nbSupabase;
  };

  const getCover = (project) => {
    const images = [...(project.project_images || [])].sort(
      (a, b) => Number(a.sort_order) - Number(b.sort_order)
    );
    return images[0]?.image_url || "images/hero-wide-floor.jpg";
  };

  const serviceCard = (project) => {
    const label = CATEGORY_LABELS[project.category] || "시공사례";
    return `
      <a class="service-photo-card service-photo-link reveal is-visible"
         href="project-detail.html?id=${encodeURIComponent(project.id)}">
        <div class="service-photo-media">
          <img src="${escapeHtml(getCover(project))}"
               alt="${escapeHtml(project.title)}"
               loading="lazy">
        </div>
        <div class="service-photo-caption">
          <strong>${escapeHtml(project.title)}</strong>
          <span>${escapeHtml(project.summary)}</span>
          <em>게시글 보기 →</em>
        </div>
      </a>`;
  };

  const portfolioCard = (project) => {
    const label = CATEGORY_LABELS[project.category] || "시공사례";
    return `
      <article class="portfolio-project-card cms-project-card"
               data-category="${escapeHtml(project.category)}">
        <a href="project-detail.html?id=${encodeURIComponent(project.id)}"
           aria-label="${escapeHtml(project.title)} 게시글 보기">
          <div class="portfolio-project-image">
            <img src="${escapeHtml(getCover(project))}"
                 alt="${escapeHtml(project.title)}"
                 loading="lazy">
            <span class="portfolio-project-category">${escapeHtml(label)}</span>
          </div>
          <div class="portfolio-project-info">
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.summary)}</p>
            <span class="portfolio-project-more">게시글 보기 →</span>
          </div>
        </a>
      </article>`;
  };


  const indexCard = (project) => {
    const label = CATEGORY_LABELS[project.category] || "시공사례";
    return `
      <a class="portfolio-wide-card reveal is-visible"
         href="project-detail.html?id=${encodeURIComponent(project.id)}">
        <div class="portfolio-wide-image">
          <img src="${escapeHtml(getCover(project))}"
               alt="${escapeHtml(project.title)}"
               loading="lazy">
        </div>
        <div class="portfolio-wide-info">
          <span>${escapeHtml(label)}</span>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.summary)}</p>
        </div>
      </a>`;
  };

  const loadProjects = async () => {
    const containers = [...document.querySelectorAll("[data-cms-projects]")];
    if (!containers.length) return;

    try {
      const client = getClient();
      const { data, error } = await client
        .from("projects")
        .select("id,category,title,summary,created_at,project_images(image_url,sort_order)")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      containers.forEach((container) => {
        const category = container.dataset.cmsCategory || "all";
        const variant = container.dataset.cmsVariant || "service";
        const limit = Number(container.dataset.cmsLimit || 0);
        let projects = (data || []).filter(
          (project) => category === "all" || project.category === category
        );

        if (limit > 0) {
          projects = projects.slice(0, limit);
        }

        const renderer =
          variant === "portfolio" ? portfolioCard :
          variant === "index" ? indexCard :
          serviceCard;

        if (variant === "index" && container.dataset.cmsIndexFallback === "true") {
          container.innerHTML = renderIndexWithFallback(projects, limit || 4);
        } else {
          container.innerHTML = projects.map(renderer).join("");
        }

        if (!projects.length && container.dataset.showEmpty === "true") {
          container.innerHTML = '<p class="cms-empty">등록된 새 시공사례가 없습니다.</p>';
        }
      });

      document.dispatchEvent(new CustomEvent("nbmaster:cms-loaded"));
    } catch (error) {
      console.warn("시공사례 CMS 불러오기 실패:", error.message);
      // 기존 정적 게시글은 그대로 보이게 두고 CMS 영역만 비웁니다.
      containers.forEach((container) => {
        if (
          container.dataset.cmsVariant === "index" &&
          container.dataset.cmsIndexFallback === "true"
        ) {
          container.innerHTML = INDEX_FALLBACKS.slice(0, 4).map(indexFallbackCard).join("");
        } else {
          container.innerHTML = "";
        }
      });
    }
  };

  document.addEventListener("DOMContentLoaded", loadProjects);
})();
