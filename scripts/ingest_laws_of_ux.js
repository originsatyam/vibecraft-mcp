import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MCP_ROOT = path.join(__dirname, "..");
const BASE_DIR = path.join(MCP_ROOT, "knowledge", "sources", "laws-of-ux");
const PAGES_DIR = path.join(BASE_DIR, "pages");
const EVIDENCE_DIR = path.join(BASE_DIR, "evidence");
const MEASUREMENTS_DIR = path.join(BASE_DIR, "measurements");
const RELATIONSHIPS_DIR = path.join(BASE_DIR, "relationships");

const FIRECRAWL_API_KEY = "fc-e83bf2bd6ebd4b75b2c3b144ada251a9";
const LAWS_OF_UX_URL = "https://lawsofux.com/";

function ensureDirs() {
  [BASE_DIR, PAGES_DIR, EVIDENCE_DIR, MEASUREMENTS_DIR, RELATIONSHIPS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

async function ingestLawsOfUx() {
  console.log("🚀 STARTING LAWS OF UX SOURCE INGESTION PIPELINE...");
  ensureDirs();

  console.log("📥 Scraping Laws of UX Index Page...");
  const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${FIRECRAWL_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url: LAWS_OF_UX_URL,
      formats: ["markdown"]
    })
  });

  const data = await res.json();
  if (!data.success || !data.data || !data.data.markdown) {
    throw new Error("Failed to scrape Laws of UX");
  }

  const markdown = data.data.markdown;
  fs.writeFileSync(path.join(BASE_DIR, "laws_of_ux_raw.json"), JSON.stringify({
    source: "Laws of UX",
    url: LAWS_OF_UX_URL,
    retrieved_at: new Date().toISOString(),
    markdown
  }, null, 2));

  // Parse individual laws
  const lines = markdown.split("\n");
  const laws = [];
  let currentTitle = "";
  let currentSlug = "";
  let currentDesc = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    const linkMatch = line.match(/##\s*\[([^\]]+)\]\((https:\/\/lawsofux\.com\/([^\/]+)\/)\)/);
    if (linkMatch) {
      if (currentTitle) {
        laws.push({
          source_id: `lawsofux_${currentSlug.replace(/-/g, "_")}`,
          slug: currentSlug,
          title: currentTitle,
          url: `https://lawsofux.com/${currentSlug}/`,
          claim: currentDesc || `${currentTitle} UX principle.`
        });
      }
      currentTitle = linkMatch[1];
      currentSlug = linkMatch[3];
      currentDesc = "";
    } else if (line.length > 10 && !line.startsWith("#") && !line.startsWith("[")) {
      currentDesc += (currentDesc ? " " : "") + line;
    }
  }

  if (currentTitle) {
    laws.push({
      source_id: `lawsofux_${currentSlug.replace(/-/g, "_")}`,
      slug: currentSlug,
      title: currentTitle,
      url: `https://lawsofux.com/${currentSlug}/`,
      claim: currentDesc || `${currentTitle} UX principle.`
    });
  }

  console.log(`✅ Parsed ${laws.length} Laws of UX principles.`);

  // Write Sitemap & Source Metadata
  fs.writeFileSync(path.join(BASE_DIR, "sitemap.json"), JSON.stringify({
    source: "Laws of UX",
    base_url: LAWS_OF_UX_URL,
    total_laws: laws.length,
    entries: laws
  }, null, 2));

  fs.writeFileSync(path.join(BASE_DIR, "source.json"), JSON.stringify({
    source_id: "laws_of_ux_corpus",
    name: "Laws of UX",
    url: LAWS_OF_UX_URL,
    author: "Jon Yablonski",
    type: "Secondary Synthesis / Educational Reference",
    retrieved_at: new Date().toISOString()
  }, null, 2));

  // Extract Evidence & Measurements
  const allEvidence = [];
  const allMeasurements = [];
  const allRelationships = [];

  laws.forEach((law, idx) => {
    const evidenceId = `lawsofux_e_${String(idx + 1).padStart(6, "0")}`;
    
    let qualifier = "consider";
    if (law.claim.toLowerCase().includes("must")) qualifier = "must";
    if (law.claim.toLowerCase().includes("should")) qualifier = "should";

    allEvidence.push({
      evidence_id: evidenceId,
      source_id: law.source_id,
      title: law.title,
      claim: law.claim,
      claim_type: "principle",
      qualifier,
      context: "Universal UX & Human Cognition",
      platform: "Universal Web & Mobile Context",
      source_url: law.url,
      source_location: `Laws of UX > ${law.title}`,
      evidence_level: "Secondary Synthesis / Educational Law",
      rule_candidate: true,
      status: "NOT_VALIDATED"
    });

    // Check for numerical threshold (e.g. Miller's Law 7 +/- 2, Doherty Threshold 400ms)
    const numMatch = law.claim.match(/(\d+)\s*(\pm\s*\d+|ms|pt|px|%|seconds)?/i);
    if (numMatch) {
      allMeasurements.push({
        measurement_id: `m_lawsofux_${String(idx + 1).padStart(6, "0")}`,
        parameter: `${law.slug}_threshold`,
        value: parseFloat(numMatch[1]),
        unit: numMatch[2] || "count",
        condition: law.claim,
        platform: "Universal Web & Mobile Context",
        source_id: law.source_id,
        source_location: `Laws of UX > ${law.title}`
      });
    }

    allRelationships.push({
      from: law.source_id,
      relationship: "cross_references",
      target_title: "Cognitive Psychology & Interaction Design",
      target_url: law.url
    });
  });

  // Save evidence records
  allEvidence.forEach(ev => {
    fs.writeFileSync(path.join(EVIDENCE_DIR, `${ev.evidence_id}.json`), JSON.stringify(ev, null, 2));
  });

  fs.writeFileSync(path.join(MEASUREMENTS_DIR, "measurements.json"), JSON.stringify({
    total_measurements: allMeasurements.length,
    measurements: allMeasurements
  }, null, 2));

  fs.writeFileSync(path.join(RELATIONSHIPS_DIR, "relationships.json"), JSON.stringify({
    total_relationships: allRelationships.length,
    relationships: allRelationships
  }, null, 2));

  console.log(`✅ Extracted ${allEvidence.length} Laws of UX atomic evidence items.`);
}

ingestLawsOfUx().catch(err => {
  console.error("Fatal Error ingesting Laws of UX:", err);
  process.exit(1);
});
