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

let imageViewer: HTMLDialogElement | null = null;

const openImageViewer = (image: HTMLImageElement) => {
  if (!imageViewer) {
    imageViewer = document.createElement("dialog");
    imageViewer.className = "image-viewer";
    imageViewer.innerHTML = `
      <button type="button" data-image-viewer-close>CLOSE ×</button>
      <img alt="" />
    `;
    document.body.append(imageViewer);

    imageViewer.querySelector<HTMLButtonElement>("[data-image-viewer-close]")?.addEventListener("click", () => {
      imageViewer?.close();
    });

    imageViewer.addEventListener("click", (event) => {
      if (event.target === imageViewer) {
        imageViewer?.close();
      }
    });
  }

  const fullImage = imageViewer.querySelector<HTMLImageElement>("img");
  if (!fullImage) {
    return;
  }

  fullImage.src = image.currentSrc || image.src;
  fullImage.alt = image.alt;
  imageViewer.showModal();
};

const enableImageViewer = (trigger: HTMLElement, image: HTMLImageElement) => {
  trigger.classList.add("image-viewer-trigger");
  trigger.tabIndex = 0;
  trigger.setAttribute("role", "button");
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-label", image.alt ? `Open ${image.alt}` : "Open full image");

  const open = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    openImageViewer(image);
  };

  trigger.addEventListener("click", open);
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      open(event);
    }
  });
};

const mailtoForm = document.querySelector<HTMLFormElement>("[data-mailto-form]");

if (mailtoForm) {
  mailtoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(mailtoForm);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = "Message from the case file portfolio";
    const body = `From: ${name}\nReturn address: ${email}\n\n${message}`;

    window.location.href = `mailto:lewandowskiarek3@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

const evidenceGrid = document.querySelector<HTMLElement>(".evidence-grid");
const evidenceFileCount = document.querySelector<HTMLElement>("[data-evidence-file-count]");

if (evidenceFileCount) {
  const documentedCases = cases.filter((item) => item.status !== "TO BE DOCUMENTED");
  evidenceFileCount.textContent = String(documentedCases.length);
}

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
      ? `<div class="evidence-card-image-frame"><img class="evidence-card-image is-${item.coverFit}" src="${item.coverImage}" alt="" /></div>`
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
    const videoEmbed = document.querySelector<HTMLIFrameElement>("[data-case-video-embed]");
    const videoPlaceholder = document.querySelector<HTMLElement>("[data-case-video-placeholder]");
    const pagePanel = document.querySelector<HTMLElement>("[data-case-page-panel]");
    const pageLink = document.querySelector<HTMLAnchorElement>("[data-case-page]");
    const pageImage = document.querySelector<HTMLImageElement>("[data-case-page-image]");
    const mediaLabel = document.querySelector<HTMLElement>("[data-case-media-label]");

    if (videoPlaceholder && selectedCase.videoUrl) {
      const usesEmbeddedPlayer =
        selectedCase.videoUrl.includes("youtube") ||
        selectedCase.videoUrl.includes("facebook.com/plugins/video.php");

      if (videoEmbed && usesEmbeddedPlayer) {
        videoEmbed.src = selectedCase.videoUrl;
        videoEmbed.hidden = false;
      } else if (video) {
        video.src = selectedCase.videoUrl;
        video.hidden = false;
      }
      videoPlaceholder.hidden = true;
    } else if (videoPlaceholder && pagePanel && pageLink && selectedCase.pageUrl) {
      pageLink.href = selectedCase.pageUrl;
      pageLink.target = "_blank";
      pageLink.rel = "noreferrer";
      if (pageImage && selectedCase.pageImage) {
        pageImage.src = selectedCase.pageImage;
        pageImage.alt = `${selectedCase.name} page preview`;
      }
      pagePanel.hidden = false;
      pagePanel.parentElement?.classList.add("has-page-preview");
      videoPlaceholder.hidden = true;
      if (mediaLabel) {
        mediaLabel.textContent = "PROJECT PAGE";
      }
    }

    const supportingImage = document.querySelector<HTMLElement>("[data-case-supporting-image]");

    if (supportingImage && selectedCase.supportingImage) {
      const image = document.createElement("img");
      image.src = selectedCase.supportingImage;
      image.alt = `${selectedCase.name} development flow`;
      supportingImage.append(image);
      enableImageViewer(supportingImage, image);
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

            const imageFrame = document.createElement("div");
            imageFrame.className = "case-evidence-image";
            imageFrame.append(image);
            frame.append(imageFrame);
            enableImageViewer(frame, image);
          } else {
            frame.textContent = "[IMAGE HERE]";
          }

          return frame;
        })
      );
    }

    const links = {
      liveDemo: selectedCase.liveDemoUrl,
      github: selectedCase.githubUrl,
      googlePlay: selectedCase.googlePlayUrl,
      appStore: selectedCase.appStoreUrl
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
