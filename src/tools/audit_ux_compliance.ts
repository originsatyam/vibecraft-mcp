import { runASTUxAudit } from "../ast/engine.js";

export function handleAuditUxCompliance(args: { codeOrPrompt: string; componentType?: string }) {
  const { codeOrPrompt } = args;

  const astResult = runASTUxAudit(codeOrPrompt);

  // Map AST findings to legacy violations array for 100% backwards compatibility
  const violations = astResult.findings
    .filter(f => f.status === "FAIL" || f.status === "WARNING")
    .map(f => ({
      ruleId: f.ruleId,
      title: f.title,
      issue: f.issue,
      recommendation: f.suggestedRemediation,
      severity: f.severity,
      confidence: f.confidence,
      status: f.status,
      evidence: f.evidence,
      sourceLocation: f.sourceLocation
    }));

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            auditStatus: astResult.auditStatus,
            craftScore: astResult.craftScore,
            penaltyPoints: astResult.penaltyPoints,
            violationsCount: violations.length,
            parseSuccess: astResult.parseSuccess,
            astFindingsSummary: astResult.summary,
            violations,
            astFindings: astResult.findings,
            generalGuidance: "Ensure code uses HSL semantic color variables, calculated corner math, 4pt/8pt grid spacing, icons with aria-labels, and single primary CTA buttons."
          },
          null,
          2
        )
      }
    ]
  };
}
