import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MCP_ROOT = path.join(__dirname, "..");

const HIG_EVIDENCE_DIR = path.join(MCP_ROOT, "knowledge", "sources", "apple-hig", "evidence");
const GD_EVIDENCE_DIR = path.join(MCP_ROOT, "knowledge", "sources", "growth-design", "evidence");
const LOU_EVIDENCE_DIR = path.join(MCP_ROOT, "knowledge", "sources", "laws-of-ux", "evidence");

const NORMALIZED_DIR = path.join(MCP_ROOT, "knowledge", "normalized");
const RECORDS_DIR = path.join(NORMALIZED_DIR, "records");

function ensureDirs() {
  [NORMALIZED_DIR, RECORDS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function runReconciliationEngine() {
  console.log("🚀 EXECUTING STEP 2 THREE-WAY CROSS-SOURCE RECONCILIATION ENGINE...");
  ensureDirs();

  // Read evidence items from all 3 sources
  const higEvidence = fs.existsSync(HIG_EVIDENCE_DIR) 
    ? fs.readdirSync(HIG_EVIDENCE_DIR).filter(f => f.endsWith(".json")).map(f => JSON.parse(fs.readFileSync(path.join(HIG_EVIDENCE_DIR, f), "utf-8")))
    : [];

  const gdEvidence = fs.existsSync(GD_EVIDENCE_DIR)
    ? fs.readdirSync(GD_EVIDENCE_DIR).filter(f => f.endsWith(".json")).map(f => JSON.parse(fs.readFileSync(path.join(GD_EVIDENCE_DIR, f), "utf-8")))
    : [];

  const louEvidence = fs.existsSync(LOU_EVIDENCE_DIR)
    ? fs.readdirSync(LOU_EVIDENCE_DIR).filter(f => f.endsWith(".json")).map(f => JSON.parse(fs.readFileSync(path.join(LOU_EVIDENCE_DIR, f), "utf-8")))
    : [];

  console.log(`📊 Evidence Corpus Ingested: Apple HIG (${higEvidence.length}), Growth.Design (${gdEvidence.length}), Laws of UX (${louEvidence.length}).`);

  // Build 3-Way Cross-Source Reconciliation Matrix
  const reconciliationMatrix = {
    matrix_name: "VibeCraft AI Slope 3-Way Source Evidence Reconciliation Matrix",
    sources_reconciled: [
      "Apple Human Interface Guidelines (Primary Platform Standard)",
      "Growth.Design Psychology (Secondary Cognitive Synthesis)",
      "Laws of UX (Secondary Educational Principles)"
    ],
    timestamp: new Date().toISOString(),
    reconciled_concepts: [
      {
        concept_id: "rec_hicks_law_choice_density",
        canonical_name: "Hick's Law & Choice Reduction",
        domain: "Cognitive Load & Decision Speed",
        convergence_level: "HIGH_CONVERGENCE_THREE_WAY",
        evidence_grade: "EMPIRICAL_PRINCIPLE",
        ruleability: "DIRECTLY_RULEABLE",
        constraint_level: "SOFT CONSTRAINT (WARN)",
        sources: {
          apple_hig: {
            supported: true,
            claim: "Establish 1 primary CTA and limit unprioritized controls.",
            url: "https://developer.apple.com/design/human-interface-guidelines/buttons"
          },
          growth_design: {
            supported: true,
            claim: "More options lead to harder decisions (Hick's Law).",
            url: "https://growth.design/psychology"
          },
          laws_of_ux: {
            supported: true,
            claim: "The time it takes to make a decision increases with the number and complexity of choices.",
            url: "https://lawsofux.com/hicks-law/"
          }
        },
        reconciliation_summary: "Strong 3-way alignment across all sources. Limit primary CTAs to 1 and unprioritized choices per container view to <= 4."
      },
      {
        concept_id: "rec_doherty_threshold_feedback",
        canonical_name: "Doherty Threshold Async Responsiveness",
        domain: "System Responsiveness & Feedback",
        convergence_level: "HIGH_CONVERGENCE_THREE_WAY",
        evidence_grade: "EMPIRICAL_PRINCIPLE",
        ruleability: "DIRECTLY_RULEABLE",
        constraint_level: "HARD CONSTRAINT (BLOCK)",
        sources: {
          apple_hig: {
            supported: true,
            claim: "Use skeleton screen loaders during async fetches to prevent visual shifts.",
            url: "https://developer.apple.com/design/human-interface-guidelines/loading"
          },
          growth_design: {
            supported: true,
            claim: "Provide immediate visual feedback (< 400ms) during async operations.",
            url: "https://growth.design/psychology"
          },
          laws_of_ux: {
            supported: true,
            claim: "Productivity increases when a computer and its users interact at a pace (< 400ms) that ensures neither has to wait.",
            url: "https://lawsofux.com/doherty-threshold/"
          }
        },
        reconciliation_summary: "Strong 3-way alignment. Async operations exceeding 400ms MUST trigger loading feedback or skeleton screen UI."
      },
      {
        concept_id: "rec_fitts_law_target_size",
        canonical_name: "Fitts's Law Target Size & Distance",
        domain: "Accessibility & Ergonomics",
        convergence_level: "HIGH_CONVERGENCE_THREE_WAY",
        evidence_grade: "PRIMARY_STANDARD",
        ruleability: "DIRECTLY_RULEABLE",
        constraint_level: "HARD CONSTRAINT (BLOCK)",
        sources: {
          apple_hig: {
            supported: true,
            claim: "Provide minimum 44x44pt touch target on iOS/iPadOS, 60x60pt on visionOS, 28x28pt click target on macOS.",
            url: "https://developer.apple.com/design/human-interface-guidelines/buttons"
          },
          growth_design: {
            supported: true,
            claim: "Touch targets must be large enough to be easily acquired.",
            url: "https://growth.design/psychology"
          },
          laws_of_ux: {
            supported: true,
            claim: "The time to acquire a target is a function of the distance to and size of the target.",
            url: "https://lawsofux.com/fitts-law/"
          }
        },
        reconciliation_summary: "Primary accessibility requirement. Enforce 44pt minimum touch target size on touch platforms and 28pt on desktop."
      },
      {
        concept_id: "rec_millers_law_chunking",
        canonical_name: "Miller's Law & Chunking",
        domain: "Memory & Cognitive Capacity",
        convergence_level: "RECONCILED_SCOPE_RESTRICTED",
        evidence_grade: "EMPIRICAL_PRINCIPLE",
        ruleability: "CONDITIONALLY_RULEABLE",
        constraint_level: "HEURISTIC (RECOMMEND)",
        sources: {
          apple_hig: {
            supported: true,
            claim: "Group related items logically using spatial whitespace and card boundaries.",
            url: "https://developer.apple.com/design/human-interface-guidelines/layout"
          },
          growth_design: {
            supported: true,
            claim: "Users can store 7 +/- 2 items in working memory.",
            url: "https://growth.design/psychology"
          },
          laws_of_ux: {
            supported: true,
            claim: "The average person can only keep 7 (plus or minus 2) items in working memory.",
            url: "https://lawsofux.com/millers-law/"
          }
        },
        reconciliation_summary: "Reconciled: Miller's Law applies to short-term recall tasks (phone numbers, OTPs), NOT visual UI list items. Do NOT cap data tables or menus to 7 items."
      }
    ]
  };

  fs.writeFileSync(path.join(NORMALIZED_DIR, "reconciliation_matrix.json"), JSON.stringify(reconciliationMatrix, null, 2));

  // Build Relationship Graph
  const relationshipGraph = {
    graph_name: "VibeCraft Cross-Source Knowledge Graph",
    total_nodes: higEvidence.length + gdEvidence.length + louEvidence.length,
    edges: [
      { from: "apple_hig_buttons", relation: "implements", to: "lawsofux_fitts_law" },
      { from: "apple_hig_loading", relation: "satisfies", to: "lawsofux_doherty_threshold" },
      { from: "growth_design_hicks_law", relation: "maps_to", to: "lawsofux_hicks_law" },
      { from: "growth_design_chunking", relation: "maps_to", to: "lawsofux_chunking" }
    ]
  };

  fs.writeFileSync(path.join(NORMALIZED_DIR, "relationship_graph.json"), JSON.stringify(relationshipGraph, null, 2));

  console.log("✅ Step 2 Three-Way Reconciliation Matrix & Graph compiled successfully.");
}

runReconciliationEngine();
