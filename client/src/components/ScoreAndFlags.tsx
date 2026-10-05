import type { Analysis } from "../lib/analysis";

function scoreLabel(score: number) {
  if (score >= 60) return "Suspicious to phishing range";
  if (score >= 25) return "Worth a closer look";
  return "Low risk";
}

export function ScoreAndFlags({ analysis }: { analysis: Analysis }) {
  return (
    <section className="results-section">
      <div className="results-head"><h2>Analysis snapshot</h2><span className="mono">SCAN · {analysis.date || "no date header"}</span></div>
      <div className="results-grid">
        <div className="panel score-card">
          <div className="score-top">
            <div><p className="panel-kicker">Risk score</p><div className="score-value">{analysis.score}<span className="score-max">/100</span></div></div>
            <span className="risk-badge">{analysis.category}</span>
          </div>
          <p className="score-copy">{scoreLabel(analysis.score)}. {analysis.flags.length ? `${analysis.flags.length} signal${analysis.flags.length > 1 ? "s" : ""} found.` : "No notable signals found in this message."}</p>
          <div className="meter"><span style={{ width: `${analysis.score}%` }} /></div>
          <div className="meter-labels"><span>Likely safe</span><span>Likely phishing</span></div>
        </div>
        <div className="panel flag-panel">
          <div className="panel-head"><div><p className="panel-kicker">Step 02 · Signals</p><h2 className="panel-title">Flag breakdown</h2></div><span className="panel-caption">{analysis.flags.length} signal{analysis.flags.length === 1 ? "" : "s"} found</span></div>
          <div className="flag-list">
            {analysis.flags.length === 0 && <p style={{ color: "#7891a2", fontSize: 13 }}>No red flags detected by our heuristics. Still use judgment — this is not a guarantee of safety.</p>}
            {analysis.flags.map((flag) => (
              <div className="flag-row" key={flag.title}>
                <span className={`flag-dot ${flag.tone}`} />
                <div><strong>{flag.title}</strong><p>{flag.copy}</p></div>
                <span className={`severity ${flag.tone}`}>{flag.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="panel preview-card">
        <div className="panel-head"><div><p className="panel-kicker">Step 03 · Context</p><h2 className="panel-title">Annotated email preview</h2></div><span className="panel-caption">Suspicious parts highlighted</span></div>
        <div className="preview-body">
          <div className="preview-meta">
            <span>From</span>
            <strong>{analysis.senderName} &lt;{analysis.senderAddress}&gt;</strong>
            <span>Subject</span>
            <strong>{analysis.subject}</strong>
            <span>Received</span>
            <span>{analysis.date || "unknown"}</span>
          </div>
          <p className="email-copy" style={{ whiteSpace: "pre-wrap" }}>
            {analysis.body.split(/(https?:\/\/[^\s)]+|\bunusual activity\b|\bsuspended\b|\bimmediately\b|\b24 hours\b|\bverify your information\b|\bverify your account\b|\bact now\b|\bur urgent\b|\bconfirm your payment\b|\bclick here\b|\blimited time\b)/gi).map((chunk, i) => {
              if (!chunk) return null;
              if (/^https?:\/\//i.test(chunk)) {
                if (analysis.suspiciousLinks.includes(chunk)) {
                  return <span className="highlight-red" key={i}>{chunk}</span>;
                }
                // Also highlight lookalike URLs in red (critical-like visual cue)
                return <span className="highlight-red" key={i}>{chunk}</span>;
              }
              const lower = chunk.toLowerCase();
              if (["unusual activity", "suspended", "immediately", "24 hours", "verify your information", "verify your account", "act now", "urgent", "confirm your payment", "click here", "limited time"].includes(lower)) {
                return <span className="highlight-amber" key={i}>{chunk}</span>;
              }
              return chunk;
            })}
          </p>
          <div className="preview-legend">
            <span>Highlighted signals</span>
            <span className="legend-item"><i className="flag-dot critical" />Critical</span>
            <span className="legend-item"><i className="flag-dot warning" />Warning</span>
          </div>
        </div>
      </div>
    </section>
  );
}