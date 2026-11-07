import type {
  AmountFilter,
  EligibilityMatch,
  Profile,
  Scholarship,
  SortOrder,
} from "../types";

export function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase("en-IN").normalize("NFKD");
}

export function filterScholarships(
  scholarships: Scholarship[],
  options: {
    query?: string;
    category?: string;
    level?: string;
    amount?: AmountFilter;
    sort?: SortOrder;
  } = {},
): Scholarship[] {
  const query = normalizeSearchText(options.query ?? "");
  const filtered = scholarships.filter((scholarship) => {
    const searchable = normalizeSearchText(
      `${scholarship.name} ${scholarship.provider} ${scholarship.description} ${scholarship.category}`,
    );
    const matchesQuery = query.length === 0 || searchable.includes(query);
    const matchesCategory =
      !options.category ||
      options.category === "All" ||
      scholarship.category === options.category ||
      scholarship.type === options.category;
    const matchesLevel =
      !options.level ||
      options.level === "All" ||
      scholarship.level.includes(options.level as Profile["level"]);
    const amount = scholarship.amount;
    const matchesAmount =
      !options.amount ||
      options.amount === "Any amount" ||
      (options.amount === "Under ₹50,000" && amount < 50_000) ||
      (options.amount === "₹50,000 – ₹1 lakh" &&
        amount >= 50_000 &&
        amount <= 100_000) ||
      (options.amount === "Above ₹1 lakh" && amount > 100_000);

    return matchesQuery && matchesCategory && matchesLevel && matchesAmount;
  });

  switch (options.sort ?? "deadline") {
    case "amount":
      return filtered.sort((a, b) => b.amount - a.amount);
    case "name":
      return filtered.sort((a, b) => a.name.localeCompare(b.name, "en-IN"));
    default:
      return filtered.sort((a, b) => a.deadline.localeCompare(b.deadline));
  }
}

export function matchScholarship(
  scholarship: Scholarship,
  profile: Profile,
): EligibilityMatch {
  const checks: Array<{ met: boolean; message: string }> = [];

  if (scholarship.level.length > 0) {
    checks.push({
      met: scholarship.level.includes(profile.level),
      message: `Study level must be ${scholarship.level.join(" or ")}`,
    });
  }
  if (scholarship.incomeMax !== undefined) {
    checks.push({
      met: profile.income <= scholarship.incomeMax,
      message: `Family income must be at or below ₹${scholarship.incomeMax.toLocaleString("en-IN")}`,
    });
  }
  if (scholarship.minMarks !== undefined) {
    checks.push({
      met: profile.marks >= scholarship.minMarks,
      message: `Previous marks must be at least ${scholarship.minMarks}%`,
    });
  }
  if (scholarship.state) {
    checks.push({
      met:
        normalizeSearchText(profile.state) ===
        normalizeSearchText(scholarship.state),
      message: `Must be a domicile of ${scholarship.state}`,
    });
  }
  if (scholarship.applicantCategories) {
    checks.push({
      met: scholarship.applicantCategories.includes(profile.category),
      message: `Category must be ${scholarship.applicantCategories.join(" or ")}`,
    });
  }
  if (scholarship.applicantGenders) {
    checks.push({
      met: scholarship.applicantGenders.includes(profile.gender),
      message: `Gender must be ${scholarship.applicantGenders.join(" or ")}`,
    });
  }
  if (scholarship.courseKeywords) {
    const course = normalizeSearchText(profile.course);
    checks.push({
      met: scholarship.courseKeywords.some((keyword) =>
        course.includes(normalizeSearchText(keyword)),
      ),
      message: `Course must be in ${scholarship.courseKeywords.join(", ")}`,
    });
  }

  const missingCriteria = checks
    .filter((check) => !check.met)
    .map((check) => check.message);
  const metCriteria = checks.length - missingCriteria.length;

  return {
    scholarship,
    percentage:
      checks.length === 0 ? 0 : Math.round((metCriteria / checks.length) * 100),
    eligible: missingCriteria.length === 0 && checks.length > 0,
    missingCriteria,
    metCriteria,
    totalCriteria: checks.length,
  };
}

export function matchScholarships(
  scholarships: Scholarship[],
  profile: Profile,
): EligibilityMatch[] {
  return scholarships
    .map((scholarship) => matchScholarship(scholarship, profile))
    .sort(
      (a, b) =>
        b.percentage - a.percentage ||
        b.scholarship.amount - a.scholarship.amount,
    );
}

export function formatMoney(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Date unavailable";
  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysUntil(date: string, now = new Date()): number {
  const deadline = new Date(`${date}T23:59:59`);
  if (Number.isNaN(deadline.getTime())) return Number.NEGATIVE_INFINITY;
  return Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000);
}
