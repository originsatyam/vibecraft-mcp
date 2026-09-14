export interface IABlueprint {
  id: string;
  title: string;
  type: "dashboard" | "settings" | "onboarding" | "pricing" | "analytics" | "data_table" | "auth" | "destructive" | "ai_generation" | "bulk_actions";
  nngPrinciples: string[];
  structureDescription: string;
  layoutHierarchy: {
    zone: string;
    components: string[];
    uxGuidance: string;
  }[];
  codeScaffold: string;
}

export const IA_BLUEPRINTS: Record<string, IABlueprint> = {
  "saas-dashboard": {
    id: "saas-dashboard",
    title: "Enterprise SaaS Dashboard Layout (NN/g Hierarchical IA)",
    type: "dashboard",
    nngPrinciples: [
      "Global Navigation: Persistent collapsible sidebar on the left for top-level workspace switching.",
      "Utility & Context: Top bar with breadcrumbs, global search command palette (Cmd+K), and user profile popover.",
      "Visual Hierarchy: Primary KPI summary stat cards at the top, followed by main interactive data table.",
      "Contextual Disclosure: Detail panel opens in a slide-over sheet (Radix/Vaul) instead of navigating away."
    ],
    structureDescription: "Persistent left sidebar layout with top bar utility header, stat grid, filterable data table, and slide-over inspector sheet.",
    layoutHierarchy: [
      {
        zone: "Left Navigation",
        components: ["FloatingDock", "SidebarNav", "WorkspaceSwitcher"],
        uxGuidance: "Keep primary items (Home, Analytics, Projects, Settings) under 7 items (Miller's Law)."
      },
      {
        zone: "Top Utility Header",
        components: ["BreadcrumbTrail", "CommandPaletteButton", "NotificationBell", "UserAvatarMenu"],
        uxGuidance: "Provide clear orientation showing current location in hierarchy."
      },
      {
        zone: "Main Content Header",
        components: ["PageTitleHeader", "DateRangePicker", "PrimaryActionButton"],
        uxGuidance: "Hick's Law: Keep only 1 primary action button (e.g. 'Create Project')."
      },
      {
        zone: "KPI Metric Grid",
        components: ["GlowingCard", "BentoCard"],
        uxGuidance: "4-column responsive grid showing primary performance metrics with percentage trends."
      },
      {
        zone: "Primary Data Table",
        components: ["DataTable", "TablePagination", "FilterToolbar"],
        uxGuidance: "Faceted search and column sorting with skeleton loading states under 400ms."
      }
    ],
    codeScaffold: `'use client';
import React from 'react';
import { LayoutDashboard, Folder, Settings, Bell, Search } from 'lucide-react';

export default function SaaSLayoutScaffold({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <aside className="w-64 border-r border-border bg-card/50 p-4 flex flex-col justify-between hidden md:flex">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 font-bold text-lg text-primary">
            <LayoutDashboard className="w-6 h-6" />
            <span>SaaSPlatform</span>
          </div>
          <nav className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 text-muted-foreground text-sm font-medium">
              <Folder className="w-4 h-4" /> Projects
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 text-muted-foreground text-sm font-medium">
              <Settings className="w-4 h-4" /> Settings
            </a>
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/30 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Workspace</span> / <span className="text-foreground font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
              <Search className="w-3.5 h-3.5" /> Search (⌘K)
            </button>
            <button className="p-2 rounded-full hover:bg-accent text-muted-foreground" aria-label="Notifications">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}`
  },

  "saas-settings": {
    id: "saas-settings",
    title: "SaaS Settings & Admin Control Panel (NN/g Task Navigation)",
    type: "settings",
    nngPrinciples: [
      "Categorical Grouping: Group settings logically into General, Billing, Team, and Security/API.",
      "Local Sub-navigation: Vertical tabs on desktop, segmented control on mobile.",
      "Clear Feedback: Floating un-saved changes toolbar or immediate inline success feedback.",
      "Task-oriented Labeling: Use descriptive verb labels ('Manage Plan', 'Rotate Keys') instead of obscure tech jargon."
    ],
    structureDescription: "Vertical tabbed layout with left category menu and scrollable right form fieldsets with sticky save footer.",
    layoutHierarchy: [
      {
        zone: "Category Navigation",
        components: ["VerticalTabs", "SettingsNav"],
        uxGuidance: "Organize into General, Profile, Billing & Usage, Team Members, API Credentials."
      },
      {
        zone: "Form Fieldsets",
        components: ["FormField", "InputGroup", "SwitchControl"],
        uxGuidance: "Provide inline field labels, description subtext, and instant visual validation."
      },
      {
        zone: "Action Footer",
        components: ["StickyActionBar", "SaveButton", "CancelButton"],
        uxGuidance: "Show floating save bar when form is dirty."
      }
    ],
    codeScaffold: `'use client';
import React from 'react';

export default function SettingsLayoutScaffold() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your workspace preferences, team access, and billing.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-48 space-y-1">
          <button className="w-full text-left px-3 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium">General</button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent/50 text-sm font-medium">Billing</button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent/50 text-sm font-medium">Team Members</button>
          <button className="w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent/50 text-sm font-medium">API Keys</button>
        </aside>
        <section className="flex-1 space-y-6 bg-card border border-border p-6 rounded-2xl">
          {/* Form Content */}
        </section>
      </div>
    </div>
  );
}`
  },

  "ai-generation-pattern": {
    id: "ai-generation-pattern",
    title: "AI Co-pilot & Prompt Generation Design Pattern",
    type: "ai_generation",
    nngPrinciples: [
      "Immediate Feedback: Show streaming animation or pulsing skeleton loader while AI generates response.",
      "Cancel/Stop Generation: Always provide a prominent 'Stop' button during long generations.",
      "Action Bar: Include 'Copy', 'Fork', 'Regenerate', and rating feedback controls on completed outputs."
    ],
    structureDescription: "Chat or prompt bar input container with streaming skeleton area and action toolbar.",
    layoutHierarchy: [
      {
        zone: "Prompt Bar Input",
        components: ["PromptTextarea", "ModelSelector", "SubmitButton"],
        uxGuidance: "Support Cmd+Enter shortcut and expand textarea dynamically."
      },
      {
        zone: "Streaming Content Output",
        components: ["StreamingMarkdown", "SkeletonLoader", "StopButton"],
        uxGuidance: "Scroll viewport automatically while streaming unless user scrolls up."
      }
    ],
    codeScaffold: `'use client';
import React, { useState } from 'react';
import { Sparkles, StopCircle, Copy, RotateCcw } from 'lucide-react';

export function AIGenerationContainer({ onGenerate, isGenerating, result }: any) {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {result && (
        <div className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border pb-3">
            <span className="flex items-center gap-1.5 font-medium text-primary"><Sparkles className="w-4 h-4" /> AI Generated Response</span>
            <div className="flex items-center gap-2">
              <button aria-label="Copy" className="p-1.5 rounded-lg hover:bg-accent"><Copy className="w-3.5 h-3.5" /></button>
              <button aria-label="Regenerate" className="p-1.5 rounded-lg hover:bg-accent"><RotateCcw className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <div className="text-sm leading-relaxed text-foreground">{result}</div>
        </div>
      )}

      <div className="relative bg-card border border-border rounded-2xl p-3 shadow-lg flex items-center gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI co-pilot to generate or refactor..."
          className="flex-1 bg-transparent text-sm text-foreground focus:outline-none resize-none h-10 py-2"
        />
        {isGenerating ? (
          <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <StopCircle className="w-4 h-4" /> Stop
          </button>
        ) : (
          <button onClick={() => onGenerate(prompt)} className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Generate
          </button>
        )}
      </div>
    </div>
  );
}`
  },

  "destructive-confirm-pattern": {
    id: "destructive-confirm-pattern",
    title: "Destructive Action Safety Pattern",
    type: "destructive",
    nngPrinciples: [
      "Prevent Accidental Deletion: Require explicit confirmation modal or type-to-confirm input.",
      "Clear Safety Ledge: Offer an immediate 'Undo' toast banner right after action execution.",
      "Distinct Visual Warning: Use destructive semantic colors (`bg-destructive text-destructive-foreground`)."
    ],
    structureDescription: "Modal confirmation overlay requiring confirmation text match and destructive action button.",
    layoutHierarchy: [
      {
        zone: "Modal Confirmation Overlay",
        components: ["AlertDialog", "TypeToConfirmInput", "DeleteButton"],
        uxGuidance: "Disable delete button until input text matches item name exactly."
      }
    ],
    codeScaffold: `'use client';
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export function DestructiveConfirmModal({ itemName, onDelete, onCancel }: any) {
  const [confirmText, setConfirmText] = useState('');
  const isMatch = confirmText === itemName;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
        <div className="flex items-center gap-3 text-destructive">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="font-bold text-lg text-foreground">Delete Workspace?</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. Please type <strong className="text-foreground">{itemName}</strong> to confirm deletion.
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type workspace name"
          className="w-full bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-destructive"
        />
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent text-muted-foreground">Cancel</button>
          <button
            disabled={!isMatch}
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground disabled:opacity-50 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Permanently Delete
          </button>
        </div>
      </div>
    </div>
  );
}`
  },

  "clinical-triage-dashboard": {
    id: "clinical-triage-dashboard",
    title: "Enterprise Clinical Triage & Command Center Layout",
    type: "dashboard",
    nngPrinciples: [
      "Color Semantics: Primary active brand state is Slate Blue / Deep Navy. Red is strictly reserved for CODE STAT and emergency alerts.",
      "De-boxed Hierarchy: Avoid hard borders and drop shadows. Use subtle background color shifts (`#F9FAFB` canvas vs `#FFFFFF` content containers) to prevent shift fatigue.",
      "Data Hierarchy: De-emphasize top summary metric cards so user's attention focuses on the actionable patient list and active critical alerts first.",
      "Dark Mode WCAG Contrast: Alert badges pass WCAG AA contrast using desaturated muted reds on dark canvas."
    ],
    structureDescription: "Clinical Triage Command Center with Slate Navy active state, de-emphasized summary metrics, and CODE STAT emergency alert controls.",
    layoutHierarchy: [
      {
        zone: "Header Navigation",
        components: ["ClinicalNav", "SlateActiveBadge", "CodeStatEmergencyButton"],
        uxGuidance: "Active navigation uses Slate Blue. Red is strictly reserved for CODE STAT."
      },
      {
        zone: "Summary Metrics (De-emphasized)",
        components: ["SubtleMetricCard", "MutedTextSummary"],
        uxGuidance: "De-emphasize top summary cards (ICU Bed Utilization, etc.) so they do not compete with the Patient Queue."
      },
      {
        zone: "Patient Triage Queue (Focal Point)",
        components: ["PatientPriorityList", "TriageBadge", "CriticalAlertBanner"],
        uxGuidance: "Immediate visual focus on actionable patient list and active critical warnings."
      }
    ],
    codeScaffold: `'use client';
import React from 'react';
import { Activity, ShieldAlert } from 'lucide-react';

export default function ClinicalTriageScaffold({ patients }: any) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans p-6 space-y-6">
      <header className="flex items-center justify-between bg-slate-900 text-white px-6 py-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-sky-400" />
          <h1 className="font-bold text-lg tracking-tight">Clinical Triage Command Center</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 font-medium">Slate Navy Primary Active</span>
          <button className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-lg text-xs tracking-wider uppercase animate-pulse flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> CODE STAT EMERGENCY
          </button>
        </div>
      </header>

      {/* De-emphasized Top Metric Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 opacity-80 hover:opacity-100 transition-opacity">
        <div className="bg-white p-4 rounded-xl border border-slate-100 text-xs">
          <div className="text-slate-500 mb-1">ICU Bed Capacity</div>
          <div className="text-lg font-semibold text-slate-800">84% Capacity</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 text-xs">
          <div className="text-slate-500 mb-1">Avg Triage Time</div>
          <div className="text-lg font-semibold text-slate-800">12.4 Mins</div>
        </div>
      </div>

      {/* Main Focal Point: Actionable Patient Queue */}
      <main className="bg-white rounded-xl border border-slate-200/60 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-base text-slate-900">Active Patient Triage Queue</h2>
          <span className="text-xs font-semibold text-slate-500">Sorted by Severity</span>
        </div>
        {/* Patient Table with WCAG AA Desaturated Alerts */}
      </main>
    </div>
  );
}`
  }
};
