import { useState } from "react";
import { FileText, Search, UploadCloud } from "lucide-react";

type SampleEmail = { label: string; value: string };

const sampleEmails: SampleEmail[] = [
  {
    label: "Obvious phishing",
    value: "From: security-alert@micr0soft-support.com\nTo: alex@northstar.design\nSubject: Urgent: Your account will be closed\nDate: Tue, 10 Sep 2026 08:42:11 +0000\n\nHello,\n\nWe detected unusual activity. Verify your account within 24 hours or it will be permanently suspended.\n\nConfirm your identity now: https://micr0soft-security-check.com/verify\n\nMicrosoft Security Team",
  },
  {
    label: "Legitimate email",
    value: "From: updates@northstar.design\nTo: alex@northstar.design\nSubject: Your September product digest\nDate: Mon, 09 Sep 2026 16:08:03 +0000\n\nHi Alex,\n\nHere are the three product notes we published this week. Nothing urgent — read them when you have a moment.\n\nView the digest in your workspace: https://northstar.design/notes\n\nThe Northstar team",
  },
  {
    label: "Borderline / suspicious",
    value: "From: billing@cloudbox-mail.com\nTo: alex@northstar.design\nSubject: Invoice #8492 is ready\nDate: Mon, 09 Sep 2026 11:17:49 +0000\n\nHi Alex,\n\nYour latest invoice is available for review. Please sign in to confirm your payment details.\n\nOpen invoice: https://cloudbox-payments.co/invoice/8492\n\nCloudBox Billing",
  },
];

export function InputPanel({ email, setEmail, onAnalyze }: { email: string; setEmail: (v: string) => void; onAnalyze: () => void }) {
  const [method, setMethod] = useState<"paste" | "upload">("paste");
  const [selectedSample, setSelectedSample] = useState("");
  const [uploadError, setUploadError] = useState("");

  const loadSample = (sample: SampleEmail) => {
    setEmail(sample.value);
    setSelectedSample(sample.label);
    setMethod("paste");
  };

  const handleFile = async (file: File) => {
    setUploadError("");
    try {
      const text = await file.text();
      setEmail(text);
      setSelectedSample("");
      setMethod("paste");
    } catch {
      setUploadError("Couldn't read that file. Try pasting the source instead.");
    }
  };

  return (
    <div className="panel input-panel">
      <div className="panel-head"><div><p className="panel-kicker">Step 01 · Input</p><h2 className="panel-title">Bring in an email</h2></div><span className="panel-caption">.eml or raw source</span></div>
      <div className="input-body">
        <div className="method-tabs" role="tablist" aria-label="Email input method">
          <button className={`method-tab ${method === "paste" ? "active" : ""}`} onClick={() => setMethod("paste")}><FileText size={14} />Paste source</button>
          <button className={`method-tab ${method === "upload" ? "active" : ""}`} onClick={() => setMethod("upload")}><UploadCloud size={14} />Upload .eml</button>
        </div>
        {method === "paste" ? (
          <>
            <textarea className="email-textarea" aria-label="Raw email source" value={email} onChange={(event) => { setEmail(event.target.value); setSelectedSample(""); }} placeholder="Paste raw email source here...&#10;&#10;Include headers for the most accurate analysis." />
            <div className="input-foot"><span>{email.length ? `${email.length.toLocaleString()} characters` : "Nothing pasted yet"}</span><span className="mono">UTF-8 · raw source</span></div>
          </>
        ) : (
          <label className="file-drop" aria-label="Upload an EML file">
            <input
              type="file"
              accept=".eml,.txt,message/rfc822"
              style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <div>
              <div className="file-drop-icon"><UploadCloud size={21} /></div>
              <strong>Drop an .eml file here</strong>
              <p>or click to browse your device</p>
              {uploadError && <p style={{ color: "#e08585" }}>{uploadError}</p>}
              {email && method === "upload" && <p>Loaded {email.length.toLocaleString()} characters</p>}
            </div>
          </label>
        )}
        <div className="sample-row"><span className="sample-label">Try a sample</span>{sampleEmails.map((sample) => <button key={sample.label} className={`sample-btn ${selectedSample === sample.label ? "active" : ""}`} onClick={() => loadSample(sample)}>{sample.label}</button>)}</div>
        <button className="analyze-btn" onClick={onAnalyze} disabled={!email.trim()}><Search size={16} />Analyze email</button>
      </div>
    </div>
  );
}