# 🚀 VibeCraft MCP (`vibecraft-mcp`) v3.2.0

> **Deterministic UI/UX Intelligence, AST Auto-Fixer & Systems Performance Engine for AI Vibe-Coding.**

[![GitHub Repo](https://img.shields.io/badge/GitHub-originsatyam%2Fvibecraft--mcp-indigo.svg)](https://github.com/originsatyam/vibecraft-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Version: 3.2.0](https://img.shields.io/badge/version-3.2.0-blue.svg)](package.json)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Unit Tests](https://img.shields.io/badge/tests-34%2F34%20passed-brightgreen.svg)]()

**VibeCraft MCP** is a 100% free, open-source Model Context Protocol (MCP) server that embeds real-world **UI Engineering**, **UX Product Psychology**, **AST Code Refactoring**, and **Backend Performance Auditing** directly into your AI coding agent sessions (Google Antigravity, Cursor, Windsurf, Claude Code).

It permanently eliminates **AI Slop**—generic, un-styled, un-accessible, double-focus-stacking, clipped SVG, N+1 query-heavy code—by enforcing proven design system contracts and automated code transformers.

---

## ⚡ 1-Click Quickstart Setup (100% Free)

Add `vibecraft-mcp` to your IDE's `mcp_config.json` (Cursor, Antigravity, Windsurf, Claude Code).

### Method 1: Direct from GitHub (Instant & 100% Free)

```json
{
  "mcpServers": {
    "vibecraft-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "github:originsatyam/vibecraft-mcp"
      ],
      "env": {
        "UI_UX_MCP_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Method 2: Local Node Execution

```json
{
  "mcpServers": {
    "vibecraft-mcp": {
      "command": "node",
      "args": [
        "/path/to/vibecraft-mcp/dist/index.js"
      ],
      "env": {
        "UI_UX_MCP_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

---

## 🛠 The 10 Core MCP Tools

### 1. `fix_ux_compliance` (NEW in v3.2.0)
Deterministic AST Code Transformer Engine. Automatically repairs UI/UX anti-patterns in TSX/JSX code:
* **Arbitrary Spacing**: Re-aligns `p-[13px]` or `gap-[15px]` to standard 4px spatial grid tokens (`p-3`, `gap-4`).
* **Nested Corner Math**: Corrects inner child radiuses using $R_{\text{inner}} = \max(0, R_{\text{outer}} - P_{\text{inset}})$.
* **Hardcoded Colors**: Replaces hex colors (`bg-[#000]`) with theme-aware HSL semantic tokens (`bg-card`).
* **Single Focus Ring**: Injects `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` to eliminate stacked focus outlines.
* **Navigation State**: Appends `aria-current="page"` strictly to active route links.

### 2. `audit_ux_compliance`
Babel AST parser engine auditing React & Tailwind code for UX anti-patterns:
* Double focus outline stacking on inputs and buttons.
* SVG line/area chart edge stroke clipping.
* Missing navigation state grammar (`DEFAULT`, `HOVER`, `ACTIVE`, `SELECTED`).
* Competing primary CTA buttons (`bg-primary` on 3+ controls).
* Touch targets smaller than 44x44px.

### 3. `get_design_tokens`
Provides ready-to-copy `globals.css` HSL CSS variables, typography scales, spatial grid, icon stroke rules, glassmorphism backdrop blurs, `shadcn/ui` CVA contracts, and Figma extracted design formulas.

### 4. `get_layout_blueprint`
Retrieves Nielsen Norman Group (NN/g) Information Architecture macro layout scaffolds:
* `saas-dashboard` — Collapsible sidebar, top utility header, stat grid, filterable data table.
* `saas-settings` — Task-oriented vertical tabs with sticky unsaved changes bar.
* `ai-generation-pattern` — AI co-pilot streaming prompt container and action bar.
* `destructive-confirm-pattern` — Double-confirmation safety dialog with undo ledges.

### 5. `get_ux_guidelines`
Queries embedded design principles & product psychology rules:
* **Frank Chimero's TSOD**: 3 Levers (Message, Tone, Format), How vs Why Balance.
* **Nir Eyal's Hook Model**: Habit loops ($B=MAT$ action friction reduction, variable rewards, investment).
* **Interaction Design Foundation (IxDF)**: Morville 7 Factors Honeycomb, Quesenberry 5 Cs.
* **Laws of UX & Growth.design**: Hick's Law, Fitts's Law (44px touch targets), Doherty Threshold (<400ms skeleton UI).

### 6. `audit_system_performance`
Audits backend code and database queries:
* **N+1 DB Query Elimination**: Refactors loop queries to ORM `include` / `JOIN FETCH`.
* **Sequential Promise Waterfalls**: Parallelizes independent calls with `Promise.all()`.
* **Transaction Safety**: Wraps multi-step mutations in `db.$transaction()` with automatic rollback.
* **OWASP IDOR Security**: Validates tenant/user ownership checks (`WHERE id = params.id AND tenantId = user.tenantId`).

### 7. `search_ui_components`
Searches 21st.dev and curated component registry by keyword, category, or tag (Glowing cards, Floating magnetic docks, Bento grids).

### 8. `get_component_code`
Retrieves copy-paste ready React + Tailwind CSS + Framer Motion code with `shadcn` CLI install commands. Supports live HTTP fallback fetching.

### 9. `get_design_system_rules`
Retrieves structured design system rules, Tailwind v4 / v3 mappings, and font priority scale (`SF Pro`, `Inter`, `Geist`, `Helvetica`).

### 10. `rag_search_ux`
LRU cached BM25 relevance ranking vector query engine over design intelligence guidelines.

---

## 🎨 Dual Trained Intelligence Systems

### System 1: Figma iOS 18 Design Intelligence Extraction
* **Concentric Corner Math**: $R_{\text{inner}} = \max(0, R_{\text{outer}} - P_{\text{inset}})$.
* **Touch Target Constraint**: $44\text{px} \times 44\text{px}$ minimum bounding box for mobile/tablet tap precision.
* **Layered Surface Density**: `Ultrathin` / `Thin` for persistent backgrounds; `Regular` / `Thick` for transient overlays & modal dialogs.
* **SVG Stroke Padding**: $P_{svg} = \max(8\text{px}, \text{strokeWidth} \times 2)$ with `overflow: visible`.

### System 2: `shadcn-ui/ui` Component Architecture (479 Components Scanned)
* **Class Variance Authority (CVA) Variant Matrices**: Standardized variant contracts (`variant`, `size`, `h-8`, `h-9`, `h-10`, `h-11`).
* **Concentric Radius CSS Variables**: `--radius-lg: var(--radius)`, `--radius-md: calc(var(--radius) - 2px)`, `--radius-sm: calc(var(--radius) - 4px)`.
* **Headless Accessibility Markers**: Radix UI `data-state="open|closed"`, `aria-expanded`, `aria-invalid`, `aria-selected`.

---

## 📚 Embedded Frameworks Matrix

| Framework | Core Concept | Purpose in Vibe-Coding |
| :--- | :--- | :--- |
| **Frank Chimero's TSOD** | 3 Levers (Message, Tone, Format) | Ensures design choices match user context & utility. |
| **Nir Eyal's Hook Model** | Trigger $\rightarrow$ Action $\rightarrow$ Reward $\rightarrow$ Investment | Builds habit-forming SaaS features and delight loops. |
| **Nielsen Norman Group** | Information Architecture (IA) | Prevents broken, chaotic SaaS page layouts. |
| **shadcn/ui & Radix UI** | Headless Primitives & CVA | Production-grade accessible component primitives. |
| **Apple HIG & WCAG AAA** | Touch targets & Focus | Mandates 44x44px touch targets and single focus ring. |
| **transitions.dev** | Shared Element Motion | Physics spring timing (`stiffness: 300, damping: 30`). |

---

## 👤 Author & Contribution

Developed by **Satyam** ([@originsatyam](https://github.com/originsatyam)).

Contributions, issues, and feature requests are welcome!

```bash
git clone https://github.com/originsatyam/vibecraft-mcp.git
cd vibecraft-mcp
npm install
npm run build
```

---

## 📄 License

MIT © [originsatyam](https://github.com/originsatyam)
