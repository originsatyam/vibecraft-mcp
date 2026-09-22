import { runASTUxFixer } from "../ast/fixer/engine.js";

export function handleFixUxCompliance(args: { code: string; rules?: string[]; safeMode?: boolean }) {
  const { code, rules, safeMode = true } = args;

  const result = runASTUxFixer(code, { rulesToFix: rules, safeMode });

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            verificationStatus: result.verificationStatus,
            fixesAppliedCount: result.fixesAppliedCount,
            fixesSkippedCount: result.fixesSkippedCount,
            fixedCode: result.fixedCode,
            fixesApplied: result.fixesApplied,
            fixesSkipped: result.fixesSkipped,
            remainingViolations: result.remainingViolations,
            idempotent: result.idempotent,
            guidance: "Deterministic fixes were automatically applied to non-grid spacing, radii, concentric corner math, hex colors, and z-indexes. Subjective visual choices remain untouched."
          },
          null,
          2
        )
      }
    ]
  };
}
