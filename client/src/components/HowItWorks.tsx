import { ChevronDown } from "lucide-react";

export function HowItWorks() {
  return (
    <div className="panel how-card">
      <details open>
        <summary>How this works <ChevronDown size={16} /></summary>
        <div className="how-body">
          <div className="how-step"><span className="step-no">01</span><div><strong>Header checks</strong><span>We inspect sender domain against known brands and check for authentication headers.</span></div></div>
          <div className="how-step"><span className="step-no">02</span><div><strong>Link analysis</strong><span>We compare link destinations against the sender's domain to catch mismatches.</span></div></div>
          <div className="how-step"><span className="step-no">03</span><div><strong>Keyword scanning</strong><span>We look for urgency, impersonation, and high-pressure language patterns.</span></div></div>
        </div>
      </details>
    </div>
  );
}