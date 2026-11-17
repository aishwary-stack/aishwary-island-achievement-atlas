/**
 * Every word on the voyage lives here. Facts come from Aishwary's public LinkedIn
 * headline/experience, his Reflections.live author page and the official program sites.
 */

export type PassageId = "education" | "entrepreneurship" | "skills";

export type IslandArt =
  | "iimk"
  | "iimb"
  | "mckinsey"
  | "hiroshima"
  | "opencupboard"
  | "ecell"
  | "marketing"
  | "writing";

export interface Island {
  id: string;
  art: IslandArt;
  /** Four-digit year shown on the island's flag. */
  year: string;
  /** Longer human period, e.g. "Sep 2026 — Present". */
  period: string;
  title: string;
  org: string;
  role: string;
  location?: string;
  /** One-liner shown on the map. */
  brief: string;
  /** Paragraphs shown in the opened logbook. */
  story: string[];
  highlights: string[];
  tags: string[];
  link?: { label: string; href: string };
}

export interface IslandRow {
  islands: Island[];
  /** Label for the water between twin islands. */
  strait?: string;
}

export interface Passage {
  id: PassageId;
  numeral: "I" | "II" | "III";
  kanji: string;
  kanjiMeaning: string;
  title: string;
  routeName: string;
  gateLine: string;
  blurb: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  kanji: string;
  skills: string[];
}

export const profile = {
  name: "Aishwary Nagaria",
  nameJp: "アイシュワリー・ナガリア",
  headline:
    "IIM Kozhikode BMS ’29/30 · IIM Bangalore BBA DBE ’29 · Founder & CTO, Open Cupboard",
  tagline: "Founder · Builder · Dual-IIM scholar",
  focus: ["Product Management", "Web Development", "Entrepreneurship"],
} as const;

export const contact = {
  email: "177aishwarynagaria@gmail.com",
  instagram: {
    handle: "@aishwarynagaria",
    url: "https://www.instagram.com/aishwarynagaria/",
  },
  linkedin: {
    handle: "in/aishwary-nagaria-7a9a24370",
    url: "https://www.linkedin.com/in/aishwary-nagaria-7a9a24370/",
  },
} as const;

/** Left → centre → right, exactly as the sea splits at the fork. */
export const passages: Passage[] = [
  {
    id: "education",
    numeral: "I",
    kanji: "学",
    kanjiMeaning: "learning",
    title: "Education & Academics",
    routeName: "The Scholar’s Current",
    gateLine: "Two IIMs at once, McKinsey Forward and a ticket toward Hiroshima.",
    blurb:
      "A double voyage: IIM Kozhikode on campus and IIM Bangalore online, sailed side by side — with global programs charted along the way.",
  },
  {
    id: "entrepreneurship",
    numeral: "II",
    kanji: "創",
    kanjiMeaning: "to create",
    title: "Entrepreneurship",
    routeName: "The Founder’s Grand Line",
    gateLine: "Founder & CTO at Open Cupboard, E-Cell founder’s club, campaigns and a published pen.",
    blurb:
      "The centre channel — the widest and the wildest. Every island is something built, launched or written from scratch.",
  },
  {
    id: "skills",
    numeral: "III",
    kanji: "技",
    kanjiMeaning: "technique",
    title: "Skills",
    routeName: "The Skill Falls",
    gateLine: "Too many to sail past — so the ship drops straight down the waterfall.",
    blurb:
      "The sea runs out and the falls begin. Every ledge on the way down is a skill picked up on the voyage.",
  },
];

export const educationRows: IslandRow[] = [
  {
    strait: "Dual-degree strait · sailing both at once",
    islands: [
      {
        id: "iim-kozhikode",
        art: "iimk",
        year: "2026",
        period: "2026 — 2030",
        title: "IIM Kozhikode",
        org: "Indian Institute of Management Kozhikode",
        role: "Bachelor of Management Studies (Honours with Research)",
        location: "Kochi Campus, Kerala",
        brief: "Part of the first-ever BMS batch, IIMK’s first full-time undergraduate degree.",
        story: [
          "It started as a small dream in Class 12: to get into an “IIM”. With very little guidance, Aishwary took the first step anyway and figured out the path on the way.",
          "Preparing for the entrance turned him from a “CBSE-rooted learner” into an “aptitude-based learner”: late-night prep marathons that ran till 5 AM, several mocks and sectionals in a single day, and a lot of discipline. Then he got to say it: “I am joining the Indian Institute of Management, Kozhikode.”",
          "The BMS (Honours with Research) is a four-year programme on IIMK’s Kochi campus. It pairs a Major in Management with stackable Minors such as Economics & Public Policy, AI & ML, Psychology and Finance & Big Data, along with exchange semesters, research and internships.",
        ],
        highlights: [
          "Inaugural batch of IIMK’s first full-time UG programme (2026–27 start)",
          "Major in Management with interdisciplinary Minors",
          "Member, BMS Founder’s Club (E-Cell)",
        ],
        tags: ["BMS ’29/30", "On campus", "Kochi"],
        link: {
          label: "Read his IIMK journey post",
          href: "https://www.linkedin.com/posts/aishwary-nagaria-7a9a24370_my-journey-to-the-indian-institute-of-management-activity-7494004895793156096-GtkJ",
        },
      },
      {
        id: "iim-bangalore",
        art: "iimb",
        year: "2026",
        period: "2026 — 2029",
        title: "IIM Bangalore",
        org: "Indian Institute of Management Bangalore",
        role: "BBA in Digital Business & Entrepreneurship (DBE)",
        location: "Online · alongside IIMK",
        brief: "IIMB’s three-year, digital-first BBA in Digital Business & Entrepreneurship.",
        story: [
          "While on campus at IIM Kozhikode, Aishwary also studies at IIM Bangalore. Two IIMs, two degrees, one voyage.",
          "The BBA (DBE) is a three-year, future-ready programme that mixes academics with real-world projects, mentorship and digital-first learning. It is built for people who want to launch ventures or change how organisations work, which suits a founder.",
        ],
        highlights: [
          "Double-degree journey with IIM Kozhikode",
          "Curriculum blends business fundamentals with digital innovation",
          "Venture-building, mentorship and real-world projects",
        ],
        tags: ["BBA DBE ’29", "Online", "Entrepreneurship"],
        link: { label: "About the BBA DBE programme", href: "https://dbe.iimb.ac.in/" },
      },
    ],
  },
  {
    islands: [
      {
        id: "mckinsey-forward",
        art: "mckinsey",
        year: "2026",
        period: "2026",
        title: "McKinsey.org Forward",
        org: "McKinsey.org",
        role: "Forward Program Learner",
        location: "Global · online",
        brief: "Enrolled in McKinsey’s global program on workplace-ready skills.",
        story: [
          "Forward is McKinsey.org’s free, multi-week learning program for career starters and job changers, offered in more than 130 countries.",
          "It covers essential workplace skills that carry across industries and roles, and graduates go on to the Forward network for more learning, events and alumni connections.",
        ],
        highlights: [
          "Practical, transferable workplace skills",
          "Global cohort across 130+ countries",
          "Pathway into the Forward alumni network",
        ],
        tags: ["McKinsey.org", "Global cohort"],
        link: {
          label: "About McKinsey.org Forward",
          href: "https://www.mckinsey.org/our-programs/forward/overview",
        },
      },
    ],
  },
  {
    islands: [
      {
        id: "hiroshima-agile",
        art: "hiroshima",
        year: "2026",
        period: "2026 · Round 1 cleared",
        title: "Hiroshima University · AGILE COIL",
        org: "Hiroshima University, Japan",
        role: "Selected · 1st round, AGILE COIL",
        location: "Japan × India × UK × Australia",
        brief: "Cleared round 1 for Hiroshima University’s AGILE entrepreneurship COIL program.",
        story: [
          "AGILE (Agile Entrepreneurship Development Program through International Collaborative Learning) is Hiroshima University’s international program for training globally minded, peace-driven future professionals.",
          "Phase 1 is COIL (Collaborative Online International Learning). Multicultural student teams from Hiroshima University, the University of Sheffield, BITS Pilani, IIM Bangalore and UNSW work together on carbon neutrality, the SDGs and disaster prevention. Later phases move to face-to-face exchanges, a semester abroad and internships.",
        ],
        highlights: [
          "Cleared the first selection round",
          "Five partner universities across four countries",
          "Builds cross-cultural, agile entrepreneurship",
        ],
        tags: ["Hiroshima University", "COIL", "International"],
        link: {
          label: "About the AGILE program",
          href: "https://agile-indopacific.hiroshima-u.ac.jp/overview-en/",
        },
      },
    ],
  },
];

export const entrepreneurshipRows: IslandRow[] = [
  {
    islands: [
      {
        id: "reflections-writer",
        art: "writing",
        year: "2025",
        period: "Jul 2025",
        title: "Published Writer",
        org: "Reflections.live",
        role: "Author · Opinion",
        brief: "Wrote “The Strategic Narcissist: Why Knowing Your Worth Isn’t Arrogance — It’s Armour”.",
        story: [
          "On Reflections.live Aishwary writes about human behaviour, self-growth and the hidden layers of everyday life. He tries to make complex ideas simple and offer a new angle on them.",
          "His opinion piece “The Strategic Narcissist” argues that adaptive self-belief isn’t vanity but value preservation. He calls it an emotional firewall that lets you take risks, lead, build, and recover from failure.",
        ],
        highlights: [
          "Published opinion essay, 30 July 2025",
          "Draws on Twenge & Campbell, Robert Greene, Cal Newport and Bruce Hood",
          "A founder’s mindset, put into words",
        ],
        tags: ["Writing", "Psychology", "Opinion"],
        link: {
          label: "Read the article",
          href: "https://reflections.live/articles/24250/the-strategic-narcissist-why-knowing-your-worth-isnt-arrogance-its-armor-article-by-aishwary-nagaria-23757-mdq7apay.html",
        },
      },
    ],
  },
  {
    islands: [
      {
        id: "digital-marketing",
        art: "marketing",
        year: "2025",
        period: "Before IIM",
        title: "Digital Marketing",
        org: "Digital campaigns",
        role: "Digital Marketing",
        brief: "Executed digital campaigns end to end, contributing to ₹12.5K in results.",
        story: [
          "Before campus life began, Aishwary was already running real digital campaigns, where results are counted in numbers, not likes.",
          "Planning, launching and optimising those campaigns gave him a working feel for growth, audiences and conversion, which he now brings to everything Open Cupboard builds.",
        ],
        highlights: [
          "Hands-on campaign execution",
          "Contributed to ₹12.5K in campaign results",
          "Growth instincts that feed his product work",
        ],
        tags: ["Growth", "Campaigns", "Marketing"],
      },
    ],
  },
  {
    islands: [
      {
        id: "bms-founders-club",
        art: "ecell",
        year: "2026",
        period: "Aug 2026 — Present",
        title: "BMS Founder’s Club",
        org: "E-Cell, IIM Kozhikode",
        role: "Member",
        location: "IIM Kozhikode",
        brief: "Member of the BMS Founder’s Club at IIMK’s Entrepreneurship Cell.",
        story: [
          "In his first month at IIM Kozhikode, Aishwary joined the BMS Founder’s Club, the founder community of the inaugural BMS batch under the institute’s Entrepreneurship Cell.",
          "It is a crew of builders swapping ideas, pressure-testing ventures and turning classroom frameworks into real startups.",
        ],
        highlights: [
          "Joined from day one of the BMS programme",
          "Founder-first community at IIMK",
          "Ideas → ventures, on campus",
        ],
        tags: ["E-Cell", "Community", "IIMK"],
      },
    ],
  },
  {
    islands: [
      {
        id: "open-cupboard",
        art: "opencupboard",
        year: "2026",
        period: "Sep 2026 — Present",
        title: "Open Cupboard",
        org: "Open Cupboard",
        role: "Founder & CTO",
        brief: "Founded Open Cupboard. Leads its tech strategy and delivery for B2B and B2C clients.",
        story: [
          "Open Cupboard is Aishwary’s flagship: a venture he founded and runs as CTO.",
          "He leads technical strategy and end-to-end delivery, turning business requirements into working digital solutions for both B2B and B2C clients, from the first idea through to launch.",
        ],
        highlights: [
          "Founder & CTO",
          "Owns technical strategy and end-to-end delivery",
          "Digital solutions for B2B and B2C clients",
        ],
        tags: ["Founder", "CTO", "Product", "Web"],
        link: { label: "See it on LinkedIn", href: contact.linkedin.url },
      },
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    id: "product",
    title: "Product & Strategy",
    kanji: "策",
    skills: [
      "Product Management",
      "Technical Strategy",
      "Requirements → Digital Solutions",
      "End-to-End Delivery",
      "B2B & B2C Solutions",
    ],
  },
  {
    id: "build",
    title: "Build & Ship",
    kanji: "築",
    skills: ["Web Development", "Website Launches", "Tech Leadership (CTO)"],
  },
  {
    id: "growth",
    title: "Growth & Marketing",
    kanji: "伸",
    skills: ["Digital Marketing", "Campaign Execution", "Audience Growth"],
  },
  {
    id: "data",
    title: "Data & Tools",
    kanji: "算",
    skills: ["Google Sheets", "Quantitative Aptitude", "Data-backed Decisions"],
  },
  {
    id: "venture",
    title: "Venture Building",
    kanji: "起",
    skills: ["Entrepreneurship", "Startup Ideation", "Founder Mindset"],
  },
  {
    id: "voice",
    title: "Voice & Crew",
    kanji: "声",
    skills: [
      "Opinion Writing",
      "Storytelling",
      "Cross-cultural Collaboration",
      "Leadership",
      "Communication",
    ],
  },
];
