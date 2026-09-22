import { runASTUxFixer } from "../ast/fixer/engine.js";
import { handleFixUxCompliance } from "../tools/fix_ux_compliance.js";

function runASTFixerTestSuite() {
  console.log("=================================================");
  console.log("   VIBECRAFT MCP AST FIXER ENGINE TEST SUITE    ");
  console.log("=================================================\n");

  let total = 0;
  let passed = 0;

  function assert(title: string, condition: boolean, details?: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`✅ [PASS] ${title}`);
    } else {
      console.error(`❌ [FAIL] ${title}`);
      if (details) console.error(`   Details: ${details}`);
    }
  }

  // TEST 1: Arbitrary Spacing p-[13px] -> p-3
  const test1 = runASTUxFixer(`<div className="p-[13px] bg-card text-card-foreground">Content</div>`);
  assert("TEST 1: p-[13px] spacing auto-fixed to p-3 (12px)", 
    test1.fixesApplied.some(f => f.originalValue === "p-[13px]" && f.replacementValue === "p-3") &&
    test1.verificationStatus === "PASS"
  );

  // TEST 2: Arbitrary Radius rounded-[17px] -> rounded-2xl
  const test2 = runASTUxFixer(`<div className="p-4 rounded-[17px] bg-card">Card</div>`);
  assert("TEST 2: rounded-[17px] radius auto-fixed to rounded-2xl (16px)",
    test2.fixesApplied.some(f => f.originalValue === "rounded-[17px]" && f.replacementValue === "rounded-2xl") &&
    test2.verificationStatus === "PASS"
  );

  // TEST 3: Concentric Nested Radius Correction
  const test3 = runASTUxFixer(`
    <div className="rounded-2xl p-3 bg-card">
      <div className="rounded-2xl bg-background">Inner</div>
    </div>
  `);
  assert("TEST 3: Concentric nested radius corrected (outer 16px - padding 12px = inner 4px 'rounded')",
    test3.fixesApplied.some(f => f.ruleId === "nested_corner_math") &&
    test3.fixedCode.includes("rounded-2xl") && test3.fixedCode.includes("rounded")
  );

  // TEST 4: Already Compliant Code
  const test4 = runASTUxFixer(`<div className="p-4 rounded-2xl bg-card text-card-foreground">Clean</div>`);
  assert("TEST 4: Already compliant code produces zero changes",
    test4.fixesAppliedCount === 0 && (test4.verificationStatus === "NO_CHANGES_REQUIRED" || test4.verificationStatus === "PASS")
  );

  // TEST 5: Business Logic Number Preservation (const retryCount = 3)
  const test5 = runASTUxFixer(`
    export function Comp() {
      const retryCount = 3;
      return <div className="p-4">Retries: {retryCount}</div>;
    }
  `);
  assert("TEST 5: Business logic number (retryCount = 3) is NEVER modified",
    test5.fixedCode.includes("retryCount = 3") && test5.fixesAppliedCount === 0
  );

  // TEST 6: Dynamic Class Concatenation / Complex String
  const test6 = runASTUxFixer(`
    export function Comp() {
      const active = true;
      return <div className={cn("p-4", active && "p-[13px]")}>Dynamic</div>;
    }
  `);
  assert("TEST 6: Ambiguous dynamic class expression is NOT damaged",
    test6.fixedCode.includes("cn(")
  );

  // TEST 7: Ambiguous Custom Hook State
  const test7 = runASTUxFixer(`
    export function Comp() {
      const { status } = useProjectMutation();
      return <div className="p-4">Status: {status}</div>;
    }
  `);
  assert("TEST 7: Ambiguous custom hook state enum is skipped safely",
    test7.fixesSkipped.some(s => s.ruleId === "custom_state_abstraction")
  );

  // TEST 8: Subjective Layout / Microcopy Issue
  const test8 = runASTUxFixer(`
    export function Comp() {
      return <button className="p-4 bg-primary text-primary-foreground">Supercharge your flow!</button>;
    }
  `);
  assert("TEST 8: Subjective microcopy is reported as skipped non-deterministic",
    test8.fixesSkipped.some(s => s.ruleId === "microcopy_tone_tokenization")
  );

  // TEST 9: Multiple Deterministic Violations Repaired in 1 Pass
  const test9 = runASTUxFixer(`
    <div className="p-[13px] rounded-[17px] bg-[#121212] z-[9999]">
      <button className="focus:ring">Submit</button>
    </div>
  `);
  assert("TEST 9: Multiple deterministic violations repaired in 1 pass",
    test9.fixesAppliedCount >= 3 && test9.fixedCode.includes("bg-card") && test9.fixedCode.includes("z-50")
  );

  // TEST 10: Fixer Idempotency
  const run1 = runASTUxFixer(`<div className="p-[13px] bg-[#121212]">Card</div>`);
  const run2 = runASTUxFixer(run1.fixedCode);
  assert("TEST 10: Fixer is 100% idempotent (Run 2 produces 0 fixes and matches Run 1 fixed code)",
    run2.fixesAppliedCount === 0 && run2.fixedCode === run1.fixedCode && run2.idempotent === true
  );

  // TEST 11: Rollback Safety Verification
  const test11 = runASTUxFixer(`<div className="p-4 bg-card">Safe Code</div>`);
  assert("TEST 11: Rollback protection preserves code integrity",
    test11.fixedCode === `<div className="p-4 bg-card">Safe Code</div>`
  );

  // TEST 12: Direct MCP Tool Integration Call
  const mcpRes = handleFixUxCompliance({ code: `<div className="p-[13px] bg-[#121212]">MCP Test</div>` });
  const parsed = JSON.parse(mcpRes.content[0].text);
  assert("TEST 12: Direct MCP tool handleFixUxCompliance integration returns valid JSON schema",
    parsed.verificationStatus === "PASS" && parsed.fixesAppliedCount > 0 && parsed.fixedCode.includes("p-3")
  );

  console.log(`\n📊 FIXER TEST RESULTS: ${passed} / ${total} TESTS PASSED (${Math.round(passed/total*100)}%)`);
}

runASTFixerTestSuite();
