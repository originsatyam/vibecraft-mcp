import { COMPONENTS_CATALOG } from "../database/components_index.js";

export async function handleGetComponentCode(args: { slug: string; registryUrl?: string }) {
  const { slug, registryUrl } = args;

  let component = COMPONENTS_CATALOG[slug];

  if (!component && registryUrl) {
    try {
      const apiKey = process.env.UI_UX_MCP_API_KEY;
      const headers: Record<string, string> = {};
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const res = await fetch(registryUrl, { headers });
      if (res.ok) {
        const text = await res.text();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  slug: slug || "fetched-component",
                  name: slug || "Fetched 21st Component",
                  registryUrl,
                  installCommand: `npx shadcn@latest add "${registryUrl}"`,
                  rawCode: text
                },
                null,
                2
              )
            }
          ]
        };
      }
    } catch (e: any) {
      // Fallback
    }
  }

  if (!component) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            error: `Component '${slug}' not found in catalog. Available slugs: ${Object.keys(COMPONENTS_CATALOG).join(", ")}. You can also pass 'registryUrl' to fetch live from 21st.dev.`
          })
        }
      ],
      isError: true
    };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            slug: component.slug,
            name: component.name,
            registryUrl: component.registryUrl,
            dependencies: component.dependencies,
            installCommand: `npx shadcn@latest add "${component.registryUrl}"`,
            codeSnippet: component.codeSnippet,
            demoSnippet: component.demoSnippet
          },
          null,
          2
        )
      }
    ]
  };
}
