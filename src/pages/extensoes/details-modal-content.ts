/**
 * Permissões do modal de detalhes (ex.: WhatsApp Paralelo).
 * Pode ser movido para data.ts ou API no futuro.
 */
export const PERMISSIONS_BY_CATEGORY = {
  mensagens: [
    "Ler e gravar seções",
    "Ler e gravar mensagens",
    "Ler e gravar status",
    "Ler páginas",
    "Ler ocorrências",
    "Escrever ações",
    "Escrever encaminhamento",
  ],
  contatos: [
    "Ler perfis",
    "Escrever ocorrências",
    "Ler dados",
  ],
  site: [
    "Ler disponibilidade",
    "Ler operadoras",
    "Ler verificar configurações",
    "Ler helpdesk informações",
    "Ler helpdesk locais",
    "Ler helpdesk artigos",
  ],
} as const;

export const ABOUT_INTEGRATION_TEXT = `Conecte o seu WhatsApp com a Talqui sem pagar nada por isso!

Esta integração em modo de demonstração** permite que você faça um teste conectando o WhatsApp da sua empresa ao painel de atendimento da Talqui. Neste plugin a API de integração utilizada não é oficial e por isso pode ser distribuída de forma gratuita apenas para fins de demonstração.

Não aconselhamos o uso desta integração em modo de produção.`;

/** Resumo em uma linha para a página de configurações */
export const ABOUT_INTEGRATION_SUMMARY =
  "Integração com o canal para enviar e receber mensagens pelo painel de atendimento da Talqui.";
