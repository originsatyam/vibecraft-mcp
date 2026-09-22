import { runASTUxAudit } from "../ast/engine.js";
import { transformCodeAST } from "../ast/fixer/transformer.js";
import { parseTsxSource } from "../ast/parser.js";
import { traverseAST } from "../ast/traverser.js";

function runRefinementRulesTestSuite() {
  console.log("=================================================");
  console.log("   VIBECRAFT REAL-WORLD REFINEMENT TEST SUITE    ");
  console.log("=================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function assert(title: string, condition: boolean, details?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] ${title}`);
    } else {
      console.error(`❌ [FAIL] ${title}`);
      if (details) console.error(`   Details: ${details}`);
    }
  }

  // --------------------------------------------------
  // ISSUE 1: INPUT DOUBLE FOCUS OUTLINE TESTS
  // --------------------------------------------------
  console.log("--- 1. Input Double Focus Outline Tests ---");

  // 1.1 Default Input with ring lacking outline-none (FAIL)
  const inputBad = runASTUxAudit(`
    export function SearchInput() {
      return <input className="w-full bg-card border border-border focus:ring-2 focus:ring-primary p-2" placeholder="Search..." />;
    }
  `);
  assert(
    "1.1 Default input with stacked focus ring & border lacking outline suppression triggers FAIL",
    inputBad.findings.some(f => f.ruleId === "double_focus_outline" && f.status === "FAIL")
  );

  // 1.2 Mouse & Keyboard focus with single focus-visible:outline-none + ring (PASS)
  const inputGood = runASTUxAudit(`
    export function SearchInput() {
      return <input className="w-full bg-card border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-2" placeholder="Search..." />;
    }
  `);
  assert(
    "1.2 Accessible focus-visible single outline treatment passes inspection",
    inputGood.findings.some(f => f.ruleId === "double_focus_outline" && f.status === "PASS")
  );

  // 1.3 Button single focus ring (PASS)
  const buttonGood = runASTUxAudit(`
    export function ActionButton() {
      return <button className="bg-primary text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 px-4 py-2">Submit</button>;
    }
  `);
  assert(
    "1.3 Button with focus-visible single outline passes",
    buttonGood.findings.some(f => f.ruleId === "double_focus_outline" && f.status === "PASS")
  );

  // 1.4 Auto-Fixer corrects double focus outline
  const astBad = parseTsxSource(`
    export function SearchInput() {
      return <input className="focus:ring-2 border" placeholder="Search..." />;
    }
  `);
  const ctxBad = traverseAST(astBad.ast, `export function SearchInput() { return <input className="focus:ring-2 border" placeholder="Search..." />; }`);
  const fixRes = transformCodeAST(ctxBad, inputBad.findings);
  assert(
    "1.4 Auto-fixer converts stacked focus to single focus-visible:outline-none ring",
    fixRes.transformedCode.includes("focus-visible:outline-none")
  );

  // --------------------------------------------------
  // ISSUE 2: SVG / CHART CLIPPING TESTS
  // --------------------------------------------------
  console.log("\n--- 2. SVG / Chart Clipping Tests ---");

  // 2.1 SVG Chart with overflow-hidden (FAIL)
  const svgClipped = runASTUxAudit(`
    export function RevenueChart() {
      return (
        <div className="w-full h-48 overflow-hidden">
          <svg className="w-full h-full overflow-hidden" viewBox="0 0 500 150">
            <path d="M 0 0 L 250 50 L 500 0" stroke="#3b82f6" strokeWidth="3" />
          </svg>
        </div>
      );
    }
  `);
  assert(
    "2.1 SVG chart with overflow-hidden and zero stroke padding triggers SVG clipping FAIL",
    svgClipped.findings.some(f => f.ruleId === "svg_chart_clipping" && f.status === "FAIL")
  );

  // 2.2 SVG Chart with overflow-visible and padded viewBox
  const svgPadded = runASTUxAudit(`
    export function RevenueChart() {
      return (
        <div className="w-full h-48">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
            <path d="M 8 8 L 250 50 L 492 8" stroke="#3b82f6" strokeWidth="3" />
          </svg>
        </div>
      );
    }
  `);
  assert(
    "2.2 SVG chart with overflow-visible correctly passes static inspection",
    !svgPadded.findings.some(f => f.ruleId === "svg_chart_clipping" && f.status === "FAIL")
  );

  // --------------------------------------------------
  // ISSUE 3: NAVIGATION STATE GRAMMAR TESTS
  // --------------------------------------------------
  console.log("\n--- 3. Navigation State Grammar Tests ---");

  // 3.1 Sidebar nav missing aria-current="page" on current route (FAIL)
  const navCode = `
    export function Sidebar() {
      return (
        <nav className="sidebar bg-card p-4">
          <a href="/overview" className="nav-item active font-bold">Overview</a>
          <a href="/analytics" className="nav-item">Analytics</a>
          <a href="/settings" className="nav-item">Settings</a>
        </nav>
      );
    }
  `;
  const navMissingAria = runASTUxAudit(navCode);
  assert(
    "3.1 Navigation missing aria-current='page' on active route triggers state grammar FAIL",
    navMissingAria.findings.some(f => f.ruleId === "invalid_navigation_state_grammar" && f.status === "FAIL")
  );

  // 3.2 Navigation with single aria-current="page" on selected route (PASS)
  const navCompliant = runASTUxAudit(`
    export function Sidebar() {
      return (
        <nav className="sidebar bg-card p-4">
          <a href="/overview" className="nav-item active font-bold" aria-current="page">Overview</a>
          <a href="/analytics" className="nav-item text-muted">Analytics</a>
          <a href="/settings" className="nav-item text-muted">Settings</a>
        </nav>
      );
    }
  `);
  assert(
    "3.2 Navigation with single aria-current='page' on selected item passes inspection",
    navCompliant.findings.some(f => f.ruleId === "invalid_navigation_state_grammar" && f.status === "PASS")
  );

  // 3.3 Navigation with multiple aria-current="page" (FAIL)
  const navMultipleAria = runASTUxAudit(`
    export function Sidebar() {
      return (
        <nav className="sidebar bg-card p-4">
          <a href="/overview" className="nav-item" aria-current="page">Overview</a>
          <a href="/analytics" className="nav-item" aria-current="page">Analytics</a>
        </nav>
      );
    }
  `);
  assert(
    "3.3 Navigation with multiple concurrent aria-current='page' markers triggers state grammar FAIL",
    navMultipleAria.findings.some(f => f.ruleId === "invalid_navigation_state_grammar" && f.evidence.includes("2 aria-current"))
  );

  // 3.4 Auto-fixer appends aria-current="page" to active link
  const astNav = parseTsxSource(navCode);
  const ctxNav = traverseAST(astNav.ast, navCode);
  const navFixRes = transformCodeAST(ctxNav, navMissingAria.findings);
  assert(
    "3.4 Auto-fixer appends aria-current='page' to active route link",
    navFixRes.transformedCode.includes('aria-current="page"')
  );

  console.log(`\n📊 REFINEMENT TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round(passedTests/totalTests*100)}%)`);
}

runRefinementRulesTestSuite();
