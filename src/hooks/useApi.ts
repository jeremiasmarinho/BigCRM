import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from "react-query";
import toast from "react-hot-toast";
import type { UseApiQueryOptions, UseApiMutationOptions } from "@/types";

/**
 * Hook personalizado para queries de API com React Query e TypeScript
 */
export const useApiQuery = <TData = any, TError = Error>(
  queryKey: QueryKey,
  queryFn: () => Promise<TData>,
  options: UseApiQueryOptions<TData> & UseQueryOptions<TData, TError> = {}
) => {
  const {
    onSuccess,
    onError,
    enabled = true,
    refetchOnWindowFocus = false,
    retry = 1,
    staleTime = 0,
    cacheTime = 5 * 60 * 1000, // 5 minutos
    ...restOptions
  } = options;

  return useQuery<TData, TError>(queryKey, queryFn, {
    enabled,
    refetchOnWindowFocus,
    retry,
    staleTime,
    cacheTime,
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Query error:", error);
      onError?.(error);
    },
    ...restOptions,
  });
};

/**
 * Hook para mutações com tratamento automático de erro e sucesso
 */
export const useApiMutation = <TData = any, TError = Error, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseApiMutationOptions<TData, TVariables> &
    UseMutationOptions<TData, TError, TVariables> = {}
) => {
  const queryClient = useQueryClient();

  const {
    onSuccess,
    onError,
    onSettled,
    successMessage,
    errorMessage,
    invalidateQueries = [],
    showSuccessToast = true,
    showErrorToast = true,
    ...restOptions
  } = options as any;

  return useMutation<TData, TError, TVariables>(mutationFn, {
    onSuccess: (data, variables, context) => {
      // Exibe toast de sucesso
      if (showSuccessToast && successMessage) {
        toast.success(successMessage);
      }

      // Invalida queries relacionadas
      if (invalidateQueries.length > 0) {
        invalidateQueries.forEach((queryKey: QueryKey) => {
          queryClient.invalidateQueries(queryKey);
        });
      }

      // Callback customizado
      onSuccess?.(data, variables);
    },
    onError: (error, variables, context) => {
      console.error("Mutation error:", error);

      // Exibe toast de erro
      if (showErrorToast) {
        const message = errorMessage || getErrorMessage(error);
        toast.error(message);
      }

      // Callback customizado
      onError?.(error, variables);
    },
    onSettled: (data, error, variables, context) => {
      onSettled?.(data, error, variables);
    },
    ...restOptions,
  });
};

/**
 * Hook para operações CRUD padronizadas
 */
export const useCrudOperations = <
  TData = any,
  TCreateData = any,
  TUpdateData = any
>(
  baseUrl: string,
  queryKey: QueryKey,
  options: {
    createMessage?: string;
    updateMessage?: string;
    deleteMessage?: string;
    errorMessage?: string;
  } = {}
) => {
  const {
    createMessage = "Item criado com sucesso!",
    updateMessage = "Item atualizado com sucesso!",
    deleteMessage = "Item removido com sucesso!",
  } = options;

  // Mutação para criar
  const createMutation = useApiMutation<TData, Error, TCreateData>(
    async (data: TCreateData) => {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar item");
      }

      return response.json();
    },
    {
      successMessage: createMessage,
      invalidateQueries: [queryKey],
    } as any
  );

  // Mutação para atualizar
  const updateMutation = useApiMutation<
    TData,
    Error,
    { id: string; data: TUpdateData }
  >(
    async ({ id, data }) => {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar item");
      }

      return response.json();
    },
    {
      successMessage: updateMessage,
      invalidateQueries: [queryKey],
    } as any
  );

  // Mutação para deletar
  const deleteMutation = useApiMutation<void, Error, string>(
    async (id: string) => {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao remover item");
      }
    },
    {
      successMessage: deleteMessage,
      invalidateQueries: [queryKey],
    } as any
  );

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

/**
 * Extrai mensagem de erro de diferentes tipos de erro
 */
const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
};

/**
 * Hook para query com paginação
 */
export const usePaginatedQuery = <TData = any>(
  queryKey: QueryKey,
  queryFn: (
    page: number,
    limit: number
  ) => Promise<{ data: TData[]; pagination: any }>,
  initialPage: number = 1,
  limit: number = 10,
  options: UseApiQueryOptions<{ data: TData[]; pagination: any }> = {}
) => {
  return useApiQuery(
    [...queryKey, "paginated", initialPage, limit],
    () => queryFn(initialPage, limit),
    {
      keepPreviousData: true,
      ...options,
    }
  );
};

/**
 * Hook para invalidar queries específicas
 */
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = (queryKeys: QueryKey[]) => {
    queryKeys.forEach((queryKey) => {
      queryClient.invalidateQueries(queryKey);
    });
  };

  const refetchQueries = (queryKeys: QueryKey[]) => {
    queryKeys.forEach((queryKey) => {
      queryClient.refetchQueries(queryKey);
    });
  };

  const removeQueries = (queryKeys: QueryKey[]) => {
    queryKeys.forEach((queryKey) => {
      queryClient.removeQueries(queryKey);
    });
  };

  return {
    invalidateQueries,
    refetchQueries,
    removeQueries,
  };
};

/**
 * Hook para prefetch de dados (útil para otimizações)
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchQuery = <TData = any>(
    queryKey: QueryKey,
    queryFn: () => Promise<TData>,
    options: UseQueryOptions<TData> = {}
  ) => {
    return queryClient.prefetchQuery(queryKey, queryFn, {
      staleTime: 10 * 60 * 1000, // 10 minutos
      ...options,
    });
  };

  return { prefetchQuery };
};
