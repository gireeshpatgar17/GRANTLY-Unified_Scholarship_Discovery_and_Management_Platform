import { describe, expect, it } from "vitest";
import { scholarships, initialProfile } from "../data/scholarships";
import { filterScholarships, matchScholarship } from "./scholarships";

describe("scholarship discovery", () => {
  it("searches provider and name without case sensitivity", () => {
    expect(
      filterScholarships(scholarships, { query: "RELIANCE" }).map(
        ({ id }) => id,
      ),
    ).toContain("reliance-foundation");
  });

  it("combines category, level and award filters", () => {
    const result = filterScholarships(scholarships, {
      category: "Private",
      level: "Undergraduate",
      amount: "Above ₹1 lakh",
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((item) => item.type === "Private")).toBe(true);
    expect(result.every((item) => item.level.includes("Undergraduate"))).toBe(
      true,
    );
    expect(result.every((item) => item.amount > 100_000)).toBe(true);
  });

  it("sorts by award amount in descending order", () => {
    const result = filterScholarships(scholarships, { sort: "amount" });
    expect(result[0].amount).toBeGreaterThanOrEqual(
      result[result.length - 1].amount,
    );
  });
});

describe("eligibility rules", () => {
  it("reports an eligible match when all explicit rules are met", () => {
    const scholarship = scholarships.find(
      (item) => item.id === "nsp-post-matric",
    );
    expect(scholarship).toBeDefined();
    const profile = {
      ...initialProfile,
      level: "Undergraduate" as const,
      category: "SC" as const,
      income: 200_000,
      marks: 70,
    };
    const result = matchScholarship(scholarship!, profile);
    expect(result.eligible).toBe(true);
    expect(result.percentage).toBe(100);
    expect(result.missingCriteria).toEqual([]);
  });

  it("returns explicit missing criteria for ineligible students", () => {
    const scholarship = scholarships.find(
      (item) => item.id === "nsp-post-matric",
    );
    expect(scholarship).toBeDefined();
    const result = matchScholarship(scholarship!, {
      ...initialProfile,
      category: "General",
      income: 500_000,
      marks: 40,
      level: "School",
    });
    expect(result.eligible).toBe(false);
    expect(result.missingCriteria.length).toBe(4);
  });
});
