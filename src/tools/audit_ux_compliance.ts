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

  // Check 8: Clinical & Enterprise Software Color Semantics Violation
  if (code.includes("clinical") || code.includes("triage") || code.includes("patient") || code.includes("health") || code.includes("medical")) {
    if ((code.includes("bg-red") || code.includes("bg-rose") || code.includes("text-red")) && !code.includes("alert") && !code.includes("danger") && !code.includes("code stat") && !code.includes("critical")) {
      const r = UX_RULES_DATABASE.clinical_color_semantics;
      violations.push({
        ruleId: r.id,
        title: r.title,
        issue: "Red color detected for standard or active navigation UI in clinical context. Red MUST exclusively mean Critical Alert, Emergency, or Danger.",
        recommendation: "Replace primary brand/active state with Slate Blue (`hsl(217, 91%, 60%)`), Deep Navy, or Muted Teal. Reserve red strictly for CODE STAT and high-risk patient badges.",
        example: r.codeRefactoringExample
      });
    }
  }

  // Check 9: Visual Fatigue & Over-boxing Anti-Pattern
  if (code.includes("shadow-2xl") || code.includes("border-2") || code.includes("border-black") || code.includes("border-gray-900")) {
    const r = UX_RULES_DATABASE.deboxing_visual_fatigue;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Heavy drop shadows (`shadow-2xl`) or hard internal borders detected. Causes severe visual fatigue over long shifts.",
      recommendation: "Flatten visual hierarchy. Use subtle background color shifts (`#F9FAFB` canvas vs `#FFFFFF` cards) and generous whitespace.",
      example: r.codeRefactoringExample
    });
  }

  // Check 10: Oversized Structural Container Radius Anti-Pattern
  if (code.includes("rounded-3xl") || (code.includes("rounded-2xl") && (code.includes("sidebar") || code.includes("panel") || code.includes("dashboard")))) {
    const r = UX_RULES_DATABASE.functional_border_radius_hierarchy;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Oversized structural container curves (`rounded-3xl` or `rounded-2xl`) detected in enterprise/dashboard view. Softens interface excessively.",
      recommendation: "Use Medium/Subtle curves (`6px` to `8px` / `rounded-md` to `rounded-lg`) for structural containers to preserve crisp alignment lines.",
      example: r.codeRefactoringExample
    });
  }

  // Check 11: Nested Corner Math Mismatch
  if (code.includes("p-") && (code.includes("rounded-xl") || code.includes("rounded-2xl"))) {
    const r = UX_RULES_DATABASE.nested_corner_math;
    if (code.match(/rounded-(xl|2xl|3xl).*<.*rounded-(xl|2xl|3xl)/s)) {
      violations.push({
        ruleId: r.id,
        title: r.title,
        issue: "Nested inner element shares identical large outer radius inside a padded container (`R_inner` must equal `R_outer - Padding`).",
        recommendation: "Calculate inner radius using `R_inner = R_outer - Padding` (e.g. 12px outer - 8px padding = 4px inner radius `rounded`).",
        example: r.codeRefactoringExample
      });
    }
  }

  // Check 12: Non-Grid Arbitrary Value Violation (4pt/8pt Grid Math)
  if (code.match(/\[(15|21|13|17|19|22|23|25|27|29|31)px\]/g)) {
    const r = UX_RULES_DATABASE.deterministic_compilation_engine;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Arbitrary, non-grid pixel value detected (e.g. 15px, 21px). Violates the 4pt/8pt Spatial Grid System.",
      recommendation: "Re-align all spacing to multiples of 4 or 8 (e.g. 4px, 8px, 12px, 16px, 24px, 32px).",
      example: r.codeRefactoringExample
    });
  }

  // Check 13: Interactive Element Focus Ring & Offset Compliance
  if (code.includes("<button") || code.includes("<input") || code.includes("<a ")) {
    if (code.includes("focus") && !code.includes("ring-offset")) {
      const r = UX_RULES_DATABASE.deterministic_compilation_engine;
      violations.push({
        ruleId: "focus_ring_offset_missing",
        title: "Focus Ring Missing 2px Offset",
        issue: "Interactive focus state lacks a calculated 2px focus ring offset from the element border.",
        recommendation: "Add `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` to guarantee high contrast visibility.",
        example: r.codeRefactoringExample
      });
    }
  }

  // Check 14: Arbitrary / Infinite Z-Index Violation
  if (code.match(/z-\[(999|9999|99999|10000|99)\]|z-(99|999|9999)/g)) {
    const r = UX_RULES_DATABASE.z_index_stacking_system;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Arbitrary or infinite z-index value detected (e.g. z-99999, z-99). Causes severe stacking context collisions.",
      recommendation: "Adhere to strict z-index tokens: z-0 (base/charts), z-10..20 (navbars/sticky), z-30 (dropdowns), z-40 (modals), z-50 (toasts).",
      example: r.codeRefactoringExample
    });
  }

  // Check 15: Marketing Fluff Microcopy Anti-Pattern
  if (code.includes("supercharge") || code.includes("unleash") || code.includes("empower") || code.includes("awesome!") || code.includes("oops!")) {
    const r = UX_RULES_DATABASE.microcopy_tone_tokenization;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Marketing fluff verb or exclamatory emotion detected in microcopy ('Supercharge', 'Awesome!', 'Oops!').",
      recommendation: "Use terse, objective, noun-first microcopy formatted as `[Verb] [Noun]` or `[Entity] [Action Past-Tense]`.",
      example: r.codeRefactoringExample
    });
  }

  // Check 16: Multi-slice Pie / Donut Chart Anti-Pattern
  if (code.includes("<piechart") || code.includes("<donutchart")) {
    const r = UX_RULES_DATABASE.data_visualization_laws;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Pie / Donut Chart detected. FORBIDDEN if dataset contains > 3 categories due to high visual scanning friction.",
      recommendation: "Default to horizontal bar charts for categorical comparisons and line/area charts for time-series data.",
      example: r.codeRefactoringExample
    });
  }

  // Check 17: Unverified Marketing Claim & Fake Data Anti-Pattern
  if (code.includes("100% guaranteed") || code.includes("10x faster") || code.includes("revolutionary") || code.includes("world's best")) {
    const r = UX_RULES_DATABASE.hybrid_designer_compiler_architecture;
    violations.push({
      ruleId: r.id,
      title: r.title,
      issue: "Unverified marketing hype claim or fake testimonial detected. Violates Phase 1 Human-Centered UX reasoning.",
      recommendation: "Replace unverified marketing claims with realistic, verifiable placeholders and terse noun-first microcopy.",
      example: r.codeRefactoringExample
    });
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
