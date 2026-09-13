// ---------- Analysis engine ----------

export type Category = "Likely Phishing" | "Likely Safe" | "Suspicious";
export type Tone = "phish" | "safe" | "suspicious";

export type Flag = { tone: "critical" | "warning" | "info"; title: string; copy: string; label: string; weight: number };

export type Analysis = {
  score: number;
  category: Category;
  tone: Tone;
  flags: Flag[];
  fromRaw: string;
  senderName: string;
  senderAddress: string;
  domain: string;
  subject: string;
  date: string;
  body: string;
  suspiciousLinks: string[];
  highlightedLinks: string[];
};

export const TRUSTED_BRANDS = [
  "microsoft.com", "office.com", "outlook.com", "google.com", "gmail.com",
  "apple.com", "icloud.com", "paypal.com", "amazon.com", "facebook.com",
  "instagram.com", "netflix.com", "bankofamerica.com", "chase.com", "wellsfargo.com",
  "dropbox.com", "linkedin.com", "adobe.com", "dhl.com", "fedex.com", "usps.com",
];

export const URGENCY_PHRASES = [
  "urgent", "act now", "verify your account", "verify your identity", "24 hours",
  "immediately", "suspended", "permanently suspended", "confirm your identity",
  "limited time", "click here", "unusual activity", "account will be closed",
  "final notice", "confirm your payment", "sign in to confirm", "unauthorized access",
];

export function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

export function normalizeLeet(s: string): string {
  return s
    .replace(/rn/g, "m")
    .replace(/0/g, "o")
    .replace(/1/g, "l")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b");
}

export function checkLookalike(domain: string): string | null {
  if (!domain) return null;
  for (const brand of TRUSTED_BRANDS) {
    if (domain === brand || domain.endsWith("." + brand)) return null; // real brand domain or a genuine subdomain of it
  }
  const domainCore = domain.split(".").slice(0, -1).join(".").toLowerCase();
  const normalizedCore = normalizeLeet(domainCore);
  const segments = new Set([
    ...domainCore.split(/[^a-z0-9]+/).filter(Boolean),
    ...normalizedCore.split(/[^a-z0-9]+/).filter(Boolean),
  ]);

  for (const brand of TRUSTED_BRANDS) {
    const brandCore = brand.split(".")[0];
    if (brandCore.length < 3) continue;
    for (const seg of segments) {
      const dist = levenshtein(seg, brandCore);
      if (dist === 0) return brand; // brand name used verbatim as a word inside a non-brand domain
      if (brandCore.length <= 5) {
        // short brand names: only same-length substitutions, to avoid matching generic words (e.g. "mail" vs "gmail")
        if (seg.length === brandCore.length && dist === 1) return brand;
      } else {
        const threshold = brandCore.length >= 8 ? 2 : 1;
        if (Math.abs(seg.length - brandCore.length) <= 1 && dist <= threshold) return brand;
      }
      // brand name concatenated with extra text in one token, e.g. "appleid", "paypalsecure"
      if (brandCore.length >= 5 && seg.length > brandCore.length && (seg.startsWith(brandCore) || seg.endsWith(brandCore))) {
        return brand;
      }
    }
  }
  return null;
}

export function parseHeaders(raw: string) {
  raw = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n"); // normalize CRLF / CR line endings first
  const parts = raw.split(/\n\s*\n/);
  const headerBlock = parts[0] || "";
  const body = parts.slice(1).join("\n\n");
  const headers: Record<string, string> = {};
  headerBlock.split("\n").forEach((line) => {
    const m = line.match(/^([A-Za-z-]+):\s*(.*)$/);
    if (m) headers[m[1].toLowerCase()] = m[2].trim();
  });
  return { headers, body };
}

export function parseFromHeader(fromRaw: string) {
  const angled = fromRaw.match(/^(.*?)<([^>]+)>\s*$/);
  if (angled) {
    return { name: angled[1].trim().replace(/^"|"$/g, "") || angled[2], address: angled[2].trim() };
  }
  return { name: fromRaw.trim(), address: fromRaw.trim() };
}

export function extractDomain(address: string): string {
  const m = address.match(/@([\w.-]+)/);
  return m ? m[1].toLowerCase() : "";
}

export function rootDomain(domain: string): string {
  const parts = domain.split(".");
  return parts.length <= 2 ? domain : parts.slice(-2).join(".");
}

export function extractUrls(text: string): string[] {
  return Array.from(text.matchAll(/https?:\/\/[^\s)]+/g)).map((m) => m[0]);
}

export function getInitials(name: string): string {
  const words = name.replace(/[^a-zA-Z\s]/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "??";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function analyzeEmail(raw: string): Analysis {
  const { headers, body } = parseHeaders(raw);
  const fromRaw = headers["from"] || "";
  const { name: senderName, address: senderAddress } = parseFromHeader(fromRaw);
  const domain = extractDomain(senderAddress);
  const subject = headers["subject"] || "(no subject)";
  const date = headers["date"] || "";

  const flags: Flag[] = [];

  const lookalike = checkLookalike(domain);
  if (lookalike) {
    flags.push({
      tone: "critical",
      title: `Sender domain impersonates ${lookalike}`,
      copy: `"${domain}" closely resembles the trusted domain "${lookalike}", likely using character substitution to deceive recipients.`,
      label: "Critical",
      weight: 45,
    });
  }

  const urls = extractUrls(raw);
  const mismatchedUrls = urls.filter((u) => {
    const m = u.match(/^https?:\/\/([^/]+)/);
    const linkDomain = m ? m[1].toLowerCase() : "";
    if (!domain || !linkDomain) return false;
    return rootDomain(linkDomain) !== rootDomain(domain);
  });
  if (mismatchedUrls.length) {
    flags.push({
      tone: "warning",
      title: "Link destination differs from sender domain",
      copy: `This message links to ${mismatchedUrls[0]}, which doesn't match the sender's domain (${domain || "unknown"}).`,
      label: "Warning",
      weight: 22,
    });
  }

  const lowerText = (subject + " " + body).toLowerCase();
  const foundPhrases = URGENCY_PHRASES.filter((p) => lowerText.includes(p));
  if (foundPhrases.length) {
    flags.push({
      tone: "warning",
      title: "Urgent or high-pressure language detected",
      copy: `Phrases like "${foundPhrases[0]}" are commonly used to rush recipients into acting without careful review.`,
      label: "Warning",
      weight: Math.min(22, 8 + foundPhrases.length * 4),
    });
  }

  const hasAuth = Boolean(headers["dkim-signature"] || headers["authentication-results"] || headers["received-spf"]);
  if (!hasAuth) {
    flags.push({
      tone: "info",
      title: "No authentication headers detected",
      copy: "No DKIM, SPF, or Authentication-Results headers were found in the pasted source. This alone isn't proof of a problem, but it means authenticity couldn't be verified.",
      label: "Info",
      weight: 8,
    });
  }

  if (!domain) {
    flags.push({
      tone: "info",
      title: "Could not parse sender address",
      copy: "No valid 'From' header with an email address was found. Paste the full raw source, including headers, for a complete analysis.",
      label: "Info",
      weight: 5,
    });
  }

  let score = flags.reduce((sum, f) => sum + f.weight, 0);
  if (flags.length === 0) score = 3;
  score = Math.max(0, Math.min(100, score));

  let category: Category = "Likely Safe";
  let tone: Tone = "safe";
  if (score >= 60) {
    category = "Likely Phishing";
    tone = "phish";
  } else if (score >= 25) {
    category = "Suspicious";
    tone = "suspicious";
  }

  return {
    score,
    category,
    tone,
    flags,
    fromRaw,
    senderName: senderName || "Unknown sender",
    senderAddress: senderAddress || "unknown",
    domain,
    subject,
    date,
    body,
    suspiciousLinks: mismatchedUrls,
    highlightedLinks: urls,
  };
}