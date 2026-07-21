(() => {
  const CATEGORY_LABELS = {
    excavation: "홈파기시공",
    heating: "난방시공",
    plumbing: "수도설비",
    leak: "누수탐지"
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
        const projects = (data || []).filter(
          (project) => category === "all" || project.category === category
        );

        container.innerHTML = projects.map(
          variant === "portfolio" ? portfolioCard : serviceCard
        ).join("");

        if (!projects.length && container.dataset.showEmpty === "true") {
          container.innerHTML = '<p class="cms-empty">등록된 새 시공사례가 없습니다.</p>';
        }
      });

      document.dispatchEvent(new CustomEvent("nbmaster:cms-loaded"));
    } catch (error) {
      console.warn("시공사례 CMS 불러오기 실패:", error.message);
      // 기존 정적 게시글은 그대로 보이게 두고 CMS 영역만 비웁니다.
      containers.forEach((container) => {
        container.innerHTML = "";
      });
    }
  };

  document.addEventListener("DOMContentLoaded", loadProjects);
})();
