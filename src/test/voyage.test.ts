import { describe, expect, it } from "vitest";

import { contact, educationRows, experienceRows, OPEN_CUPBOARD_URL, passages, profile } from "@/data/portfolio";
import { allSkills, DEFAULT_PASSAGE, islandsOf, parsePassage, rowsForPassage, splitLinks } from "@/lib/voyage";

describe("voyage rules", () => {
  it("splits into Education (left), Experience (centre) and Skills (right)", () => {
    expect(passages.map((p) => p.id)).toEqual(["education", "experience", "skills"]);
    expect(passages[1]?.title).toBe("Experience");
  });

  it("heads down the centre Experience passage by default, for unknown values and for old links", () => {
    expect(DEFAULT_PASSAGE).toBe("experience");
    expect(parsePassage(undefined)).toBe("experience");
    expect(parsePassage("treasure")).toBe("experience");
    expect(parsePassage("entrepreneurship")).toBe("experience");
    expect(parsePassage("skills")).toBe("skills");
  });

  it("introduces him as Founder · Developer · Dual-IIM Scholar", () => {
    expect(profile.tagline).toBe("Founder · Developer · Dual-IIM Scholar");
  });

  it("uses the requested email address", () => {
    expect(contact.email).toBe("177aishwarynagaria@gmail.com");
  });

  it("links Instagram @aishwarynagaria", () => {
    expect(contact.instagram.handle).toBe("@aishwarynagaria");
    expect(contact.instagram.url).toBe("https://www.instagram.com/aishwarynagaria/");
  });

  it("starts the experience voyage at A N Arts (2020) and ends at Open Cupboard", () => {
    const ids = islandsOf(experienceRows).map((i) => i.id);
    expect(ids).toEqual(["an-arts", "munil-sir-classes", "muskurahat-foundation", "bms-founders-club", "open-cupboard"]);
    expect(islandsOf(experienceRows)[0]?.year).toBe("2020");
  });

  it("sends Open Cupboard to opencupboard.in", () => {
    expect(OPEN_CUPBOARD_URL).toBe("https://opencupboard.in");
    const oc = islandsOf(experienceRows).find((i) => i.id === "open-cupboard");
    expect(oc?.orgUrl).toBe("https://opencupboard.in");
    expect(splitLinks("Bootstrapped Open Cupboard: websites")).toEqual([
      { text: "Bootstrapped " },
      { text: "Open Cupboard", href: "https://opencupboard.in" },
      { text: ": websites" },
    ]);
  });

  it("calls out ₹0 → ₹1 Lakh in 3 weeks for Open Cupboard", () => {
    const oc = islandsOf(experienceRows).find((i) => i.id === "open-cupboard");
    expect(oc?.headline).toBe("₹0 → ₹1 Lakh in 3 weeks.");
  });

  it("lists every LinkedIn skill plus Google Sheets", () => {
    const skills = allSkills();
    for (const s of [
      "Start-up Ventures",
      "Start-up Leadership",
      "Full-Stack Development",
      "SaaS Development",
      "Customer Relationship Management (CRM)",
      "3D Rendering",
      "B2B2C",
      "Client Relations",
      "Direct Sales",
      "Entrepreneurship",
      "Customer Acquisition",
      "Product Operations",
      "Digital Marketing Media",
      "Microsoft Office",
      "Product Development",
      "Product Management",
      "Canva",
      "Digital Marketing Communications",
      "Executive Calendar Management",
      "Google Sheets",
    ]) {
      expect(skills).toContain(s);
    }
  });

  it("sails IIM Kozhikode and IIM Bangalore together as twin islands", () => {
    const twin = educationRows[0]?.islands.map((i) => i.id);
    expect(twin).toEqual(["iim-kozhikode", "iim-bangalore"]);
  });

  it("includes McKinsey Forward and Hiroshima University's AGILE COIL in education", () => {
    const ids = islandsOf(rowsForPassage("education")).map((i) => i.id);
    expect(ids).toContain("mckinsey-forward");
    expect(ids).toContain("hiroshima-agile");
  });

  it("leaves school (10th / 12th) results out of education", () => {
    const titles = islandsOf(rowsForPassage("education")).map((i) => `${i.title} ${i.role}`);
    for (const t of titles) expect(t).not.toMatch(/\b(10th|12th|class\s*1[02]|cbse board)\b/i);
  });

  it("gives every island a year", () => {
    const all = [...islandsOf(rowsForPassage("education")), ...islandsOf(rowsForPassage("experience"))];
    for (const island of all) expect(island.year).toMatch(/^\d{4}$/);
  });
});
