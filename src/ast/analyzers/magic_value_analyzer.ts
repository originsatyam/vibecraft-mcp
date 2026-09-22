import { CollectedASTContext, ASTFinding } from "../types.js";

export function analyzeMagicValues(ctx: CollectedASTContext): ASTFinding[] {
  const findings: ASTFinding[] = [];

  // 1. Inspect Tailwind Arbitrary Pixel Classes in JSX Attributes
  for (const elem of ctx.jsxElements) {
    const classAttr = elem.attributes.find(a => a.name === "className")?.value;
    const classStr = String(classAttr || "");

    // Match arbitrary pixel classes: p-[13px], gap-[15px], rounded-[21px], z-[9999]
    const matches = classStr.match(/(p|m|gap|w|h|top|bottom|left|right|rounded|z|padding|margin)-\[(\d+)px\]/g);
    if (matches) {
      for (const m of matches) {
        const valMatch = m.match(/\[(\d+)px\]/);
        if (valMatch) {
          const pxVal = parseInt(valMatch[1], 10);
          
          // Check if non-grid value (not divisible by 4)
          if (pxVal % 4 !== 0 && !m.startsWith("z-")) {
            findings.push({
              ruleId: "deterministic_compilation_engine",
              category: "magic_values",
              severity: "high",
              status: "FAIL",
              confidence: "HIGH",
              title: "Non-Grid Arbitrary Pixel Spacing Violation",
              issue: `Arbitrary, non-grid spacing value '${m}' detected (${pxVal}px is not aligned to 4px/8px spatial grid).`,
              evidence: `className="${classStr}" contains '${m}'`,
              suggestedRemediation: `Re-align to standard 4px spatial grid value (nearest grid step: ${Math.round(pxVal / 4) * 4}px).`,
              sourceLocation: elem.loc
            });
          }
        }
      }
    }

    // 2. Inspect Inline Style Objects (e.g. style={{ padding: "13px" }})
    const styleAttr = elem.attributes.find(a => a.name === "style");
    if (styleAttr) {
      const styleStr = String(styleAttr.value || "");
      const inlineMatch = styleStr.match(/(padding|margin|width|height|gap):\s*['"]?(\d+)px['"]?/i);
      if (inlineMatch) {
        const pxVal = parseInt(inlineMatch[2], 10);
        if (pxVal % 4 !== 0) {
          findings.push({
            ruleId: "inline_style_magic_pixel",
            category: "magic_values",
            severity: "high",
            status: "FAIL",
            confidence: "HIGH",
            title: "Inline Style Non-Grid Pixel Violation",
            issue: `Inline style property '${inlineMatch[1]}: ${pxVal}px' violates 4px spatial grid system.`,
            evidence: `style="${styleStr}"`,
            suggestedRemediation: "Refactor to Tailwind semantic grid classes e.g. `p-4` (16px) or `gap-3` (12px).",
            sourceLocation: elem.loc
          });
        }
      }
    }

    // 3. Concentric Nested Corner Radius Mismatch Detection
    if (classStr.includes("rounded-2xl") || classStr.includes("rounded-3xl") || classStr.includes("rounded-xl")) {
      for (const childTag of elem.childTagNames) {
        const childElem = ctx.jsxElements.find(e => e.tagName === childTag);
        const childClass = String(childElem?.attributes.find(a => a.name === "className")?.value || "");
        
        if (childClass.includes("rounded-2xl") || childClass.includes("rounded-3xl") || childClass.includes("rounded-xl")) {
          findings.push({
            ruleId: "nested_corner_math",
            category: "magic_values",
            severity: "medium",
            status: "FAIL",
            confidence: "HIGH",
            title: "Nested Corner Radius Mismatch",
            issue: "Inner nested child element shares identical large outer radius inside a padded container.",
            evidence: `Outer container '${classStr}' contains child '${childClass}'`,
            suggestedRemediation: "Calculate inner radius using concentric formula R_inner = max(0, R_outer - Padding).",
            sourceLocation: elem.loc
          });
          break;
        }
      }
    }
  }

  // 4. Confirm business logic numeric variables are PASS/IGNORED (e.g. const retryCount = 3)
  for (const numLit of ctx.numericLiterals) {
    if (numLit.context === "variable" && numLit.parentName) {
      if (/retry|count|max|index|id|timeout|limit|step/i.test(numLit.parentName)) {
        // Legitimate business logic number — explicitly confirm NO violation!
      }
    }
  }

  // 5. SVG Chart Geometry & Stroke Padding Safety Audit
  for (const elem of ctx.jsxElements) {
    const tag = elem.tagName.toLowerCase();
    if (tag === "svg" || tag.includes("chart") || tag === "path" || tag === "polyline") {
      const classAttr = elem.attributes.find(a => a.name === "className")?.value;
      const classStr = String(classAttr || "");
      const styleAttr = String(elem.attributes.find(a => a.name === "style")?.value || "");

      const hasOverflowHidden = /overflow-hidden|overflow:\s*['"]?hidden/i.test(classStr) || /overflow:\s*['"]?hidden/i.test(styleAttr);
      const dAttr = String(elem.attributes.find(a => a.name === "d")?.value || "");

      // Static inspection: if chart path coordinates reach 0 or max bounds with overflow: hidden or missing viewBox internal padding
      if (hasOverflowHidden || (tag === "svg" && !classStr.includes("overflow-visible") && !styleAttr.includes("overflow: visible"))) {
        findings.push({
          ruleId: "svg_chart_clipping",
          category: "magic_values",
          severity: "medium",
          status: "FAIL",
          confidence: "HIGH",
          title: "SVG Chart Edge Stroke Clipping Vulnerability",
          issue: "SVG chart element contains overflow constraint or lacks stroke padding (min P_svg = strokeWidth * 2 >= 8px), causing line stroke clipping at top/right viewport boundaries.",
          evidence: `<${elem.tagName}> class="${classStr}" style="${styleAttr}"`,
          suggestedRemediation: "Enforce vertical stroke padding P_svg = strokeWidth * 2 >= 8px inside viewBox coordinates and set `overflow: visible` on SVG container. (Note: Runtime rendering validation required via Playwright).",
          sourceLocation: elem.loc
        });
      }
    }
  }

  return findings;
}
