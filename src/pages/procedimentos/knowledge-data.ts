export type KnowledgeFormato =
  | "texto"
  | "imagem"
  | "pdf"
  | "url"
  | "vídeo"
  | "tabela";

export interface KnowledgeSource {
  id: string;
  numero: number;
  nome: string;
  preview: string;
  /** Conteúdo em Markdown */
  content: string;
  /** Data da última atualização (formato ISO) */
  ultimaAtualizacao: string;
  atualizadoPor: string;
  /** Se está disponível para o agente */
  disponivel: boolean;
  /** Formato do conteúdo: texto, imagem, pdf, etc. */
  formato: KnowledgeFormato;
}

/** Fonte vazia para abrir o editor em modo "novo conhecimento". id "new" indica criação. */
export const EMPTY_KNOWLEDGE_SOURCE: KnowledgeSource = {
  id: "new",
  numero: 0,
  nome: "",
  preview: "",
  content: "",
  ultimaAtualizacao: "",
  atualizadoPor: "",
  disponivel: false,
  formato: "texto",
};

export const KNOWLEDGE_FORMATO_LABELS: Record<KnowledgeFormato, string> = {
  texto: "Texto",
  imagem: "Imagem",
  pdf: "PDF",
  url: "URL",
  vídeo: "Vídeo",
  tabela: "Tabela",
};

export const KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  {
    id: "1",
    numero: 1,
    nome: "Manual do produto v2.1",
    formato: "texto",
    preview: "Este manual descreve as funcionalidades do produto...",
    content: `# Manual do Produto v2.1

## Introdução

Este manual descreve as **funcionalidades** do produto Talqui AI.

### Recursos principais

- Atendimento 24h
- Respostas personalizadas
- Integração com canais

### Como usar

1. Configure o agente
2. Adicione conhecimento
3. Treine e ajuste`,
    ultimaAtualizacao: "2025-02-20T14:30:00",
    atualizadoPor: "Maria Silva",
    disponivel: true,
  },
  {
    id: "2",
    numero: 2,
    nome: "Perguntas frequentes - Suporte",
    formato: "texto",
    preview: "Como alterar minha senha? Como solicitar segunda via...",
    content: `# FAQ - Suporte

## Senha e acesso

**Como alterar minha senha?**

Acesse Configurações > Conta > Segurança.

## Segunda via

**Como solicitar segunda via do boleto?**

Acesse Faturas e clique em "Reemitir boleto".`,
    ultimaAtualizacao: "2025-02-22T09:15:00",
    atualizadoPor: "João Santos",
    disponivel: true,
  },
  {
    id: "3",
    numero: 3,
    nome: "Política de trocas e devoluções",
    formato: "texto",
    preview: "O cliente tem até 7 dias para solicitar troca ou...",
    content: `# Política de Trocas e Devoluções

O cliente tem até **7 dias** para solicitar troca ou devolução.

## Condições

- Produto em perfeitas condições
- Nota fiscal obrigatória`,
    ultimaAtualizacao: "2025-02-25T11:00:00",
    atualizadoPor: "Maria Silva",
    disponivel: true,
  },
  {
    id: "4",
    numero: 4,
    nome: "Documentação da API",
    formato: "tabela",
    preview: "Endpoints disponíveis: GET /users, POST /orders...",
    content: `# Documentação da API

Endpoints disponíveis:

| Método | Endpoint     | Descrição |
|--------|--------------|-----------|
| GET    | /users       | Lista usuários |
| POST   | /orders      | Criar pedido |`,
    ultimaAtualizacao: "2025-02-26T16:45:00",
    atualizadoPor: "Ana Costa",
    disponivel: false,
  },
  {
    id: "5",
    numero: 5,
    nome: "Catálogo de planos 2025",
    formato: "texto",
    preview: "Plano básico: R$ 99/mês. Plano profissional...",
    content: `# Catálogo de Planos 2025

- **Plano básico:** R$ 99/mês
- **Plano profissional:** R$ 199/mês
- **Plano enterprise:** Sob consulta`,
    ultimaAtualizacao: "2025-02-27T08:00:00",
    atualizadoPor: "João Santos",
    disponivel: false,
  },
];
