export interface MathCalculationArgs {
  operation: "nested_corner_radius" | "grid_alignment" | "wcag_contrast_ratio" | "optical_line_height" | "ux_priority_score" | "complexity_cost" | "font_selection_priority";
  outerRadiusPx?: number;
  paddingPx?: number;
  valuePx?: number;
  foregroundHexOrHsl?: string;
  backgroundHexOrHsl?: string;
  fontSizePx?: number;
  textType?: "heading" | "body" | "caption";
  importance?: number;
  frequency?: number;
  urgency?: number;
  consequence?: number;
  choices?: number;
  steps?: number;
  cognitiveBurden?: number;
  platform?: string;
  productType?: string;
  existingFont?: string;
  styleTheme?: string;
}

// Convert Hex or HSL string to RGB [r, g, b] normalized 0-1
function parseColorToRgb(colorStr: string): [number, number, number] {
  const str = colorStr.trim().toLowerCase();
  
  // Hex format #rrggbb or #rgb
  if (str.startsWith("#")) {
    let hex = str.slice(1);
    if (hex.length === 3) {
      hex = hex.split("").map(c => c + c).join("");
    }
    const num = parseInt(hex, 16);
    if (isNaN(num)) return [0, 0, 0];
    const r = ((num >> 16) & 255) / 255;
    const g = ((num >> 8) & 255) / 255;
    const b = (num & 255) / 255;
    return [r, g, b];
  }

  // HSL format hsl(h, s%, l%)
  const hslMatch = str.match(/hsl\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*\)/);
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]) / 360;
    const s = parseFloat(hslMatch[2]) / 100;
    const l = parseFloat(hslMatch[3]) / 100;

    if (s === 0) return [l, l, l];

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1/3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1/3);
    return [r, g, b];
  }

  // Default fallback for dark background
  return [0.05, 0.05, 0.1];
}

// Calculate relative luminance based on WCAG 2.1 formula
function calculateRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function handleCalculateUiMath(args: MathCalculationArgs) {
  const { operation } = args;

  switch (operation) {
    case "nested_corner_radius": {
      const outer = args.outerRadiusPx ?? 16;
      const padding = args.paddingPx ?? 12;
      const inner = Math.max(0, outer - padding);

      const getTailwindRadius = (px: number) => {
        if (px === 0) return "rounded-none (0px)";
        if (px <= 2) return "rounded-xs (2px)";
        if (px <= 4) return "rounded-sm (4px)";
        if (px <= 6) return "rounded (6px)";
        if (px <= 8) return "rounded-md (8px)";
        if (px <= 12) return "rounded-lg (12px)";
        if (px <= 16) return "rounded-xl (16px)";
        if (px <= 24) return "rounded-2xl (24px)";
        return `rounded-3xl (${px}px)`;
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                operation: "nested_corner_radius",
                formula: "R_inner = Math.max(0, R_outer - Padding)",
                inputs: { outerRadiusPx: outer, paddingPx: padding },
                result: {
                  calculatedInnerRadiusPx: inner,
                  outerTailwindClass: getTailwindRadius(outer),
                  recommendedInnerTailwindClass: getTailwindRadius(inner),
                  explanation: `Calculated inner corner radius is ${inner}px. Using R_inner (${inner}px) inside R_outer (${outer}px) with ${padding}px padding creates concentric curves and prevents optical distortion.`
                }
              },
              null,
              2
            )
          }
        ]
      };
    }

    case "grid_alignment": {
      const val = args.valuePx ?? 15;
      const isAligned4pt = val % 4 === 0;
      const isAligned8pt = val % 8 === 0;
      const lowerStep = Math.floor(val / 4) * 4;
      const upperStep = Math.ceil(val / 4) * 4;

      const tailwindSpacingMap: Record<number, string> = {
        0: "p-0 (0px)",
        2: "p-0.5 (2px)",
        4: "p-1 (4px)",
        6: "p-1.5 (6px)",
        8: "p-2 (8px)",
        10: "p-2.5 (10px)",
        12: "p-3 (12px)",
        14: "p-3.5 (14px)",
        16: "p-4 (16px)",
        20: "p-5 (20px)",
        24: "p-6 (24px)",
        28: "p-7 (28px)",
        32: "p-8 (32px)",
        36: "p-9 (36px)",
        40: "p-10 (40px)",
        48: "p-12 (48px)",
        56: "p-14 (56px)",
        64: "p-16 (64px)"
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                operation: "grid_alignment",
                formula: "IsAligned = valuePx % 4 === 0",
                inputs: { valuePx: val },
                result: {
                  isAligned4ptGrid: isAligned4pt,
                  isAligned8ptGrid: isAligned8pt,
                  closestLowerGridStepPx: lowerStep,
                  closestUpperGridStepPx: upperStep,
                  recommendedTailwindClass: tailwindSpacingMap[upperStep] || `p-[${upperStep}px]`,
                  explanation: isAligned4pt
                    ? `Value ${val}px is mathematically aligned with the 4pt spatial grid.`
                    : `Value ${val}px is an arbitrary non-grid value! Re-align to ${lowerStep}px (${tailwindSpacingMap[lowerStep] || lowerStep + 'px'}) or ${upperStep}px (${tailwindSpacingMap[upperStep] || upperStep + 'px'}).`
                }
              },
              null,
              2
            )
          }
        ]
      };
    }

    case "wcag_contrast_ratio": {
      const fg = args.foregroundHexOrHsl || "#8B5CF6";
      const bg = args.backgroundHexOrHsl || "#05050A";

      const rgbFg = parseColorToRgb(fg);
      const rgbBg = parseColorToRgb(bg);

      const l1 = calculateRelativeLuminance(rgbFg);
      const l2 = calculateRelativeLuminance(rgbBg);

      const maxL = Math.max(l1, l2);
      const minL = Math.min(l1, l2);

      const ratio = (maxL + 0.05) / (minL + 0.05);
      const roundedRatio = Math.round(ratio * 100) / 100;

      const passesAA = roundedRatio >= 4.5;
      const passesAALarge = roundedRatio >= 3.0;
      const passesAAA = roundedRatio >= 7.0;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                operation: "wcag_contrast_ratio",
                formula: "CR = (L1 + 0.05) / (L2 + 0.05)",
                inputs: { foreground: fg, background: bg },
                result: {
                  contrastRatio: `${roundedRatio}:1`,
                  luminanceForeground: l1.toFixed(4),
                  luminanceBackground: l2.toFixed(4),
                  compliance: {
                    wcag21_AA_normalText: passesAA ? "PASSED" : "FAILED (requires >= 4.5:1)",
                    wcag21_AA_largeText: passesAALarge ? "PASSED" : "FAILED (requires >= 3.0:1)",
                    wcag21_AAA_normalText: passesAAA ? "PASSED" : "FAILED (requires >= 7.0:1)"
                  },
                  recommendation: passesAA
                    ? "Contrast ratio satisfies WCAG 2.1 AA requirements."
                    : "Insufficient contrast! Increase foreground brightness or darken background canvas to reach at least 4.5:1 ratio."
                }
              },
              null,
              2
            )
          }
        ]
      };
    }

    case "optical_line_height": {
      const fontSize = args.fontSizePx ?? 16;
      const textType = args.textType || "body";

      let ratio = 1.5;
      if (textType === "heading") {
        ratio = Math.max(1.1, 1.45 - (fontSize - 16) * 0.005);
      } else if (textType === "caption") {
        ratio = 1.4;
      } else {
        ratio = 1.6;
      }

      const calculatedLineHeightPx = Math.round(fontSize * ratio);

      const getTailwindLeading = (r: number) => {
        if (r <= 1.15) return "leading-none (1.0 - 1.15)";
        if (r <= 1.25) return "leading-tight (1.25)";
        if (r <= 1.375) return "leading-snug (1.375)";
        if (r <= 1.5) return "leading-normal (1.5)";
        if (r <= 1.625) return "leading-relaxed (1.625)";
        return "leading-loose (2.0)";
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                operation: "optical_line_height",
                formula: textType === "heading" ? "LH_ratio = Math.max(1.1, 1.45 - (fontSize - 16) * 0.005)" : "LH_ratio = 1.6 (Body)",
                inputs: { fontSizePx: fontSize, textType },
                result: {
                  calculatedRatio: Math.round(ratio * 100) / 100,
                  lineHeightPx: `${calculatedLineHeightPx}px`,
                  recommendedTailwindClass: getTailwindLeading(ratio),
                  explanation: `For ${fontSize}px ${textType}, the mathematically optimal optical line height is ${calculatedLineHeightPx}px (${Math.round(ratio * 100) / 100}x ratio).`
                }
              },
              null,
              2
            )
          }
        ]
      };
    }

    case "ux_priority_score": {
      const i = Math.min(5, Math.max(1, args.importance ?? 4));
      const f = Math.min(5, Math.max(1, args.frequency ?? 4));
      const u = Math.min(5, Math.max(1, args.urgency ?? 3));
      const c = Math.min(5, Math.max(1, args.consequence ?? 3));

      const raw = (i * f * u * c) / 625;
      const score = Math.round(raw * 100);
      const level = score > 66 ? "HIGH" : score > 33 ? "MEDIUM" : "LOW";

      let placement = "Primary Header CTA or Persistent Sidebar Top Item";
      if (level === "MEDIUM") placement = "Secondary Navigation Bar / Card Primary Button";
      if (level === "LOW") placement = "Overflow Dropdown Menu ('...') / Settings Tab";

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                operation: "ux_priority_score",
                formula: "PriorityScore = (Importance × Frequency × Urgency × Consequence / 625) × 100",
                inputs: { importance: i, frequency: f, urgency: u, consequence: c },
                result: {
                  score,
                  priorityLevel: level,
                  recommendedUiPlacement: placement,
                  explanation: `Priority Score is ${score}/100 (${level}). Assign ${placement}.`
                }
              },
              null,
              2
            )
          }
        ]
      };
    }

    case "complexity_cost": {
      const choices = args.choices ?? 6;
      const steps = args.steps ?? 3;
      const burden = Math.min(5, Math.max(1, args.cognitiveBurden ?? 3));

      const raw = (choices * steps * burden) / 125;
      const score = Math.round(raw * 100);
      const level = score > 60 ? "HIGH" : score > 30 ? "MEDIUM" : "LOW";

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                operation: "complexity_cost",
                formula: "ComplexityScore = (Choices × Steps × CognitiveBurden / 125) × 100",
                inputs: { choices, steps, cognitiveBurden: burden },
                result: {
                  score,
                  complexityLevel: level,
                  hicksLawActionNeeded: level === "HIGH",
                  recommendation: level === "HIGH"
                    ? "HIGH complexity score (> 60)! Apply Hick's Law: reduce choices per screen, use progressive disclosure wizards, or provide smart defaults."
                    : "Complexity level is within acceptable visual limits."
                }
              },
              null,
              2
            )
          }
        ]
      };
    }

    case "font_selection_priority": {
      const platform = (args.platform || "").toLowerCase();
      const productType = (args.productType || "").toLowerCase();
      const existingFont = args.existingFont;
      const styleTheme = (args.styleTheme || "").toLowerCase();

      let selectedFont = "Inter";
      let priorityRuleMatched = "Universal Fallback Default → Inter";
      let cssStack = "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      let tailwindConfig = "font-sans: ['Inter', 'system-ui', 'sans-serif']";

      if (platform.includes("apple") || platform.includes("ios") || platform.includes("mac")) {
        selectedFont = "SF Pro";
        priorityRuleMatched = "Rule 1: Known Apple Platform → SF Pro";
        cssStack = "'SF Pro Text', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif";
        tailwindConfig = "font-sans: ['SF Pro Text', '-apple-system', 'sans-serif']";
      } else if (existingFont && existingFont.trim().length > 0) {
        selectedFont = existingFont.trim();
        priorityRuleMatched = "Rule 2: Existing Product / Design System Font → Preserve Defined Font";
        cssStack = `'${selectedFont}', system-ui, sans-serif`;
        tailwindConfig = `font-sans: ['${selectedFont}', 'sans-serif']`;
      } else if (productType.includes("developer") || productType.includes("tool") || productType.includes("technical") || productType.includes("ide") || productType.includes("code")) {
        selectedFont = "Geist";
        priorityRuleMatched = "Rule 4: Developer / Tool / Technical Product → Geist";
        cssStack = "'Geist', 'Geist Mono', system-ui, sans-serif";
        tailwindConfig = "font-sans: ['Geist', 'Geist Mono', 'sans-serif']";
      } else if (styleTheme.includes("helvetica") || styleTheme.includes("apple-style") || styleTheme.includes("swiss")) {
        selectedFont = "Helvetica";
        priorityRuleMatched = "Rule 5: Apple-style or Helvetica-based Visual System → Helvetica";
        cssStack = "'Helvetica Neue', Helvetica, Arial, sans-serif";
        tailwindConfig = "font-sans: ['Helvetica Neue', 'Helvetica', 'sans-serif']";
      } else {
        selectedFont = "Inter";
        priorityRuleMatched = "Rule 3 / 6: Modern Web / SaaS / Product Interface (No Defined Font) → Inter (Universal Fallback)";
        cssStack = "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
        tailwindConfig = "font-sans: ['Inter', 'system-ui', 'sans-serif']";
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                operation: "font_selection_priority",
                approvedFontTier: ["SF Pro", "Inter", "Geist", "Helvetica"],
                inputs: { platform: args.platform || null, productType: args.productType || null, existingFont: args.existingFont || null, styleTheme: args.styleTheme || null },
                result: {
                  selectedFont,
                  priorityRuleMatched,
                  cssStack,
                  tailwindConfig,
                  universalFallback: "Inter"
                }
              },
              null,
              2
            )
          }
        ]
      };
    }

    default:
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: `Invalid operation: '${operation}'. Available operations: 'nested_corner_radius', 'grid_alignment', 'wcag_contrast_ratio', 'optical_line_height', 'ux_priority_score', 'complexity_cost', 'font_selection_priority'.`
            })
          }
        ],
        isError: true
      };
  }
}
