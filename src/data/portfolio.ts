/**
 * Every word on the voyage lives here. Facts come from Aishwary's LinkedIn
 * (experience + skills), his IIMK journey post and the official program sites.
 */
import resumePdf from "@/assets/aishwary-nagaria-resume.pdf.asset.json";
import wantedPhoto from "@/assets/aishwary-wanted.jpg.asset.json";

export type PassageId = "education" | "experience" | "skills";

export type IslandArt =
  | "iimk"
  | "iimb"
  | "mckinsey"
  | "hiroshima"
  | "opencupboard"
  | "ecell"
  | "marketing"
  | "edtech"
  | "anarts";

export interface IslandStat {
  value: string;
  label: string;
}

export interface Island {
  id: string;
  art: IslandArt;
  /** Four-digit year shown on the island's stamp. */
  year: string;
  /** Longer human period, e.g. "Sep 2026 — Present". */
  period: string;
  title: string;
  org: string;
  /** Website for the organisation; the org name links here wherever it appears. */
  orgUrl?: string;
  role: string;
  location?: string;
  /** The punchy one-liner on the map card. */
  headline: string;
  /** One short supporting sentence under the headline. */
  brief: string;
  /** Up to three big numbers. */
  stats?: IslandStat[];
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
  title: string;
  /** Compact label for small screens and the top bar. */
  short: string;
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

export const OPEN_CUPBOARD_URL = "https://opencupboard.in";

export const profile = {
  name: "Aishwary Nagaria",
  nameJp: "アイシュワリー・ナガリア",
  tagline: "Founder · Developer · Dual-IIM Scholar",
  taglineParts: ["Founder", "Developer", "Dual-IIM Scholar"],
} as const;

export const contact = {
  email: "177aishwarynagaria@gmail.com",
  instagram: {
    handle: "@aishwarynagaria",
    url: "https://www.instagram.com/aishwarynagaria/",
  },
  linkedin: {
    handle: "Aishwary Nagaria",
    url: "https://www.linkedin.com/in/aishwary-nagaria-7a9a24370/",
  },
  resume: {
    label: "Resume",
    handle: "Download the PDF",
    url: resumePdf.url,
  },
} as const;

/** Names that always become links, wherever they appear in the copy. */
export const autoLinks: { text: string; href: string }[] = [
  { text: "opencupboard.in", href: OPEN_CUPBOARD_URL },
  { text: "Open Cupboard", href: OPEN_CUPBOARD_URL },
  { text: "OpenCupboard", href: OPEN_CUPBOARD_URL },
];

/** Left → centre → right, exactly as the sea splits at the fork. */
export const passages: Passage[] = [
  {
    id: "education",
    numeral: "I",
    kanji: "学",
    title: "Education",
    short: "Education",
    routeName: "The Scholar’s Current",
    gateLine: "Two IIMs at once. McKinsey.org. Hiroshima.",
    blurb: "Two IIMs at the same time, plus global programs on the side.",
  },
  {
    id: "experience",
    numeral: "II",
    kanji: "航",
    title: "Experience",
    short: "Experience",
    routeName: "The Builder’s Grand Line",
    gateLine: "From a lockdown art shop to ₹1 Lakh in 3 weeks.",
    blurb: "Five islands, five crews. Each one built, scaled or launched from zero.",
  },
  {
    id: "skills",
    numeral: "III",
    kanji: "技",
    title: "Skills",
    short: "Skills",
    routeName: "The Skill Falls",
    gateLine: "Too many to sail past, so the ship drops down the falls.",
    blurb: "The sea runs out and the falls begin. Every ledge is a set of skills from the voyage.",
  },
];

export const educationRows: IslandRow[] = [
  {
    strait: "Both at once",
    islands: [
      {
        id: "iim-kozhikode",
        art: "iimk",
        year: "2026",
        period: "2026 — 2030",
        title: "IIM Kozhikode",
        org: "Indian Institute of Management Kozhikode",
        role: "BMS (Honours with Research)",
        location: "Kochi campus",
        headline: "First-ever BMS batch.",
        brief: "IIMK’s first full-time undergraduate degree, on campus.",
        story: [
          "It started as a small dream in Class 12: get into an IIM. With very little guidance, Aishwary took the first step anyway and figured out the path on the way.",
          "Prep turned him from a rote learner into an aptitude learner: prep marathons till 5 AM, several mocks a day and a lot of discipline. Then he got to say it: “I am joining the Indian Institute of Management, Kozhikode.”",
          "The BMS (Honours with Research) is a four-year programme on IIMK’s Kochi campus. It pairs a Major in Management with Minors such as Economics & Public Policy, AI & ML, Psychology and Finance & Big Data, plus exchange semesters, research and internships.",
        ],
        highlights: [
          "Inaugural batch of IIMK’s first full-time UG programme",
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
        role: "BBA, Digital Business & Entrepreneurship",
        location: "Online",
        headline: "A second IIM. Same time.",
        brief: "IIMB’s digital-first BBA, sailed alongside IIMK.",
        story: [
          "While on campus at IIM Kozhikode, Aishwary also studies at IIM Bangalore. Two IIMs, two degrees, one voyage.",
          "The BBA (DBE) is a three-year, digital-first programme that mixes academics with real projects and mentorship. It is built for people who want to launch ventures, which suits a founder.",
        ],
        highlights: [
          "Double-degree journey with IIM Kozhikode",
          "Business fundamentals + digital innovation",
          "Venture building, mentorship and real projects",
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
        location: "Global, online",
        headline: "Enrolled in McKinsey.org Forward.",
        brief: "Workplace-ready skills with a cohort from 130+ countries.",
        story: [
          "Forward is McKinsey.org’s free, multi-week learning program for early-career talent, offered in more than 130 countries.",
          "It trains the workplace skills that carry across industries: problem solving, communication, digital tools and adaptability. Graduates join the Forward alumni network.",
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
        title: "Hiroshima University",
        org: "Hiroshima University, Japan",
        role: "AGILE COIL · Round 1 selected",
        location: "Japan × India × UK × Australia",
        headline: "Round 1 cleared. Next stop: Japan?",
        brief: "Selected in the first round of the AGILE entrepreneurship program.",
        story: [
          "AGILE (Agile Entrepreneurship Development Program through International Collaborative Learning) is Hiroshima University’s international program for globally minded future founders.",
          "Phase 1 is COIL (Collaborative Online International Learning). Mixed teams from Hiroshima University, the University of Sheffield, BITS Pilani, IIM Bangalore and UNSW work on carbon neutrality, the SDGs and disaster prevention. Later phases move to face-to-face exchanges, a semester abroad and internships.",
        ],
        highlights: [
          "Cleared the first selection round",
          "Five partner universities across four countries",
          "Cross-cultural, agile entrepreneurship",
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

/** Oldest first: the voyage starts at the art shop and ends at Open Cupboard. */
export const experienceRows: IslandRow[] = [
  {
    islands: [
      {
        id: "an-arts",
        art: "anarts",
        year: "2020",
        period: "Mar 2020 — Mar 2021",
        title: "A N Arts",
        org: "A N Arts",
        role: "Founder",
        location: "Self-employed",
        headline: "Lockdown sketches → first paying customers.",
        brief: "~30 original sketches and handmade pieces, sold direct.",
        stats: [
          { value: "₹17.4K", label: "in sales (est.)" },
          { value: "30", label: "pieces sold" },
          { value: "₹900", label: "top price" },
        ],
        story: [
          "A N Arts began during the COVID lockdown. Sketching for fun turned into Aishwary’s first business.",
          "He made and sold about 24 sketches at ₹300–500 each and 6 handcrafted pieces, like decorative boxes and pen holders, at ₹700–900. He made them, priced them and sold them himself, straight to schoolmates.",
          "Estimated sales: ₹11,400–₹17,400. The lesson stuck: a hobby becomes a business the moment someone pays for it.",
        ],
        highlights: [
          "~30 original sketches and handcrafted products sold",
          "Estimated ₹11.4K–₹17.4K in sales",
          "Owned product, pricing and direct sales end to end",
        ],
        tags: ["Product Development", "Direct Sales", "Customer Acquisition"],
      },
    ],
  },
  {
    islands: [
      {
        id: "munil-sir-classes",
        art: "edtech",
        year: "2024",
        period: "Jun 2024 — Mar 2025",
        title: "Munil Sir Classes",
        org: "Munil Sir Classes",
        role: "Product Manager · Product Head",
        location: "New Delhi · Remote",
        headline: "43K → 370K+ subscribers.",
        brief: "Launched the first app and led a 12-member team as Product Head.",
        stats: [
          { value: "370K+", label: "YouTube subs" },
          { value: "37K+", label: "paid learners" },
          { value: "12", label: "person team" },
        ],
        story: [
          "Munil Sir taught on YouTube and WhatsApp. Aishwary led the launch of his first educational app and helped turn it into a scalable EdTech platform.",
          "As Product Head he ran a 12-member cross-functional team across product development, operations, content and execution, and worked directly with the founder to build scalable workflows and professionalise operations.",
          "During that growth phase the channel went from 43K to 370K+ subscribers, and paid learners grew from 5.8K to 37K+.",
        ],
        highlights: [
          "Launched the first educational app",
          "Led a 12-member cross-functional team",
          "Helped scale 43K → 370K+ subscribers and 5.8K → 37K+ paid learners",
          "Kept product, marketing and content teams in sync",
        ],
        tags: ["Product Management", "Product Development", "Product Operations"],
      },
    ],
  },
  {
    islands: [
      {
        id: "muskurahat-foundation",
        art: "marketing",
        year: "2025",
        period: "Jul 2025 — Aug 2025",
        title: "Muskurahat Foundation",
        org: "Muskurahat Foundation",
        role: "Digital Marketing Intern",
        location: "Remote",
        headline: "Ran the Instagram for 57.9K+ followers.",
        brief: "Posts, campaigns and Canva creatives that helped raise ₹12.5K.",
        stats: [
          { value: "57.9K+", label: "followers" },
          { value: "₹12.5K", label: "raised" },
        ],
        story: [
          "At Muskurahat Foundation Aishwary managed the foundation’s Instagram, which has 57.9K+ followers. He planned the content, published the posts and kept the audience engaged.",
          "He designed promotional creatives, campaign posters and branded material in Canva for awareness and fundraising drives.",
          "With the marketing team he ran digital campaigns that raised ₹12.5K for the cause and widened the foundation’s reach.",
        ],
        highlights: [
          "Managed a 57.9K+ follower Instagram",
          "Designed campaign posters and creatives in Canva",
          "Campaigns contributed ₹12.5K in fundraising",
        ],
        tags: ["Digital Marketing Media", "Canva", "Digital Marketing Communications"],
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
        location: "IIM Kozhikode · On-site",
        headline: "Founders’ crew of IIMK’s first BMS batch.",
        brief: "Joined the E-Cell’s Founder’s Club in month one on campus.",
        story: [
          "In his first month at IIM Kozhikode, Aishwary joined the BMS Founder’s Club, the founder community of the first BMS batch, under the institute’s Entrepreneurship Cell.",
          "It is a crew of builders who swap ideas, pressure-test ventures and turn classroom frameworks into real startups.",
        ],
        highlights: [
          "Joined from day one of the BMS programme",
          "Founder-first community at IIMK",
          "Start-up leadership and venture building on campus",
        ],
        tags: ["Start-up Leadership", "Start-up Ventures", "Product Operations"],
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
        orgUrl: OPEN_CUPBOARD_URL,
        role: "Founder & CTO",
        location: "Kochi · On-site",
        headline: "₹0 → ₹1 Lakh in 3 weeks.",
        brief: "Bootstrapped. 3D websites, web apps and automations for B2B and B2C brands.",
        stats: [
          { value: "₹1L", label: "revenue" },
          { value: "3 wks", label: "from ₹0" },
          { value: "5", label: "person team" },
        ],
        story: [
          "Open Cupboard builds high-converting 3D websites, custom web apps and automated systems for modern brands. Aishwary founded it and runs it as CTO.",
          "He bootstrapped it from ₹0 to ₹1 Lakh in revenue in just 3 weeks, delivering for B2B and B2C clients while starting work on its own SaaS products.",
          "He leads technical strategy and delivery: responsive websites, web apps, custom dashboards, workflow automations, cloud backends and API integrations. He designs in Figma, then builds it for real.",
          "He built and mentors a 5-person team, set up workflows for LinkedIn outreach, Instagram, organic content and the inbound pipeline, and leads client pitches, negotiations and closing.",
        ],
        highlights: [
          "₹0 → ₹1 Lakh revenue in 3 weeks, bootstrapped",
          "Built and mentors a 5-person team",
          "Figma to production: websites, web apps, dashboards, automations",
          "Leads pitches, negotiations and deal closing",
          "Building in-house SaaS products",
        ],
        tags: ["Full-Stack Development", "SaaS Development", "3D Rendering", "B2B2C"],
        link: { label: "Visit opencupboard.in", href: OPEN_CUPBOARD_URL },
      },
    ],
  },
];

/** LinkedIn skills, grouped, plus Google Sheets. */
export const skillGroups: SkillGroup[] = [
  {
    id: "build",
    title: "Build & Ship",
    kanji: "築",
    skills: ["Full-Stack Development", "SaaS Development", "3D Rendering", "Web Development"],
  },
  {
    id: "product",
    title: "Product",
    kanji: "策",
    skills: ["Product Management", "Product Development", "Product Operations"],
  },
  {
    id: "venture",
    title: "Venture",
    kanji: "起",
    skills: ["Entrepreneurship", "Start-up Ventures", "Start-up Leadership", "B2B2C"],
  },
  {
    id: "clients",
    title: "Sales & Clients",
    kanji: "商",
    skills: ["Client Relations", "Customer Relationship Management (CRM)", "Direct Sales", "Customer Acquisition"],
  },
  {
    id: "growth",
    title: "Marketing",
    kanji: "伸",
    skills: ["Digital Marketing Media", "Digital Marketing Communications", "Canva"],
  },
  {
    id: "tools",
    title: "Tools & Ops",
    kanji: "算",
    skills: ["Google Sheets", "Microsoft Office", "Executive Calendar Management"],
  },
];

export const portraits = {
  wanted: { src: wantedPhoto.url, alt: "Aishwary Nagaria in sunglasses and a Starry Night shirt" },
} as const;
