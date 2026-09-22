import { parse, ParseResult } from "@babel/parser";
import { File } from "@babel/types";

export function parseTsxSource(code: string): { ast: ParseResult<File> | null; error?: string } {
  const trimmed = code.trim();

  // 1. Try direct parsing as TSX module
  try {
    const ast = parse(trimmed, {
      sourceType: "module",
      plugins: ["typescript", "jsx"]
    });
    return { ast };
  } catch (err1: any) {
    // 2. Try wrapping as component body statements
    try {
      const wrappedBody = `function __VibeCraftWrapperComponent__() {\n  ${trimmed}\n}`;
      const ast = parse(wrappedBody, {
        sourceType: "module",
        plugins: ["typescript", "jsx"]
      });
      return { ast };
    } catch (err2: any) {
      // 3. Try wrapping as returned JSX expression
      try {
        const wrappedReturn = `function __VibeCraftWrapperComponent__() {\n  return (\n    ${trimmed}\n  );\n}`;
        const ast = parse(wrappedReturn, {
          sourceType: "module",
          plugins: ["typescript", "jsx"]
        });
        return { ast };
      } catch (err3: any) {
        return { ast: null, error: `Failed to parse TSX snippet: ${err1?.message || String(err1)}` };
      }
    }
  }
}
