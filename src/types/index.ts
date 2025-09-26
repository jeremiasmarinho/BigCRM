// Tipos globais do sistema
export interface User {
  _id: string;
  name: string;
  email: string;
  team?: Team;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  _id: string;
  name: string;
  description?: string;
  members: User[];
  owner: User;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status: LeadStatus;
  priority: LeadPriority;
  source?: string;
  value?: number;
  notes?: string;
  lastContact?: string;
  nextContact?: string;
  tags?: string[];
  assignedTo?: User;
  team: Team;
  comments?: Comment[];
  files?: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  value: number;
  status: ClientStatus;
  convertedFrom?: Lead;
  assignedTo?: User;
  team: Team;
  comments?: Comment[];
  files?: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface FileAttachment {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedBy: User;
  createdAt: string;
}

// Enums
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";
export type LeadPriority = "low" | "medium" | "high" | "urgent";
export type ClientStatus = "active" | "inactive" | "churned";

// Dashboard types
export interface DashboardStats {
  totalLeads: number;
  totalClients: number;
  conversionRate: number;
  totalRevenue: number;
  leadsThisMonth: number;
  clientsThisMonth: number;
  revenueThisMonth: number;
  averageDealValue: number;
  leadsByStatus: Array<{
    status: LeadStatus;
    count: number;
  }>;
  leadsByPriority: Array<{
    priority: LeadPriority;
    count: number;
  }>;
  recentLeads: Lead[];
  recentClients: Client[];
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
}

// Auth types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginFormData) => Promise<any>;
  register: (userData: RegisterData) => Promise<any>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginFormData {
  login: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form types
export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status: LeadStatus;
  priority: LeadPriority;
  source?: string;
  value?: number;
  notes?: string;
  lastContact?: string;
  nextContact?: string;
  tags?: string[];
}

export interface ClientFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  value: number;
  status: ClientStatus;
}

export interface TeamFormData {
  name: string;
  description?: string;
}

export interface UserProfileData {
  name: string;
  email: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Filter and search types
export interface LeadFilters {
  status?: LeadStatus;
  priority?: LeadPriority;
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
}

export interface ClientFilters {
  status?: ClientStatus;
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
}

// UI Component types
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "outline"
    | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// Hook types
export interface UseApiQueryOptions<T = any> {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number | boolean;
  staleTime?: number;
  cacheTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseApiMutationOptions<T = any, V = any> {
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: Error, variables: V) => void;
  onSettled?: (data: T | undefined, error: Error | null, variables: V) => void;
}

// Utility types
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

// Event types
export type FormSubmitHandler<T> = (data: T) => void | Promise<void>;
export type FormChangeHandler<T> = (field: keyof T, value: any) => void;

// Error types
export interface ApiError extends Error {
  response?: {
    data: {
      message: string;
      errors?: Array<{
        field: string;
        message: string;
      }>;
    };
    status: number;
  };
  status?: number;
}

// Constants
export const LEAD_STATUS_OPTIONS: SelectOption<LeadStatus>[] = [
  { value: "new", label: "Novo" },
  { value: "contacted", label: "Contatado" },
  { value: "qualified", label: "Qualificado" },
  { value: "proposal", label: "Proposta" },
  { value: "negotiation", label: "Negociação" },
  { value: "won", label: "Conquistado" },
  { value: "lost", label: "Perdido" },
];

export const LEAD_PRIORITY_OPTIONS: SelectOption<LeadPriority>[] = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

export const CLIENT_STATUS_OPTIONS: SelectOption<ClientStatus>[] = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
  { value: "churned", label: "Cancelado" },
];
