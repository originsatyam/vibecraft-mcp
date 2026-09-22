import { CollectedASTContext, ASTFinding } from "../types.js";

export function analyzeColorAndHierarchy(ctx: CollectedASTContext): ASTFinding[] {
  const findings: ASTFinding[] = [];

  let primaryButtonCount = 0;
  let totalButtonCount = 0;

  for (const elem of ctx.jsxElements) {
    const tag = elem.tagName.toLowerCase();
    const classAttr = elem.attributes.find(a => a.name === "className")?.value;
    const classStr = String(classAttr || "");

    // 1. Hardcoded Hex Colors
    if (classStr.includes("bg-[#") || classStr.includes("text-[#") || classStr.includes("border-[#")) {
      findings.push({
        ruleId: "hardcoded_hex_colors",
        category: "color",
        severity: "medium",
        status: "FAIL",
        confidence: "HIGH",
        title: "Hardcoded Hex Colors (Missing Design Tokens)",
        issue: "Hardcoded hex colors detected in Tailwind classes. Breaks dynamic light/dark mode theme switching.",
        evidence: `className="${classStr}"`,
        suggestedRemediation: "Replace arbitrary hex classes with HSL semantic CSS variable tokens e.g. `bg-card`, `text-card-foreground`, `border-border`.",
        sourceLocation: elem.loc
      });
    }

    // 2. Arbitrary / Extreme Z-Index Stacking
    if (classStr.match(/z-\[(999|9999|99999|10000|99)\]|z-(99|999|9999)/)) {
      findings.push({
        ruleId: "z_index_stacking_system",
        category: "z_index",
        severity: "high",
        status: "FAIL",
        confidence: "HIGH",
        title: "Arbitrary or Infinite Z-Index Violation",
        issue: "Arbitrary z-index detected. Causes severe stacking context collisions across dialogs and dropdowns.",
        evidence: `className="${classStr}" contains arbitrary z-index`,
        suggestedRemediation: "Adhere to standard z-index tokens: z-0 (base), z-10..20 (navbars/sticky), z-30 (dropdowns), z-40 (modals), z-50 (toasts).",
        sourceLocation: elem.loc
      });
    }

    // 3. Primary CTA & Button Hierarchy Tracking
    if (tag === "button") {
      totalButtonCount++;
      if (classStr.includes("bg-primary") || classStr.includes("btn-primary") || classStr.includes("bg-blue-600") || classStr.includes("bg-indigo-600")) {
        primaryButtonCount++;
      }
    }

    // 4. Pie Chart Category Overload Check
    if (tag === "piechart" || tag === "donutchart") {
      findings.push({
        ruleId: "data_visualization_laws",
        category: "hierarchy",
        severity: "medium",
        status: "WARNING",
        confidence: "HIGH",
        title: "Pie/Donut Chart Detected",
        issue: "Pie / Donut chart detected. FORBIDDEN if dataset contains > 3 categories due to visual scanning friction.",
        evidence: `<${elem.tagName}> element rendered.`,
        suggestedRemediation: "Default to horizontal bar charts for categorical comparisons and line/area charts for time-series data.",
        sourceLocation: elem.loc
      });
    }
  }

  // Check 5: Competing Primary Actions
  if (primaryButtonCount > 2) {
    findings.push({
      ruleId: "ai_slop_rejection",
      category: "hierarchy",
      severity: "high",
      status: "FAIL",
      confidence: "HIGH",
      title: "Competing Primary CTA Buttons Detected",
      issue: `${primaryButtonCount} primary CTA buttons ('bg-primary') detected in the component. Violates visual hierarchy.`,
      evidence: `Found ${primaryButtonCount} primary buttons.`,
      suggestedRemediation: "Establish exactly 1 primary CTA button (`bg-primary`) and downgrade secondary actions to ghost/outline buttons (`variant='outline'`)."
    });
  }

  // Check 6: Hick's Law Button Overload
  if (totalButtonCount > 4) {
    findings.push({
      ruleId: "hicks_law",
      category: "hierarchy",
      severity: "medium",
      status: "WARNING",
      confidence: "HIGH",
      title: "High Action Density (Hick's Law Violation)",
      issue: `${totalButtonCount} buttons rendered in view. High cognitive friction for action selection.`,
      evidence: `Found ${totalButtonCount} total button elements.`,
      suggestedRemediation: "Collapse secondary choices into a dropdown menu (`DropdownMenu`) to lower decision time."
    });
  }

  // Check 7: Marketing Fluff Microcopy
  const textLower = ctx.rawCode.toLowerCase();
  const marketingFluffWords = ["supercharge", "unleash", "empower", "awesome!", "oops!"];
  const foundFluff = marketingFluffWords.filter(w => textLower.includes(w));
  if (foundFluff.length > 0) {
    findings.push({
      ruleId: "microcopy_tone_tokenization",
      category: "microcopy",
      severity: "low",
      status: "FAIL",
      confidence: "HIGH",
      title: "Marketing Fluff Microcopy Detected",
      issue: `Fluff word(s) detected: '${foundFluff.join(", ")}'. Violates terse, objective UI microcopy principles.`,
      evidence: `Code contains: ${foundFluff.join(", ")}`,
      suggestedRemediation: "Use objective, noun-first microcopy e.g., '[Verb] [Noun]' or '[Entity] [Action Past-Tense]'."
    });
  }

  // Check 8: Clinical Color Semantics Violation
  if (textLower.includes("clinical") || textLower.includes("triage") || textLower.includes("patient") || textLower.includes("health") || textLower.includes("medical")) {
    if ((textLower.includes("bg-red") || textLower.includes("bg-rose") || textLower.includes("text-red")) && !textLower.includes("alert") && !textLower.includes("danger") && !textLower.includes("critical")) {
      findings.push({
        ruleId: "clinical_color_semantics",
        category: "color",
        severity: "critical",
        status: "FAIL",
        confidence: "HIGH",
        title: "Clinical Color Semantics Violation",
        issue: "Red color used for standard navigation UI in clinical domain. Red MUST be strictly reserved for CODE STAT and Critical Alerts.",
        evidence: `Red color utility found in clinical context.`,
        suggestedRemediation: "Replace primary brand/active state with Slate Blue (`hsl(217, 91%, 60%)`), Deep Navy, or Muted Teal."
      });
    }
  }

  return findings;
}
