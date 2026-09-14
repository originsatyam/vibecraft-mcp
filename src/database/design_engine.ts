export interface MetricScore {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH";
  formula: string;
  explanation: string;
}

/**
 * Quantitative UX Decision Calculation Engine
 * Replaces aesthetic intuition with deterministic scoring formulas.
 */
export function calculatePriority(importance: number, frequency: number, urgency: number, consequence: number): MetricScore {
  // Score inputs scaled 1-5
  const raw = (importance * frequency * urgency * consequence) / 625; // 0 to 1
  const score = Math.round(raw * 100);
  const level = score > 66 ? "HIGH" : score > 33 ? "MEDIUM" : "LOW";
  return {
    score,
    level,
    formula: "PRIORITY = importance × frequency × urgency × consequence",
    explanation: `Calculated priority score: ${score}/100 (${level}). High priority items demand prominent visual placement and persistent navigation.`
  };
}

export function calculateComplexityCost(choices: number, steps: number, cognitiveBurden: number): MetricScore {
  const raw = (choices * steps * cognitiveBurden) / 125;
  const score = Math.round(raw * 100);
  const level = score > 60 ? "HIGH" : score > 30 ? "MEDIUM" : "LOW";
  return {
    score,
    level,
    formula: "COMPLEXITY_COST = choices × steps × cognitive_burden",
    explanation: `Complexity cost: ${score}/100 (${level}). ${level === 'HIGH' ? 'High complexity cost detected! Apply Hick\'s Law and progressive disclosure.' : 'Acceptable complexity level.'}`
  };
}

export function calculateNavigationPriority(frequency: number, importance: number, independence: number): MetricScore {
  const raw = (frequency * importance * independence) / 125;
  const score = Math.round(raw * 100);
  const level = score > 50 ? "HIGH" : "MEDIUM";
  return {
    score,
    level,
    formula: "NAVIGATION_PRIORITY = frequency × importance × destination_independence",
    explanation: `Navigation priority: ${score}/100 (${level}). High priority items belong in persistent primary sidebar/dock navigation.`
  };
}

export function calculateErrorRisk(probability: number, consequence: number): MetricScore {
  const raw = (probability * consequence) / 25;
  const score = Math.round(raw * 100);
  const level = score > 50 ? "HIGH" : score > 25 ? "MEDIUM" : "LOW";
  return {
    score,
    level,
    formula: "ERROR_RISK = probability × consequence",
    explanation: `Error risk: ${score}/100 (${level}). ${level === 'HIGH' ? 'High risk! Require explicit double-confirmation or type-to-confirm modal with Undo safety ledge.' : 'Low error risk.'}`
  };
}

export const SOURCE_OF_TRUTH_HIERARCHY = [
  "1. Explicit product requirements",
  "2. User goals and tasks",
  "3. Functional/business constraints",
  "4. Accessibility requirements (WCAG AAA)",
  "5. Established UX principles",
  "6. Established interaction patterns",
  "7. Design-system constraints",
  "8. Platform conventions",
  "9. Visual preferences"
];

export const TRADE_OFF_MATRIX = {
  "discoverability_vs_simplicity": "Increasing discoverability exposes more controls, which increases visual clutter. Use progressive disclosure.",
  "flexibility_vs_complexity": "Highly flexible interfaces increase cognitive load. Provide smart defaults for 80% of use cases.",
  "speed_vs_safety": "Fast one-click actions increase misclick risk. Use non-destructive actions with immediate 'Undo' toast ledges.",
  "visibility_vs_information_density": "High density fits more data on screen but requires high visual scanning effort. Use clear tabular typography.",
  "consistency_vs_context_optimization": "Maintain consistent behavior across screens unless user context strictly demands custom interaction."
};
