import { content } from "../data/content";

document.documentElement.classList.add("scripts-ready");

const values: Record<string, string> = {
  caseNumber: content.caseNumber,
  name: content.identity.name,
  username: content.identity.username,
  role: content.identity.role,
  summary: content.identity.summary,
  currentFocus: content.identity.currentFocus,
  status: content.identity.status,
  locationLabel: content.location.label,
  locationNote: content.location.note
};

document.querySelectorAll<HTMLElement>("[data-content]").forEach((element) => {
  const key = element.dataset.content;

  if (key && values[key]) {
    element.textContent = values[key];
    element.classList.add("has-value");
  }
});

const skillGroups = {
  primary: content.skills.primary,
  workingKnowledge: content.skills.workingKnowledge,
  investigating: content.skills.investigating
};

document.querySelectorAll<HTMLElement>("[data-skill-group]").forEach((group) => {
  const key = group.dataset.skillGroup as keyof typeof skillGroups | undefined;

  if (!key) {
    return;
  }

  group.replaceChildren(
    ...skillGroups[key].map((skill) => {
      const tag = document.createElement("span");
      tag.className = "skill-tag";
      tag.textContent = skill;
      return tag;
    })
  );
});

const evidenceSearch = document.querySelector<HTMLInputElement>("[data-evidence-search]");
const evidenceCategories = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-evidence-category]")
);
const evidenceTags = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-evidence-tag]")
);
const evidenceCards = Array.from(
  document.querySelectorAll<HTMLElement>("[data-evidence-card]")
);
const evidenceResults = document.querySelector<HTMLOutputElement>("[data-evidence-results]");
const evidenceSort = document.querySelector<HTMLSelectElement>("[data-evidence-sort]");
const evidencePageSize = document.querySelector<HTMLSelectElement>("[data-evidence-page-size]");
const evidencePages = document.querySelector<HTMLElement>("[data-evidence-pages]");
const evidenceGrid = document.querySelector<HTMLElement>(".evidence-grid");

if (
  evidenceSearch &&
  evidenceCategories.length &&
  evidenceTags.length &&
  evidenceCards.length &&
  evidenceSort &&
  evidencePageSize &&
  evidencePages &&
  evidenceGrid
) {
  let selectedCategory = "all";
  let selectedTag = "all";
  let currentPage = 1;
  let itemsPerPage = Number(evidencePageSize.value);

  const setPressedButton = (buttons: HTMLButtonElement[], selectedButton: HTMLButtonElement) => {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button === selectedButton));
    });
  };

  const updateEvidence = () => {
    const searchTerm = evidenceSearch.value.trim().toLowerCase();
    const matchingCards = evidenceCards.filter((card) => {
      const tags = card.dataset.tags?.split(" ") ?? [];
      const matchesCategory =
        selectedCategory === "all" || card.dataset.category === selectedCategory;
      const matchesTag = selectedTag === "all" || tags.includes(selectedTag);
      const matchesSearch = !searchTerm || card.textContent?.toLowerCase().includes(searchTerm);
      return Boolean(matchesCategory && matchesTag && matchesSearch);
    });

    matchingCards.sort((firstCard, secondCard) => {
      const firstOrder = Number(firstCard.dataset.order ?? 0);
      const secondOrder = Number(secondCard.dataset.order ?? 0);
      const firstTitle = firstCard.dataset.title ?? "";
      const secondTitle = secondCard.dataset.title ?? "";

      if (evidenceSort.value === "oldest") {
        return firstOrder - secondOrder;
      }

      if (evidenceSort.value === "az") {
        return firstTitle.localeCompare(secondTitle);
      }

      if (evidenceSort.value === "za") {
        return secondTitle.localeCompare(firstTitle);
      }

      return secondOrder - firstOrder;
    });

    matchingCards.forEach((card) => evidenceGrid.append(card));

    const pageCount = Math.max(1, Math.ceil(matchingCards.length / itemsPerPage));
    currentPage = Math.min(currentPage, pageCount);
    const firstResult = (currentPage - 1) * itemsPerPage;
    const lastResult = Math.min(firstResult + itemsPerPage, matchingCards.length);

    evidenceCards.forEach((card) => {
      card.hidden = true;
    });

    matchingCards.slice(firstResult, lastResult).forEach((card) => {
      card.hidden = false;
    });

    if (evidenceResults) {
      evidenceResults.textContent = matchingCards.length
        ? `RESULTS ${firstResult + 1}–${lastResult} / ${matchingCards.length}`
        : "RESULTS 0 / 0";
    }

    const makePageButton = (
      label: string,
      page: number,
      disabled = false,
      isCurrent = false
    ) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.disabled = disabled;

      if (isCurrent) {
        button.setAttribute("aria-current", "page");
      }

      button.addEventListener("click", () => {
        currentPage = page;
        updateEvidence();
      });

      return button;
    };

    const pageButtons: HTMLButtonElement[] = [
      makePageButton("« FIRST", 1, currentPage === 1),
      makePageButton("‹ PREV", Math.max(1, currentPage - 1), currentPage === 1)
    ];

    for (let page = 1; page <= pageCount; page += 1) {
      pageButtons.push(makePageButton(String(page), page, false, page === currentPage));
    }

    pageButtons.push(
      makePageButton("NEXT ›", Math.min(pageCount, currentPage + 1), currentPage === pageCount),
      makePageButton("LAST »", pageCount, currentPage === pageCount)
    );

    evidencePages.replaceChildren(...pageButtons);
  };

  evidenceCategories.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.evidenceCategory ?? "all";
      currentPage = 1;
      setPressedButton(evidenceCategories, button);
      updateEvidence();
    });
  });

  evidenceTags.forEach((button) => {
    button.addEventListener("click", () => {
      selectedTag = button.dataset.evidenceTag ?? "all";
      currentPage = 1;
      setPressedButton(evidenceTags, button);
      updateEvidence();
    });
  });

  evidenceSearch.addEventListener("input", () => {
    currentPage = 1;
    updateEvidence();
  });

  evidenceSort.addEventListener("change", () => {
    currentPage = 1;
    updateEvidence();
  });

  evidencePageSize.addEventListener("change", () => {
    itemsPerPage = Number(evidencePageSize.value);
    currentPage = 1;
    updateEvidence();
  });

  updateEvidence();
}
