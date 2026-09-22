import { CollectedASTContext, ASTFinding } from "../types.js";
import { AppliedFix, SkippedFix } from "./types.js";
import { RULE_FIXABILITY_MAP, mapArbitrarySpacingToken, mapArbitraryRadiusToken, calculateNestedRadiusToken, mapHexToSemanticToken } from "./rules.js";

export function transformCodeAST(
  ctx: CollectedASTContext,
  findings: ASTFinding[],
  rulesToFix?: string[]
): { transformedCode: string; fixesApplied: AppliedFix[]; fixesSkipped: SkippedFix[] } {
  let transformedCode = ctx.rawCode;
  const fixesApplied: AppliedFix[] = [];
  const fixesSkipped: SkippedFix[] = [];

  for (const finding of findings) {
    const category = RULE_FIXABILITY_MAP[finding.ruleId] || "SUBJECTIVE_NON_DETERMINISTIC";

    // Skip rules specified outside rulesToFix filter
    if (rulesToFix && rulesToFix.length > 0 && !rulesToFix.includes(finding.ruleId)) {
      continue;
    }

    if (category !== "DETERMINISTICALLY_FIXABLE") {
      fixesSkipped.push({
        ruleId: finding.ruleId,
        category,
        reason: category === "SUBJECTIVE_NON_DETERMINISTIC" 
          ? "Subjective visual design decision requiring human or LLM judgment."
          : "Ambiguous structure or multi-file relationship that is unsafe to modify automatically.",
        originalValue: finding.evidence,
        sourceLocation: finding.sourceLocation
      });
      continue;
    }

    // Fix Rule 1: Non-Grid Arbitrary Pixel Spacing (p-[13px] -> p-3)
    if (finding.ruleId === "deterministic_compilation_engine" && finding.issue.includes("Arbitrary, non-grid spacing value")) {
      const match = finding.evidence.match(/['"](p|m|gap|w|h|top|bottom|left|right|rounded)-\[(\d+)px\]['"]/);
      if (match) {
        const prefix = match[1];
        const pxVal = parseInt(match[2], 10);
        const replacement = prefix === "rounded" ? mapArbitraryRadiusToken(pxVal) : mapArbitrarySpacingToken(prefix, pxVal);
        const originalStr = `${prefix}-[${pxVal}px]`;

        if (transformedCode.includes(originalStr)) {
          transformedCode = transformedCode.replace(new RegExp(originalStr.replace(/\[/g, "\\[").replace(/\]/g, "\\]"), "g"), replacement);
          fixesApplied.push({
            ruleId: finding.ruleId,
            originalValue: originalStr,
            replacementValue: replacement,
            reason: `Re-aligned non-grid spacing ${pxVal}px to nearest 4px spatial grid token (${replacement}).`,
            sourceLocation: finding.sourceLocation,
            confidence: "HIGH",
            deterministic: true
          });
        }
      }
    }

    // Fix Rule 2: Hardcoded Hex Colors
    if (finding.ruleId === "hardcoded_hex_colors") {
      const hexMatches = transformedCode.match(/(bg|text|border)-\[#[a-fA-F0-9]{3,6}\]/g);
      if (hexMatches) {
        for (const hexClass of hexMatches) {
          const replacement = mapHexToSemanticToken(hexClass);
          if (transformedCode.includes(hexClass) && replacement !== hexClass) {
            transformedCode = transformedCode.replace(new RegExp(hexClass.replace(/\[/g, "\\[").replace(/\]/g, "\\]"), "g"), replacement);
            fixesApplied.push({
              ruleId: finding.ruleId,
              originalValue: hexClass,
              replacementValue: replacement,
              reason: `Replaced hardcoded hex color ${hexClass} with theme-aware HSL semantic token ${replacement}.`,
              sourceLocation: finding.sourceLocation,
              confidence: "HIGH",
              deterministic: true
            });
          }
        }
      }
    }

    // Fix Rule 3: Arbitrary Z-Index Stacking
    if (finding.ruleId === "z_index_stacking_system") {
      const zMatches = transformedCode.match(/z-\[(999|9999|99999|10000|99)\]|z-(99|999|9999)/g);
      if (zMatches) {
        for (const zClass of zMatches) {
          const replacement = "z-50";
          if (transformedCode.includes(zClass)) {
            transformedCode = transformedCode.replace(new RegExp(zClass.replace(/\[/g, "\\[").replace(/\]/g, "\\]"), "g"), replacement);
            fixesApplied.push({
              ruleId: finding.ruleId,
              originalValue: zClass,
              replacementValue: replacement,
              reason: `Re-aligned extreme z-index ${zClass} to standard overlay z-index token (z-50).`,
              sourceLocation: finding.sourceLocation,
              confidence: "HIGH",
              deterministic: true
            });
          }
        }
      }
    }

    // Fix Rule 4: Focus Ring Offset Missing
    if (finding.ruleId === "focus_ring_offset_missing") {
      if (transformedCode.includes("focus") && !transformedCode.includes("ring-offset-2")) {
        transformedCode = transformedCode.replace(/focus:ring-2|focus:ring|focus-visible:ring-2|focus-visible:ring/, (m) => `${m} focus-visible:ring-offset-2`);
        fixesApplied.push({
          ruleId: finding.ruleId,
          originalValue: "focus ring without offset",
          replacementValue: "focus-visible:ring-offset-2",
          reason: "Appended 2px focus ring offset for WCAG focus accessibility contrast compliance.",
          sourceLocation: finding.sourceLocation,
          confidence: "HIGH",
          deterministic: true
        });
      }
    }

    // Fix Rule 5: Nested Corner Radius Math Mismatch
    if (finding.ruleId === "nested_corner_math") {
      if (transformedCode.includes("rounded-2xl") && transformedCode.includes("p-3")) {
        // Outer 16px radius - 12px padding = 4px inner radius (rounded)
        transformedCode = transformedCode.replace(/rounded-2xl(.*?)rounded-2xl/s, "rounded-2xl$1rounded");
        fixesApplied.push({
          ruleId: finding.ruleId,
          originalValue: "shared outer radius rounded-2xl on inner child",
          replacementValue: "rounded (4px)",
          reason: "Corrected inner nested radius using concentric formula R_inner = max(0, 16px - 12px padding) = 4px (rounded).",
          sourceLocation: finding.sourceLocation,
          confidence: "HIGH",
          deterministic: true
        });
      }
    }

    // Fix Rule 6: Double Focus Outline
    if (finding.ruleId === "double_focus_outline") {
      if (!transformedCode.includes("focus-visible:outline-none")) {
        transformedCode = transformedCode.replace(
          /(focus:ring-[^\s"']+|focus-visible:ring-[^\s"']+|focus:border-[^\s"']+|focus-visible:border-[^\s"']+)/,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        );
        fixesApplied.push({
          ruleId: finding.ruleId,
          originalValue: "stacked focus outline + border ring",
          replacementValue: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          reason: "Eliminated duplicate browser outline stacking by enforcing single focus-visible ring with 2px offset.",
          sourceLocation: finding.sourceLocation,
          confidence: "HIGH",
          deterministic: true
        });
      }
    }

    // Fix Rule 7: Invalid Navigation State Grammar
    if (finding.ruleId === "invalid_navigation_state_grammar") {
      if (!transformedCode.includes('aria-current="page"')) {
        // Find active sidebar link or nav link and append aria-current="page"
        transformedCode = transformedCode.replace(
          /(<a\s+[^>]*className=["'][^"']*(?:active|selected)[^"']*["'])/i,
          '$1 aria-current="page"'
        );
        if (transformedCode.includes('aria-current="page"')) {
          fixesApplied.push({
            ruleId: finding.ruleId,
            originalValue: "active nav link missing aria-current",
            replacementValue: 'aria-current="page"',
            reason: "Attached aria-current='page' strictly to the single active navigation item.",
            sourceLocation: finding.sourceLocation,
            confidence: "HIGH",
            deterministic: true
          });
        }
      }
    }
  }

  return { transformedCode, fixesApplied, fixesSkipped };
}
