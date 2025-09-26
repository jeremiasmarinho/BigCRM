import { useMemo, useState, useEffect } from "react";
import { useApiQuery, useApiMutation } from "./useApi";
import { leadsAPI } from "../services/api";
import type {
  Lead,
  LeadFilters,
  LeadFormData,
  PaginatedResponse,
} from "@/types";

/**
 * Hook principal para operações com leads
 */
export const useLeads = (filters: LeadFilters = {}) => {
  // Query para buscar leads com filtros
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useApiQuery<PaginatedResponse<Lead>>(
    ["leads", filters],
    () => leadsAPI.getAll(filters),
    {
      keepPreviousData: true,
      staleTime: 30 * 1000, // 30 segundos
    }
  );

  // Dados extraídos da resposta
  const leads = useMemo(() => response?.data || [], [response]);
  const pagination = useMemo(() => response?.pagination, [response]);

  return {
    leads,
    pagination,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook para buscar um lead específico
 */
export const useLead = (leadId: string | null) => {
  return useApiQuery<Lead>(["leads", leadId], () => leadsAPI.getById(leadId!), {
    enabled: !!leadId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para criar lead
 */
export const useCreateLead = () => {
  return useApiMutation<Lead, Error, LeadFormData>(
    (leadData: LeadFormData) => leadsAPI.create(leadData),
    {
      successMessage: "Lead criado com sucesso!",
      invalidateQueries: [["leads"]],
      showSuccessToast: true,
      showErrorToast: true,
    } as any
  );
};

/**
 * Hook para atualizar lead
 */
export const useUpdateLead = () => {
  return useApiMutation<
    Lead,
    Error,
    { id: string; data: Partial<LeadFormData> }
  >(({ id, data }) => leadsAPI.update(id, data), {
    successMessage: "Lead atualizado com sucesso!",
    invalidateQueries: [["leads"]],
    showSuccessToast: true,
    showErrorToast: true,
  } as any);
};

/**
 * Hook para deletar lead
 */
export const useDeleteLead = () => {
  return useApiMutation<void, Error, string>(
    (leadId: string) => leadsAPI.delete(leadId),
    {
      successMessage: "Lead removido com sucesso!",
      invalidateQueries: [["leads"]],
      showSuccessToast: true,
      showErrorToast: true,
    } as any
  );
};

/**
 * Hook para converter lead em cliente
 */
export const useConvertLead = () => {
  return useApiMutation<any, Error, string>(
    (leadId: string) => leadsAPI.convert(leadId),
    {
      successMessage: "Lead convertido em cliente com sucesso!",
      invalidateQueries: [["leads"], ["clients"]],
      showSuccessToast: true,
      showErrorToast: true,
    } as any
  );
};

/**
 * Hook para adicionar comentário ao lead
 */
export const useAddLeadComment = () => {
  return useApiMutation<any, Error, { leadId: string; comment: string }>(
    ({ leadId, comment }) => leadsAPI.addComment(leadId, comment),
    {
      successMessage: "Comentário adicionado com sucesso!",
      invalidateQueries: [["leads"]],
      showSuccessToast: true,
      showErrorToast: true,
    } as any
  );
};

/**
 * Hook para upload de arquivo do lead
 */
export const useUploadLeadFile = () => {
  return useApiMutation<any, Error, { leadId: string; file: File }>(
    ({ leadId, file }) => leadsAPI.uploadFile(leadId, file),
    {
      successMessage: "Arquivo enviado com sucesso!",
      invalidateQueries: [["leads"]],
      showSuccessToast: true,
      showErrorToast: true,
    } as any
  );
};

/**
 * Hook para atualizar status do lead
 */
export const useUpdateLeadStatus = () => {
  return useApiMutation<Lead, Error, { id: string; status: Lead["status"] }>(
    ({ id, status }) => leadsAPI.updateStatus(id, status),
    {
      successMessage: "Status atualizado com sucesso!",
      invalidateQueries: [["leads"]],
      showSuccessToast: true,
      showErrorToast: true,
    } as any
  );
};

/**
 * Hook para atualizar prioridade do lead
 */
export const useUpdateLeadPriority = () => {
  return useApiMutation<
    Lead,
    Error,
    { id: string; priority: Lead["priority"] }
  >(({ id, priority }) => leadsAPI.updatePriority(id, priority), {
    successMessage: "Prioridade atualizada com sucesso!",
    invalidateQueries: [["leads"]],
    showSuccessToast: true,
    showErrorToast: true,
  } as any);
};

/**
 * Hook combinado para operações mais comuns com leads
 */
export const useLeadOperations = () => {
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();
  const convertMutation = useConvertLead();

  return {
    // Funções
    createLead: createMutation.mutate,
    updateLead: updateMutation.mutate,
    deleteLead: deleteMutation.mutate,
    convertLead: convertMutation.mutate,

    // Estados
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    isConverting: convertMutation.isLoading,

    // Mutations completas (para casos avançados)
    createMutation,
    updateMutation,
    deleteMutation,
    convertMutation,
  };
};

/**
 * Hook para estatísticas de leads
 */
export const useLeadStats = () => {
  return useApiQuery<{
    total: number;
    byStatus: Record<Lead["status"], number>;
    byPriority: Record<Lead["priority"], number>;
    conversionRate: number;
    averageValue: number;
  }>(["leads", "stats"], () => leadsAPI.getStats(), {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para busca de leads com debounce
 */
export const useLeadSearch = (searchTerm: string, delay: number = 300) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return useApiQuery<Lead[]>(
    ["leads", "search", debouncedSearchTerm],
    () => leadsAPI.search(debouncedSearchTerm),
    {
      enabled: debouncedSearchTerm.length >= 2, // Só busca com 2+ caracteres
      staleTime: 30 * 1000, // 30 segundos
    }
  );
};

/**
 * Hook para exportar leads
 */
export const useExportLeads = () => {
  return useApiMutation<Blob, Error, LeadFilters>(
    (filters: LeadFilters) => leadsAPI.export(filters),
    {
      successMessage: "Leads exportados com sucesso!",
      showSuccessToast: true,
      showErrorToast: true,
    } as any
  );
};

/**
 * Hook para importar leads
 */
export const useImportLeads = () => {
  return useApiMutation<any, Error, File>(
    (file: File) => leadsAPI.import(file),
    {
      successMessage: "Leads importados com sucesso!",
      invalidateQueries: [["leads"]],
      showSuccessToast: true,
      showErrorToast: true,
    } as any
  );
};
