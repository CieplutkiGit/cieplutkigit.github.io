export interface PortfolioCase {
  id: string;
  caseNumber: string;
  name: string;
  brief: string;
  role: string;
  techStack: string[];
  keyFeatures: string[];
  videoUrl: string;
  supportingImage: string;
  screenshots: string[];
  liveDemoUrl: string;
  githubUrl: string;
  googlePlayUrl: string;
  appStoreUrl: string;
  status: string;
  category: string;
  categoryKey: string;
  tags: string[];
  coverImage: string;
  coverFit: "cover" | "contain";
  order: number;
}

const moonshotVoyageCover = new URL(
  "../../assets/moonshot-voyage-cover.png",
  import.meta.url
).href;
const moonshotVoyageScreenshots = [
  new URL("../../assets/moonshot-voyage-01.png", import.meta.url).href,
  new URL("../../assets/moonshot-voyage-02.png", import.meta.url).href,
  new URL("../../assets/moonshot-voyage-03.png", import.meta.url).href,
  new URL("../../assets/moonshot-voyage-04.png", import.meta.url).href
];
const moonshotVoyageBoard = new URL(
  "../../assets/moonshot-voyage-board.png",
  import.meta.url
).href;

const tapOceansScreenshots = [
  new URL("../../assets/tap-oceans-01.png", import.meta.url).href,
  new URL("../../assets/tap-oceans-02.png", import.meta.url).href,
  new URL("../../assets/tap-oceans-03.png", import.meta.url).href,
  new URL("../../assets/tap-oceans-04.png", import.meta.url).href
];
const tapOceansCover = new URL(
  "../../assets/tap-oceans-cover.png",
  import.meta.url
).href;
const tapOceansDevelopmentFlow = new URL(
  "../../assets/tap-oceans-development-flow.png",
  import.meta.url
).href;

const pandaGameScreenshots = [
  new URL("../../assets/panda-game-01.png", import.meta.url).href,
  new URL("../../assets/panda-game-02.png", import.meta.url).href,
  new URL("../../assets/panda-game-03.png", import.meta.url).href,
  new URL("../../assets/panda-game-04.png", import.meta.url).href
];
const pandaGameCover = new URL(
  "../../assets/panda-game-cover.png",
  import.meta.url
).href;
const pandaGameBoard = new URL(
  "../../assets/panda-game-board.png",
  import.meta.url
).href;

const firstProjectScreenshots = [
  new URL("../../assets/first-project-01.png", import.meta.url).href,
  new URL("../../assets/first-project-02.png", import.meta.url).href,
  new URL("../../assets/first-project-03.png", import.meta.url).href,
  new URL("../../assets/first-project-04.png", import.meta.url).href
];
const firstProjectCover = new URL(
  "../../assets/first-project-cover.png",
  import.meta.url
).href;
const firstProjectBoard = new URL(
  "../../assets/first-project-board.png",
  import.meta.url
).href;

export const cases: PortfolioCase[] = [
  {
    id: "first-project",
    caseNumber: "001",
    name: "First Project",
    brief: "A very old project started in 2018: an open-world game with character customization, wardrobe changes, and rideable animals.",
    role: "Solo Developer responsible for the entire project, including gameplay, systems, world building, UI, and implementation.",
    techStack: ["Unity", "C#"],
    keyFeatures: [
      "Open world",
      "Character customization",
      "Wardrobe system",
      "Rideable tiger"
    ],
    videoUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2713265548743383%3Flocale%3Dpl_PL&show_text=false&width=560",
    supportingImage: firstProjectBoard,
    screenshots: firstProjectScreenshots,
    liveDemoUrl: "",
    githubUrl: "",
    googlePlayUrl: "",
    appStoreUrl: "",
    status: "CLOSED",
    category: "PC",
    categoryKey: "pc",
    tags: ["game"],
    coverImage: firstProjectCover,
    coverFit: "cover",
    order: 0
  },
  {
    id: "moonshot-voyage",
    caseNumber: "003",
    name: "Moonshot Voyage",
    brief: "A top-down looter shooter with NFT-based progression on the Enjin JumpNet blockchain.",
    role: "Gameplay Programmer focused on combat, enemy AI, tower defence systems, and a small flying spaceship.",
    techStack: ["Unity", "C#", "NavMesh", "Enjin SDK", "State Machines", "Event-Driven Architecture"],
    keyFeatures: [
      "Combat and player progression",
      "Enemy AI with state machines",
      "Tower defence mode",
      "NavMesh pathfinding",
      "Wave spawning and different enemy types",
      "Small flying spaceship"
    ],
    videoUrl: "https://www.youtube-nocookie.com/embed/NM8ZqvY59zY?rel=0",
    supportingImage: moonshotVoyageBoard,
    screenshots: moonshotVoyageScreenshots,
    liveDemoUrl: "",
    githubUrl: "",
    googlePlayUrl: "",
    appStoreUrl: "",
    status: "CLOSED",
    category: "PC",
    categoryKey: "pc",
    tags: ["game"],
    coverImage: moonshotVoyageCover,
    coverFit: "cover",
    order: 30
  },
  {
    id: "tap-oceans-reef-rescue",
    caseNumber: "004",
    name: "Tap Oceans Reef Rescue",
    brief: "A casual aquarium-themed mobile game for iOS and Android.",
    role: "Unity Developer focused on porting the iOS version to Android, fixing platform-specific issues, and supporting a small part of gameplay development.",
    techStack: ["Unity", "C#", "Android", "iOS", "Unity IAP"],
    keyFeatures: [
      "iOS-to-Android port",
      "Platform-specific bug fixes",
      "Android performance fixes",
      "Small gameplay contributions",
      "Daily rewards",
      "Unity IAP integration"
    ],
    videoUrl: "https://www.youtube-nocookie.com/embed/4IFq0Fm20Oc?rel=0",
    supportingImage: tapOceansDevelopmentFlow,
    screenshots: tapOceansScreenshots,
    liveDemoUrl: "",
    githubUrl: "",
    googlePlayUrl: "https://play.google.com/store/apps/details?id=com.superheart.oceanreeflife&hl=pl",
    appStoreUrl: "https://apps.apple.com/us/app/tap-oceans-3d-reef-rescue/id1565207752",
    status: "CLOSED",
    category: "MOBILE",
    categoryKey: "mobile",
    tags: ["game"],
    coverImage: tapOceansCover,
    coverFit: "cover",
    order: 50
  },
  {
    id: "gansu-chronicles",
    caseNumber: "002",
    name: "Game with panda",
    brief: "A very old project: an open-world sandbox game focused on gathering resources, crafting, building, and creating flying machines.",
    role: "Solo Developer responsible for the entire project.",
    techStack: ["Unity", "C#"],
    keyFeatures: [
      "Open sandbox world",
      "Resource gathering",
      "Crafting system",
      "Building system",
      "Player-built flying machines"
    ],
    videoUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F260564571806892%3Flocale%3Dpl_PL&show_text=false&width=560",
    supportingImage: pandaGameBoard,
    screenshots: pandaGameScreenshots,
    liveDemoUrl: "",
    githubUrl: "",
    googlePlayUrl: "",
    appStoreUrl: "",
    status: "CLOSED",
    category: "PC",
    categoryKey: "pc",
    tags: ["game"],
    coverImage: pandaGameCover,
    coverFit: "cover",
    order: 10
  }
];

export const findCase = (id: string | null) => cases.find((item) => item.id === id);
