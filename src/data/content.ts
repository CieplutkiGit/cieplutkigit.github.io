export interface Identity {
  name: string;
  username: string;
  role: string;
  summary: string;
  currentFocus: string;
  status: string;
}

export interface Location {
  label: string;
  note: string;
  markerX: number | null;
  markerY: number | null;
}

export interface Project {
  evidenceNumber: string;
  name: string;
  description: string;
  status: string;
  technologies: string[];
  repositoryUrl: string;
  demoUrl: string;
  date: string;
}

export interface TimelineEntry {
  date: string;
  title: string;
  organization: string;
  description: string;
  type: "work" | "education" | "project" | "open-source" | "current";
}

export interface ArchiveEntry {
  date: string;
  title: string;
  summary: string;
  type: string;
  url: string;
  status: string;
}

export interface ContactLinks {
  email: string;
  github: string;
  linkedin: string;
  resume: string;
}

export interface SiteContent {
  caseNumber: string;
  identity: Identity;
  location: Location;
  skills: {
    primary: string[];
    workingKnowledge: string[];
    investigating: string[];
  };
  projects: Project[];
  timeline: TimelineEntry[];
  archives: ArchiveEntry[];
  contact: ContactLinks;
}

const placeholder = "[TEXT HERE]";

export const content: SiteContent = {
  caseNumber: placeholder,
  identity: {
    name: placeholder,
    username: placeholder,
    role: placeholder,
    summary: placeholder,
    currentFocus: placeholder,
    status: placeholder
  },
  location: {
    label: placeholder,
    note: placeholder,
    markerX: null,
    markerY: null
  },
  skills: {
    primary: [placeholder],
    workingKnowledge: [placeholder],
    investigating: [placeholder]
  },
  projects: [],
  timeline: [],
  archives: [],
  contact: {
    email: "",
    github: "",
    linkedin: "",
    resume: ""
  }
};
