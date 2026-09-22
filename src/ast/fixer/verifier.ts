import { runASTUxAudit } from "../engine.js";
import { FixerResult, AppliedFix, SkippedFix } from "./types.js";

export function verifyAndValidateFixes(
  originalCode: string,
  transformedCode: string,
  fixesApplied: AppliedFix[],
  fixesSkipped: SkippedFix[]
): FixerResult {
  // Idempotency check: If transformed code matches original code
  if (originalCode.trim() === transformedCode.trim()) {
    const postAudit = runASTUxAudit(originalCode);
    return {
      originalCode,
      fixedCode: originalCode,
      verificationStatus: postAudit.violationsCount === 0 ? "NO_CHANGES_REQUIRED" : "PASS",
      fixesAppliedCount: 0,
      fixesSkippedCount: fixesSkipped.length,
      fixesApplied: [],
      fixesSkipped,
      remainingViolations: postAudit.findings.filter(f => f.status === "FAIL" || f.status === "WARNING"),
      idempotent: true
    };
  }

  // Pre-audit vs Post-audit verification
  const preAudit = runASTUxAudit(originalCode);
  const postAudit = runASTUxAudit(transformedCode);

  const preFailures = preAudit.findings.filter(f => f.status === "FAIL").length;
  const postFailures = postAudit.findings.filter(f => f.status === "FAIL").length;

  // Rollback Safety Check: If post-audit introduced NEW failures that were not present before
  if (postFailures > preFailures) {
    return {
      originalCode,
      fixedCode: originalCode,
      verificationStatus: "REJECTED_ROLLBACK",
      fixesAppliedCount: 0,
      fixesSkippedCount: fixesSkipped.length,
      fixesApplied: [],
      fixesSkipped: [
        ...fixesSkipped,
        {
          ruleId: "rollback_safety_protection",
          category: "DETECTABLE_BUT_NOT_SAFE_TO_FIX",
          reason: "Automated transformation was rejected and rolled back because it introduced a new audit violation."
        }
      ],
      remainingViolations: preAudit.findings.filter(f => f.status === "FAIL" || f.status === "WARNING"),
      idempotent: false
    };
  }

  const remainingViolations = postAudit.findings.filter(f => f.status === "FAIL" || f.status === "WARNING");
  const verificationStatus = remainingViolations.length === 0 ? "PASS" : "PARTIAL_PASS";

  return {
    originalCode,
    fixedCode: transformedCode,
    verificationStatus,
    fixesAppliedCount: fixesApplied.length,
    fixesSkippedCount: fixesSkipped.length,
    fixesApplied,
    fixesSkipped,
    remainingViolations,
    idempotent: false
  };
}
