import { parseTsxSource } from "./parser.js";
import { traverseAST } from "./traverser.js";
import { analyzeDesignStates } from "./analyzers/state_analyzer.js";
import { analyzeAccessibility } from "./analyzers/accessibility_analyzer.js";
import { analyzeMagicValues } from "./analyzers/magic_value_analyzer.js";
import { analyzeColorAndHierarchy } from "./analyzers/color_and_cta_analyzer.js";
import { ASTFinding } from "./types.js";

export interface ASTAuditResult {
  parseSuccess: boolean;
  parseError?: string;
  auditStatus: "PERFECT_DETERMINISTIC_CRAFT" | "PASSED_HIGH_CRAFT" | "NEEDS_REFACTORING";
  craftScore: string;
  penaltyPoints: number;
  violationsCount: number;
  findings: ASTFinding[];
  summary: {
    passed: number;
    failed: number;
    warnings: number;
    unknowns: number;
  };
}

export function runASTUxAudit(codeOrPrompt: string): ASTAuditResult {
  const parseRes = parseTsxSource(codeOrPrompt);

  if (!parseRes.ast) {
    return {
      parseSuccess: false,
      parseError: parseRes.error || "Failed to parse TSX source code.",
      auditStatus: "NEEDS_REFACTORING",
      craftScore: "0/100",
      penaltyPoints: 100,
      violationsCount: 1,
      findings: [
        {
          ruleId: "syntax_parse_error",
          category: "state",
          severity: "critical",
          status: "FAIL",
          confidence: "HIGH",
          title: "TSX Syntax Parse Failure",
          issue: parseRes.error || "Syntax error prevents structural AST inspection.",
          evidence: codeOrPrompt.substring(0, 100),
          suggestedRemediation: "Ensure input is valid TypeScript/JSX component syntax."
        }
      ],
      summary: { passed: 0, failed: 1, warnings: 0, unknowns: 0 }
    };
  }

  const context = traverseAST(parseRes.ast, codeOrPrompt);

  const findings: ASTFinding[] = [
    ...analyzeDesignStates(context),
    ...analyzeAccessibility(context),
    ...analyzeMagicValues(context),
    ...analyzeColorAndHierarchy(context)
  ];

  let passed = 0;
  let failed = 0;
  let warnings = 0;
  let unknowns = 0;

  let totalPenalties = 0;

  for (const f of findings) {
    if (f.status === "PASS") passed++;
    else if (f.status === "FAIL") {
      failed++;
      if (f.severity === "critical") totalPenalties += 25;
      else if (f.severity === "high") totalPenalties += 15;
      else if (f.severity === "medium") totalPenalties += 10;
      else totalPenalties += 5;
    } else if (f.status === "WARNING") {
      warnings++;
      totalPenalties += 5;
    } else if (f.status === "UNKNOWN") {
      unknowns++;
    }
  }

  const craftScoreNum = Math.max(0, 100 - totalPenalties);
  const auditStatus = craftScoreNum === 100 ? "PERFECT_DETERMINISTIC_CRAFT" : craftScoreNum >= 80 ? "PASSED_HIGH_CRAFT" : "NEEDS_REFACTORING";

  return {
    parseSuccess: true,
    auditStatus,
    craftScore: `${craftScoreNum}/100`,
    penaltyPoints: totalPenalties,
    violationsCount: failed,
    findings,
    summary: { passed, failed, warnings, unknowns }
  };
}
