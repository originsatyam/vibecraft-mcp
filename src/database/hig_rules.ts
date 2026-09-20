export interface UXRule {
  id: string;
  category: "apple_hig" | "laws_of_ux" | "growth_design" | "transitions_dev" | "accessibility" | "hook_model" | "ixdf_foundations" | "shape_of_design" | "ds_governance" | "ai_slop_prevention" | "design_principles";
  title: string;
  summary: string;
  keyPrinciples: string[];
  codeRefactoringExample: {
    badCode: string;
    goodCode: string;
    explanation: string;
  };
}

export const UX_RULES_DATABASE: Record<string, UXRule> = {
  ai_slop_rejection: {
    id: "ai_slop_rejection",
    category: "ai_slop_prevention",
    title: "AI-Slop Anti-Pattern Prevention Engine",
    summary: "Actively reject generic, unjustified AI design anti-patterns (decorative card grids, competing primary buttons, unneeded glassmorphism).",
    keyPrinciples: [
      "Reject: Generic dashboard templates, unnecessary card grids, decorative metrics without actionability.",
      "Reject: Multiple competing primary buttons (`bg-primary` on 3 adjacent buttons).",
      "Reject: Meaningless charts, excessive glassmorphism, or gratuitous WebGL particle background animations.",
      "Rule: Every visual element must be justified by user task requirement, not aesthetic intuition."
    ],
    codeRefactoringExample: {
      badCode: `<div className="flex gap-4 backdrop-blur-xl bg-white/10 p-8 rounded-3xl">
  <button className="bg-blue-600 text-white p-4">Save</button>
  <button className="bg-indigo-600 text-white p-4">Submit</button>
  <button className="bg-purple-600 text-white p-4">Publish</button>
</div>`,
      goodCode: `<div className="flex items-center justify-end gap-3 p-4 bg-card border border-border rounded-2xl">
  <button className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent text-muted-foreground">Save Draft</button>
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold">Publish Project</button>
</div>`,
      explanation: "Replaces 3 competing primary buttons with 1 clear primary CTA and 1 secondary button using semantic HSL tokens."
    }
  },

  hicks_law: {
    id: "hicks_law",
    category: "laws_of_ux",
    title: "Hick's Law (Choice Overload Reduction)",
    summary: "The time it takes to make a decision increases logarithmically with the number and complexity of choices.",
    keyPrinciples: [
      "Limit primary actions on any screen or modal to a maximum of 1 or 2 options.",
      "Use progressive disclosure to hide secondary advanced options.",
      "Highlight a recommended default option visually to accelerate decision making."
    ],
    codeRefactoringExample: {
      badCode: `<div className="flex gap-2">
  <button>Basic</button>
  <button>Pro</button>
  <button>Enterprise</button>
  <button>Custom</button>
  <button>Contact Us</button>
</div>`,
      goodCode: `<div className="flex flex-col gap-4">
  <div className="border-2 border-primary p-4 rounded-xl relative">
    <span className="badge-recommended">Most Popular</span>
    <h3>Pro Plan</h3>
    <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg">Get Started</button>
  </div>
  <button className="text-sm text-muted-foreground underline">View all plans</button>
</div>`,
      explanation: "Reduces choice clutter by highlighting the primary recommended option and tucking secondary plans behind progressive disclosure."
    }
  },

  fitts_law: {
    id: "fitts_law",
    category: "laws_of_ux",
    title: "Fitts's Law (Target Sizing & Placement)",
    summary: "The time to acquire a target is a function of the distance to and size of the target.",
    keyPrinciples: [
      "Ensure touch targets are at least 44x44px for mobile and 36-40px for desktop.",
      "Place primary interactive controls (e.g. submit buttons, bottom sheets, navigation) in easily accessible ergonomic zones.",
      "Increase hit areas around small icons using padding instead of tiny clickable paths."
    ],
    codeRefactoringExample: {
      badCode: `<button onClick={close} className="w-4 h-4">
  <XIcon />
</button>`,
      goodCode: `<button onClick={close} className="p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-accent focus:ring-2 focus:ring-ring">
  <XIcon className="w-5 h-5" />
</button>`,
      explanation: "Increases the clickable touch area to 44x44px with focus rings and hover feedback."
    }
  },

  ds_13_state_matrix: {
    id: "ds_13_state_matrix",
    category: "ds_governance",
    title: "13-State Interactive Component State Matrix",
    summary: "Design system components must define explicit visual and semantic behaviors for all 13 interactive states.",
    keyPrinciples: [
      "States: Default, Hover, Focus, Active, Selected, Pressed, Disabled, Loading, Success, Error, Read-Only, Partially Selected, Permission Restricted.",
      "Never rely on color alone for states; use border rings, icons, and opacity modulations.",
      "Ensure accessible ARIA states (`aria-disabled='true'`, `aria-busy='true'`, `aria-selected='true'`)."
    ],
    codeRefactoringExample: {
      badCode: `<button className="bg-blue-500 text-white">Save</button>`,
      goodCode: `<button
  disabled={isDisabled || isLoading}
  aria-busy={isLoading}
  aria-disabled={isDisabled}
  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none px-4 py-2 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
>
  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
  <span>Save Changes</span>
</button>`,
      explanation: "Implements Hover, Focus-Visible, Active scale, Disabled, and Loading states cleanly."
    }
  },

  doherty_threshold: {
    id: "doherty_threshold",
    category: "laws_of_ux",
    title: "Doherty Threshold & Skeleton Response UX",
    summary: "System response must occur in under 400ms to keep user attention engaged without context switching.",
    keyPrinciples: [
      "Provide instantaneous visual feedback (<100ms) on clicks (active state, spinner, button morph).",
      "Use skeleton loaders matching exact layout bounds during async data fetching.",
      "Avoid blank white screens during route changes; use optimistic UI updates."
    ],
    codeRefactoringExample: {
      badCode: `{isLoading ? <p>Loading...</p> : <DataGrid data={data} />}`,
      goodCode: `{isLoading ? (
  <div className="space-y-3">
    <Skeleton className="h-8 w-1/3 rounded-lg" />
    <Skeleton className="h-64 w-full rounded-xl" />
  </div>
) : (
  <DataGrid data={data} />
)}`,
      explanation: "Skeleton loader prevents visual layout shift and maintains cognitive flow under the 400ms Doherty threshold."
    }
  },

  tsod_three_levers: {
    id: "tsod_three_levers",
    category: "shape_of_design",
    title: "Frank Chimero's 3 Levers of Design (Message, Tone, Format)",
    summary: "High-craft design balances Message (utility), Tone (emotional inflection & resonance), and Format (the physical/digital artifact).",
    keyPrinciples: [
      "Message: Clearly communicate core utility without ambiguity.",
      "Tone: Match typography, spacing, and micro-interactions to the user's emotional state (warm, confident, non-patronizing).",
      "Format: Utilize web-native affordances (motion, responsive grids, shared element transitions) rather than static paper layouts."
    ],
    codeRefactoringExample: {
      badCode: `<div className="text-red-500 font-bold">Error 500</div>`,
      goodCode: `<div className="bg-destructive/10 border border-destructive/30 p-6 rounded-2xl text-center space-y-3">
  <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
  <h4 className="font-semibold text-foreground">Something went wrong on our end</h4>
  <p className="text-xs text-muted-foreground">Your progress is saved safely. Let's get you back on track.</p>
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-medium">Retry Connection</button>
</div>`,
      explanation: "Harmonizes utility message with empathetic, reassuring tone and interactive retry format."
    }
  },

  tsod_how_vs_why: {
    id: "tsod_how_vs_why",
    category: "shape_of_design",
    title: "Frank Chimero's How vs. Why Balance (Avoiding AI Slop)",
    summary: "How questions address technique and craft; Why questions define purpose, context, and human objective.",
    keyPrinciples: [
      "Never generate UI components (How) without first determining their objective and user context (Why).",
      "Focus on near & far perspectives: evaluate code micro-details near, and step back to assess whole page harmony far.",
      "Avoid empty visual mimicry ('imitating car alarms from sweetgum trees')."
    ],
    codeRefactoringExample: {
      badCode: `<div className="flex gap-2 p-4 bg-gray-100">
  <span>Card 1</span>
  <span>Card 2</span>
</div>`,
      goodCode: `<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-card border border-border rounded-2xl backdrop-blur-md">
  <GlowingCard title="Active Workspaces" description="Collaborate live with your team" />
  <GlowingCard title="API Keys" description="Secure token management" />
</div>`,
      explanation: "Applies clear purpose (Why) to structure modern responsive cards with design system tokens."
    }
  },

  hook_model_habit_loop: {
    id: "hook_model_habit_loop",
    category: "hook_model",
    title: "Nir Eyal's Hook Model (Trigger -> Action -> Variable Reward -> Investment)",
    summary: "Build habit-forming product loops by attaching internal emotional triggers to low-friction actions followed by variable rewards and user investment.",
    keyPrinciples: [
      "Internal Triggers: Address user boredom, uncertainty, or FOMO with instantaneous progress indicators.",
      "Action (Fogg B=MAT): Reduce friction (time, physical effort, cognitive cycles) so action is effortless.",
      "Variable Rewards: Provide unpredictable, delightful feedback (Tribe social validation, Hunt discovery, Self completion).",
      "Investment: Prompt user to store data, preferences, or customize their workspace to lock in future value."
    ],
    codeRefactoringExample: {
      badCode: `<div>
  <p>Task completed.</p>
</div>`,
      goodCode: `<div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between animate-in fade-in zoom-in duration-200">
  <div className="flex items-center gap-3">
    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    <div>
      <p className="font-semibold text-sm text-foreground">Project Deployed!</p>
      <p className="text-xs text-muted-foreground">+50 XP Earned • Shared with Team</p>
    </div>
  </div>
  <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium">Customize Domain</button>
</div>`,
      explanation: "Triggers immediate variable reward (XP feedback) and invites user investment (domain customization) right at task completion."
    }
  },

  morville_ux_honeycomb: {
    id: "morville_ux_honeycomb",
    category: "ixdf_foundations",
    title: "Peter Morville's 7 UX Honeycomb Factors (IxDF)",
    summary: "High-craft user experience requires balancing Useful, Usable, Findable, Credible, Desirable, Accessible, and Valuable dimensions.",
    keyPrinciples: [
      "Useful: Fulfill real user needs with utility-driven feature sets.",
      "Credible: Build trust via security badges, SOC2 indicators, transparent pricing, and robust error handling.",
      "Desirable: Evoke emotional resonance through sleek typography, subtle glassmorphism, and micro-animations.",
      "Accessible: Ensure WCAG AAA compliance, high contrast, and keyboard navigation."
    ],
    codeRefactoringExample: {
      badCode: `<div className="p-2 border">
  <input placeholder="Credit Card" />
  <button>Pay</button>
</div>`,
      goodCode: `<div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-xl">
  <div className="flex items-center justify-between">
    <h3 className="font-semibold text-lg">Secure Payment</h3>
    <span className="flex items-center gap-1 text-xs text-emerald-500 font-medium"><ShieldCheck className="w-4 h-4"/> 256-bit Encrypted</span>
  </div>
  {/* Card Form with automatic digit formatting and brand logo */}
</div>`,
      explanation: "Elevates credibility and desirability with security trust indicators and polished input layout."
    }
  },

  quesenberry_5cs: {
    id: "quesenberry_5cs",
    category: "ixdf_foundations",
    title: "Whitney Quesenberry's 5 Cs of Usability (IxDF)",
    summary: "Usable products satisfy 5 core criteria: Effectiveness, Efficiency, Engagement, Error Tolerance, and Ease of Learning.",
    keyPrinciples: [
      "Effectiveness: Help users complete goals with 100% accuracy via input masking and field constraints.",
      "Error Tolerance: Provide visible 'Undo' banners and non-destructive action confirmation.",
      "Engagement: Delight users with crisp typography and spatial alignment."
    ],
    codeRefactoringExample: {
      badCode: `<button onClick={deleteItem}>Delete Project</button>`,
      goodCode: `<div className="space-y-2">
  <button onClick={handleDelete} className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-medium">Delete Project</button>
  {showUndo && (
    <div className="fixed bottom-4 right-4 bg-popover text-popover-foreground border p-3 rounded-xl shadow-2xl flex items-center gap-3">
      <span className="text-xs">Project deleted.</span>
      <button onClick={handleUndo} className="text-xs font-bold text-primary underline">Undo</button>
    </div>
  )}
</div>`,
      explanation: "Provides safety ledge (Undo toast) to ensure high error tolerance and user confidence."
    }
  },

  interaction_5d: {
    id: "interaction_5d",
    category: "ixdf_foundations",
    title: "5 Dimensions of Interaction Design (Crampton Smith & Silver)",
    summary: "Interaction design synthesizes 1D Words, 2D Visuals, 3D Physical Space, 4D Time/Motion, and 5D Behavior.",
    keyPrinciples: [
      "1D Words: Use clear, jargon-free action labels.",
      "2D Visuals: Use icons and typography to complement copy.",
      "4D Time/Motion: Use physics spring timing (200-300ms) for UI feedback.",
      "5D Behavior: Ensure intuitive state changes and emotional feedback loops."
    ],
    codeRefactoringExample: {
      badCode: `<button>Submit</button>`,
      goodCode: `<button className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-primary-foreground bg-primary rounded-xl shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-ring">
  <span>Launch Workspace</span>
  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
</button>`,
      explanation: "Harmonizes 1D action copy, 2D visuals (Arrow icon), 4D spring micro-scaling, and 5D hover behavior."
    }
  },

  clinical_color_semantics: {
    id: "clinical_color_semantics",
    category: "ds_governance",
    title: "Enterprise Clinical & Healthcare Color Semantics Mandate",
    summary: "In clinical, healthcare, and high-consequence enterprise software, red MUST exclusively signal Critical Alerts, Emergency, or Danger.",
    keyPrinciples: [
      "Remove all red/pinkish-red as primary brand colors, active nav highlights, or standard buttons.",
      "Replace primary active/brand color with calm, trustworthy hues: Slate Blue (`hsl(217, 91%, 60%)`), Deep Navy (`hsl(222, 47%, 11%)`), or Muted Teal (`hsl(173, 80%, 40%)`).",
      "Reserve red/crimson strictly for 'CODE STAT' emergency buttons, high-risk patient alert badges, and critical warning text."
    ],
    codeRefactoringExample: {
      badCode: `<button className="bg-red-600 text-white font-bold px-4 py-2">Triage Dashboard Active</button>`,
      goodCode: `<div className="flex items-center gap-3">
  <button className="bg-slate-800 text-slate-100 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-700">Triage Dashboard Active</button>
  <button className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold animate-pulse">CODE STAT ALERT</button>
</div>`,
      explanation: "Switches active navigation indicator to calm Slate Navy and reserves red strictly for CODE STAT emergency alert."
    }
  },

  deboxing_visual_fatigue: {
    id: "deboxing_visual_fatigue",
    category: "laws_of_ux",
    title: "Visual Fatigue Reduction & UI De-boxing Mandate",
    summary: "Prevent shift fatigue in data-dense clinical and enterprise software by removing heavy drop shadows and hard internal borders.",
    keyPrinciples: [
      "Flatten visual hierarchy: remove heavy drop shadows (`shadow-2xl`, `shadow-xl`) and thick internal borders.",
      "Use subtle background color shifts (e.g. off-white `#F9FAFB` canvas vs pure white `#FFFFFF` card containers, or dark mode equivalent) with generous whitespace.",
      "De-emphasize top summary metric cards so user's attention goes directly to actionable data lists and active critical alerts first."
    ],
    codeRefactoringExample: {
      badCode: `<div className="border-2 border-gray-900 shadow-2xl p-6 bg-white rounded-none">
  <div className="border-b-2 border-black p-4">Summary Stats</div>
  <div className="border-b-2 border-black p-4">Patient Queue</div>
</div>`,
      goodCode: `<div className="bg-[#F9FAFB] p-6 space-y-6">
  <div className="bg-white p-4 rounded-xl border border-gray-100/80 text-gray-500 text-xs">Summary Stats</div>
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">Patient Queue</div>
</div>`,
      explanation: "De-boxes heavy borders into calm background shifts, de-emphasizing summary cards and reducing shift fatigue."
    }
  },

  functional_border_radius_hierarchy: {
    id: "functional_border_radius_hierarchy",
    category: "ds_governance",
    title: "Functional Border-Radius & Edge Styling Hierarchy",
    summary: "Apply border-radius systematically based on element function rather than arbitrary bubbly curves.",
    keyPrinciples: [
      "Structural Elements (Cards, Modals, Panels, Sidebars): Use Medium/Subtle curves (6px to 8px / `rounded-md` or `rounded-lg`). NEVER use extreme pill shapes (16px+) for structural containers.",
      "Interactive Controls (Inputs, Buttons, Dropdowns): Use Small to Medium curves (4px to 6px / `rounded` or `rounded-md`) to stack neatly in grids.",
      "High-Density Data (Tables, Data Grids): Use Sharp/Very Small curves (0px to 2px / `rounded-none` or `rounded-sm`) to maximize screen real estate and scannable lines.",
      "Status & Metadata (Badges, Tags, Emergency Actions): Use Fully Rounded Pill shapes (9999px / `rounded-full`) to create a distinct visual silhouette."
    ],
    codeRefactoringExample: {
      badCode: `<div className="rounded-3xl p-6 bg-card border">
  <span className="rounded-md bg-red-100 text-red-700">Critical</span>
  <input className="rounded-3xl border p-2" />
</div>`,
      goodCode: `<div className="rounded-lg p-6 bg-card border border-border">
  <span className="rounded-full px-3 py-1 bg-rose-500/10 text-rose-500 text-xs font-bold">Critical</span>
  <input className="rounded-md border border-input p-2 text-sm" />
</div>`,
      explanation: "Applies 8px (`rounded-lg`) to outer card container, 6px (`rounded-md`) to input control, and 9999px (`rounded-full`) to status tag."
    }
  },

  nested_corner_math: {
    id: "nested_corner_math",
    category: "ds_governance",
    title: "The Nested Corner Math Rule (Outer Radius - Padding = Inner Radius)",
    summary: "When placing a rounded element inside another rounded container with padding, mathematically calculate the inner radius to prevent visually broken overlaps.",
    keyPrinciples: [
      "Formula: Inner Radius (R_inner) = Outer Radius (R_outer) - Container Padding (P).",
      "Example: If Outer Card Radius = 12px (`rounded-xl`) and Padding = 8px (`p-2`), Inner Box Radius MUST = 4px (`rounded`).",
      "Violating this formula results in visually broken, concentric misalignment and amateurish UI."
    ],
    codeRefactoringExample: {
      badCode: `<div className="rounded-xl p-2 bg-card border">
  <div className="rounded-xl bg-accent p-4">Inner Content</div>
</div>`,
      goodCode: `<div className="rounded-xl (12px) p-2 (8px) bg-card border">
  <div className="rounded (4px) bg-accent p-4">Inner Content</div>
</div>`,
      explanation: "Calculates inner radius (12px - 8px = 4px) ensuring clean, concentric alignment."
    }
  },

  deterministic_compilation_engine: {
    id: "deterministic_compilation_engine",
    category: "ai_slop_prevention",
    title: "Algorithmic & Deterministic Design Compilation Engine Directive",
    summary: "Replaces probabilistic LLM guessing with strict mathematical calculations for grid alignment, font scales, contrast, geometry, and state shifts.",
    keyPrinciples: [
      "1. Spatial Grid Math: Every padding, margin, width, height, and gap MUST be a multiple of 4 or 8 (4, 8, 12, 16, 24, 32, 48, 64px). Arbitrary values (15px, 21px) are strictly forbidden.",
      "2. Modular Typography Scaling: Font sizes & line-heights follow strict math (Body = size * 1.5, Heading = size * 1.2).",
      "3. Algorithmic Contrast: Text colors must mathematically pass WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text).",
      "4. Calculated Radii: Inner radius = Math.max(0, Outer Radius - Padding).",
      "5. Predictable State Shifts: Hover background luminance shifts by 5-10%; Active/Focus MUST have a calculated 2px ring offset by 2px (`focus-visible:ring-2 focus-visible:ring-offset-2`)."
    ],
    codeRefactoringExample: {
      badCode: `<button className="m-[15px] p-[21px] rounded-[15px] bg-[#0070f3] text-white">Arbitrary Guess</button>`,
      goodCode: `<button className="m-4 (16px) p-3 (12px) rounded-md (6px) bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Calculated System Button</button>`,
      explanation: "Replaces arbitrary non-grid values with 4pt/8pt grid math, HSL tokens, 5-10% hover shift, and 2px focus ring offset by 2px."
    }
  },

  data_visualization_laws: {
    id: "data_visualization_laws",
    category: "ai_slop_prevention",
    title: "Data Visualization & Charting Laws (Anti-Slop Data Engine)",
    summary: "Never use rainbow palettes or distorted charts. Enforce zero Y-axis baseline, sequential monochromatic scales, and max 3-slice pie chart limits.",
    keyPrinciples: [
      "1. Color Scale: Use sequential monochromatic shades of primary token or explicit semantic status tokens (Success/Warning/Error). No arbitrary rainbow palettes.",
      "2. Chart Type Rules: Pie/Donut charts are FORBIDDEN if categories > 3. Default to horizontal bar charts for categorical comparisons, line/area charts for time-series data.",
      "3. Baseline Math: Y-axes MUST always start at 0 to prevent visual data distortion.",
      "4. Gridlines: Faint and dashed (`opacity: 0.1` or `stroke-dasharray`), applied ONLY to the primary reading axis."
    ],
    codeRefactoringExample: {
      badCode: `<PieChart data={categoriesWith10Items} colors={['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange']} />`,
      goodCode: `<BarChart data={categoriesWith10Items} layout="vertical">
  <YAxis domain={[0, 'auto']} />
  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
</BarChart>`,
      explanation: "Replaces rainbow 10-slice pie chart with vertical horizontal bar chart starting Y-axis at 0 using primary HSL token."
    }
  },

  microcopy_tone_tokenization: {
    id: "microcopy_tone_tokenization",
    category: "ds_governance",
    title: "Enterprise Microcopy & Utilitarian Tone Tokenization",
    summary: "Microcopy must be terse, objective, noun-first, and strictly utilitarian. Marketing fluff and exclamations are strictly forbidden.",
    keyPrinciples: [
      "Forbidden Words: 'Supercharge', 'Unleash', 'Empower', 'Awesome!', 'Oops!', 'Great job!'.",
      "Success State Format: `[Entity] [Action Past-Tense]` (e.g. 'Settings updated.', 'User deleted.', 'API key generated.').",
      "Action Label Format: `[Verb] [Noun]` (e.g. 'Export Data', 'Create Project', 'Rotate Credentials')."
    ],
    codeRefactoringExample: {
      badCode: `<h3>Supercharge Your Workflow!</h3><p>Awesome! Your project was created successfully!</p>`,
      goodCode: `<h3>Workspace Overview</h3><p className="text-xs text-muted-foreground">Project created.</p>`,
      explanation: "Replaces marketing fluff and exclamations with terse, objective, noun-first utilitarian microcopy."
    }
  },

  z_index_stacking_system: {
    id: "z_index_stacking_system",
    category: "ds_governance",
    title: "Strict Z-Index & Stacking Context System",
    summary: "Eliminate arbitrary/infinite z-indices (`z-9999`, `z-99`). Enforce strict token scale (z-0 to z-50) and CSS stacking isolation.",
    keyPrinciples: [
      "z-0: Base Content, Charts, Data Tables, SVGs.",
      "z-10 to z-20: Sticky Headers, Navbars, Sidebars.",
      "z-30: Dropdown Menus, Popovers, Tooltips.",
      "z-40: Modals, Dialogs, Sheet Overlays.",
      "z-50: Toasts, Emergency Alerts, Critical System Notifications.",
      "Isolation: Third-party widgets, SVGs, and Canvas elements MUST use `isolation: isolate` to prevent bleeding through overlays."
    ],
    codeRefactoringExample: {
      badCode: `<div className="z-[99999] absolute">Dropdown</div>`,
      goodCode: `<div className="z-30 absolute bg-popover border border-border shadow-md rounded-lg">Dropdown</div>`,
      explanation: "Replaces arbitrary `z-[99999]` with standardized `z-30` dropdown token."
    }
  },

  hybrid_designer_compiler_architecture: {
    id: "hybrid_designer_compiler_architecture",
    category: "design_principles",
    title: "Senior Product Designer & Deterministic UI Compiler Hybrid Architecture",
    summary: "Synthesizes human-centered product reasoning with deterministic mathematical UI code execution.",
    keyPrinciples: [
      "PHASE 1 (UX Reasoning): Evaluate request based on human behavior. Never invent fake data or marketing claims. Manage cognitive load with progressive disclosure. Mandate Zero & Edge States (skeletons, empty states with muted icons, error states). Accessibility first.",
      "PHASE 2 (Deterministic Execution): 4pt/8pt spatial grid math (multiples of 4/8, min 44px touch target), WCAG 2.1 AA HSL contrast, Inner Radius formula R_inner = R_outer - Padding, Z-Index token scale z-0..z-50, Monochromatic data visualization with Y-axis baseline 0.",
      "PHASE 3 (Enterprise Microcopy): Terse, objective, noun-first microcopy. Use `[Action] [Entity]` or `[Verb] [Noun]`. Strictly forbid marketing hype ('Supercharge', 'Unleash') and exclamations ('Awesome!', 'Oops!')."
    ],
    codeRefactoringExample: {
      badCode: `<div className="p-[15px] z-[9999] bg-[#0070f3]">
  <h2>Supercharge Your Analytics!</h2>
  <button className="bg-red-500">Click Here</button>
</div>`,
      goodCode: `<div className="p-4 (16px) z-10 bg-card border border-border rounded-lg shadow-sm">
  <h3 className="font-semibold text-foreground">Workspace Overview</h3>
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Export Data</button>
</div>`,
      explanation: "Applies 3-phase hybrid compiler: 16px grid math, z-10 header token, HSL contrast, 2px focus ring offset, and terse `Export Data` microcopy."
    }
  },

  action_friction_minimization: {
    id: "action_friction_minimization",
    category: "hook_model",
    title: "Action Friction Minimization & Step-Count Constraint",
    summary: "Minimizing cognitive & physical friction to core reward increases action completion rate exponentially.",
    keyPrinciples: [
      "Rule: Keep primary UI task completion within 3 or fewer taps/clicks from launch.",
      "Align Fogg Ability factor (Time & Effort) with Fitts's Law and Hick's Law choice reduction.",
      "Prohibited: High-consequence destructive actions (account deletion, clinical record purge), which MANDATE confirmation friction."
    ],
    codeRefactoringExample: {
      badCode: `<form onSubmit={submit}>
  <input placeholder="Step 1" />
  <button onClick={nextStep}>Next</button>
  {/* 7-step wizard modal for simple action */}
</form>`,
      goodCode: `<div className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl">
  <input className="flex-1 px-3 py-2 text-sm bg-background border rounded-lg" placeholder="Search or command..." />
  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">Execute</button>
</div>`,
      explanation: "Replaces 7-step wizard with 1-click inline action for non-destructive workflows."
    }
  },

  post_reward_non_modal_investment: {
    id: "post_reward_non_modal_investment",
    category: "hook_model",
    title: "Post-Reward Non-Modal Investment Rule",
    summary: "Prompt low-friction investment (Save, Bookmark, Tag) immediately post-reward in a non-modal, non-interruptive layout.",
    keyPrinciples: [
      "Capitalize on peak satisfaction dopamine window right after reward delivery.",
      "Must be non-modal and inline (e.g. toast action or card footer button), never interrupting modal popups.",
      "Must store authentic user value (data, content, preferences), NOT lock-in via dark patterns."
    ],
    codeRefactoringExample: {
      badCode: `{/* Modal overlay interrupting user immediately after task completion */}
<Modal isOpen={true}>
  <h3>Rate Us 5 Stars!</h3>
  <button>Rate Now</button>
</Modal>`,
      goodCode: `<div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
  <div className="flex items-center gap-2 text-sm text-foreground font-medium">
    <CheckCircle className="w-4 h-4 text-emerald-500" />
    <span>Export Complete</span>
  </div>
  <button className="text-xs bg-accent hover:bg-accent/80 px-3 py-1.5 rounded-md font-medium text-foreground">Save to Workspace</button>
</div>`,
      explanation: "Offers inline non-modal 'Save to Workspace' investment prompt right after task completion."
    }
  },

  default_font_system_priority: {
    id: "default_font_system_priority",
    category: "ds_governance",
    title: "Default Approved Font System & Context Selection Priority",
    summary: "Strictly enforce font selection from the approved tier [SF Pro, Inter, Geist, Helvetica] with deterministic context priority and Inter as universal fallback.",
    keyPrinciples: [
      "Approved Font Tier: SF Pro, Inter, Geist, Helvetica ONLY.",
      "Apple Platform Context → SF Pro ('SF Pro Text', 'SF Pro Display', -apple-system).",
      "Existing Design System → Preserve defined font.",
      "Modern Web / SaaS / Product Interface → Inter (Universal Fallback).",
      "Developer / Tool / Technical Product → Geist ('Geist', 'Geist Mono').",
      "Apple-Style or Helvetica Visual System → Helvetica ('Helvetica Neue', Helvetica).",
      "Universal Fallback Default → Inter."
    ],
    codeRefactoringExample: {
      badCode: `/* Generic / Unapproved Font Choices */
body {
  font-family: 'Comic Sans MS', 'Arial', 'Times New Roman', sans-serif;
}`,
      goodCode: `/* Deterministic Approved Font System */
:root {
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-geist: 'Geist', 'Geist Mono', system-ui, sans-serif;
  --font-sf: 'SF Pro Text', 'SF Pro Display', -apple-system, sans-serif;
  --font-helvetica: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}`,
      explanation: "Replaces unapproved/random font choices with deterministic approved font tier based on context priority."
    }
  },

  tailwind_industry_standards: {
    id: "tailwind_industry_standards",
    category: "ds_governance",
    title: "Tailwind CSS v4 & v3 Industry Architecture & Spacing Math Standards",
    summary: "Enforce strict 4px (0.25rem) base scale alignment, semantic HSL opacity modulations, and container queries.",
    keyPrinciples: [
      "Strict 4px base scale unit: 1 unit = 0.25rem = 4px (p-1 = 4px, p-2 = 8px, p-4 = 16px, p-6 = 24px, p-8 = 32px).",
      "FORBIDDEN: Un-aligned arbitrary pixel spacing (p-[17px], m-[13px], gap-[7px]).",
      "Color Opacity Modulations: Use semantic opacity slashes e.g. bg-primary/10, border-primary/20, text-foreground/80 instead of hardcoded hexes.",
      "Container Queries: Use @container with @md: and @lg: grid breakpoints for component-level responsiveness.",
      "Stacking Isolation: Use isolate to contain stacking contexts."
    ],
    codeRefactoringExample: {
      badCode: `<div className="p-[17px] m-[11px] bg-[#121212] z-[9999]">
  <div className="gap-[7px] flex">Content</div>
</div>`,
      goodCode: `<div className="p-4 m-3 bg-card/90 border border-border/50 rounded-2xl isolate @container">
  <div className="gap-2 flex @md:grid @md:grid-cols-2">Content</div>
</div>`,
      explanation: "Replaces arbitrary pixel values and hardcoded hexes with 4px grid aligned Tailwind classes and container queries."
    }
  }
};
