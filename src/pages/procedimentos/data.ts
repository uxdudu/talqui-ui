export type ProcedureTipo = "conversacional" | "automacao";
export type ProcedureEstado = "todas_respostas" | "sob_consulta";
export type ProcedureCategoria =
  | "comercial_vendas"
  | "financeiro"
  | "conhecimentos_gerais"
  | "suporte_tecnico";
export type ProcedureHabilidade =
  | "verificar_horario"
  | "transferir_atendimento"
  | "listar_horarios"
  | "agendar_reuniao"
  | "criar_tag";

/** Snapshot de uma versão publicada do procedimento */
export interface ProcedureVersao {
  versao: number;
  title: string;
  content: string;
  tipo: ProcedureTipo;
  estado: ProcedureEstado;
  categoria: ProcedureCategoria;
  habilidades: ProcedureHabilidade[];
  knowledgeIds: string[];
  /** Data da publicação (ISO) */
  createdAt: string;
}

export interface Procedure {
  id: string;
  title: string;
  trigger: string;
  /** Conteúdo em Markdown */
  content: string;
  tipo: ProcedureTipo;
  estado: ProcedureEstado;
  categoria: ProcedureCategoria;
  habilidades: ProcedureHabilidade[];
  /** IDs dos conhecimentos vinculados */
  knowledgeIds: string[];
  skillsCount: number;
  frequency: number;
  titleBadge?: "star" | "arrow";
  /** Versão atual (incrementa ao publicar) */
  versao: number;
  /** Se está publicado ou em rascunho */
  publicado: boolean;
  /** Histórico de versões publicadas (a em uso é a de maior versao quando publicado) */
  versoes: ProcedureVersao[];
}

const defaultContent = `Descreva o procedimento e como o agente deve agir em cada etapa.`;

export const PROCEDURES: Procedure[] = [
  { id: "1", title: "Agendamento", trigger: "Ao envio de qualquer mensagem", content: defaultContent, tipo: "conversacional", estado: "todas_respostas", categoria: "comercial_vendas", habilidades: ["agendar_reuniao", "listar_horarios"], knowledgeIds: [], skillsCount: 1, frequency: 0, versao: 1, publicado: true, versoes: [] },
  { id: "2", title: "Horário de atendimento", trigger: "Início de conversa - saudação", content: defaultContent, tipo: "conversacional", estado: "todas_respostas", categoria: "conhecimentos_gerais", habilidades: ["verificar_horario", "listar_horarios"], knowledgeIds: [], skillsCount: 2, frequency: 249, versao: 2, publicado: true, versoes: [] },
  { id: "3", title: "Identificação", trigger: "Início de conversa - saudação", content: defaultContent, tipo: "conversacional", estado: "todas_respostas", categoria: "comercial_vendas", habilidades: [], knowledgeIds: [], skillsCount: 1, frequency: 86, versao: 1, publicado: true, versoes: [] },
  { id: "4", title: "Instruções gerais", trigger: "Ao envio de qualquer mensagem", content: defaultContent, tipo: "conversacional", estado: "todas_respostas", categoria: "conhecimentos_gerais", habilidades: [], knowledgeIds: [], skillsCount: 1, frequency: 0, versao: 1, publicado: false, versoes: [] },
  { id: "5", title: "Apresentação", trigger: "Início de conversa - saudação", content: defaultContent, tipo: "conversacional", estado: "todas_respostas", categoria: "conhecimentos_gerais", habilidades: [], knowledgeIds: [], skillsCount: 1, frequency: 0, versao: 1, publicado: true, versoes: [] },
  { id: "6", title: "Boleto ou 2ª Via", trigger: "Contato pede segunda via e fatura - Contato quer o boleto - Contato quer pagar fatura", content: defaultContent, tipo: "automacao", estado: "sob_consulta", categoria: "financeiro", habilidades: [], knowledgeIds: ["1", "2"], skillsCount: 2, frequency: 0, versao: 1, publicado: true, versoes: [] },
  { id: "7", title: "Créditos", trigger: "Ao envio de qualquer mensagem", content: defaultContent, tipo: "conversacional", estado: "todas_respostas", categoria: "financeiro", habilidades: [], knowledgeIds: [], skillsCount: 1, frequency: 0, versao: 1, publicado: true, versoes: [] },
  { id: "8", title: "Integração ISP", trigger: "Ao envio de qualquer mensagem", content: defaultContent, tipo: "automacao", estado: "sob_consulta", categoria: "suporte_tecnico", habilidades: [], knowledgeIds: [], skillsCount: 1, frequency: 0, versao: 1, publicado: false, versoes: [] },
  { id: "9", title: "Nota fiscal", trigger: "Ao envio de qualquer mensagem", content: defaultContent, tipo: "conversacional", estado: "todas_respostas", categoria: "financeiro", habilidades: [], knowledgeIds: [], skillsCount: 1, frequency: 0, versao: 1, publicado: true, versoes: [] },
  { id: "10", title: "Onboarding", trigger: "Início de conversa - saudação", content: defaultContent, tipo: "conversacional", estado: "todas_respostas", categoria: "comercial_vendas", habilidades: [], knowledgeIds: [], skillsCount: 1, frequency: 0, versao: 1, publicado: true, versoes: [] },
  { id: "11", title: "Planos e Preços", trigger: "Ao envio de qualquer mensagem", content: defaultContent, tipo: "conversacional", estado: "todas_respostas", categoria: "comercial_vendas", habilidades: ["agendar_reuniao"], knowledgeIds: ["5"], skillsCount: 2, frequency: 0, versao: 1, publicado: true, versoes: [] },
  { id: "12", title: "Suporte técnico", trigger: "Ao envio de qualquer mensagem", content: defaultContent, tipo: "conversacional", estado: "sob_consulta", categoria: "suporte_tecnico", habilidades: ["transferir_atendimento"], knowledgeIds: [], skillsCount: 1, frequency: 0, versao: 1, publicado: true, versoes: [] },
  { id: "13", title: "Transbordo Alison", trigger: "Ao envio de qualquer mensagem", content: defaultContent, tipo: "automacao", estado: "sob_consulta", categoria: "suporte_tecnico", habilidades: ["transferir_atendimento"], knowledgeIds: [], skillsCount: 1, frequency: 0, versao: 1, publicado: true, versoes: [] },
  { id: "14", title: "Transferências", trigger: "Ao envio de qualquer mensagem", content: defaultContent, tipo: "conversacional", estado: "todas_respostas", categoria: "suporte_tecnico", habilidades: ["transferir_atendimento"], knowledgeIds: [], skillsCount: 1, frequency: 0, versao: 1, publicado: true, versoes: [] },
];

export const PROCEDURE_TIPOS: { value: ProcedureTipo; label: string }[] = [
  { value: "conversacional", label: "Conversacional" },
  { value: "automacao", label: "Automação" },
];

export const PROCEDURE_ESTADOS: { value: ProcedureEstado; label: string }[] = [
  { value: "todas_respostas", label: "Em todas as respostas" },
  { value: "sob_consulta", label: "Apenas sob consulta" },
];

export const PROCEDURE_CATEGORIAS: { value: ProcedureCategoria; label: string }[] = [
  { value: "comercial_vendas", label: "Comercial e vendas" },
  { value: "financeiro", label: "Financeiro" },
  { value: "conhecimentos_gerais", label: "Conhecimentos gerais" },
  { value: "suporte_tecnico", label: "Suporte técnico" },
];

export const PROCEDURE_HABILIDADES: {
  value: ProcedureHabilidade;
  label: string;
  description: string;
}[] = [
  {
    value: "verificar_horario",
    label: "Verificar horário",
    description: "Permite ao agente consultar o horário de atendimento da empresa e informar ao cliente em quais dias e horários a equipe está disponível.",
  },
  {
    value: "transferir_atendimento",
    label: "Transferir atendimento",
    description: "Transfere a conversa para um atendente humano quando o agente identifica que não consegue resolver sozinho ou quando o cliente solicita.",
  },
  {
    value: "listar_horarios",
    label: "Listar horários disponíveis",
    description: "Exibe os slots de horário disponíveis para agendamentos, permitindo que o cliente escolha o melhor momento para atendimento ou reunião.",
  },
  {
    value: "agendar_reuniao",
    label: "Agendar reunião",
    description: "Cria e confirma agendamentos de reuniões, integrando com a agenda e enviando lembretes ao cliente e à equipe.",
  },
  {
    value: "criar_tag",
    label: "Criar tag",
    description: "Adiciona etiquetas ao contato ou à conversa para categorização, segmentação e organização do histórico de atendimento.",
  },
];
