import { CollectedASTContext, ASTFinding } from "../types.js";

export function analyzeDesignStates(ctx: CollectedASTContext): ASTFinding[] {
  const findings: ASTFinding[] = [];

  // 1. Loading State & Skeleton Screen Analysis
  let loadingVarEvidence = false;
  let asyncHookEvidence = false;
  let skeletonRendered = false;
  let loadingComponentRendered = false;

  // Inspect AST Variables & Hooks
  for (const [varName, binding] of ctx.variables.entries()) {
    if (binding.isState || binding.isAsyncState) {
      if (/is(Loading|Pending|Fetching)|loading|pending/i.test(varName) || (binding.aliasFor && /is(Loading|Pending|Fetching)/i.test(binding.aliasFor))) {
        loadingVarEvidence = true;
      }
    }
    if (binding.hookName && /use(Query|Mutation|Fetch|Async|Project|Data)/i.test(binding.hookName)) {
      asyncHookEvidence = true;
    }
  }

  // Inspect JSX Elements for Skeleton or Spinner components
  for (const elem of ctx.jsxElements) {
    const nameLower = elem.tagName.toLowerCase();
    if (nameLower.includes("skeleton") || nameLower.includes("spinner") || nameLower.includes("loader")) {
      loadingComponentRendered = true;
      if (nameLower.includes("skeleton")) skeletonRendered = true;
    }
  }

  // Inspect Conditionals (Ternary / Logical &&)
  for (const cond of ctx.conditionals) {
    if (/loading|pending|isloading|ispending|fetching/i.test(cond.testExpression)) {
      loadingVarEvidence = true;
    }
  }

  if (asyncHookEvidence || loadingVarEvidence) {
    if (skeletonRendered || loadingComponentRendered) {
      findings.push({
        ruleId: "doherty_threshold",
        category: "state",
        severity: "low",
        status: "PASS",
        confidence: "HIGH",
        title: "Async Operations & Skeleton Loader Integrated",
        issue: "Asynchronous state handling correctly pairs loading signals with skeleton UI components.",
        evidence: `Detected async state binding with rendered skeleton/loader component.`,
        suggestedRemediation: "Maintain skeleton layout geometry matching target content to prevent layout shifts."
      });
    } else {
      findings.push({
        ruleId: "doherty_threshold",
        category: "state",
        severity: "high",
        status: "FAIL",
        confidence: "HIGH",
        title: "Async Operation Missing Skeleton Loader State",
        issue: "Async fetch or loading hook state detected without a corresponding skeleton UI loading representation.",
        evidence: `Async state binding detected in component without skeleton component render.`,
        suggestedRemediation: "Render `<Skeleton className='w-full h-12 rounded-xl' />` during pending state to comply with Doherty 400ms threshold."
      });
    }
  }

  // 2. Disabled Interactive State Analysis
  const buttonElems = ctx.jsxElements.filter(e => e.tagName.toLowerCase() === "button");
  for (const btn of buttonElems) {
    const hasDisabledAttr = btn.attributes.some(a => a.name === "disabled");
    const hasAriaDisabled = btn.attributes.some(a => a.name === "aria-disabled");

    if (!hasDisabledAttr && !hasAriaDisabled && (asyncHookEvidence || loadingVarEvidence)) {
      findings.push({
        ruleId: "disabled_interaction_state",
        category: "state",
        severity: "medium",
        status: "WARNING",
        confidence: "MEDIUM",
        title: "Button Missing Disabled State During Async Action",
        issue: "Button element does not bind a `disabled` attribute during active pending/loading operations.",
        evidence: `<${btn.tagName}> lacks disabled attribute binding.`,
        suggestedRemediation: "Add `disabled={isPending || isLoading}` and `aria-disabled={isPending}` to prevent double form submission.",
        sourceLocation: btn.loc
      });
    }
  }

  // 3. Ambiguous State Abstraction Check (Custom Hook Status string)
  for (const [varName, binding] of ctx.variables.entries()) {
    if (varName === "status" && binding.hookName) {
      findings.push({
        ruleId: "custom_state_abstraction",
        category: "state",
        severity: "low",
        status: "UNKNOWN",
        confidence: "LOW",
        title: "Custom Hook State Abstraction Detected",
        issue: `Variable '${varName}' from hook '${binding.hookName}' indicates an indirect state machine.`,
        evidence: `const { status } = ${binding.hookName}()`,
        suggestedRemediation: "Verify explicit state mapping for status enum values ('idle', 'loading', 'error', 'success')."
      });
    }
  }

  // 4. Navigation Interaction State Grammar Audit
  const navElems = ctx.jsxElements.filter(e => {
    const t = e.tagName.toLowerCase();
    const c = String(e.attributes.find(a => a.name === "className")?.value || "");
    return t === "nav" || c.includes("sidebar") || c.includes("nav-list") || c.includes("tab-list");
  });

  for (const navContainer of navElems) {
    // Find interactive child items inside nav container
    const navItems = ctx.jsxElements.filter(e => ["a", "button", "div"].includes(e.tagName.toLowerCase()) && e.attributes.some(a => a.name === "href" || a.name === "onClick" || (a.name === "className" && String(a.value).includes("nav"))));

    let ariaCurrentCount = 0;
    for (const item of navItems) {
      const hasAriaCurrent = item.attributes.some(a => a.name === "aria-current");
      if (hasAriaCurrent) ariaCurrentCount++;
    }

    if (ariaCurrentCount === 0 && navItems.length > 0) {
      findings.push({
        ruleId: "invalid_navigation_state_grammar",
        category: "state",
        severity: "medium",
        status: "FAIL",
        confidence: "HIGH",
        title: "Navigation Lacks Active Route State Grammar (aria-current)",
        issue: "Navigation structure contains interactive links/buttons without attaching `aria-current=\"page\"` to the active page item.",
        evidence: `<${navContainer.tagName}> contains ${navItems.length} items without aria-current attribute.`,
        suggestedRemediation: "Attach `aria-current=\"page\"` strictly to the active navigation item and provide explicit Selected/Active styles distinct from Hover states.",
        sourceLocation: navContainer.loc
      });
    } else if (ariaCurrentCount > 1) {
      findings.push({
        ruleId: "invalid_navigation_state_grammar",
        category: "state",
        severity: "medium",
        status: "FAIL",
        confidence: "HIGH",
        title: "Multiple Concurrent Active Navigation Route Markers",
        issue: `Navigation container attached 'aria-current="page"' to ${ariaCurrentCount} concurrent items simultaneously.`,
        evidence: `<${navContainer.tagName}> contains ${ariaCurrentCount} aria-current attributes.`,
        suggestedRemediation: "Ensure `aria-current=\"page\"` is assigned exclusively to the single active route.",
        sourceLocation: navContainer.loc
      });
    } else if (ariaCurrentCount === 1) {
      findings.push({
        ruleId: "invalid_navigation_state_grammar",
        category: "state",
        severity: "low",
        status: "PASS",
        confidence: "HIGH",
        title: "Navigation State Grammar Compliant",
        issue: "Navigation correctly assigns aria-current='page' strictly to the single current route.",
        evidence: `<${navContainer.tagName}> correctly specifies single active page item.`,
        suggestedRemediation: "Maintain clear distinction between Default, Hover, Active, and Selected states.",
        sourceLocation: navContainer.loc
      });
    }
  }

  return findings;
}
