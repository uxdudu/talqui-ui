import { marked } from "marked";
import TurndownService from "turndown";

/** Converte @id no markdown para HTML de menção (antes do marked) */
function preprocessMentions(markdown: string): string {
  return markdown.replace(/@(\w+)\b/g, (_, id) => {
    const label = id.replace(/_/g, " ");
    return `<span data-type="mention" data-id="${id}" data-label="${label}">@${label}</span>`;
  });
}

export function markdownToHtml(markdown: string): string {
  if (!markdown?.trim()) return "<p></p>";
  const withMentions = preprocessMentions(markdown);
  const html = marked.parse(withMentions, { async: false }) as string;
  return html;
}

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

turndown.addRule("mention", {
  filter: (node) =>
    node.nodeName === "SPAN" &&
    node.getAttribute?.("data-type") === "mention",
  replacement: (_content, node) => {
    const el = node as HTMLElement;
    const id = el.getAttribute("data-id") ?? "";
    return id ? `@${id} ` : "";
  },
});

export function htmlToMarkdown(html: string): string {
  if (!html?.trim()) return "";
  return turndown.turndown(html);
}

/** Extrai IDs de habilidades mencionadas no conteúdo (@verificar_horario, etc.) */
export function extractMentionIds(content: string): string[] {
  const matches = content.matchAll(/@(\w+)\b/g);
  return [...new Set([...matches].map((m) => m[1]))];
}

/** Remove the first heading line from markdown (title is shown in header) */
export function stripLeadingHeading(markdown: string): string {
  if (!markdown?.trim()) return "";
  const trimmed = markdown.trimStart();
  const match = trimmed.match(/^#{1,6}\s+.+\n?/);
  return match ? trimmed.slice(match[0].length).trimStart() : trimmed;
}
