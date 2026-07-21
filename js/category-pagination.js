(() => {
  const getLayout = () => {
    if (window.matchMedia("(max-width: 640px)").matches) {
      return { columns: 3, rows: 3, itemsPerPage: 9 };
    }

    if (window.matchMedia("(max-width: 1100px)").matches) {
      return { columns: 2, rows: 3, itemsPerPage: 6 };
    }

    return { columns: 4, rows: 3, itemsPerPage: 12 };
  };

  const getCards = (root) =>
    [...root.querySelectorAll(".service-photo-card")];

  const buildPagination = (root, pagination, requestedPage = 1) => {
    const cards = getCards(root);
    const { itemsPerPage } = getLayout();
    const totalPages = Math.max(1, Math.ceil(cards.length / itemsPerPage));
    const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    root.dataset.currentPage = String(currentPage);

    cards.forEach((card, index) => {
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

      const currentPage = Number(root.dataset.currentPage || 1);
      buildPagination(root, pagination, currentPage);
    });
  };

  let resizeTimer;

  document.addEventListener("DOMContentLoaded", initialize);
  document.addEventListener("nbmaster:cms-loaded", initialize);

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initialize, 150);
  });
})();
