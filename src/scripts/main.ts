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
const evidenceFilters = Array.from(
  document.querySelectorAll<HTMLButtonElement>("[data-evidence-filter]")
);
const evidenceCards = Array.from(
  document.querySelectorAll<HTMLElement>("[data-evidence-card]")
);
const evidenceResults = document.querySelector<HTMLOutputElement>("[data-evidence-results]");

if (evidenceSearch && evidenceFilters.length && evidenceCards.length) {
  let selectedTag = "all";

  const filterEvidence = () => {
    const searchTerm = evidenceSearch.value.trim().toLowerCase();
    let visibleCards = 0;

    evidenceCards.forEach((card) => {
      const tags = card.dataset.tags?.split(" ") ?? [];
      const matchesTag = selectedTag === "all" || tags.includes(selectedTag);
      const matchesSearch = !searchTerm || card.textContent?.toLowerCase().includes(searchTerm);
      const isVisible = Boolean(matchesTag && matchesSearch);

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCards += 1;
      }
    });

    if (evidenceResults) {
      evidenceResults.textContent = `${visibleCards} / ${evidenceCards.length}`;
    }
  };

  evidenceFilters.forEach((button) => {
    button.addEventListener("click", () => {
      selectedTag = button.dataset.evidenceFilter ?? "all";

      evidenceFilters.forEach((filter) => {
        filter.setAttribute("aria-pressed", String(filter === button));
      });

      filterEvidence();
    });
  });

  evidenceSearch.addEventListener("input", filterEvidence);
  filterEvidence();
}
