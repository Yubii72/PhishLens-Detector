export function EmptyState({ analyzing }: { analyzing: boolean }) {
  if (analyzing) {
    return <div className="panel loading-card"><div className="spinner" /><h3>Analyzing email signals</h3><p>Checking headers, links, and language patterns...</p></div>;
  }
  return <div className="panel empty-card"><h3>No analysis yet</h3><p>Paste an email source or load a sample to see the risk profile, flags, and annotated preview here.</p></div>;
}