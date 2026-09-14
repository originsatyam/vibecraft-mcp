import { UX_RULES_DATABASE } from "../database/hig_rules.js";

export function handleAuditUxCompliance(args: { codeOrPrompt: string; componentType?: string }) {
  const { codeOrPrompt, componentType } = args;

  const code = codeOrPrompt.toLowerCase();
  const violations: Array<{ ruleId: string; title: string; issue: string; recommendation: string; example: any }> = [];

  // Check 1: Competing Primary Actions (AI Slop Detection)
  const primaryButtonMatches = (code.match(/(bg-primary|bg-blue-600|bg-indigo-600|btn-primary)/g) || []).length;
  if (primaryButtonMatches > 2) {
    const r = UX_RULES_DATABASE.ai_slop_rejection;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: `${primaryButtonMatches} competing primary CTA buttons detected in the same container. Violates Source of Truth Hierarchy and visual clarity.`,
      recommendation: "Establish exactly 1 primary CTA button (`bg-primary`) and downgrade adjacent controls to secondary/ghost buttons (`hover:bg-accent`).",
      example: r.codeRefactoringExample
    });
  }

  // Check 2: Small click/touch targets
  if (code.includes("w-4 h-4") || code.includes("w-3 h-3") || code.includes("w-2") || code.includes("p-0")) {
    const r = UX_RULES_DATABASE.fitts_law;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Target size appears under Apple HIG & WCAG minimum (44x44px touch / 36px click). Small hit areas cause misclicks.",
      recommendation: "Wrap buttons or icons in padding (`p-2 min-w-[44px] min-h-[44px] flex items-center justify-center`).",
      example: r.codeRefactoringExample
    });
  }

  // Check 3: Hardcoded Hex Colors instead of HSL Tokens
  if (code.includes("bg-[#") || code.includes("text-[#") || code.includes("border-[#")) {
    violations.push({
      ruleId: "hardcoded_hex_colors",
      title: "Hardcoded Hex Colors (Missing Design Tokens)",
      issue: "Hardcoded hex colors prevent dynamic light/dark mode switching and break design token consistency.",
      recommendation: "Use HSL semantic CSS variable utilities e.g. `bg-background`, `text-foreground`, `bg-card`, `border-border`.",
      example: {
        badCode: `<div className="bg-[#121212] text-[#ffffff] border-[#333333]">Card</div>`,
        goodCode: `<div className="bg-card text-card-foreground border-border border p-6 rounded-2xl">Card</div>`,
        explanation: "Replaces arbitrary hex strings with theme-aware semantic HSL tokens."
      }
    });
  }

  // Check 4: Icon-only Button missing accessibility label
  if (code.includes("<button") && (code.includes("icon") || code.includes("lucide")) && !code.includes("aria-label") && !code.includes("sr-only")) {
    violations.push({
      ruleId: "icon_button_accessibility",
      title: "Icon-Only Button Missing Accessibility Label",
      issue: "Buttons containing only icons without textual content or `aria-label` are inaccessible to screen readers.",
      recommendation: "Add an explicit `aria-label='Descriptive Action'` or include `<span className='sr-only'>Label</span>`.",
      example: {
        badCode: `<button onClick={onClose}><XIcon className="w-5 h-5"/></button>`,
        goodCode: `<button onClick={onClose} aria-label="Close dialog" className="p-2.5 rounded-full hover:bg-accent"><XIcon className="w-5 h-5"/></button>`,
        explanation: "Ensures screen readers announce the button purpose cleanly."
      }
    });
  }

  // Check 5: Missing Loading or Skeleton State
  if ((code.includes("fetch") || code.includes("isloading")) && !code.includes("skeleton")) {
    const r = UX_RULES_DATABASE.doherty_threshold;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Async fetch or loading flag detected without skeleton screen loader. Violates the 400ms Doherty Threshold.",
      recommendation: "Render skeleton layout components during loading to prevent visual layout shifts.",
      example: r.codeRefactoringExample
    });
  }

  // Check 6: Choice overload
  if ((code.match(/<button/g) || []).length > 4) {
    const r = UX_RULES_DATABASE.hicks_law;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "High density of unprioritized button actions detected on screen. Violates Hick's Law.",
      recommendation: "Establish 1 primary CTA with distinct visual weight (`bg-primary text-primary-foreground`) and collapse secondary options.",
      example: r.codeRefactoringExample
    });
  }

  // Check 7: Modal ergonomics
  if (code.includes("modal") || code.includes("dialog")) {
    if (!code.includes("radix") && !code.includes("dialogcontent") && !code.includes("escape")) {
      const r = UX_RULES_DATABASE.apple_modality;
      violations.push({
        ruleId: r.id,
        title: r.title,
        issue: "Custom modal overlay lacks standard Apple HIG keyboard accessibility focus traps or sheet backdrop.",
        recommendation: "Use Radix UI Dialog / Drawer primitive for accessible backdrop dismiss and focus traps.",
        example: r.codeRefactoringExample
      });
    }
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            auditStatus: violations.length === 0 ? "PASSED_HIGH_CRAFT" : "NEEDS_REFACTORING",
            violationsCount: violations.length,
            violations,
            generalGuidance: "Ensure code uses HSL semantic color variables, optical line heights, icons with aria-labels, and single primary CTA buttons."
          },
          null,
          2
        )
      }
    ]
  };
}
