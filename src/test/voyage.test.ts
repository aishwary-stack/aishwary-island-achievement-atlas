import { describe, expect, it } from "vitest";

import { contact, educationRows, passages } from "@/data/portfolio";
import { allSkills, DEFAULT_PASSAGE, islandsOf, parsePassage, rowsForPassage } from "@/lib/voyage";

describe("voyage rules", () => {
  it("splits into Education (left), Entrepreneurship (centre) and Skills (right)", () => {
    expect(passages.map((p) => p.id)).toEqual(["education", "entrepreneurship", "skills"]);
  });

  it("heads down the centre Entrepreneurship passage by default and for unknown values", () => {
    expect(DEFAULT_PASSAGE).toBe("entrepreneurship");
    expect(parsePassage(undefined)).toBe("entrepreneurship");
    expect(parsePassage("treasure")).toBe("entrepreneurship");
    expect(parsePassage("skills")).toBe("skills");
  });

  it("uses the requested email address", () => {
    expect(contact.email).toBe("177aishwarynagaria@gmail.com");
  });

  it("links Instagram @aishwarynagaria", () => {
    expect(contact.instagram.handle).toBe("@aishwarynagaria");
    expect(contact.instagram.url).toBe("https://www.instagram.com/aishwarynagaria/");
  });

  it("lists Google Sheets among the skills", () => {
    expect(allSkills()).toContain("Google Sheets");
  });

  it("sails IIM Kozhikode and IIM Bangalore together as twin islands", () => {
    const twin = educationRows[0].islands.map((i) => i.id);
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

  it("gives every achievement island a year", () => {
    const all = [...islandsOf(rowsForPassage("education")), ...islandsOf(rowsForPassage("entrepreneurship"))];
    for (const island of all) expect(island.year).toMatch(/^\d{4}$/);
  });
});
