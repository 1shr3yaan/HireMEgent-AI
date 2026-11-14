
import "./App.css";
import SpaceScene from "./SpaceScene";
import CrystalBubbles from "./components/CrystalBubbles";
import { useState, useEffect } from "react";
import Workspace from "./components/Workspace";

const API_BASE = "http://127.0.0.1:8000";

const tools = [
  {
    number: "01",
    icon: "▤",
    name: "Resume Intelligence",
    description:
      "Decode your resume. Discover your strengths and what recruiters actually see.",
    action: "ANALYZE RESUME",
    id: "resume",
    tag: "DOCUMENT AI",
  },
  {
    number: "02",
    icon: "✧",
    name: "AI Project Lab",
    description:
      "Turn your interests into impressive projects designed to build your portfolio.",
    action: "GENERATE PROJECTS",
    id: "skills",
    tag: "PROJECT INTELLIGENCE",
  },
  {
    number: "03",
    icon: "⌁",
    name: "Career Roadmap",
    description:
      "Transform your ambitions into a personalised, achievable career path.",
    action: "BUILD ROADMAP",
    id: "roadmap",
    tag: "CAREER PLANNING",
  },
  {
    number: "04",
    icon: "◎",
    name: "Job Matcher",
    description:
      "Discover how well your experience aligns with real job opportunities.",
    action: "MATCH A JOB",
    id: "jobs",
    tag: "OPPORTUNITY AI",
  },
  {
    number: "05",
    icon: "◇",
    name: "AI Interview Studio",
    description:
      "Practice interview scenarios and sharpen the way you communicate.",
    action: "START PRACTICE",
    id: "interview",
    tag: "INTERVIEW AI",
  },
  {
    number: "06",
    icon: "▣",
    name: "Application Tracker",
    description:
      "Keep every application, opportunity and milestone in one place.",
    action: "TRACK PROGRESS",
    id: "applications",
    tag: "CAREER MANAGEMENT",
  },
];

function readCareerMetrics() {
  try {
    return JSON.parse(
      localStorage.getItem("hiremegent_career_metrics") || "{}"
    );
  } catch {
    return {};
  }
}

function App() {
  const [activeTab, setActiveTab] = useState("overview");

  const [applicationStats, setApplicationStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  const [careerMetrics, setCareerMetrics] = useState(readCareerMetrics);

  // Refresh dashboard metrics when Workspace updates them.
  useEffect(() => {
    const refreshMetrics = () => {
      setCareerMetrics(readCareerMetrics());
    };

    window.addEventListener(
      "hiremegent-metrics-updated",
      refreshMetrics
    );

    window.addEventListener("storage", refreshMetrics);
    window.addEventListener("focus", refreshMetrics);

    return () => {
      window.removeEventListener(
        "hiremegent-metrics-updated",
        refreshMetrics
      );

      window.removeEventListener("storage", refreshMetrics);
      window.removeEventListener("focus", refreshMetrics);
    };
  }, []);

  useEffect(() => {
    setCareerMetrics(readCareerMetrics());
  }, [activeTab]);

  // Refresh application data when returning to the overview
  // or when the Application Tracker changes a record.
  useEffect(() => {
    let cancelled = false;

    const loadCareerOverview = async () => {
      setStatsLoading(true);
      setStatsError(false);

      try {
        const [statsResponse, applicationsResponse] =
          await Promise.all([
            fetch(`${API_BASE}/application-statistics`),
            fetch(`${API_BASE}/applications`),
          ]);

        if (!statsResponse.ok || !applicationsResponse.ok) {
          throw new Error("Unable to load career statistics");
        }

        const statsData = await statsResponse.json();
        const applicationsData = await applicationsResponse.json();

        if (cancelled) return;

        setApplicationStats(statsData);

        const applicationList = Array.isArray(applicationsData)
          ? applicationsData
          : applicationsData.applications ||
            applicationsData.data ||
            [];

        setApplications(applicationList);
      } catch (error) {
        if (!cancelled) {
          console.error("Career overview error:", error);
          setStatsError(true);
        }
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    };

    loadCareerOverview();

    const handleApplicationUpdate = () => {
      loadCareerOverview();
    };

    window.addEventListener(
      "hiremegent-applications-updated",
      handleApplicationUpdate
    );

    return () => {
      cancelled = true;

      window.removeEventListener(
        "hiremegent-applications-updated",
        handleApplicationUpdate
      );
    };
  }, [activeTab]);

  const getStat = (...keys) => {
    if (!applicationStats) return null;

    for (const key of keys) {
      const value = applicationStats[key];

      if (
        value !== undefined &&
        value !== null &&
        !isNaN(Number(value))
      ) {
        return Number(value);
      }
    }

    return null;
  };

  const totalApplications =
    getStat(
      "total_applications",
      "total",
      "application_count"
    ) ?? applications.length;

  const countStatus = (status) => {
    return applications.filter(
      (application) =>
        String(application.status || "").toLowerCase() ===
        status.toLowerCase()
    ).length;
  };

  const appliedCount = countStatus("Applied");
  const interviewCount = countStatus("Interview Scheduled");
  const selectedCount = countStatus("Selected");
  const assessmentCount = countStatus("Assessment");

  const activeApplications =
    totalApplications -
    countStatus("Rejected") -
    countStatus("Withdrawn");

  // Career metrics from local browser storage.
  const resumeScore = careerMetrics.resumeScore;
  const skillsIdentified = careerMetrics.skillsIdentified;
  const jobMatches = Number(careerMetrics.jobMatches) || 0;

  const hasResumeScore =
    resumeScore !== null &&
    resumeScore !== undefined &&
    Number.isFinite(Number(resumeScore));

  const hasSkills =
    skillsIdentified !== null &&
    skillsIdentified !== undefined &&
    Number.isFinite(Number(skillsIdentified));

  const successRate =
    totalApplications > 0
      ? Math.round((selectedCount / totalApplications) * 100)
      : 0;

  return (
    <div className="app-container">
      <CrystalBubbles />
      <SpaceScene />

      <div className="dashboard-enter">
        {/* TOP NAVIGATION */}
        <header className="top-navigation">
          <a
            href="#dashboard"
            className="brand"
            onClick={() => setActiveTab("overview")}
          >
            <span className="brand-symbol">✳</span>
            <span>
              HireMEgent<span className="brand-ai">.AI</span>
            </span>
          </a>

          <nav className="top-nav-links">
            <a
              href="#dashboard"
              className={
                activeTab === "overview" ? "top-nav-active" : ""
              }
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </a>

            <a
              href="#workflow"
              onClick={() => setActiveTab("overview")}
            >
              How it works
            </a>

            <a
              href="#toolkit"
              onClick={() => setActiveTab("overview")}
            >
              AI Toolkit
            </a>

            <a
              href="#progress"
              onClick={() => setActiveTab("overview")}
            >
              Your progress
            </a>
          </nav>

          <div className="nav-right">
            <span className="system-status">
              <span className="status-dot"></span>
              ALL SYSTEMS NORMAL
            </span>

            <div className="profile-avatar">H</div>
          </div>
        </header>

        {activeTab !== "overview" && (
          <Workspace
            activeTab={activeTab}
            onBack={() => setActiveTab("overview")}
          />
        )}

        {activeTab === "overview" && (
          <main className="main-content" id="dashboard">
            {/* HERO */}
            <section className="hero">
              <div className="hero-aurora"></div>
              <div className="hero-grid"></div>
              <div className="moon"></div>
              <div className="moonlight"></div>

              <div className="hero-left">
                <div className="hero-tag">
                  <span className="hero-tag-dot"></span>
                  YOUR PERSONAL AI CAREER COMPANION
                </div>

                <h1>
                  Your next chapter
                  <br />
                  starts <span>with you.</span>
                </h1>

                <p className="hero-description">
                  More than a career platform. Your intelligent
                  companion to discovering potential, building
                  skills and finding opportunities that move you
                  forward.
                </p>

                <div className="hero-actions">
                  <a href="#toolkit" className="primary-btn">
                    Explore your universe <span>↗</span>
                  </a>

                  <a href="#workflow" className="secondary-btn">
                    Discover how it works <span>→</span>
                  </a>
                </div>

                <div className="hero-footnote">
                  <span>01 / YOUR CAREER INTELLIGENCE</span>
                  <span>POWERED BY LOCAL AI</span>
                </div>
              </div>

              {/* CAREER WORKFLOW VISUAL */}
              <div className="hero-visual">
                <div className="visual-orbit orbit-one"></div>
                <div className="visual-orbit orbit-two"></div>

                <div className="visual-core">
                  <span>✳</span>
                  <small>AI CORE</small>
                </div>

                <div className="floating-node node-resume">
                  <span>▤</span>
                  <div>
                    <small>01 / INPUT</small>
                    <strong>Resume</strong>
                  </div>
                  <i>✓</i>
                </div>

                <div className="floating-node node-skills">
                  <span>✧</span>
                  <div>
                    <small>02 / CREATION</small>
                    <strong>Project Lab</strong>
                  </div>
                  <i>✓</i>
                </div>

                <div className="floating-node node-match">
                  <span>◎</span>
                  <div>
                    <small>03 / DISCOVERY</small>
                    <strong>Job Match</strong>
                  </div>
                  <i>↗</i>
                </div>

                <div className="floating-node node-future">
                  <span>◇</span>
                  <div>
                    <small>04 / NEXT STEP</small>
                    <strong>Your future</strong>
                  </div>
                  <i>✦</i>
                </div>

                <div className="visual-coordinate">
                  <span>CAREER ENGINE</span>
                  <span>ACTIVE / 001</span>
                </div>
              </div>
            </section>

            {/* WORKFLOW */}
            <section className="workflow-section" id="workflow">
              <div className="section-heading">
                <div>
                  <p className="section-label">
                    NOT JUST ANOTHER DASHBOARD
                  </p>

                  <h2>
                    Your career. <em>Connected.</em>
                  </h2>
                </div>

                <span className="section-index">SYSTEM / 001</span>
              </div>

              <div className="workflow-panel">
                <div className="workflow-intro">
                  <span className="mini-label">
                    THE HIREMEGENT ENGINE
                  </span>

                  <h3>
                    Everything works
                    <br />
                    towards <em>one goal.</em>
                  </h3>

                  <p>
                    Six intelligent tools. One connected career
                    journey. Every insight helps you take your
                    next step.
                  </p>
                </div>

                <div className="workflow-steps">
                  <div className="workflow-step">
                    <span>01</span>
                    <div className="workflow-icon">▤</div>
                    <strong>Resume</strong>
                    <small>Understand</small>
                  </div>

                  <div className="workflow-connector"></div>

                  <div className="workflow-step">
                    <span>02</span>
                    <div className="workflow-icon">✧</div>
                    <strong>Project Lab</strong>
                    <small>Create</small>
                  </div>

                  <div className="workflow-connector"></div>

                  <div className="workflow-step">
                    <span>03</span>
                    <div className="workflow-icon">⌁</div>
                    <strong>Roadmap</strong>
                    <small>Develop</small>
                  </div>

                  <div className="workflow-connector"></div>

                  <div className="workflow-step">
                    <span>04</span>
                    <div className="workflow-icon">◎</div>
                    <strong>Opportunities</strong>
                    <small>Connect</small>
                  </div>
                </div>

                <div className="workflow-bottom">
                  <span>
                    <span className="status-dot"></span>
                    INTELLIGENCE NETWORK ONLINE
                  </span>

                  <span>ONE JOURNEY. SIX INTELLIGENT TOOLS.</span>
                </div>
              </div>
            </section>

            {/* CAREER OVERVIEW */}
            <section className="progress-section" id="progress">
              <div className="section-heading">
                <div>
                  <p className="section-label">
                    YOUR PERSONAL INTELLIGENCE
                  </p>

                  <h2>Career overview</h2>
                </div>

                <span className="live-indicator">
                  ● {statsLoading ? "SYNCING DATA" : "LIVE SYSTEM"}
                </span>
              </div>

              <div className="stats-grid">
                {/* RESUME SCORE */}
                <div className="stat-card">
                  <div className="stat-top">
                    <span>RESUME SCORE</span>
                    <span>◉</span>
                  </div>

                  <h3>
                    {hasResumeScore
                      ? Number(resumeScore)
                      : "--"}
                    <small>/100</small>
                  </h3>

                  <p>
                    {hasResumeScore
                      ? "Your latest resume analysis score"
                      : "Analyze your resume to unlock your score"}
                  </p>

                  <div className="stat-line">
                    <span
                      style={{
                        width: hasResumeScore
                          ? `${Math.min(
                              100,
                              Math.max(0, Number(resumeScore))
                            )}%`
                          : "0%",
                      }}
                    ></span>
                  </div>
                </div>

                {/* SKILLS IDENTIFIED */}
                <div className="stat-card">
                  <div className="stat-top">
                    <span>SKILLS IDENTIFIED</span>
                    <span>✧</span>
                  </div>

                  <h3>
                    {hasSkills ? Number(skillsIdentified) : "--"}
                  </h3>

                  <p>
                    {hasSkills
                      ? "Skills extracted from your resume"
                      : "Complete resume analysis to discover skills"}
                  </p>

                  <div className="stat-line">
                    <span
                      style={{
                        width: hasSkills
                          ? `${Math.min(
                              100,
                              Number(skillsIdentified) * 5
                            )}%`
                          : "0%",
                      }}
                    ></span>
                  </div>
                </div>

                {/* ACTIVE APPLICATIONS */}
                <div className="stat-card">
                  <div className="stat-top">
                    <span>ACTIVE APPLICATIONS</span>
                    <span>◎</span>
                  </div>

                  <h3>
                    {statsLoading
                      ? "..."
                      : statsError
                      ? "--"
                      : activeApplications}
                  </h3>

                  <p>
                    {statsError
                      ? "Backend connection unavailable"
                      : `${interviewCount} interviews · ${assessmentCount} assessments`}
                  </p>

                  <div className="stat-line">
                    <span></span>
                  </div>
                </div>

                {/* TOTAL APPLICATIONS */}
                <div className="stat-card">
                  <div className="stat-top">
                    <span>TOTAL APPLICATIONS</span>
                    <span>↗</span>
                  </div>

                  <h3>
                    {statsLoading
                      ? "..."
                      : statsError
                      ? "--"
                      : totalApplications}
                  </h3>

                  <p>
                    {statsError
                      ? "Could not retrieve application data"
                      : `${selectedCount} selected · ${appliedCount} applied`}
                  </p>

                  <div className="stat-line">
                    <span></span>
                  </div>
                </div>
              </div>

              {/* ADDITIONAL CAREER INTELLIGENCE */}
              <div className="stats-grid career-extra-grid">
                <div className="stat-card">
                  <div className="stat-top">
                    <span>JOB MATCHES</span>
                    <span>⌕</span>
                  </div>

                  <h3>{jobMatches}</h3>

                  <p>
                    Successful job description analyses
                  </p>

                  <div className="stat-line">
                    <span
                      style={{
                        width: `${Math.min(jobMatches * 10, 100)}%`,
                      }}
                    ></span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>APPLICATION SUCCESS RATE</span>
                    <span>✦</span>
                  </div>

                  <h3>
                    {statsLoading || statsError
                      ? "--"
                      : `${successRate}%`}
                  </h3>

                  <p>
                    {totalApplications > 0
                      ? `${selectedCount} selected out of ${totalApplications} applications`
                      : "Add applications to calculate your success rate"}
                  </p>

                  <div className="stat-line">
                    <span
                      style={{
                        width: `${successRate}%`,
                      }}
                    ></span>
                  </div>
                </div>
              </div>

              <div className="career-overview-footer">
                <span>
                  {statsLoading
                    ? "CONNECTING TO YOUR CAREER DATABASE..."
                    : statsError
                    ? "CAREER DATABASE OFFLINE — START YOUR BACKEND TO SYNC"
                    : `${applications.length} APPLICATION RECORDS RETRIEVED`}
                </span>

                <button
                  className="overview-action"
                  onClick={() => setActiveTab("applications")}
                >
                  OPEN APPLICATION TRACKER ↗
                </button>
              </div>
            </section>

            {/* AI TOOLKIT */}
            <section className="toolkit-section" id="toolkit">
              <div className="section-heading">
                <div>
                  <p className="section-label">
                    EXPLORE YOUR POTENTIAL
                  </p>

                  <h2>
                    Your AI <em>universe.</em>
                  </h2>
                </div>

                <span className="section-index">06 MODULES</span>
              </div>

              <div className="tools-grid">
                {tools.map((tool) => (
                  <a
                    className="tool-card"
                    href={`#${tool.id}`}
                    key={tool.number}
                    onClick={(event) => {
                      event.preventDefault();
                      setActiveTab(tool.id);
                    }}
                  >
                    <div className="tool-card-top">
                      <span>
                        {tool.number} / {tool.tag}
                      </span>

                      <span className="tool-arrow">↗</span>
                    </div>

                    <div className="tool-icon">{tool.icon}</div>

                    <h3>{tool.name}</h3>
                    <p>{tool.description}</p>

                    <div className="tool-card-action">
                      {tool.action} <span>↗</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
              <div>
                <strong>
                  HireMEgent<span>.AI</span>
                </strong>

                <p>YOUR CAREER. YOUR UNIVERSE.</p>
              </div>

              <span className="creator-credit">
                DESIGNED & BUILT BY 1SH6YAAN
              </span>
            </footer>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
