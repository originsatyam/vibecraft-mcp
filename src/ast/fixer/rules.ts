import { FixabilityCategory } from "./types.js";

// Rule Fixability Classifications
export const RULE_FIXABILITY_MAP: Record<string, FixabilityCategory> = {
  // Deterministically Fixable
  deterministic_compilation_engine: "DETERMINISTICALLY_FIXABLE",
  functional_border_radius_hierarchy: "DETERMINISTICALLY_FIXABLE",
  nested_corner_math: "DETERMINISTICALLY_FIXABLE",
  hardcoded_hex_colors: "DETERMINISTICALLY_FIXABLE",
  z_index_stacking_system: "DETERMINISTICALLY_FIXABLE",
  focus_ring_offset_missing: "DETERMINISTICALLY_FIXABLE",
  inline_style_magic_pixel: "DETERMINISTICALLY_FIXABLE",
  double_focus_outline: "DETERMINISTICALLY_FIXABLE",
  invalid_navigation_state_grammar: "DETERMINISTICALLY_FIXABLE",

  // Detectable but Not Safe to Fix Automatically
  doherty_threshold: "DETECTABLE_BUT_NOT_SAFE_TO_FIX",
  disabled_interaction_state: "DETECTABLE_BUT_NOT_SAFE_TO_FIX",
  custom_state_abstraction: "DETECTABLE_BUT_NOT_SAFE_TO_FIX",
  keyboard_click_handler_missing: "DETECTABLE_BUT_NOT_SAFE_TO_FIX",
  svg_chart_clipping: "DETECTABLE_BUT_NOT_SAFE_TO_FIX",

  // Subjective / Non-Deterministic
  ai_slop_rejection: "SUBJECTIVE_NON_DETERMINISTIC",
  hicks_law: "SUBJECTIVE_NON_DETERMINISTIC",
  microcopy_tone_tokenization: "SUBJECTIVE_NON_DETERMINISTIC",
  clinical_color_semantics: "SUBJECTIVE_NON_DETERMINISTIC",
  data_visualization_laws: "SUBJECTIVE_NON_DETERMINISTIC"
};

// Deterministic Mapping Helper Functions
export function mapArbitrarySpacingToken(prefix: string, pxVal: number): string {
  // 4px grid steps: 4->1, 8->2, 12->3, 16->4, 20->5, 24->6, 32->8, 40->10, 48->12, 64->16
  const nearestGridPx = Math.round(pxVal / 4) * 4;
  const gridStep = nearestGridPx / 4;
  
  if (gridStep <= 0) return `${prefix}-0`;
  if (gridStep === 1) return `${prefix}-1`;
  if (gridStep === 2) return `${prefix}-2`;
  if (gridStep === 3) return `${prefix}-3`;
  if (gridStep === 4) return `${prefix}-4`;
  if (gridStep === 5) return `${prefix}-5`;
  if (gridStep === 6) return `${prefix}-6`;
  if (gridStep === 8) return `${prefix}-8`;
  if (gridStep === 10) return `${prefix}-10`;
  if (gridStep === 12) return `${prefix}-12`;
  return `${prefix}-[${nearestGridPx}px]`;
}

export function mapArbitraryRadiusToken(pxVal: number): string {
  if (pxVal <= 0) return "rounded-none";
  if (pxVal <= 3) return "rounded-sm";
  if (pxVal <= 6) return "rounded";
  if (pxVal <= 9) return "rounded-md";
  if (pxVal <= 14) return "rounded-xl";
  if (pxVal <= 20) return "rounded-2xl";
  return "rounded-3xl";
}

export function calculateNestedRadiusToken(outerRadiusPx: number, paddingPx: number): string {
  const innerPx = Math.max(0, outerRadiusPx - paddingPx);
  return mapArbitraryRadiusToken(innerPx);
}

export function mapHexToSemanticToken(classOrHexStr: string): string {
  if (classOrHexStr.includes("bg-[#05050a]") || classOrHexStr.includes("bg-[#000000]") || classOrHexStr.includes("bg-[#121212]")) {
    return "bg-card";
  }
  if (classOrHexStr.includes("text-[#ffffff]") || classOrHexStr.includes("text-[#fff]")) {
    return "text-card-foreground";
  }
  if (classOrHexStr.includes("border-[#333333]") || classOrHexStr.includes("border-[#222222]")) {
    return "border-border";
  }
  return classOrHexStr.replace(/bg-\[#[a-fA-F0-9]{3,6}\]/, "bg-card")
                     .replace(/text-\[#[a-fA-F0-9]{3,6}\]/, "text-foreground")
                     .replace(/border-\[#[a-fA-F0-9]{3,6}\]/, "border-border");
}
