import { useEffect, useRef, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { HowItWorks } from "../components/HowItWorks";
import { InputPanel } from "../components/InputPanel";
import { ScoreAndFlags } from "../components/ScoreAndFlags";
import { analyzeEmail, getInitials, type Analysis } from "../lib/analysis";
import { saveHistoryEntry } from "../lib/history";

export function ScanPage() {
  const [email, setEmail] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (analysis) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [analysis]);

  const analyze = () => {
    if (!email.trim()) return;
    setAnalyzing(true);
    setAnalysis(null);
    window.setTimeout(() => {
      const result = analyzeEmail(email);
      setAnalysis(result);
      setAnalyzing(false);
      saveHistoryEntry({
        id: `scan-${Date.now()}`,
        sender: result.senderName,
        address: result.senderAddress,
        initials: getInitials(result.senderName),
        time: new Date().toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
        score: result.score,
        category: result.category,
        tone: result.tone,
      });
    }, 850);
  };

  return (
    <>
      <Header />
      <main className="page-wrap">
        <div className="dashboard">
          <h1 className="page-heading">See the signal before you <span className="heading-accent">click.</span></h1>
          <p className="page-subhead">Paste raw email source or upload a .eml file for a fast, explainable first pass over headers, links, and language.</p>
          <div className="dash-input"><InputPanel email={email} setEmail={setEmail} onAnalyze={analyze} /></div>
          {analysis ? <div className="dash-results" ref={resultsRef}><ScoreAndFlags analysis={analysis} /></div> : <div className="dash-empty"><EmptyState analyzing={analyzing} /></div>}
          <div className="dash-how"><HowItWorks /></div>
        </div>
      </main>
      <Footer />
    </>
  );
}