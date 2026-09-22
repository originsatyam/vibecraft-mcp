import { CollectedASTContext, ASTFinding } from "../types.js";

export function analyzeAccessibility(ctx: CollectedASTContext): ASTFinding[] {
  const findings: ASTFinding[] = [];

  for (const elem of ctx.jsxElements) {
    const tag = elem.tagName.toLowerCase();

    // 1. Icon-only Button Accessibility
    if (tag === "button") {
      const hasAriaLabel = elem.attributes.some(a => a.name === "aria-label" && String(a.value).trim().length > 0);
      const hasSrOnlyChild = elem.childTagNames.some(t => t.toLowerCase() === "span") || elem.textChildrenContent.some(t => t.includes("sr-only"));
      const hasTextContent = elem.hasTextChildren && elem.textChildrenContent.some(t => t.trim().length > 0);
      const hasIconChild = elem.childTagNames.some(t => /icon|svg|trash|x|check|plus|edit|delete|lucide/i.test(t));

      // If button has icons or no text content, but lacks aria-label/sr-only -> FAIL
      if ((hasIconChild || !hasTextContent) && !hasAriaLabel && !hasSrOnlyChild) {
        findings.push({
          ruleId: "icon_button_accessibility",
          category: "accessibility",
          severity: "high",
          status: "FAIL",
          confidence: "HIGH",
          title: "Icon-Only Button Missing Accessibility Label",
          issue: "Button element contains only icons or empty content without an explicit `aria-label` or `<span className='sr-only'>` text description.",
          evidence: `<button> with children: [${elem.childTagNames.join(", ")}]`,
          suggestedRemediation: "Add `aria-label='Descriptive Action Name'` or wrap icon description in `<span className='sr-only'>Label</span>`.",
          sourceLocation: elem.loc
        });
      } else if (hasAriaLabel || hasSrOnlyChild) {
        findings.push({
          ruleId: "icon_button_accessibility",
          category: "accessibility",
          severity: "low",
          status: "PASS",
          confidence: "HIGH",
          title: "Accessible Button Label Present",
          issue: "Button contains valid screen reader accessibility attributes.",
          evidence: hasAriaLabel ? `aria-label present` : `sr-only child present`,
          suggestedRemediation: "Maintain descriptive action phrasing.",
          sourceLocation: elem.loc
        });
      }
    }

    // 2. Focus Ring & Offset Compliance
    if (["button", "input", "a", "select"].includes(tag)) {
      const classAttr = elem.attributes.find(a => a.name === "className")?.value;
      const classStr = String(classAttr || "");

      if (classStr.includes("focus") && !classStr.includes("ring-offset") && !classStr.includes("outline-none")) {
        findings.push({
          ruleId: "focus_ring_offset_missing",
          category: "accessibility",
          severity: "medium",
          status: "FAIL",
          confidence: "HIGH",
          title: "Focus State Missing 2px Offset Ring",
          issue: "Interactive focus utility lacks standard 2px focus ring offset (`ring-offset-2`).",
          evidence: `className="${classStr}"`,
          suggestedRemediation: "Add `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` for WCAG focus contrast compliance.",
          sourceLocation: elem.loc
        });
      }
    }

    // 3. Custom Clickable Element Keyboard Accessibility
    if (!["button", "a", "input", "select", "textarea"].includes(tag)) {
      const hasOnClick = elem.attributes.some(a => a.name === "onClick");
      const hasOnKeyDown = elem.attributes.some(a => a.name === "onKeyDown" || a.name === "onKeyUp");

      if (hasOnClick && !hasOnKeyDown) {
        findings.push({
          ruleId: "keyboard_click_handler_missing",
          category: "accessibility",
          severity: "medium",
          status: "WARNING",
          confidence: "MEDIUM",
          title: "Custom Clickable Container Lacks Keyboard Event Handler",
          issue: `Non-interactive <${elem.tagName}> element attaches onClick without onKeyDown or button role.`,
          evidence: `<${elem.tagName} onClick={...}>`,
          suggestedRemediation: "Refactor to native `<button>` element or add `onKeyDown={handleKeyDown}` and `role='button' tabIndex={0}`.",
          sourceLocation: elem.loc
        });
      }
    }

    // 4. Double Focus Outline Audit
    if (["input", "button", "select", "textarea", "a"].includes(tag)) {
      const classAttr = elem.attributes.find(a => a.name === "className")?.value;
      const classStr = String(classAttr || "");

      const hasFocusClass = /focus:|focus-visible:/i.test(classStr);
      const hasBorderOrRing = /border|ring/i.test(classStr);
      const hasOutlineSuppression = /focus-visible:outline-none|focus:outline-none|outline-none/i.test(classStr);

      if (hasFocusClass && hasBorderOrRing && !hasOutlineSuppression) {
        findings.push({
          ruleId: "double_focus_outline",
          category: "accessibility",
          severity: "high",
          status: "FAIL",
          confidence: "HIGH",
          title: "Interactive Input/Button Double Focus Outline Stack",
          issue: `Interactive <${tag}> element applies focus ring/border styling without suppressing native browser outline ('focus-visible:outline-none' missing), causing visually duplicated focus treatments.`,
          evidence: `className="${classStr}"`,
          suggestedRemediation: "Apply `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` to establish exactly ONE clear, accessible focus indicator.",
          sourceLocation: elem.loc
        });
      } else if (hasFocusClass && hasOutlineSuppression) {
        findings.push({
          ruleId: "double_focus_outline",
          category: "accessibility",
          severity: "low",
          status: "PASS",
          confidence: "HIGH",
          title: "Single Focus Outline Compliant",
          issue: "Interactive element cleanly suppresses native outline while maintaining single accessible focus ring.",
          evidence: `className="${classStr}"`,
          suggestedRemediation: "Maintain single focus ring pattern across all interactive inputs.",
          sourceLocation: elem.loc
        });
      }
    }
  }

  return findings;
}
