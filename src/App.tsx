import React, { useState, useMemo, useCallback, useEffect } from 'react';

const CSS_STYLES = `
  :root {
    --bg: #f5f5f7; --bg-card: rgba(255,255,255,0.72); --bg-sidebar: rgba(255,255,255,0.85);
    --text: #1d1d1f; --text-secondary: #6e6e73; --text-tertiary: #999;
    --border: rgba(0,0,0,0.08); --shadow-sm: 0 1px 3px rgba(0,0,0,0.04);
    --shadow: 0 8px 24px rgba(0,0,0,0.06); --shadow-lg: 0 16px 40px rgba(0,0,0,0.08);
    --accent: #5e5ce6; --accent-light: #7b6cf6; --accent-bg: rgba(94,92,230,0.08);
    --gradient: linear-gradient(135deg, #5e5ce6, #7b6cf6);
    --gradient-blue: linear-gradient(135deg, #4d7cf7, #6b9fff);
    --gradient-soft: linear-gradient(135deg, rgba(94,92,230,0.05), rgba(100,150,255,0.05));
    --warning: #ff9500; --warning-bg: rgba(255,149,0,0.1); --danger: #ff3b30;
    --danger-bg: rgba(255,59,48,0.08); --success: #34c759; --success-bg: rgba(52,199,89,0.08);
    --info: #007aff; --info-bg: rgba(0,122,255,0.08);
    --radius-sm: 10px; --radius: 16px; --radius-lg: 24px;
    --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); --backdrop: blur(20px);
  }
  .dark {
    --bg: #0d0d0f; --bg-card: rgba(30,30,32,0.75); --bg-sidebar: rgba(22,22,24,0.9);
    --text: #f5f5f7; --text-secondary: #a1a1a6; --text-tertiary: #6e6e73;
    --border: rgba(255,255,255,0.08); --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
    --shadow: 0 8px 24px rgba(0,0,0,0.5); --shadow-lg: 0 16px 40px rgba(0,0,0,0.6);
    --accent-bg: rgba(94,92,230,0.15);
    --gradient-soft: linear-gradient(135deg, rgba(94,92,230,0.1), rgba(100,150,255,0.1));
    --warning-bg: rgba(255,149,0,0.15); --danger-bg: rgba(255,59,48,0.12);
    --success-bg: rgba(52,199,89,0.12); --info-bg: rgba(0,122,255,0.12);
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', system-ui, sans-serif; }
  .app-container { display:flex; min-height:100vh; background:var(--bg); color:var(--text); transition:background var(--transition), color var(--transition); }
  .sidebar { width:280px; min-height:100vh; background:var(--bg-sidebar); backdrop-filter:var(--backdrop); -webkit-backdrop-filter:var(--backdrop); border-right:1px solid var(--border); padding:24px 16px; display:flex; flex-direction:column; position:sticky; top:0; z-index:10; transition:all var(--transition); }
  .sidebar-logo { display:flex; align-items:center; gap:12px; padding:8px 12px 28px; }
  .sidebar-logo .icon { width:42px; height:42px; border-radius:12px; background:var(--gradient); display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; font-weight:700; flex-shrink:0; }
  .sidebar-logo .logo-text { font-size:19px; font-weight:700; color:var(--text); letter-spacing:-0.4px; }
  .sidebar-nav { flex:1; display:flex; flex-direction:column; gap:4px; }
  .nav-item { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:var(--radius-sm); cursor:pointer; font-size:14px; font-weight:500; color:var(--text-secondary); transition:all var(--transition); border:none; background:none; width:100%; text-align:left; }
  .nav-item:hover { background:var(--accent-bg); color:var(--accent); transform:translateX(2px); }
  .nav-item.active { background:var(--accent-bg); color:var(--accent); font-weight:600; box-shadow:inset 0 0 0 1px var(--accent); }
  .nav-item .nav-icon { font-size:18px; width:24px; text-align:center; flex-shrink:0; }
  .sidebar-footer { padding-top:16px; border-top:1px solid var(--border); display:flex; flex-direction:column; gap:8px; }
  .theme-toggle { display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:var(--radius-sm); cursor:pointer; border:none; background:none; width:100%; font-size:13px; color:var(--text-secondary); transition:all var(--transition); }
  .theme-toggle:hover { background:var(--accent-bg); }
  .main-content { flex:1; padding:28px 32px 48px; overflow-y:auto; max-height:100vh; }
  .section-title { font-size:30px; font-weight:800; letter-spacing:-0.5px; margin-bottom:6px; color:var(--text); }
  .section-subtitle { font-size:15px; color:var(--text-secondary); margin-bottom:28px; }
  .card { background:var(--bg-card); backdrop-filter:var(--backdrop); -webkit-backdrop-filter:var(--backdrop); border-radius:var(--radius-lg); padding:24px; box-shadow:var(--shadow-sm); border:1px solid var(--border); transition:all var(--transition); }
  .card:hover { box-shadow:var(--shadow); border-color:transparent; }
  .card-header { font-size:16px; font-weight:600; margin-bottom:16px; display:flex; align-items:center; gap:10px; color:var(--text); }
  .card-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:20px; }
  .card-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .progress-bar-outer { height:12px; background:var(--border); border-radius:8px; overflow:hidden; margin:10px 0; }
  .progress-bar-inner { height:100%; border-radius:8px; transition:width 0.6s cubic-bezier(0.4,0,0.2,1); }
  .badge { display:inline-flex; align-items:center; gap:4px; padding:5px 12px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:0.2px; }
  .badge-warning { background:var(--warning-bg); color:var(--warning); }
  .badge-success { background:var(--success-bg); color:var(--success); }
  .badge-danger { background:var(--danger-bg); color:var(--danger); }
  .badge-info { background:var(--info-bg); color:var(--info); }
  .badge-accent { background:var(--accent-bg); color:var(--accent); }
  .btn { display:inline-flex; align-items:center; gap:6px; padding:12px 20px; border-radius:24px; font-size:14px; font-weight:600; cursor:pointer; border:none; transition:all var(--transition); letter-spacing:-0.2px; }
  .btn-primary { background:var(--gradient); color:#fff; }
  .btn-primary:hover { opacity:0.95; transform:translateY(-1px); box-shadow:0 8px 20px rgba(94,92,230,0.4); }
  .btn-outline { background:transparent; border:1.5px solid var(--border); color:var(--text); }
  .btn-outline:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-bg); }
  .btn-sm { padding:7px 16px; font-size:13px; border-radius:20px; }
  .input, .select { padding:12px 16px; border-radius:var(--radius-sm); border:1.5px solid var(--border); background:var(--bg-card); color:var(--text); font-size:14px; transition:all var(--transition); font-family:inherit; width:100%; }
  .input:focus, .select:focus { outline:none; border-color:var(--accent); box-shadow:0 0 0 4px rgba(94,92,230,0.15); }
  .input-row { display:flex; gap:12px; align-items:end; flex-wrap:wrap; }
  .input-row > * { flex:1; min-width:140px; }
  .tag { display:inline-flex; align-items:center; gap:4px; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:500; background:var(--accent-bg); color:var(--accent); }
  .table-mini { width:100%; border-collapse:collapse; font-size:13px; }
  .table-mini th { text-align:left; padding:10px 12px; color:var(--text-secondary); font-weight:500; border-bottom:1px solid var(--border); font-size:11px; text-transform:uppercase; letter-spacing:0.5px; }
  .table-mini td { padding:12px; border-bottom:1px solid var(--border); color:var(--text); }
  .table-mini tr:last-child td { border-bottom:none; }
  .suggestion-card { padding:16px 20px; border-radius:var(--radius); border-left:5px solid var(--accent); background:var(--accent-bg); margin-bottom:12px; transition:all var(--transition); }
  .suggestion-card.warn { border-left-color:var(--warning); background:var(--warning-bg); }
  .suggestion-card.danger { border-left-color:var(--danger); background:var(--danger-bg); }
  .suggestion-card.success { border-left-color:var(--success); background:var(--success-bg); }
  .suggestion-card h4 { font-size:14px; font-weight:600; margin-bottom:4px; color:var(--text); }
  .suggestion-card p { font-size:12px; color:var(--text-secondary); margin:0; }
  .gpa-big { font-size:64px; font-weight:900; letter-spacing:-2.5px; background:var(--gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .gpa-bar-chart { display:flex; gap:8px; align-items:flex-end; height:100px; padding-top:12px; }
  .gpa-bar { flex:1; border-radius:8px 8px 0 0; min-width:20px; transition:height 0.5s cubic-bezier(0.4,0,0.2,1); }
  .stat-num { font-size:32px; font-weight:700; letter-spacing:-0.5px; color:var(--text); }
  .stat-label { font-size:12px; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px; }
  .empty-state { text-align:center; padding:48px 24px; color:var(--text-tertiary); }
  .empty-state .empty-icon { font-size:48px; margin-bottom:12px; opacity:0.7; }
  .empty-state p { font-size:14px; margin-bottom:8px; }
  .fade-in { animation: fadeIn 0.5s ease; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @media (max-width:768px) {
    .sidebar { width:100%; min-height:auto; position:relative; flex-direction:row; flex-wrap:wrap; padding:12px 16px; gap:6px; }
    .sidebar-logo { padding:0; } .sidebar-logo .logo-text { display:none; }
    .sidebar-nav { flex-direction:row; flex-wrap:wrap; gap:4px; }
    .nav-item { padding:10px 14px; font-size:12px; gap:6px; }
    .nav-item .nav-icon { font-size:16px; width:18px; }
    .sidebar-footer { display:none; }
    .app-container { flex-direction:column; }
    .main-content { padding:20px; max-height:none; }
    .card-grid-2 { grid-template-columns:1fr; }
    .card-grid { grid-template-columns:1fr; }
    .gpa-big { font-size:48px; }
    .input-row { flex-direction:column; }
    .input-row > * { min-width:100%; }
  }
`;

// ---------- types ----------
interface GradRequirement {
  required: number;
  category: string;
  note?: string;
}

interface RunningStartClass {
  id: number;
  name: string;
  subject: string;
  collegeCredits: number;
  highSchoolCredits: number;
  quarter: string;
}

interface GPAClass {
  id: number;
  name: string;
  grade: string;
  credits: number;
}

interface MajorInfo {
  competitiveness: string;
  minGPA: number;
  recGPA: number;
  suggested: string[];
}

interface University {
  name: string;
  logo: string;
  competitiveness: string;
  avgGPA: number;
  majors: Record<string, MajorInfo>;
}

// ---------- constants ----------
const GRAD_REQUIREMENTS: Record<string, GradRequirement> = {
  English: { required: 4, category: 'core' },
  Math: { required: 3, category: 'core', note: 'Must include Algebra II' },
  Science: { required: 3, category: 'core', note: 'At least 2 lab sciences' },
  'Social Studies': { required: 3, category: 'core' },
  'World Language': { required: 2, category: 'recommended' },
  'Health/Fitness': { required: 2, category: 'required' },
  'Fine Arts': { required: 1, category: 'required' },
  Electives: { required: 4, category: 'elective' },
};

const TOTAL_REQUIRED = Object.values(GRAD_REQUIREMENTS).reduce((s, r) => s + r.required, 0);

const UNIVERSITIES: Record<string, University> = {
  Harvard: {
    name: 'Harvard University',
    logo: '🎓',
    competitiveness: 'extreme',
    avgGPA: 3.9,
    majors: {
      'Computer Science': { competitiveness: 'extreme', minGPA: 3.9, recGPA: 3.95, suggested: ['AP Calculus BC', 'AP Computer Science A', 'AP Physics C', 'Linear Algebra', 'Data Structures'] },
      Engineering: { competitiveness: 'extreme', minGPA: 3.9, recGPA: 3.95, suggested: ['AP Physics C', 'AP Calculus BC', 'AP Chemistry', 'Differential Equations'] },
      Biology: { competitiveness: 'extreme', minGPA: 3.85, recGPA: 3.9, suggested: ['AP Biology', 'AP Chemistry', 'AP Calculus AB', 'Organic Chemistry'] },
      Economics: { competitiveness: 'extreme', minGPA: 3.85, recGPA: 3.9, suggested: ['AP Calculus BC', 'AP Microeconomics', 'AP Statistics', 'Game Theory'] },
      English: { competitiveness: 'high', minGPA: 3.75, recGPA: 3.85, suggested: ['AP English Literature', 'AP English Language', 'Creative Writing', 'Philosophy'] },
    },
  },
  Stanford: {
    name: 'Stanford University',
    logo: '🌲',
    competitiveness: 'extreme',
    avgGPA: 3.9,
    majors: {
      'Computer Science': { competitiveness: 'extreme', minGPA: 3.9, recGPA: 3.95, suggested: ['AP Calculus BC', 'AP Computer Science A', 'AP Physics C', 'Algorithms'] },
      Engineering: { competitiveness: 'extreme', minGPA: 3.9, recGPA: 3.95, suggested: ['AP Physics C', 'AP Calculus BC', 'AP Chemistry', 'Engineering Design'] },
      'Human Biology': { competitiveness: 'extreme', minGPA: 3.85, recGPA: 3.9, suggested: ['AP Biology', 'AP Chemistry', 'AP Statistics', 'Anatomy'] },
      'Product Design': { competitiveness: 'high', minGPA: 3.7, recGPA: 3.8, suggested: ['AP Art', 'AP Physics', 'Calculus', 'Design Thinking'] },
    },
  },
  MIT: {
    name: 'Massachusetts Institute of Technology',
    logo: '🔬',
    competitiveness: 'extreme',
    avgGPA: 3.9,
    majors: {
      'Computer Science': { competitiveness: 'extreme', minGPA: 3.9, recGPA: 3.95, suggested: ['AP Calculus BC', 'AP Computer Science A', 'AP Physics C', 'Discrete Math'] },
      'Aerospace Engineering': { competitiveness: 'extreme', minGPA: 3.9, recGPA: 3.95, suggested: ['AP Physics C', 'AP Calculus BC', 'AP Chemistry', 'Fluid Dynamics'] },
      Mathematics: { competitiveness: 'extreme', minGPA: 3.85, recGPA: 3.9, suggested: ['AP Calculus BC', 'AP Statistics', 'Linear Algebra', 'Abstract Algebra'] },
    },
  },
  'UC Berkeley': {
    name: 'UC Berkeley',
    logo: '🐻',
    competitiveness: 'high',
    avgGPA: 3.7,
    majors: {
      'Computer Science': { competitiveness: 'extreme', minGPA: 3.8, recGPA: 3.9, suggested: ['AP Calculus BC', 'AP Computer Science A', 'Data Structures'] },
      Business: { competitiveness: 'high', minGPA: 3.7, recGPA: 3.8, suggested: ['AP Microeconomics', 'AP Statistics', 'Accounting'] },
      Psychology: { competitiveness: 'medium', minGPA: 3.5, recGPA: 3.7, suggested: ['AP Psychology', 'AP Statistics', 'Research Methods'] },
    },
  },
  UW: {
    name: 'University of Washington',
    logo: '☔',
    competitiveness: 'high',
    avgGPA: 3.6,
    majors: {
      'Computer Science': { competitiveness: 'extreme', minGPA: 3.8, recGPA: 3.9, suggested: ['AP Calculus BC', 'AP Computer Science A', 'Running Start: Calculus III', 'Data Structures'] },
      Engineering: { competitiveness: 'high', minGPA: 3.7, recGPA: 3.85, suggested: ['AP Physics C', 'AP Chemistry', 'Running Start: Engineering'] },
      Nursing: { competitiveness: 'high', minGPA: 3.7, recGPA: 3.85, suggested: ['AP Biology', 'AP Chemistry', 'Anatomy', 'Microbiology'] },
      Business: { competitiveness: 'medium', minGPA: 3.6, recGPA: 3.75, suggested: ['AP Statistics', 'AP Microeconomics', 'Business Law'] },
    },
  },
};

// helper
function loadState<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

// ---------- App ----------
const App: React.FC = () => {
  // state
  const [darkMode, setDarkMode] = useState<boolean>(() => loadState<boolean>('darkMode', false));
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [studentGrade, setStudentGrade] = useState<number>(() => loadState<number>('grade', 9));
  const [earnedCredits, setEarnedCredits] = useState<Record<string, number>>(() =>
    loadState<Record<string, number>>('credits', {
      English: 0,
      Math: 0,
      Science: 0,
      'Social Studies': 0,
      'World Language': 0,
      'Health/Fitness': 0,
      'Fine Arts': 0,
      Electives: 0,
    })
  );
  const [runningStartClasses, setRunningStartClasses] = useState<RunningStartClass[]>(() =>
    loadState<RunningStartClass[]>('rs', [])
  );
  const [gpaClasses, setGpaClasses] = useState<GPAClass[]>(() => loadState<GPAClass[]>('gpa', []));
  const [selectedUniversity, setSelectedUniversity] = useState<string>(() => loadState<string>('uni', 'UW'));
  const [selectedMajor, setSelectedMajor] = useState<string>(() => loadState<string>('major', 'Computer Science'));
  const [showAddRS, setShowAddRS] = useState<boolean>(false);
  const [showAddGPA, setShowAddGPA] = useState<boolean>(false);
  const [newRSClass, setNewRSClass] = useState<Omit<RunningStartClass, 'id' | 'highSchoolCredits'>>({
    name: '',
    subject: 'English',
    collegeCredits: 5,
    quarter: 'Fall',
  });
  const [newGPAClass, setNewGPAClass] = useState<Omit<GPAClass, 'id'>>({ name: '', grade: 'A', credits: 0.5 });

  // persist
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('grade', JSON.stringify(studentGrade));
    localStorage.setItem('credits', JSON.stringify(earnedCredits));
    localStorage.setItem('rs', JSON.stringify(runningStartClasses));
    localStorage.setItem('gpa', JSON.stringify(gpaClasses));
    localStorage.setItem('uni', JSON.stringify(selectedUniversity));
    localStorage.setItem('major', JSON.stringify(selectedMajor));
  }, [darkMode, studentGrade, earnedCredits, runningStartClasses, gpaClasses, selectedUniversity, selectedMajor]);

  // handlers
  const toggleDark = useCallback(() => setDarkMode((d) => !d), []);

  const resetAllData = () => {
    if (window.confirm('Reset all data? This cannot be undone.')) {
      setStudentGrade(9);
      setEarnedCredits(
        Object.fromEntries(Object.keys(GRAD_REQUIREMENTS).map((k) => [k, 0]))
      );
      setRunningStartClasses([]);
      setGpaClasses([]);
    }
  };

  // derived data
  const totalEarned = useMemo(() => Object.values(earnedCredits).reduce((s, v) => s + v, 0), [earnedCredits]);
  const rsTotalHS = useMemo(
    () => runningStartClasses.reduce((s, c) => s + c.highSchoolCredits, 0),
    [runningStartClasses]
  );

  const creditsWithRS = useMemo(() => {
    const merged = { ...earnedCredits };
    runningStartClasses.forEach((c) => {
      merged[c.subject] = (merged[c.subject] || 0) + c.highSchoolCredits;
    });
    return merged;
  }, [earnedCredits, runningStartClasses]);

  const missingRequirements = useMemo(() => {
    return Object.entries(GRAD_REQUIREMENTS)
      .filter(([subj, req]) => (creditsWithRS[subj] || 0) < req.required)
      .map(([subj, req]) => ({
        subject: subj,
        required: req.required,
        current: creditsWithRS[subj] || 0,
        missing: Math.max(0, req.required - (creditsWithRS[subj] || 0)),
        category: req.category,
        note: req.note || '',
      }));
  }, [creditsWithRS]);

  const gradeToGPA = useCallback((grade: string): number => {
    const map: Record<string, number> = {
      A: 4.0, 'A-': 3.7, 'B+': 3.3, B: 3.0, 'B-': 2.7,
      'C+': 2.3, C: 2.0, 'C-': 1.7, 'D+': 1.3, D: 1.0, F: 0.0,
    };
    return map[grade] ?? 0;
  }, []);

  const currentGPA = useMemo(() => {
    if (gpaClasses.length === 0) return 0;
    const totalPoints = gpaClasses.reduce((s, c) => s + gradeToGPA(c.grade) * c.credits, 0);
    const totalCredits = gpaClasses.reduce((s, c) => s + c.credits, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }, [gpaClasses, gradeToGPA]);

  const gpaTrend = useMemo(() => {
    if (gpaClasses.length === 0) return [];
    const semesters: number[] = [];
    const chunkSize = Math.max(1, Math.floor(gpaClasses.length / 4) || 1);
    for (let i = 0; i < gpaClasses.length; i += chunkSize) {
      const chunk = gpaClasses.slice(i, i + chunkSize);
      const pts = chunk.reduce((s, c) => s + gradeToGPA(c.grade) * c.credits, 0);
      const cr = chunk.reduce((s, c) => s + c.credits, 0);
      semesters.push(cr > 0 ? +(pts / cr).toFixed(2) : 0);
    }
    return semesters;
  }, [gpaClasses, gradeToGPA]);

  const uniData = UNIVERSITIES[selectedUniversity];
  const majorData = uniData?.majors[selectedMajor] ?? null;
  const gpaOnTrack = majorData ? currentGPA >= majorData.minGPA : true;
  const gpaWarning = majorData ? currentGPA < majorData.recGPA : false;

  const smartSuggestions = useMemo(() => {
    const suggestions: { type: string; title: string; message: string }[] = [];
    if (missingRequirements.length > 0) {
      const criticalMissing = missingRequirements.filter((m) => m.category === 'core' && m.missing > 0.5);
      if (criticalMissing.length > 0) {
        suggestions.push({
          type: 'danger',
          title: 'Critical: Core Requirements Missing',
          message: `You need more credits in: ${criticalMissing.map((m) => m.subject).join(', ')}. Plan to enroll immediately.`,
        });
      }
    }
    if (majorData?.competitiveness === 'extreme' && currentGPA > 0 && currentGPA < majorData.recGPA) {
      suggestions.push({
        type: 'danger',
        title: `GPA Far Below ${selectedUniversity} ${selectedMajor}`,
        message: `Your GPA (${currentGPA.toFixed(2)}) is significantly below the recommended ${majorData.recGPA}. Improving grades is essential.`,
      });
    } else if (gpaWarning) {
      suggestions.push({
        type: 'warn',
        title: `GPA Below Target for ${selectedMajor}`,
        message: `Your GPA of ${currentGPA.toFixed(2)} is below the recommended ${majorData?.recGPA}. Focus on raising grades.`,
      });
    }
    if (studentGrade >= 11 && totalEarned + rsTotalHS < TOTAL_REQUIRED * 0.7) {
      suggestions.push({
        type: 'danger',
        title: 'Behind on Credits for Graduation',
        message: `You have ${(totalEarned + rsTotalHS).toFixed(1)} of ${TOTAL_REQUIRED} credits. You may need summer school or extra classes.`,
      });
    }
    if (runningStartClasses.length === 0 && studentGrade >= 10) {
      suggestions.push({
        type: 'info',
        title: 'Consider Running Start',
        message: 'Earn college credit while finishing high school requirements. It strengthens your college application.',
      });
    }
    if (suggestions.length === 0) {
      suggestions.push({ type: 'success', title: "You're on a great track!", message: 'Keep challenging yourself with rigorous courses and extracurriculars.' });
    }
    return suggestions;
  }, [
    missingRequirements, gpaWarning, selectedUniversity, selectedMajor, currentGPA,
    studentGrade, totalEarned, rsTotalHS, runningStartClasses, majorData,
  ]);

  // mutant methods
  const addRunningStartClass = () => {
    if (!newRSClass.name.trim()) return;
    const newCls: RunningStartClass = {
      id: Date.now(),
      name: newRSClass.name.trim(),
      subject: newRSClass.subject,
      collegeCredits: newRSClass.collegeCredits,
      highSchoolCredits: Math.round((newRSClass.collegeCredits / 5) * 10) / 10,
      quarter: newRSClass.quarter,
    };
    setRunningStartClasses((prev) => [...prev, newCls]);
    setShowAddRS(false);
    setNewRSClass({ name: '', subject: 'English', collegeCredits: 5, quarter: 'Fall' });
  };

  const addGPAClass = () => {
    if (!newGPAClass.name.trim()) return;
    const newCls: GPAClass = { id: Date.now(), name: newGPAClass.name.trim(), grade: newGPAClass.grade, credits: newGPAClass.credits };
    setGpaClasses((prev) => [...prev, newCls]);
    setShowAddGPA(false);
    setNewGPAClass({ name: '', grade: 'A', credits: 0.5 });
  };

  const removeGPAClass = (id: number) => setGpaClasses((prev) => prev.filter((c) => c.id !== id));
  const removeRSClass = (id: number) => setRunningStartClasses((prev) => prev.filter((c) => c.id !== id));

  const updateCredit = (subject: string, value: string) =>
    setEarnedCredits((prev) => ({ ...prev, [subject]: Math.max(0, +value || 0) }));

  const progressBarColor = (pct: number) =>
    pct >= 0.9 ? '#34c759' : pct >= 0.6 ? '#5e5ce6' : pct >= 0.3 ? '#ff9500' : '#ff3b30';

  const navItems = [
    { key: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { key: 'graduation', icon: '🎓', label: 'Graduation' },
    { key: 'runningstart', icon: '🏛️', label: 'Running Start' },
    { key: 'gpa', icon: '📊', label: 'GPA' },
    { key: 'college', icon: '🎯', label: 'College' },
  ];

  // ---------- render sections (typed JSX) ----------
  const renderDashboard = () => (
    <div className="fade-in">
      <h2 className="section-title">Dashboard</h2>
      <p className="section-subtitle">Your overview — Grade {studentGrade}</p>
      <div className="card-grid">
        <div className="card">
          <div className="card-header">📋 Credits</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '10px' }}>
            <span className="stat-num">{(totalEarned + rsTotalHS).toFixed(1)}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>/ {TOTAL_REQUIRED}</span>
          </div>
          <div className="progress-bar-outer">
            <div
              className="progress-bar-inner"
              style={{
                width: `${Math.min(100, ((totalEarned + rsTotalHS) / TOTAL_REQUIRED) * 100)}%`,
                background: progressBarColor((totalEarned + rsTotalHS) / TOTAL_REQUIRED),
              }}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-header">📊 GPA</div>
          <span className="gpa-big">{currentGPA.toFixed(2)}</span>
          <div style={{ marginTop: '4px' }}>
            {gpaOnTrack ? (
              <span className="badge badge-success">Competitive</span>
            ) : (
              <span className="badge badge-warning">Needs Improvement</span>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-header">🎯 Target</div>
          <div style={{ fontWeight: 600 }}>{uniData?.name}: {selectedMajor}</div>
          <span className={`badge ${majorData?.competitiveness === 'extreme' ? 'badge-danger' : 'badge-warning'}`}>
            {majorData?.competitiveness?.toUpperCase()}
          </span>
        </div>
        <div className="card">
          <div className="card-header">🏛️ RS Classes</div>
          <span className="stat-num">{runningStartClasses.length}</span>
          <div className="stat-label">Active</div>
        </div>
      </div>
      <div style={{ marginTop: '24px' }}>
        <div className="card">
          <div className="card-header">💡 Smart Suggestions</div>
          {smartSuggestions.map((s, i) => (
            <div key={i} className={`suggestion-card ${s.type}`}>
              <h4>{s.title}</h4>
              <p>{s.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGraduation = () => (
    <div className="fade-in">
      <h2 className="section-title">Graduation Tracker</h2>
      <p className="section-subtitle">Set your grade and earned credits</p>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 500 }}>Grade:</span>
        {[9, 10, 11, 12].map((g) => (
          <button
            key={g}
            className={`btn btn-sm ${studentGrade === g ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStudentGrade(g)}
          >
            Grade {g}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="card-header">📋 Requirements</div>
        <div style={{ marginBottom: '16px' }}>
          <div className="progress-bar-outer" style={{ height: '14px', borderRadius: '8px' }}>
            <div
              className="progress-bar-inner"
              style={{
                width: `${Math.min(100, ((totalEarned + rsTotalHS) / TOTAL_REQUIRED) * 100)}%`,
                background: 'var(--gradient)',
              }}
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '6px', fontWeight: 600 }}>
            {(totalEarned + rsTotalHS).toFixed(1)} / {TOTAL_REQUIRED} ({Math.round(((totalEarned + rsTotalHS) / TOTAL_REQUIRED) * 100)}%)
          </div>
        </div>
        <table className="table-mini">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Req</th>
              <th>Credits</th>
              <th>From RS</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(GRAD_REQUIREMENTS).map(([subj, req]) => {
              const earned = earnedCredits[subj] || 0;
              const fromRS = runningStartClasses
                .filter((c) => c.subject === subj)
                .reduce((s, c) => s + c.highSchoolCredits, 0);
              const total = earned + fromRS;
              const met = total >= req.required;
              return (
                <tr key={subj}>
                  <td style={{ fontWeight: 500 }}>{subj}</td>
                  <td>{req.required}</td>
                  <td>
                    <input
                      className="input"
                      type="number"
                      step="0.5"
                      min="0"
                      value={earned}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateCredit(subj, e.target.value)}
                      style={{ width: '70px', padding: '6px' }}
                    />
                  </td>
                  <td>{fromRS > 0 ? `+${fromRS.toFixed(1)}` : '—'}</td>
                  <td>
                    {met ? (
                      <span className="badge badge-success">✓</span>
                    ) : (
                      <span className="badge badge-warning">{(req.required - total).toFixed(1)}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRunningStart = () => (
    <div className="fade-in">
      <h2 className="section-title">Running Start Planner</h2>
      <p className="section-subtitle">5 college credits ≈ 1 high school credit</p>
      <div className="card-grid-2">
        <div className="card">
          <div className="card-header">📚 Your Classes</div>
          {runningStartClasses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No Running Start classes added yet.</p>
            </div>
          ) : (
            <table className="table-mini">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Cr</th>
                  <th>Qtr</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {runningStartClasses.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                    <td><span className="tag">{c.subject}</span></td>
                    <td>{c.highSchoolCredits.toFixed(1)} HS</td>
                    <td>{c.quarter}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => removeRSClass(c.id)}
                        style={{ color: 'var(--danger)' }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!showAddRS && (
            <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={() => setShowAddRS(true)}>
              + Add Class
            </button>
          )}
          {showAddRS && (
            <div style={{ marginTop: '12px', padding: '16px', borderRadius: 'var(--radius)', background: 'var(--accent-bg)' }}>
              <div className="input-row">
                <input
                  className="input"
                  placeholder="e.g. ENGL& 101"
                  value={newRSClass.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRSClass((p) => ({ ...p, name: e.target.value }))}
                />
                <select
                  className="select"
                  value={newRSClass.subject}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewRSClass((p) => ({ ...p, subject: e.target.value }))}
                >
                  {Object.keys(GRAD_REQUIREMENTS).map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <select
                  className="select"
                  value={newRSClass.collegeCredits}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewRSClass((p) => ({ ...p, collegeCredits: +e.target.value }))
                  }
                >
                  <option value={3}>3 cr</option>
                  <option value={5}>5 cr</option>
                </select>
                <select
                  className="select"
                  value={newRSClass.quarter}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewRSClass((p) => ({ ...p, quarter: e.target.value }))}
                >
                  <option>Fall</option>
                  <option>Winter</option>
                  <option>Spring</option>
                </select>
              </div>
              <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary btn-sm" onClick={addRunningStartClass}>Save</button>
                <button className="btn btn-outline btn-sm" onClick={() => setShowAddRS(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
        <div className="card">
          <div className="card-header">💡 Suggestions</div>
          {missingRequirements.length > 0 ? (
            missingRequirements.map((m) => (
              <div key={m.subject} className="suggestion-card">
                <h4>{m.subject}: need {m.missing.toFixed(1)}</h4>
                <p>{m.note || 'Find a college course that satisfies this requirement.'}</p>
              </div>
            ))
          ) : (
            <div className="suggestion-card success">
              <h4>All requirements covered</h4>
              <p>Great job! Consider advanced electives.</p>
            </div>
          )}
          {majorData && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>For {selectedMajor}:</div>
              {majorData.suggested.slice(0, 3).map((s, i) => (
                <div key={i} style={{ fontSize: '12px', padding: '2px 0' }}>
                  • {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderGPA = () => (
    <div className="fade-in">
      <h2 className="section-title">GPA Calculator</h2>
      <p className="section-subtitle">Add your classes and grades</p>
      <div className="card-grid-2">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="card-header">🎯 Current GPA</div>
          <span className="gpa-big">{currentGPA.toFixed(2)}</span>
          <div style={{ marginTop: '8px' }}>
            {currentGPA >= 3.7 ? (
              <span className="badge badge-success">Excellent</span>
            ) : currentGPA >= 3.2 ? (
              <span className="badge badge-info">Good</span>
            ) : currentGPA >= 2.5 ? (
              <span className="badge badge-warning">Average</span>
            ) : (
              <span className="badge badge-danger">At Risk</span>
            )}
          </div>
          {gpaWarning && majorData && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--warning)', fontWeight: 500 }}>
              ⚠ Below {selectedUniversity} {selectedMajor} target ({majorData.recGPA})
            </div>
          )}
        </div>
        <div className="card">
          <div className="card-header">📈 Trend</div>
          {gpaTrend.length > 1 ? (
            <div className="gpa-bar-chart">
              {gpaTrend.map((g, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div
                    className="gpa-bar"
                    style={{
                      height: `${(g / 4.0) * 70}px`,
                      background:
                        g >= 3.5
                          ? 'var(--gradient)'
                          : g >= 3.0
                          ? 'var(--gradient-blue)'
                          : 'linear-gradient(135deg, #ff9500, #ffb340)',
                      minWidth: '20px',
                      width: '100%',
                    }}
                  />
                  <span style={{ fontSize: '10px', marginTop: '4px' }}>Sem {i + 1}</span>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>{g.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><p>Add more classes to see trend</p></div>
          )}
        </div>
      </div>
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">📋 Class Records</div>
        {gpaClasses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>No classes added yet.</p>
          </div>
        ) : (
          <table className="table-mini">
            <thead>
              <tr>
                <th>Class</th>
                <th>Credits</th>
                <th>Grade</th>
                <th>Points</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {gpaClasses.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td>{c.credits}</td>
                  <td>
                    <span
                      className={`badge ${
                        gradeToGPA(c.grade) >= 3.7
                          ? 'badge-success'
                          : gradeToGPA(c.grade) >= 2.7
                          ? 'badge-info'
                          : 'badge-warning'
                      }`}
                    >
                      {c.grade}
                    </span>
                  </td>
                  <td>{(gradeToGPA(c.grade) * c.credits).toFixed(1)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => removeGPAClass(c.id)}
                      style={{ color: 'var(--danger)' }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!showAddGPA && (
          <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={() => setShowAddGPA(true)}>
            + Add Class
          </button>
        )}
        {showAddGPA && (
          <div style={{ marginTop: '12px', padding: '16px', borderRadius: 'var(--radius)', background: 'var(--accent-bg)' }}>
            <div className="input-row">
              <input
                className="input"
                placeholder="Class name"
                value={newGPAClass.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewGPAClass((p) => ({ ...p, name: e.target.value }))}
              />
              <select
                className="select"
                value={newGPAClass.grade}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewGPAClass((p) => ({ ...p, grade: e.target.value }))}
              >
                {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
              <select
                className="select"
                value={newGPAClass.credits}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setNewGPAClass((p) => ({ ...p, credits: +e.target.value }))
                }
              >
                <option value={0.5}>0.5 cr</option>
                <option value={1}>1.0 cr</option>
              </select>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
              <button className="btn btn-primary btn-sm" onClick={addGPAClass}>Save</button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddGPA(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCollege = () => {
    const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newUni = e.target.value;
      setSelectedUniversity(newUni);
      const uni = UNIVERSITIES[newUni];
      if (uni) {
        setSelectedMajor(Object.keys(uni.majors)[0]);
      }
    };

    return (
      <div className="fade-in">
        <h2 className="section-title">College Readiness</h2>
        <p className="section-subtitle">See how you stack up for top universities</p>
        <div className="card-grid-2">
          <div className="card">
            <div className="card-header">🏛️ University</div>
            <select className="select" value={selectedUniversity} onChange={handleUniversityChange}>
              {Object.entries(UNIVERSITIES).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
            <div style={{ marginTop: '16px' }}>
              <div className="card-header">🎓 Major</div>
              <select className="select" value={selectedMajor} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMajor(e.target.value)}>
                {uniData && Object.keys(uniData.majors).map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
            {majorData && (
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className={`badge ${majorData.competitiveness === 'extreme' ? 'badge-danger' : 'badge-warning'}`}>
                  {majorData.competitiveness.toUpperCase()}
                </span>
                <span className="badge badge-accent">Min GPA: {majorData.minGPA}</span>
                <span className="badge badge-info">Target: {majorData.recGPA}</span>
              </div>
            )}
          </div>
          <div className="card">
            <div className="card-header">📋 Recommended Courses</div>
            {majorData && majorData.suggested.map((course, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--gradient-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>
                  {i + 1}
                </span>
                {course}
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-header">📊 Readiness Assessment</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div style={{ textAlign: 'center', padding: '16px', borderRadius: 'var(--radius)', background: gpaOnTrack ? 'var(--success-bg)' : 'var(--danger-bg)' }}>
              <div className="stat-num" style={{ color: gpaOnTrack ? 'var(--success)' : 'var(--danger)' }}>{currentGPA.toFixed(2)}</div>
              <div className="stat-label">GPA</div>
              <div style={{ fontSize: '11px', marginTop: '4px' }}>{gpaOnTrack ? '✓ Meets minimum' : '✗ Below minimum'}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', borderRadius: 'var(--radius)', background: missingRequirements.length === 0 ? 'var(--success-bg)' : 'var(--warning-bg)' }}>
              <div className="stat-num" style={{ color: missingRequirements.length === 0 ? 'var(--success)' : 'var(--warning)' }}>{missingRequirements.length}</div>
              <div className="stat-label">Missing Reqs</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', borderRadius: 'var(--radius)', background: runningStartClasses.length >= 2 ? 'var(--success-bg)' : 'var(--info-bg)' }}>
              <div className="stat-num" style={{ color: runningStartClasses.length >= 2 ? 'var(--success)' : 'var(--info)' }}>{runningStartClasses.length}</div>
              <div className="stat-label">RS Classes</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'graduation': return renderGraduation();
      case 'runningstart': return renderRunningStart();
      case 'gpa': return renderGPA();
      case 'college': return renderCollege();
      default: return renderDashboard();
    }
  };

  return (
    <>
      <style>{CSS_STYLES}</style>
      <div className={`app-container ${darkMode ? 'dark' : ''}`}>
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="icon">P</div>
            <span className="logo-text">Pathwise</span>
          </div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`nav-item ${activeSection === item.key ? 'active' : ''}`}
                onClick={() => setActiveSection(item.key)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="theme-toggle" onClick={toggleDark}>
              <span>{darkMode ? '☀️' : '🌙'}</span> {darkMode ? 'Light' : 'Dark'} Mode
            </button>
            <button className="btn btn-outline btn-sm" onClick={resetAllData} style={{ justifyContent: 'center' }}>
              Reset All Data
            </button>
          </div>
        </aside>
        <main className="main-content">{renderContent()}</main>
      </div>
    </>
  );
};

export default App;
