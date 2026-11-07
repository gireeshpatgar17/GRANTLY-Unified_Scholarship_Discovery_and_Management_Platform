import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Bookmark,
  ChevronRight,
  CircleHelp,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import {
  Dashboard,
  Details,
  Explore,
  Matching,
  Applications,
  Saved,
  ProfilePage,
} from "./Pages";
import {
  initialApplications,
  initialProfile,
  initialSavedIds,
  scholarships,
} from "./data/scholarships";
import { filterScholarships, matchScholarships } from "./domain/scholarships";
import {
  isApplicationList,
  isProfile,
  isSavedScholarshipList,
  sanitizeProfile,
  STORAGE_KEYS,
} from "./lib/storage";
import { usePersistentState } from "./hooks/usePersistentState";
import type {
  AmountFilter,
  Page,
  Scholarship,
  SortOrder,
  Status,
} from "./types";
import "./styles.css";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Explore Scholarships", icon: Search },
  { label: "Eligibility Matching", icon: Sparkles },
  { label: "My Applications", icon: FileText },
  { label: "Saved Scholarships", icon: Bookmark },
] as const satisfies ReadonlyArray<{
  label: Page;
  icon: typeof LayoutDashboard;
}>;

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function App() {
  const [page, setPage] = useState<Page>("Dashboard");
  const [profile, setProfile] = usePersistentState(
    STORAGE_KEYS.profile,
    initialProfile,
    isProfile,
  );
  const [saved, setSaved] = usePersistentState(
    STORAGE_KEYS.saved,
    initialSavedIds,
    isSavedScholarshipList,
  );
  const [applications, setApplications] = usePersistentState(
    STORAGE_KEYS.applications,
    initialApplications,
    isApplicationList,
  );
  const [selected, setSelected] = useState<Scholarship | null>(null);
  const [toast, setToast] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [sort, setSort] = useState<SortOrder>("deadline");
  const [amountFilter, setAmountFilter] = useState<AmountFilter>("Any amount");
  const [matchDone, setMatchDone] = useState(false);
  const [applicationFilter, setApplicationFilter] = useState("All");
  const toastTimer = useRef<number | undefined>(undefined);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current !== undefined)
      window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2800);
  }, []);

  useEffect(
    () => () => {
      if (toastTimer.current !== undefined)
        window.clearTimeout(toastTimer.current);
    },
    [],
  );

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const changePage = useCallback((nextPage: Page) => {
    setPage(nextPage);
    setSelected(null);
    setMobileOpen(false);
  }, []);

  const openScholarship = useCallback((scholarship: Scholarship) => {
    setSelected(scholarship);
  }, []);

  const updateProfile = useCallback(
    (nextProfile: typeof profile) => {
      setProfile(sanitizeProfile(nextProfile));
    },
    [setProfile],
  );

  const toggleSaved = useCallback(
    (id: string) => {
      const isSaved = saved.includes(id);
      setSaved((current) =>
        current.includes(id)
          ? current.filter((savedId) => savedId !== id)
          : [...current, id],
      );
      notify(isSaved ? "Removed from saved scholarships" : "Scholarship saved");
    },
    [notify, saved, setSaved],
  );

  const updateApplication = useCallback(
    (id: string, status: Status) => {
      if (!scholarships.some((scholarship) => scholarship.id === id)) {
        notify("Scholarship could not be found");
        return;
      }
      const updated = new Date().toISOString().slice(0, 10);
      setApplications((current) => {
        const existing = current.some((application) => application.id === id);
        return existing
          ? current.map((application) =>
              application.id === id
                ? { ...application, status, updated }
                : application,
            )
          : [...current, { id, status, updated }];
      });
      notify("Application status updated");
    },
    [notify, setApplications],
  );

  const filteredScholarships = useMemo(
    () =>
      filterScholarships(scholarships, {
        query,
        category,
        level,
        amount: amountFilter,
        sort,
      }),
    [amountFilter, category, level, query, sort],
  );
  const eligibilityMatches = useMemo(
    () => matchScholarships(scholarships, profile),
    [profile],
  );
  const applicationFor = (id: string) =>
    applications.find((application) => application.id === id);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      {mobileOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`sidebar ${mobileOpen ? "open" : ""}`}
        aria-label="GRANTLY workspace"
      >
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <GraduationCap size={21} />
          </div>
          <span>GRANTLY</span>
          <button
            className="icon-btn mobile-close"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav aria-label="Primary navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${page === label ? "active" : ""}`}
              aria-current={page === label ? "page" : undefined}
              onClick={() => changePage(label)}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
              {label === "Saved Scholarships" && saved.length > 0 && (
                <span
                  className="nav-count"
                  aria-label={`${saved.length} saved scholarships`}
                >
                  {saved.length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon" aria-hidden="true">
              <CircleHelp size={17} />
            </div>
            <strong>Need a hand?</strong>
            <p>Check the scholarships that fit your profile.</p>
            <button onClick={() => changePage("Eligibility Matching")}>
              Check eligibility <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>
          <button
            className={`nav-item ${page === "My Profile" ? "active" : ""}`}
            aria-current={page === "My Profile" ? "page" : undefined}
            onClick={() => changePage("My Profile")}
          >
            <UserRound size={18} aria-hidden="true" />
            <span>My Profile</span>
          </button>
          <div className="user-mini">
            <div className="avatar" aria-hidden="true">
              {initials(profile.name)}
            </div>
            <div className="user-info">
              <strong>{profile.name}</strong>
              <span>Student account</span>
            </div>
            <button
              className="icon-btn"
              aria-label="Edit account profile"
              onClick={() => changePage("My Profile")}
            >
              <Settings size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-area" id="main-content" tabIndex={-1}>
        <header className="topbar">
          <button
            className="icon-btn menu-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="main-content"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <div className="breadcrumb" aria-label="Current page">
            <span>Workspace</span>
            <ChevronRight size={14} aria-hidden="true" />
            <span>{selected ? "Scholarship details" : page}</span>
          </div>
          <div className="top-actions">
            <button
              className="icon-btn notification"
              aria-label="Show notifications"
              onClick={() => notify("You’re all caught up")}
            >
              <Bell size={18} aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
            <div
              className="top-avatar"
              aria-label={`Signed in as ${profile.name}`}
            >
              {initials(profile.name)}
            </div>
          </div>
        </header>

        <div className="page-content">
          {selected ? (
            <Details
              scholarship={selected}
              saved={saved.includes(selected.id)}
              onSave={() => toggleSaved(selected.id)}
              onBack={() => setSelected(null)}
              status={applicationFor(selected.id)?.status ?? "Not Started"}
              onStatus={(status) => updateApplication(selected.id, status)}
              onCheckEligibility={() => changePage("Eligibility Matching")}
              onViewApplications={() => changePage("My Applications")}
              notify={notify}
            />
          ) : page === "Dashboard" ? (
            <Dashboard
              profile={profile}
              saved={saved}
              apps={applications}
              matches={eligibilityMatches}
              open={openScholarship}
              go={changePage}
            />
          ) : page === "Explore Scholarships" ? (
            <Explore
              query={query}
              setQuery={setQuery}
              category={category}
              setCategory={setCategory}
              level={level}
              setLevel={setLevel}
              sort={sort}
              setSort={setSort}
              amountFilter={amountFilter}
              setAmountFilter={setAmountFilter}
              scholarships={filteredScholarships}
              saved={saved}
              open={openScholarship}
              toggleSave={toggleSaved}
            />
          ) : page === "Eligibility Matching" ? (
            <Matching
              profile={profile}
              setProfile={updateProfile}
              done={matchDone}
              setDone={setMatchDone}
              matched={eligibilityMatches}
              open={openScholarship}
            />
          ) : page === "My Applications" ? (
            <Applications
              apps={applications}
              filter={applicationFilter}
              setFilter={setApplicationFilter}
              open={openScholarship}
              update={updateApplication}
            />
          ) : page === "Saved Scholarships" ? (
            <Saved
              saved={saved}
              open={openScholarship}
              toggle={toggleSaved}
              go={changePage}
            />
          ) : (
            <ProfilePage
              profile={profile}
              setProfile={updateProfile}
              notify={notify}
            />
          )}
        </div>
      </main>
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="toast"
          >
            <span className="toast-check" aria-hidden="true">
              ✓
            </span>
            {toast}
          </motion.div>
        )}
      </div>
    </div>
  );
}
