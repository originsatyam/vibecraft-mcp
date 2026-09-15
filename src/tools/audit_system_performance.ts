import { SYSTEM_OPTIMIZATION_RULES } from "../database/backend_optimization_rules.js";

export function handleAuditSystemPerformance(args: { codeOrQuery?: string; codeOrPrompt?: string; scope?: string }) {
  const rawCode = args?.codeOrQuery || args?.codeOrPrompt || "";
  const code = rawCode.toLowerCase();
  const violations: Array<{ ruleId: string; title: string; issue: string; recommendation: string; example: any }> = [];

  // Check 1: N+1 Query in Loops
  if ((code.includes("for") || code.includes("map") || code.includes("foreach")) && (code.includes("await") || code.includes("find") || code.includes("select"))) {
    const r = SYSTEM_OPTIMIZATION_RULES.n_plus_one_queries;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Possible N+1 database query detected inside an array iteration loop. Causes severe connection pool latency.",
      recommendation: "Eager-load relations using ORM `include` / `JOIN FETCH` or batch with DataLoader.",
      example: r.codeRefactoringExample
    });
  }

  // Check 2: Sequential Promise Waterfall
  if ((code.match(/await\s+(fetch|get|find|query|request)/g) || []).length >= 2 && !code.includes("promise.all")) {
    const r = SYSTEM_OPTIMIZATION_RULES.network_waterfall_elimination;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Sequential `await` statements detected for independent network or DB calls. Causes network waterfall latency.",
      recommendation: "Parallelize independent calls with `Promise.all([call1(), call2()])`.",
      example: r.codeRefactoringExample
    });
  }

  // Check 3: Un-transactional Multi-step mutations
  if ((code.match(/await.*(create|update|delete|insert)/g) || []).length > 1 && !code.includes("transaction")) {
    const r = SYSTEM_OPTIMIZATION_RULES.backend_transaction_safety;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Multiple asynchronous mutations executed without an explicit database transaction context.",
      recommendation: "Wrap mutations inside `db.$transaction()` to guarantee atomicity and automatic rollback on failure.",
      example: r.codeRefactoringExample
    });
  }

  // Check 4: Slow OFFSET Pagination
  if (code.includes("offset") || code.includes("skip:")) {
    const r = SYSTEM_OPTIMIZATION_RULES.cursor_pagination;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "OFFSET pagination detected. Causes full table scans as dataset size grows.",
      recommendation: "Switch to keyset/cursor pagination (`WHERE id > lastId LIMIT 20`) with compound B-tree index.",
      example: r.codeRefactoringExample
    });
  }

  // Check 5: Missing Ownership Validation (IDOR)
  if ((code.includes("params.id") || code.includes("req.params")) && !code.includes("userid") && !code.includes("organizationid") && !code.includes("tenantid")) {
    const r = SYSTEM_OPTIMIZATION_RULES.owasp_idor_security;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Record lookup by ID parameter without explicit tenant/user ownership verification.",
      recommendation: "Always include ownership condition (`WHERE id = params.id AND tenantId = user.tenantId`).",
      example: r.codeRefactoringExample
    });
  }

  const totalPenalties = violations.reduce((sum, v) => {
    if (v.ruleId === "n_plus_one_queries") return sum + 25;
    if (v.ruleId === "network_waterfall_elimination") return sum + 20;
    if (v.ruleId === "backend_transaction_safety") return sum + 20;
    if (v.ruleId === "owasp_idor_security") return sum + 20;
    if (v.ruleId === "cursor_pagination") return sum + 15;
    return sum + 10;
  }, 0);

  const performanceScore = Math.max(0, 100 - totalPenalties);
  const performanceStatus = performanceScore === 100 ? "OPTIMIZED_PRODUCTION_READY" : performanceScore >= 80 ? "ACCEPTABLE_PERFORMANCE" : "NEEDS_SYSTEM_OPTIMIZATION";

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            performanceStatus,
            performanceScore: `${performanceScore}/100`,
            penaltyPoints: totalPenalties,
            violationsCount: violations.length,
            violations,
            systemTargetBudgets: {
              ttfb: "< 200ms",
              lcp: "< 2.5s",
              inp: "< 100ms",
              dbQueryTime: "< 50ms"
            }
          },
          null,
          2
        )
      }
    ]
  };
}
