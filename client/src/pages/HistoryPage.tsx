import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Comparison } from "../components/Comparison";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { HistoryTable } from "../components/HistoryTable";
import { loadHistory, type HistoryEmail } from "../lib/history";

export function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEmail[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const selected = entries.filter((email) => selectedIds.includes(email.id));
  const toggle = (id: string) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 2 ? [...current, id] : current);

  return (
    <>
      <Header active="history" />
      <main className="page-wrap">
        <h1 className="page-heading">Scan <span>history.</span></h1>
        <p className="page-subhead">Revisit previous results, spot patterns, and compare two messages side by side. Your scan history stays local to this browser for now.</p>
        <div className="history-tools">
          <div><h2>Recent scans</h2><p>{entries.length} email{entries.length === 1 ? "" : "s"} analyzed · sorted newest first</p></div>
          <div className="compare-bar">
            <div><ArrowLeftRight size={14} /><span><strong>{selectedIds.length} selected</strong> · choose two to compare</span></div>
            {selectedIds.length === 2 && <button className="compare-btn" onClick={() => document.getElementById("comparison")?.scrollIntoView({ behavior: "smooth" })}>Compare</button>}
          </div>
        </div>
        <HistoryTable entries={entries} selectedIds={selectedIds} onToggle={toggle} />
        <div id="comparison"><Comparison selected={selected} /></div>
        <div className="panel" style={{ marginTop: 24, padding: 19 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div><strong style={{ display: "block", color: "#d8e7ea", fontSize: 12 }}>History is stored locally</strong><span style={{ color: "#7891a2", fontSize: 11 }}>Scans are saved to this browser's local storage. Syncing across devices will connect to an account in a future release.</span></div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}