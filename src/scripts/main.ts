import "../styles/main.css";
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
