/**
 * Integração com Brandfetch Logo API para exibir logos de marcas.
 * @see https://docs.brandfetch.com/docs/logo-api
 * Para usar: defina VITE_BRANDFETCH_CLIENT_ID no .env (registro gratuito em https://developers.brandfetch.com/register).
 */

export interface BrandfetchLogoOptions {
  /** Largura em pixels (ratio preservado). */
  w?: number;
  /** Altura em pixels (ratio preservado). */
  h?: number;
  /** icon = ícone de perfil; logo = logo horizontal; symbol = símbolo. */
  type?: "icon" | "logo" | "symbol";
  /** Tema do logo. */
  theme?: "light" | "dark";
}

const CDN_BASE = "https://cdn.brandfetch.io";

/**
 * Gera a URL do logo no CDN do Brandfetch.
 * Retorna string vazia se VITE_BRANDFETCH_CLIENT_ID não estiver definido.
 */
export function getBrandfetchLogoUrl(
  domain: string,
  options: BrandfetchLogoOptions = {}
): string {
  const clientId =
    typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_BRANDFETCH_CLIENT_ID;
  if (!clientId || !domain) return "";

  const cleanDomain = domain.replace(/^https?:\/\//, "").split("/")[0];
  const parts: string[] = [cleanDomain];
  if (options.w != null) parts.push(`w/${options.w}`);
  if (options.h != null) parts.push(`h/${options.h}`);
  if (options.theme) parts.push(`theme/${options.theme}`);
  if (options.type) parts.push(`type/${options.type}`);

  const path = parts.join("/");
  return `${CDN_BASE}/${path}?c=${clientId}`;
}

export interface ExtensionWithLogo {
  logoUrl: string;
  brandfetchDomain?: string;
}

/**
 * Retorna a URL da logo da extensão: Brandfetch se houver brandfetchDomain e client ID configurado, senão logoUrl.
 */
export function getExtensionLogoUrl(
  extension: ExtensionWithLogo,
  options: BrandfetchLogoOptions = {}
): string {
  if (extension.brandfetchDomain) {
    const url = getBrandfetchLogoUrl(extension.brandfetchDomain, {
      w: options.w ?? 96,
      h: options.h ?? 96,
      type: options.type ?? "icon",
      theme: options.theme ?? "light",
    });
    if (url) return url;
  }
  return extension.logoUrl;
}
