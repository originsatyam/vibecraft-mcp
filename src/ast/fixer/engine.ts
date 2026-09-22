import { runASTUxAudit } from "../engine.js";
import { parseTsxSource } from "../parser.js";
import { traverseAST } from "../traverser.js";
import { transformCodeAST } from "./transformer.js";
import { verifyAndValidateFixes } from "./verifier.js";
import { FixerOptions, FixerResult } from "./types.js";

export function runASTUxFixer(code: string, options: FixerOptions = {}): FixerResult {
  const { rulesToFix, safeMode = true } = options;

  // Step 1: Pre-Audit Code
  const preAudit = runASTUxAudit(code);

  // If no violations exist, code is already 100% compliant
  if (preAudit.violationsCount === 0 && preAudit.findings.every(f => f.status !== "FAIL" && f.status !== "WARNING")) {
    return {
      originalCode: code,
      fixedCode: code,
      verificationStatus: "NO_CHANGES_REQUIRED",
      fixesAppliedCount: 0,
      fixesSkippedCount: 0,
      fixesApplied: [],
      fixesSkipped: [],
      remainingViolations: [],
      idempotent: true
    };
  }

  // Step 2: Parse AST Context
  const parseRes = parseTsxSource(code);
  if (!parseRes.ast) {
    return {
      originalCode: code,
      fixedCode: code,
      verificationStatus: "REJECTED_ROLLBACK",
      fixesAppliedCount: 0,
      fixesSkippedCount: 1,
      fixesApplied: [],
      fixesSkipped: [
        {
          ruleId: "syntax_parse_error",
          category: "DETECTABLE_BUT_NOT_SAFE_TO_FIX",
          reason: "Code contains syntax errors and cannot be safely parsed into an AST for transformation."
        }
      ],
      remainingViolations: preAudit.findings.filter(f => f.status === "FAIL" || f.status === "WARNING"),
      idempotent: false
    };
  }

  const context = traverseAST(parseRes.ast, code);

  // Step 3: Transform Code AST
  const { transformedCode, fixesApplied, fixesSkipped } = transformCodeAST(context, preAudit.findings, rulesToFix);

  // Step 4: Verify and Validate Fixes
  return verifyAndValidateFixes(code, transformedCode, fixesApplied, fixesSkipped);
}
