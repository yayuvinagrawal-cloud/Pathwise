import { useState, useEffect, useRef, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0d10;
    --surface: #13131a;
    --border: #1f1f2e;
    --text: #ede9df;
    --muted: #6b6b80;
    --amber: #f5a623;
    --amber-dim: rgba(245,166,35,0.12);
    --red-flag: #e05252;
    --green-ok: #5cad7e;
    --font-serif: 'DM Serif Display', serif;
    --font-mono: 'DM Mono', monospace;
    --font-sans: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .noise {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)'/%3E%3C/svg%3E");
    background-repeat: repeat;
  }

  .wrap {
    position: relative;
    z-index: 1;
    max-width: 780px;
    margin: 0 auto;
    padding: 0 28px;
  }

  .nav {
    padding: 24px 0;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-logo {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    letter-spacing: 0.06em;
  }
  .nav-logo span { color: var(--amber); }
  .nav-tag {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    border: 1px solid var(--border);
    padding: 4px 10px;
    border-radius: 2px;
  }

  .hero {
    padding: 88px 0 80px;
    border-bottom: 1px solid var(--border);
  }
  .hero-inner { display: flex; }
  .hero-rule {
    width: 3px;
    background: var(--amber);
    border-radius: 2px;
    flex-shrink: 0;
    margin-right: 32px;
  }
  .hero-body { flex: 1; }
  .hero-eyebrow {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 20px;
  }
  .hero-h1 {
    font-family: var(--font-serif);
    font-size: clamp(38px, 6.5vw, 60px);
    line-height: 1.07;
    letter-spacing: -1.5px;
    color: var(--text);
    margin-bottom: 22px;
  }
  .hero-h1 em { font-style: italic; color: var(--amber); }
  .hero-sub {
    font-size: 17px;
    font-weight: 300;
    color: var(--muted);
    line-height: 1.75;
    max-width: 510px;
    margin-bottom: 36px;
  }
  .stat-row {
    display: flex;
    align-items: stretch;
    margin-bottom: 44px;
    flex-wrap: wrap;
    row-gap: 16px;
  }
  .stat-item { padding-right: 24px; }
  .stat-num {
    font-family: var(--font-serif);
    font-size: 22px;
    color: var(--text);
    letter-spacing: -0.5px;
    display: block;
  }
  .stat-desc {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    display: block;
    margin-top: 2px;
  }
  .stat-div {
    width: 1px;
    background: var(--border);
    margin-right: 24px;
    min-height: 36px;
  }
  .cta-btn {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--amber);
    border: 1px solid var(--amber);
    background: transparent;
    padding: 13px 28px;
    border-radius: 3px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .cta-btn:hover { background: var(--amber); color: var(--bg); }

  .sec-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .sec-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .input-section {
    padding: 68px 0 60px;
    border-bottom: 1px solid var(--border);
  }
  .denial-textarea {
    width: 100%;
    min-height: 210px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 3px;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.75;
    padding: 18px 20px;
    resize: vertical;
    outline: none;
    transition: border-color 0.18s;
    caret-color: var(--amber);
  }
  .denial-textarea:focus { border-color: var(--amber); }
  .denial-textarea::placeholder { color: var(--muted); }

  .chips-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 18px 0 10px;
  }
  .chips-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    border: 1px solid var(--border);
    background: transparent;
    padding: 6px 13px;
    border-radius: 2px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
    letter-spacing: 0.02em;
  }
  .chip:hover { border-color: var(--amber); color: var(--amber); }

  .plan-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 22px 0 10px;
  }
  .plan-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .plan-btn {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    border: 1px solid var(--border);
    background: transparent;
    padding: 5px 12px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.03em;
  }
  .plan-btn.active {
    border-color: var(--amber);
    color: var(--amber);
    background: var(--amber-dim);
  }
  .plan-btn:hover:not(.active) { color: var(--text); }

  .submit-btn {
    width: 100%;
    height: 50px;
    margin-top: 30px;
    background: var(--amber);
    color: var(--bg);
    border: none;
    border-radius: 3px;
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.12em;
    font-weight: 500;
    cursor: pointer;
    transition: filter 0.15s;
    text-transform: uppercase;
  }
  .submit-btn:hover:not(:disabled) { filter: brightness(1.1); }
  .submit-btn:disabled { opacity: 0.35; cursor: not-allowed; filter: none; }

  .loading-wrap {
    padding: 64px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
  }
  .dots { display: flex; gap: 9px; }
  .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--amber);
    animation: dotpulse 1.4s ease-in-out infinite;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dotpulse {
    0%, 100% { opacity: 0.2; transform: scale(0.7); }
    50% { opacity: 1; transform: scale(1); }
  }
  .loading-msg {
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.08em;
    color: var(--muted);
  }

  .error-block {
    background: rgba(224,82,82,0.07);
    border: 1px solid rgba(224,82,82,0.25);
    border-radius: 3px;
    padding: 24px 28px;
    margin: 32px 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .error-text {
    font-size: 14px;
    color: #e88;
    line-height: 1.6;
  }
  .retry-btn {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--red-flag);
    border: 1px solid var(--red-flag);
    background: transparent;
    padding: 8px 16px;
    border-radius: 2px;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .retry-btn:hover { background: var(--red-flag); color: var(--bg); }

  .results-section { padding: 68px 0 60px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 3px;
    margin-bottom: 16px;
    overflow: hidden;
    animation: fadeUp 0.4s ease both;
  }
  .panel:nth-child(2) { animation-delay: 0.1s; }
  .panel:nth-child(3) { animation-delay: 0.2s; }
  .panel:nth-child(4) { animation-delay: 0.3s; }
  .panel:nth-child(5) { animation-delay: 0.4s; }

  .panel-red { border-left: 3px solid var(--red-flag); }
  .panel-amber { border-left: 3px solid var(--amber); }
  .panel-letter { border-left: 3px solid #2a2a3a; }
  .panel-steps { border-left: 3px solid var(--green-ok); }

  .panel-head { padding: 22px 24px 0; }
  .panel-title {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .panel-h2 {
    font-family: var(--font-serif);
    font-size: 20px;
    color: var(--text);
    letter-spacing: -0.3px;
    margin-bottom: 14px;
  }
  .panel-body { padding: 0 24px 24px; }
  .panel-body p {
    font-size: 15px;
    color: #c2beb6;
    line-height: 1.78;
  }

  .rights-deadline {
    margin-top: 14px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--amber);
    letter-spacing: 0.05em;
    border: 1px solid rgba(245,166,35,0.22);
    background: var(--amber-dim);
    display: inline-block;
    padding: 7px 13px;
    border-radius: 2px;
  }

  .letter-wrap { padding: 0 24px; }
  .letter-body {
    font-family: var(--font-mono);
    font-size: 12.5px;
    line-height: 2;
    color: var(--text);
    white-space: pre-wrap;
    word-break: break-word;
    padding: 20px 0 8px;
    border-top: 1px solid var(--border);
  }
  .placeholder-chip {
    background: rgba(245,166,35,0.18);
    color: var(--amber);
    font-weight: 500;
    border-radius: 2px;
    padding: 1px 4px;
  }
  .letter-actions {
    display: flex;
    gap: 10px;
    padding: 16px 24px 24px;
    flex-wrap: wrap;
  }
  .letter-btn {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    border: 1px solid var(--border);
    background: transparent;
    padding: 9px 18px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .letter-btn:hover { border-color: var(--amber); color: var(--amber); }
  .letter-btn.copied { border-color: var(--green-ok); color: var(--green-ok); }

  .steps-list {
    list-style: none;
    padding: 0 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .step-item { display: flex; gap: 16px; align-items: flex-start; }
  .step-num {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    color: var(--amber);
    letter-spacing: 0.04em;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .step-text {
    font-size: 14px;
    color: #c2beb6;
    line-height: 1.72;
  }

  footer {
    border-top: 1px solid var(--border);
    padding: 32px 0 52px;
  }
  .footer-text {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--muted);
    line-height: 1.85;
  }

  @media (max-width: 640px) {
    .wrap { padding: 0 18px; }
    .hero { padding: 52px 0 48px; }
    .hero-rule { margin-right: 20px; }
    .input-section, .results-section { padding: 48px 0 44px; }
    .stat-div { display: none; }
    .stat-row { gap: 20px; }
    .hero-h1 { font-size: 34px; }
  }
`;

const EXAMPLES: Record<string, string> = {
  "MRI denied": `On March 12, 2025, I received a denial from BlueCross BlueShield for an MRI of my lumbar spine (CPT 72148). Denial code: CO-50 (Not Medically Necessary). My physician, Dr. Sarah Okonkwo at Cascade Spine & Neurology, ordered the MRI after diagnosing a herniated disc at L4-L5. I completed 8 weeks of physical therapy (3x/week) and a full course of NSAIDs with no improvement. I have documented radiating leg pain rated 8/10 and measurable left leg weakness. My plan is an ACA Marketplace plan through Covered California.`,
  "Mental health — out of network": `My insurer, Aetna, denied a $780 claim for a session with my psychiatrist, Dr. Marcus Webb, on February 28, 2025. Denial code: CO-97 (Out of Network). I have been seeing Dr. Webb for treatment-resistant major depressive disorder for 18 months. When I searched for an in-network psychiatrist accepting new patients (zip: 98102), the insurer's own provider directory listed no available providers within 30 miles — every number I called was either disconnected or not accepting patients. This is a network adequacy failure. My plan is an employer-sponsored PPO.`,
  "Prescription not on formulary": `On April 3, 2025, my pharmacy notified me that my prescription for Dupixent (dupilumab 300mg) was denied by UnitedHealthcare. Denial code: CO-96 (Non-formulary). My dermatologist, Dr. Priya Nair, prescribed Dupixent after I failed two formulary alternatives — Methotrexate (discontinued Feb 2024, elevated liver enzymes) and cyclosporine (ineffective, Dec 2023–Mar 2024) — for severe atopic dermatitis covering 40% of my body surface. Dr. Nair has submitted a letter of medical necessity. I am on a Medicare Part D plan.`,
  "Surgery called experimental": `Cigna denied pre-authorization for a spinal cord stimulator implant (CPT 63685) requested by Dr. Jonathan Reeves at Pacific Pain Institute on January 8, 2025. The denial states the procedure is "investigational." This is factually incorrect — spinal cord stimulation has been FDA-approved for over two decades. I have failed 4 years of conservative treatment: 3 epidural steroid injections, physical therapy, and 6 medications. My diagnosis is Complex Regional Pain Syndrome (CRPS Type II). I have employer-sponsored insurance through a self-funded ERISA plan.`,
  "ER denied — no pre-auth": `On March 3, 2025, I went to the ER at Valley Medical Center after sudden crushing chest pain and shortness of breath. I was admitted overnight and diagnosed with unstable angina. My insurer, Humana, denied the $14,200 claim citing "failure to obtain pre-authorization." I could not call ahead — I believed I was having a heart attack. Under the federal Prudent Layperson Standard (42 U.S.C. § 1867), ER care cannot be denied when a reasonable person would have sought emergency treatment given these symptoms. My plan is a Medicaid managed care plan.`,
};

const PLAN_TYPES = ["ACA Marketplace", "Employer Plan", "Medicare", "Medicaid", "Not sure"];

const LOADING_MSGS = [
  "Reading your denial...",
  "Identifying the tactic...",
  "Building your case...",
  "Writing your letter...",
];

interface AnalysisResult {
  denial_reason: string;
  user_rights: string;
  appeal_letter: string;
  next_steps: string[];
}

function renderLetter(letter: string): React.ReactNode {
  const parts = letter.split(/(\[[^\]]+\])/g);
  return parts.map((part, i) =>
    /^\[.+\]$/.test(part)
      ? <span key={i} className="placeholder-chip">{part}</span>
      : <span key={i}>{part}</span>
  );
}

export default function AppealKit() {
  const [denial, setDenial] = useState("");
  const [plan, setPlan] = useState("Not sure");
  const [loading, setLoading] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  const analyze = useCallback(async () => {
    if (!denial.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(false);
    setMsgIdx(0);
    timerRef.current = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MSGS.length), 1500);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1800,
          system: `You are a patient rights advocate and healthcare attorney with 20 years of experience fighting insurance denials. You write with clarity, authority, and genuine care for the patient. Respond ONLY with valid JSON — no preamble, no markdown fences, no backticks. Return exactly this structure:
{
  "denial_reason": "2-3 sentences in plain English explaining exactly why this claim was denied, naming the specific tactic or code. Do not be vague. CO-50 means medical necessity denial — say so.",
  "user_rights": "2-3 sentences citing the specific federal or state regulation that protects this patient for their plan type. Mention actual law names (ACA Section 2719, ERISA, 42 USC 1867, etc.), include the appeal deadline, and use the word expedited if their situation is urgent.",
  "appeal_letter": "A complete, professional, ready-to-send appeal letter in proper business letter format. Use [YOUR FULL NAME], [YOUR ADDRESS], [YOUR POLICY NUMBER], [INSURANCE COMPANY NAME], [INSURANCE COMPANY ADDRESS], [DATE OF SERVICE], [TREATING PHYSICIAN NAME] as placeholders in ALL CAPS with brackets. Include: specific denial code and date, strong medical necessity argument with clinical language, citation of the relevant law by name, request for expedited internal review where appropriate, and explicit request for external independent review if internal appeal is denied. Firm, professional, confident closing. Minimum 350 words. Write the entire letter as one continuous string with real newline characters.",
  "next_steps": ["01 — specific step with exact timeframe", "02 — specific step with exact timeframe", "03 — specific step with exact timeframe"]
}`,
          messages: [
            { role: "user", content: `Insurance plan type: ${plan}\n\nDenial details:\n${denial}` },
          ],
        }),
      });

      const data = await res.json();
      const raw = (data.content || []).map((b: { text?: string }) => b.text || "").join("");
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed: AnalysisResult = JSON.parse(clean);
      if (timerRef.current) clearInterval(timerRef.current);
      setResult(parsed);
      setLoading(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch {
      if (timerRef.current) clearInterval(timerRef.current);
      setLoading(false);
      setError(true);
    }
  }, [denial, plan, loading]);

  const copyLetter = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result.appeal_letter).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }, [result]);

  const downloadLetter = useCallback(() => {
    if (!result) return;
    const date = new Date().toISOString().split("T")[0];
    const blob = new Blob([result.appeal_letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AppealKit_Letter_${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  return (
    <>
      <div className="noise" aria-hidden="true" />

      {/* NAV */}
      <nav>
        <div className="wrap">
          <div className="nav">
            <span className="nav-logo">Appeal<span>Kit</span></span>
            <span className="nav-tag">Free · No account needed</span>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-inner">
            <div className="hero-rule" aria-hidden="true" />
            <div className="hero-body">
              <p className="hero-eyebrow">Insurance appeals, simplified</p>
              <h1 className="hero-h1">
                Your insurer said no.<br />
                <em>Make them reconsider.</em>
              </h1>
              <p className="hero-sub">
                40% of denied insurance claims are overturned on appeal — but most people
                never try. AppealKit explains your rights and writes your letter in seconds.
              </p>
              <div className="stat-row">
                <div className="stat-item">
                  <span className="stat-num">40%</span>
                  <span className="stat-desc">of appeals succeed</span>
                </div>
                <div className="stat-div" aria-hidden="true" />
                <div className="stat-item">
                  <span className="stat-num">$0</span>
                  <span className="stat-desc">cost to file</span>
                </div>
                <div className="stat-div" aria-hidden="true" />
                <div className="stat-item">
                  <span className="stat-num">~3 min</span>
                  <span className="stat-desc">to generate</span>
                </div>
              </div>
              <button
                className="cta-btn"
                onClick={() => inputRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Start my appeal →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INPUT */}
      <section className="input-section" ref={inputRef}>
        <div className="wrap">
          <p className="sec-label">// your denial</p>
          <textarea
            className="denial-textarea"
            value={denial}
            onChange={e => setDenial(e.target.value)}
            placeholder={`Paste your denial letter here, or describe what happened...\n\nExample: "My insurer denied my MRI as not medically necessary. The denial code was CO-50. I have a herniated disc at L4-L5 and my doctor ordered it after 6 weeks of failed physical therapy."`}
          />

          <p className="chips-label">Load an example →</p>
          <div className="chips-row">
            {Object.keys(EXAMPLES).map(label => (
              <button key={label} className="chip" onClick={() => setDenial(EXAMPLES[label])}>
                {label}
              </button>
            ))}
          </div>

          <p className="plan-label">My plan type</p>
          <div className="plan-row">
            {PLAN_TYPES.map(p => (
              <button
                key={p}
                className={`plan-btn${plan === p ? " active" : ""}`}
                onClick={() => setPlan(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            className="submit-btn"
            disabled={loading || !denial.trim()}
            onClick={analyze}
          >
            {loading ? "Analyzing..." : "Analyze & Build My Appeal"}
          </button>
        </div>
      </section>

      {/* RESULTS ANCHOR */}
      <div ref={resultsRef} />

      {/* LOADING */}
      {loading && (
        <div className="wrap">
          <div className="loading-wrap">
            <div className="dots" aria-label="Analyzing">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
            <p className="loading-msg">{LOADING_MSGS[msgIdx]}</p>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="wrap">
          <div className="error-block">
            <p className="error-text">
              Something went wrong while analyzing your denial. This is usually temporary.
              Your data was not saved or shared.
            </p>
            <button className="retry-btn" onClick={analyze}>Try again</button>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {result && (
        <section className="results-section">
          <div className="wrap">
            <p className="sec-label">// appeal analysis</p>

            {/* Panel A — Why denied */}
            <div className="panel panel-red">
              <div className="panel-head">
                <p className="panel-title">What happened</p>
                <h2 className="panel-h2">Why They Denied You</h2>
              </div>
              <div className="panel-body">
                <p>{result.denial_reason}</p>
              </div>
            </div>

            {/* Panel B — Rights */}
            <div className="panel panel-amber">
              <div className="panel-head">
                <p className="panel-title">Know your rights · {plan}</p>
                <h2 className="panel-h2">You Have the Right to Appeal</h2>
              </div>
              <div className="panel-body">
                <p>{result.user_rights}</p>
                <div className="rights-deadline">
                  ⚠ Act within your appeal window — delays forfeit your rights
                </div>
              </div>
            </div>

            {/* Panel C — Letter */}
            <div className="panel panel-letter">
              <div className="panel-head">
                <p className="panel-title">Ready to send</p>
                <h2 className="panel-h2">Your Appeal Letter</h2>
              </div>
              <div className="letter-wrap">
                <div className="letter-body">
                  {renderLetter(result.appeal_letter)}
                </div>
              </div>
              <div className="letter-actions">
                <button
                  className={`letter-btn${copied ? " copied" : ""}`}
                  onClick={copyLetter}
                >
                  {copied ? "Copied ✓" : "Copy letter"}
                </button>
                <button className="letter-btn" onClick={downloadLetter}>
                  Download .txt
                </button>
              </div>
            </div>

            {/* Panel D — Steps */}
            <div className="panel panel-steps">
              <div className="panel-head">
                <p className="panel-title">Action plan</p>
                <h2 className="panel-h2">Your Next 3 Steps</h2>
              </div>
              <ul className="steps-list">
                {result.next_steps.map((step, i) => (
                  <li key={i} className="step-item">
                    <span className="step-num">0{i + 1}</span>
                    <span className="step-text">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <p className="footer-text">
            AppealKit is a free tool built to help patients understand their rights.
            This is not legal advice. For complex cases, contact a patient advocate
            or healthcare attorney. &nbsp;·&nbsp; Built with care, not VC money.
          </p>
        </div>
      </footer>
    </>
  );
}
