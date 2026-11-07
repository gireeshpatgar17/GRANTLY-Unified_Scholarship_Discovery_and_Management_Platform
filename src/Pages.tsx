import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Award,
  Bookmark,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  GraduationCap,
  Heart,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";
import type {
  AmountFilter,
  Application,
  EligibilityMatch,
  Page,
  Profile,
  Scholarship,
  Status,
  SortOrder,
} from "./types";
import { scholarships } from "./data/scholarships";
import { daysUntil, formatDate, formatMoney } from "./domain/scholarships";

function Heading({
  eyebrow,
  title,
  sub,
  action,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
function ScholarshipCard({
  s,
  saved,
  open,
  toggle,
}: {
  s: Scholarship;
  saved: boolean;
  open: () => void;
  toggle: () => void;
}) {
  return (
    <motion.article whileHover={{ y: -3 }} className="scholarship-card">
      <div className="card-top">
        <div className="org-avatar" style={{ background: s.color }}>
          {s.initials}
        </div>
        <div className="org-name">
          <strong>{s.provider}</strong>
          <span>
            {s.type} · {s.category}
          </span>
        </div>
        <button
          className={`save-btn ${saved ? "saved" : ""}`}
          aria-label={saved ? "Remove from saved" : "Save scholarship"}
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
        >
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <button className="card-title" onClick={open}>
        {s.name}
      </button>
      <p className="card-desc">{s.description}</p>
      <div className="card-pills">
        {s.level.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      <div className="card-footer">
        <div>
          <span className="meta-label">AWARD AMOUNT</span>
          <strong className="amount">
            {formatMoney(s.amount)}
            <small> / year</small>
          </strong>
        </div>
        <div className="deadline">
          <span className="meta-label">DEADLINE</span>
          <strong>
            <CalendarDays size={14} />
            {formatDate(s.deadline)}
          </strong>
        </div>
      </div>
      <button className="card-link" onClick={open}>
        View details <ArrowRight size={15} />
      </button>
    </motion.article>
  );
}
export function Dashboard({
  profile,
  saved,
  apps,
  matches,
  open,
  go,
}: {
  profile: Profile;
  saved: string[];
  apps: Application[];
  matches: EligibilityMatch[];
  open: (s: Scholarship) => void;
  go: (p: Page) => void;
}) {
  const upcoming = [...scholarships]
    .filter((scholarship) => daysUntil(scholarship.deadline) >= 0)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 3);
  const recs = matches.slice(0, 3).map((match) => match.scholarship);
  const submitted = apps.filter((a) => a.status === "Submitted").length;
  return (
    <>
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="welcome-tag">
            <Sparkles size={13} /> YOUR SCHOLARSHIP JOURNEY
          </div>
          <h1>
            Good morning, {profile.name.split(" ")[0]} <span>✦</span>
          </h1>
          <p>
            Your next opportunity is closer than you think. Let’s find it
            together.
          </p>
          <button
            className="light-cta"
            onClick={() => go("Explore Scholarships")}
          >
            Explore scholarships <ArrowRight size={15} />
          </button>
        </div>
        <div className="banner-art">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-star">✳</div>
          <div className="art-cap">
            <GraduationCap size={56} />
          </div>
          <div className="art-sparkle">✦</div>
        </div>
        <div className="banner-foot">
          A LITTLE PROGRESS GOES A LONG WAY <span>✦</span>
        </div>
      </div>
      <div className="stats-grid">
        <Stat
          icon={<Search size={18} />}
          label="Opportunities for you"
          value={String(
            matches.filter((match) => match.eligible).length,
          ).padStart(2, "0")}
          detail="matched to your profile"
          tone="mint"
        />
        <Stat
          icon={<Bookmark size={18} />}
          label="Saved scholarships"
          value={String(saved.length).padStart(2, "0")}
          detail="ready when you are"
          tone="gold"
        />
        <Stat
          icon={<FileText size={18} />}
          label="Applications in progress"
          value={String(
            apps.filter((a) => a.status === "In Progress").length + submitted,
          ).padStart(2, "0")}
          detail={`${submitted} submitted`}
          tone="lavender"
        />
        <Stat
          icon={<Award size={18} />}
          label="Potential funding"
          value={formatMoney(
            matches.reduce(
              (sum, match) =>
                sum + (match.eligible ? match.scholarship.amount : 0),
              0,
            ),
          )}
          detail="across your matches"
          tone="blue"
        />
      </div>
      <div className="dashboard-grid">
        <section className="panel recommended-panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">HANDPICKED FOR YOU</div>
              <h2>Recommended scholarships</h2>
            </div>
            <button
              className="text-link"
              onClick={() => go("Explore Scholarships")}
            >
              See all <ArrowRight size={14} />
            </button>
          </div>
          <div className="recommend-list">
            {recs.map((s) => (
              <button
                className="recommend-row"
                key={s.id}
                onClick={() => open(s)}
                aria-label={`View ${s.name} details`}
              >
                <div
                  className="org-avatar small"
                  style={{ background: s.color }}
                >
                  {s.initials}
                </div>
                <div className="recommend-info">
                  <strong>{s.name}</strong>
                  <span>{s.provider}</span>
                </div>
                <div className="recommend-amount">
                  {formatMoney(s.amount)}
                  <span>per year</span>
                </div>
                <ChevronRight size={17} className="muted-icon" />
              </button>
            ))}
          </div>
        </section>
        <section className="panel deadlines-panel">
          <div className="section-head">
            <div>
              <div className="eyebrow">DON’T MISS OUT</div>
              <h2>Upcoming deadlines</h2>
            </div>
            <CalendarDays size={19} className="muted-icon" />
          </div>
          <div className="deadline-list">
            {upcoming.map((s, i) => (
              <button
                className="deadline-row"
                key={s.id}
                onClick={() => open(s)}
              >
                <div className={`date-badge date-${i}`}>
                  <span>
                    {new Date(`${s.deadline}T00:00:00`).toLocaleDateString(
                      "en-IN",
                      { month: "short" },
                    )}
                  </span>
                  <strong>
                    {new Date(`${s.deadline}T00:00:00`).getDate()}
                  </strong>
                </div>
                <div className="deadline-info">
                  <strong>{s.name}</strong>
                  <span>
                    {daysUntil(s.deadline)} days left <i />
                  </span>
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </section>
      </div>
      <section className="panel activity-panel">
        <div className="section-head">
          <div>
            <div className="eyebrow">YOUR PROGRESS</div>
            <h2>Recent application activity</h2>
          </div>
          <button className="text-link" onClick={() => go("My Applications")}>
            View applications <ArrowRight size={14} />
          </button>
        </div>
        {apps.length === 0 ? (
          <div className="empty-inline">
            Your application activity will appear here.
          </div>
        ) : (
          <div className="activity-list">
            {apps.slice(0, 4).map((a) => {
              const s = scholarships.find((x) => x.id === a.id)!;
              return (
                <div className="activity-row" key={a.id}>
                  <div
                    className={`activity-dot dot-${a.status.replace(/ /g, "-").toLowerCase()}`}
                  >
                    {a.status === "Submitted" ? (
                      <Check size={13} />
                    ) : (
                      <FileText size={13} />
                    )}
                  </div>
                  <div className="activity-copy">
                    <strong>{s.name}</strong>
                    <span>
                      {a.status === "Submitted"
                        ? "Application submitted"
                        : a.status === "In Progress"
                          ? "Application started"
                          : "Added to your list"}{" "}
                      · {formatDate(a.updated)}
                    </span>
                  </div>
                  <StatusBadge status={a.status} />
                  <ChevronRight size={15} className="muted-icon" />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
function Stat({
  icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div>
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        <span className="stat-detail">{detail}</span>
      </div>
    </div>
  );
}
export function Explore({
  query,
  setQuery,
  category,
  setCategory,
  level,
  setLevel,
  sort,
  setSort,
  amountFilter,
  setAmountFilter,
  scholarships: savedList,
  saved,
  open,
  toggleSave,
}: {
  query: string;
  setQuery: (s: string) => void;
  category: string;
  setCategory: (s: string) => void;
  level: string;
  setLevel: (s: string) => void;
  sort: string;
  setSort: (s: SortOrder) => void;
  amountFilter: AmountFilter;
  setAmountFilter: (s: AmountFilter) => void;
  scholarships: Scholarship[];
  saved: string[];
  open: (s: Scholarship) => void;
  toggleSave: (s: string) => void;
}) {
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);
  const categories = [
    "All",
    "Government",
    "Private",
    "Institutional",
    "Need-based",
    "Merit-based",
    "STEM",
  ];
  return (
    <>
      <Heading
        eyebrow="FIND YOUR FUNDING"
        title="Explore scholarships"
        sub="Discover funding that fits your ambitions, background, and next big step."
      />
      <div className="explore-search">
        <Search size={19} />
        <input
          aria-label="Search scholarships"
          ref={searchRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by scholarship, provider, or keyword..."
        />
        <kbd>⌘ K</kbd>
      </div>
      <div className="filter-toolbar">
        <div className="filter-group">
          <SlidersHorizontal size={16} />
          <span>Filter by</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Scholarship category"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            aria-label="Education level"
          >
            <option>All</option>
            <option>School</option>
            <option>Undergraduate</option>
            <option>Postgraduate</option>
          </select>
          <select
            value={amountFilter}
            onChange={(e) => setAmountFilter(e.target.value as AmountFilter)}
            aria-label="Award amount"
          >
            <option>Any amount</option>
            <option>Under ₹50,000</option>
            <option>₹50,000 – ₹1 lakh</option>
            <option>Above ₹1 lakh</option>
          </select>
        </div>
        <label className="sort-control">
          <ArrowDownUp size={15} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOrder)}
            aria-label="Sort scholarships"
          >
            <option value="deadline">Deadline soon</option>
            <option value="amount">Award amount</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>
      <div className="result-line">
        <span>
          <strong>{savedList.length}</strong> scholarships found
        </span>
        <span>Updated for 2026–27</span>
      </div>
      {savedList.length ? (
        <div className="scholarship-grid">
          {savedList.map((s) => (
            <ScholarshipCard
              key={s.id}
              s={s}
              saved={saved.includes(s.id)}
              open={() => open(s)}
              toggle={() => toggleSave(s.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search size={22} />}
          title="No scholarships found"
          text="Try adjusting your filters or search with different keywords."
        />
      )}
    </>
  );
}
export function Details({
  scholarship: s,
  saved,
  onSave,
  onBack,
  status,
  onStatus,
  notify,
  onCheckEligibility,
  onViewApplications,
}: {
  scholarship: Scholarship;
  saved: boolean;
  onSave: () => void;
  onBack: () => void;
  status: Status;
  onStatus: (s: Status) => void;
  notify: (s: string) => void;
  onCheckEligibility: () => void;
  onViewApplications: () => void;
}) {
  return (
    <>
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={15} /> Back to scholarships
      </button>
      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-hero">
            <div className="detail-org">
              <div className="org-avatar large" style={{ background: s.color }}>
                {s.initials}
              </div>
              <div>
                <span className="pill-type">{s.type} scholarship</span>
                <h1>{s.name}</h1>
                <p>{s.provider}</p>
              </div>
            </div>
            <div className="detail-award">
              <span>ANNUAL AWARD</span>
              <strong>{formatMoney(s.amount)}</strong>
            </div>
          </div>
          <nav
            className="detail-tabs"
            aria-label="Scholarship details sections"
          >
            <a className="active" href="#overview">
              Overview
            </a>
            <a href="#eligibility">Eligibility</a>
            <a href="#documents">Documents</a>
          </nav>
          <section className="detail-section" id="overview">
            <h2>About this scholarship</h2>
            <p>{s.description}</p>
          </section>
          <section className="detail-section" id="eligibility">
            <h2>Eligibility criteria</h2>
            <ul className="criteria-list">
              {s.criteria.map((x) => (
                <li key={x}>
                  <span className="check-mark">
                    <Check size={13} />
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </section>
          <section className="detail-section" id="documents">
            <h2>Required documents</h2>
            <div className="document-grid">
              {s.documents.map((x, i) => (
                <div className="document-item" key={x}>
                  <div className="doc-icon">
                    <FileText size={17} />
                  </div>
                  <span>{x}</span>
                  <span className="doc-number">0{i + 1}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        <aside className="detail-aside">
          <div className="panel apply-panel">
            <div className="aside-label">
              <Clock3 size={15} /> APPLICATION TIMELINE
            </div>
            <div className="deadline-callout">
              <span>Application deadline</span>
              <strong>{formatDate(s.deadline)}</strong>
              <em className={daysUntil(s.deadline) < 14 ? "urgent" : ""}>
                {daysUntil(s.deadline)} days remaining
              </em>
            </div>
            <div className="aside-fact">
              <span>Award amount</span>
              <strong>
                {formatMoney(s.amount)} <small>/ year</small>
              </strong>
            </div>
            <div className="aside-fact">
              <span>Study level</span>
              <strong>{s.level.join(", ")}</strong>
            </div>
            <div className="aside-fact">
              <span>Category</span>
              <strong>{s.category}</strong>
            </div>
            <button
              className="primary-btn full"
              onClick={() => {
                if (status === "Not Started" || status === "Rejected")
                  onStatus("In Progress");
                else if (status === "In Progress") onViewApplications();
                else notify(`Your application is ${status.toLowerCase()}`);
              }}
            >
              {status === "Submitted" || status === "Approved"
                ? "Application " + status
                : "Start application"}{" "}
              <ArrowRight size={16} />
            </button>
            <button
              className={`secondary-btn full ${saved ? "selected" : ""}`}
              onClick={onSave}
            >
              <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved to your list" : "Save scholarship"}
            </button>
            <div className="secure-note">
              <ShieldCheck size={15} /> Your information stays private and
              secure.
            </div>
          </div>
          <div className="aside-help">
            <div className="help-icon">
              <CircleHelp size={17} />
            </div>
            <div>
              <strong>Need help applying?</strong>
              <p>Check your eligibility before you apply.</p>
            </div>
            <button onClick={onCheckEligibility}>
              Check eligibility <ArrowRight size={14} />
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
export function Matching({
  profile,
  setProfile,
  done,
  setDone,
  matched,
  open,
}: {
  profile: Profile;
  setProfile: (p: Profile) => void;
  done: boolean;
  setDone: (b: boolean) => void;
  matched: EligibilityMatch[];
  open: (s: Scholarship) => void;
}) {
  const set = (k: keyof Profile, v: string | number) => {
    setProfile({ ...profile, [k]: v });
    setDone(false);
  };
  return (
    <>
      <Heading
        eyebrow="PERSONALIZED FOR YOU"
        title="Find your best fit"
        sub="A few details help us match you with scholarships you’re most likely to qualify for."
      />
      <div className="matching-layout">
        <form
          className="panel match-form"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <div className="form-section-head">
            <div className="form-step">01</div>
            <div>
              <h2>Your academic details</h2>
              <p>Tell us where you are in your education.</p>
            </div>
          </div>
          <div className="form-grid">
            <label>
              Education level
              <select
                value={profile.level}
                onChange={(e) => set("level", e.target.value)}
              >
                <option>School</option>
                <option>Undergraduate</option>
                <option>Postgraduate</option>
              </select>
            </label>
            <label>
              Course or field
              <input
                value={profile.course}
                onChange={(e) => set("course", e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
              />
            </label>
            <label>
              Current institution
              <input
                value={profile.institution}
                onChange={(e) => set("institution", e.target.value)}
                placeholder="Your college or school"
              />
            </label>
            <label>
              Previous exam marks (%)
              <input
                type="number"
                min="0"
                max="100"
                value={profile.marks}
                onChange={(e) => set("marks", Number(e.target.value))}
              />
            </label>
          </div>
          <div className="form-separator" />
          <div className="form-section-head">
            <div className="form-step">02</div>
            <div>
              <h2>Your background</h2>
              <p>This information helps find relevant opportunities.</p>
            </div>
          </div>
          <div className="form-grid">
            <label>
              Annual family income
              <input
                type="number"
                min="0"
                max="100000000"
                step="10000"
                value={profile.income}
                onChange={(e) => set("income", Number(e.target.value))}
                aria-label="Annual family income in rupees"
              />
            </label>
            <label>
              State of domicile
              <input
                value={profile.state}
                onChange={(e) => set("state", e.target.value)}
              />
            </label>
            <label>
              Category
              <select
                value={profile.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {["General", "OBC", "SC", "ST", "EWS", "Minority"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Gender
              <select
                value={profile.gender}
                onChange={(e) => set("gender", e.target.value)}
              >
                {["Prefer not to say", "Female", "Male", "Other"].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>
          <button className="primary-btn match-submit" type="submit">
            <Sparkles size={16} /> Find my matches <ArrowRight size={16} />
          </button>
        </form>
        <div className="match-side">
          <div className="match-note">
            <div className="note-icon">
              <ShieldCheck size={19} />
            </div>
            <strong>Your data stays yours</strong>
            <p>
              Your profile details are only used to calculate scholarship
              matches and are saved on this device.
            </p>
          </div>
          <div className="match-note criteria-note">
            <div className="note-icon gold-note">
              <Activity size={19} />
            </div>
            <strong>How matching works</strong>
            <p>
              We compare your education level, academic marks, family income and
              domicile against each scholarship’s criteria.
            </p>
          </div>
        </div>
      </div>
      {done && (
        <section className="match-results">
          <div className="section-head">
            <div>
              <div className="eyebrow">YOUR RESULTS</div>
              <h2>
                {matched.filter((x) => x.eligible).length} scholarships match
                your profile
              </h2>
            </div>
            <span className="match-personal">
              <Sparkles size={14} /> Based on your details
            </span>
          </div>
          <div className="match-result-grid">
            {matched.map(
              ({
                scholarship: s,
                percentage: score,
                missingCriteria: missing,
              }) => (
                <button
                  className="match-result"
                  key={s.id}
                  onClick={() => open(s)}
                >
                  <div className="match-result-head">
                    <div
                      className="org-avatar small"
                      style={{ background: s.color }}
                    >
                      {s.initials}
                    </div>
                    <span
                      className={`match-score ${score >= 75 ? "high" : ""}`}
                    >
                      {score}% match
                    </span>
                  </div>
                  <strong>{s.name}</strong>
                  <span className="result-provider">
                    {s.provider} · {formatMoney(s.amount)}
                  </span>
                  {missing.length ? (
                    <span className="missing-criteria">
                      Still needed: {missing.join(" · ")}
                    </span>
                  ) : (
                    <span className="perfect-fit">
                      <Check size={13} /> You meet all listed criteria
                    </span>
                  )}
                  <span className="result-view">
                    View details <ArrowRight size={14} />
                  </span>
                </button>
              ),
            )}
          </div>
        </section>
      )}
    </>
  );
}
export function Applications({
  apps,
  filter,
  setFilter,
  open,
  update,
}: {
  apps: Application[];
  filter: string;
  setFilter: (s: string) => void;
  open: (s: Scholarship) => void;
  update: (id: string, s: Status) => void;
}) {
  const filters = [
    "All",
    "Not Started",
    "In Progress",
    "Submitted",
    "Approved",
    "Rejected",
  ];
  const list = apps.filter((a) => filter === "All" || a.status === filter);
  return (
    <>
      <Heading
        eyebrow="KEEP IT MOVING"
        title="My applications"
        sub="Every application, one clear view. You’ve got this."
        action={
          <button
            className="primary-btn"
            onClick={() =>
              document
                .getElementById("application-list")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <FileText size={16} /> Track applications
          </button>
        }
      />
      <div className="application-summary">
        {(
          [
            "Not Started",
            "In Progress",
            "Submitted",
            "Approved",
            "Rejected",
          ] as Status[]
        ).map((s) => (
          <div key={s}>
            <span
              className={`summary-dot status-dot-${s.toLowerCase().replace(/ /g, "-")}`}
            />
            <span>{s}</span>
            <strong>{apps.filter((a) => a.status === s).length}</strong>
          </div>
        ))}
      </div>
      <div className="app-filter-row">
        <div className="tab-filters">
          {filters.map((x) => (
            <button
              key={x}
              className={filter === x ? "active" : ""}
              onClick={() => setFilter(x)}
            >
              {x}
              {x === "All" && <span>{apps.length}</span>}
            </button>
          ))}
        </div>
        <span className="result-count">{list.length} applications</span>
      </div>
      {list.length ? (
        <div
          className="application-table"
          id="application-list"
          role="table"
          aria-label="Scholarship applications"
        >
          <div className="table-head" role="row">
            <span role="columnheader">SCHOLARSHIP</span>
            <span role="columnheader">DEADLINE</span>
            <span role="columnheader">STATUS</span>
            <span role="columnheader">LAST UPDATED</span>
            <span role="columnheader">ACTION</span>
          </div>
          {list.map((a) => {
            const s = scholarships.find((x) => x.id === a.id)!;
            return (
              <div className="application-row" key={a.id} role="row">
                <button className="application-title" onClick={() => open(s)}>
                  <div
                    className="org-avatar small"
                    style={{ background: s.color }}
                  >
                    {s.initials}
                  </div>
                  <span>
                    <strong>{s.name}</strong>
                    <small>{s.provider}</small>
                  </span>
                </button>
                <div className="table-deadline" role="cell">
                  <strong>{formatDate(s.deadline)}</strong>
                  <small className={daysUntil(s.deadline) < 14 ? "urgent" : ""}>
                    {daysUntil(s.deadline)} days left
                  </small>
                </div>
                <div role="cell">
                  <StatusBadge status={a.status} />
                </div>
                <span className="updated-date" role="cell">
                  {formatDate(a.updated)}
                </span>
                <div role="cell">
                  <select
                    className="status-select"
                    value={a.status}
                    aria-label={`Update ${s.name} status`}
                    onChange={(e) => update(a.id, e.target.value as Status)}
                  >
                    {(
                      [
                        "Not Started",
                        "In Progress",
                        "Submitted",
                        "Approved",
                        "Rejected",
                      ] as Status[]
                    ).map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<FileText size={22} />}
          title="No applications here yet"
          text="Start an application from a scholarship details page to track your progress."
        />
      )}
    </>
  );
}
function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`status-badge status-${status.toLowerCase().replace(/ /g, "-")}`}
    >
      <i />
      {status}
    </span>
  );
}
export function Saved({
  saved,
  open,
  toggle,
  go,
}: {
  saved: string[];
  open: (s: Scholarship) => void;
  toggle: (s: string) => void;
  go: (p: Page) => void;
}) {
  const list = scholarships.filter((s) => saved.includes(s.id));
  return (
    <>
      <Heading
        eyebrow="YOUR SHORTLIST"
        title="Saved scholarships"
        sub="Good things take planning. Keep your favorites close."
        action={
          <button
            className="secondary-btn"
            onClick={() => go("Explore Scholarships")}
          >
            <Search size={16} /> Explore more
          </button>
        }
      />
      <div className="saved-intro">
        <div className="saved-heart">
          <Heart size={18} fill="currentColor" />
        </div>
        <div>
          <strong>{list.length} opportunities saved</strong>
          <span>Pick up where you left off whenever you’re ready.</span>
        </div>
      </div>
      {list.length ? (
        <div className="scholarship-grid">
          {list.map((s) => (
            <ScholarshipCard
              key={s.id}
              s={s}
              saved
              open={() => open(s)}
              toggle={() => toggle(s.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark size={22} />}
          title="Your shortlist is waiting"
          text="Save scholarships that catch your eye, and they’ll show up here."
          action={
            <button
              className="primary-btn"
              onClick={() => go("Explore Scholarships")}
            >
              Explore scholarships <ArrowRight size={15} />
            </button>
          }
        />
      )}
    </>
  );
}
export function ProfilePage({
  profile,
  setProfile,
  notify,
}: {
  profile: Profile;
  setProfile: (p: Profile) => void;
  notify: (s: string) => void;
}) {
  const [draft, setDraft] = useState(profile);
  const filledFields = Object.values(draft).filter((value) =>
    typeof value === "number" ? value > 0 : value.trim().length > 0,
  ).length;
  const completeness = Math.round(
    (filledFields / Object.keys(draft).length) * 100,
  );
  const change = (k: keyof Profile, v: string | number) =>
    setDraft({ ...draft, [k]: v });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(draft);
    notify("Your profile has been saved");
  };
  return (
    <>
      <Heading
        eyebrow="ABOUT YOU"
        title="My profile"
        sub="A little about you goes a long way toward finding the right support."
      />
      <form className="profile-layout" onSubmit={submit}>
        <div className="profile-main">
          <div className="panel profile-panel">
            <div className="profile-header">
              <div className="profile-large-avatar">
                {draft.name
                  .split(" ")
                  .map((x) => x[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <h2>{draft.name}</h2>
                <p>Student profile · Last updated just now</p>
              </div>
              <div className="profile-completion">
                <span>PROFILE</span>
                <strong>{completeness}%</strong>
              </div>
            </div>
            <div className="profile-section">
              <div className="section-head">
                <div>
                  <h3>Personal information</h3>
                  <p>Basic details to personalize your experience.</p>
                </div>
                <UserRound size={18} />
              </div>
              <div className="form-grid">
                <label>
                  Full name
                  <input
                    value={draft.name}
                    onChange={(e) => change("name", e.target.value)}
                    required
                  />
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(e) => change("email", e.target.value)}
                    required
                  />
                </label>
                <label>
                  Phone number
                  <input
                    value={draft.phone}
                    onChange={(e) => change("phone", e.target.value)}
                  />
                </label>
                <label>
                  City
                  <input
                    value={draft.city}
                    onChange={(e) => change("city", e.target.value)}
                  />
                </label>
                <label>
                  State of domicile
                  <input
                    value={draft.state}
                    onChange={(e) => change("state", e.target.value)}
                  />
                </label>
                <label>
                  Category
                  <select
                    value={draft.category}
                    onChange={(e) => change("category", e.target.value)}
                  >
                    {["General", "OBC", "SC", "ST", "EWS", "Minority"].map(
                      (x) => (
                        <option key={x}>{x}</option>
                      ),
                    )}
                  </select>
                </label>
              </div>
            </div>
            <div className="profile-section">
              <div className="section-head">
                <div>
                  <h3>Academic information</h3>
                  <p>Help us find opportunities that fit your journey.</p>
                </div>
                <GraduationCap size={19} />
              </div>
              <div className="form-grid">
                <label>
                  Education level
                  <select
                    value={draft.level}
                    onChange={(e) => change("level", e.target.value)}
                  >
                    <option>School</option>
                    <option>Undergraduate</option>
                    <option>Postgraduate</option>
                  </select>
                </label>
                <label>
                  Course or field
                  <input
                    value={draft.course}
                    onChange={(e) => change("course", e.target.value)}
                  />
                </label>
                <label>
                  Institution
                  <input
                    value={draft.institution}
                    onChange={(e) => change("institution", e.target.value)}
                  />
                </label>
                <label>
                  Previous marks (%)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={draft.marks}
                    onChange={(e) => change("marks", Number(e.target.value))}
                  />
                </label>
                <label>
                  Annual family income
                  <input
                    type="number"
                    min="0"
                    max="100000000"
                    step="10000"
                    value={draft.income}
                    onChange={(e) => change("income", Number(e.target.value))}
                    aria-label="Annual family income in rupees"
                  />
                </label>
              </div>
            </div>
            <div className="profile-save-row">
              <span>
                <ShieldCheck size={15} /> Your profile is stored securely on
                this device.
              </span>
              <button className="primary-btn" type="submit">
                <Check size={16} /> Save changes
              </button>
            </div>
          </div>
        </div>
        <aside className="profile-aside panel">
          <div className="aside-label">
            <Sparkles size={15} /> YOUR PROFILE
          </div>
          <h3>A stronger profile, better matches.</h3>
          <p>
            Keeping your academic and personal details up to date helps us find
            scholarships made for you.
          </p>
          <div className="completion-bar">
            <span style={{ width: `${completeness}%` }} />
          </div>
          <div className="completion-label">
            <span>Profile completeness</span>
            <strong>{completeness}%</strong>
          </div>
          <div className="profile-tip">
            <div className="note-icon">
              <Award size={17} />
            </div>
            <span>
              <strong>Pro tip</strong> Add your latest marks and family income
              to unlock more accurate eligibility matches.
            </span>
          </div>
        </aside>
      </form>
    </>
  );
}
function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
