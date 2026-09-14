#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { handleGetUxGuidelines } from "./tools/get_ux_guidelines.js";
import { handleAuditUxCompliance } from "./tools/audit_ux_compliance.js";
import { handleSearchUiComponents } from "./tools/search_ui_components.js";
import { handleGetComponentCode } from "./tools/get_component_code.js";
import { handleGetDesignTokens } from "./tools/get_design_tokens.js";
import { handleGetLayoutBlueprint } from "./tools/get_layout_blueprint.js";
import { handleAuditSystemPerformance } from "./tools/audit_system_performance.js";

const server = new Server(
  {
    name: "vibecraft-mcp",
    version: "1.8.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "audit_system_performance",
        description:
          "Audits backend API code, database queries, network waterfalls, and frontend rendering for performance bottlenecks, N+1 queries, un-transactional mutations, IDOR security issues, and slow OFFSET pagination.",
        inputSchema: {
          type: "object",
          properties: {
            codeOrQuery: { type: "string", description: "Backend controller, database query, network call, or React component snippet to audit" },
            scope: { type: "string", enum: ["backend", "database", "frontend", "security", "network"], description: "Optional optimization scope" }
          },
          required: ["codeOrQuery"]
        }
      },
      {
        name: "get_layout_blueprint",
        description:
          "Retrieves Nielsen Norman Group (NN/g) Information Architecture (IA) macro page layout scaffolds and Design System Task Patterns (AI Co-pilot generation, Destructive actions, SaaS Dashboards, Settings, Onboarding, Pricing).",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Blueprint ID e.g. 'saas-dashboard', 'saas-settings', 'ai-generation-pattern', 'destructive-confirm-pattern'" },
            type: {
              type: "string",
              enum: ["dashboard", "settings", "onboarding", "pricing", "analytics", "data_table", "auth", "destructive", "ai_generation", "bulk_actions"],
              description: "Filter layout type"
            }
          }
        }
      },
      {
        name: "get_ux_guidelines",
        description:
          "Queries UX Intelligence Rules: AI-Slop Prevention Matrix, Source of Truth Hierarchy, Frank Chimero's TSOD 3 Levers, Design System 13-State Matrix, Apple HIG, Laws of UX, Nir Eyal's Hook Model, IxDF Foundations, NN/g IA, and transitions.dev rules.",
        inputSchema: {
          type: "object",
          properties: {
            topic: { type: "string", description: "Search query e.g. 'slop', 'hierarchy', 'state', 'levers', 'why', 'hook', 'ia', 'honeycomb'" },
            category: {
              type: "string",
              enum: ["apple_hig", "laws_of_ux", "growth_design", "transitions_dev", "accessibility", "hook_model", "ixdf_foundations", "shape_of_design", "ds_governance", "ai_slop_prevention", "design_principles"],
              description: "Filter by UX framework category"
            }
          }
        }
      },
      {
        name: "audit_ux_compliance",
        description:
          "Audits UI code or prompt specs against AI-slop prevention matrix, competing primary CTAs, TSOD levers, Design System 13-state matrix, Laws of UX, Apple HIG, Hook Model habit loops, IxDF principles, hardcoded hex colors, and icon accessibility.",
        inputSchema: {
          type: "object",
          properties: {
            codeOrPrompt: { type: "string", description: "React/Tailwind snippet or prompt specification to audit" },
            componentType: { type: "string", description: "Optional component category e.g. 'modal', 'card', 'form'" }
          },
          required: ["codeOrPrompt"]
        }
      },
      {
        name: "search_ui_components",
        description: "Searches 21st.dev & curated high-craft UI component registry by keyword, category, or tag.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search term e.g. 'glowing', 'dock', 'bento'" },
            category: {
              type: "string",
              enum: ["heroes", "navigation", "bento_grids", "cards", "modals", "forms", "animations", "tables"]
            },
            tag: { type: "string", description: "Specific tag e.g. 'glassmorphism', 'apple-hig', 'framer-motion'" }
          }
        }
      },
      {
        name: "get_component_code",
        description: "Retrieves complete React, Tailwind, Framer Motion source code, demo, and dependencies for a component. Supports fallback live fetching.",
        inputSchema: {
          type: "object",
          properties: {
            slug: { type: "string", description: "Unique component slug e.g. 'glowing-card', 'floating-dock', 'bento-grid-3x3'" },
            registryUrl: { type: "string", description: "Optional 21st.dev registry URL to fetch live if not found offline" }
          },
          required: ["slug"]
        }
      },
      {
        name: "get_design_tokens",
        description: "Provides HSL CSS color variables, globals.css setup, typography scales, spatial grid, icon stroke rules, shadows, and spring animation parameters.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: ["colors", "typography", "spatialGrid", "motionCurves", "iconsAndSymbols", "shadows"],
              description: "Token group category"
            }
          }
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "audit_system_performance":
        return handleAuditSystemPerformance(args as any);
      case "get_layout_blueprint":
        return handleGetLayoutBlueprint(args as any);
      case "get_ux_guidelines":
        return handleGetUxGuidelines(args as any);
      case "audit_ux_compliance":
        return handleAuditUxCompliance(args as any);
      case "search_ui_components":
        return handleSearchUiComponents(args as any);
      case "get_component_code":
        return handleGetComponentCode(args as any);
      case "get_design_tokens":
        return handleGetDesignTokens(args as any);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error executing tool ${name}: ${error.message}` }],
      isError: true
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("vibecraft-mcp server v1.8.0 running on stdio");
}

main().catch((error) => {
  console.error("Fatal error starting vibecraft-mcp server:", error);
  process.exit(1);
});
