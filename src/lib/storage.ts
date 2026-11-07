import {
  APPLICATION_STATUSES,
  PAGES,
  type Application,
  type Profile,
  type Scholarship,
} from "../types";
import {
  initialApplications,
  initialProfile,
  initialSavedIds,
  scholarships,
} from "../data/scholarships";

export const STORAGE_KEYS = {
  profile: "grantly-profile",
  saved: "grantly-saved",
  applications: "grantly-applications",
} as const;

const scholarshipIds = new Set(scholarships.map(({ id }) => id));
const educationLevels = new Set<Profile["level"]>([
  "School",
  "Undergraduate",
  "Postgraduate",
]);
const categories = new Set<Profile["category"]>([
  "General",
  "OBC",
  "SC",
  "ST",
  "EWS",
  "Minority",
]);
const statuses = new Set<string>(APPLICATION_STATUSES);

function getStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

export function readPersistentValue<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
): T {
  try {
    const raw = getStorage()?.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writePersistentValue<T>(key: string, value: T): boolean {
  try {
    getStorage()?.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function isProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Partial<Profile>;
  const requiredStrings: Array<keyof Profile> = [
    "name",
    "email",
    "phone",
    "city",
    "state",
    "course",
    "institution",
    "gender",
  ];
  return (
    requiredStrings.every(
      (key) => typeof profile[key] === "string" && profile[key]!.length <= 200,
    ) &&
    typeof profile.level === "string" &&
    educationLevels.has(profile.level) &&
    typeof profile.category === "string" &&
    categories.has(profile.category) &&
    typeof profile.marks === "number" &&
    Number.isFinite(profile.marks) &&
    profile.marks >= 0 &&
    profile.marks <= 100 &&
    typeof profile.income === "number" &&
    Number.isFinite(profile.income) &&
    profile.income >= 0 &&
    profile.income <= 100_000_000
  );
}

export function sanitizeProfile(profile: Profile): Profile {
  const textFields: Array<keyof Profile> = [
    "name",
    "email",
    "phone",
    "city",
    "state",
    "course",
    "institution",
    "gender",
  ];
  const sanitized = { ...profile };
  for (const key of textFields) {
    const value = sanitized[key];
    if (typeof value === "string") {
      (sanitized[key] as string) = value.trim().slice(0, 200);
    }
  }
  return {
    ...sanitized,
    marks: Math.min(100, Math.max(0, Number(sanitized.marks) || 0)),
    income: Math.min(100_000_000, Math.max(0, Number(sanitized.income) || 0)),
  };
}

export function isSavedScholarshipList(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= scholarships.length &&
    value.every((id) => typeof id === "string" && scholarshipIds.has(id))
  );
}

export function isApplicationList(value: unknown): value is Application[] {
  return (
    Array.isArray(value) &&
    value.length <= scholarships.length &&
    value.every((item) => {
      if (!item || typeof item !== "object") return false;
      const application = item as Partial<Application>;
      return (
        typeof application.id === "string" &&
        scholarshipIds.has(application.id) &&
        typeof application.status === "string" &&
        statuses.has(application.status) &&
        typeof application.updated === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(application.updated)
      );
    })
  );
}

export function loadProfile(): Profile {
  return readPersistentValue(STORAGE_KEYS.profile, initialProfile, isProfile);
}

export function loadSavedScholarships(): string[] {
  return readPersistentValue(
    STORAGE_KEYS.saved,
    initialSavedIds,
    isSavedScholarshipList,
  );
}

export function loadApplications(): Application[] {
  return readPersistentValue(
    STORAGE_KEYS.applications,
    initialApplications,
    isApplicationList,
  );
}

export function isPage(value: unknown): value is (typeof PAGES)[number] {
  return (
    typeof value === "string" && PAGES.includes(value as (typeof PAGES)[number])
  );
}

export function isScholarship(value: unknown): value is Scholarship {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as Scholarship).id === "string" &&
    scholarshipIds.has((value as Scholarship).id)
  );
}
