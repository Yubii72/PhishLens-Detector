import { ChevronDown } from "lucide-react";

export function InfoSections() {
  const faqs = [
    ["What does PhishLens analyze?", "PhishLens inspects the sender's domain against a list of commonly impersonated brands, compares link destinations to the sender's domain, scans for urgency and impersonation language, and checks for missing authentication headers."],
    ["Does PhishLens open links in an email?", "No. Links are only parsed as text and compared to the sender's domain — nothing is fetched or opened."],
    ["Can a safe-looking email still be suspicious?", "Yes. Risk scores are signals, not a final verdict. Use the flag explanations and annotated preview to make a more informed decision."],
    ["Is my email content stored?", "Scan history is currently saved only in your browser's local storage on this device. Nothing is sent to a server."],
  ];
  return <section className="info-sections">
    <div id="about" className="panel about-panel">
      <div><p className="panel-kicker">About PhishLens</p><h2 className="info-heading">Make the risky<br />parts <span>visible.</span></h2></div>
      <div className="about-copy"><p>PhishLens is designed as a calm first stop between “this looks odd” and “I clicked it.” It turns opaque email signals into plain-English explanations so you can slow down, inspect the evidence, and choose what to do next.</p><div className="about-points"><span><strong>01</strong>Explainable signals</span><span><strong>02</strong>Fast first pass</span><span><strong>03</strong>Human-readable context</span></div></div>
    </div>
    <div id="faq" className="panel faq-panel"><div className="panel-head"><div><p className="panel-kicker">Need to know</p><h2 className="panel-title">Frequently asked questions</h2></div><span className="panel-caption">About the workflow</span></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={16} /></summary><p>{answer}</p></details>)}</div></div>
  </section>;
}