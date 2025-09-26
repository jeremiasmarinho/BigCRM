import axios from "axios";
import type {
  Lead,
  LeadFormData,
  ClientFormData,
  TeamFormData,
  LeadFilters,
  ClientFilters,
  LoginFormData,
  RegisterData,
  UserProfileData,
  ChangePasswordData,
} from "@/types";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Criar instância do axios com tipagem
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
});

// Adicionar interceptor de requisição para incluir token de autenticação
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Adicionar interceptor de resposta para tratar erros
api.interceptors.response.use(
  (response: any) => response.data,
  (error: any) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      // Sem permissão
      console.error("Acesso negado");
    } else if (error.response?.status >= 500) {
      // Erro do servidor
      console.error("Erro interno do servidor");
    }

    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authAPI = {
  login: async (data: LoginFormData): Promise<any> => {
    return api.post("/auth/login", data);
  },

  register: async (data: RegisterData): Promise<any> => {
    return api.post("/auth/register", data);
  },

  getProfile: async (): Promise<any> => {
    return api.get("/auth/profile");
  },

  updateProfile: async (data: UserProfileData): Promise<any> => {
    return api.put("/auth/profile", data);
  },

  changePassword: async (data: ChangePasswordData): Promise<any> => {
    return api.put("/auth/change-password", data);
  },
};

// Serviços de leads
export const leadsAPI = {
  getAll: async (filters: LeadFilters = {}): Promise<any> => {
    return api.get("/leads", { params: filters });
  },

  getById: async (id: string): Promise<any> => {
    return api.get(`/leads/${id}`);
  },

  create: async (data: LeadFormData): Promise<any> => {
    return api.post("/leads", data);
  },

  update: async (id: string, data: Partial<LeadFormData>): Promise<any> => {
    return api.put(`/leads/${id}`, data);
  },

  delete: async (id: string): Promise<any> => {
    return api.delete(`/leads/${id}`);
  },

  convert: async (id: string): Promise<any> => {
    return api.post(`/leads/${id}/convert`);
  },

  updateStatus: async (id: string, status: Lead["status"]): Promise<any> => {
    return api.patch(`/leads/${id}/status`, { status });
  },

  updatePriority: async (
    id: string,
    priority: Lead["priority"]
  ): Promise<any> => {
    return api.patch(`/leads/${id}/priority`, { priority });
  },

  addComment: async (id: string, comment: string): Promise<any> => {
    return api.post(`/leads/${id}/comments`, { content: comment });
  },

  uploadFile: async (id: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/leads/${id}/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getStats: async (): Promise<any> => {
    return api.get("/leads/stats");
  },

  search: async (term: string): Promise<any> => {
    return api.get("/leads/search", { params: { q: term } });
  },

  export: async (filters: LeadFilters = {}): Promise<Blob> => {
    const response = await api.get("/leads/export", {
      params: filters,
      responseType: "blob",
    });
    return response as any;
  },

  import: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/leads/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Serviços de clientes
export const clientsAPI = {
  getAll: async (filters: ClientFilters = {}): Promise<any> => {
    return api.get("/clients", { params: filters });
  },

  getById: async (id: string): Promise<any> => {
    return api.get(`/clients/${id}`);
  },

  create: async (data: ClientFormData): Promise<any> => {
    return api.post("/clients", data);
  },

  update: async (id: string, data: Partial<ClientFormData>): Promise<any> => {
    return api.put(`/clients/${id}`, data);
  },

  delete: async (id: string): Promise<any> => {
    return api.delete(`/clients/${id}`);
  },

  addComment: async (id: string, comment: string): Promise<any> => {
    return api.post(`/clients/${id}/comments`, { content: comment });
  },

  uploadFile: async (id: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/clients/${id}/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getStats: async (): Promise<any> => {
    return api.get("/clients/stats");
  },
};

// Serviços de equipes
export const teamsAPI = {
  getAll: async (): Promise<any> => {
    return api.get("/teams");
  },

  getById: async (id: string): Promise<any> => {
    return api.get(`/teams/${id}`);
  },

  create: async (data: TeamFormData): Promise<any> => {
    return api.post("/teams", data);
  },

  update: async (id: string, data: Partial<TeamFormData>): Promise<any> => {
    return api.put(`/teams/${id}`, data);
  },

  delete: async (id: string): Promise<any> => {
    return api.delete(`/teams/${id}`);
  },

  switchTeam: async (id: string): Promise<any> => {
    return api.post(`/teams/${id}/switch`);
  },

  inviteMember: async (id: string, email: string): Promise<any> => {
    return api.post(`/teams/${id}/invite`, { email });
  },

  removeMember: async (teamId: string, userId: string): Promise<any> => {
    return api.delete(`/teams/${teamId}/members/${userId}`);
  },
};

// Serviços de dashboard
export const dashboardAPI = {
  getStats: async (): Promise<any> => {
    return api.get("/dashboard/stats");
  },
};

// Serviços de usuários
export const usersAPI = {
  getAll: async (): Promise<any> => {
    return api.get("/users");
  },

  getById: async (id: string): Promise<any> => {
    return api.get(`/users/${id}`);
  },

  update: async (id: string, data: Partial<UserProfileData>): Promise<any> => {
    return api.put(`/users/${id}`, data);
  },

  delete: async (id: string): Promise<any> => {
    return api.delete(`/users/${id}`);
  },
};

// Utilitários de API
export const apiUtils = {
  /**
   * Constrói URL de query com filtros
   */
  buildQueryString: (params: Record<string, any>): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return searchParams.toString();
  },

  /**
   * Faz download de arquivo blob
   */
  downloadBlob: (blob: Blob, filename: string): void => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Verifica se o erro é de rede
   */
  isNetworkError: (error: any): boolean => {
    return !error.response && error.code === "NETWORK_ERROR";
  },

  /**
   * Extrai mensagem de erro da resposta
   */
  getErrorMessage: (error: any): string => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    return "Ocorreu um erro inesperado";
  },
};

// Exportar instância principal
export default api;
