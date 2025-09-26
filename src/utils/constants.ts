import type { LeadStatus, LeadPriority, SelectOption } from "@/types";

/**
 * Constantes para status e prioridades com tipagem estrita
 */
export const LEAD_STATUS = {
  NEW: "new",
  CONTACTED: "contacted",
  QUALIFIED: "qualified",
  PROPOSAL: "proposal",
  NEGOTIATION: "negotiation",
  WON: "won",
  LOST: "lost",
} as const;

export const LEAD_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

/**
 * Labels traduzidos para status
 */
export const STATUS_LABELS: Record<LeadStatus, string> = {
  [LEAD_STATUS.NEW]: "Novo",
  [LEAD_STATUS.CONTACTED]: "Contatado",
  [LEAD_STATUS.QUALIFIED]: "Qualificado",
  [LEAD_STATUS.PROPOSAL]: "Proposta",
  [LEAD_STATUS.NEGOTIATION]: "Negociação",
  [LEAD_STATUS.WON]: "Conquistado",
  [LEAD_STATUS.LOST]: "Perdido",
};

/**
 * Labels traduzidos para prioridades
 */
export const PRIORITY_LABELS: Record<LeadPriority, string> = {
  [LEAD_PRIORITY.LOW]: "Baixa",
  [LEAD_PRIORITY.MEDIUM]: "Média",
  [LEAD_PRIORITY.HIGH]: "Alta",
  [LEAD_PRIORITY.URGENT]: "Urgente",
};

/**
 * Classes CSS para badges de status
 */
export const STATUS_BADGE_CLASSES: Record<LeadStatus, string> = {
  [LEAD_STATUS.NEW]: "badge-new",
  [LEAD_STATUS.CONTACTED]: "badge-contacted",
  [LEAD_STATUS.QUALIFIED]: "badge-qualified",
  [LEAD_STATUS.PROPOSAL]: "badge-proposal",
  [LEAD_STATUS.NEGOTIATION]: "badge-negotiation",
  [LEAD_STATUS.WON]: "badge-won",
  [LEAD_STATUS.LOST]: "badge-lost",
};

/**
 * Classes CSS para badges de prioridade
 */
export const PRIORITY_BADGE_CLASSES: Record<LeadPriority, string> = {
  [LEAD_PRIORITY.LOW]: "badge-low",
  [LEAD_PRIORITY.MEDIUM]: "badge-medium",
  [LEAD_PRIORITY.HIGH]: "badge-high",
  [LEAD_PRIORITY.URGENT]: "badge-urgent",
};

/**
 * Opções para select de status
 */
export const STATUS_OPTIONS: SelectOption<LeadStatus>[] = [
  { value: LEAD_STATUS.NEW, label: STATUS_LABELS[LEAD_STATUS.NEW] },
  { value: LEAD_STATUS.CONTACTED, label: STATUS_LABELS[LEAD_STATUS.CONTACTED] },
  { value: LEAD_STATUS.QUALIFIED, label: STATUS_LABELS[LEAD_STATUS.QUALIFIED] },
  { value: LEAD_STATUS.PROPOSAL, label: STATUS_LABELS[LEAD_STATUS.PROPOSAL] },
  {
    value: LEAD_STATUS.NEGOTIATION,
    label: STATUS_LABELS[LEAD_STATUS.NEGOTIATION],
  },
  { value: LEAD_STATUS.WON, label: STATUS_LABELS[LEAD_STATUS.WON] },
  { value: LEAD_STATUS.LOST, label: STATUS_LABELS[LEAD_STATUS.LOST] },
];

/**
 * Opções para select de prioridade
 */
export const PRIORITY_OPTIONS: SelectOption<LeadPriority>[] = [
  { value: LEAD_PRIORITY.LOW, label: PRIORITY_LABELS[LEAD_PRIORITY.LOW] },
  { value: LEAD_PRIORITY.MEDIUM, label: PRIORITY_LABELS[LEAD_PRIORITY.MEDIUM] },
  { value: LEAD_PRIORITY.HIGH, label: PRIORITY_LABELS[LEAD_PRIORITY.HIGH] },
  { value: LEAD_PRIORITY.URGENT, label: PRIORITY_LABELS[LEAD_PRIORITY.URGENT] },
];

/**
 * Cores para badges de status (Tailwind classes)
 */
export const STATUS_COLORS: Record<
  LeadStatus,
  { bg: string; text: string; dot: string }
> = {
  [LEAD_STATUS.NEW]: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
  },
  [LEAD_STATUS.CONTACTED]: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    dot: "bg-yellow-500",
  },
  [LEAD_STATUS.QUALIFIED]: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    dot: "bg-purple-500",
  },
  [LEAD_STATUS.PROPOSAL]: {
    bg: "bg-indigo-100",
    text: "text-indigo-800",
    dot: "bg-indigo-500",
  },
  [LEAD_STATUS.NEGOTIATION]: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    dot: "bg-orange-500",
  },
  [LEAD_STATUS.WON]: {
    bg: "bg-green-100",
    text: "text-green-800",
    dot: "bg-green-500",
  },
  [LEAD_STATUS.LOST]: {
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-500",
  },
};

/**
 * Cores para badges de prioridade (Tailwind classes)
 */
export const PRIORITY_COLORS: Record<
  LeadPriority,
  { bg: string; text: string; dot: string }
> = {
  [LEAD_PRIORITY.LOW]: {
    bg: "bg-gray-100",
    text: "text-gray-800",
    dot: "bg-gray-500",
  },
  [LEAD_PRIORITY.MEDIUM]: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
  },
  [LEAD_PRIORITY.HIGH]: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    dot: "bg-orange-500",
  },
  [LEAD_PRIORITY.URGENT]: {
    bg: "bg-red-100",
    text: "text-red-800",
    dot: "bg-red-500",
  },
};

/**
 * Configurações de paginação
 */
export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  SHOW_PAGES: 5,
} as const;

/**
 * Mensagens de erro padrão
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "Este campo é obrigatório",
  INVALID_EMAIL: "Email inválido",
  PASSWORD_MIN_LENGTH: "Senha deve ter pelo menos 6 caracteres",
  PASSWORDS_NOT_MATCH: "Senhas não coincidem",
  NETWORK_ERROR: "Erro de conexão. Tente novamente.",
  UNAUTHORIZED: "Sessão expirada. Faça login novamente.",
  FORBIDDEN: "Você não tem permissão para esta ação.",
  NOT_FOUND: "Recurso não encontrado.",
  SERVER_ERROR: "Erro interno do servidor.",
} as const;

/**
 * Configurações da API
 */
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

/**
 * Tipos de arquivo permitidos para upload
 */
const IMAGES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
const DOCUMENTS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

export const ALLOWED_FILE_TYPES = {
  IMAGES,
  DOCUMENTS,
  ALL: [...IMAGES, ...DOCUMENTS],
} as const;

/**
 * Tamanhos máximos de arquivo (em bytes)
 */
export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
} as const;
