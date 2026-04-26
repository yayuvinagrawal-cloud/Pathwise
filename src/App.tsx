import React, { useState, useCallback, useRef, useEffect } from 'react';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;700&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background: #08090d;
  color: #f2efe7;
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-wrap {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.noise-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
}

/* NAV */
.nav { padding: 28px 0; border-bottom: 1px solid #252938; display: flex; align-items: center; justify-content: space-between; }
.nav-logo { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500; color: #f2efe7; letter-spacing: 0.06em; }
.nav-logo span { color: #f0b35a; }
.nav-tag { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #8a8f9f; border: 1px solid #252938; padding: 4px 10px; border-radius: 2px; }

/* HERO */
.hero { padding: 92px 0 72px; border-bottom: 1px solid #252938; }
.hero-inner { display: flex; }
.hero-rule { width: 3px; background: #f0b35a; border-radius: 2px; flex-shrink: 0; margin-right: 32px; }
.hero-body { flex: 1; }
.hero-eyebrow { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #f0b35a; margin-bottom: 20px; }
.hero-h1 { font-family: 'DM Serif Display', serif; font-size: clamp(42px, 6.5vw, 64px); line-height: 1.05; letter-spacing: -1.5px; color: #f2efe7; margin-bottom: 20px; }
.hero-h1 em { font-style: italic; color: #f0b35a; }
.hero-sub { font-size: 17px; font-weight: 300; color: #8a8f9f; line-height: 1.7; max-width: 520px; margin-bottom: 36px; }
.trust-row { display: flex; gap: 24px; flex-wrap: wrap; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.06em; color: #8a8f9f; border-top: 1px solid #252938; padding-top: 28px; }
.trust-row span { display: flex; align-items: center; gap: 6px; }

.cta-btn { font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #f0b35a; border: 1px solid #f0b35a; background: transparent; padding: 14px 28px; border-radius: 4px; cursor: pointer; transition: background 0.15s, color 0.15s; display: inline-block; margin-top: 8px; }
.cta-btn:hover { background: #f0b35a; color: #08090d; }

/* SECTION */
.section { padding: 68px 0; }
.sec-label { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #8a8f9f; margin-bottom: 24px; display: flex; align-items: center; gap: 14px; }
.sec-label::after { content: ''; flex: 1; height: 1px; background: #252938; }

/* INPUT */
.textarea { width: 100%; min-height: 200px; background: #11131a; border: 1px solid #252938; border-radius: 6px; color: #f2efe7; font-family: 'DM Mono', monospace; font-size: 13px; line-height: 1.8; padding: 18px 20px; resize: vertical; outline: none; transition: border-color 0.15s; caret-color: #f0b35a; }
.textarea:focus { border-color: #f0b35a; }
.textarea::placeholder { color: #8a8f9f; }

.chips-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0 28px; }
.chip { font-family: 'DM Mono', monospace; font-size: 11px; color: #8a8f9f; border: 1px solid #252938; background: transparent; padding: 6px 14px; border-radius: 4px; cursor: pointer; transition: border-color 0.15s, color 0.15s; letter-spacing: 0.02em; }
.chip:hover { border-color: #f0b35a; color: #f2efe7; }

.mode-group { margin-bottom: 32px; }
.mode-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #8a8f9f; margin-bottom: 10px; }
.mode-options { display: flex; flex-wrap: wrap; gap: 8px; }
.mode-btn { font-family: 'DM Mono', monospace; font-size: 11px; color: #8a8f9f; border: 1px solid #252938; background: transparent; padding: 8px 16px; border-radius: 4px; cursor: pointer; transition: all 0.15s; letter-spacing: 0.03em; }
.mode-btn.active { border-color: #f0b35a; color: #f0b35a; background: rgba(240,179,90,0.08); }
.mode-btn:hover:not(.active) { border-color: #5b8cff; color: #f2efe7; }

.submit-btn { width: 100%; height: 52px; background: transparent; border: 1px solid #f0b35a; color: #f0b35a; font-family: 'DM Mono', monospace; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.15s; border-radius: 4px; display: flex; align-items: center; justify-content: center; gap: 8px; }
.submit-btn:hover:not(:disabled) { background: #f0b35a; color: #08090d; }
.submit-btn:disabled { opacity: 0.3; cursor: not-allowed; border-color: #252938; color: #8a8f9f; }

.loading-box { margin: 40px 0; padding: 28px 24px; background: #11131a; border: 1px solid #252938; border-radius: 8px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
.dots { display: flex; gap: 8px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #f0b35a; animation: pulse 1.4s infinite ease-in-out; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes pulse { 0%,100% { opacity:0.2; transform:scale(0.8); } 50% { opacity:1; transform:scale(1); } }
.loading-msg { font-family: 'DM Mono', monospace; font-size: 12px; color: #8a8f9f; letter-spacing: 0.04em; }

/* RESULTS */
@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
.results { animation: fadeUp 0.45s ease both; }
.panel { background: #11131a; border: 1px solid #252938; border-radius: 8px; padding: 28px 24px; margin-bottom: 16px; }
.panel-head { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #8a8f9f; margin-bottom: 12px; }
.panel-h2 { font-family: 'DM Serif Display', serif; font-size: 22px; line-height: 1.3; color: #f2efe7; margin-bottom: 12px; }
.panel-body { font-size: 15px; color: #c2beb6; line-height: 1.7; }
.misread-bar-outer { height: 6px; background: #171a23; border-radius: 4px; margin-top: 12px; overflow: hidden; }
.misread-bar-inner { height: 100%; border-radius: 4px; background: #f0b35a; transition: width 0.4s ease; }

.copy-btn { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.06em; color: #f2efe7; background: #171a23; border: 1px solid #252938; padding: 8px 16px; border-radius: 4px; cursor: pointer; transition: all 0.15s; display: inline-flex; align-items: center; gap: 6px; }
.copy-btn:hover { border-color: #f0b35a; }
.copied-hint { color: #6bd49b; margin-left: 8px; font-size: 11px; }

.download-btn { border-color: #5b8cff; color: #5b8cff; background: transparent; margin-left: 10px; }
.download-btn:hover { background: #5b8cff; color: #08090d; }

.tabs-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.tab { font-family: 'DM Mono', monospace; font-size: 12px; color: #8a8f9f; background: transparent; border: 1px solid #252938; padding: 6px 14px; border-radius: 4px; cursor: pointer; transition: 0.15s; }
.tab.active { border-color: #f0b35a; color: #f0b35a; }
.tab:hover:not(.active) { border-color: #5b8cff; color: #f2efe7; }

.footer { padding: 32px 0 48px; border-top: 1px solid #252938; margin-top: 32px; }
.footer-text { font-family: 'DM Mono', monospace; font-size: 11px; line-height: 1.6; color: #8a8f9f; letter-spacing: 0.02em; }

.reset-btn { font-family: 'DM Mono', monospace; font-size: 11px; color: #ef6461; border: 1px solid #252938; background: transparent; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 24px; transition: 0.15s; }
.reset-btn:hover { border-color: #ef6461; color: #ef6461; }

@media (max-width: 640px) {
  .hero { padding: 60px 0 48px; }
  .hero-rule { margin-right: 18px; }
  .hero-h1 { font-size: 36px; }
  .cta-btn { width: 100%; text-align: center; }
  .trust-row { gap: 16px; }
  .textarea { min-height: 160px; }
}
`;

type Mode = 'balanced' | 'harsh' | 'supportive' | 'strategist';
type LensTab = 'me' | 'them' | 'outsider' | 'future';

interface Analysis {
  yourPerspective: string;
  theirPerspective: string;
  neutralTruth: string;
  misreadRisk: number;
  bestMove: string;
  textToSend: string;
  lenses: Record<LensTab, string>;
}

const EXAMPLE_CHIPS = [
  { label: 'Left on read', text: "My friend left me on read for 6 hours after I asked if they were mad. They were online but didn't reply. Now I feel like they are ignoring me." },
  { label: 'Friend acting different', text: "My best friend has been distant all week. We used to talk every day and now she barely responds. I don't know if I did something wrong." },
  { label: 'Group chat ignored me', text: "In our group chat, I shared a personal story and no one replied for 2 hours. They talked about other stuff right after. I feel invisible." },
  { label: 'Teacher gave unfair grade', text: "My teacher gave me a C on the essay, but I spent days on it. The feedback says I didn't follow the prompt, but I really think I did." },
  { label: 'Teammate sold the game', text: "Last night, my teammate in competitive ranked game repeatedly made bad calls and we lost. Now everyone is blaming each other in chat." },
  { label: 'Should I send this text?', text: "I typed a long message to my ex but I'm not sure if I should send it. I don't want to regret it later." },
];

const MODE_OPTIONS: { key: Mode; label: string }[] = [
  { key: 'balanced', label: 'Balanced' },
  { key: 'harsh', label: 'Harsh truth' },
  { key: 'supportive', label: 'Supportive' },
  { key: 'strategist', label: 'Social strategist' },
];

const LOADING_MESSAGES = [
  "Reading the situation...",
  "Checking your assumptions...",
  "Looking from their side...",
  "Finding the cleanest move...",
];

// -------------- AI simulation --------------
function analyzeSituation(input: string, mode: Mode): Analysis {
  const lower = input.toLowerCase();
  const hasRead = /left on read/i.test(lower) || /read receipt/i.test(lower);
  const hasIgnored = /ignored|ghosting|not replying|no response/i.test(lower);
  const hasTeacher = /teacher|professor|grade|assignment|essay|feedback/i.test(lower);
  const hasTeammate = /teammate|game|sold|grief|team/i.test(lower);
  const hasFriend = /friend|buddy|best friend|pal/i.test(lower);
  const hasText = /text|message|send|should i send/i.test(lower);

  let yourPerspective = "";
  let theirPerspective = "";
  let neutralTruth = "";
  let misreadRisk = 50;
  let bestMove = "";
  let textToSend = "";

  if (hasRead || hasIgnored) {
    yourPerspective = "You're likely feeling anxious, slighted, or even disrespected. The waiting creates a sense of powerlessness and makes you question your own importance to the other person.";
    theirPerspective = "They might be overwhelmed, distracted, or unsure how to respond. Being online doesn't equal availability — people open apps without engaging. They may not realize the impact of the delay.";
    neutralTruth = "You have a timestamp and silence. There's no proof of malice. Digital signals are often misleading. You're filling the gap with assumptions.";
    misreadRisk = 65;
    bestMove = "Give it space. Do not double-text or demand an explanation. Focus on something that makes you feel grounded.";
    textToSend = "Hey, no rush at all — just wanted to check if you're okay. Let me know when you're free.";
  } else if (hasTeacher) {
    yourPerspective = "You feel unfairly judged and maybe undervalued. You put effort into something and the feedback dismisses it. It hurts your sense of fairness.";
    theirPerspective = "Teachers grade according to rubrics, sometimes missing the nuance of your effort. They may be overworked or interpreting guidelines strictly. It's rarely personal.";
    neutralTruth = "Two things can be true: you worked hard and the output didn't fully meet the assignment's requirements. Clarify the mismatch before assuming bias.";
    misreadRisk = 45;
    bestMove = "Request a short meeting or email to ask specific questions about the feedback. Frame it as wanting to improve, not argue.";
    textToSend = "Hi [teacher's name], I really appreciate the feedback on my essay. Could we talk briefly about the prompt alignment? I want to make sure I understand for next time.";
  } else if (hasTeammate) {
    yourPerspective = "You're frustrated because someone else's actions affected your performance. It's easy to blame them entirely, but there might be more going on.";
    theirPerspective = "They may have been stressed, distracted by real life, or simply having a bad day. Poor performance is sometimes unintentional.";
    neutralTruth = "One game won't define anyone. Assigning full blame often ignores other variables. Constructive feedback goes further than shame.";
    misreadRisk = 55;
    bestMove = "Cool off before speaking. Suggest a relaxed team chat focusing on improvement, not anger.";
    textToSend = "Hey, tough game last night. I think we all made mistakes. Let's regroup and try again with a clear plan.";
  } else {
    yourPerspective = "Your feelings are valid. When things don't go as expected, the mind fills in worst-case stories.";
    theirPerspective = "The other side has their own context, pressures, and blind spots. They may not even know you're hurt.";
    neutralTruth = "You have a puzzle made of partial facts. Much of the story is still unwritten.";
    misreadRisk = 60;
    bestMove = "Take a breath. Sleep on it if possible. Try to communicate openly rather than assume.";
    textToSend = "I value our connection and I want to clear things up. Can we talk when you're free?";
  }

  // Adjust tone based on mode
  if (mode === 'harsh') {
    yourPerspective = yourPerspective.replace(/maybe|perhaps|possibly/g, 'clearly');
    bestMove = `Stop overthinking. ${bestMove}`;
    textToSend = textToSend.replace(/,/g, '.');
  } else if (mode === 'supportive') {
    yourPerspective = `It's completely understandable to feel this way. ${yourPerspective}`;
    bestMove = `Be kind to yourself. ${bestMove}`;
  } else if (mode === 'strategist') {
    bestMove = `Tactically: ${bestMove} This protects your standing and gives you more information.`;
    textToSend = textToSend + ' (Sent after 24 hours to appear unhurried.)';
  }

  const lenses: Record<LensTab, string> = {
    me: `From your view: ${yourPerspective}`,
    them: `From their possible view: ${theirPerspective}`,
    outsider: `A neutral observer would see: ${neutralTruth}`,
    future: `In a year, this will likely feel small. The lesson here is about managing expectations and communication.`,
  };

  return {
    yourPerspective,
    theirPerspective,
    neutralTruth,
    misreadRisk,
    bestMove,
    textToSend,
    lenses,
  };
}

export default function FrameShift() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('balanced');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [lensTab, setLensTab] = useState<LensTab>('me');
  const resultsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleAnalyze = useCallback(() => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setLoadingMsgIdx(0);
    setCopied(false);
    timerRef.current = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1600);

    // Simulate AI delay
    setTimeout(() => {
      const analysis = analyzeSituation(input, mode);
      if (timerRef.current) clearInterval(timerRef.current);
      setResult(analysis);
      setLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 2200);
  }, [input, mode, loading]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    if (!result) return;
    const content = `FrameShift AI Analysis\n\nYour Perspective:\n${result.yourPerspective}\n\nTheir Perspective:\n${result.theirPerspective}\n\nNeutral Truth:\n${result.neutralTruth}\n\nMisread Risk: ${result.misreadRisk}%\n\nBest Move:\n${result.bestMove}\n\nMessage:\n${result.textToSend}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FrameShift_Analysis.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
    setLoading(false);
    setCopied(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="noise-bg" aria-hidden="true" />

      <div className="app-wrap">
        {/* Nav */}
        <nav className="nav">
          <div className="nav-logo">Frame<span>Shift</span> AI</div>
          <div className="nav-tag">Perspective analysis</div>
        </nav>

        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-rule" aria-hidden="true" />
            <div className="hero-body">
              <p className="hero-eyebrow">Pause before you react</p>
              <h1 className="hero-h1">
                See the other side<br />
                <em>before you react.</em>
              </h1>
              <p className="hero-sub">
                FrameShift AI breaks down messy situations from your view, their view, and the neutral truth — so you don't overthink, overreact, or make it worse.
              </p>
              <button
                className="cta-btn"
                onClick={() => document.getElementById('input-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Analyze a situation →
              </button>
              <div className="trust-row">
                <span>● Perspective analysis</span>
                <span>● Smart replies</span>
                <span>● Harsh truth mode</span>
              </div>
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section className="section" id="input-section">
          <p className="sec-label">// situation</p>
          <textarea
            className="textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste a text, describe drama, or explain what happened...\n\nExample: My friend left me on read for 6 hours after I asked if they were mad. They were online but didn't reply. Now I feel like they are ignoring me.`}
          />
          <div className="chips-row">
            {EXAMPLE_CHIPS.map((chip) => (
              <button key={chip.label} className="chip" onClick={() => setInput(chip.text)}>
                {chip.label}
              </button>
            ))}
          </div>

          <div className="mode-group">
            <div className="mode-label">Analysis mode</div>
            <div className="mode-options">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  className={`mode-btn${mode === opt.key ? ' active' : ''}`}
                  onClick={() => setMode(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className="submit-btn"
            disabled={!input.trim() || loading}
            onClick={handleAnalyze}
          >
            {loading ? 'Analyzing...' : 'SHIFT THE FRAME'}
          </button>
        </section>

        {/* Loading */}
        {loading && (
          <div className="loading-box">
            <div className="dots">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
            <div className="loading-msg">{LOADING_MESSAGES[loadingMsgIdx]}</div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div ref={resultsRef} className="results">
            <p className="sec-label">// analysis</p>

            <div className="panel">
              <div className="panel-head">Your Perspective</div>
              <h2 className="panel-h2">What you're likely feeling</h2>
              <div className="panel-body">{result.yourPerspective}</div>
            </div>

            <div className="panel">
              <div className="panel-head">Their Perspective</div>
              <h2 className="panel-h2">What the other side may be thinking</h2>
              <div className="panel-body">{result.theirPerspective}</div>
            </div>

            <div className="panel">
              <div className="panel-head">Neutral Truth</div>
              <h2 className="panel-h2">What's actually known vs assumed</h2>
              <div className="panel-body">{result.neutralTruth}</div>
            </div>

            <div className="panel">
              <div className="panel-head">Misread Risk</div>
              <h2 className="panel-h2">How likely you're reading it wrong</h2>
              <div className="panel-body">
                <span style={{ fontSize: '28px', fontFamily: 'DM Serif Display' }}>{result.misreadRisk}%</span>
                <div className="misread-bar-outer">
                  <div className="misread-bar-inner" style={{ width: `${result.misreadRisk}%` }} />
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">Best Move</div>
              <h2 className="panel-h2">Your smartest next action</h2>
              <div className="panel-body">{result.bestMove}</div>
            </div>

            <div className="panel">
              <div className="panel-head">Text You Can Send</div>
              <h2 className="panel-h2">A message ready to go</h2>
              <div className="panel-body">
                <p style={{ fontFamily: 'DM Mono', marginBottom: '14px' }}>"{result.textToSend}"</p>
                <button className="copy-btn" onClick={() => handleCopy(result.textToSend)}>
                  {copied ? 'Copied ✓' : 'Copy message'}
                </button>
                <button className="copy-btn download-btn" onClick={handleDownload}>
                  Download analysis
                </button>
              </div>
            </div>

            {/* Perspective Lens */}
            <div className="panel">
              <div className="panel-head">Perspective Lens</div>
              <div className="tabs-row">
                {(['me', 'them', 'outsider', 'future'] as LensTab[]).map((tab) => (
                  <button
                    key={tab}
                    className={`tab${lensTab === tab ? ' active' : ''}`}
                    onClick={() => setLensTab(tab)}
                  >
                    {tab === 'me' ? 'Me' : tab === 'them' ? 'Them' : tab === 'outsider' ? 'Outsider' : 'Future Me'}
                  </button>
                ))}
              </div>
              <div className="panel-body">{result.lenses[lensTab]}</div>
            </div>

            <button className="reset-btn" onClick={handleReset}>
              ← Analyze another situation
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="footer">
          <p className="footer-text">
            FrameShift AI is for reflection, not manipulation. It helps you slow down before reacting.
          </p>
        </footer>
      </div>
    </>
  );
}
