import type { HistoryEmail } from "../lib/history";

export function HistoryTable({ entries, selectedIds, onToggle }: { entries: HistoryEmail[]; selectedIds: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="panel history-table">
      <div className="table-row header"><span /> <span>Sender</span><span>Scanned</span><span>Risk score</span><span>Category</span></div>
      {entries.map((email) => <button key={email.id} className="table-row" onClick={() => onToggle(email.id)}><input className="check" type="checkbox" checked={selectedIds.includes(email.id)} onChange={() => onToggle(email.id)} onClick={(event) => event.stopPropagation()} aria-label={`Select ${email.sender} for comparison`} /><span className="sender"><span className="sender-avatar">{email.initials}</span><span className="sender-text"><strong>{email.sender}</strong><span>{email.address}</span></span></span><span className="table-cell">{email.time}</span><span className="risk-number">{String(email.score).padStart(2, "0")} / 100</span><span className={`category ${email.tone}`}>{email.category}</span></button>)}
    </div>
  );
}