(() => {
  const ITEMS_PER_PAGE = 12;

  const getCards = (root) =>
    [...root.querySelectorAll(".service-photo-card")];

  const buildPagination = (root, pagination, requestedPage = 1) => {
    const cards = getCards(root);
    const totalPages = Math.max(1, Math.ceil(cards.length / ITEMS_PER_PAGE));
    const currentPage = Math.min(Math.max(1, requestedPage), totalPages);

    cards.forEach((card, index) => {
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      card.hidden = !(index >= start && index < end);
    });

    pagination.innerHTML = "";

    if (totalPages <= 1) {
      pagination.hidden = true;
      return;
    }

    pagination.hidden = false;

    const addButton = (label, page, options = {}) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.dataset.page = String(page);
      button.className = "category-pagination-button";

      if (options.active) {
        button.classList.add("is-active");
        button.setAttribute("aria-current", "page");
      }

      if (options.disabled) {
        button.disabled = true;
      }

      button.addEventListener("click", () => {
        buildPagination(root, pagination, page);
        root.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      pagination.appendChild(button);
    };

    addButton("‹", currentPage - 1, { disabled: currentPage === 1 });

    for (let page = 1; page <= totalPages; page += 1) {
      addButton(String(page), page, { active: page === currentPage });
    }

    addButton("›", currentPage + 1, {
      disabled: currentPage === totalPages
    });
  };

  const initialize = () => {
    document.querySelectorAll("[data-category-board]").forEach((root) => {
      const pagination = root.parentElement.querySelector(
        "[data-category-pagination]"
      );
      if (!pagination) return;

      buildPagination(root, pagination, 1);
    });
  };

  document.addEventListener("DOMContentLoaded", initialize);

  // Supabase 게시글이 동적으로 추가된 뒤 다시 계산
  document.addEventListener("nbmaster:cms-loaded", initialize);
})();
