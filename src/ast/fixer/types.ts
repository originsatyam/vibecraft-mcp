import { SourceLocation, SeverityLevel, AuditConfidence } from "../types.js";

export type FixabilityCategory = "DETERMINISTICALLY_FIXABLE" | "DETECTABLE_BUT_NOT_SAFE_TO_FIX" | "SUBJECTIVE_NON_DETERMINISTIC";

export interface AppliedFix {
  ruleId: string;
  originalValue: string;
  replacementValue: string;
  reason: string;
  sourceLocation?: SourceLocation;
  confidence: AuditConfidence;
  deterministic: true;
}

export interface SkippedFix {
  ruleId: string;
  category: FixabilityCategory;
  reason: string;
  originalValue?: string;
  sourceLocation?: SourceLocation;
}

export interface FixerOptions {
  rulesToFix?: string[];
  safeMode?: boolean;
}

export interface FixerResult {
  originalCode: string;
  fixedCode: string;
  verificationStatus: "PASS" | "PARTIAL_PASS" | "REJECTED_ROLLBACK" | "NO_CHANGES_REQUIRED";
  fixesAppliedCount: number;
  fixesSkippedCount: number;
  fixesApplied: AppliedFix[];
  fixesSkipped: SkippedFix[];
  remainingViolations: any[];
  idempotent: boolean;
}
