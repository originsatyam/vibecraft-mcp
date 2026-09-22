import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runBrowserValidation() {
  console.log("=================================================");
  console.log("   VIBECRAFT PLAYWRIGHT REAL BROWSER VALIDATION  ");
  console.log("=================================================\n");

  const htmlPath = path.resolve(__dirname, 'index.html');
  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

  const viewports = [
    { width: 1440, height: 900, name: 'desktop_1440x900' },
    { width: 1024, height: 768, name: 'laptop_1024x768' },
    { width: 768, height: 1024, name: 'tablet_768x1024' },
    { width: 390, height: 844, name: 'mobile_390x844' }
  ];

  const browser = await chromium.launch({ headless: true });

  const artifactDir = "C:/Users/satya/.gemini/antigravity-ide/brain/da930b94-463f-4801-989e-b2bc35fec624";
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  for (const vp of viewports) {
    console.log(`📸 Capturing viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto(fileUrl, { waitUntil: 'networkidle' });

    // Focus on search input to capture single focus ring indicator in action
    await page.focus('#search-input');
    await page.waitForTimeout(300);

    const screenshotPath = path.join(artifactDir, `refinement_view_${vp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`   Saved screenshot: ${screenshotPath}`);
    await page.close();
  }

  await browser.close();
  console.log("\n✅ All viewports captured successfully.");
}

runBrowserValidation().catch(err => {
  console.error("❌ Browser validation failed:", err);
  process.exit(1);
});
