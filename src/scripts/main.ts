import { content } from "../data/content";
import { cases, findCase } from "../data/cases";

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

const evidenceGrid = document.querySelector<HTMLElement>(".evidence-grid");

if (evidenceGrid) {
  cases.forEach((item) => {
    const card = document.createElement("a");
    card.className = "evidence-folder evidence-folder-link";
    card.href = `./case/?id=${encodeURIComponent(item.id)}`;
    card.dataset.evidenceCard = "";
    card.dataset.category = item.categoryKey || "placeholder";
    card.dataset.tags = item.tags.join(" ");
    card.dataset.order = String(item.order);
    card.dataset.title = item.name.toLowerCase();

    const statusClass = item.status === "CLOSED" ? "is-closed" : "is-progress";
    const category = item.category || "[CATEGORY HERE]";
    const tags = item.tags.length
      ? item.tags.map((tag) => `<span>${tag}</span>`).join("")
      : "<span>[TAG HERE]</span>";
    const image = item.coverImage
      ? `<img class="evidence-card-image" src="${item.coverImage}" alt="" />`
      : '<div class="evidence-image-placeholder" role="img" aria-label="Project image placeholder">[IMAGE HERE]</div>';

    card.innerHTML = `
      <span class="evidence-clip" aria-hidden="true"></span>
      <header><span>CASE ${item.caseNumber}</span><span>${item.status}</span></header>
      ${image}
      <h2>${item.name}</h2>
      <div class="evidence-card-meta"><span>CATEGORY</span><strong>${category}</strong></div>
      <p>${item.brief}</p>
      <div class="evidence-card-tags">${tags}</div>
      <footer><span class="evidence-status ${statusClass}">${item.status}</span><span>OPEN FILE →</span></footer>
    `;

    evidenceGrid.prepend(card);
  });
}

const caseViewer = document.querySelector<HTMLElement>("[data-case-viewer]");

if (caseViewer) {
  const selectedCase = findCase(new URLSearchParams(window.location.search).get("id"));
  const caseMessage = document.querySelector<HTMLElement>("[data-case-message]");
  const bottomRow = document.querySelector<HTMLElement>(".case-bottom-row");

  if (!selectedCase) {
    caseViewer.hidden = true;
    if (bottomRow) {
      bottomRow.hidden = true;
    }
    if (caseMessage) {
      caseMessage.hidden = false;
    }
  } else {
    document.title = `${selectedCase.name} | Case File`;

    const fields: Record<string, string> = {
      caseNumber: selectedCase.caseNumber,
      name: selectedCase.name,
      brief: selectedCase.brief,
      role: selectedCase.role || "[TEXT HERE]",
      status: selectedCase.status
    };

    document.querySelectorAll<HTMLElement>("[data-case-field]").forEach((element) => {
      const key = element.dataset.caseField;
      if (key && fields[key]) {
        element.textContent = fields[key];
      }
    });

    const renderList = (name: "techStack" | "keyFeatures", values: string[]) => {
      const container = document.querySelector<HTMLElement>(`[data-case-list="${name}"]`);
      if (!container) {
        return;
      }

      const tagName = name === "keyFeatures" ? "li" : "span";
      const items = values.length ? values : ["[TEXT HERE]"];
      container.replaceChildren(
        ...items.map((value) => {
          const element = document.createElement(tagName);
          element.textContent = value;
          return element;
        })
      );
    };

    renderList("techStack", selectedCase.techStack);
    renderList("keyFeatures", selectedCase.keyFeatures);

    const video = document.querySelector<HTMLVideoElement>("[data-case-video]");
    const videoPlaceholder = document.querySelector<HTMLElement>("[data-case-video-placeholder]");

    if (video && videoPlaceholder && selectedCase.videoUrl) {
      video.src = selectedCase.videoUrl;
      video.hidden = false;
      videoPlaceholder.hidden = true;
    }

    const screenshots = document.querySelector<HTMLElement>("[data-case-screenshots]");
    if (screenshots) {
      const imageCount = Math.max(4, selectedCase.screenshots.length);
      screenshots.replaceChildren(
        ...Array.from({ length: imageCount }, (_, index) => {
          const frame = document.createElement("div");
          frame.className = "case-evidence-photo";
          const source = selectedCase.screenshots[index];

          if (source) {
            const image = document.createElement("img");
            image.src = source;
            image.alt = `${selectedCase.name} screenshot ${index + 1}`;
            frame.append(image);
          } else {
            frame.textContent = "[IMAGE HERE]";
          }

          return frame;
        })
      );
    }

    const links = {
      liveDemo: selectedCase.liveDemoUrl,
      github: selectedCase.githubUrl
    };

    document.querySelectorAll<HTMLAnchorElement>("[data-case-link]").forEach((link) => {
      const key = link.dataset.caseLink as keyof typeof links | undefined;
      const url = key ? links[key] : "";

      if (url) {
        link.href = url;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.hidden = false;
      }
    });
  }
}

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
