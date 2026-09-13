import { describe, expect, it } from "vitest";
import { analyzeEmail } from "./analysis";

describe("analyzeEmail", () => {
  it("flags an obvious phishing email with a lookalike domain", () => {
    const raw = [
      "From: security@facebok.com",
      "To: alex@northstar.design",
      "Subject: Urgent: Verify your account within 24 hours",
      "Date: Tue, 10 Sep 2026 08:42:11 +0000",
      "DKIM-Signature: v=1; a=rsa-sha256; d=facebok.com",
      "",
      "Hello,",
      "",
      "We detected unusual activity on your account. Confirm your identity now or your account will be permanently suspended.",
      "",
      "Sign in here: http://facebok.com/login",
      "",
      "Facebook Security Team",
    ].join("\n");

    const result = analyzeEmail(raw);

    expect(result.category).toBe("Likely Phishing");
    expect(result.tone).toBe("phish");
    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.score).toBe(67);
    expect(result.flags).toContainEqual(
      expect.objectContaining({
        tone: "critical",
        weight: 45,
        title: "Sender domain impersonates facebook.com",
      }),
    );
    expect(result.suspiciousLinks).toHaveLength(0);
  });

  it("marks a legitimate email as likely safe", () => {
    const raw = [
      "From: updates@northstar.design",
      "To: alex@northstar.design",
      "Subject: Your September product digest",
      "Date: Mon, 09 Sep 2026 16:08:03 +0000",
      "DKIM-Signature: v=1; a=rsa-sha256; d=northstar.design",
      "",
      "Hi Alex,",
      "",
      "Here are the three product notes we published this week. Read them when you have a moment.",
      "",
      "View the digest in your workspace: https://northstar.design/notes",
      "",
      "The Northstar team",
    ].join("\n");

    const result = analyzeEmail(raw);

    expect(result.category).toBe("Likely Safe");
    expect(result.tone).toBe("safe");
    expect(result.score).toBe(3);
    expect(result.flags).toHaveLength(0);
    expect(result.domain).toBe("northstar.design");
    expect(result.suspiciousLinks).toHaveLength(0);
  });

  it("treats a link/sender domain mismatch with no lookalike as suspicious", () => {
    const raw = [
      "From: billing@cloudbox-mail.com",
      "To: alex@northstar.design",
      "Subject: Invoice #8492 is ready",
      "Date: Mon, 09 Sep 2026 11:17:49 +0000",
      "",
      "Hi Alex,",
      "",
      "Your latest invoice is available for review. Please sign in to confirm your payment details.",
      "",
      "Open invoice: https://cloudbox-payments.co/invoice/8492",
      "",
      "CloudBox Billing",
    ].join("\n");

    const result = analyzeEmail(raw);

    expect(result.category).toBe("Suspicious");
    expect(result.tone).toBe("suspicious");
    expect(result.score).toBeGreaterThanOrEqual(25);
    expect(result.score).toBeLessThan(60);
    expect(result.score).toBe(46);
    expect(result.flags).toContainEqual(
      expect.objectContaining({
        tone: "warning",
        title: "Link destination differs from sender domain",
      }),
    );
    expect(result.flags.some((flag) => flag.tone === "critical")).toBe(false);
    expect(result.suspiciousLinks).toContain("https://cloudbox-payments.co/invoice/8492");
  });
});