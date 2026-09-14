# 🚀 VibeCraft MCP (`vibecraft-mcp`)

> **Deterministic UI/UX Intelligence & Systems Performance Engine for AI Vibe-Coding.**

[![npm version](https://img.shields.io/badge/npm-v1.8.0-indigo.svg)](https://www.npmjs.com/package/vibecraft-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

**VibeCraft MCP** is an open-source Model Context Protocol (MCP) server that embeds real-world **UI Engineering**, **UX Product Psychology**, and **Backend Performance Auditing** directly into your AI coding agent sessions (Google Antigravity, Cursor, Windsurf, Claude Code).

It permanently eliminates **AI Slop**—generic, un-styled, un-accessible, N+1 query-heavy code—by enforcing proven design principles and component engineering automatically.

---

## ⚡ Quickstart Setup

Add `vibecraft-mcp` to your IDE's `mcp_config.json` (Cursor, Antigravity, Windsurf, Claude Code):

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

## 🛠 The 7 Core MCP Tools

### 1. `get_layout_blueprint`
Retrieves Nielsen Norman Group (NN/g) Information Architecture macro layout scaffolds:
* `saas-dashboard` — Collapsible sidebar, top utility header, stat grid, filterable data table.
* `saas-settings` — Task-oriented vertical tabs with sticky unsaved changes bar.
* `ai-generation-pattern` — AI co-pilot streaming prompt container and action bar.
* `destructive-confirm-pattern` — Double-confirmation safety dialog with undo ledges.

### 2. `get_ux_guidelines`
Queries embedded design principles & product psychology rules:
* **Frank Chimero's TSOD**: 3 Levers (Message, Tone, Format), How vs Why Balance.
* **Nir Eyal's Hook Model**: Habit loops ($B=MAT$ action friction reduction, variable rewards, investment).
* **Interaction Design Foundation (IxDF)**: Morville 7 Factors Honeycomb, Quesenberry 5 Cs.
* **Laws of UX & Growth.design**: Hick's Law, Fitts's Law (44px touch targets), Doherty Threshold (<400ms skeleton UI).

### 3. `audit_ux_compliance`
Audits React & Tailwind code for UX anti-patterns:
* Competing primary CTA buttons (`bg-primary` on 3+ adjacent controls).
* Hardcoded hex colors (`bg-[#121212]`) missing HSL semantic design tokens.
* Touch targets smaller than 44x44px.
* Icon-only buttons lacking `aria-label`.

### 4. `audit_system_performance`
Audits backend code and database queries:
* **N+1 DB Query Elimination**: Refactors loop queries to ORM `include` / `JOIN FETCH`.
* **Sequential Promise Waterfalls**: Parallelizes independent calls with `Promise.all()`.
* **Transaction Safety**: Wraps multi-step mutations in `db.$transaction()` with automatic rollback.
* **OWASP IDOR Security**: Validates tenant/user ownership checks (`WHERE id = params.id AND tenantId = user.tenantId`).

### 5. `search_ui_components`
Searches 21st.dev and curated component registry by keyword, category, or tag (Glowing cards, Floating magnetic docks, Bento grids).

### 6. `get_component_code`
Retrieves copy-paste ready React + Tailwind CSS + Framer Motion code with `shadcn` CLI install commands. Supports live HTTP fallback fetching.

### 7. `get_design_tokens`
Provides ready-to-copy `globals.css` light & dark mode HSL CSS variables, typography scales, spatial grid, icon stroke rules, and spring animation parameters.

---

## 📚 Embedded Design & Engineering Frameworks

| Framework | Core Concept | Purpose in Vibe-Coding |
| :--- | :--- | :--- |
| **Frank Chimero's TSOD** | 3 Levers (Message, Tone, Format) | Ensures design choices match user context & utility. |
| **Nir Eyal's Hook Model** | Trigger $\rightarrow$ Action $\rightarrow$ Reward $\rightarrow$ Investment | Builds habit-forming SaaS features and delight loops. |
| **Nielsen Norman Group** | Information Architecture (IA) | Prevents broken, chaotic SaaS page layouts. |
| **Apple HIG & WCAG AAA** | Touch targets & Access | Mandates 44x44px touch targets and screen-reader accessibility. |
| **transitions.dev** | Shared Element Motion | Physics spring timing (`stiffness: 300, damping: 30`). |
| **21st.dev & shadcn** | Component Registry | Production-grade UI code primitives. |

---

## 👤 Author & Contribution

Developed by **Satyam** ([@satyamuiux-byte](https://github.com/satyamuiux-byte)).

Contributions, issues, and feature requests are welcome!

```bash
git clone https://github.com/satyamuiux-byte/vibecraft-mcp.git
cd vibecraft-mcp
npm install
npm run build
```

---

## 📄 License

MIT © [satyamuiux-byte](https://github.com/satyamuiux-byte)
