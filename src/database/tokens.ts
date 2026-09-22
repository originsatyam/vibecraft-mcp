export interface DesignTokenGroup {
  category: string;
  tokens: Record<string, string | number | object>;
  usageGuidance: string;
  globalsCssTemplate?: string;
  semanticTokens?: Record<string, string>;
}

export const DESIGN_TOKENS: Record<string, DesignTokenGroup> = {
  colors: {
    category: "Dynamic HSL Semantic Color Palette (Light & Dark Mode)",
    usageGuidance: "Always use HSL CSS variables with opacity modulations. Never hardcode hex/rgb colors.",
    globalsCssTemplate: `@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}`,
    tokens: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      card: "hsl(var(--card))",
      cardForeground: "hsl(var(--card-foreground))",
      popover: "hsl(var(--popover))",
      popoverForeground: "hsl(var(--popover-foreground))",
      primary: "hsl(var(--primary))",
      primaryForeground: "hsl(var(--primary-foreground))",
      secondary: "hsl(var(--secondary))",
      secondaryForeground: "hsl(var(--secondary-foreground))",
      muted: "hsl(var(--muted))",
      mutedForeground: "hsl(var(--muted-foreground))",
      accent: "hsl(var(--accent))",
      accentForeground: "hsl(var(--accent-foreground))",
      destructive: "hsl(var(--destructive))",
      destructiveForeground: "hsl(var(--destructive-foreground))",
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))"
    },
    semanticTokens: {
      "color.text.primary": "hsl(var(--foreground))",
      "color.text.secondary": "hsl(var(--muted-foreground))",
      "color.surface.default": "hsl(var(--background))",
      "color.surface.elevated": "hsl(var(--card))",
      "color.action.primary": "hsl(var(--primary))",
      "color.border.default": "hsl(var(--border))",
      "color.status.success": "hsl(142 76% 36%)",
      "color.status.warning": "hsl(38 92% 50%)",
      "color.status.error": "hsl(var(--destructive))"
    }
  },
  interactiveFocus: {
    category: "Single Focus Outline & Accessible Focus State Grammar",
    usageGuidance: "STRICT SINGLE FOCUS RULE: Never stack native browser outlines + custom border + custom focus ring simultaneously. Apply outline: none or focus:outline-none alongside focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 to guarantee exactly ONE clear focus indicator.",
    tokens: {
      singleFocusRule: "ONE intentional focus indicator. Prevent stacking native outline + border + ring.",
      defaultState: "border: 1px solid var(--border); background: var(--background);",
      hoverState: "border-color: var(--muted-foreground); background: rgba(255, 255, 255, 0.04);",
      focusState: "outline: none; border-color: var(--ring); box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring);",
      focusVisibleClasses: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    }
  },
  svgChartGeometry: {
    category: "SVG Chart Geometry & Stroke Padding Safety Grammar",
    usageGuidance: "STRICT CHART CLIPPING PREVENTION: SVG chart paths MUST include internal vertical padding P_svg = strokeWidth * 2 >= 8px. For viewBox='0 0 W H', path Y coordinates must cycle between [P_svg, H - P_svg] so line stroke peaks do not clip at top/bottom edges. Set overflow: visible or padding inside container.",
    tokens: {
      strokePaddingFormula: "P_svg = strokeWidth * 2 (min 8px)",
      yCoordBounds: "[P_svg, H - P_svg]",
      xCoordBounds: "[P_svg, W - P_svg]",
      overflowProperty: "overflow: visible; on <svg> or inner padding box",
      responsiveResizing: "viewBox='0 0 500 150' preserveAspectRatio='xMidYMid meet'"
    }
  },
  navigationStateGrammar: {
    category: "4-State Navigation Grammar (Default, Hover, Active, Selected)",
    usageGuidance: "STRICT NAVIGATION STATES: Establish clear distinction between Default (resting), Hover (pointer-over), Active (pressed), and Selected (current page). Attach aria-current='page' ONLY to the single currently active page item.",
    tokens: {
      default: "color: var(--muted-foreground); background: transparent; font-weight: 500;",
      hover: "color: var(--card-foreground); background: rgba(255, 255, 255, 0.04);",
      activePressed: "color: var(--card-foreground); background: rgba(255, 255, 255, 0.08); transform: scale(0.98);",
      selectedCurrent: "color: #ffffff; background: rgba(255, 255, 255, 0.06); border: 1px solid var(--border); font-weight: 600; aria-current='page'",
      ariaCurrentRule: "aria-current='page' attached ONLY to current route item."
    }
  },
  typography: {
    category: "Universal Typography System, Approved Fonts & Optical Scales",
    usageGuidance: "STRICT APPROVED FONTS: Inter, Geist, SF Pro, Helvetica. Majority font for ALL interface text, headings, data, numbers, tables, and values is Inter or Geist (sans-serif). Do NOT use font-mono for numbers, dates, IDs, or table values unless explicitly displaying raw code snippets.",
    tokens: {
      approvedFontSet: ["Inter", "Geist", "SF Pro", "Helvetica"],
      fontPriorityRules: {
        modernSaaSOrWeb: "Inter (Universal Primary UI Font)",
        cleanProductInterface: "Geist (Primary Modern Sans)",
        applePlatform: "SF Pro (-apple-system, SF Pro Text, SF Pro Display)",
        universalFallback: "Inter",
        monoUsage: "STRICTLY RESERVED FOR RAW CODE BLOCKS (Do not use mono for UI labels/numbers)"
      },
      primaryFontFamily: "Inter, Geist, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      geistFontFamily: "'Geist', 'Inter', system-ui, sans-serif",
      sfProFontFamily: "'SF Pro Text', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      helveticaFontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      monoFontFamily: "'Geist Mono', 'JetBrains Mono', 'Fira Code', monospace",
      display: { fontSize: "3.5rem", lineHeight: "1.1", tracking: "-0.02em", weight: "700" },
      h1: { fontSize: "2.25rem", lineHeight: "1.2", tracking: "-0.015em", weight: "700" },
      h2: { fontSize: "1.875rem", lineHeight: "1.25", tracking: "-0.01em", weight: "600" },
      h3: { fontSize: "1.5rem", lineHeight: "1.3", tracking: "-0.005em", weight: "600" },
      bodyLarge: { fontSize: "1.125rem", lineHeight: "1.5", tracking: "0em", weight: "400" },
      body: { fontSize: "1rem", lineHeight: "1.5", tracking: "0em", weight: "400" },
      caption: { fontSize: "0.875rem", lineHeight: "1.4", tracking: "0.01em", weight: "400" },
      small: { fontSize: "0.75rem", lineHeight: "1.33", tracking: "0.02em", weight: "500" },
      tabularNums: "font-variant-numeric: tabular-nums"
    }
  },
  spatialGrid: {
    category: "4px/8px Spatial Layout Grid & Radius Tokens",
    usageGuidance: "All padding, margins, and component dimensions must align with 4px multiples.",
    tokens: {
      gridBase: "4px",
      spaceXs: "4px",
      spaceSm: "8px",
      spaceMd: "16px",
      spaceLg: "24px",
      spaceXl: "32px",
      space2Xl: "48px",
      radiusStructural: "0.375rem to 0.5rem (6px to 8px / rounded-md to rounded-lg) [Cards, Modals, Panels, Sidebars]",
      radiusControls: "0.25rem to 0.375rem (4px to 6px / rounded to rounded-md) [Inputs, Standard Buttons, Dropdowns]",
      radiusDenseData: "0px to 0.125rem (0px to 2px / rounded-none to rounded-sm) [Tables, Grids, Dense Data Cells]",
      radiusStatusPill: "9999px (rounded-full) [Badges, Tags, Metadata, Code Stat Buttons]",
      nestedCornerMathFormula: "R_inner = R_outer - Padding (e.g., if Outer R = 12px and Padding = 8px, Inner R MUST = 4px)",
      minTouchTarget: "44px",
      minClickTarget: "36px"
    }
  },
  iconsAndSymbols: {
    category: "Icon Scale, Stroke Treatment & Symbol Indicators",
    usageGuidance: "Use Lucide/Tabler icons with consistent 2px stroke. Icon-only buttons must have aria-label.",
    tokens: {
      iconSm: "16px",
      iconMd: "20px",
      iconLg: "24px",
      iconXl: "32px",
      strokeWidth: "2px",
      viewBox: "0 0 24 24"
    }
  },
  shadows: {
    category: "Elevation & Glassmorphic Backdrop Tokens",
    usageGuidance: "Use layered shadows with HSL borders to create depth.",
    tokens: {
      shadowSm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      shadowMd: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      shadowLg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      shadowCard: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      glassBackdrop: "backdrop-filter: blur(16px) saturate(180%); background-color: hsl(var(--card) / 0.6);"
    }
  },
  motionCurves: {
    category: "transitions.dev & Apple Spring Physics Presets",
    usageGuidance: "Use physics-based springs instead of linear/ease transitions for natural feel.",
    tokens: {
      appleSpringDefault: { type: "spring", stiffness: 300, damping: 30, mass: 1 },
      appleSpringSnappy: { type: "spring", stiffness: 400, damping: 25, mass: 0.8 },
      appleSpringGentle: { type: "spring", stiffness: 200, damping: 28, mass: 1.2 },
      durationFast: "150ms",
      durationStandard: "250ms",
      durationSlow: "350ms"
    }
  },
  zIndexScale: {
    category: "Deterministic Z-Index & Stacking Context System",
    usageGuidance: "Never output arbitrary z-indices (z-9999, z-99). Use explicit token scale and isolation: isolate.",
    tokens: {
      zBase: "z-0 [Base Content, Charts, Data Tables, SVGs]",
      zSticky: "z-10 to z-20 [Sticky Headers, Navbars, Sidebars]",
      zDropdown: "z-30 [Dropdown Menus, Popovers, Tooltips]",
      zModal: "z-40 [Modals, Dialog Overlays, Sheet Backdrops]",
      zToast: "z-50 [Toasts, Emergency Alerts, Critical Notifications]"
    }
  },
  componentVariantContracts: {
    category: "shadcn/ui & Radix Component Variant Contracts (CVA)",
    usageGuidance: "Standardized Class Variance Authority (CVA) variant matrices and size scales across Buttons, Badges, Inputs, and Navigation components.",
    tokens: {
      buttonVariants: "cva('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50', { variants: { variant: { default, destructive, outline, secondary, ghost, link }, size: { default: 'h-9 px-4 py-2', sm: 'h-8 px-3 text-xs', lg: 'h-10 px-8', icon: 'h-9 w-9' } } })",
      inputVariant: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      badgeVariant: "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      concentricRadiusCalc: "--radius-lg: var(--radius); --radius-md: calc(var(--radius) - 2px); --radius-sm: calc(var(--radius) - 4px);"
    }
  },
  figmaExtractedIntelligence: {
    category: "Figma Design Intelligence Extraction (iOS 18 / Community Inspection)",
    usageGuidance: "Transferable design logic, concentric corner math, multi-state navigation grammar, and density surface separation extracted from Figma node analysis.",
    tokens: {
      concentricRadiusFormula: "R_inner = max(0, R_outer - Padding)",
      touchTargetConstraint: "Min interactive bounding box 44px x 44px for mobile/tablet tap targets.",
      layeredSurfaceDensity: "Ultrathin/Thin for persistent backgrounds; Regular/Thick for transient overlays and modal dialogs.",
      sidebarNavGeometry: "Sidebar width 320px, item height 44px, item radius 11px, horizontal padding 24px, gap 10px.",
      svgStrokePadding: "P_svg = max(8px, strokeWidth * 2) with overflow: visible to prevent edge clipping."
    }
  }
};
