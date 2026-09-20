export interface RAGChunkMetadata {
  category: "shadcn_components" | "apple_hig" | "laws_of_ux" | "design_tokens" | "accessibility" | "governance" | "design_math";
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
      principle: "Apple Modality & Focus Trap Trap Prevention",
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
    summary: "Single primary CTA with CVA variant variants (default, secondary, ghost, destructive, outline).",
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

  // 3. CONCENTRIC CORNER RADIUS MATH CHUNK
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

  // 4. APPROVED FONT TIER SELECTION CHUNK
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

  // 5. TAILWIND 4PX SPACING GRID CHUNK
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

  // 6. WCAG 2.1 AA CONTRAST MATH CHUNK
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
  }
];
