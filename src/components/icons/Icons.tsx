/**
 * Ícones do projeto via Huge Icons (Stroke Rounded).
 * @see https://hugeicons.com/docs/integrations/react
 */
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Chatting01Icon,
  MailSend01Icon,
  Mail01Icon,
  Call02Icon,
  Calendar01Icon,
  BarChartIcon,
  PuzzleIcon,
  Settings01Icon,
  QuestionIcon,
  Search01Icon,
  Cancel01Icon,
  ArrowLeft01Icon,
  ArrowUp01Icon,
  ArrowLeftRightIcon,
  GlobeIcon,
  Chat01Icon,
  UserIcon,
  AddressBookIcon,
  ArrowDown01Icon,
  KeyboardIcon,
  FilterIcon,
  CheckmarkCircle01Icon,
  File01Icon,
  IdentityCardIcon,
  MoreVerticalIcon,
  EyeIcon,
  Add01Icon,
  Link01Icon,
  Upload01Icon,
  Delete01Icon,
  BookOpen01Icon,
  Tag01Icon,
  ListViewIcon,
  LayoutGridIcon,
  Edit01Icon,
  Refresh01Icon,
  AiMagicIcon,
  SmileIcon,
  Attachment01Icon,
  VoiceIcon,
  HashtagIcon,
  ReminderIcon,
  FlashIcon,
  MailReply01Icon,
  Forward01Icon,
} from "@hugeicons/core-free-icons";

const iconSize = 20;
const iconSizeSm = 16;
const iconSizeLg = 24;

export const Icons = {
  /** Mensagens / Chat */
  Chat: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Chatting01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Envio */
  Send: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={MailSend01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Agenda */
  Calendar: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Calendar01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Relatórios / Gráfico */
  Chart: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={BarChartIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Extensões / Plugin */
  Extension: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={PuzzleIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Configurações */
  Settings: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Settings01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Ajuda */
  Help: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={QuestionIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Busca */
  Search: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Search01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Fechar */
  Close: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Cancel01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Voltar */
  ArrowLeft: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={ArrowLeft01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Troca / Exchange */
  Exchange: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={ArrowLeftRightIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Site / Globe */
  Globe: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={GlobeIcon}
      size={props.size ?? iconSizeSm}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Mensagens (lista permissões) */
  ChatBubble: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Chat01Icon}
      size={props.size ?? iconSizeSm}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Contatos */
  User: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={UserIcon}
      size={props.size ?? iconSizeSm}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Contatos (agenda) */
  AddressBook: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={AddressBookIcon}
      size={props.size ?? iconSizeSm}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Chevron up (expandir) */
  ChevronUp: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={ArrowUp01Icon}
      size={props.size ?? iconSizeLg}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Chevron down (dropdown) */
  ChevronDown: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={ArrowDown01Icon}
      size={props.size ?? iconSizeLg}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Atalho de teclado */
  Keyboard: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={KeyboardIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Filtro (funil) */
  Filter: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={FilterIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Check / concluído */
  CheckCircle: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={CheckmarkCircle01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Documento / arquivo */
  Document: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={File01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Identidade / cartão */
  IdentityCard: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={IdentityCardIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Menu vertical (três pontos) */
  MoreVertical: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={MoreVerticalIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Visualizações / olho */
  Eye: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={EyeIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Mais / adicionar */
  Plus: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Add01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Link / URL */
  Link: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Link01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Upload / enviar arquivo */
  Upload: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Upload01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Deletar */
  Delete: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Delete01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Livro / conhecimento */
  BookOpen: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={BookOpen01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Visualização em lista */
  ListView: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={ListViewIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Visualização em grid / cards */
  GridView: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={LayoutGridIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Editar */
  Edit: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Edit01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Atualizar / alterar status */
  Refresh: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Refresh01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** AI / assistente inteligente */
  Ai: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={AiMagicIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** E-mail / envelope */
  Mail: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Mail01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Telefone / ligação */
  Phone: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Call02Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Tag / etiqueta */
  Tag: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Tag01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Emoji / sorriso */
  Emoji: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={SmileIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Anexar arquivo */
  Attachment: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Attachment01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Mensagem de voz / microfone */
  Voice: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={VoiceIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Ações / hashtag */
  Hashtag: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={HashtagIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Lembrete */
  Reminder: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={ReminderIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Atalhos / raio */
  Shortcut: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={FlashIcon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Responder / reply */
  Reply: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={MailReply01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
  /** Encaminhar / forward */
  Forward: (props: { size?: number; className?: string }) => (
    <HugeiconsIcon
      icon={Forward01Icon}
      size={props.size ?? iconSize}
      strokeWidth={1.5}
      className={props.className}
    />
  ),
};
