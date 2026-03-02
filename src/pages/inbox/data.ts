export interface SetupStep {
  id: string;
  title: string;
  description: string;
  configured: boolean;
  /** Ícone como chave (ex: 'message' | 'whatsapp') para estilo no card */
  iconType: "message" | "check";
}

/** Canal da conversa (WhatsApp, Telegram, chat do site) */
export type ConversationChannel = "whatsapp" | "telegram" | "chat-site";

/** Status da conversa na fila (aba Robô / Fila / Atendendo) */
export type ConversationStatus = "robo" | "fila" | "atendendo";

export interface Message {
  id: string;
  text: string;
  time: string; // ISO ou "HH:mm"
  fromAgent: boolean;
  senderName?: string;
  /** Mensagem à qual esta é resposta (citação) */
  replyTo?: {
    messageId: string;
    preview: string;
    senderName?: string;
  };
  /** Reações na mensagem (emoji -> quantidade) */
  reactions?: { emoji: string; count: number }[];
}

export interface Conversation {
  id: string;
  contactName: string;
  contactAvatar?: string | null;
  /** Email do contato (opcional) */
  contactEmail?: string | null;
  /** Telefone do contato (opcional) */
  contactPhone?: string | null;
  channel: ConversationChannel;
  status: ConversationStatus;
  lastMessage: {
    text: string;
    time: string;
    fromAgent: boolean;
  };
  unreadCount: number;
  messages: Message[];
  /** Atendente atribuído à conversa (opcional) */
  assignedAttendant?: {
    id: string;
    name: string;
    avatar?: string | null;
  } | null;
  /** Tags da conversa */
  tags?: string[];
}

export const SETUP_STEPS: SetupStep[] = [
  {
    id: "atalhos",
    title: "Crie atalhos para mensagens rápidas",
    description: "Agilize respostas com atalhos de teclado.",
    configured: false,
    iconType: "message",
  },
  {
    id: "whatsapp",
    title: "Instale a integração com WhatsApp",
    description: "Receba e responda conversas do WhatsApp no Talqui.",
    configured: true,
    iconType: "check",
  },
  {
    id: "telegram",
    title: "Receba mensagens do Telegram",
    description: "Conecte seu canal ou grupo do Telegram.",
    configured: true,
    iconType: "check",
  },
  {
    id: "chat-site",
    title: "Configure a janela de chat no seu site",
    description: "Adicione o widget de chat no seu site.",
    configured: true,
    iconType: "check",
  },
  {
    id: "equipe",
    title: "Adicione colegas de equipe",
    description: "Convide sua equipe para atender junto.",
    configured: true,
    iconType: "check",
  },
];

/** Conversas fictícias para testar a UI da página de conversas (Chat Inbox) */
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    contactName: "Maria Silva",
    contactAvatar: null,
    contactEmail: "maria.silva@gmail.com",
    contactPhone: "(11) 98765-4321",
    channel: "whatsapp",
    status: "fila",
    lastMessage: {
      text: "Oi! Gostaria de saber sobre os planos de assinatura.",
      time: "14:32",
      fromAgent: false,
    },
    unreadCount: 2,
    assignedAttendant: null,
    tags: [],
    messages: [
      {
        id: "m1-1",
        text: "Olá, boa tarde! Preciso de informações sobre o produto.",
        time: "14:28",
        fromAgent: false,
        senderName: "Maria Silva",
      },
      {
        id: "m1-2",
        text: "Olá Maria! Em que posso ajudar?",
        time: "14:30",
        fromAgent: true,
        senderName: "Atendente",
      },
      {
        id: "m1-3",
        text: "Oi! Gostaria de saber sobre os planos de assinatura.",
        time: "14:32",
        fromAgent: false,
        senderName: "Maria Silva",
      },
      {
        id: "m1-4",
        text: "Segue a tabela de planos que você pediu. Qualquer dúvida, estou à disposição!",
        time: "14:35",
        fromAgent: true,
        senderName: "Atendente",
        replyTo: {
          messageId: "m1-1",
          preview: "Olá, boa tarde! Preciso de informações sobre o produto.",
          senderName: "Maria Silva",
        },
      },
    ],
  },
  {
    id: "conv-2",
    contactName: "João Santos",
    contactAvatar: null,
    contactEmail: "joao.santos@empresa.com",
    contactPhone: "(21) 99876-5432",
    channel: "telegram",
    status: "atendendo",
    lastMessage: {
      text: "Perfeito, vou aguardar o retorno. Obrigado!",
      time: "14:25",
      fromAgent: false,
    },
    unreadCount: 0,
    assignedAttendant: {
      id: "att-1",
      name: "João Silva",
      avatar: null,
    },
    tags: ["vip", "pedido"],
    messages: [
      {
        id: "m2-1",
        text: "Quando meu pedido será enviado?",
        time: "14:15",
        fromAgent: false,
        senderName: "João Santos",
      },
      {
        id: "m2-2",
        text: "Seu pedido #4521 já está em separação. Previsão de envio: amanhã.",
        time: "14:18",
        fromAgent: true,
        senderName: "Atendente",
      },
      {
        id: "m2-3",
        text: "Perfeito, vou aguardar o retorno. Obrigado!",
        time: "14:25",
        fromAgent: false,
        senderName: "João Santos",
      },
    ],
  },
  {
    id: "conv-3",
    contactName: "Ana Costa",
    contactAvatar: null,
    contactEmail: "ana.costa@gmail.com",
    contactPhone: null,
    channel: "chat-site",
    status: "robo",
    lastMessage: {
      text: "Quero falar com um humano, por favor.",
      time: "14:40",
      fromAgent: false,
    },
    unreadCount: 1,
    assignedAttendant: null,
    tags: [],
    messages: [
      {
        id: "m3-1",
        text: "O robô não entendeu minha dúvida sobre garantia.",
        time: "14:35",
        fromAgent: false,
        senderName: "Ana Costa",
      },
      {
        id: "m3-2",
        text: "Você pode reformular sua pergunta? Estou aqui para ajudar.",
        time: "14:37",
        fromAgent: true,
        senderName: "Assistente",
      },
      {
        id: "m3-3",
        text: "Quero falar com um humano, por favor.",
        time: "14:40",
        fromAgent: false,
        senderName: "Ana Costa",
      },
    ],
  },
  {
    id: "conv-4",
    contactName: "Pedro Oliveira",
    contactAvatar: null,
    contactEmail: null,
    contactPhone: "(44) 99999-9999",
    channel: "whatsapp",
    status: "fila",
    lastMessage: {
      text: "Tudo bem, obrigado pela resposta rápida!",
      time: "13:55",
      fromAgent: false,
    },
    unreadCount: 0,
    assignedAttendant: null,
    tags: ["devolução"],
    messages: [
      {
        id: "m4-1",
        text: "Qual o prazo de devolução?",
        time: "13:50",
        fromAgent: false,
        senderName: "Pedro Oliveira",
      },
      {
        id: "m4-2",
        text: "O prazo para devolução é de 7 dias a partir do recebimento.",
        time: "13:52",
        fromAgent: true,
        senderName: "Atendente",
      },
      {
        id: "m4-3",
        text: "Tudo bem, obrigado pela resposta rápida!",
        time: "13:55",
        fromAgent: false,
        senderName: "Pedro Oliveira",
      },
    ],
  },
  {
    id: "conv-5",
    contactName: "Carla Mendes",
    contactAvatar: null,
    contactEmail: "carla.m@email.com",
    contactPhone: null,
    channel: "telegram",
    status: "robo",
    lastMessage: {
      text: "Como faço para rastrear meu pedido?",
      time: "14:45",
      fromAgent: false,
    },
    unreadCount: 1,
    assignedAttendant: null,
    tags: [],
    messages: [
      {
        id: "m5-1",
        text: "Como faço para rastrear meu pedido?",
        time: "14:45",
        fromAgent: false,
        senderName: "Carla Mendes",
      },
    ],
  },
  {
    id: "conv-6",
    contactName: "Lucas Ferreira",
    contactAvatar: null,
    contactEmail: "lucas.ferreira@gmail.com",
    contactPhone: "(11) 91234-5678",
    channel: "chat-site",
    status: "atendendo",
    lastMessage: {
      text: "Certo, já anotei. Até mais!",
      time: "14:20",
      fromAgent: false,
    },
    unreadCount: 0,
    assignedAttendant: {
      id: "att-2",
      name: "João Silva",
      avatar: null,
    },
    tags: ["entrega", "endereço"],
    messages: [
      {
        id: "m6-1",
        text: "Preciso alterar o endereço de entrega.",
        time: "14:10",
        fromAgent: false,
        senderName: "Lucas Ferreira",
      },
      {
        id: "m6-2",
        text: "Pode me informar o novo endereço? Atualizo aqui para você.",
        time: "14:12",
        fromAgent: true,
        senderName: "Atendente",
      },
      {
        id: "m6-3",
        text: "Rua das Flores, 100. CEP 01310-100.",
        time: "14:15",
        fromAgent: false,
        senderName: "Lucas Ferreira",
      },
      {
        id: "m6-4",
        text: "Endereço atualizado. O pedido será enviado para o novo endereço.",
        time: "14:18",
        fromAgent: true,
        senderName: "Atendente",
      },
      {
        id: "m6-5",
        text: "Certo, já anotei. Até mais!",
        time: "14:20",
        fromAgent: false,
        senderName: "Lucas Ferreira",
      },
    ],
  },
];
