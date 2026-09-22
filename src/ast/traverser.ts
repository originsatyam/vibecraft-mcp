import { CollectedASTContext, VariableBinding, HookInvocation, JSXElementData, JSXAttributeData, ConditionalRenderNode, SourceLocation } from "./types.js";

function getLoc(node: any): SourceLocation | undefined {
  if (node?.loc?.start) {
    return { line: node.loc.start.line, column: node.loc.start.column };
  }
  return undefined;
}

export function traverseAST(ast: any, rawCode: string): CollectedASTContext {
  const context: CollectedASTContext = {
    parseSuccess: true,
    rawCode,
    variables: new Map(),
    hooks: [],
    jsxElements: [],
    conditionals: [],
    numericLiterals: []
  };

  if (!ast) {
    context.parseSuccess = false;
    return context;
  }

  function walk(node: any, parent: any = null, inTernary = false, inLogical = false) {
    if (!node || typeof node !== "object") return;

    // Node Type 1: Variable Declaration
    if (node.type === "VariableDeclaration") {
      const kind = node.kind || "const";
      for (const decl of node.declarations || []) {
        if (decl.type === "VariableDeclarator") {
          // Destructuring: const [loading, setLoading] = useState(false)
          if (decl.id.type === "ArrayPattern") {
            const stateVar = decl.id.elements?.[0];
            if (stateVar && stateVar.type === "Identifier") {
              const varName = stateVar.name;
              const isState = decl.init?.type === "CallExpression" && decl.init?.callee?.name === "useState";
              context.variables.set(varName, {
                name: varName,
                kind,
                isState: true,
                isAsyncState: false,
                hookName: isState ? "useState" : undefined,
                loc: getLoc(decl)
              });
            }
          }
          // Object Destructuring: const { isPending: creating, error } = useCreateProject()
          else if (decl.id.type === "ObjectPattern") {
            const hookName = decl.init?.type === "CallExpression" ? decl.init?.callee?.name : undefined;
            const isAsyncHook = hookName ? /use(Query|Mutation|Fetch|Async|Create|Update|Delete|Project)/i.test(hookName) : false;

            for (const prop of decl.id.properties || []) {
              if (prop.type === "ObjectProperty" && prop.key?.type === "Identifier") {
                const originalName = prop.key.name;
                const boundName = prop.value?.type === "Identifier" ? prop.value.name : originalName;
                const isAsyncState = isAsyncHook || /is(Loading|Pending|Fetching)|error|status/i.test(originalName);

                context.variables.set(boundName, {
                  name: boundName,
                  kind,
                  isState: true,
                  isAsyncState,
                  hookName,
                  aliasFor: boundName !== originalName ? originalName : undefined,
                  loc: getLoc(prop)
                });
              }
            }
          }
          // Direct Identifier: const loadingText = "Loading..." or const retryCount = 3
          else if (decl.id.type === "Identifier") {
            const varName = decl.id.name;
            let literalVal = undefined;
            if (decl.init?.type === "NumericLiteral") {
              literalVal = decl.init.value;
              context.numericLiterals.push({
                value: literalVal,
                context: "variable",
                parentName: varName,
                loc: getLoc(decl.init)
              });
            } else if (decl.init?.type === "StringLiteral") {
              literalVal = decl.init.value;
            }

            const isState = decl.init?.type === "CallExpression" && /^use[A-Z]/.test(decl.init?.callee?.name || "");
            const hookName = isState ? decl.init.callee.name : undefined;

            context.variables.set(varName, {
              name: varName,
              kind,
              isState,
              isAsyncState: isState && /use(Query|Mutation|Fetch|Async)/i.test(hookName || ""),
              hookName,
              literalValue: literalVal,
              loc: getLoc(decl)
            });
          }
        }
      }
    }

    // Node Type 2: Call Expression (Hooks)
    if (node.type === "CallExpression") {
      const calleeName = node.callee?.type === "Identifier" ? node.callee.name : undefined;
      if (calleeName && /^use[A-Z]/.test(calleeName)) {
        context.hooks.push({
          hookName: calleeName,
          returnedVariables: [],
          loc: getLoc(node)
        });
      }
    }

    // Node Type 3: Conditional Expressions (Ternaries)
    if (node.type === "ConditionalExpression") {
      const testExprStr = rawCode.substring(node.test.start || 0, node.test.end || 0) || "test";
      const testVars: string[] = [];
      if (node.test.type === "Identifier") testVars.push(node.test.name);

      context.conditionals.push({
        type: "ternary",
        testExpression: testExprStr,
        testVariables: testVars,
        renderedTags: [],
        loc: getLoc(node)
      });
      inTernary = true;
    }

    // Node Type 4: Logical Expression (e.g. loading && <Spinner />)
    if (node.type === "LogicalExpression" && node.operator === "&&") {
      const testExprStr = rawCode.substring(node.left.start || 0, node.left.end || 0) || "left";
      const testVars: string[] = [];
      if (node.left.type === "Identifier") testVars.push(node.left.name);

      context.conditionals.push({
        type: "logical_and",
        testExpression: testExprStr,
        testVariables: testVars,
        renderedTags: [],
        loc: getLoc(node)
      });
      inLogical = true;
    }

    // Node Type 5: JSX Element
    if (node.type === "JSXElement") {
      const opening = node.openingElement;
      let tagName = "unknown";
      if (opening.name.type === "JSXIdentifier") {
        tagName = opening.name.name;
      } else if (opening.name.type === "JSXMemberExpression") {
        tagName = `${opening.name.object.name}.${opening.name.property.name}`;
      }

      const attributes: JSXAttributeData[] = [];
      for (const attr of opening.attributes || []) {
        if (attr.type === "JSXAttribute" && attr.name?.type === "JSXIdentifier") {
          const attrName = attr.name.name;
          let attrValue: any = true;

          if (attr.value?.type === "StringLiteral") {
            attrValue = attr.value.value;
          } else if (attr.value?.type === "JSXExpressionContainer") {
            const expr = attr.value.expression;
            if (expr?.type === "StringLiteral") attrValue = expr.value;
            else if (expr?.type === "NumericLiteral") attrValue = expr.value;
            else if (expr?.type === "BooleanLiteral") attrValue = expr.value;
            else if (expr?.type === "Identifier") attrValue = expr.name;
            else attrValue = rawCode.substring(expr.start || 0, expr.end || 0);
          }

          attributes.push({
            name: attrName,
            value: attrValue,
            isExpression: attr.value?.type === "JSXExpressionContainer",
            loc: getLoc(attr)
          });
        }
      }

      const textChildren: string[] = [];
      const childTags: string[] = [];

      for (const child of node.children || []) {
        if (child.type === "JSXText") {
          const txt = child.value.trim();
          if (txt) textChildren.push(txt);
        } else if (child.type === "JSXElement") {
          const childName = child.openingElement?.name?.name || "element";
          childTags.push(childName);
        }
      }

      context.jsxElements.push({
        tagName,
        attributes,
        hasTextChildren: textChildren.length > 0,
        textChildrenContent: textChildren,
        hasJSXChildren: childTags.length > 0,
        childTagNames: childTags,
        isInsideTernary: inTernary,
        isInsideLogicalAnd: inLogical,
        loc: getLoc(node)
      });
    }

    // Recurse into child nodes
    for (const key of Object.keys(node)) {
      if (key === "parent" || key === "loc") continue;
      const child = node[key];
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === "object") walk(item, node, inTernary, inLogical);
        }
      } else if (child && typeof child === "object" && child.type) {
        walk(child, node, inTernary, inLogical);
      }
    }
  }

  walk(ast);
  return context;
}
