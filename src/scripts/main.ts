import "../styles/main.css";
import { content } from "../data/content";

document.documentElement.classList.add("scripts-ready");

const values: Record<string, string> = {
  caseNumber: content.caseNumber,
  name: content.identity.name,
  username: content.identity.username,
  role: content.identity.role
};

document.querySelectorAll<HTMLElement>("[data-content]").forEach((element) => {
  const key = element.dataset.content;

  if (key && values[key]) {
    element.textContent = values[key];
    element.classList.add("has-value");
  }
});
