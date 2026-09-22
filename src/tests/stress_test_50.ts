import { runASTUxAudit } from "../ast/engine.js";
import { runASTUxFixer } from "../ast/fixer/engine.js";
import { performance } from "perf_hooks";

export interface StressTestCase {
  id: string;
  group: "A" | "B" | "C" | "D" | "E";
  name: string;
  code: string;
  expectedDeterministicFixes: number;
  shouldModifyCode: boolean;
}

export const TEST_CORPUS: StressTestCase[] = [
  // GROUP A: Simple Deterministic Violations (10 cases)
  { id: "case_01", group: "A", name: "Arbitrary Spacing p-[13px]", code: `<div className="p-[13px] bg-card text-card-foreground">Card 1</div>`, expectedDeterministicFixes: 1, shouldModifyCode: true },
  { id: "case_02", group: "A", name: "Arbitrary Radius rounded-[17px]", code: `<div className="p-4 rounded-[17px] bg-card">Card 2</div>`, expectedDeterministicFixes: 1, shouldModifyCode: true },
  { id: "case_03", group: "A", name: "Hardcoded Hex Background bg-[#121212]", code: `<div className="p-4 bg-[#121212] text-card-foreground">Card 3</div>`, expectedDeterministicFixes: 1, shouldModifyCode: true },
  { id: "case_04", group: "A", name: "Arbitrary Z-Index z-[9999]", code: `<div className="p-4 z-[9999] bg-card">Card 4</div>`, expectedDeterministicFixes: 1, shouldModifyCode: true },
  { id: "case_05", group: "A", name: "Focus Ring Missing Offset", code: `<button className="p-4 focus:ring bg-primary">Card 5</button>`, expectedDeterministicFixes: 1, shouldModifyCode: true },
  { id: "case_06", group: "A", name: "Arbitrary Margin m-[21px]", code: `<div className="m-[21px] p-4 bg-card">Card 6</div>`, expectedDeterministicFixes: 1, shouldModifyCode: true },
  { id: "case_07", group: "A", name: "Hardcoded Hex Text text-[#ffffff]", code: `<div className="p-4 bg-card text-[#ffffff]">Card 7</div>`, expectedDeterministicFixes: 1, shouldModifyCode: true },
  { id: "case_08", group: "A", name: "Inline Style Magic Pixel padding 15px", code: `<div style={{ padding: "15px" }} className="bg-card">Card 8</div>`, expectedDeterministicFixes: 1, shouldModifyCode: true },
  { id: "case_09", group: "A", name: "Arbitrary Gap gap-[11px]", code: `<div className="flex gap-[11px] p-4 bg-card"><span>Card 9</span></div>`, expectedDeterministicFixes: 1, shouldModifyCode: true },
  { id: "case_10", group: "A", name: "Nested Corner Radius Mismatch", code: `<div className="rounded-2xl p-3 bg-card"><div className="rounded-2xl bg-background">Card 10</div></div>`, expectedDeterministicFixes: 1, shouldModifyCode: true },

  // GROUP B: Multiple Deterministic Violations (10 cases)
  { id: "case_11", group: "B", name: "Spacing + Radius + Hex Color", code: `<div className="p-[13px] rounded-[17px] bg-[#121212]">Card 11</div>`, expectedDeterministicFixes: 3, shouldModifyCode: true },
  { id: "case_12", group: "B", name: "Z-Index + Hex Text + Focus Ring + Gap", code: `<div className="z-[9999] text-[#ffffff] flex gap-[15px] p-4"><button className="focus:ring">Btn</button></div>`, expectedDeterministicFixes: 4, shouldModifyCode: true },
  { id: "case_13", group: "B", name: "Nested Radius + Spacing + Border Hex", code: `<div className="rounded-2xl p-[21px] border-[#333333]"><div className="rounded-2xl bg-card">Inner</div></div>`, expectedDeterministicFixes: 3, shouldModifyCode: true },
  { id: "case_14", group: "B", name: "Card 4 Hex Classes + Radius", code: `<div className="bg-[#121212] text-[#ffffff] border-[#333333] rounded-[19px] p-[13px]">Card 14</div>`, expectedDeterministicFixes: 4, shouldModifyCode: true },
  { id: "case_15", group: "B", name: "Modal Header z-999 + Margin + Spacing", code: `<div className="z-999 m-[11px] p-[13px] bg-[#121212]">Modal Header</div>`, expectedDeterministicFixes: 3, shouldModifyCode: true },
  { id: "case_16", group: "B", name: "Form Wrapper Spacing + Gap + Radius", code: `<form className="p-[15px] gap-[9px] rounded-[23px] bg-[#121212]">Input</form>`, expectedDeterministicFixes: 4, shouldModifyCode: true },
  { id: "case_17", group: "B", name: "Navbar bg-Hex + z-99999 + Padding", code: `<nav className="bg-[#05050a] z-[99999] p-[13px]">Navbar</nav>`, expectedDeterministicFixes: 3, shouldModifyCode: true },
  { id: "case_18", group: "B", name: "Table Header bg-Hex + Padding + Text Hex", code: `<header className="bg-[#111111] p-[7px] text-[#ffffff]">Table Header</header>`, expectedDeterministicFixes: 3, shouldModifyCode: true },
  { id: "case_19", group: "B", name: "Sidebar Panel Radius + Spacing + Hex", code: `<aside className="rounded-3xl p-[13px] bg-[#121212]">Sidebar</aside>`, expectedDeterministicFixes: 3, shouldModifyCode: true },
  { id: "case_20", group: "B", name: "Bento Grid Gap + Padding + Radius", code: `<div className="grid gap-[17px] p-[23px] rounded-[19px] bg-card">Grid</div>`, expectedDeterministicFixes: 3, shouldModifyCode: true },

  // GROUP C: Realistic Mixed UI Code (10 cases)
  {
    id: "case_21", group: "C", name: "SaaS Dashboard Header",
    code: `
      export function DashboardHeader() {
        return (
          <header className="flex justify-between items-center p-[15px] bg-[#121212] text-[#ffffff] border-b border-[#333333] z-[9999]">
            <h1 className="text-xl font-bold">Analytics</h1>
            <button className="bg-primary px-4 py-2 rounded-xl text-xs font-medium focus:ring">Create Report</button>
          </header>
        );
      }
    `, expectedDeterministicFixes: 5, shouldModifyCode: true
  },
  {
    id: "case_22", group: "C", name: "User Settings Form",
    code: `
      export function UserSettingsForm() {
        return (
          <div className="p-[21px] bg-card rounded-[19px] space-y-4">
            <h2 className="text-lg font-medium">Profile Settings</h2>
            <input type="text" className="w-full p-[13px] bg-background border border-border rounded-xl focus:ring" defaultValue="Satyam" />
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl focus:ring">Save Changes</button>
          </div>
        );
      }
    `, expectedDeterministicFixes: 4, shouldModifyCode: true
  },
  {
    id: "case_23", group: "C", name: "Confirmation Modal Dialog",
    code: `
      export function ConfirmDialog({ isOpen }) {
        if (!isOpen) return null;
        return (
          <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-[15px]">
            <div className="bg-[#121212] rounded-[19px] p-[21px] max-w-md w-full border-[#333333]">
              <h3 className="text-lg font-medium text-[#ffffff]">Delete Project</h3>
              <p className="text-sm text-muted-foreground mt-2">Are you sure?</p>
              <div className="flex justify-end gap-3 mt-4">
                <button className="px-4 py-2 text-xs font-medium rounded-xl hover:bg-accent">Cancel</button>
                <button className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-medium focus:ring">Delete</button>
              </div>
            </div>
          </div>
        );
      }
    `, expectedDeterministicFixes: 5, shouldModifyCode: true
  },
  {
    id: "case_24", group: "C", name: "Data Table Row Controls",
    code: `
      export function DataTable() {
        return (
          <div className="p-[13px] bg-card rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-[#121212] text-[#ffffff]"><th className="p-[11px]">Name</th></tr></thead>
              <tbody><tr><td className="p-3">Item 1</td></tr></tbody>
            </table>
          </div>
        );
      }
    `, expectedDeterministicFixes: 4, shouldModifyCode: true
  },
  {
    id: "case_25", group: "C", name: "Bento Feature Grid Card",
    code: `
      export function BentoCard() {
        return (
          <div className="p-[23px] bg-[#121212] rounded-[19px] border border-[#333333]">
            <h4 className="text-base font-medium text-[#ffffff]">RAG Vector Search</h4>
            <p className="text-xs text-muted-foreground mt-1">Instant local LRU retrieval</p>
          </div>
        );
      }
    `, expectedDeterministicFixes: 4, shouldModifyCode: true
  },
  {
    id: "case_26", group: "C", name: "Async Loading Query Card",
    code: `
      import React, { useState } from 'react';
      import { Skeleton } from './ui/skeleton';
      export function AsyncQueryCard() {
        const [isLoading, setIsLoading] = useState(true);
        return (
          <div className="p-[15px] bg-card rounded-2xl border border-border">
            {isLoading ? <Skeleton className="h-12 w-full" /> : <p>Data Loaded</p>}
          </div>
        );
      }
    `, expectedDeterministicFixes: 1, shouldModifyCode: true
  },
  {
    id: "case_27", group: "C", name: "Async Mutation Form",
    code: `
      import React from 'react';
      import { Skeleton } from './ui/skeleton';
      export function MutationForm() {
        const { isPending: submitting } = useMutation();
        return (
          <div className="p-6 bg-card rounded-2xl border border-border">
            {submitting ? <Skeleton className="h-10" /> : <button className="bg-primary p-2 focus:ring">Submit</button>}
          </div>
        );
      }
    `, expectedDeterministicFixes: 1, shouldModifyCode: true
  },
  {
    id: "case_28", group: "C", name: "Empty State Placeholder",
    code: `
      export function EmptyState() {
        return (
          <div className="p-[31px] bg-[#121212] rounded-[21px] text-center border border-[#333333]">
            <h3 className="text-lg font-medium text-[#ffffff]">No Projects Found</h3>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl mt-4 focus:ring">Create Project</button>
          </div>
        );
      }
    `, expectedDeterministicFixes: 5, shouldModifyCode: true
  },
  {
    id: "case_29", group: "C", name: "Error Boundary Callout Card",
    code: `
      export function ErrorCallout({ error }) {
        return (
          <div className="p-[15px] bg-rose-500/10 border border-rose-500/20 rounded-[17px]">
            <p className="text-xs text-rose-400 font-mono">Error: {error}</p>
            <button className="mt-3 text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg focus:ring">Retry</button>
          </div>
        );
      }
    `, expectedDeterministicFixes: 3, shouldModifyCode: true
  },
  {
    id: "case_30", group: "C", name: "Mobile Navigation Sheet",
    code: `
      export function MobileNav() {
        return (
          <div className="p-[13px] bg-[#05050a] text-[#ffffff] z-[99999] space-y-2">
            <a href="#" className="block p-2 rounded-lg hover:bg-accent">Home</a>
            <a href="#" className="block p-2 rounded-lg hover:bg-accent">Docs</a>
          </div>
        );
      }
    `, expectedDeterministicFixes: 3, shouldModifyCode: true
  },

  // GROUP D: Ambiguous / Partially Fixable Code (10 cases)
  { id: "case_31", group: "D", name: "Dynamic Class Concatenation", code: `<div className={cn("p-4", active && "p-[13px]")}>Dynamic</div>`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_32", group: "D", name: "Custom Hook Status Enum", code: `const { status } = useProjectMutation(); return <div>Status: {status}</div>;`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_33", group: "D", name: "Template String Class Expression", code: `<div className={\`p-\${spacing}px bg-card\`}>Template</div>`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_34", group: "D", name: "Props-Drilled Spacing Parameter", code: `function Card({ padding = "13px" }) { return <div style={{ padding }}>Prop Card</div>; }`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_35", group: "D", name: "Conditional Class Mapping Lookup", code: `const cls = paddingMap[size]; return <div className={cls}>Lookup</div>;`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_36", group: "D", name: "Complex CSS-in-JS Style Object", code: `<div style={{ padding: spacingVar, margin: getMargin() }}>Style Object</div>`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_37", group: "D", name: "Multi-Branch Ternary Class Assignment", code: `<div className={isBig ? "p-8" : isSmall ? "p-[13px]" : "p-4"}>Ternary</div>`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_38", group: "D", name: "External Component Prop Wrapper", code: `<CustomCard padding={13} margin={17} />`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_39", group: "D", name: "Aliased Custom Status Hook", code: `const { status: s } = useStatus(); return <div>{s}</div>;`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_40", group: "D", name: "Dynamic Z-Index Math Expression", code: `<div style={{ zIndex: maxZ + 1 }}>Z-Math</div>`, expectedDeterministicFixes: 0, shouldModifyCode: false },

  // GROUP E: Cases That SHOULD NOT Be Auto-Fixed (10 cases)
  { id: "case_41", group: "E", name: "Business Logic retryCount = 3", code: `const retryCount = 3; return <div>Retries: {retryCount}</div>;`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_42", group: "E", name: "Maximum Limit maxRetries = 5", code: `const maxRetries = 5; return <div>Max: {maxRetries}</div>;`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_43", group: "E", name: "Timeout Duration timeoutMs = 5000", code: `const timeoutMs = 5000; setTimeout(doWork, timeoutMs);`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_44", group: "E", name: "Competing Primary CTAs (3 bg-primary)", code: `<div><button className="bg-primary">A</button><button className="bg-primary">B</button><button className="bg-primary">C</button></div>`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_45", group: "E", name: "Hick's Law Button Overload (6 buttons)", code: `<div><button>1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>6</button></div>`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_46", group: "E", name: "Marketing Fluff Microcopy", code: `<h1>Supercharge your awesome workflow!</h1>`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_47", group: "E", name: "Clinical Red Color Semantics", code: `function PatientApp() { return <div className="clinical patient bg-red-500">Triage Nav</div>; }`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_48", group: "E", name: "Pie Chart 6 Categories Overload", code: `<PieChart categories={6} />`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_49", group: "E", name: "Unapproved Font Tier Comic Sans", code: `<div style={{ fontFamily: "Comic Sans MS" }}>Unapproved Font</div>`, expectedDeterministicFixes: 0, shouldModifyCode: false },
  { id: "case_50", group: "E", name: "Subjective Bento Grid Layout Composition", code: `<div className="grid grid-cols-4 p-4"><div className="col-span-2">Card 1</div><div>Card 2</div></div>`, expectedDeterministicFixes: 0, shouldModifyCode: false }
];
