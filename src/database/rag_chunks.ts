export interface RAGChunkMetadata {
  category: "shadcn_components" | "apple_hig" | "laws_of_ux" | "design_tokens" | "accessibility" | "governance" | "design_math" | "figma_intelligence";
  topic: string;
  principle: string;
  pattern: string;
  conditions: string;
  dependencies: string[];
  platform: "web" | "apple" | "cross-platform";
  useCase: string;
  priority: 1 | 2 | 3 | 4 | 5; // 1 = Critical, 5 = Low
  source: string;
  pipelineStage: "principles" | "rules" | "patterns" | "calculations" | "validation";
}

export interface RAGChunk {
  id: string;
  title: string;
  summary: string;
  content: string;
  metadata: RAGChunkMetadata;
}

export const RAG_KNOWLEDGE_BASE: RAGChunk[] = [
  // 1. SHADCN DIALOG / MODAL CHUNK
  {
    id: "shadcn_dialog_modal",
    title: "shadcn/ui Dialog Primitive & Apple Modality Focus Trap",
    summary: "Accessible modal dialog using Radix UI Dialog primitive with dark glass backdrop and focus traps.",
    content: `/* shadcn/ui Dialog Pattern */
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function AccessibleDialog({ isOpen, onOpenChange, title, children }) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-2xl duration-200 rounded-2xl">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight text-foreground">{title}</DialogPrimitive.Title>
          </div>
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}`,
    metadata: {
      category: "shadcn_components",
      topic: "dialog_modal",
      principle: "Apple Modality & Focus Trap Prevention",
      pattern: "DialogPrimitive.Root + Backdrop Blur + SR-Only Close",
      conditions: "When displaying critical non-destructive user confirmation or task wizards",
      dependencies: ["@radix-ui/react-dialog", "lucide-react", "tailwind-merge"],
      platform: "web",
      useCase: "modal_dialog",
      priority: 1,
      source: "https://github.com/shadcn-ui/ui",
      pipelineStage: "patterns"
    }
  },

  // 2. SHADCN BUTTON HIERARCHY CHUNK
  {
    id: "shadcn_button_cva",
    title: "shadcn/ui Button Variants (CVA) & Fitts's Law Hit Area",
    summary: "Single primary CTA with CVA variant compositions (default, secondary, ghost, destructive, outline).",
    content: `/* shadcn/ui Button CVA Architecture */
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-11 w-11 p-0 flex items-center justify-center"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);`,
    metadata: {
      category: "shadcn_components",
      topic: "button_hierarchy",
      principle: "Source of Truth Hierarchy & Fitts's Law 44px Hit Area",
      pattern: "cva() variant composition + bg-primary + min-h-[44px]",
      conditions: "Used across all user interaction CTAs to prevent competing primary buttons",
      dependencies: ["class-variance-authority", "clsx"],
      platform: "web",
      useCase: "cta_button",
      priority: 1,
      source: "https://github.com/shadcn-ui/ui",
      pipelineStage: "rules"
    }
  },

  // 3. SHADCN CVA & SLOT CONTRACTS CHUNK
  {
    id: "shadcn_cva_slot_contracts",
    title: "shadcn/ui Slot Composition & Class Merging (cn) Contracts",
    summary: "Polymorphic component rendering using @radix-ui/react-slot and tailwind-merge cn() utility.",
    content: `/* Polymorphic Slot & cn Utility Contract */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const Component = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn("inline-flex items-center", className)} ref={ref} {...props} />;
  }
);`,
    metadata: {
      category: "shadcn_components",
      topic: "cva_slot_contracts",
      principle: "Polymorphic Architecture & Zero-Conflict Class Merging",
      pattern: "asChild ? Slot : 'button' + twMerge(clsx(inputs))",
      conditions: "Required when wrapping components or nesting links/buttons cleanly",
      dependencies: ["@radix-ui/react-slot", "tailwind-merge", "clsx"],
      platform: "web",
      useCase: "polymorphic_component",
      priority: 1,
      source: "https://github.com/shadcn-ui/ui",
      pipelineStage: "patterns"
    }
  },

  // 4. FIGMA LAYOUT & TOKEN EXTRACTION CHUNK
  {
    id: "figma_layout_token_extraction",
    title: "Figma Design Intelligence: Auto-Layout & Token Mapping",
    summary: "Translates Figma node structures (FRAME/COMPONENT) directly into flexbox, grid, rounded borders, and HSL semantic tokens.",
    content: `/* Figma Node -> Tailwind CSS Mapping Rules */
Figma Property Mapping:
- layoutMode === 'HORIZONTAL' -> 'flex flex-row'
- layoutMode === 'VERTICAL'   -> 'flex flex-col'
- primaryAxisAlignItems === 'SPACE_BETWEEN' -> 'justify-between'
- counterAxisAlignItems === 'CENTER'       -> 'items-center'
- itemSpacing (16px)          -> 'gap-4' (Spacing = Px / 4)
- cornerRadius (16px)         -> 'rounded-2xl'
- fills[0].color (RGBA)       -> HSL color variable '--primary' / '--card'

Extraction Rule:
Preserve component hierarchy and calculate concentric inner radii:
R_inner = Math.max(0, R_outer - Padding)`,
    metadata: {
      category: "figma_intelligence",
      topic: "figma_extraction",
      principle: "Deterministic Figma AST Node Translation",
      pattern: "layoutMode -> flex | itemSpacing -> gap-{N} | fills -> CSS Var",
      conditions: "Used when importing design specs from Figma files or node subtrees",
      dependencies: ["figma-developer-mcp", "tailwindcss"],
      platform: "cross-platform",
      useCase: "design_system_import",
      priority: 1,
      source: "figma_mcp_extraction_spec",
      pipelineStage: "rules"
    }
  },

  // 5. CONCENTRIC CORNER RADIUS MATH CHUNK
  {
    id: "nested_corner_radius_math",
    title: "Concentric Corner Radius Formula & Nested Container Geometry",
    summary: "Mathematical calculation preventing optical corner clipping (R_inner = max(0, R_outer - Padding)).",
    content: `/* Nested Corner Radius Formula */
Formula: R_inner = Math.max(0, R_outer - Padding)

Example Math:
- Outer Card Radius = 16px (rounded-xl)
- Card Padding = 12px (p-3)
- Calculated Inner Item Radius = 16px - 12px = 4px (rounded-sm)

Bad Code (Clipping):
<div className="rounded-xl p-3 bg-card">
  <div className="rounded-xl bg-muted p-2">Clipping Artifacts!</div>
</div>

Good Code (Concentric):
<div className="rounded-xl p-3 bg-card">
  <div className="rounded-sm bg-muted p-2 font-mono text-xs">Concentric Perfection</div>
</div>`,
    metadata: {
      category: "design_math",
      topic: "concentric_corners",
      principle: "Concentric Corner Geometry Math",
      pattern: "R_inner = max(0, R_outer - P)",
      conditions: "Required whenever a container with rounded corners contains child elements with padding",
      dependencies: ["tailwind-css"],
      platform: "cross-platform",
      useCase: "card_container",
      priority: 1,
      source: "apple_hig_math",
      pipelineStage: "calculations"
    }
  },

  // 6. APPROVED FONT TIER SELECTION CHUNK
  {
    id: "approved_font_system_priority",
    title: "Strict Approved Font Tier & Context Priority Selection",
    summary: "Deterministic font selection from approved tier [SF Pro, Inter, Geist, Helvetica] with Inter as universal fallback.",
    content: `/* Approved Font Priority Pipeline */
Tier: SF Pro | Inter | Geist | Helvetica

Selection Priority:
1. Known Apple Platform -> SF Pro ('SF Pro Text', 'SF Pro Display')
2. Existing Design System -> Preserve defined font
3. Modern Web / SaaS / Product Interface -> Inter (Universal Fallback)
4. Developer / Tool / Technical Product -> Geist ('Geist', 'Geist Mono')
5. Apple-style or Helvetica Visual System -> Helvetica ('Helvetica Neue', Helvetica)
6. Universal Fallback -> Inter

Tailwind Configuration:
--font-sans: "Inter", "Geist", "SF Pro Text", -apple-system, sans-serif;
--font-mono: "Geist Mono", monospace;`,
    metadata: {
      category: "design_tokens",
      topic: "font_system",
      principle: "Approved Font Tier Governance",
      pattern: "Inter -> Geist -> SF Pro -> Helvetica Priority Stack",
      conditions: "Used when establishing typography standards for new or existing applications",
      dependencies: ["google-fonts", "tailwindcss"],
      platform: "cross-platform",
      useCase: "typography",
      priority: 2,
      source: "vibecraft_ds_governance",
      pipelineStage: "principles"
    }
  },

  // 7. TAILWIND 4PX SPACING GRID CHUNK
  {
    id: "tailwind_4px_grid_math",
    title: "Tailwind CSS 4px Base Spatial Grid Conversion & Audit",
    summary: "Strict 4px (0.25rem) base scale unit conversion. Rejects unaligned arbitrary pixel spacing.",
    content: `/* Tailwind 4px Base Spatial Grid Math */
Formula: TailwindScale = PxValue / 4 (1 unit = 0.25rem = 4px)

Valid Standard Classes:
- 4px  -> p-1 / gap-1 / m-1
- 8px  -> p-2 / gap-2 / m-2
- 12px -> p-3 / gap-3 / m-3
- 16px -> p-4 / gap-4 / m-4
- 24px -> p-6 / gap-6 / m-6
- 32px -> p-8 / gap-8 / m-8

Forbidden Anti-Pattern:
- p-[17px], m-[11px], gap-[7px] (Arbitrary un-aligned values)

Refactoring Rule:
Convert 17px -> 16px (p-4) or 20px (p-5).`,
    metadata: {
      category: "design_math",
      topic: "spacing_grid",
      principle: "4px Base Spatial Grid System",
      pattern: "Scale = Px / 4 -> p-{Scale}",
      conditions: "Used across all padding, margin, gap, width, and height spatial utility classes",
      dependencies: ["tailwindcss"],
      platform: "web",
      useCase: "layout_spacing",
      priority: 2,
      source: "https://github.com/tailwindlabs/tailwindcss",
      pipelineStage: "validation"
    }
  },

  // 8. WCAG 2.1 AA CONTRAST MATH CHUNK
  {
    id: "wcag_contrast_math",
    title: "WCAG 2.1 AA Relative Luminance & Contrast Ratio Math",
    summary: "Calculates contrast ratio CR = (L1 + 0.05) / (L2 + 0.05). Requires CR >= 4.5:1 for normal text.",
    content: `/* WCAG 2.1 AA Contrast Ratio Math */
Formula: ContrastRatio = (L1 + 0.05) / (L2 + 0.05)
Luminance L = 0.2126 * R + 0.7152 * G + 0.0722 * B

Thresholds:
- Normal Text (< 18pt): Minimum 4.5:1 Ratio
- Large Text (>= 18pt or 14pt bold): Minimum 3.0:1 Ratio
- UI Components & Interactive Borders: Minimum 3.0:1 Ratio

Example:
Foreground: #F8FAFC (L1 = 0.95)
Background: #05050A (L2 = 0.005)
Contrast Ratio: (0.95 + 0.05) / (0.005 + 0.05) = 1.00 / 0.055 = 18.18:1 (PASSED AAA)`,
    metadata: {
      category: "accessibility",
      topic: "wcag_contrast",
      principle: "WCAG 2.1 AA Luminance Math",
      pattern: "CR = (L1 + 0.05) / (L2 + 0.05) >= 4.5:1",
      conditions: "Mandatory for all text and interactive state color pairs",
      dependencies: ["wcag-2.1"],
      platform: "cross-platform",
      useCase: "color_accessibility",
      priority: 1,
      source: "w3c_wcag_21",
      pipelineStage: "validation"
    }
  },

  // 9. APPLE HIG MODALITY & GLASSMORPHISM CHUNK
  {
    id: "apple_hig_modality_glass",
    title: "Apple HIG Liquid Glassmorphism & Touch Boundary Standards",
    summary: "Defines liquid glass backdrop filters, subtle 1px specular borders, and 44x44pt minimum touch targets.",
    content: `/* Apple HIG Glassmorphism & Touch Target Standards */
Touch Target: Minimum 44px x 44px (min-h-[44px] min-w-[44px])

Glass Container Spec:
className="bg-background/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl"

Interactive Transitions:
className="transition-all duration-300 ease-out active:scale-[0.98] hover:bg-accent/50"`,
    metadata: {
      category: "apple_hig",
      topic: "glassmorphism_touch",
      principle: "Apple Human Interface Guidelines Touch & Glass",
      pattern: "backdrop-blur-xl + bg-background/80 + min-h-[44px]",
      conditions: "Applied to floating toolbars, cards, sidebars, and iOS/macOS web components",
      dependencies: ["tailwindcss"],
      platform: "apple",
      useCase: "glass_card",
      priority: 1,
      source: "apple_hig_spec",
      pipelineStage: "patterns"
    }
  },

  // 10. ACCESSIBILITY ARIA & KEYBOARD FOCUS GOVERNANCE CHUNK
  {
    id: "aria_keyboard_focus_governance",
    title: "ARIA Roles & Keyboard Navigation Governance",
    summary: "Enforces focus-visible rings, screen reader aria attributes (aria-expanded, aria-controls), and keyboard escape handlers.",
    content: `/* ARIA & Keyboard Focus Governance */
Focus Ring Standard:
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

ARIA Attribute Contract:
- Buttons triggering popovers must carry aria-expanded={isOpen} and aria-controls="content-id"
- Interactive non-button elements (div/span) MUST include role="button", tabIndex={0}, and onKeyDown for Enter/Space
- Hidden icons MUST use aria-hidden="true"`,
    metadata: {
      category: "accessibility",
      topic: "aria_keyboard_focus",
      principle: "Keyboard Operability & Screen Reader Accessibility",
      pattern: "focus-visible:ring-2 + aria-expanded + tabIndex={0}",
      conditions: "Mandatory across all interactive widgets and dropdown menus",
      dependencies: ["wcag-2.1"],
      platform: "web",
      useCase: "interactive_widget",
      priority: 1,
      source: "w3c_aria_1.2",
      pipelineStage: "rules"
    }
  }
];
