declare module "turndown" {
  interface TurndownRule {
    filter: string | string[] | ((node: HTMLElement) => boolean);
    replacement: (content: string, node: HTMLElement) => string;
  }

  interface TurndownServiceOptions {
    headingStyle?: "setext" | "atx";
    codeBlockStyle?: "indented" | "fenced";
  }

  class TurndownService {
    constructor(options?: TurndownServiceOptions);
    turndown(html: string): string;
    addRule(name: string, rule: TurndownRule): this;
  }

  export = TurndownService;
}
