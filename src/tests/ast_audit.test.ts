import { runASTUxAudit } from "../ast/engine.js";

function runASTTestSuite() {
  console.log("=================================================");
  console.log("   VIBECRAFT MCP AST AUDIT ENGINE TEST SUITE    ");
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

  // Test A: Standard React State (useState)
  const caseA = runASTUxAudit(`
    import React, { useState } from 'react';
    export function CompA() {
      const [loading, setLoading] = useState(true);
      return loading ? <div className="p-4">Loading...</div> : <div className="p-4">Content</div>;
    }
  `);
  assert("Case A: Standard useState hook parsed correctly", caseA.parseSuccess);

  // Test B: Custom Hook State (isPending)
  const caseB = runASTUxAudit(`
    import React from 'react';
    export function CompB() {
      const { isPending } = useCreateProject();
      return (
        <div>
          {isPending && <Skeleton className="w-full h-12" />}
          <button aria-label="Create">Create</button>
        </div>
      );
    }
  `);
  assert("Case B: Custom hook isPending detected with Skeleton loader PASS", 
    caseB.findings.some(f => f.ruleId === "doherty_threshold" && f.status === "PASS")
  );

  // Test C: Aliased Hook State ({ isPending: creating })
  const caseC = runASTUxAudit(`
    import React from 'react';
    export function CompC() {
      const { isPending: creating } = useCreateProject();
      return (
        <div>
          {creating ? <Skeleton className="h-10" /> : <button aria-label="Submit">Submit</button>}
        </div>
      );
    }
  `);
  assert("Case C: Aliased hook state (isPending: creating) recognized as async state",
    caseC.findings.some(f => f.ruleId === "doherty_threshold" && f.status === "PASS")
  );

  // Test D: Ternary Rendering
  const caseD = runASTUxAudit(`
    return loading ? <Skeleton /> : <Content />;
  `);
  assert("Case D: Partial JSX ternary snippet parsed and evaluated", caseD.parseSuccess);

  // Test E: Logical && Rendering
  const caseE = runASTUxAudit(`
    return (
      <>
        {isPending && <Skeleton className="h-8" />}
        <button aria-label="Save">Save</button>
      </>
    );
  `);
  assert("Case E: Logical && rendering detected", caseE.parseSuccess);

  // Test F: Disabled Interaction State
  const caseF = runASTUxAudit(`
    const [isLoading, setIsLoading] = useState(true);
    return <button>Submit</button>;
  `);
  assert("Case F: Button missing disabled attribute during active async state flags warning",
    caseF.findings.some(f => f.ruleId === "disabled_interaction_state")
  );

  // Test G: Accessibility (aria-label)
  const caseG = runASTUxAudit(`
    return <button aria-label="Delete project"><TrashIcon /></button>;
  `);
  assert("Case G: Icon-only button with aria-label passes accessibility check",
    caseG.findings.some(f => f.ruleId === "icon_button_accessibility" && f.status === "PASS")
  );

  // Test H: Keyboard Interaction
  const caseH = runASTUxAudit(`
    return <div onClick={handleClick}>Clickable Card</div>;
  `);
  assert("Case H: Custom div with onClick missing keyboard handler flags warning",
    caseH.findings.some(f => f.ruleId === "keyboard_click_handler_missing")
  );

  // Test I: False Positive Case (const loadingText = "Loading...")
  const caseI = runASTUxAudit(`
    export function CompI() {
      const loadingText = "Loading...";
      return <div className="p-4">{loadingText}</div>;
    }
  `);
  assert("Case I: False positive text string DOES NOT trigger missing skeleton failure",
    !caseI.findings.some(f => f.ruleId === "doherty_threshold" && f.status === "FAIL")
  );

  // Test J: Business Logic Numeric Value (const retryCount = 3)
  const caseJ = runASTUxAudit(`
    export function CompJ() {
      const retryCount = 3;
      const maxLimit = 10;
      return <div className="p-4">Retries: {retryCount}</div>;
    }
  `);
  assert("Case J: Business logic numbers (retryCount=3) DO NOT trigger grid spacing violations",
    !caseJ.findings.some(f => f.ruleId === "deterministic_compilation_engine" && f.evidence.includes("retryCount"))
  );

  // Test K: UI Spacing Violation (p-[13px])
  const caseK = runASTUxAudit(`
    return <div className="p-[13px] bg-card text-card-foreground">Content</div>;
  `);
  assert("Case K: Non-grid arbitrary spacing p-[13px] triggers spatial grid violation",
    caseK.findings.some(f => f.ruleId === "deterministic_compilation_engine" && f.status === "FAIL")
  );

  // Test L: Custom Abstraction (const { status } = useProjectMutation())
  const caseL = runASTUxAudit(`
    export function CompL() {
      const { status } = useProjectMutation();
      return <div className="p-4">Status: {status}</div>;
    }
  `);
  assert("Case L: Custom status abstraction returns UNKNOWN status rather than definite failure",
    caseL.findings.some(f => f.ruleId === "custom_state_abstraction" && f.status === "UNKNOWN")
  );

  console.log(`\n📊 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round(passedTests/totalTests*100)}%)`);
}

runASTTestSuite();
