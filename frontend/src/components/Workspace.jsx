
import { useState, useEffect } from "react";
import "./Workspace.css";
const API = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const RESUME_STORAGE_KEY = "hiremegent_resume_text";

function formatInline(text) {
  const parts = text.split(
    /(\*\*.*?\*\*|__.*?__|`.*?`|\*.*?\*|_.*?_)/g
  );

  return parts.map((part, index) => {
    if (
      (part.startsWith("**") && part.endsWith("**")) ||
      (part.startsWith("__") && part.endsWith("__"))
    ) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (
      (part.startsWith("*") && part.endsWith("*")) ||
      (part.startsWith("_") && part.endsWith("_"))
    ) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }

    return part;
  });
}

function FormattedResponse({ content }) {
  if (!content) return null;

  const lines = String(content)
    .replace(/\r\n?/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .split("\n");

  const blocks = [];
  let paragraph = [];
  let list = [];
  let listType = "";
  let code = [];
  let inCode = false;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(
        <p key={`p-${blocks.length}`}>
          {formatInline(paragraph.join(" "))}
        </p>
      );
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length) {
      const Tag = listType === "ordered" ? "ol" : "ul";

      blocks.push(
        <Tag key={`list-${blocks.length}`}>
          {list.map((item, index) => (
            <li key={index}>{formatInline(item)}</li>
          ))}
        </Tag>
      );

      list = [];
      listType = "";
    }
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (line.startsWith("```")) {
      flushParagraph();
      flushList();

      if (inCode) {
        blocks.push(
          <pre key={`code-${index}`}>
            <code>{code.join("\n")}</code>
          </pre>
        );
        code = [];
        inCode = false;
      } else {
        inCode = true;
      }

      return;
    }

    if (inCode) {
      code.push(rawLine);
      return;
    }

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);

    if (heading) {
      flushParagraph();
      flushList();

      const Tag = `h${heading[1].length}`;

      blocks.push(
        <Tag key={`heading-${index}`}>
          {formatInline(heading[2])}
        </Tag>
      );
      return;
    }

    if (/^[-*•]\s+/.test(line)) {
      flushParagraph();

      if (listType !== "unordered") {
        flushList();
        listType = "unordered";
      }

      list.push(line.replace(/^[-*•]\s+/, ""));
      return;
    }

    if (/^\d+[.)]\s+/.test(line)) {
      flushParagraph();

      if (listType !== "ordered") {
        flushList();
        listType = "ordered";
      }

      list.push(line.replace(/^\d+[.)]\s+/, ""));
      return;
    }

    if (line.startsWith(">")) {
      flushParagraph();
      flushList();

      blocks.push(
        <blockquote key={`quote-${index}`}>
          {formatInline(line.replace(/^>\s?/, ""))}
        </blockquote>
      );
      return;
    }

    flushList();
    paragraph.push(line);
  });

  flushParagraph();
  flushList();

  if (inCode && code.length) {
    blocks.push(
      <pre key="unfinished-code">
        <code>{code.join("\n")}</code>
      </pre>
    );
  }

  return (
    <div className="formatted-response">
      {blocks}
    </div>
  );
}


const workspaceData = {
  resume: {
    number: "01",
    title: "Resume Intelligence",
    subtitle: "Your experience, decoded.",
    description:
      "Upload your resume and let AI uncover your strengths, weaknesses and opportunities.",
    tag: "DOCUMENT AI",
  },
  skills: {
    number: "02",
    title: "AI Project Lab",
    subtitle: "Imagine it. Engineer it. Launch it.",
    description:
      "Transform your career ambitions into original, recruiter-ready portfolio projects.",
    tag: "PROJECT GENERATION AI",
  },
  roadmap: {
    number: "03",
    title: "Career Roadmap",
    subtitle: "Your future needs a direction.",
    description:
      "Build a personalised learning path towards your dream career.",
    tag: "CAREER PLANNING",
  },
  jobs: {
    number: "04",
    title: "Job Matcher",
    subtitle: "Find where you belong.",
    description:
      "Compare your resume against a job description and discover your suitability.",
    tag: "OPPORTUNITY AI",
  },
  interview: {
    number: "05",
    title: "AI Interview Studio",
    subtitle: "Practice. Improve. Stand out.",
    description:
      "Generate realistic interview questions and receive feedback on your answers.",
    tag: "INTERVIEW AI",
  },
  applications: {
    number: "06",
    title: "Application Tracker",
    subtitle: "Every opportunity. One command centre.",
    description:
      "Organise your applications and monitor your career progress.",
    tag: "CAREER MANAGEMENT",
  },
};

const roles = [
  "AI Engineer",
  "Software Engineer",
  "Full Stack Developer",
  "Data Scientist",
];

const statuses = [
  "Applied",
  "Assessment",
  "Interview Scheduled",
  "Selected",
  "Rejected",
  "Withdrawn",
];

const loadingConfig = {
  resume: {
    title: "DOCUMENT INTELLIGENCE",
    subtitle: "Reading the signals behind your experience.",
    stages: [
      "Scanning document architecture...",
      "Extracting professional signals...",
      "Decoding your experience...",
      "Constructing your intelligence report...",
    ],
  },
  skills: {
    title: "PROJECT CONSTRUCTION ENGINE",
    subtitle: "Turning raw ideas into buildable concepts.",
    stages: [
      "Initialising project construction engine...",
      "Exploring your career profile...",
      "Architecting original project concepts...",
      "Synchronising technology stacks...",
      "Finalising your project blueprints...",
    ],
  },
  roadmap: {
    title: "CAREER NAVIGATION SYSTEM",
    subtitle: "Connecting your current position to your destination.",
    stages: [
      "Mapping your career destination...",
      "Calculating learning pathways...",
      "Structuring your development phases...",
      "Building your career blueprint...",
    ],
  },
  jobs: {
    title: "OPPORTUNITY MATCH ENGINE",
    subtitle: "Comparing your experience with the opportunity.",
    stages: [
      "Scanning job requirements...",
      "Decoding your professional profile...",
      "Synchronising experience with requirements...",
      "Calculating your compatibility...",
    ],
  },
  interview: {
    title: "INTERVIEW SIMULATION CORE",
    subtitle: "Preparing a realistic interview experience.",
    stages: [
      "Activating interview simulation...",
      "Constructing realistic scenarios...",
      "Calibrating evaluation criteria...",
      "Preparing your interview session...",
    ],
  },
  applications: {
    title: "APPLICATION COMMAND CENTRE",
    subtitle: "Synchronising your career activity.",
    stages: [
      "Connecting to application database...",
      "Synchronising opportunity records...",
      "Updating career intelligence...",
      "Finalising your command centre...",
    ],
  },
};

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API}${endpoint}`, options);
  let data = {};

  try {
    data = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      data.detail || data.message || "Something went wrong."
    );
  }

  return data;
}

function postJSON(endpoint, body) {
  return apiRequest(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getSavedCareerMetrics() {
  try {
    return JSON.parse(
      localStorage.getItem("hiremegent_career_metrics") || "{}"
    );
  } catch {
    return {};
  }
}

function saveCareerMetrics(updates) {
  const previous = getSavedCareerMetrics();
  const updated = { ...previous, ...updates };

  localStorage.setItem(
    "hiremegent_career_metrics",
    JSON.stringify(updated)
  );

  window.dispatchEvent(
    new Event("hiremegent-metrics-updated")
  );
}

function getStoredResume() {
  try {
    return localStorage.getItem(RESUME_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

const SKILL_DICTIONARY = [
  "Python", "Java", "JavaScript", "TypeScript", "C", "C++", "C#",
  "HTML", "CSS", "React", "Next.js", "Node.js", "Express",
  "FastAPI", "Django", "Flask", "Angular", "Vue.js",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Firebase",
  "Machine Learning", "Deep Learning", "Artificial Intelligence",
  "Natural Language Processing", "Computer Vision", "TensorFlow",
  "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Matplotlib",
  "Data Analysis", "Data Visualization", "Power BI", "Tableau",
  "Excel", "Statistics", "Data Science",
  "Git", "GitHub", "Docker", "Kubernetes", "AWS", "Azure",
  "Google Cloud", "Linux", "REST API", "GraphQL",
  "Figma", "UI Design", "UX Design", "Responsive Design",
  "Cybersecurity", "Networking", "Operating Systems",
  "OOP", "Data Structures", "Algorithms",
  "Communication", "Leadership", "Problem Solving",
  "Teamwork", "Project Management", "Critical Thinking",
  "Agile", "Scrum", "Blockchain", "Solidity",
  "Prompt Engineering", "Generative AI", "LLMs",
];

function cleanSkillName(skill) {
  return skill
    .replace(/^[\s\-*•\d.)]+/, "")
    .replace(/[;|]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueSkills(skills) {
  const unique = new Map();

  skills.forEach((skill) => {
    const cleaned = cleanSkillName(skill);

    if (
      cleaned.length > 1 &&
      cleaned.length < 65 &&
      !/^(and|or|the|with|including|other|etc)$/i.test(cleaned)
    ) {
      const key = cleaned.toLowerCase();

      if (!unique.has(key)) {
        unique.set(key, cleaned);
      }
    }
  });

  return [...unique.values()];
}

function extractSkillsFromReport(analysis) {
  const lines = analysis.split(/\r?\n/);
  const skills = [];

  const headingPattern =
    /^\s{0,5}#{0,3}\s*(technical\s+skills|key\s+skills|skills\s+identified|skills|core\s+competencies|technologies|technical\s+proficiencies|tech\s+stack)\s*:?\s*$/i;

  const stopHeadingPattern =
    /^\s{0,5}#{0,3}\s*(summary|strengths|weaknesses|recommendations|experience|education|projects|certifications|improvements|conclusion|overall\s+assessment)\s*:?\s*$/i;

  let insideSkillsSection = false;

  for (const line of lines) {
    if (headingPattern.test(line)) {
      insideSkillsSection = true;
      continue;
    }

    if (insideSkillsSection && stopHeadingPattern.test(line)) {
      break;
    }

    if (insideSkillsSection) {
      const cleaned = cleanSkillName(line);
      if (!cleaned) continue;

      skills.push(
        ...cleaned
          .split(/[,;•|]/)
          .map(cleanSkillName)
          .filter(Boolean)
      );
    }
  }

  if (skills.length === 0) {
    const inlineMatch = analysis.match(
      /(?:technical\s+skills|key\s+skills|skills\s+identified|core\s+competencies|technologies|tech\s+stack)\s*:\s*([^\n]+)/i
    );

    if (inlineMatch) {
      skills.push(
        ...inlineMatch[1]
          .split(/[,;•|]/)
          .map(cleanSkillName)
          .filter(Boolean)
      );
    }
  }

  return uniqueSkills(skills);
}

function extractSkillsFromResume(resumeText) {
  const found = [];

  for (const skill of SKILL_DICTIONARY) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const pattern = new RegExp(
      `(^|[^a-zA-Z0-9+#.])${escaped}($|[^a-zA-Z0-9+#.])`,
      "i"
    );

    if (pattern.test(resumeText)) {
      found.push(skill);
    }
  }

  return uniqueSkills(found);
}

function calculateResumeScore(resumeText) {
  const text = resumeText || "";
  const lower = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);

  let score = 0;

  const sections = [
    { pattern: /\b(email|e-mail|@)\b/i, points: 5 },
    { pattern: /\b(education|university|college|degree|bachelor|master)\b/i, points: 6 },
    { pattern: /\b(experience|employment|internship|work history)\b/i, points: 7 },
    { pattern: /\b(projects|personal projects|academic projects)\b/i, points: 7 },
    { pattern: /\b(skills|technical skills|competencies|technologies)\b/i, points: 6 },
    { pattern: /\b(summary|objective|profile|about me)\b/i, points: 5 },
  ];

  sections.forEach(({ pattern, points }) => {
    if (pattern.test(text)) score += points;
  });

  const detectedSkills = extractSkillsFromResume(text);
  score += Math.min(20, detectedSkills.length * 2);

  const evidenceCount = [
    /\b(intern|internship|worked|developed|built|created|designed)\b/i,
    /\b(implemented|managed|led|deployed|maintained|engineered)\b/i,
    /\b(project|application|platform|system|website|software)\b/i,
  ].filter((pattern) => pattern.test(text)).length;

  score += evidenceCount * 5;

  const numberEvidence = text.match(
    /\b\d+(?:\.\d+)?\s*(%|percent|users|customers|projects|hours|days|weeks|months|years|x)\b/gi
  ) || [];

  score += Math.min(15, numberEvidence.length * 3);

  if (words.length >= 100) score += 3;
  if (words.length >= 250) score += 3;
  if (words.length >= 400) score += 3;
  if (words.length >= 600) score += 2;

  const actionVerbs = [
    "developed", "built", "created", "designed", "implemented",
    "analysed", "analyzed", "improved", "optimised", "optimized",
    "managed", "led", "delivered", "deployed",
  ];

  const actionVerbCount = actionVerbs.filter((verb) =>
    lower.includes(verb)
  ).length;

  score += Math.min(3, actionVerbCount);

  return Math.max(0, Math.min(100, Math.round(score)));
}

function extractResumeMetrics(resumeText, analysis) {
  const reportSkills = extractSkillsFromReport(analysis || "");
  const resumeSkills = extractSkillsFromResume(resumeText || "");
  const allSkills = uniqueSkills([
    ...reportSkills,
    ...resumeSkills,
  ]);

  return {
    resumeScore: calculateResumeScore(resumeText),
    skillsIdentified: allSkills.length,
  };
}

function LoadingVisual({ module }) {
  if (module === "resume") {
    return (
      <div className="loader-visual resume-visual">
        <div className="resume-scan-frame">
          <div className="resume-doc">
            <span className="doc-heading" />
            <span />
            <span />
            <span className="doc-short" />
            <span />
            <span className="doc-heading" />
            <span />
            <span className="doc-short" />
            <i className="document-scan-line" />
          </div>
          <div className="scan-corner scan-corner-one" />
          <div className="scan-corner scan-corner-two" />
          <div className="scan-corner scan-corner-three" />
          <div className="scan-corner scan-corner-four" />
        </div>
        <span className="visual-caption">SCANNING DOCUMENT</span>
      </div>
    );
  }

  if (module === "skills") {
    return (
      <div className="loader-visual project-visual">
        <div className="project-orbit orbit-one" />
        <div className="project-orbit orbit-two" />
        <div className="project-orbit orbit-three" />
        <div className="project-core">✳</div>
        <div className="project-particle particle-one" />
        <div className="project-particle particle-two" />
        <div className="project-particle particle-three" />
        <span className="visual-caption">CONSTRUCTING BLUEPRINT</span>
      </div>
    );
  }

  if (module === "roadmap") {
    return (
      <div className="loader-visual roadmap-visual">
        <div className="roadmap-path">
          <span className="roadmap-node node-one" />
          <span className="roadmap-node node-two" />
          <span className="roadmap-node node-three" />
          <span className="roadmap-node node-four" />
          <span className="roadmap-node node-five" />
          <i className="roadmap-traveller" />
        </div>
        <span className="visual-caption">MAPPING YOUR NEXT MOVE</span>
      </div>
    );
  }

  if (module === "jobs") {
    return (
      <div className="loader-visual matcher-visual">
        <div className="matcher-ring matcher-ring-one" />
        <div className="matcher-ring matcher-ring-two" />
        <div className="matcher-crosshair" />
        <div className="matcher-signal signal-one" />
        <div className="matcher-signal signal-two" />
        <div className="matcher-signal signal-three" />
        <div className="matcher-center">↔</div>
        <span className="visual-caption">SYNCHRONISING PROFILES</span>
      </div>
    );
  }

  if (module === "interview") {
    return (
      <div className="loader-visual interview-visual">
        <div className="voice-bars">
          {Array.from({ length: 25 }).map((_, index) => (
            <span key={index} style={{ "--bar-index": index }} />
          ))}
        </div>
        <div className="voice-orbit" />
        <span className="visual-caption">CALIBRATING INTERVIEW</span>
      </div>
    );
  }

  return (
    <div className="loader-visual application-visual">
      <div className="radar-sweep" />
      <div className="radar-ring radar-ring-one" />
      <div className="radar-ring radar-ring-two" />
      <div className="radar-ring radar-ring-three" />
      <span className="radar-dot radar-dot-one" />
      <span className="radar-dot radar-dot-two" />
      <span className="radar-dot radar-dot-three" />
      <span className="radar-center">✳</span>
      <span className="visual-caption">SYNCING OPPORTUNITIES</span>
    </div>
  );
}

export default function Workspace({ activeTab, onBack }) {
  const [selectedFile, setSelectedFile] = useState(null);

  // Resume is restored whenever Workspace mounts.
  const [resumeText, setResumeText] = useState(getStoredResume);
  const [jobResume, setJobResume] = useState(getStoredResume);

  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [analysis, setAnalysis] = useState("");
  const [resumeMetrics, setResumeMetrics] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);

  const [projectRole, setProjectRole] = useState("Full Stack Developer");
  const [projectLevel, setProjectLevel] = useState("Intermediate");
  const [projectInterests, setProjectInterests] = useState("");
  const [projectCount, setProjectCount] = useState(3);
  const [projects, setProjects] = useState("");

  const [roadmapRole, setRoadmapRole] = useState("Software Engineer");
  const [currentLevel, setCurrentLevel] = useState("Beginner");
  const [missingSkills, setMissingSkills] = useState("");
  const [roadmap, setRoadmap] = useState("");

  const [jobDescription, setJobDescription] = useState("");
  const [jobResults, setJobResults] = useState("");

  const [interviewRole, setInterviewRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [questionType, setQuestionType] = useState("Mixed");
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState("");
  const [interviewQuestion, setInterviewQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState("");

  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState(null);

  const [applicationForm, setApplicationForm] = useState({
    company_name: "",
    job_role: "",
    application_link: "",
    status: "Applied",
    notes: "",
  });

  const current = workspaceData[activeTab];
  const currentLoading =
    loadingConfig[activeTab] || loadingConfig.resume;

  // Keep the shared resume saved and synchronised.
  useEffect(() => {
    if (!resumeText.trim()) return;

    try {
      localStorage.setItem(RESUME_STORAGE_KEY, resumeText);
      setJobResume(resumeText);
    } catch (err) {
      console.error("Resume storage error:", err);
      setError("Could not save your resume in browser storage.");
    }
  }, [resumeText]);

  // Restore saved resume when returning to the Job Matcher.
  useEffect(() => {
    const savedResume = getStoredResume();

    if (savedResume.trim()) {
      setResumeText(savedResume);
      setJobResume(savedResume);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!loading) return undefined;

    const timer = setInterval(() => {
      setElapsed((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  const activeLoadingStage =
    currentLoading.stages[
      Math.floor(elapsed / 4) % currentLoading.stages.length
    ];

  async function runTask(task) {
    setLoading(true);
    setElapsed(0);
    setError("");

    try {
      await task();
    } catch (err) {
      setError(
        err.message || "Unable to complete your request."
      );
    } finally {
      setLoading(false);
    }
  }

  // MODULE 01 - RESUME UPLOAD
  async function uploadResume() {
    if (!selectedFile) {
      setError("Please select your resume first.");
      return;
    }

    await runTask(async () => {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const data = await apiRequest("/upload-resume", {
        method: "POST",
        body: formData,
      });

      const extractedText = data.extracted_text;

      if (!extractedText || !extractedText.trim()) {
        throw new Error(
          "No readable text was found in this resume."
        );
      }

      try {
        localStorage.setItem(
          RESUME_STORAGE_KEY,
          extractedText
        );
      } catch {
        throw new Error(
          "Could not save your resume. Browser storage may be full or disabled."
        );
      }

      setResumeText(extractedText);
      setJobResume(extractedText);
      setAnalysis("");
      setResumeMetrics(null);
      setJobResults("");
      setError("");
    });
  }

  async function analyzeResume() {
    if (!resumeText.trim()) {
      setError("Upload your resume first.");
      return;
    }

    if (!targetRole.trim()) {
      setError("Enter your target job role.");
      return;
    }

    await runTask(async () => {
      const data = await postJSON("/analyze-resume", {
        resume_text: resumeText,
        target_role: targetRole,
      });

      const report =
        data.analysis || "No analysis returned.";

      setAnalysis(report);

      const metrics = extractResumeMetrics(
        resumeText,
        report
      );

      setResumeMetrics(metrics);

      saveCareerMetrics({
        resumeScore: metrics.resumeScore,
        skillsIdentified: metrics.skillsIdentified,
        lastResumeAnalysis: new Date().toISOString(),
      });
    });
  }

  // MODULE 02 - AI PROJECT LAB
  async function generateProjects() {
    const savedResume = getStoredResume();

    if (!projectInterests.trim() && !savedResume.trim()) {
      setError(
        "Enter your project interests or upload your resume first."
      );
      return;
    }

    await runTask(async () => {
      const data = await postJSON("/generate-projects", {
        target_role: projectRole,
        experience_level: projectLevel,
        interests: projectInterests,
        resume_text: savedResume || resumeText,
        number_of_projects: Number(projectCount),
      });

      setProjects(
        data.projects || "No projects were generated."
      );
    });
  }

  // MODULE 03 - CAREER ROADMAP
  async function generateRoadmap() {
    const skills = missingSkills
      .split(/[,;\n]/)
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      setError(
        "Enter the skills or technologies you want to learn."
      );
      return;
    }

    await runTask(async () => {
      const data = await postJSON("/generate-roadmap", {
        target_role: roadmapRole,
        missing_skills: skills,
        current_level: currentLevel,
      });

      setRoadmap(
        data.roadmap || "No roadmap returned."
      );
    });
  }

  // MODULE 04 - JOB MATCHER
  async function matchJob() {
    // Read from storage first: this survives component remounts.
    const savedResume = getStoredResume();

    const resumeToUse =
      jobResume.trim() ||
      resumeText.trim() ||
      savedResume.trim();

    if (!resumeToUse) {
      setError(
        "No resume found. Upload your resume in Resume Intelligence first."
      );
      return;
    }

    if (!jobDescription.trim()) {
      setError("Paste the job description first.");
      return;
    }

    // Synchronise state before sending the request.
    setJobResume(resumeToUse);
    setResumeText(resumeToUse);

    await runTask(async () => {
      const data = await postJSON("/match-job", {
        resume_text: resumeToUse,
        job_description: jobDescription,
      });

      const report =
        data.analysis || "No matching analysis returned.";

      setJobResults(report);

      const previous = getSavedCareerMetrics();
      const previousCount =
        Number(previous.jobMatches) || 0;

      saveCareerMetrics({
        jobMatches: previousCount + 1,
        lastJobMatch: new Date().toISOString(),
      });
    });
  }

  // MODULE 05 - INTERVIEW STUDIO
  async function generateInterview() {
    await runTask(async () => {
      const data = await postJSON("/generate-interview", {
        target_role: interviewRole,
        difficulty,
        question_type: questionType,
        number_of_questions: Number(questionCount),
      });

      setQuestions(
        data.questions || "No questions returned."
      );

      setEvaluation("");
      setInterviewQuestion("");
      setUserAnswer("");
    });
  }

  async function evaluateAnswer() {
    if (!interviewQuestion.trim()) {
      setError("Enter or select an interview question.");
      return;
    }

    if (!userAnswer.trim()) {
      setError(
        "Write your answer before requesting feedback."
      );
      return;
    }

    await runTask(async () => {
      const data = await postJSON("/evaluate-answer", {
        target_role: interviewRole,
        question: interviewQuestion,
        user_answer: userAnswer,
      });

      setEvaluation(
        data.evaluation || "No evaluation returned."
      );
    });
  }

  // MODULE 06 - APPLICATION TRACKER
  async function loadApplications() {
    try {
      const [applicationData, statsData] =
        await Promise.all([
          apiRequest("/applications"),
          apiRequest("/application-statistics"),
        ]);

      const applicationList = Array.isArray(applicationData)
        ? applicationData
        : applicationData.applications ||
          applicationData.data ||
          [];

      setApplications(applicationList);
      setStatistics(statsData);
    } catch (err) {
      setError(
        err.message || "Could not load applications."
      );
    }
  }

  useEffect(() => {
    if (activeTab === "applications") {
      loadApplications();
    }
  }, [activeTab]);

  async function addApplication(event) {
    event.preventDefault();

    if (
      !applicationForm.company_name.trim() ||
      !applicationForm.job_role.trim()
    ) {
      setError(
        "Company name and job role are required."
      );
      return;
    }

    await runTask(async () => {
      await postJSON("/applications", applicationForm);

      setApplicationForm({
        company_name: "",
        job_role: "",
        application_link: "",
        status: "Applied",
        notes: "",
      });

      await loadApplications();

      window.dispatchEvent(
        new Event("hiremegent-applications-updated")
      );
    });
  }

  async function updateStatus(id, status) {
    await runTask(async () => {
      await apiRequest(`/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      await loadApplications();

      window.dispatchEvent(
        new Event("hiremegent-applications-updated")
      );
    });
  }

  async function deleteApplication(id) {
    if (
      !window.confirm(
        "Delete this application permanently?"
      )
    ) {
      return;
    }

    await runTask(async () => {
      await apiRequest(`/applications/${id}`, {
        method: "DELETE",
      });

      await loadApplications();

      window.dispatchEvent(
        new Event("hiremegent-applications-updated")
      );
    });
  }

  if (!current) return null;

  return (
    <section className="workspace-page">
      <div className="workspace-glow" />

      <button
        className="workspace-back"
        onClick={onBack}
      >
        ← BACK TO OVERVIEW
      </button>

      <div className="workspace-heading">
        <span className="workspace-tag">
          MODULE {current.number} / {current.tag}
        </span>

        <h1>
          {current.title}<span>.</span>
        </h1>

        <h2>{current.subtitle}</h2>
        <p>{current.description}</p>
      </div>

      <div className="workspace-panel">
        <div className="workspace-panel-top">
          <span>✳ HIREMEGENT INTELLIGENCE</span>
          <span className="workspace-live">
            <i /> SYSTEM READY
          </span>
        </div>

        <div className="module-workspace">
          {error && (
            <div className="module-error">
              {error}
              <button onClick={() => setError("")}>
                ×
              </button>
            </div>
          )}

          {loading && (
            <div
              className={`analysis-loader loader-${activeTab}`}
              aria-live="polite"
              aria-busy="true"
            >
              <div className="loader-topline">
                <span>HIREMEGENT / LIVE PROCESS</span>
                <span className="loader-live-dot">
                  ● LIVE
                </span>
              </div>

              <LoadingVisual module={activeTab} />

              <div className="loader-copy">
                <span className="loader-module-number">
                  MODULE {current.number}
                </span>

                <h3>{currentLoading.title}</h3>

                <p
                  className="loading-stage"
                  key={activeLoadingStage}
                >
                  {activeLoadingStage}
                </p>

                <p className="loading-subtext">
                  {currentLoading.subtitle}
                </p>
              </div>

              <div className="loading-progress-track">
                <div className="loading-progress-bar" />
              </div>

              <div className="loader-footer">
                <span>PROCESSING REQUEST</span>

                <span className="loading-timer">
                  {String(
                    Math.floor(elapsed / 60)
                  ).padStart(2, "0")}
                  :
                  {String(elapsed % 60).padStart(2, "0")}
                </span>

                <span>LOCAL AI ENGINE</span>
              </div>
            </div>
          )}

          {/* MODULE 01: RESUME INTELLIGENCE */}
          {activeTab === "resume" && (
            <div className="module-content">
              <div className="module-intro">
                <span>01 / DOCUMENT ANALYSIS</span>
                <h2>
                  Decode your professional identity.
                </h2>
                <p>
                  Upload your resume to receive a detailed
                  recruiter-style evaluation.
                </p>
              </div>

              <label className="upload-button">
                SELECT RESUME
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(event) => {
                    setSelectedFile(
                      event.target.files?.[0] || null
                    );
                    setError("");
                    setAnalysis("");
                    setResumeMetrics(null);
                  }}
                />
              </label>

              {selectedFile && (
                <p className="selected-file">
                  ▤ {selectedFile.name}
                </p>
              )}

              <button
                className="upload-button"
                onClick={uploadResume}
                disabled={loading || !selectedFile}
              >
                {loading
                  ? "PROCESSING..."
                  : "UPLOAD TO AI ENGINE"}
              </button>

              {resumeText && (
                <div className="module-result">
                  <h3>
                    RESUME TEXT EXTRACTED ✓
                  </h3>

                  <p className="resume-preview">
                    {resumeText.slice(0, 1500)}
                  </p>

                  <p className="module-note">
                    ✓ RESUME SAVED AND CONNECTED TO YOUR
                    OTHER MODULES
                  </p>

                  <label className="module-label">
                    TARGET JOB ROLE
                  </label>

                  <input
                    className="module-input"
                    value={targetRole}
                    onChange={(event) =>
                      setTargetRole(event.target.value)
                    }
                    placeholder="e.g. Software Engineer"
                    disabled={loading}
                  />

                  <button
                    className="upload-button"
                    onClick={analyzeResume}
                    disabled={loading}
                  >
                    ✳ ANALYZE MY RESUME
                  </button>
                </div>
              )}

              {analysis && (
                <div className="module-result">
                  <h3>
                    ✳ YOUR RESUME INTELLIGENCE
                  </h3>

                  {resumeMetrics && (
                    <div className="resume-metrics-summary">
                      <div>
                        <strong>
                          {resumeMetrics.resumeScore}/100
                        </strong>
                        <span>
                          ESTIMATED RESUME SCORE
                        </span>
                      </div>

                      <div>
                        <strong>
                          {resumeMetrics.skillsIdentified}
                        </strong>
                        <span>SKILLS DETECTED</span>
                      </div>

                      <p>
                        Local resume-content estimate.
                        This is a guidance metric, not a
                        certified recruiter score.
                      </p>
                    </div>
                  )}

                  <div className="analysis-content">
                    <FormattedResponse content={analysis} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE 02: AI PROJECT LAB */}
          {activeTab === "skills" && (
            <div className="module-content">
              <div className="module-intro">
                <span>
                  02 / PROJECT GENERATION ENGINE
                </span>

                <h2>
                  Imagine it. Engineer it. Launch it.
                </h2>

                <p>
                  Generate original portfolio projects
                  designed around your career ambitions and
                  experience.
                </p>
              </div>

              <label className="module-label">
                TARGET CAREER
              </label>

              <select
                className="module-input"
                value={projectRole}
                onChange={(event) =>
                  setProjectRole(event.target.value)
                }
                disabled={loading}
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>

              <label className="module-label">
                EXPERIENCE LEVEL
              </label>

              <select
                className="module-input"
                value={projectLevel}
                onChange={(event) =>
                  setProjectLevel(event.target.value)
                }
                disabled={loading}
              >
                {["Beginner", "Intermediate", "Advanced"].map(
                  (level) => (
                    <option key={level}>{level}</option>
                  )
                )}
              </select>

              <label className="module-label">
                PROJECT INTERESTS
              </label>

              <textarea
                className="module-textarea"
                value={projectInterests}
                onChange={(event) =>
                  setProjectInterests(event.target.value)
                }
                placeholder="AI, futuristic web applications, automation, robotics, cybersecurity..."
                rows={5}
                disabled={loading}
              />

              <label className="module-label">
                NUMBER OF PROJECTS
              </label>

              <select
                className="module-input"
                value={projectCount}
                onChange={(event) =>
                  setProjectCount(Number(event.target.value))
                }
                disabled={loading}
              >
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={count}>
                    {count} PROJECT{count > 1 ? "S" : ""}
                  </option>
                ))}
              </select>

              <div className="project-resume-info">
                <span>
                  ✳ RESUME INTELLIGENCE CONNECTION
                </span>

                <p>
                  {getStoredResume().trim()
                    ? "✓ Uploaded resume will be used to personalise your project ideas."
                    : "No resume connected. You can still generate projects using your interests."}
                </p>
              </div>

              <button
                className="upload-button"
                onClick={generateProjects}
                disabled={loading}
              >
                ✳ INITIALISE PROJECT GENERATION
              </button>

              {projects && (
                <div className="module-result project-results">
                  <span className="module-label">
                    PROJECT LAB / GENERATION COMPLETE
                  </span>

                  <h3>YOUR NEXT BIG BUILDS</h3>

                  <div className="analysis-content">
                    <FormattedResponse content={projects} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE 03: CAREER ROADMAP */}
          {activeTab === "roadmap" && (
            <div className="module-content">
              <div className="module-intro">
                <span>03 / CAREER PLANNING</span>
                <h2>
                  Turn your ambition into a plan.
                </h2>
                <p>
                  Generate a structured learning roadmap
                  based on your career goals.
                </p>
              </div>

              <label className="module-label">
                TARGET CAREER
              </label>

              <select
                className="module-input"
                value={roadmapRole}
                onChange={(event) =>
                  setRoadmapRole(event.target.value)
                }
                disabled={loading}
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>

              <label className="module-label">
                YOUR CURRENT LEVEL
              </label>

              <select
                className="module-input"
                value={currentLevel}
                onChange={(event) =>
                  setCurrentLevel(event.target.value)
                }
                disabled={loading}
              >
                {["Beginner", "Intermediate", "Advanced"].map(
                  (level) => (
                    <option key={level}>{level}</option>
                  )
                )}
              </select>

              <label className="module-label">
                SKILLS YOU WANT TO DEVELOP
              </label>

              <textarea
                className="module-textarea"
                value={missingSkills}
                onChange={(event) =>
                  setMissingSkills(event.target.value)
                }
                placeholder="Python, Machine Learning, SQL..."
                rows={4}
                disabled={loading}
              />

              <button
                className="upload-button"
                onClick={generateRoadmap}
                disabled={loading}
              >
                ✳ GENERATE MY ROADMAP
              </button>

              {roadmap && (
                <div className="module-result">
                  <h3>
                    YOUR PERSONALIZED CAREER ROADMAP
                  </h3>

                  <div className="analysis-content">
                    <FormattedResponse content={roadmap} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE 04: JOB MATCHER */}
          {activeTab === "jobs" && (
            <div className="module-content">
              <div className="module-intro">
                <span>
                  04 / OPPORTUNITY INTELLIGENCE
                </span>

                <h2>Find your professional fit.</h2>

                <p>
                  Compare your experience against the
                  requirements of a job.
                </p>
              </div>

              <div className="project-resume-info">
                <span>✳ RESUME CONNECTION STATUS</span>

                <p>
                  {getStoredResume().trim()
                    ? "✓ RESUME DETECTED — YOUR UPLOADED RESUME IS READY."
                    : "NO SAVED RESUME — UPLOAD ONE IN RESUME INTELLIGENCE OR PASTE IT BELOW."}
                </p>
              </div>

              <label className="module-label">
                YOUR RESUME
              </label>

              <textarea
                className="module-textarea"
                value={jobResume}
                onChange={(event) => {
                  const value = event.target.value;
                  setJobResume(value);

                  if (value.trim()) {
                    try {
                      localStorage.setItem(
                        RESUME_STORAGE_KEY,
                        value
                      );
                      setResumeText(value);
                    } catch (err) {
                      setError(
                        "Could not save resume text in browser storage."
                      );
                    }
                  }
                }}
                placeholder="Your uploaded resume will appear here automatically. You can also paste your resume text here..."
                rows={7}
                disabled={loading}
              />

              <label className="module-label">
                JOB DESCRIPTION
              </label>

              <textarea
                className="module-textarea"
                value={jobDescription}
                onChange={(event) =>
                  setJobDescription(event.target.value)
                }
                placeholder="Paste the complete job description here..."
                rows={8}
                disabled={loading}
              />

              <button
                className="upload-button"
                onClick={matchJob}
                disabled={loading}
              >
                ✳ MATCH MY PROFILE
              </button>

              {jobResults && (
                <div className="module-result">
                  <h3>YOUR JOB MATCH ANALYSIS</h3>

                  <div className="analysis-content">
                    <FormattedResponse content={jobResults} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE 05: INTERVIEW STUDIO */}
          {activeTab === "interview" && (
            <div className="module-content">
              <div className="module-intro">
                <span>05 / INTERVIEW SIMULATOR</span>
                <h2>Train for the real thing.</h2>
                <p>
                  Generate interview questions and evaluate
                  your answers.
                </p>
              </div>

              <label className="module-label">
                TARGET ROLE
              </label>

              <select
                className="module-input"
                value={interviewRole}
                onChange={(event) =>
                  setInterviewRole(event.target.value)
                }
                disabled={loading}
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>

              <label className="module-label">
                DIFFICULTY
              </label>

              <select
                className="module-input"
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(event.target.value)
                }
                disabled={loading}
              >
                {["Beginner", "Intermediate", "Advanced"].map(
                  (level) => (
                    <option key={level}>{level}</option>
                  )
                )}
              </select>

              <label className="module-label">
                QUESTION TYPE
              </label>

              <select
                className="module-input"
                value={questionType}
                onChange={(event) =>
                  setQuestionType(event.target.value)
                }
                disabled={loading}
              >
                {[
                  "Mixed",
                  "Technical",
                  "Behavioural",
                  "Conceptual",
                ].map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <label className="module-label">
                NUMBER OF QUESTIONS
              </label>

              <select
                className="module-input"
                value={questionCount}
                onChange={(event) =>
                  setQuestionCount(Number(event.target.value))
                }
                disabled={loading}
              >
                {[3, 5, 10, 15, 20].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>

              <button
                className="upload-button"
                onClick={generateInterview}
                disabled={loading}
              >
                ✳ GENERATE INTERVIEW
              </button>

              {questions && (
                <div className="module-result">
                  <h3>YOUR INTERVIEW QUESTIONS</h3>

                  <div className="analysis-content">
                    <FormattedResponse content={questions} />
                  </div>
                </div>
              )}

              <div className="interview-evaluation">
                <h3>ANSWER EVALUATOR</h3>

                <label className="module-label">
                  INTERVIEW QUESTION
                </label>

                <textarea
                  className="module-textarea"
                  value={interviewQuestion}
                  onChange={(event) =>
                    setInterviewQuestion(event.target.value)
                  }
                  placeholder="Paste one interview question here..."
                  rows={3}
                  disabled={loading}
                />

                <label className="module-label">
                  YOUR ANSWER
                </label>

                <textarea
                  className="module-textarea"
                  value={userAnswer}
                  onChange={(event) =>
                    setUserAnswer(event.target.value)
                  }
                  placeholder="Write your answer as if you were in a real interview..."
                  rows={6}
                  disabled={loading}
                />

                <button
                  className="upload-button"
                  onClick={evaluateAnswer}
                  disabled={loading}
                >
                  ✳ EVALUATE MY ANSWER
                </button>

                {evaluation && (
                  <div className="module-result">
                    <h3>YOUR INTERVIEW FEEDBACK</h3>

                    <div className="analysis-content">
                      <FormattedResponse content={evaluation} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODULE 06: APPLICATION TRACKER */}
          {activeTab === "applications" && (
            <div className="module-content">
              <div className="module-intro">
                <span>06 / CAREER MANAGEMENT</span>
                <h2>Your opportunities, organised.</h2>
                <p>
                  Track every application from submission to
                  final decision.
                </p>
              </div>

              {statistics && (
                <div className="stats-grid">
                  <div className="stat-card">
                    <strong>
                      {statistics.total_applications}
                    </strong>
                    <span>TOTAL</span>
                  </div>

                  <div className="stat-card">
                    <strong>{statistics.applied}</strong>
                    <span>APPLIED</span>
                  </div>

                  <div className="stat-card">
                    <strong>{statistics.interviews}</strong>
                    <span>INTERVIEWS</span>
                  </div>

                  <div className="stat-card">
                    <strong>{statistics.selected}</strong>
                    <span>SELECTED</span>
                  </div>
                </div>
              )}

              <form
                className="application-form"
                onSubmit={addApplication}
              >
                <h3>＋ ADD APPLICATION</h3>

                <label className="module-label">
                  COMPANY NAME *
                </label>

                <input
                  className="module-input"
                  value={applicationForm.company_name}
                  onChange={(event) =>
                    setApplicationForm({
                      ...applicationForm,
                      company_name: event.target.value,
                    })
                  }
                  placeholder="e.g. Google"
                  disabled={loading}
                />

                <label className="module-label">
                  JOB ROLE *
                </label>

                <input
                  className="module-input"
                  value={applicationForm.job_role}
                  onChange={(event) =>
                    setApplicationForm({
                      ...applicationForm,
                      job_role: event.target.value,
                    })
                  }
                  placeholder="e.g. Software Engineering Intern"
                  disabled={loading}
                />

                <label className="module-label">
                  APPLICATION LINK
                </label>

                <input
                  className="module-input"
                  type="url"
                  value={applicationForm.application_link}
                  onChange={(event) =>
                    setApplicationForm({
                      ...applicationForm,
                      application_link: event.target.value,
                    })
                  }
                  placeholder="https://..."
                  disabled={loading}
                />

                <label className="module-label">
                  STATUS
                </label>

                <select
                  className="module-input"
                  value={applicationForm.status}
                  onChange={(event) =>
                    setApplicationForm({
                      ...applicationForm,
                      status: event.target.value,
                    })
                  }
                  disabled={loading}
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>

                <label className="module-label">
                  NOTES
                </label>

                <textarea
                  className="module-textarea"
                  value={applicationForm.notes}
                  onChange={(event) =>
                    setApplicationForm({
                      ...applicationForm,
                      notes: event.target.value,
                    })
                  }
                  placeholder="Recruiter details, deadlines, reminders..."
                  rows={3}
                  disabled={loading}
                />

                <button
                  className="upload-button"
                  type="submit"
                  disabled={loading}
                >
                  ＋ SAVE APPLICATION
                </button>
              </form>

              <div className="application-list">
                <div className="application-list-heading">
                  <h3>YOUR APPLICATIONS</h3>

                  <button
                    className="secondary-module-button"
                    onClick={() => runTask(loadApplications)}
                    disabled={loading}
                  >
                    ↻ REFRESH
                  </button>
                </div>

                {applications.length === 0 ? (
                  <p className="module-note">
                    No applications yet. Add your first
                    opportunity above.
                  </p>
                ) : (
                  applications.map((application) => (
                    <div
                      className="application-card"
                      key={application.id}
                    >
                      <div className="application-card-top">
                        <div>
                          <h4>
                            {application.company_name}
                          </h4>
                          <p>{application.job_role}</p>
                        </div>

                        <button
                          className="delete-application"
                          onClick={() =>
                            deleteApplication(application.id)
                          }
                          title="Delete application"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </div>

                      <p className="application-date">
                        Applied: {application.application_date}
                      </p>

                      <label className="module-label">
                        UPDATE STATUS
                      </label>

                      <select
                        className="module-input"
                        value={application.status}
                        onChange={(event) =>
                          updateStatus(
                            application.id,
                            event.target.value
                          )
                        }
                        disabled={loading}
                      >
                        {statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>

                      {application.application_link && (
                        <a
                          className="application-link"
                          href={application.application_link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          OPEN APPLICATION ↗
                        </a>
                      )}

                      {application.notes && (
                        <p className="application-notes">
                          {application.notes}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="workspace-panel-bottom">
          <span>BY 1SH6YAAN</span>
          <span>
            CAREER ENGINE / {current.number}
          </span>
        </div>
      </div>
    </section>
  );
}
