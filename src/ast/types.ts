export type AuditStatus = "PASS" | "FAIL" | "WARNING" | "UNKNOWN";
export type AuditConfidence = "HIGH" | "MEDIUM" | "LOW";
export type SeverityLevel = "critical" | "high" | "medium" | "low";

export interface SourceLocation {
  line: number;
  column: number;
}

export interface ASTFinding {
  ruleId: string;
  category: "state" | "accessibility" | "magic_values" | "color" | "hierarchy" | "z_index" | "microcopy" | "performance";
  severity: SeverityLevel;
  status: AuditStatus;
  confidence: AuditConfidence;
  title: string;
  issue: string;
  evidence: string;
  suggestedRemediation: string;
  sourceLocation?: SourceLocation;
}

export interface JSXAttributeData {
  name: string;
  value: string | number | boolean | null;
  isExpression: boolean;
  loc?: SourceLocation;
}

export interface JSXElementData {
  tagName: string;
  attributes: JSXAttributeData[];
  hasTextChildren: boolean;
  textChildrenContent: string[];
  hasJSXChildren: boolean;
  childTagNames: string[];
  isInsideTernary: boolean;
  isInsideLogicalAnd: boolean;
  loc?: SourceLocation;
}

export interface VariableBinding {
  name: string;
  kind: "const" | "let" | "var";
  initType?: string;
  hookName?: string;
  aliasFor?: string;
  isState: boolean;
  isAsyncState: boolean;
  literalValue?: any;
  loc?: SourceLocation;
}

export interface HookInvocation {
  hookName: string;
  returnedVariables: Array<{ name: string; alias?: string }>;
  loc?: SourceLocation;
}

export interface ConditionalRenderNode {
  type: "ternary" | "logical_and";
  testExpression: string;
  testVariables: string[];
  renderedTags: string[];
  loc?: SourceLocation;
}

export interface CollectedASTContext {
  parseSuccess: boolean;
  parseError?: string;
  rawCode: string;
  variables: Map<string, VariableBinding>;
  hooks: HookInvocation[];
  jsxElements: JSXElementData[];
  conditionals: ConditionalRenderNode[];
  numericLiterals: Array<{ value: number; context: "variable" | "jsx_attribute" | "style_prop" | "expression"; parentName?: string; loc?: SourceLocation }>;
}
