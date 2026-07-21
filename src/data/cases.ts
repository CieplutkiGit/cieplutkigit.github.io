export interface PortfolioCase {
  id: string;
  caseNumber: string;
  name: string;
  brief: string;
  role: string;
  techStack: string[];
  keyFeatures: string[];
  videoUrl: string;
  screenshots: string[];
  liveDemoUrl: string;
  githubUrl: string;
  status: string;
  category: string;
  categoryKey: string;
  tags: string[];
  coverImage: string;
  order: number;
}

export const cases: PortfolioCase[] = [
  {
    id: "to-be-documented",
    caseNumber: "[TEXT HERE]",
    name: "To Be Documented",
    brief: "",
    role: "",
    techStack: [],
    keyFeatures: [],
    videoUrl: "",
    screenshots: [],
    liveDemoUrl: "",
    githubUrl: "",
    status: "TO BE DOCUMENTED",
    category: "",
    categoryKey: "placeholder",
    tags: [],
    coverImage: "",
    order: 0
  },
  {
    id: "submarine-game",
    caseNumber: "003",
    name: "Submarine Game",
    brief: "Simple game about submarine and collecting stuff from ocean.",
    role: "",
    techStack: [],
    keyFeatures: [],
    videoUrl: "",
    screenshots: [],
    liveDemoUrl: "",
    githubUrl: "",
    status: "IN DEVELOPMENT",
    category: "",
    categoryKey: "placeholder",
    tags: [],
    coverImage: "",
    order: 13
  }
];

export const findCase = (id: string | null) => cases.find((item) => item.id === id);
