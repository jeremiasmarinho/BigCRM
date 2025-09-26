import { useState, useCallback, useMemo, useEffect } from "react";
import type { LeadFilters, ClientFilters } from "@/types";

/**
 * Hook para gerenciar estado de modais
 */
export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    setIsOpen,
  };
};

/**
 * Hook para gerenciar filtros e paginação
 */
export const useFilters = <
  T extends Record<string, any> = LeadFilters | ClientFilters
>(
  initialFilters: T = {} as T
) => {
  const [filters, setFilters] = useState<T>(initialFilters);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Reset para primeira página quando filtro muda
    setPage(1);
  }, []);

  const updateFilters = useCallback((newFilters: Partial<T>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    // Reset para primeira página quando filtros mudam
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setPage(1);
  }, [initialFilters]);

  const clearFilter = useCallback(<K extends keyof T>(key: K) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setPage(1);
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((pageNumber: number) => {
    setPage(Math.max(1, pageNumber));
  }, []);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset para primeira página
  }, []);

  // Memoiza os filtros para evitar re-renders desnecessários
  const memoizedFilters = useMemo(
    () => ({
      ...filters,
      page,
      limit,
    }),
    [filters, page, limit]
  );

  return {
    filters: memoizedFilters,
    page,
    limit,
    updateFilter,
    updateFilters,
    clearFilters,
    clearFilter,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    setPage,
    setLimit,
  };
};

/**
 * Hook para gerenciar estados de loading locais
 */
export const useLocalLoading = (
  initialStates: Record<string, boolean> = {}
) => {
  const [loadingStates, setLoadingStates] =
    useState<Record<string, boolean>>(initialStates);

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: isLoading,
    }));
  }, []);

  const isLoading = useCallback(
    (key: string): boolean => {
      return loadingStates[key] || false;
    },
    [loadingStates]
  );

  const startLoading = useCallback(
    (key: string) => {
      setLoading(key, true);
    },
    [setLoading]
  );

  const stopLoading = useCallback(
    (key: string) => {
      setLoading(key, false);
    },
    [setLoading]
  );

  const toggleLoading = useCallback((key: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const clearLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  const isAnyLoading = useMemo(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  return {
    loadingStates,
    setLoading,
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    clearLoading,
    isAnyLoading,
  };
};

/**
 * Hook para gerenciar seleções múltiplas
 */
export const useSelection = <T = string>(initialSelection: T[] = []) => {
  const [selectedItems, setSelectedItems] = useState<T[]>(initialSelection);

  const selectItem = useCallback((item: T) => {
    setSelectedItems((prev) => {
      if (prev.includes(item)) {
        return prev; // Já está selecionado
      }
      return [...prev, item];
    });
  }, []);

  const unselectItem = useCallback((item: T) => {
    setSelectedItems((prev) => prev.filter((selected) => selected !== item));
  }, []);

  const toggleItem = useCallback((item: T) => {
    setSelectedItems((prev) => {
      if (prev.includes(item)) {
        return prev.filter((selected) => selected !== item);
      }
      return [...prev, item];
    });
  }, []);

  const selectAll = useCallback((items: T[]) => {
    setSelectedItems(items);
  }, []);

  const unselectAll = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const isSelected = useCallback(
    (item: T): boolean => {
      return selectedItems.includes(item);
    },
    [selectedItems]
  );

  const hasSelection = useMemo(() => {
    return selectedItems.length > 0;
  }, [selectedItems]);

  const selectionCount = useMemo(() => {
    return selectedItems.length;
  }, [selectedItems]);

  return {
    selectedItems,
    selectItem,
    unselectItem,
    toggleItem,
    selectAll,
    unselectAll,
    isSelected,
    hasSelection,
    selectionCount,
    setSelectedItems,
  };
};

/**
 * Hook para gerenciar confirmações (útil para deletar itens)
 */
export const useConfirmation = () => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  const requestConfirmation = useCallback((data?: any) => {
    setConfirmationData(data);
    setIsConfirming(true);
  }, []);

  const confirmAction = useCallback(() => {
    setIsConfirming(false);
    return confirmationData;
  }, [confirmationData]);

  const cancelConfirmation = useCallback(() => {
    setIsConfirming(false);
    setConfirmationData(null);
  }, []);

  return {
    isConfirming,
    confirmationData,
    requestConfirmation,
    confirmAction,
    cancelConfirmation,
  };
};

/**
 * Hook para gerenciar ordenação de tabelas
 */
export const useSorting = <T extends string = string>(
  initialSortBy?: T,
  initialSortOrder: "asc" | "desc" = "asc"
) => {
  const [sortBy, setSortBy] = useState<T | undefined>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);

  const updateSort = useCallback(
    (field: T) => {
      if (sortBy === field) {
        // Se já está ordenando por este campo, inverte a ordem
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        // Novo campo, ordena ascendente
        setSortBy(field);
        setSortOrder("asc");
      }
    },
    [sortBy]
  );

  const clearSort = useCallback(() => {
    setSortBy(undefined);
    setSortOrder("asc");
  }, []);

  const getSortDirection = useCallback(
    (field: T): "asc" | "desc" | undefined => {
      return sortBy === field ? sortOrder : undefined;
    },
    [sortBy, sortOrder]
  );

  const isSortedBy = useCallback(
    (field: T): boolean => {
      return sortBy === field;
    },
    [sortBy]
  );

  return {
    sortBy,
    sortOrder,
    updateSort,
    clearSort,
    getSortDirection,
    isSortedBy,
    setSortBy,
    setSortOrder,
  };
};

/**
 * Hook para debounce de valores (útil para search)
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook para gerenciar toggle de estado booleano
 */
export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue,
  };
};

/**
 * Hook para controle de visibilidade com timeout
 */
export const useVisibility = (duration: number = 5000) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const show = useCallback(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const toggle = useCallback(() => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  }, [isVisible, show, hide]);

  return {
    isVisible,
    show,
    hide,
    toggle,
    setIsVisible,
  };
};
