import { beforeEach, describe, expect, it } from "vitest";
import { initialProfile } from "../data/scholarships";
import {
  isApplicationList,
  isProfile,
  isSavedScholarshipList,
  readPersistentValue,
  sanitizeProfile,
  writePersistentValue,
} from "./storage";

describe("local persistence validation", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips valid values and falls back for malformed JSON", () => {
    expect(writePersistentValue("profile", initialProfile)).toBe(true);
    expect(readPersistentValue("profile", initialProfile, isProfile)).toEqual(
      initialProfile,
    );
    localStorage.setItem("profile", "<script>");
    expect(readPersistentValue("profile", initialProfile, isProfile)).toEqual(
      initialProfile,
    );
  });

  it("rejects unknown saved IDs and invalid application states", () => {
    expect(isSavedScholarshipList(["does-not-exist"])).toBe(false);
    expect(
      isApplicationList([
        { id: "reliance-foundation", status: "Pending", updated: "2026-01-01" },
      ]),
    ).toBe(false);
  });

  it("trims profile text and constrains numeric values", () => {
    const sanitized = sanitizeProfile({
      ...initialProfile,
      name: `  ${"A".repeat(210)}  `,
      marks: 150,
      income: -10,
    });
    expect(sanitized.name).toHaveLength(200);
    expect(sanitized.marks).toBe(100);
    expect(sanitized.income).toBe(0);
  });
});
