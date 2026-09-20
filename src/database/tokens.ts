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
  typography: {
    category: "Universal Typography System, Approved Fonts & Optical Scales",
    usageGuidance: "STRICT APPROVED FONTS: SF Pro, Inter, Geist, Helvetica. Universal fallback is Inter. Maintain 1.2 line-height for headings and 1.5 for body text.",
    tokens: {
      approvedFontSet: ["SF Pro", "Inter", "Geist", "Helvetica"],
      fontPriorityRules: {
        applePlatform: "SF Pro (-apple-system, SF Pro Text, SF Pro Display)",
        existingDesignSystem: "Preserve defined font",
        modernSaaSOrWeb: "Inter (Universal Fallback)",
        developerOrTechTool: "Geist (Geist, Geist Mono)",
        appleStyleOrHelveticaVisual: "Helvetica (Helvetica Neue, Helvetica)",
        universalFallback: "Inter"
      },
      primaryFontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      sfProFontFamily: "'SF Pro Text', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      geistFontFamily: "'Geist', 'Geist Mono', system-ui, sans-serif",
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
      viewBox: "0 0 24 24",
      statusSuccess: "CheckCircle2 (Green-500)",
      statusWarning: "AlertTriangle (Amber-500)",
      statusError: "AlertOctagon (Red-500)",
      statusInfo: "Info (Blue-500)"
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
      durationSlow: "350ms",
      viewTransitionFade: "::view-transition-old(root), ::view-transition-new(root) { animation-duration: 250ms; }",
      layoutIdMorphing: "framer-motion layoutId='shared-element-id' transition={{ type: 'spring', stiffness: 350, damping: 30 }}"
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
      zToast: "z-50 [Toasts, Emergency Alerts, Critical Notifications]",
      stackingIsolation: "isolation: isolate [Constrain third-party widgets & Canvas from bleeding]"
    }
  }
};
