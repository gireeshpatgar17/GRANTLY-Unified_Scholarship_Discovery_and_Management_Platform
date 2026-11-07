export const PAGES = [
  "Dashboard",
  "Explore Scholarships",
  "Eligibility Matching",
  "My Applications",
  "Saved Scholarships",
  "My Profile",
] as const;

export type Page = (typeof PAGES)[number];

export const APPLICATION_STATUSES = [
  "Not Started",
  "In Progress",
  "Submitted",
  "Approved",
  "Rejected",
] as const;

export type Status = (typeof APPLICATION_STATUSES)[number];
export type EducationLevel = "School" | "Undergraduate" | "Postgraduate";
export type StudentCategory =
  "General" | "OBC" | "SC" | "ST" | "EWS" | "Minority";
export type ScholarshipCategory =
  | "Government"
  | "Private"
  | "Institutional"
  | "Need-based"
  | "Merit-based"
  | "STEM";

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  type: "Government" | "Private" | "Institutional";
  category: ScholarshipCategory;
  level: EducationLevel[];
  amount: number;
  deadline: string;
  description: string;
  criteria: string[];
  documents: string[];
  color: string;
  initials: string;
  incomeMax?: number;
  minMarks?: number;
  state?: string;
  applicantCategories?: StudentCategory[];
  applicantGenders?: string[];
  courseKeywords?: string[];
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  level: EducationLevel;
  course: string;
  institution: string;
  marks: number;
  income: number;
  category: StudentCategory;
  gender: string;
}

export interface Application {
  id: string;
  status: Status;
  updated: string;
}

export interface EligibilityMatch {
  scholarship: Scholarship;
  percentage: number;
  eligible: boolean;
  missingCriteria: string[];
  metCriteria: number;
  totalCriteria: number;
}

export type AmountFilter =
  "Any amount" | "Under ₹50,000" | "₹50,000 – ₹1 lakh" | "Above ₹1 lakh";

export type SortOrder = "deadline" | "amount" | "name";
